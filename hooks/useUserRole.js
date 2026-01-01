"use client"
import { useUser } from '@clerk/nextjs';
import { getUserRole, canEdit, isAdmin, ROLES } from '@/lib/roles';

export function useUserRole() {
    const { user, isLoaded } = useUser();
    
    const role = getUserRole(user);
    
    return {
        role,
        isLoaded,
        isAdmin: isAdmin(role),
        canEdit: canEdit(role),
        isViewer: role === ROLES.VIEWER,
        user,
    };
}

