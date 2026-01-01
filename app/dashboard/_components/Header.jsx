"use client"
import { UserButton } from '@clerk/nextjs'
import { Menu } from 'lucide-react'
import React, { useState } from 'react'
import MobileNav from './MobileNav'
import Image from 'next/image'

function Header() {
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    return (
        <>
            <div className='p-4 shadow-sm border flex justify-between items-center'>
                {/* Left - Hamburger menu (mobile only) */}
                <div className="flex items-center gap-3">
                    <button 
                        className="md:hidden p-2 hover:bg-muted rounded-lg"
                        onClick={() => setMobileNavOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </button>
                    
                    {/* Logo on mobile */}
                    <div className="md:hidden">
                        <Image src="/logo.svg" width={32} height={32} alt="logo" />
                    </div>
                </div>

                {/* Right - User button */}
                <div>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>

            {/* Mobile Navigation */}
            <MobileNav 
                isOpen={mobileNavOpen} 
                onClose={() => setMobileNavOpen(false)} 
            />
        </>
    )
}

export default Header
