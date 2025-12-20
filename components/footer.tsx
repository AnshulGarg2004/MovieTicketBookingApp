import { Mail, Phone } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
    return (
         <footer className="px-6 pt-8 md:px-16 text-2xl lg:px-36 w-full text-gray-300">
            <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-gray-500 pb-10">
                <div className="md:max-w-96">
                    <h1 className='text-2xl font-bold'>ShowSphere</h1>
                     <p className="mt-6 text-sm">
                      ShowSphere is your one-stop destination for discovering movies, watching trailers, and booking tickets seamlessly. Experience cinema like never before.ShowSphere — Discover. Watch. Book. Experience cinema your way. 
                       </p>
                    <div className="flex items-center gap-2 mt-4">
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/googlePlayBtnBlack.svg" alt="google play" className=" cursor-pointer h-12 w-auto border border-white rounded" />
                        <img src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/refs/heads/main/assets/appDownload/appleStoreBtnBlack.svg" alt="app store" className="h-12 cursor-pointer w-auto border border-white rounded" />
                    </div>
                </div>
                <div className="flex-1 flex items-start md:justify-end gap-20 md:gap-40">
                    <div>
                        <h2 className="font-semibold mb-5">Company</h2>
                        <div className="text-lg flex flex-col gap-2 space-y-2">
                            <Link href="/home">Home</Link>
                            <Link href="/about">About us</Link>
                            <Link href="/contact">Contact us</Link>
                            <Link href="/privacy">Privacy policy</Link>
                        </div>
                    </div>
                    <div>
                        <h2 className="font-semibold mb-5">Get in touch</h2>
                        <div className="text-sm space-y-2">
                            <p><Phone className='inline' /> +91 123456789</p>
                            <p><Mail className='inline' /> ganshul2004@gmail.com</p>
                        </div>
                    </div>
                </div>
            </div>
            <p className="pt-4 text-center text-sm pb-5">
                Copyright {new Date().getFullYear()} © <Link href="/home">ShowSphere</Link>. All Right Reserved.
            </p>
        </footer>
    )
}

export default Footer
