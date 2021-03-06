import fs from 'fs';
// import { SystemErrorModel } from '../models/system.config/system.error';



export const time = function () {
    return Math.floor(new Date().getTime() / 1000);
};

export const checkPdf = function (file) {
    // Accept images only
    if (!file.originalname.match(/\.(pdf|PDF)$/)) {
        return false;
    }

    return true;
}

export const beginDay = function (ts) {

    var date = new Date(ts * 1000);
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
    date.setMilliseconds(0);

    return Math.floor(date.getTime() / 1000);
};

export const getPathFile = function (name) {
    const date = new Date();
    return `images/${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}/${name}`;
};

export const toArray = function (value: string, type = 'number') {
    if (!value) return [];
    if (type == 'string') {
        return value.split('@').filter(e => e !== "");
    } else {
        return value.split('@').filter(e => e !== "").map(e => Number(e))
    }
};

export const removeItem = function (values: any[], value: any, key?: string) {
    if (key) {
        var results = [...values];
        results = results.filter(e => e[key] != value[key]);
        return results;
    }

    if (values.indexOf(value) > -1) {
        var results = [...values];
        results = results.filter(e => e != value);
        return results;
    }

    return values;
};

export const removeItems = function (values: any[], removed_values: any[], key?: string) {
    var results = [...values];
    for (let i = 0; i < removed_values.length; i++) {
        results = removeItem(results, removed_values[i], key);
    }

    return results;
};

export const addItem = function (values: any[], value: any, key?: string) {
    if (key) {
        var results = [...values];
        if (!values.find(e => e[key] == value[key])) {
            results.push(value);
            return results;
        }

        return results
    }

    if (values.indexOf(value) == -1) {
        var results = [...values];
        results.push(value);
        return results;
    }

    return values;
};

export const addItems = function (values: any[], added_values: any[], key?: string) {
    var results = [...values];
    for (let i = 0; i < added_values.length; i++) {
        results = addItem(results, added_values[i], key);
    }

    return results;
};


export const readFile = function (path: string) {
    return new Promise((resolve, reject) => {
        const res = fs.readFileSync(path, 'utf8');
        resolve(res);
    });
}

export const toArrayString = function (values: string[] | number[]): string {
    //@ts-ignore
    return values.map(e => `@${e}@`).join('');
};


export function generateCode(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\+]/g, '_').toLowerCase().replace(/[^0-9A-Za-z_.\/]+/g, "");
};

export function encodeTag(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\+]/g, '_');
};

export function validLink(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_').toLowerCase();
};


export function sortByRef(origin_objs, ref_ids) {
    var arr = [];
    for (let i = 0; i < ref_ids.length; i++) {
        var obj = origin_objs.find(e => e.id == ref_ids[i]);
        if (obj) {
            arr.push(obj)
        }
    }

    return arr;
}

export function extractContent(s: string) {
    if(s){
        s = s.replace(/\<(.+?)\>/g, ' ');
        return s;
    }
    
    return "";
};

export function removeVietnameseTones(str) {
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "a");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "e");
    str = str.replace(/??|??|???|???|??/g, "i");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "o");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "u");
    str = str.replace(/???|??|???|???|???/g, "y");
    str = str.replace(/??/g, "d");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "A");
    str = str.replace(/??|??|???|???|???|??|???|???|???|???|???/g, "E");
    str = str.replace(/??|??|???|???|??/g, "I");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???|??|???|???|???|???|???/g, "O");
    str = str.replace(/??|??|???|???|??|??|???|???|???|???|???/g, "U");
    str = str.replace(/???|??|???|???|???/g, "Y");
    str = str.replace(/??/g, "D");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    // M???t v??i b??? encode coi c??c d???u m??, d???u ch??? nh?? m???t k?? t??? ri??ng bi???t n??n th??m hai d??ng n??y
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ?? ?? ?? ?? ??  huy???n, s???c, ng??, h???i, n???ng
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ?? ?? ??  ??, ??, ??, ??, ??
    // Remove extra spaces
    // B??? c??c kho???ng tr???ng li???n nhau
    str = str.replace(/ + /g, " ");
    str = str.trim();
    // Remove punctuations
    // B??? d???u c??u, k?? t??? ?????c bi???t
    str = str.replace(/\<(.+?)\>/g, ' ');
    str = str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, " ");
    str = str.toLowerCase();
    return str;
}