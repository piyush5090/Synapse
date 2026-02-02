import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/user/userSlice';

const Navbar = () => {
  const { token } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex justify-between">
        <Link to="/" className="text-xl font-bold">Synapse</Link>
        <div className="flex gap-4">
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/business">Business</Link>
              <Link to="/content">Content</Link>
              <Link to="/schedule">Schedule</Link>
              <Link to="/admin">Admin</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
