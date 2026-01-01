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

function StudentListTable({ studentList, refreshData }) {
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
                toast('Record deleted successfully!')
                refreshData()
            }
        }).catch(err => {
            console.error(err);
            toast.error('Failed to delete record');
        })
    }

    const CustomButtons = (props) => {
        return (
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button size="sm" variant="destructive">
                        <Trash className="h-4 w-4" />
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>คุณแน่ใจอย่างแน่นอนหรือไม่?/ Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            การดำเนินการนี้ไม่สามารถย้อนกลับได้ การกระทำนี้จะลบข้อมูลของคุณถาวรและนำข้อมูลของคุณออกจากเซิร์ฟเวอร์ของเรา/ This action cannot be undone. This will permanently delete your record
                            and remove your data from our servers.
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

    const colDefs = useMemo(() => [
        { field: "id", headerName: "ID", filter: true, width: 80 },
        { field: "name", headerName: "Name", filter: true, flex: 1 },
        { field: "grade", headerName: "Grade", filter: true, width: 100 },
        { field: "address", headerName: "Address", filter: true, flex: 1 },
        { field: "contact", headerName: "Contact", filter: true, width: 120 },
        { field: 'action', headerName: "Action", cellRenderer: CustomButtons, width: 100 }
    ], []);

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
                <p className='text-muted-foreground'>No students found. Add a new student to get started.</p>
            </div>
        )
    }

    return (
        <div className='my-7'>
            <div className='p-2 rounded-lg border shadow-sm flex gap-2 mb-4 max-w-sm'>
                <Search className="h-5 w-5 text-muted-foreground" />
                <input
                    type='text'
                    placeholder='Search on Anything...'
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
