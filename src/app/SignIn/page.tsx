'use client';
import { FC, useState, useEffect } from 'react';
import SignInPage from '../components/SignInPage';
import { useAuth } from '../components/AuthHandler';
import NavBar from '../components/Navbar';
import '../styles/globals.css';

interface PageProps {}

const Page: FC<PageProps> = ({}) => {
  const [isClient, setIsClient] = useState(false);
  const user = useAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return null; // or a loading spinner or message
  }

  return (
    <div>
      <NavBar/>
      <SignInPage />
    </div>
  );
};

export default Page;
