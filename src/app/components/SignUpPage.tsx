import { useState } from 'react';
import Link from 'next/link';
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../firebase';
import '../styles/globals.css';

const SignUpPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password should be at least 8 characters long.');
      return;
    }
  const auth = getAuth(app);
  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      const user = userCredential.user;
      console.log("Signed up user:", user);

      // Add coins to the user's account in Firestore
      const db = getFirestore(app);
      await setDoc(doc(db, "users", user.uid), {
        coins: 100, // Set initial amount of coins
      });

      window.location.replace('/');
    })
    .catch((error) => {
      const errorMessage = error.message;
      setError(errorMessage);
    });
};

  return (
    <div className="flex items-center justify-center h-screen">
    <div className={`font-inter inline-flex h-[547px] w-[404px] flex-col items-start gap-10 rounded-2xl bg-[#2C2D3A] px-10 pb-10 pt-12 `}>
      <div className="flex w-full flex-col items-start gap-1 self-stretch">
        <p className="w-[76px] text-center text-base font-medium leading-5 text-[#98989E]">Welcome!</p>
        <p className="w-[204px] text-left text-2xl font-bold leading-8 text-white">Create a Account</p>
      </div>
      <div className="flex w-full flex-col items-start gap-6 self-stretch">
        <input className="w-full" type="email" placeholder="E-Mail or Username" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)} />
        <input className="w-full" type="password" placeholder="Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)} />
        <input className="w-full" type="password" placeholder="Confirm Password" onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)} />
      </div>
      {error && <div className="error">{error}</div>}
      <div className="flex w-full flex-col items-start gap-[19px] self-stretch font-medium">
        <div className="flex h-12 w-full items-center justify-center self-stretch text-center text-white">
          <div className="flex h-full w-full items-center rounded-3xl bg-[#E33319] py-3.5 pl-[131px] pr-[133px]" onClick={handleSignUp}>
            <p className="h-5 w-[60px] text-base leading-5">Sign Up</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-left">
          <p className="w-[111px] text-xs leading-4 text-[#98989E]">Already a member?</p>
          <Link href="/SignIn">
            <p className="w-[76px] text-xs leading-4 text-white cursor-pointer">Login here →</p>
          </Link>
        </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;