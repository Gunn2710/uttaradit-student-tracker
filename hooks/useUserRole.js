"use client"
import { useUser } from '@clerk/nextjs';
import { getUserRole, canEdit, isAdmin, ROLES } from '@/lib/roles';

export function useUserRole() {
    const { user, isLoaded, isSignedIn } = useUser();
    
    // If not signed in, treat as viewer (guest)
    if (isLoaded && !isSignedIn) {
        return {
            role: ROLES.VIEWER,
            isLoaded: true,
            isAdmin: false,
            canEdit: false,
            isViewer: true,
            isGuest: true,
            user: null,
        };
    }
    
    const role = getUserRole(user);
    
    return {
        role,
        isLoaded,
        isAdmin: isAdmin(role),
        canEdit: canEdit(role),
        isViewer: role === ROLES.VIEWER,
        isGuest: false,
        user,
    };
}
