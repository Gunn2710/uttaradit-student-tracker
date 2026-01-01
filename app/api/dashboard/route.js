import { supabase } from "@/utils";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get('date');
    const grade = searchParams.get('grade');

    console.log('Dashboard API - date:', date, 'grade:', grade);

    // Get students for the grade
    const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('grade', grade);

    if (studentsError) {
        console.error('Students error:', studentsError);
        return NextResponse.json({ error: studentsError.message }, { status: 500 });
    }

    console.log('Students found:', students?.length);

    // If no students, return empty array
    if (!students || students.length === 0) {
        return NextResponse.json([]);
    }

    const studentIds = students.map(s => s.id);

    // Get attendance records for the month
    const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('day, student_id')
        .eq('date', date)
        .eq('present', true)
        .in('student_id', studentIds);

    if (attendanceError) {
        console.error('Attendance error:', attendanceError);
        return NextResponse.json({ error: attendanceError.message }, { status: 500 });
    }

    console.log('Attendance records:', attendance?.length);

    // Group by day and count
    const dayCounts = {};
    if (attendance) {
        attendance.forEach(record => {
            dayCounts[record.day] = (dayCounts[record.day] || 0) + 1;
        });
    }

    // Convert to array format and sort by day descending
    const result = Object.entries(dayCounts)
        .map(([day, presentCount]) => ({
            day: parseInt(day),
            presentCount: presentCount.toString()
        }))
        .sort((a, b) => b.day - a.day)
        .slice(0, 7);

    console.log('Dashboard result:', result);

    return NextResponse.json(result);
}
