"use client"
import { useUser, SignInButton } from '@clerk/nextjs'
import { GraduationCap, Hand, LayoutIcon, Shield, LogIn, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useUserRole } from '@/hooks/useUserRole'
import { ROLES } from '@/lib/roles'
import { Button } from '@/components/ui/button'

function MobileNav({ isOpen, onClose }) {
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
            return <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900 text-blue-200">แขก/Guest</span>;
        }
        switch (role) {
            case ROLES.ADMIN:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-red-900 text-red-200">ผู้ดูแล/Admin</span>;
            case ROLES.EDITOR:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-green-900 text-green-200">ผู้แก้ไข/Editor</span>;
            default:
                return <span className="text-xs px-2 py-0.5 rounded-full bg-gray-700 text-gray-200">ผู้ชม/Viewer</span>;
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div 
                className="fixed inset-0 bg-black/50 z-40 md:hidden"
                onClick={onClose}
            />
            
            {/* Slide-out Menu */}
            <div className="fixed inset-y-0 left-0 w-72 bg-background border-r shadow-xl z-50 md:hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <Image src={'/logo.svg'} width={40} height={40} alt='logo' />
                    <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Menu Items */}
                <div className="flex-1 p-4 overflow-y-auto">
                    {menuList.map((menu) => (
                        <Link href={menu.path} key={menu.id} onClick={onClose}>
                            <div className={`flex items-center gap-3 p-3 rounded-lg my-1
                                text-slate-400
                                hover:bg-primary hover:text-white
                                ${path === menu.path && 'bg-primary text-white'}
                            `}>
                                <menu.icon className="h-5 w-5" />
                                <span className="text-sm">{menu.name}</span>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* User Section */}
                <div className="border-t p-4">
                    {isSignedIn ? (
                        <div className="flex gap-3 items-center">
                            {user?.imageUrl && (
                                <Image 
                                    src={user.imageUrl} 
                                    width={35}
                                    height={35}
                                    alt='user'
                                    className='rounded-full' 
                                />
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{user?.firstName} {user?.lastName}</p>
                                <p className="text-xs text-slate-400 truncate">{user?.primaryEmailAddress?.emailAddress}</p>
                                <div className="mt-1">{getRoleBadge()}</div>
                            </div>
                        </div>
                    ) : (
                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                                    <LogIn className="w-4 h-4 text-slate-400" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">ผู้ใช้แขก/Guest</p>
                                    <div className="mt-0.5">{getRoleBadge()}</div>
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
        </>
    );
}

export default MobileNav

