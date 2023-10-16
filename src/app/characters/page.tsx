import React from 'react';
import NavBar from '../components/Navbar';
import Form from '../components/characterForm/Form';
import '../styles/globals.css';

const Page = () => {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/CharacterformBG.png')",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="sticky top-0 z-50 mb-8">
        <NavBar />
      </div>
      <div className="flex-grow flex items-center justify-center mt-8">
        <div className="parchment-container">
          <Form />
        </div>
      </div>
    </div>
  );
};

export default Page;
