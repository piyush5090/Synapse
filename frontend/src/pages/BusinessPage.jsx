import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { saveBusiness } from '../features/user/userSlice';

const BusinessPage = () => {
  const dispatch = useDispatch();
  const { business, status, error } = useSelector((state) => state.user);
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');

  useEffect(() => {
    if (business) {
      setName(business.name || '');
      setDescription(business.description || '');
      setWebsiteUrl(business.website_url || '');
    }
  }, [business]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(saveBusiness({ name, description, website_url: websiteUrl }));
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold">Business Profile</h1>
      <div className="w-full max-w-2xl p-8 mt-4 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Business Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="3"
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div>
            <label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-700">
              Website URL
            </label>
            <input
              id="websiteUrl"
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {status === 'loading' ? 'Saving...' : 'Save Business Information'}
            </button>
          </div>
          {status === 'succeeded' && business && (
            <p className="text-sm text-green-500">Business information saved successfully.</p>
          )}
          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default BusinessPage;
