// components/Sidebar.tsx

import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    // Clear the JWT from local storage or wherever it's stored
    localStorage.removeItem('token');
    // Use Next.js router to push to the home page which is your login page
    router.push('/');
  };

  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col fixed">
      <div className="p-5">Logo or Project Name</div>
      <ul className="flex-grow">
        <li>
          <Link legacyBehavior href="/dashboard">
            <a className="block p-4 hover:bg-gray-700">Dashboard</a>
          </Link>
        </li>
        <li>
          <Link legacyBehavior href="/reservations">
            <a className="block p-4 hover:bg-gray-700">Reservations</a>
          </Link>
        </li>
        <li>
          {/* Log Out link now correctly redirects to the home page which is your login page */}
          <a href="/" onClick={handleLogout} className="block p-4 hover:bg-gray-700">Log Out</a>
        </li>
      </ul>
      <div className="p-5 text-sm">Footer or Additional Info</div>
    </div>
  );
};

export default Sidebar;

