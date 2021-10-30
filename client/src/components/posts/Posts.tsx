import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAsync, useThrottle } from 'react-use';
import Fetch from 'src/services/Fetch';

//@ts-ignore
import ReactHtmlParser from 'react-html-parser';

type Post = {
    id: string,
    origin_id: string,
    name: string,
    origin_name: string,
    author_name: string,
    author_avatar: string,
    crawl_link: string,
    content: string,
    origin_content: string,
    parent_category: string,
    category: string,
    origin_parent_category: string,
    origin_category: string
}

const Posts = () => {

    const [search, setSearch] = useState('');
    const throttled = useThrottle(search.trimRight().trimLeft(), 800);
    const [page, setPage] = useState(1);

    const [change_key_words, setChangeKeyWords] = useState(false);

    const state = useAsync(async () => {
        const res = await Fetch.post<{
            posts: Post[],
            post_num: number,
            q_time: number
        }>("/api/posts/list", {
            page: change_key_words ? 1 : page,
            q: throttled
        })

        if (change_key_words) {
            setPage(1);
            setChangeKeyWords(false);
        }

        var page_list: number[] = [];
        for (let index = 0; index < Math.ceil(res.data.post_num / 20); index++) {
            page_list.push(index);
        }

        return {
            posts: res.data.posts,
            post_num: res.data.post_num,
            q_time: res.data.q_time,
            page_list: page_list
        }

    }, [throttled, page])

    const onChangeSearchText = (value: string)=> {
        setSearch(value);
        setChangeKeyWords(true);
    }

    return (<>
        <div className="flex justify-center">
            <Link to="/scraping" className="underline hover:text-gray-700">Scraping Data</Link>
        </div>
        <div className="w-full flex flex-wrap mt-5">
            <div className="w-full md:w-3/4 lg:w-2/3 mx-auto px-5">


                <div className="w-full">
                    <input type="text" placeholder="Key words..." onChange={(e)=> onChangeSearchText(e.target.value)}
                        className="w-full outline-none focus:outline-none border-2 border-black rounded-md px-5 py-1.5" />
                </div>

                <div className="w-full">
                    {state.loading ? (<>
                        {[1, 2, 3].map((x, index) => (
                            <div key={index} className="border border-gray-50 shadow rounded-md p-4 mt-5 w-full mx-auto">
                                <div className="animate-pulse flex space-x-4">
                                    <div className="rounded-full bg-gray-200 h-12 w-12"></div>
                                    <div className="flex-1 space-y-4 py-1">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="space-y-2">
                                            <div className="h-4 bg-gray-200 rounded"></div>
                                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </>) : (<>
                        {state.value && (<>
                            <div className="flex justify-between mt-3">
                                <h3 className="font-semibold">{state.value.post_num} kết quả</h3>
                                <h3 className="font-semibold">Thời gian tìm kiếm: {state.value.q_time} ms</h3>
                            </div>
                            <div className="overflow-y-scroll w-full flex mt-3">
                                {state.value.page_list.map((index) => (
                                    <div 
                                    onClick={()=> setPage(index + 1)}
                                    className={`
                                     ${index + 1 == page ? "bg-opacity-100" : "bg-opacity-50"}
                                    mr-2 mb-3 h-9 w-9 flex-shrink-0 cursor-pointer flex justify-center items-center bg-black text-white rounded font-medium`}>
                                        {index + 1}
                                    </div>
                                ))}
                            </div>
                            {state.value.posts.map((post, index) => {
                                return (
                                    <a href={post.crawl_link} target="_blank" key={index} className="block border border-gray-50 shadow rounded-md p-4 mt-5 w-full mx-auto">
                                        <div className="flex space-x-4">
                                            <div
                                                style={{ backgroundImage: `url("${post.author_avatar}")` }}
                                                className="rounded-full flex-shrink-0 bg-gray-200 h-12 w-12 bg-cover bg-center"></div>
                                            <div className="flex-1">
                                                <div className="">
                                                    <h3 className="font-medium text-lg">{post.origin_name}</h3>
                                                </div>
                                                <div>
                                                    {/* <p className="line-clamp-3 text-gray-500">{ReactHtmlParser(post.origin_content)}</p> */}
                                                </div>
                                            </div>
                                        </div>
                                    </a>
                                )
                            })}
                        </>)}
                    </>)}
                </div>
            </div>
        </div>
    </>)
}

export default Posts;