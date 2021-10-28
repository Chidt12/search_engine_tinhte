import { Sequelize } from 'sequelize-typescript';
import { PostModel } from '../models/post/post';


export default () => {
    const sequelize = new Sequelize({
        database: process.env.DATABASE_NAME,
        host: process.env.DATABASE_HOST,
        dialect: 'mysql',
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        models: [
            PostModel
        ]
    });    

    return sequelize;
};