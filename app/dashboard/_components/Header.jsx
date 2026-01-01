"use client"
import { UserButton } from '@clerk/nextjs'
import React from 'react'

function Header() {
  return (
    <div className='p-4 shadow-sm border flex justify-between'>
        <div>

        </div>
        <div>
          <UserButton afterSignOutUrl="/" />
        </div>
    </div>
  )
}

export default Header
