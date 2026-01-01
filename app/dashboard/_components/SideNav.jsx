"use client"
import { useUser } from '@clerk/nextjs'
import { GraduationCap, Hand, LayoutIcon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function SideNav() {

  const { user } = useUser();
  const menuList=[
    {
      id:1,
      name:'แดชบอร์ด/Dashboard',
      icon:LayoutIcon,
      path:'/dashboard'
    },
    {
      id:2,
      name:'นักเรียน/Students',
      icon:GraduationCap,
      path:'/dashboard/students'
    },
    {
      id:3,
      name:'การเข้าเรียน/Attendance',
      icon:Hand,
      path:'/dashboard/attendance'
    },

  ]
  const path=usePathname();
  useEffect(()=>{
    console.log(path)
  },[path])
  return (
    <div className='border shadow-md h-screen p-5'>
        <Image src={'/logo.svg'} 
        width={50} 
        height={50} 
        alt='logo' />

      <hr className='my-5'></hr>

      {menuList.map((menu,index)=>(
        <Link href={menu.path} key={menu.id}>
          <h2 className={`flex items-center gap-3 text-md p-4
          text-slate-500
          hover:bg-primary
          hover:text-white
          cursor-pointer
          rounded-lg
          my-2
          ${path==menu.path&&'bg-primary text-white'}
          `}>
              <menu.icon/>
              {menu.name}
          </h2>
        </Link>
      ))}

      <div className='flex gap-2 items-center bottom-5 fixed p-2'>
        {user?.imageUrl && (
          <Image src={user.imageUrl} width={35}
          height={35}
          alt='user'
          className='rounded-full'/>
        )}
        <div>
          <h2 className='text-sm font-bold'>{user?.firstName} {user?.lastName}</h2>
          <h2 className='text-xs text-slate-400'>{user?.primaryEmailAddress?.emailAddress}</h2>
        </div>
      </div>

    </div>
  )
}

export default SideNav
