import express from 'express';
import routes from '../api';
import bodyParser from 'body-parser';
import session from 'express-session';
import cors from 'cors';
import multer from 'multer';
import BaseError from '../packages/error/error';

export default ({ app }: { app: express.Application }) => {
    app.use(cors(
        {
            'origin': '*',
            'methods': 'GET,HEAD,PUT,PATCH,POST,DELETE',
        }
    ));
    app.use(bodyParser.urlencoded({
        extended: true
    }));
    app.use(bodyParser.json());

    app.use(session({
        secret: 'search_engine_secret',
        resave: false,
        saveUninitialized: false
    }));

    app.get('/', (req, res) => {
        res.send('THIS REALLY WORKED');
    });

    app.get('/status', (req, res) => {
        res.status(200).end();
    });

    app.use(`/${process.env.UPLOAD_FOLDER}`, express.static(`${process.env.UPLOAD_FOLDER}`))

    app.use('/api', routes());

    app.use(function (error: Error, req, res, next) {
        // Gets called because of `wrapAsync()`
        res.status(200).send(new BaseError(error.message, -1).release());
    });
};