import React, { useState } from 'react';
import { FiMenu, FiHeart, FiShoppingCart, FiChevronDown, FiUser } from 'react-icons/fi';
import ProfilePanel from './profileDetails';

const Header: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileClick = () => {
    setShowProfile(prev => !prev);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
  };
  return (
    <header className="w-full h-[75px] bg-gray-50 px-6 py-3 flex items-center justify-between shadow-sm relative">
      {/* Logo and Menu */}
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold text-black">AbT</h1>
        <button className="flex items-center space-x-1 text-gray-700 hover:text-black">
          <FiMenu className="text-xl" />
          <span className="text-sm font-medium">Menu</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative mx-6 w-[400px]">
        <input
          type="text"
          className="w-full px-4 py-1 pr-10 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Search Product"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
      </div>

      {/* Icons and Profile */}
      <div className="flex items-center space-x-6 text-gray-700">
        <button className="hover:text-black relative">
          <FiHeart className="text-xl" />
        </button>
        <button className="hover:text-black relative">
          <FiShoppingCart className="text-xl" />
        </button>
        <div
          className="flex items-center space-x-1 hover:text-black cursor-pointer"
          onClick={handleProfileClick}
        >
          <FiUser className="text-xl" />
          <FiChevronDown className="text-sm" />
        </div>
      </div>

      {/* Profile Panel */}
      {showProfile && <ProfilePanel onClose={handleCloseProfile} />}
    </header>
  );
};

export default Header;