import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isHostAtom } from '../store/atoms/Auth';

export const Navbar = () => {
  const isHost = useRecoilValue(isHostAtom);
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-rose-500">
          StayFinder
        </Link>
        <div className="space-x-6 hidden md:flex">
          <Link to="/" className="text-gray-700 hover:text-rose-500 transition">Home</Link>
           {isHost === true && (
        <Link to="/newproperty" className="text-gray-700 hover:text-rose-500 transition">
          List Property
        </Link>
      )}
          <Link to="/profile" className="text-gray-700 hover:text-rose-500 transition">Profile</Link>
        </div>
        <div className="md:hidden">
          {/* Optional mobile menu toggle here */}
        </div>
      </div>
    </nav>
  );
};
