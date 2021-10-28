import * as _ from 'lodash';
import { ParsedUrlQuery } from "querystring";

type Param = {
    key: string,
    value: number | string
}
export class Helper {


    static normalizeUrl(uri: string, type: string = '') {
        if (!uri) {
            return '';
        }
        var link = uri.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[\s\+]/g, '_').toLowerCase().replace(/[^0-9A-Za-z_.\/]+/g, "");
        if (type == 'optimal') {
            link = link.replace('images', 'images/optimal').replace('.jpg', '.png').replace('.jpeg', '.png');
        }

        if (type == 'transparent') {
            link = link.replace('images', 'images/transparent').replace('.jpg', '.png').replace('.jpeg', '.png');
        }

        return link;
    }

    static extractContent(s: string) {
        s = s.replace(/\<(.+?)\>/g, ' ');
        return s;
    };


    static convertMoney(val: number | string) {
        const numberString = String(val).replace(
            /^\d+/,
            number => [...number].map(
                (digit, index, digits) => (
                    !index || (digits.length - index) % 3 ? '' : ','
                ) + digit
            ).join('')
        );

        return numberString;
    }

    static getPriceValues(price_sale: number | string, price: number | string) {
        var value: { sale: null | string, normal: null | string } = {
            sale: null,
            normal: null
        };
        if (price_sale && Number(price_sale) > 0) {
            value.sale = this.convertMoney(price_sale.toString()) + ' đ';
            if (price && Number(price) > 0) {
                value.normal = this.convertMoney(price.toString()) + ' đ';
            }
            return value;
        } else if (price && Number(price) > 0) {
            value.sale = this.convertMoney(price.toString()) + ' đ';
            value.normal = null;
            return value;
        }
        return value;
    }


    static setAndGetURLParam(params: Param[], is_array = "") {
        const queries = new URLSearchParams(window.location.search);
        for (let i = 0; i < params.length; i++) {
            if (params[i].value) {
                queries.set(params[i].key, `${params[i].value}`);
            } else {
                queries.delete(params[i].key)
            }

        }

        return queries.toString();
    };



    static getURLParams(query: ParsedUrlQuery) {
        return query;
    };

    static generateCode(value: string) {
        if (value) {
            return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_').toLowerCase().substr(0, 100);
        }
        return '';
    };

    static validLink(value: string) {
        return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s/g, '_').toLowerCase();
    };

    static getDay = function (value: number) {
        const date = new Date(value * 1000);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    static uniqueArray<M>(array: M[], key: string) {
        var result_obj: any = {};
        for (let i = 0; i < array.length; i++) {
            //@ts-ignore
            result_obj[array[i][key]] = array[i];
        }

        return Object.values(result_obj).sort((a: any, b: any) => a[key] - b[key]) as M[];
    }

    static getInnerHeight = function () {
        return window.innerHeight;
    };

    static fullTextSearch = function (arrays: any[], key: string, search_text: string, bonus_keys: string[] = []) {
        if (key) {

            return arrays.filter(e => {
                var r_search_text = search_text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                var text = e[key].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                if (text.indexOf(r_search_text) >= 0) {
                    return true
                }
                if (bonus_keys.length > 0) {
                    for (let i = 0; i < bonus_keys.length; i++) {
                        var bonus_text = e[bonus_keys[i]].normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                        if (bonus_text.indexOf(r_search_text) >= 0) {
                            return true
                        }
                    }
                }
                return false;
            })
        }
        else {
            return arrays.filter(e => {
                var r_search_text = search_text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
                var text = e.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

                return text.indexOf(r_search_text) >= 0;
            })
        }
    }

    static setCookie(name: string, value: string, days: number) {
        var expires = "";
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toUTCString();
        }
        document.cookie = name + "=" + (value || "") + expires + "; path=/";
    }

    static removeCookie() {
        Helper.setCookie("access_token", "", 1);
    }

    static getCookie(name: string) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    static getCookieFromReq(name: string, cookies: string) {
        var nameEQ = name + "=";
        var ca = cookies.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }


    static getMonday(d: number) {
        var date = new Date(d * 1000);
        date = new Date(date.getFullYear(), date.getMonth(), date.getDate())
        var day = date.getDay();



        var diff = date.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday

        var time = Math.round(new Date(date.setDate(diff)).getTime() / 1000);
        return time;
    }


    //Function to convert rgb color to hex format
    static rbgaToHex(rgba: string) {
        var res = rgba.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+\.{0,1}\d*))?\)$/);
        if (res) {
            return `#${res.slice(1).map((n, i) => (i === 3 ? Math.round(parseFloat(n) * 255) : parseFloat(n)).toString(16).padStart(2, '0').replace('NaN', '')).join('')}`
        }

        return "";
    }
};