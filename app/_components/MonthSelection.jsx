"use client"
import React, { useState } from 'react'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from '@/components/ui/button'
import { CalendarDays } from 'lucide-react'
import { addMonths } from 'date-fns';
import moment from 'moment';
import { Calendar } from "@/components/ui/calendar"

function MonthSelection({ selectedMonth }) {
    const nextMonths = addMonths(new Date(), 0);
    const [month, setMonth] = useState(nextMonths);
    const [open, setOpen] = useState(false);

    const handleMonthChange = (value) => {
        setMonth(value);
        selectedMonth(value);
    };

    return (
        <div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button 
                        variant="outline"
                        className="flex gap-2 items-center"
                    >
                        <CalendarDays className='h-5 w-5' />
                        {moment(month).format('MMM yyyy')}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        mode="single"
                        month={month}
                        onMonthChange={handleMonthChange}
                        className="flex flex-1 justify-center"
                    />
                </PopoverContent>
            </Popover>
        </div>
    )
}

export default MonthSelection
