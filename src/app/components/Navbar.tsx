"use client"
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const user = auth.currentUser;
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <p className="text-white font-bold text-xl">DM-Advantage</p>
        <button onClick={toggleMenu} className="text-white md:hidden">
          ☰
        </button>
      </div>
      <div className={`space-y-2 mt-4 md:space-y-0 md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'} md:block`}>
        <a href="/SignUp" className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          SignUp
        </a>
        <a href="/characters" className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          Character
        </a>
        <a href="/MyCharacterPage" className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          Account
        </a>
        <a href="/CharacterBrowser" className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          Browse
        </a>
        <a href="/checkout" className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
          Store
        </a>
      </div>
    </div>
  );
};

export default NavBar;
