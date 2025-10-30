import React from 'react';

const SocialProof: React.FC = () => {
  return (
    <section className="container mx-auto px-4 py-20">
      <h3 className="text-4xl font-bold text-center text-white">
        Stop Managing Tasks. Start Finishing Them.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        {/* Testimonial 1 */}
        <div className="bg-card p-6 rounded-lg">
          <p className="text-muted-foreground">"I used to live in 'I'll do it later' anxiety. Promodoro is my 'I'll do it now' button. Knowing the timer is on just... works. I'm finally getting ahead on my work."</p>
          <p className="text-white font-semibold mt-4">— Alex M., Freelance Writer</p>
        </div>
        {/* Testimonial 2 */}
        <div className="bg-card p-6 rounded-lg">
          <p className="text-muted-foreground">"My brain always had 20 tabs open. Promodoro forced me to do one thing at a time. The result? I'm getting twice as much done, and I feel less stressed than ever."</p>
          <p className="text-white font-semibold mt-4">— Sarah J., Developer</p>
        </div>
        {/* Testimonial 3 */}
        <div className="bg-card p-6 rounded-lg">
          <p className="text-muted-foreground">"That 10-page paper felt impossible. I used Promodoro to break it down. 6 Pomodoros later, the first draft was done. This app is a game-changer for finals."</p>
          <p className="text-white font-semibold mt-4">— David K., University Student</p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
