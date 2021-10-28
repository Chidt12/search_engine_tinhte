import expressLoader from '../loaders/express';
import schemaLoader from '../loaders/schema';
import { SolrInstance } from '../services/solr/engine';

export default async ({expressApp}) => {
    await schemaLoader();
    await expressLoader({app: expressApp});
    await SolrInstance.init();
};