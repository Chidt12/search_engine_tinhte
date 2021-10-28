import { Router } from "express";
import list from "./list";
import scraping from "./scraping";

export default (app: Router) => {
    const route = Router();

    app.use('/posts', route);

    list(route);
    scraping(route);
}