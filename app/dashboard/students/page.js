"use client"
import React, { useEffect, useState } from 'react'
import AddNewStudent from './_components/AddNewStudent'
import GlobalApi from '@/app/_services/GlobalApi'
import StudentListTable from './_components/StudentListTable';
import { useUserRole } from '@/hooks/useUserRole';

function Student() {
    const [studentList, setStudentList] = useState([]);
    const { canEdit, isLoaded } = useUserRole();

    useEffect(() => {
        GetAllStudents();
    }, [])

    const GetAllStudents = () => {
        GlobalApi.GetAllStudents().then(resp => {
            setStudentList(resp.data);
        })
    }

    return (
        <div className='p-4 md:p-7'>
            <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3'>
                <h2 className='font-bold text-xl md:text-2xl'>นักเรียน/Students</h2>
                {canEdit && <AddNewStudent refreshData={GetAllStudents} />}
            </div>

            <StudentListTable 
                studentList={studentList}
                refreshData={GetAllStudents}
                canEdit={canEdit}
            />
        </div>
    )
}

export default Student
