import { isArray } from 'lodash';
import SolrNode from 'solr-node';

function wrapText(value: any) {
    if (typeof value == 'string') {
        return `'${value}'`;
    }
    return value;
};
export class QueryBuilder {
    query_obj: any;
    instance: SolrNode;
    query: SolrNode.Query;
    conditions: string[];

    constructor(instance: SolrNode) {
        this.instance = instance;
        this.query_obj = {};
        this.query = instance.query();
        this.conditions = [];
    }

    inList(param: { key: string, values: any[] }) {
        this.query_obj[param.key] = param.values;
        return this;
    }

    paginate(page: number, page_size: number) {
        this.query = this.query.start(Math.max(page - 1, 0) * page_size);
        this.query = this.query.rows(page_size);
        return this;
    }

    setQueryParam(params) {
        this.query_obj = { ...this.query_obj, ...params }
        return this;
    }


    getQueryParam() {
        var keys = Object.keys(this.query_obj);
        var results = [];
        console.log("=====================")

        for (var i = 0; i < keys.length; i++) {
            var value = this.query_obj[keys[i]];

            if (isArray(value)) {
                results.push(` (${value.map(e => ` ${keys[i]}:${wrapText(e)} `).join('OR')}) `);
                console.log("1-----")
                console.log(results);
            } else if (value.or) {

                var value_keys = Object.keys(value.or);
                value_keys = value_keys.filter(e => value.or[e].toString().replace(/\s/g, '') != '')
                results.push(` (${value_keys.map((e, index) => ` ${e}:${wrapText(value.or[e])}^${index + 1} `).join('OR')}) `);
                console.log("2-----")
                console.log(results);
            } else {
                if (value.toString().replace(/\s/g, '') == '') {
                    continue;
                }
                
                results.push(` (${keys[i]}:${wrapText(value)}) `)
                console.log("3-----")
                console.log(results);
            }
        }

        return results.join('AND');
    }


    sort(params) {
        this.query = this.query.sort(params);
        return this;
    }

    facet(fields: string | string[]) {
        this.query = this.query.facetQuery({
            field: fields,
            query: this.getQueryParam()
        });

        return this;
    }

    get() {
        if (this.getQueryParam()) {
            console.log('queyr', this.getQueryParam());
            this.query.q(this.getQueryParam());
        } else {
            this.query.q({});
        }

        return this.instance.search(this.query);
    }


    static readFacets(data: any, field) {
        var result = {};
        var field_data = data.facet_counts.facet_fields[field];
        for (let i = 0; i < field_data.length; i += 2) {
            result[field_data[i]] = field_data[i + 1];
        }
        return result;
    };

}