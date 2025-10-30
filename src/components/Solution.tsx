import React from 'react';
import { ListChecks, Zap, Coffee } from 'lucide-react';

const Solution: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <h3 className="text-4xl font-bold text-center text-white">
        Focus. Complete. Repeat.
      </h3>
      <p className="text-lg text-muted-foreground mt-4 max-w-2xl mx-auto text-center">
        Promodoro transforms your overwhelming "wishlist" into a simple, actionable battle plan. It's built on one core belief: True productivity comes from dedicated, single-tasked focus.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-12">
        {/* Feature 1 */}
        <div className="text-center">
          <ListChecks className="mx-auto h-12 w-12 text-primary" />
          <h4 className="text-2xl font-bold text-white mt-4">Plan Your Attack</h4>
          <p className="text-muted-foreground mt-2">Start with Clarity.</p>
          <p className="text-muted-foreground mt-2">Quickly list your tasks for the day. No complex projects, no "next week." Just a clear, simple list of what matters today.</p>
        </div>
        {/* Feature 2 */}
        <div className="text-center">
          <Zap className="mx-auto h-12 w-12 text-primary" />
          <h4 className="text-2xl font-bold text-white mt-4">Ignite Your Focus</h4>
          <p className="text-muted-foreground mt-2">Beat Procrastination.</p>
          <p className="text-muted-foreground mt-2">Pick a task and start your 25-minute Pomodoro timer. For the next 25 minutes, your only job is that one task. No emails. No distractions. Just pure, deep work.</p>
        </div>
        {/* Feature 3 */}
        <div className="text-center">
          <Coffee className="mx-auto h-12 w-12 text-primary" />
          <h4 className="text-2xl font-bold text-white mt-4">Recharge Intelligently</h4>
          <p className="text-muted-foreground mt-2">Prevent Burnout.</p>
          <p className="text-muted-foreground mt-2">When the timer rings, you've earned a 5-minute break. Walk around, grab water, and reset. Promodoro reminds you to rest, so you can come back 100% fresh for the next sprint.</p>
        </div>
      </div>
    </section>
  );
};

export default Solution;
