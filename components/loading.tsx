'use client'
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Loading = () => {
  const {nextUrl} = useParams();
  const router = useRouter();

  useEffect(() => {
    if(nextUrl) {
      setTimeout(() => {
        router.push('/' + nextUrl);
      }, 8000);
    }
  }, [])


  return (
    <div className='flex justify-center items-center h-[80vh]'>
      <div className='animate-spin rounded-full h-14 w-14 border-2'></div>
    </div>
  )
}

export default Loading
