import { Router } from "express"
import multer from "multer";
import { PostModel } from "../../../models/post/post";
import { SolrInstance } from "../../../services/solr/engine";
import { QueryBuilder } from "../../../services/solr/querybuilder";
import { removeVietnameseTones } from "../../../utils/helper";

export default (route: Router) => {
    route.post('/list', multer({}).fields([]), async (req, res) => {
        const { page, q } = req.body;

        var solr_node = SolrInstance.get(PostModel.COLLECTION);
        var query_builder = new QueryBuilder(solr_node);

        var sortable = true;

        if (q && q != '') {
            const search = removeVietnameseTones(q);
            query_builder.setQueryParam({
                or2: {
                    or: {
                        name: `${search}`,
                        origin_name: q,
                        content: `${search}`,
                        origin_content: q,
                        author_name: q
                    }
                }
            });
            sortable = false;
        }

        var solr_data = await query_builder.paginate(page, 20).get();
        var posts =  solr_data.response.docs.map((e: any) => e);
        var post_num = solr_data.response.numFound;
        var q_time = solr_data.responseHeader.QTime;
        return res.status(200).send({
            posts: posts,
            post_num: post_num,
            q_time: q_time
        });
    })
}