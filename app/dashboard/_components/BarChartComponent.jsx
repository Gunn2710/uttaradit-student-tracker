"use client"
import React, { useEffect, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'

// Test data
const testData = [
    { day: 'Day 1', presentCount: 5, absentCount: 2 },
    { day: 'Day 2', presentCount: 4, absentCount: 3 },
    { day: 'Day 3', presentCount: 6, absentCount: 1 },
    { day: 'Day 4', presentCount: 3, absentCount: 4 },
    { day: 'Day 5', presentCount: 7, absentCount: 0 },
];

function BarChartComponent({ attendanceList, totalPresentData }) {
    const [data, setData] = useState(testData);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const realData = formatAttendanceListCount();
        if (realData && realData.length > 0) {
            setData(realData);
        }
    }, [attendanceList, totalPresentData]);

    const getUniqueStudents = (list) => {
        if (!list || list.length === 0) return [];
        const seen = new Set();
        return list.filter(record => {
            if (seen.has(record.studentId)) return false;
            seen.add(record.studentId);
            return true;
        });
    };

    const formatAttendanceListCount = () => {
        const totalStudents = getUniqueStudents(attendanceList);
        const totalStudentCount = totalStudents.length;

        if (totalPresentData && totalPresentData.length > 0) {
            return totalPresentData.map((item) => ({
                day: 'Day ' + item.day,
                presentCount: Number(item.presentCount) || 0,
                absentCount: Math.max(0, totalStudentCount - (Number(item.presentCount) || 0))
            }));
        } else if (totalStudentCount > 0) {
            const today = new Date().getDate();
            const result = [];
            for (let i = Math.max(1, today - 6); i <= today; i++) {
                result.push({
                    day: 'Day ' + i,
                    presentCount: 0,
                    absentCount: totalStudentCount
                });
            }
            return result;
        }
        return null;
    }

    if (!mounted) {
        return (
            <div className='p-5 border rounded-lg shadow-sm'>
                <h2 className='my-2 font-bold text-lg'>การเข้าเรียนรายวัน/Daily Attendance</h2>
                <div style={{ height: 300 }} className='flex items-center justify-center'>Loading...</div>
            </div>
        );
    }

    return (
        <div className='p-5 border rounded-lg shadow-sm'>
            <h2 className='my-2 font-bold text-lg'>การเข้าเรียนรายวัน/Daily Attendance</h2>
            <div className='overflow-x-auto flex justify-center'>
                <BarChart 
                    width={500} 
                    height={300} 
                    data={data} 
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="presentCount" name="Present" fill="#4c8cf8" />
                    <Bar dataKey="absentCount" name="Absent" fill="#f87171" />
                </BarChart>
            </div>
        </div>
    )
}

export default BarChartComponent
