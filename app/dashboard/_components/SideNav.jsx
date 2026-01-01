"use client"
import { useUser, SignInButton } from '@clerk/nextjs'
import { GraduationCap, Hand, LayoutIcon, Shield, LogIn } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useUserRole } from '@/hooks/useUserRole'
import { ROLES } from '@/lib/roles'
import { Button } from '@/components/ui/button'

function SideNav() {
    const { user, isSignedIn } = useUser();
    const { role, isAdmin, isGuest } = useUserRole();
    const path = usePathname();

    const menuList = [
        {
            id: 1,
            name: 'แดชบอร์ด/Dashboard',
            icon: LayoutIcon,
            path: '/dashboard'
        },
        {
            id: 2,
            name: 'นักเรียน/Students',
            icon: GraduationCap,
            path: '/dashboard/students'
        },
        {
            id: 3,
            name: 'การเข้าเรียน/Attendance',
            icon: Hand,
            path: '/dashboard/attendance'
        },
    ];

    // Add admin menu item if user is admin
    if (isAdmin) {
        menuList.push({
            id: 4,
            name: 'จัดการผู้ใช้/Admin',
            icon: Shield,
            path: '/dashboard/admin'
        });
    }

    const getRoleBadge = () => {
        if (isGuest) {
            return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200">แขก/Guest</span>;
        }
        switch (role) {
            case ROLES.ADMIN:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200">ผู้ดูแล/Admin</span>;
            case ROLES.EDITOR:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200">ผู้แก้ไข/Editor</span>;
            default:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-200">ผู้ชม/Viewer</span>;
        }
    };

    return (
        <div className='border shadow-md h-screen p-5 flex flex-col'>
            <Image src={'/logo.svg'}
                width={50}
                height={50}
                alt='logo' />

            <hr className='my-5'></hr>

            <div className='flex-1'>
                {menuList.map((menu) => (
                    <Link href={menu.path} key={menu.id}>
                        <h2 className={`flex items-center gap-3 text-md p-4
                            text-slate-500
                            hover:bg-primary
                            hover:text-white
                            cursor-pointer
                            rounded-lg
                            my-2
                            ${path === menu.path && 'bg-primary text-white'}
                        `}>
                            <menu.icon />
                            {menu.name}
                        </h2>
                    </Link>
                ))}
            </div>

            <div className='border-t pt-4 mt-4'>
                {isSignedIn ? (
                    <div className='flex gap-2 items-center p-2'>
                        {user?.imageUrl && (
                            <Image src={user.imageUrl} width={35}
                                height={35}
                                alt='user'
                                className='rounded-full' />
                        )}
                        <div className='flex-1 min-w-0'>
                            <h2 className='text-sm font-bold truncate'>{user?.firstName} {user?.lastName}</h2>
                            <h2 className='text-xs text-slate-400 truncate'>{user?.primaryEmailAddress?.emailAddress}</h2>
                            <div className='mt-1'>
                                {getRoleBadge()}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='p-2'>
                        <div className='flex items-center gap-2 mb-2'>
                            <div className='w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center'>
                                <LogIn className='w-4 h-4 text-slate-500' />
                            </div>
                            <div>
                                <h2 className='text-sm font-bold'>ผู้ใช้แขก/Guest User</h2>
                                <div className='mt-0.5'>
                                    {getRoleBadge()}
                                </div>
                            </div>
                        </div>
                        <SignInButton mode="modal">
                            <Button size="sm" className="w-full">
                                เข้าสู่ระบบ/Sign In
                            </Button>
                        </SignInButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SideNav
