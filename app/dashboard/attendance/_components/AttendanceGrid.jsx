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

function AttendanceGrid({ attadanceList, selectedMonth }) {
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [colDefs, setColDefs] = useState([]);

    const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
    const numberOfDays = daysInMonth(
        moment(selectedMonth).format('yyyy'),
        moment(selectedMonth).format('MM')
    );
    const daysArrays = Array.from({ length: numberOfDays }, (_, i) => i + 1);

    useEffect(() => {
        const baseCols = [
            { field: 'studentId', headerName: 'ID', filter: true, width: 80, pinned: 'left' },
            { field: 'name', headerName: 'Name', filter: true, width: 150, pinned: 'left' },
        ];

        if (attadanceList && attadanceList.length > 0) {
            const userList = getUniqueRecord();

            // Create day columns
            const dayCols = daysArrays.map((date) => ({
                field: date.toString(),
                headerName: date.toString(),
                width: 50,
                editable: true,
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
    }, [attadanceList, selectedMonth]);

    /**
     * Used to check if user present or not
     */
    const isPresent = (studentId, day) => {
        const result = attadanceList?.find(item => item.day == day && item.studentId == studentId);
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
                uniqueRecord.push({ ...record });
            }
        });

        return uniqueRecord;
    }

    /**
     * Used to mark student attendance
     */
    const onMarkAttendace = (day, studentId, presentStatus) => {
        const date = moment(selectedMonth).format('MM/yyyy');
        
        if (presentStatus) {
            const data = {
                day: day,
                studentId: studentId,
                present: presentStatus,
                date: date
            };

            GlobalApi.MarkAttendance(data).then(resp => {
                console.log(resp);
                toast("Student Id:" + studentId + " Marked as present");
            }).catch(err => {
                console.error(err);
                toast.error("Failed to mark attendance");
            });
        } else {
            GlobalApi.MarkAbsent(studentId, day, date)
                .then(resp => {
                    toast("Student Id:" + studentId + " Marked as absent");
                }).catch(err => {
                    console.error(err);
                    toast.error("Failed to mark absent");
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
                <p className='text-muted-foreground'>Select a month and grade, then click Search to view attendance.</p>
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
                    onCellValueChanged={(e) => onMarkAttendace(e.colDef.field, e.data.studentId, e.newValue)}
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
