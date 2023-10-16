import { useState } from 'react';
import Link from 'next/link';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import '../styles/globals.css';

const SignInPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const auth = getAuth(app);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log('Signed in user:', user);
        // Navigate to the homepage
        window.location.replace('/');
      })
      .catch((error) => {
        const errorMessage = error.message;
        setError(errorMessage);
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-red-600 to-black">
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Sign In</h2>
        <form onSubmit={handleSignIn}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="email">
              Email:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 font-bold mb-2" htmlFor="password">
              Password:
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        {error && <p className="text-red-500">{error}</p>}
        <p className="mt-4 text-center">
          Don&apos;t have an account yet?{' '}
          <Link href="/SignUp">
            <span className="text-blue-500 hover:text-blue-700">Sign Up</span>
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignInPage;
