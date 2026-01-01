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

export async function GET(req) {
    // GET is allowed for all authenticated users
    const searchParams = req.nextUrl.searchParams;
    const grade = searchParams.get('grade');
    const month = searchParams.get('month');

    // First get students for the grade
    const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, name, grade')
        .eq('grade', grade)
        .order('id', { ascending: true });

    if (studentsError) {
        return NextResponse.json({ error: studentsError.message }, { status: 500 });
    }

    // Get attendance records for the month
    const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('*')
        .eq('date', month);

    if (attendanceError) {
        return NextResponse.json({ error: attendanceError.message }, { status: 500 });
    }

    // Combine the data
    const result = students.map(student => {
        const studentAttendance = attendance.filter(a => a.student_id === student.id);
        return studentAttendance.length > 0 
            ? studentAttendance.map(a => ({
                name: student.name,
                grade: student.grade,
                studentId: student.id,
                present: a.present,
                day: a.day,
                date: a.date,
                attendanceId: a.id
            }))
            : [{
                name: student.name,
                grade: student.grade,
                studentId: student.id,
                present: null,
                day: null,
                date: null,
                attendanceId: null
            }];
    }).flat();

    return NextResponse.json(result);
}

export async function POST(req) {
    // Check permission
    const hasPermission = await checkCanEdit();
    if (!hasPermission) {
        return NextResponse.json({ error: 'Permission denied. Editor or Admin role required.' }, { status: 403 });
    }

    const data = await req.json();

    const { data: result, error } = await supabase
        .from('attendance')
        .insert({
            student_id: data.studentId,
            present: data.present,
            day: data.day,
            date: data.date
        })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(result);
}

export async function DELETE(req) {
    // Check permission
    const hasPermission = await checkCanEdit();
    if (!hasPermission) {
        return NextResponse.json({ error: 'Permission denied. Editor or Admin role required.' }, { status: 403 });
    }

    const searchParams = req.nextUrl.searchParams;
    const studentId = searchParams.get('studentId');
    const date = searchParams.get('date');
    const day = searchParams.get('day');

    const { data, error } = await supabase
        .from('attendance')
        .delete()
        .eq('student_id', studentId)
        .eq('day', day)
        .eq('date', date);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
