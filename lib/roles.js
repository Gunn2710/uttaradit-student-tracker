// Role constants
export const ROLES = {
    ADMIN: 'admin',
    EDITOR: 'editor',
    VIEWER: 'viewer',
};

// Your admin email - users with this email automatically get admin role
export const ADMIN_EMAILS = [
    'gsukhum@gmail.com', // Add your email here
];

/**
 * Check if user has at least the required role
 * Hierarchy: admin > editor > viewer
 */
export function hasRole(userRole, requiredRole) {
    const roleHierarchy = {
        [ROLES.ADMIN]: 3,
        [ROLES.EDITOR]: 2,
        [ROLES.VIEWER]: 1,
    };

    const userLevel = roleHierarchy[userRole] || 0;
    const requiredLevel = roleHierarchy[requiredRole] || 0;

    return userLevel >= requiredLevel;
}

/**
 * Check if user can edit (admin or editor)
 */
export function canEdit(userRole) {
    return hasRole(userRole, ROLES.EDITOR);
}

/**
 * Check if user is admin
 */
export function isAdmin(userRole) {
    return userRole === ROLES.ADMIN;
}

/**
 * Get user's role from Clerk metadata
 */
export function getUserRole(user) {
    if (!user) return ROLES.VIEWER;
    
    // Check if user email is in admin list
    const userEmail = user.emailAddresses?.[0]?.emailAddress || user.primaryEmailAddress?.emailAddress;
    if (userEmail && ADMIN_EMAILS.includes(userEmail)) {
        return ROLES.ADMIN;
    }
    
    // Get role from public metadata
    return user.publicMetadata?.role || ROLES.VIEWER;
}

