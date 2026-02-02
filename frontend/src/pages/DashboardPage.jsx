import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBusiness } from '../features/user/userSlice';

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { business, status, user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && !business && status !== 'loading') {
      dispatch(fetchBusiness());
    }
  }, [dispatch, user, business, status]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      {status === 'loading' && <p>Loading business information...</p>}
      {status === 'succeeded' && business ? (
        <div className="p-4 mt-4 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-bold">{business.name}</h2>
          <p>{business.description}</p>
          <p className="mt-2 text-sm text-gray-600">
            Website: <a href={business.website_url} target="_blank" rel="noopener noreferrer">{business.website_url}</a>
          </p>
        </div>
      ) : (
        <div className="p-4 mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700">
          <p>
            No business information found. Please{' '}
            <Link to="/business" className="font-bold underline">
              create your business profile
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
