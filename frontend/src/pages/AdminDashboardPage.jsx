import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminDashboard } from '../features/admin/adminSlice';

const AdminDashboardPage = () => {
  const dispatch = useDispatch();
  const { users, posts, metrics, status } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminDashboard());
  }, [dispatch]);

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      {status === 'loading' && <p>Loading dashboard data...</p>}
      {status === 'succeeded' && (
        <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Users</h2>
                <p className="text-3xl">{users.length}</p>
            </div>
            <div className="p-4 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-bold">Total Posts Generated</h2>
                <p className="text-3xl">{posts.length}</p>
            </div>
            {/* Add more metrics as needed */}
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
