'use client';
import { FC } from 'react'
import SignUpPage  from '../components/SignUpPage'
import NavBar from '../components/Navbar'
import '../styles/globals.css';

interface PageProps {}

const page: FC<PageProps> = ({}) => {

return <div>
    <NavBar/>
    <SignUpPage/>
    </div>

}
export default page