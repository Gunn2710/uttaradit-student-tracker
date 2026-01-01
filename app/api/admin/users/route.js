import { auth, clerkClient } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import { ADMIN_EMAILS, ROLES } from '@/lib/roles';

// GET - Fetch all users
export async function GET(req) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get current user to check if admin
        const client = await clerkClient();
        const currentUser = await client.users.getUser(userId);
        const currentUserEmail = currentUser.emailAddresses?.[0]?.emailAddress;
        
        // Check if user is admin
        const isAdmin = ADMIN_EMAILS.includes(currentUserEmail) || 
                       currentUser.publicMetadata?.role === ROLES.ADMIN;
        
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        // Fetch all users
        const users = await client.users.getUserList({ limit: 100 });
        
        // Format user data
        const formattedUsers = users.data.map(user => ({
            id: user.id,
            email: user.emailAddresses?.[0]?.emailAddress || 'No email',
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            role: user.publicMetadata?.role || ROLES.VIEWER,
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt,
        }));

        return NextResponse.json(formattedUsers);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

// PATCH - Update user role
export async function PATCH(req) {
    try {
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const client = await clerkClient();
        
        // Get current user to check if admin
        const currentUser = await client.users.getUser(userId);
        const currentUserEmail = currentUser.emailAddresses?.[0]?.emailAddress;
        
        // Check if user is admin
        const isAdmin = ADMIN_EMAILS.includes(currentUserEmail) || 
                       currentUser.publicMetadata?.role === ROLES.ADMIN;
        
        if (!isAdmin) {
            return NextResponse.json({ error: 'Forbidden - Admin only' }, { status: 403 });
        }

        const { targetUserId, role } = await req.json();

        if (!targetUserId || !role) {
            return NextResponse.json({ error: 'Missing targetUserId or role' }, { status: 400 });
        }

        // Validate role
        if (!Object.values(ROLES).includes(role)) {
            return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
        }

        // Update user's public metadata
        await client.users.updateUser(targetUserId, {
            publicMetadata: { role },
        });

        return NextResponse.json({ success: true, role });
    } catch (error) {
        console.error('Error updating user role:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

