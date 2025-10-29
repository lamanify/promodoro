import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground">
      <p>&copy; {new Date().getFullYear()} Promodoro. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
