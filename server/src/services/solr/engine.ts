import SolrNode from 'solr-node';

export class SolrEngine {


    public host: string;
    public port: number;
    public protocol: string;

    init() {
        this.port = 8983;
        this.protocol = 'http';
        this.host = process.env.SOLR_HOST ? process.env.SOLR_HOST : 'localhost';
    }

    get(collection) {
        return new SolrNode({
            host: this.host,
            port: this.port,
            protocol: this.protocol,
            core: collection
        });
    }

    async update(object: any, collection: string) {
        if (!object.releaseSolr) {
            return;
        }

        var instance = new SolrNode({
            host: this.host,
            port: this.port,
            protocol: this.protocol,
            core: collection
        });
        const res = await instance.update(object.releaseSolr(), { commit: true });
        return res;
    }


    async remove(object, collection) {
        if (!object.releaseSolr) {
            return;
        }

        var instance = new SolrNode({
            host: this.host,
            port: this.port,
            protocol: this.protocol,
            core: collection
        });

        const res = await instance.delete(`id:${object.releaseSolr().id}`, { commit: true });

        return res;
    }
}


export const SolrInstance = new SolrEngine();