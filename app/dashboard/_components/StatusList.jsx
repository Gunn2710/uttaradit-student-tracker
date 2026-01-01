"use client"
import moment from 'moment';
import React, { useEffect, useState } from 'react'
import Card from './Card';
import { GraduationCap, TrendingDown, TrendingUp } from 'lucide-react';

function StatusList({ attendanceList }) {
    const [totalStudent, setTotalStudent] = useState(0);
    const [presentPerc, setPresentPerc] = useState(0);

    useEffect(() => {
        console.log('StatusList received:', attendanceList);
        
        if (attendanceList && attendanceList.length > 0) {
            // Get unique students
            const uniqueStudents = getUniqueStudents(attendanceList);
            setTotalStudent(uniqueStudents.length);

            // Count present records (where day is not null means they have attendance)
            const presentRecords = attendanceList.filter(record => record.day !== null && record.present === true);
            const today = moment().date();
            
            // Calculate percentage
            const totalPossibleAttendance = uniqueStudents.length * today;
            const percentage = totalPossibleAttendance > 0 
                ? (presentRecords.length / totalPossibleAttendance) * 100 
                : 0;
            
            setPresentPerc(Math.min(percentage, 100)); // Cap at 100%
        } else {
            setTotalStudent(0);
            setPresentPerc(0);
        }
    }, [attendanceList])

    const getUniqueStudents = (list) => {
        const seen = new Set();
        return list.filter(record => {
            if (seen.has(record.studentId)) return false;
            seen.add(record.studentId);
            return true;
        });
    };

    return (
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-6'>
            <Card icon={<GraduationCap />} title='นักเรียนทั้งหมด/Total Students' value={totalStudent} />
            <Card icon={<TrendingUp />} title='อัตราการเข้าเรียน/Attendance Rate' value={presentPerc.toFixed(1) + '%'} />
            <Card icon={<TrendingDown />} title='อัตราการขาดเรียน/Absence Rate' value={(100 - presentPerc).toFixed(1) + "%"} />
        </div>
    )
}

export default StatusList
