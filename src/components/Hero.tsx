import React from 'react';
import { useNavigate } from 'react-router-dom';

const Hero: React.FC = () => {
  const navigate = useNavigate();
  return (
    <section className="relative text-center overflow-hidden py-20">
      {/* Background Gradients */}
      <div
        className="absolute top-0 left-0 w-1/2 h-full"
        style={{
          backgroundImage: 'radial-gradient(ellipse at top left, rgba(255, 107, 53, 0.3) 0%, transparent 50%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-1/2 h-full"
        style={{
          backgroundImage: 'radial-gradient(ellipse at top right, rgba(88, 86, 214, 0.3) 0%, transparent 50%)',
        }}
      />
       <div
        className="absolute bottom-0 left-1/4 w-1/2 h-1/2"
        style={{
          backgroundImage: 'radial-gradient(ellipse at bottom, rgba(52, 199, 89, 0.2) 0%, transparent 60%)',
        }}
      />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-6xl font-bold text-white leading-tight">
          Stop Staring at Your To-Do List. <br /> Start Conquering It.
        </h2>
        <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-3xl mx-auto">
          Promodoro isn't just another task tracker. It's your personal focus system that fuses your daily tasks with the proven Pomodoro technique. Stop the multitasking chaos and experience the power of deep, uninterrupted work.
        </p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold mt-8"
        >
          Start Your First Focused Session
        </button>
      </div>
    </section>
  );
};

export default Hero;
