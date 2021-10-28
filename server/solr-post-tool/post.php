<?php
    class SorlServices {
        private $config;
        private $collection;
        private $solr_url;
        private $authorization = null;

        public function __construct($collection) {
            $this->config = json_decode(file_get_contents("config.json"));
            $this->collection = $collection;
            $this->solr_url = $this->config->scheme."://".$this->config->host.":".$this->config->port;
            if ($this->config->username != "") {
                $this->authorization = "Basic ".base64_encode($this->config->username.":".$this->config->password);
            }
        }

        /**
         * @desc Create schema from config
         * @param Object $schema_config
         * @param String $schema
         * @param Boolean $is_replace
         */
        private function convertSchema($schema_config, $is_replace=false) {
            $schema = [];
            foreach($schema_config as $key => $value) {
                // Skip field id
                if($key == "id") continue;

                $action = $is_replace ? "replace-field" : "add-field";
                $schema_item = '"'.$action.'": {"name": "'.$key.'","type": "'.$value.'","stored": true}';
                $schema[] = $schema_item;
            }

            return "{".join(",",$schema)."}";
        }

        /**
         * @desc Do action by call API to solr server
         * @param $action - Type of action
         * @param $data - Data to import
         */
        private function doAction($action) {
            $options = [];
            $headers = ["Content-Type:application/json"];

            if ($this->authorization) {
                $headers[] = "Authorization:".$this->authorization;
            }

            if ($action === "create_collection") {
                $options = [
                    CURLOPT_URL => $this->solr_url."/solr/admin/collections?action=CREATE&name=".$this->collection->name."&numShards=1&replicationFactor=1&wt=json",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => $headers
                ];
            } else if ($action === "create_schema") {
                if (!$this->collection->schema) return true;

                $schema = $this->convertSchema($this->collection->schema);
                $options = [
                    CURLOPT_URL => $this->solr_url."/solr/".$this->collection->name."/schema",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => $headers,
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => $schema,
                ];
            } else if ($action === "update_schema") {
                if (!$this->collection->schema) return true;

                $schema = $this->convertSchema($this->collection->schema, true);
                $options = [
                    CURLOPT_URL => $this->solr_url."/solr/".$this->collection->name."/schema",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => $headers,
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => $schema,
                ];
            } else if ($action === "add_copyfield") {
                $copyfield = "_text_";
                if ($this->collection->copyfield) {
                    $copyfield = $this->collection->copyfield;
                }

                $data = '{"add-copy-field":{"source":"*","dest":["'.$copyfield.'"]}}';
                $options = [
                    CURLOPT_URL => $this->solr_url."/solr/".$this->collection->name."/schema",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => $headers,
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => $data,
                ];
            } else if ($action === "index_data") {
                $collection_data = $this->collection->data;

                if (!file_exists($collection_data)) {
                    echo "\nData file not found: " . $collection_data;
                    return false;
                }
                $options = [
                    CURLOPT_URL => $this->solr_url."/api/collections/".$this->collection->name."/update/json?commit=true",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => $headers,
                    CURLOPT_POST => true,
                    CURLOPT_POSTFIELDS => file_get_contents($this->collection->data),
                ];
            } else if ($action === "delete_configset") {
                $options = [
                    CURLOPT_URL => $this->solr_url."/api/cluster/configs/".$this->collection->name.".AUTOCREATED?omitHeader=true",
                    CURLOPT_RETURNTRANSFER => true,
                    CURLOPT_HTTPHEADER => $headers,
                    CURLOPT_CUSTOMREQUEST => "DELETE"
                ];
            } else {
                return false;
            }

            $curlHandler = curl_init();

            curl_setopt_array($curlHandler, $options);

            $response = curl_exec($curlHandler);

            return $response;
        }

        /**
         * @desc Do create collection
         * @return Void
         */
        public function createCollection() {
            echo "\nCleaning configset (if exist) for: ".$this->collection->name;
            $this->doAction("delete_configset");

            echo "\nCreating collection: ".$this->collection->name;
            $response = json_decode($this->doAction("create_collection"));

            if($response) {
                if ($response->responseHeader->status == 0) {
                    echo "\nSuccessfully create collection: ".$this->collection->name;
                    return true;
                } else {
                    echo "\nError: ".$response->error->msg;
                
                }
            }
            return false;
        }

        /**
         * @desc Do create schema
         * @return Void
         */
        public function createSchema() {
            echo "\nCreating schema for: ".$this->collection->name;
            $response = json_decode($this->doAction("create_schema"));

            if($response) {
                if ($response->responseHeader->status == 0) {
                    echo "\nSuccessfully create schema for: ".$this->collection->name;
                    return true;
                } else {
                    echo "\nSkip: ".$this->collection->name;
                }
            }
            return false;
        }

        /**
         * @desc Do create collection
         * @return Void
         */
        public function updateSchema() {
            echo "\nUpdating schema for: ".$this->collection->name;
            $response = json_decode($this->doAction("update_schema"));

            if($response) {
                if ($response->responseHeader->status == 0) {
                    echo "\nSuccessfully update schema for: ".$this->collection->name;
                    return true;
                } else {
                    echo "\nError: ".$response->error->msg;
                }
            }
            return false;
        }

        /**
         * @desc Do add copyfield
         * @return Void
         */
        public function addCopyfield() {
            echo "\nAdding copyfield into: ".$this->collection->name;
            echo "\nCopy from * to: ".$this->collection->copyfield;
            $response = json_decode($this->doAction("add_copyfield"));

            if($response) {
                if ($response->responseHeader->status == 0) {
                    echo "\nSuccessfully add copyfield into: ".$this->collection->name;
                    return true;
                } else {
                    echo "\nError: ".$response->error->msg;
                    exit;
                }
            }
            return false;
        }

        /**
         * @desc Do create collection
         * @return Void
         */
        public function indexData() {
            echo "\nIndexing data: ".$this->collection->name;
            $response = json_decode($this->doAction("index_data"));

            if($response) {
                if ($response->responseHeader->status == 0) {
                    echo "\nSuccessfully index data: ".$this->collection->name;
                    echo "Response".json_encode($response);
                    return true;
                } else {
                    echo "\nError: ".$response->error->msg;
                    exit;
                }
            }
            return false;
        }
    }

    $collections = json_decode(file_get_contents('collections.json'));

    for ($i = 0; $i < sizeof($collections); $i++){
        $collection = $collections[$i];
        $solr = new SorlServices($collection);
        $solr->createCollection();
        if($solr->createSchema()) {
            $solr->addCopyfield();
        } else {
            echo "\nSchema existed, trying to update schema for:".$collection->name;
            $solr->updateSchema();
        }
        $solr->indexData();
    }
?>