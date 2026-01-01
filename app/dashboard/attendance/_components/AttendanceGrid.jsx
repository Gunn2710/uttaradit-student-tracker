"use client"
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import moment from 'moment';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];

function AttendanceGrid({ attadanceList, selectedMonth, canEdit = false }) {
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);

    // Calculate days in month properly
    const getDaysInMonth = () => {
        if (!selectedMonth) return 31;
        const year = moment(selectedMonth).year();
        const month = moment(selectedMonth).month(); // 0-indexed
        return new Date(year, month + 1, 0).getDate();
    };

    const numberOfDays = getDaysInMonth();
    const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    useEffect(() => {
        const baseCols = [
            { field: 'studentId', headerName: 'รหัส/ID', filter: true, width: 80, pinned: 'left' },
            { field: 'name', headerName: 'ชื่อ/Name', filter: true, width: 150, pinned: 'left' },
        ];

        if (attadanceList && attadanceList.length > 0) {
            const userList = getUniqueRecord();

            // Create day columns - only editable if canEdit
            const dayCols = daysArrays.map((date) => ({
                field: date.toString(),
                headerName: date.toString(),
                width: 50,
                editable: canEdit, // Only allow editing if user has permission
                cellRenderer: (params) => {
                    return params.value ? '✓' : '';
                }
            }));

            // Set attendance data for each user
            userList.forEach(obj => {
                daysArrays.forEach((date) => {
                    obj[date] = isPresent(obj.studentId, date);
                });
            });

            setColDefs([...baseCols, ...dayCols]);
            setRowData(userList);
        } else {
            setColDefs(baseCols);
            setRowData([]);
        }
    }, [attadanceList, selectedMonth, numberOfDays, canEdit]);

    /**
     * Used to check if user present or not
     */
    const isPresent = (studentId, day) => {
        const result = attadanceList?.find(item => item.day === day && item.studentId === studentId);
        return result ? true : false;
    }

    /**
     * Used to get Distinct User List
     */
    const getUniqueRecord = () => {
        const uniqueRecord = [];
        const existingUser = new Set();

        attadanceList?.forEach(record => {
            if (!existingUser.has(record.studentId)) {
                existingUser.add(record.studentId);
                uniqueRecord.push({ 
                    studentId: record.studentId,
                    name: record.name,
                    grade: record.grade
                });
            }
        });

        return uniqueRecord;
    }

    /**
     * Used to mark student attendance
     */
    const onMarkAttendance = (day, studentId, presentStatus) => {
        if (!canEdit) {
            toast.error('คุณไม่มีสิทธิ์แก้ไขการเข้าเรียน/You do not have permission to edit attendance');
            return;
        }

        const date = moment(selectedMonth).format('MM/YYYY');
        
        if (presentStatus) {
            const data = {
                day: parseInt(day),
                studentId: studentId,
                present: true,
                date: date
            };

            GlobalApi.MarkAttendance(data).then(resp => {
                console.log(resp);
                toast("รหัสนักเรียน:" + studentId + " บันทึกเข้าเรียนแล้ว/Marked as present");
            }).catch(err => {
                console.error(err);
                toast.error("บันทึกไม่สำเร็จ/Failed to mark attendance");
            });
        } else {
            GlobalApi.MarkAbsent(studentId, day, date)
                .then(resp => {
                    toast("รหัสนักเรียน:" + studentId + " บันทึกขาดเรียน/Marked as absent");
                }).catch(err => {
                    console.error(err);
                    toast.error("บันทึกไม่สำเร็จ/Failed to mark absent");
                });
        }
    }

    const defaultColDef = useMemo(() => ({
        sortable: true,
        resizable: true,
    }), []);

    // Custom theme for dark mode compatibility
    const myTheme = themeQuartz.withParams({
        backgroundColor: 'var(--background)',
        foregroundColor: 'var(--foreground)',
        headerBackgroundColor: 'var(--muted)',
        headerTextColor: 'var(--foreground)',
        oddRowBackgroundColor: 'var(--background)',
        borderColor: 'var(--border)',
    });

    if (!attadanceList) {
        return (
            <div className='my-7 p-10 text-center border rounded-lg'>
                <p className='text-muted-foreground'>เลือกเดือนและระดับชั้น แล้วกดค้นหาเพื่อดูการเข้าเรียน/Select a month and grade, then click Search to view attendance.</p>
            </div>
        );
    }

    if (attadanceList.length === 0) {
        return (
            <div className='my-7 p-10 text-center border rounded-lg'>
                <p className='text-muted-foreground'>
                    ไม่พบนักเรียนในระดับชั้นนี้/No students found for this grade. {canEdit ? 'กรุณาเพิ่มนักเรียนก่อน/Add students first.' : 'ติดต่อผู้ดูแลระบบ/Contact an administrator.'}
                </p>
            </div>
        );
    }

    return (
        <div className='my-5'>
            <div style={{ height: 500, width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    onCellValueChanged={(e) => onMarkAttendance(e.colDef.field, e.data.studentId, e.newValue)}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    theme={myTheme}
                    domLayout="normal"
                />
            </div>
        </div>
    );
}

export default AttendanceGrid
