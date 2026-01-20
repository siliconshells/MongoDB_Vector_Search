from pymongo.mongo_client import MongoClient
from pymongo.operations import SearchIndexModel
from pymongo.errors import OperationFailure

import time

# Connect
uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000"
client = MongoClient(uri)

# Access database and collection
database = client["health_reg_test"]
collection = database["facility_requirements"]

# Create index model, then create the search index
search_index_model = SearchIndexModel(
    definition={
        "fields": [
            {
                "type": "autoEmbed",
                "modality": "text",
                "path": "requirements.text",
                "model": "voyage-4",
            },
            {
                "type": "autoEmbed",
                "modality": "text",
                "path": "main_requirement",
                "model": "voyage-4",
            },
            {"type": "filter", "path": "standardTitle"},
        ]
    },
    name="vector_index",
    type="vectorSearch",
)

result = collection.create_search_index(model=search_index_model)
print("New search index named " + result + " is building.")

# Wait for initial sync to complete
print("Polling to check if the index is ready. This may take up to a minute.")

INDEX_NAME = "vector_index"

deadline = time.time() + 120  # 2 minutes
while time.time() < deadline:
    try:
        # Minimal query: just see if it runs
        list(
            collection.aggregate(
                [
                    {
                        "$vectorSearch": {
                            "index": INDEX_NAME,
                            "path": "requirements.text",
                            "query": {"text": "test"},
                            "numCandidates": 10,
                            "limit": 1,
                        }
                    },
                    {"$limit": 1},
                ]
            )
        )
        print(f"{INDEX_NAME} is queryable (vectorSearch runs).")
        break
    except OperationFailure as e:
        # Still building / not ready / embedding not configured
        print("Not ready yet:", e.details.get("errmsg", str(e)))
        time.sleep(5)
else:
    raise TimeoutError(f"{INDEX_NAME} not queryable after 2 minutes.")

client.close()
