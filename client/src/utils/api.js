const API_URL = import.meta.env.VITE_BASE_API_URL;

export const fetchPosts = async () => {
    try {
        console.log(`Fetching posts from: ${API_URL}/getPosts`);
        const response = await fetch(`${API_URL}/getPosts`);
        
        if (!response.ok) {
            console.error(`Error fetching posts: ${response.status} - ${response.statusText}`);
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("Fetched posts successfully:", data);
        return data;
    } catch (error) {
        console.error("Failed to fetch posts:", error);
        throw error;
    }
};

export const fetchPostById = async (id) => {
    try {
        const response = await fetch(`${API_URL}/getPosts/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error(`Failed to fetch post with ID ${id}:`, error);
        throw error;
    }
};