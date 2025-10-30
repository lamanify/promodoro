import React from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Problem from '../components/Problem';
import Solution from '../components/Solution';
import CoreValue from '../components/CoreValue';
import SocialProof from '../components/SocialProof';
import FinalCTA from '../components/FinalCTA';
import Footer from '../components/Footer';
import AnimatedSection from '../components/AnimatedSection';

const LandingPage: React.FC = () => {
  return (
    <div className="bg-background text-foreground font-sans antialiased">
      <Header />
      <AnimatedSection>
        <Hero />
      </AnimatedSection>
      <AnimatedSection>
        <Problem />
      </AnimatedSection>
      <AnimatedSection>
        <Solution />
      </AnimatedSection>
      <AnimatedSection>
        <CoreValue />
      </AnimatedSection>
      <AnimatedSection>
        <SocialProof />
      </AnimatedSection>
      <AnimatedSection>
        <FinalCTA />
      </AnimatedSection>
      <Footer />
    </div>
  );
};

export default LandingPage;
