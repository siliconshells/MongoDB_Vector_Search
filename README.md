# MongoDB Vector Search

## MongoDB and MongoDB Search setup
To setup the MongoDB Community version and the Mongo Search locally, please follow these steps:
1. Install Docker Desktop
1. `docker pull mongodb/mongodb-community-server:latest`
1. `docker pull mongodb/mongodb-community-search:latest`
1. In Terminal, navigate to the folder location with the following files:
    - mongod.conf
    - mongot.conf
    - init-mongo.sh
    - pwfile
    - docker-compose.yml
1. Run `docker compose up -d`


## MongoDB Search vector search setup
To get the bash terminal interface of the **MongoDB Search** container within your terminal to execute commands in the container,
1. Run `docker exec -it --user root mongot-community-search /bin/bash`
1. mkdir -p /etc/mongot/secrets
1. chmod 700 /etc/mongot/secrets
1. echo -n <query key> | tee /etc/mongot/secrets/voyage-api-query-key > /dev/null
1. echo -n <indexing key> | tee /etc/mongot/secrets/voyage-api-indexing-key > /dev/null
    [!NOTE]   
    The indexing and query keys can be generated online at the Atlas page under **AI Models**. I used the Voyage-4 model.
1. chmod 400 /etc/mongot/secrets/voyage-api-query-key
1. chmod 400 /etc/mongot/secrets/voyage-api-indexing-key



## Using the installation
To use the setup:
1. Install PyMongo with `pip install pymongo`
1. To create a vector index, run the python script `create_index.py`
1. To run a query, run the python script `run_query.py`
1. To remove the index created above, run the python script `remove_index.py`
> [!TIP]
> Feel free to modify the scripts to change the behavior.


## Note
1. Use of the Voyage models is billed per the number of tokens processed.
1. When using Compass to connect, choose 'direct' under Advanced.
1. You can use `mongosh` to interact with MongoDB on the cli.


## Reference
https://www.mongodb.com/docs/atlas/atlas-search/tutorial/?deployment-type=self
https://www.mongodb.com/docs/atlas/atlas-vector-search/crud-embeddings/create-embeddings-automatic/?interface=driver&language=python
https://www.mongodb.com/docs/atlas/atlas-vector-search/vector-search-overview/