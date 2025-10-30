import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-gray-800 p-4">
      <h2 className="text-xl font-bold mb-4">Settings</h2>
      <nav>
        <ul>
          <li className="mb-2"><a href="#general" className="hover:text-gray-300">General</a></li>
          <li className="mb-2"><a href="#blitz-panel" className="hover:text-gray-300">Blitz Panel Side</a></li>
          <li className="mb-2"><a href="#blitz-mode" className="hover:text-gray-300">Blitz Mode (Focus Session)</a></li>
          <li className="mb-2"><a href="#alerts" className="hover:text-gray-300">Alert Settings</a></li>
          <li className="mb-2"><a href="#celebration" className="hover:text-gray-300">Celebration Settings</a></li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
