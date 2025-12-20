
import { useClerk, UserButton, useUser } from '@clerk/nextjs';
import { MenuIcon, SearchIcon, TicketIcon, XIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useUser();
  const { openSignIn } = useClerk();
  const router = useRouter();

  return (
    <div className='fixed top-0 left-0 w-full flex  items-center justify-between z-50 px-6 md:px-16 lg:px-36 py-6'>
      <Link href="/">ShowSphere</Link>

      <div className={`max-md:absolute max-md:top-0 max-md:left-0 max-md:font-medium max-md:text-lg z-50 flex flex-col md:flex-row items-center
         max-md:justify-center gap-8 md:px-8 py-4 max-md:h-screen md:rounded-full backdrop-blur bg-black/70 md:bg-white/10 md:border
           border-gray-300/20 overflow-hidden transition-[width] duration-300 ${isOpen ? 'max-md:w-full' : 'max-md:w-0'}`}>
        <XIcon className=' md:hidden cursor-pointer absolute w-6 top-6 right-6 h-6' onClick={() => { setIsOpen(!isOpen) }} />
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} href="/home" className='mx-4  md:inline-block cursor-pointer hover:text-gray-500 transition'>Home</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} href="/movies" className='mx-4  md:inline-block cursor-pointer hover:text-gray-500 transition'>Movies</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} href="/threatre" className='mx-4  md:inline-block cursor-pointer hover:text-gray-500 transition'>Threatre</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} href="/releases" className='mx-4  md:inline-block cursor-pointer hover:text-gray-500 transition'>Releases</Link>
        <Link onClick={() => { scrollTo(0, 0); setIsOpen(false) }} href="/favourites" className='mx-4  md:inline-block cursor-pointer hover:text-gray-500 transition'>Favourites</Link>
      </div>
      <div className='flex justify-between items-center gap-8'>
        <SearchIcon className=' max-md:ml-4 w-6 h-6 cursor-pointer' />
        {
          !user ? (
            // @ts-ignore
            <button onClick={openSignIn} className='px-4 py-1 sm:px-7 sm:py-2 cursor-pointer transition rounded-full font-medium bg-blue-500 hover:bg-blue-700'>Login!</button>
          ) : (
            <UserButton >
              <UserButton.MenuItems>
                <UserButton.Action label='My Bookings' onClick={() => router.push("/my-bookings")} labelIcon={<TicketIcon />}/>
              </UserButton.MenuItems>
            </UserButton>
          )
        }
      </div>

      <MenuIcon className='md:hidden w-8 max-md:ml-4 h-8 cursor-pointer' onClick={() => setIsOpen(!isOpen)} />
    </div>
  )
}

export default Navbar
