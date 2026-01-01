"use client"
import React, { useEffect, useState } from 'react'
import GlobalApi from '../_services/GlobalApi';

function GradeSelect({ selectedGrade, defaultValue = '1st' }) {
    const [grades, setGrades] = useState([]);
    const [currentValue, setCurrentValue] = useState(defaultValue);

    useEffect(() => {
        GetAllGradesList();
    }, [])

    const GetAllGradesList = () => {
        GlobalApi.GetAllGrades().then(resp => {
            setGrades(resp.data);
            // Set initial selection if grades exist
            if (resp.data && resp.data.length > 0) {
                const initialGrade = resp.data.find(g => g.grade === defaultValue) 
                    ? defaultValue 
                    : resp.data[0].grade;
                setCurrentValue(initialGrade);
                selectedGrade(initialGrade);
            }
        }).catch(err => {
            console.error('Failed to fetch grades:', err);
        })
    }

    const handleChange = (e) => {
        setCurrentValue(e.target.value);
        selectedGrade(e.target.value);
    }

    return (
        <div>
            <select 
                className='p-2 border rounded-lg bg-background text-foreground'
                onChange={handleChange}
                value={currentValue}
            >
                {grades.map((item, index) => (
                    <option key={index} value={item.grade}>{item.grade}</option>
                ))}
            </select>
        </div>
    )
}

export default GradeSelect
