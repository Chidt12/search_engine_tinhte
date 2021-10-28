import { Model } from 'sequelize-typescript';
import { addItem, removeItem } from '../../utils/helper';
import { Op } from 'sequelize';

export class DBModel extends Model {

    static async saveObject<M extends Model>(
        this: { new(): M } & typeof Model,
        params): Promise<M> {
        var value = await this.create(params);

        //@ts-ignore
        value.id = value.null;

        //@ts-ignore
        return value;
    }

    static async paginate<M extends Model>(this: { new(): M } & typeof Model, query: any, { page, page_size }): Promise<M[]> {
        var value = await this.findAll(
            {
                ...query,
                offset: (page - 1) * page_size,
                limit: page_size
            }
        );
        return value as M[];
    }

    static async loadListCompleteIds<M extends Model>(this: { new(): M } & typeof Model, ids: number[]): Promise<M[]> {
        var value = await this.findAll({
            where: {
                id: ids
            },
            limit: ids.length
        });

        return value as M[];
    }

    async saveObject(): Promise<this> {
        // @ts-ignore;
        return await DBModel.saveObject(this);
    }

    static async findAllSafe<M extends Model>(this: { new(): M } & typeof Model, options: any): Promise<M[]> {
        var where = options.where;
        var keys = Object.keys(where);
        for (var i = 0; i < keys.length; i++) {
            const key = keys[i];
            if (typeof where[key] == 'number' || typeof where[key] == 'string') {
                continue;
            }

            if (!where[key].length) {
                return []
            }

            if (where[key][Op.or] && !where[key][Op.or].length) {
                return []
            }
        }
        //@ts-ignore
        return this.findAll(options);
    }


    async edit(fields: string[]) {
        await this.save({ fields: fields });
    }

    public toJSON(): this {
        //@ts-ignore
        return super.toJSON();
    };

    public getData(key?: string): any {
        if (!key) {
            //@ts-ignore
            return this.data ? JSON.parse(this.data) : {};
        }
    
        var data = this.getData();
        return data[key];
    };

    public setData(key: string, value: any): any {
        var data = this.getData();
        data = { ...data, [key]: value };
        //@ts-ignore
        this.data = JSON.stringify(data);
        return true;
    };

    public getCount(key: string) {
        var data = this.getData();
        if (!data[key]) {
            return 0;
        }

        return parseInt(data[key]);
    };

    public decreaseCount(key: string) {
        var data = this.getData();
        if (!data[key]) {
            return 0;
        }
        this.setData(key, Math.max(0, parseInt(data[key]) - 1));
    }

    public increaseCount(key: string) {
        var data = this.getData();
        this.setData(key, data[key] ? parseInt(data[key]) + 1 : 1);
        //@ts-ignore
        console.log(this.data);
    }
}

