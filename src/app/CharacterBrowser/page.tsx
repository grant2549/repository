import React, { FC } from 'react';
import CharacterBrowser from '../components/CharacterBrowser';
import NavBar from '../components/Navbar';
import { useAuth } from '../components/AuthHandler';
import '../styles/globals.css';

interface Props {}

const Page: FC<Props> = ({}) => {
  const bgImageStyle = {
  };

  return (
    <div style={bgImageStyle}>
      <NavBar />
      <CharacterBrowser />
    </div>
  );
};

export default Page;
