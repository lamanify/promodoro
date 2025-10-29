import React from 'react';

const FinalCTA: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20 text-center">
      <h3 className="text-4xl font-bold text-white">
        Your Most Productive Day is One Click Away.
      </h3>
      <p className="text-xl text-muted-foreground mt-4 max-w-2xl mx-auto">
        Stop letting distractions steal your day. Take back control, find your focus, and feel the incredible satisfaction of a day's work, done.
      </p>
      <button className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold mt-8">
        Get Promodoro and Win Your Day
      </button>
      <p className="text-sm text-muted-foreground mt-4">Simple. Focused. No clutter. Just the tools you need to do the work.</p>
    </section>
  );
};

export default FinalCTA;
