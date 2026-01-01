"use client"
import GradeSelect from '@/app/_components/GradeSelect'
import MonthSelection from '@/app/_components/MonthSelection'
import GlobalApi from '@/app/_services/GlobalApi'
import { Button } from '@/components/ui/button'
import moment from 'moment'
import React, { useState, useEffect } from 'react'
import AttendanceGrid from './_components/AttendanceGrid'
import { useUserRole } from '@/hooks/useUserRole'

function Attendance() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedGrade, setSelectedGrade] = useState('1st');
    const [attendanceList, setAttendanceList] = useState();
    const [loading, setLoading] = useState(false);
    const { canEdit } = useUserRole();

    // Auto-search on initial load
    useEffect(() => {
        onSearchHandler();
    }, []);

    /**
     * Used to fetch attendance list for given month and Grade
     */
    const onSearchHandler = () => {
        setLoading(true);
        const month = moment(selectedMonth).format('MM/YYYY');
        GlobalApi.GetAttendanceList(selectedGrade, month)
            .then(resp => {
                console.log('Attendance data:', resp.data);
                setAttendanceList(resp.data);
            })
            .catch(err => {
                console.error('Error fetching attendance:', err);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return (
        <div className='p-4 md:p-10'>
            <h2 className='text-xl md:text-2xl font-bold'>การเข้าเรียน/Attendance</h2>

            {/* Search option  */}
            <div className='flex gap-3 md:gap-5 my-5 p-3 md:p-5 border rounded-lg shadow-sm flex-wrap'>
                <div className='flex gap-2 items-center'>
                    <label className='text-sm md:text-base'>เดือน/Month:</label>
                    <MonthSelection selectedMonth={(value) => setSelectedMonth(value)} />
                </div>
                <div className='flex gap-2 items-center'>
                    <label className='text-sm md:text-base'>ระดับชั้น/Grade:</label>
                    <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
                </div>
                <Button
                    onClick={() => onSearchHandler()}
                    disabled={loading}
                >
                    {loading ? 'Loading...' : 'ค้นหา/Search'}
                </Button>
            </div>

            {/* Student Attendance Grid  */}
            <AttendanceGrid 
                attadanceList={attendanceList}
                selectedMonth={selectedMonth}
                canEdit={canEdit}
            />
        </div>
    )
}

export default Attendance
