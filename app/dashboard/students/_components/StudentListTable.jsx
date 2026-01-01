"use client"
import React, { useEffect, useState, useRef, useMemo } from 'react'
import { AgGridReact } from 'ag-grid-react';
import { AllCommunityModule, ModuleRegistry, themeQuartz } from 'ag-grid-community';
import { Search, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';

// Register AG Grid modules
ModuleRegistry.registerModules([AllCommunityModule]);

const pagination = true;
const paginationPageSize = 10;
const paginationPageSizeSelector = [25, 50, 100];

function StudentListTable({ studentList, refreshData, canEdit = false }) {
    const gridRef = useRef(null);
    const [rowData, setRowData] = useState([]);
    const [searchInput, setSearchInput] = useState('');

    useEffect(() => {
        if (studentList) {
            setRowData(studentList)
        }
    }, [studentList])

    const DeleteRecord = (id) => {
        GlobalApi.DeleteStudentRecord(id).then(resp => {
            if (resp) {
                toast('ลบข้อมูลสำเร็จ!/Record deleted successfully!')
                refreshData()
            }
        }).catch(err => {
            console.error(err);
            toast.error('ลบข้อมูลไม่สำเร็จ/Failed to delete record');
        })
    }

    const CustomButtons = (props) => {
        if (!canEdit) return null;
        
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                        <Trash className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณแน่ใจอย่างแน่นอนหรือไม่?/Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้ การกระทำนี้จะลบข้อมูลของคุณถาวรและนำข้อมูลของคุณออกจากเซิร์ฟเวอร์ของเรา/This action cannot be undone. This will permanently delete your record and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>ยกเลิก/Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => DeleteRecord(props?.data?.id)}>ดำเนินการต่อ/Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    const colDefs = useMemo(() => {
        const cols = [
            { field: "id", headerName: "รหัส/ID", filter: true, width: 80 },
            { field: "name", headerName: "ชื่อ-นามสกุล/Name", filter: true, flex: 1 },
            { field: "grade", headerName: "ระดับชั้น/Grade", filter: true, width: 120 },
            { field: "address", headerName: "ที่อยู่/Address", filter: true, flex: 1 },
            { field: "contact", headerName: "เบอร์ติดต่อ/Contact", filter: true, width: 140 },
        ];
        
        // Only add action column if user can edit
        if (canEdit) {
            cols.push({ field: 'action', headerName: "การดำเนินการ/Action", cellRenderer: CustomButtons, width: 130 });
        }
        
        return cols;
    }, [canEdit]);

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

    if (!studentList || studentList.length === 0) {
        return (
            <div className='my-7 p-10 text-center border rounded-lg'>
                <p className='text-muted-foreground'>
                    ไม่พบนักเรียน/No students found. {canEdit ? 'เพิ่มนักเรียนใหม่เพื่อเริ่มต้น/Add a new student to get started.' : 'ติดต่อผู้ดูแลระบบเพื่อเพิ่มนักเรียน/Contact an administrator to add students.'}
                </p>
            </div>
        )
    }

    return (
        <div className='my-7'>
            <div className='p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm'>
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                    type='text'
                    placeholder='ค้นหา.../Search...'
                    className='outline-none w-full bg-transparent'
                    onChange={(event) => setSearchInput(event.target.value)}
                />
            </div>
            <div style={{ height: 500, width: '100%' }}>
                <AgGridReact
                    ref={gridRef}
                    rowData={rowData}
                    columnDefs={colDefs}
                    defaultColDef={defaultColDef}
                    quickFilterText={searchInput}
                    pagination={pagination}
                    paginationPageSize={paginationPageSize}
                    paginationPageSizeSelector={paginationPageSizeSelector}
                    theme={myTheme}
                    domLayout="normal"
                />
            </div>
        </div>
    )
}

export default StudentListTable
