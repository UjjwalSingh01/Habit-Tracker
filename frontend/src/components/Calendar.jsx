import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { useDispatch } from "react-redux";
import { actions } from "../../redux/reducer/todoReducer";
import '../assets/Calendar.css'


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
        // console.log(modifiedDate);

        setShowCalendar(false);
    }

    return (
        <div>
          <button className="bg-gray-300 ml-6 border rounded-lg w-28 hover:bg-slate-400" onClick={toggleCalendar}>
              {selectedDate.toLocaleDateString()}{" "}
          </button>
          {showCalendar && (
              <DayPicker
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDateChange}
              />
          )}
        </div>  
    );
}

export default Calendar;

{/* <div>
  <button onClick={toggleCalendar}>
    {selectedDate.toLocaleDateString()}{" "}
  </button>
  {showCalendar && (
    <DatePicker
      selected={selectedDate}
      onChange={handleDateChange}
      inline
    />
  )}
</div> */}
