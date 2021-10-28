import { useState } from "react";
import { Link } from "react-router-dom";
import Fetch from "src/services/Fetch";
import { AiOutlineLoading3Quarters } from 'react-icons/ai'
const default_url = "https://tinhte.vn/forums/thong-tin-cong-nghe.10/page-1";
const Scraping = () => {

    const [done_links, setDoneLinks] = useState<string[]>([default_url]);
    const [on_loading, setOnLoading] = useState(false);
    const [next_url, setNextUrl] = useState(default_url);
    const [current_page, setCurrentPage] = useState(1)
    const [error, setError] = useState("");

    const onSubmit = async (page?: number, links?: string[]) => {
        setError("");
        if (on_loading) return;
        setOnLoading(true);
        const res = await Fetch.post<{
            next_page: number,
            url: string,
            continue: boolean,
            next_url: string
        }>("/api/posts/scraping", {
            page: page
        });

        if (res.status == 200) {
            if (res.data.continue) {
                setNextUrl(res.data.next_url);
                setDoneLinks(links ? links : []);

                if (links) {
                    if (links.length > 500) {
                        await onSubmit(res.data.next_page, [res.data.next_url, ...links.slice(0, 100)]);
                    }
                    else {
                        await onSubmit(res.data.next_page, [res.data.next_url, ...links]);
                    }
                }
                setOnLoading(false);
                return;
            }
            else {

            }
        }
        else {
            setError("Request có lỗi chờ 1 xíu để request tip!")
            if (res.status)
                await setTimeout(async () => {
                    const res2 = await Fetch.post<{
                        next_page: number,
                        url: string,
                        continue: boolean,
                        next_url: string
                    }>("/api/posts/scraping", {
                        page: page
                    });

                    if (res2.status == 200) {
                        if (res2.data.continue) {
                            setNextUrl(res.data.next_url);
                            setDoneLinks(links ? links : []);

                            if (links) {
                                if (links.length > 500) {
                                    await onSubmit(res.data.next_page, [res.data.next_url, ...links.slice(0, 100)]);
                                }
                                else {
                                    await onSubmit(res.data.next_page, [res.data.next_url, ...links]);
                                }
                            }
                            setOnLoading(false);
                            return;
                        }
                    }
                }, 90000)
        }
        setOnLoading(false);
    }

    return (<>
        <div className="flex justify-center">
            <Link to="/" className="underline hover:text-gray-700">Home</Link>
        </div>
        <div className="mt-10">
            <div className="flex justify-center">
                <input type="number" className="text-center outline-none focus:outline-none border-2 border-black rounded-md mr-2 w-32"
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    placeholder="Page" value={current_page} />
                <button
                    onClick={() => onSubmit(current_page, done_links)}
                    className="outline-none focus:outline-none bg-black text-white px-5 py-2 rounded-md">
                    Scraping</button>
            </div>
            <div className="mx-auto flex justify-center mt-5">
                <div>
                    {error && (<>
                        <div className="flex justify-center mb-3">
                            <h1 className="text-lg font-medium text-red-500">
                                {error}
                            </h1>
                        </div>
                    </>)}
                    {on_loading ? (<>
                        <div className="justify-center flex mb-3">
                            <a className="underline text-lg text-blue-600 hover:text-blue-800 inline-block" href={next_url}>{next_url}</a>
                            <span className="text-lg ml-3">
                                <span>Loading</span> <span className="animate-spin ml-2 inline-block"><AiOutlineLoading3Quarters /></span>
                            </span>
                        </div>
                    </>) : (<></>)}
                    {done_links.length > 1 && done_links.map((link, index) => {
                        return (
                            <div key={index} className="mb-3 justify-center flex">
                                <a className="text-center underline text-lg text-blue-600 hover:text-blue-800 inline-block" href={link} target={"_blank"}>{link}</a>
                            </div>
                        )

                    })}

                </div>
            </div>
        </div>
    </>)
}

export default Scraping;