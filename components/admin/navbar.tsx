import Link from 'next/link'
import React from 'react'

const AdminNavbar = () => {
    return (
        <div className='mt-5'>
            <Link href={`/`} className='text-3xl font-medium pl-15' >ShowSphere</Link>
            <hr className='mt-5' />
        </div>
    )
}

export default AdminNavbar
