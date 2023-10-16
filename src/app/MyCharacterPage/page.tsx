'use client';
import React from 'react';
import UserCharacters from '../components/UserCharacters';
import NavBar from '../components/Navbar'

const MyCharactersPage: React.FC = () => {
  return (
    <div className="p-4">
      <NavBar/>
      <h1 className="text-2xl font-bold mb-4">My Characters</h1>
      <UserCharacters />
    </div>
  );
};

export default MyCharactersPage;
