import React from 'react';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  return (
    <header className="container mx-auto px-4 py-6 flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold text-white font-sans">Promodoro</h1>
      <button 
        onClick={() => navigate('/dashboard')}
        className="bg-primary text-primary-foreground px-4 py-2 md:px-6 md:py-2 rounded-full font-semibold text-sm md:text-base"
      >
        <span className="hidden md:inline">Start Your First Focused Session</span>
        <span className="md:hidden">Get Started</span>
      </button>
    </header>
  );
};

export default Header;
