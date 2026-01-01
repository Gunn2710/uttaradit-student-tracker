import { supabase } from "@/utils";
import { NextResponse } from "next/server";

export async function GET(req) {
    const searchParams = req.nextUrl.searchParams;
    const date = searchParams.get('date');
    const grade = searchParams.get('grade');

    // Get students for the grade
    const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id')
        .eq('grade', grade);

    if (studentsError) {
        return NextResponse.json({ error: studentsError.message }, { status: 500 });
    }

    const studentIds = students.map(s => s.id);

    // Get attendance counts grouped by day
    const { data: attendance, error: attendanceError } = await supabase
        .from('attendance')
        .select('day')
        .eq('date', date)
        .eq('present', true)
        .in('student_id', studentIds);

    if (attendanceError) {
        return NextResponse.json({ error: attendanceError.message }, { status: 500 });
    }

    // Group by day and count
    const dayCounts = {};
    attendance.forEach(record => {
        dayCounts[record.day] = (dayCounts[record.day] || 0) + 1;
    });

    // Convert to array format and get last 7 days
    const result = Object.entries(dayCounts)
        .map(([day, presentCount]) => ({
            day: parseInt(day),
            presentCount: presentCount.toString()
        }))
        .sort((a, b) => b.day - a.day)
        .slice(0, 7);

    return NextResponse.json(result);
}
