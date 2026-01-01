"use client"
import React, { useEffect, useState } from 'react'
import MonthSelection from '../_components/MonthSelection'
import GradeSelect from '../_components/GradeSelect'
import GlobalApi from '../_services/GlobalApi'
import moment from 'moment'
import StatusList from './_components/StatusList'
import BarChartComponent from './_components/BarChartComponent'
import PieChartComponent from './_components/PieChartComponent'

function Dashboard() {
    const [selectedMonth, setSelectedMonth] = useState(new Date());
    const [selectedGrade, setSelectedGrade] = useState('1st');
    const [attendanceList, setAttendanceList] = useState([]);
    const [totalPresentData, setTotalPresentData] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch data when month or grade changes
    useEffect(() => {
        if (selectedMonth && selectedGrade) {
            fetchDashboardData();
        }
    }, [selectedMonth, selectedGrade]);

    const fetchDashboardData = () => {
        setLoading(true);
        const month = moment(selectedMonth).format('MM/YYYY');
        
        Promise.all([
            GlobalApi.GetAttendanceList(selectedGrade, month),
            GlobalApi.TotalPresentCountByDay(month, selectedGrade)
        ])
        .then(([attendanceResp, presentCountResp]) => {
            console.log('Attendance:', attendanceResp.data);
            console.log('Present count:', presentCountResp.data);
            setAttendanceList(attendanceResp.data || []);
            setTotalPresentData(presentCountResp.data || []);
        })
        .catch(err => {
            console.error('Error fetching dashboard data:', err);
        })
        .finally(() => {
            setLoading(false);
        });
    };

    return (
        <div className='p-4 md:p-10'>
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-4'>
                <h2 className='font-bold text-xl md:text-2xl'>แดชบอร์ด/Dashboard</h2>

                <div className='flex items-center gap-2 md:gap-4 flex-wrap'>
                    <MonthSelection selectedMonth={setSelectedMonth} />
                    <GradeSelect selectedGrade={(v) => setSelectedGrade(v)} />
                </div>
            </div>

            {loading ? (
                <div className='my-6 text-center'>กำลังโหลด.../Loading...</div>
            ) : (
                <>
                    <StatusList attendanceList={attendanceList} />

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
                        <div className='md:col-span-2'>
                            <BarChartComponent 
                                attendanceList={attendanceList}
                                totalPresentData={totalPresentData}
                            />
                        </div>
                        <div>
                            <PieChartComponent attendanceList={attendanceList} />
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}

export default Dashboard
