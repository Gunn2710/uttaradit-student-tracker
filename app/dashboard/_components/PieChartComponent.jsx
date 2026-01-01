"use client"
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts'

const COLORS = ['#4c8cf8', '#f87171'];

const testData = [
    { name: 'Present', value: 75 },
    { name: 'Absent', value: 25 },
];

function PieChartComponent({ attendanceList }) {
    const [data, setData] = useState(testData);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        const realData = calculateData();
        if (realData) {
            setData(realData);
        }
    }, [attendanceList]);

    const getUniqueStudents = (list) => {
        if (!list || list.length === 0) return [];
        const seen = new Set();
        return list.filter(record => {
            if (seen.has(record.studentId)) return false;
            seen.add(record.studentId);
            return true;
        });
    };

    const calculateData = () => {
        if (!attendanceList || attendanceList.length === 0) {
            return null;
        }

        const uniqueStudents = getUniqueStudents(attendanceList);
        const totalStudentCount = uniqueStudents.length;

        if (totalStudentCount === 0) {
            return null;
        }

        const presentRecords = attendanceList.filter(record => record.day !== null && record.present === true);
        const today = moment().date();

        const totalPossibleAttendance = totalStudentCount * today;
        let presentPerc = totalPossibleAttendance > 0
            ? (presentRecords.length / totalPossibleAttendance) * 100
            : 0;

        presentPerc = Math.min(presentPerc, 100);

        return [
            { name: 'Present', value: Number(presentPerc.toFixed(1)) },
            { name: 'Absent', value: Number((100 - presentPerc).toFixed(1)) },
        ];
    };

    if (!mounted) {
        return (
            <div className='border p-5 rounded-lg'>
                <h2 className='font-bold text-lg mb-4'>การเข้าเรียนรายเดือน/Monthly Attendance</h2>
                <div style={{ height: 300 }} className='flex items-center justify-center'>Loading...</div>
            </div>
        );
    }

    return (
        <div className='border p-5 rounded-lg'>
            <h2 className='font-bold text-lg mb-4'>การเข้าเรียนรายเดือน/Monthly Attendance</h2>
            <div className='flex justify-center'>
                <PieChart width={300} height={300}>
                    <Pie
                        data={data}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        label={({ name, value }) => `${value}%`}
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Legend />
                </PieChart>
            </div>
        </div>
    )
}

export default PieChartComponent
