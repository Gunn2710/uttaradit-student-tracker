"use client"
import { useUserRole } from '@/hooks/useUserRole'
import { Eye, LogIn } from 'lucide-react'
import { SignInButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'

function ViewerBanner() {
    const { isViewer, isGuest, isLoaded } = useUserRole();

    if (!isLoaded) return null;
    
    // Guest mode banner
    if (isGuest) {
        return (
            <div className='bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-4 py-3 flex items-center justify-between gap-3 border-b border-blue-200 dark:border-blue-800'>
                <div className='flex items-center gap-3'>
                    <Eye className="h-5 w-5 flex-shrink-0" />
                    <div>
                        <span className="font-medium">Guest Mode</span>
                        <span className="hidden sm:inline"> — You're viewing as a guest. Sign in to request edit access.</span>
                    </div>
                </div>
                <SignInButton mode="modal">
                    <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <LogIn className="h-4 w-4" />
                        <span className="hidden sm:inline">Sign In</span>
                    </Button>
                </SignInButton>
            </div>
        );
    }
    
    // Viewer mode banner (signed in but no edit access)
    if (isViewer) {
        return (
            <div className='bg-yellow-100 dark:bg-yellow-900/50 text-yellow-800 dark:text-yellow-200 px-4 py-3 flex items-center gap-3 border-b border-yellow-200 dark:border-yellow-800'>
                <Eye className="h-5 w-5 flex-shrink-0" />
                <div>
                    <span className="font-medium">View Only Mode</span>
                    <span className="hidden sm:inline"> — You can browse the data but cannot make changes. Contact an administrator to request edit access.</span>
                </div>
            </div>
        );
    }

    return null;
}

export default ViewerBanner
