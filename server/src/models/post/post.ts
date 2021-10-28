import { Table, Column, PrimaryKey, AllowNull, AutoIncrement, Default } from 'sequelize-typescript';
import { DBModel } from "../../packages/database/DBModel";
import { extractContent, removeVietnameseTones } from '../../utils/helper';

@Table({
    tableName: 'Post',
    timestamps: false
})
export class PostModel extends DBModel {
    public static COLLECTION = 'post_collection';

    @PrimaryKey
    @Column
    id: number;
    @Column
    origin_id: number;

    @Column
    name: string;

    @Column
    cover_image: string;

    @Column
    parent_category: string;
    @Column
    category: string;
    @Column
    origin_date: number;
    @Column
    crawl_date: number;

    @Column
    author_name: string;
    @Column
    author_avatar: string;
    @Column
    crawl_link: string;
    @Column
    content: string;


    release() {
        return {
            id: this.id,
            name: this.name,
            
        }
    }

    releaseSolr() {
        return {
            id: this.id,
            origin_id: this.id,
            name: removeVietnameseTones(this.name),
            origin_name: this.name.toLowerCase(),
            author_name: this.author_name,
            author_avatar: this.author_avatar,
            crawl_link: this.crawl_link,
            content: removeVietnameseTones(extractContent(this.content)),
            origin_content: this.content,
            parent_category: removeVietnameseTones(this.parent_category),
            category: removeVietnameseTones(this.category),
            origin_parent_category: this.parent_category,
            origin_category: this.category
        };
    }
}