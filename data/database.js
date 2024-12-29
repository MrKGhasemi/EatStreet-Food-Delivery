const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let mongodb_url = "mongodb://127.0.0.1:27017/"; // Default MongoDB connection string
if (process.env.MONGODB_URL) {
  mongodb_url = process.env.MONGODB_URL; // Override if the environment variable is set
}

let database;

async function connectToDB() {
  try {
    const client = await MongoClient.connect(mongodb_url, {
      useNewUrlParser: true,
      useUnifiedTopology: true, // Recommended options
    });
    console.log("Connected to MongoDB");
    database = client.db("food_delivery"); // Replace 'online_shop' with your database name
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error.message);
    throw error;
  }
}

function getDB() {
  if (!database) {
    throw { message: "You must connect to the database first!" };
  }
  return database;
}

module.exports = { connectToDB, getDB };
