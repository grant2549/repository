import { FC } from 'react';
import Head from 'next/head';
import NavBar from './components/Navbar';
import 'tailwindcss/tailwind.css';
import Link from 'next/link';

interface PageProps {}

const Home: FC<PageProps> = ({}) => {
  return (
    <>
      <Head>
        <title>DM-Advantage | Closed Alpha</title>
        <meta name="description" content="DM-Advantage - Closed Alpha" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <NavBar />
      <div
        className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-blue-400 to-indigo-700 bg-fixed bg-cover"
        style={{ backgroundImage: 'url(/temp%20image%20homepage.png)' }}
      >
        <div className="text-center mt-20 px-4">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-8">
            Welcome to the Closed Alpha for DM-Advantage
          </h1>
        </div>
        <div className="mt-8 px-4">
          <Link href="/SignUp">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full text-sm md:text-base">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gradient-to-r from-yellow-300 to-yellow-500 rounded-lg shadow-md p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">Project Update</h2>
            <p>
              I am ready for a soft launch to increase my own personal motivation.
            </p>
          </div>
          <div className="bg-gradient-to-r from-purple-300 to-purple-500 rounded-lg shadow-md p-6">
            <h2 className="text-lg md:text-xl font-bold mb-4">How to Use DM-Advantage</h2>
            <p>
              Sign up and create a character!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
