"use client"
import { Button } from '@/components/ui/button'
import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import GlobalApi from '@/app/_services/GlobalApi';
import { toast } from 'sonner';
import { LoaderIcon } from 'lucide-react';

function AddNewStudent({ refreshData }) {
    const [open, setOpen] = useState(false);
    const [grades, setGrades] = useState([]);
    const [loading, setLoading] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm()

    useEffect(() => {
        GetAllGradesList();
    }, [])

    const GetAllGradesList = () => {
        GlobalApi.GetAllGrades().then(resp => {
            setGrades(resp.data);
        })
    }

    const onSubmit = (data) => {
        setLoading(true)
        GlobalApi.CreateNewStudent(data).then(resp => {
            console.log("--", resp);
            if (resp.data) {
                reset();
                refreshData();
                setOpen(false);
                toast('New Student Added !')
            }
            setLoading(false)
        }).catch(err => {
            console.error(err);
            toast.error('Failed to add student');
            setLoading(false);
        })
    }

    return (
        <div>
            <Button onClick={() => setOpen(true)}>+ เพิ่มนักเรียน/Add Student</Button>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>เพิ่มนักเรียน/Add Student</DialogTitle>
                        <DialogDescription asChild>
                            <div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className='py-2'>
                                        <label className='text-foreground'>ชื่อ-นามสกุล/Full Name</label>
                                        <Input 
                                            placeholder='ชื่อ-นามสกุล'
                                            {...register('name', { required: true })}
                                        />
                                        {errors.name && <span className='text-red-500 text-sm'>Name is required</span>}
                                    </div>
                                    <div className='flex flex-col py-2'>
                                        <label className='text-foreground'>ระดับชั้น/Grade</label>
                                        <select 
                                            className='p-3 border rounded-lg bg-background text-foreground'
                                            {...register('grade', { required: true })}
                                        >
                                            <option value="">Select Grade</option>
                                            {grades.map((item, index) => (
                                                <option key={index} value={item.grade}>{item.grade}</option>
                                            ))}
                                        </select>
                                        {errors.grade && <span className='text-red-500 text-sm'>Grade is required</span>}
                                    </div>
                                    <div className='py-2'>
                                        <label className='text-foreground'>หมายเลขติดต่อ/Contact Number</label>
                                        <Input 
                                            type="tel" 
                                            placeholder='ตัวอย่าง 098-765-4321'
                                            {...register('contact')} 
                                        />
                                    </div>
                                    <div className='py-2'>
                                        <label className='text-foreground'>ที่อยู่/Address</label>
                                        <Input 
                                            placeholder='ตัวอย่าง 123 ถ.สุขุมวิท, คลองเตย'
                                            {...register('address')} 
                                        />
                                    </div>

                                    <div className='flex gap-3 items-center justify-end mt-5'>
                                        <Button 
                                            type="button"
                                            onClick={() => setOpen(false)} 
                                            variant="ghost"
                                        >
                                            ยกเลิก/Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading ? <LoaderIcon className='animate-spin' /> : 'บันทึก/Save'}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default AddNewStudent
