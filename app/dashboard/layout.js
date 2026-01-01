import React from 'react'
import SideNav from './_components/SideNav'
import Header from './_components/Header'
import ViewerBanner from './_components/ViewerBanner'

function layout({ children }) {
    return (
        <div>
            <div className='md:w-64 fixed hidden md:block'>
                <SideNav />
            </div>
            <div className='md:ml-64 flex flex-col min-h-screen'>
                <Header />
                <ViewerBanner />
                <div className='flex-1'>
                    {children}
                </div>
            </div>
        </div>
    )
}

export default layout
