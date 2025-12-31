from pymongo import MongoClient

MONGO_URI = "mongodb://localhost:27017"

client = MongoClient(MONGO_URI)

db = client["insightverse_ai"]
job_results_collection = db["job_results"]
