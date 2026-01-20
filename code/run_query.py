import pymongo
import pprint

client = pymongo.MongoClient(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000"
)

result = client["health_reg_test"]["facility_requirements"].aggregate(
    [
        {
            "$vectorSearch": {
                "index": "vector_index",
                "path": "requirements.text",
                # "filter": {
                #     "standardTitle": {"$in": ["Physical Environment"]},
                # },
                "query": {"text": "something on writing everything"},
                "model": "voyage-4",
                "numCandidates": 6000,
                "limit": 5,
            }
        },
        {
            "$project": {
                "_id": 1,
                "standardCode": 1,
                "standardTitle": 1,
                "main_requirement": 1,
                "requirements": 1,
                "score": {"$meta": "vectorSearchScore"},
            }
        },
    ]
)

for i in result:
    pprint.pprint(i)
