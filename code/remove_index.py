from pymongo import MongoClient

client = MongoClient(
    "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000"
)

collection = client.health_reg_test.facility_requirements

collection.drop_search_index("vector_index")

print("Vector index removed")

print("checking...", collection.list_search_indexes().to_list())
