import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light p-2 border-top text-center">
      &copy; {new Date().getFullYear()} ERN App
    </footer>
  );
};

export default Footer;
