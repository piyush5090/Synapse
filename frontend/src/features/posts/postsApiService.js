import api from '../../services/api';

export const getGeneratedPosts = async () => {
    // This endpoint does not exist yet in the backend, I will assume it will be GET /content/generated-posts
    // For now, I will return an empty array.
    // const response = await api.get('/content/generated-posts');
    // return response.data;
    return [];
};

export const generateAd = async (promptData) => {
    const response = await api.post('/content/generate-ad', promptData);
    return response.data;
};

export const saveGeneratedPost = async (postData) => {
    const response = await api.post('/content/save-generated-post', postData);
    return response.data;
};

export const getScheduledPosts = async () => {
    // This endpoint does not exist yet in the backend, I will assume it will be GET /scheduler
    // For now, I will return an empty array.
    // const response = await api.get('/scheduler');
    // return response.data;
    return [];
};

export const createSchedule = async (scheduleData) => {
    const response = await api.post('/scheduler/create', scheduleData);
    return response.data;
};
