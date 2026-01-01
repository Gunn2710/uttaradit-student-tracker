import { supabase } from "@/utils";
import { NextResponse } from "next/server";
import { auth, clerkClient } from '@clerk/nextjs/server';
import { ADMIN_EMAILS, ROLES, canEdit } from '@/lib/roles';

// Helper to check if user can edit
async function checkCanEdit() {
    const { userId } = await auth();
    if (!userId) return false;
    
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    const userEmail = user.emailAddresses?.[0]?.emailAddress;
    
    // Check if admin email
    if (userEmail && ADMIN_EMAILS.includes(userEmail)) return true;
    
    // Check role
    const userRole = user.publicMetadata?.role || ROLES.VIEWER;
    return canEdit(userRole);
}

export async function POST(req) {
    // Check permission
    const hasPermission = await checkCanEdit();
    if (!hasPermission) {
        return NextResponse.json({ error: 'Permission denied. Editor or Admin role required.' }, { status: 403 });
    }

    const data = await req.json();

    const { data: result, error } = await supabase
        .from('students')
        .insert({
            name: data.name,
            grade: data.grade,
            address: data.address,
            contact: data.contact
        })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(result);
}

export async function GET(req) {
    // GET is allowed for all authenticated users
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(req) {
    // Check permission
    const hasPermission = await checkCanEdit();
    if (!hasPermission) {
        return NextResponse.json({ error: 'Permission denied. Editor or Admin role required.' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    const { data, error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
