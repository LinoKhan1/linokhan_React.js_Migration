/**
 * @file connection.js
 * @description This module handles the connection to the MongoDB database using the MongoDB Node.js driver.
 * It exports a function to connect to MongoDB and a function to get the database instance.
 */

import { MongoClient, ServerApiVersion } from "mongodb";

// MongoDB connection URI from environment variables
const uri = process.env.MONGODB_URI || ""; // Update the variable name to match your .env setup

// Log the connection string for debugging (make sure not to expose sensitive info in production)
if (!uri) {
    console.error("MongoDB connection string (MONGODB_URI) is not defined.");
} else {
    console.log("MongoDB URI:", uri); // Log the URI to check if it's defined
}

// Create a new MongoClient instance
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1, // Use MongoDB Server API version 1
        strict: true, // Enable strict mode
        deprecationErrors: true, // Enable deprecation warnings
    },
});

// Cache the database instance to avoid connecting repeatedly
let db;

/**
 * Connects to MongoDB and returns the database instance.
 * If already connected, it will return the cached database instance.
 */
async function connectToMongoDB() {
    if (!db) {
        try {
            // Connect the client to the server
            await client.connect();
            // Send a ping to confirm a successful connection
            await client.db("admin").command({ ping: 1 });
            console.log(
                "Pinged your deployment. You successfully connected to MongoDB!"
            );
            // Store the database instance in the cache
            db = client.db("blogs"); // Specify your database name here
        } catch (err) {
            // Log any errors encountered during connection
            console.error("Failed to connect to MongoDB:", err);
            throw err; // Rethrow the error for handling in the function
        }
    }
    return db; // Return the database instance
}

// Export the connectToMongoDB function
export { connectToMongoDB };
