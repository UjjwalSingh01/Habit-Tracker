import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/reducer/todoReducer";
import '../assets/Calendar.css';
import 'react-day-picker/dist/style.css';

function Calendar() {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showCalendar, setShowCalendar] = useState(false);

    const dispatch = useDispatch();

    function toggleCalendar() {
        setShowCalendar(!showCalendar);
    }

    function handleDateChange(date) {
        setSelectedDate(date);

        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = String(date.getFullYear());
        const modifiedDate = `${day}/${month}/${year}`;
        
        dispatch(actions.date(modifiedDate));

        setShowCalendar(false);
    }

    return (
        <div className="relative inline-block text-left">
            <button
                className="bg-gradient-to-r from-custom-300 to-custom-400 text-white ml-6 font-semibold py-2 px-4 rounded-2xl shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-custom-400 focus:ring-opacity-50"
                onClick={toggleCalendar}
            >
                {selectedDate.toLocaleDateString()}
            </button>
            {showCalendar && (
                <div className="absolute mt-2 z-10 bg-white rounded-lg shadow-lg border border-gray-200 p-4 transition-opacity duration-200 ease-in-out">
                    <DayPicker
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateChange}
                        styles={{
                          caption: { fontWeight: 'bold', color: '#4a5568' },
                          day: { fontSize: '1rem', padding: '0.5rem' },
                          navButton: { color: '#4a5568' },
                        }}
                    />
                </div>
            )}
        </div>
    );
}

export default Calendar;
