import Link from 'next/link'
import React from 'react'

const Page = () => {
    return (
        <>
        
            <div>
                <h1 className='m-20 text-6xl p-5'>
                    ShowSphere
                </h1>
                <p className='text-2xl mt-20 px-20'>Where every show feels like a premiere.</p>

                <Link href="/home" className='px-10 py-5 border rounded-2xl mx-20 my-10 inline-block cursor-pointer'>Book Now</Link>
            </div>
        </>
    )
}

export default Page
