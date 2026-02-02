import api from '../../services/api';

export const getAdminDashboardData = async () => {
    // This endpoint does not exist yet in the backend, I will assume it will be GET /admin/dashboard
    // For now, I will return an empty object.
    // const response = await api.get('/admin/dashboard');
    // return response.data;
    return { users: [], posts: [], metrics: {} };
};
