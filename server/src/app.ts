import express from 'express';
import loaders from './loaders';
import dotenv from 'dotenv';
dotenv.config({ path: '../.env'});

async function startServer() {
    const app = express();

    await loaders({expressApp: app});

    var server  = app.listen(process.env.PORT, () => {
        console.log(`server is listening on ${process.env.PORT}`);
    });

    server.setTimeout(3600*1000)
};

startServer();




