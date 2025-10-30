import React from 'react';

interface HeaderProps {
  onClose: () => void;
  onSave: () => void;
}

const Header: React.FC<HeaderProps> = ({ onClose, onSave }) => {
  return (
    <header className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Preferences</h1>
      <div>
        <button
          onClick={onSave}
          className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Close
        </button>
      </div>
    </header>
  );
};

export default Header;
