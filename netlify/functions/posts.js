// netlify/functions/getPosts.js
import { connectToMongoDB } from './utils/connection';
import { ObjectId } from 'mongodb'; // Import ObjectId from mongodb

export const handler = async (event, context) => {
    const db = await connectToMongoDB();
    
    // Determine the request method and path to handle different scenarios
    const { httpMethod, path } = event;

    try {
        if (httpMethod === 'GET') {
            // Fetch all posts
            if (path === '/.netlify/functions/getPosts') {
                const posts = await db.collection('posts').find({}).toArray();
                return {
                    statusCode: 200,
                    body: JSON.stringify(posts),
                };
            }
            // Fetch post by ID
            else if (path.startsWith('/.netlify/functions/getPosts/')) {
                const id = path.split('/').pop(); // Extract the ID from the URL
                const post = await db.collection('posts').findOne({ _id: new ObjectId(id) });

                if (!post) {
                    return {
                        statusCode: 404,
                        body: JSON.stringify({ error: 'Post not found' }),
                    };
                }

                return {
                    statusCode: 200,
                    body: JSON.stringify(post),
                };
            } else {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: 'Not Found' }),
                };
            }
        } else {
            return {
                statusCode: 405, // Method Not Allowed
                body: JSON.stringify({ error: 'Method not allowed' }),
            };
        }
    } catch (error) {
        console.error("Error retrieving posts:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to retrieve posts' }),
        };
    }
};
