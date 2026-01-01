"use client"
import { useUserRole } from '@/hooks/useUserRole'
import { Eye } from 'lucide-react'

function ViewerBanner() {
    const { isViewer, isLoaded } = useUserRole();

    if (!isLoaded || !isViewer) return null;

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

export default ViewerBanner

