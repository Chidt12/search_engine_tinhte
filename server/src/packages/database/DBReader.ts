import {Request, Response} from 'express';
export class DBReader<T> {

    req: Request;
    res: Response;
    object: T;

    constructor(req: Request,res: Response, object: T) {
        this.req = req;
        this.object = object;
        this.res = res;
    }

    isEditing() {
        //@ts-ignore
        return (this.object.id) ? true : false;
    }

    isCreating() {
        //@ts-ignore
        return (this.object.id) ? false : true;
    }

}