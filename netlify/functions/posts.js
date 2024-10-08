// netlify/functions/posts.js
import { connectToMongoDB } from './utils/connection';
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb

export const handler = async (event, context) => {
    const db = await connectToMongoDB();
    
    // Determine the request method and path to handle different scenarios
    const { httpMethod, path } = event;

    // Allow CORS
    const headers = {
        'Access-Control-Allow-Origin': '*', // Change '*' to your specific frontend domain in production
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        if (httpMethod === 'GET') {
            // Fetch all posts
            if (path === '/.netlify/functions/posts') {
                const posts = await db.collection('posts').find({}).toArray();
                return {
                    statusCode: 200,
                    headers, // Include the CORS headers in the response
                    body: JSON.stringify(posts),
                };
            }
            // Fetch post by ID
            else if (path.startsWith('/.netlify/functions/posts/')) {
                const id = path.split('/').pop(); // Extract the ID from the URL
                const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

                if (!post) {
                    return {
                        statusCode: 404,
                        headers, // Include CORS headers
                        body: JSON.stringify({ error: 'Post not found' }),
                    };
                }

                return {
                    statusCode: 200,
                    headers, // Include CORS headers
                    body: JSON.stringify(post),
                };
            } else {
                return {
                    statusCode: 404,
                    headers, // Include CORS headers
                    body: JSON.stringify({ error: 'Not Found' }),
                };
            }
        } else {
            return {
                statusCode: 405, // Method Not Allowed
                headers, // Include CORS headers
                body: JSON.stringify({ error: 'Method not allowed' }),
            };
        }
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return {
            statusCode: 500,
            headers, // Include CORS headers
            body: JSON.stringify({ error: 'Failed to retrieve posts' }),
        };
    }
};
