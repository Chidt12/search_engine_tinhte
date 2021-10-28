import axios from "axios";
import { Router } from "express"
import cheerio from "cheerio";
import multer from "multer";
import { time } from "console";
import { PostModel } from "../../../models/post/post";
import { SolrInstance } from "../../../services/solr/engine";

export default (route: Router) => {
    route.post('/scraping',
        multer({}).fields([]), async (req, res) => {
            const { page } = req.body;

            const url = page ? `https://tinhte.vn/forums/thong-tin-cong-nghe.10/page-${page}` : `https://tinhte.vn/forums/thong-tin-cong-nghe.10/`
            const domain = "https://tinhte.vn/";

            try {
                const response = await axios.get(url);
                const $ = cheerio.load(response.data);

                const links: { url: string, origin_id: string }[] = [];
                $(".discussionList .discussionListItem").each((index, element) => {
                    const link = $(element).find(".PreviewTooltip").attr('href');
                    const id = $(element).attr("id");

                    if (link) {
                        links.push({
                            url: link,
                            origin_id: id
                        });
                    }
                });



                for (let index = 0; index < links.length; index++) {
                    const data_exist = await PostModel.findOne({ where: { origin_id: links[index].origin_id } });
                    if (data_exist) continue;

                    var link = domain + links[index].url;
                    try {
                        var crawl_res = await axios.get(link);

                        if (crawl_res.status == 200 && crawl_res.data) {
                            var crawl_$ = cheerio.load(crawl_res.data);

                            var author_avatar_tag = crawl_$(".info .avatar").css('background-image');
                            var author_avatar = author_avatar_tag.replace('url(', '').replace(')', '').replace(/\"/gi, "");

                            var name = crawl_$(".thread-title").text();
                            var author_name = crawl_$(".info .author-name a").text();
                            var cover_image = crawl_$(".thread-cover img").attr("src");
                            var content = crawl_$("article.content").html();
                            var parent_category = crawl_$(".forums .label").first().text();
                            var category = crawl_$(".forums .label").first().next().text();

                            var object = {
                                origin_id: links[index].origin_id,
                                crawl_link: link,
                                name: name,
                                author_avatar: author_avatar,
                                author_name: author_name,
                                cover_image: cover_image,
                                content: content,
                                parent_category: parent_category,
                                category: category,
                                crawl_date: time()
                            }

                            var post = await PostModel.saveObject(object);

                            await SolrInstance.update(post, PostModel.COLLECTION);

                            console.log(post.id)
                        }
                    }
                    catch (e) {
                        console.log(`ERR___${link}`)
                    }
                }
                console.log("========== END ================= page " + page)

                return res.status(200).send({
                    next_page: page ? Number(page) + 1 : 2,
                    url: url,
                    next_url: `https://tinhte.vn/forums/thong-tin-cong-nghe.10/page-${page ? Number(page) + 1 : 2}`,
                    continue: true
                });

            }
            catch (e) {
                console.log(url);
                console.log(e);

                return res.status(200).send({
                    next_page: page ? Number(page) + 1 : 2,
                    url: url,
                    continue: false
                });
            }
        })
}