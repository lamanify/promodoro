import React from 'react';

const CoreValue: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <h3 className="text-4xl font-bold text-center text-white">
        It's Not About Tracking Time. It's About Making Time Count.
      </h3>
      <div className="mt-8 text-center">
        {/* Placeholder for before and after image */}
        <div className="w-full h-64 bg-card rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Before and after screenshot placeholder</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
        <div>
          <h4 className="text-2xl font-bold text-white">Turn "Overwhelmed" into "Accomplished"</h4>
          <p className="text-muted-foreground mt-2">That huge, scary task you've been avoiding? It's just a few Pomodoros away. Our system breaks down mountains into manageable 25-minute steps. You'll build momentum with every sprint you complete.</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white">Find Your "Flow State" on Demand</h4>
          <p className="text-muted-foreground mt-2">The magic of the Pomodoro technique is its ability to silence the outside world. Promodoro is your "Do Not Disturb" sign for your brain, making it easy to enter that elusive state of deep focus where real, creative work happens.</p>
        </div>
        <div>
          <h4 className="text-2xl font-bold text-white">Finally, End the Day Feeling Done</h4>
          <p className="text-muted-foreground mt-2">Stop guessing where your time went. Promodoro gives you a tangible, visible record of your focused effort. Watch your "Completed Pomodoros" count grow, and leave work knowing you truly won the day.</p>
        </div>
      </div>
    </section>
  );
};

export default CoreValue;
