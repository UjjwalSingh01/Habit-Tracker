import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {Chart, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend} from 'chart.js'
import axios from "axios";

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function Tracker() {
    const [dates, setDates] = useState([]);
    const [percentage, setPercentage] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8787/user/tracker', {
                    headers: {
                        "Authorization": localStorage.getItem("token")
                    }
                });

                // setDates(response.data.message)

                const date = response.data.message.map((todos) =>{
                    return todos.date
                })
                setDates(date);

                const newPercentages = response.data.message.map((todos) => {
                    const percent = (todos.completedTodos * 100) / (todos.totalTodos);
                    return percent;
                });
                setPercentage(newPercentages);

                console.log(response.data.message)
                console.log("date " + date)
                console.log("percent " + newPercentages)

            } catch(error) {
                console.error("Error in Fetching Data: ", error);
            }
        };

        fetchData();
    }, []);

    const data = {
        labels: dates,
        datasets: [
            {
                label: 'Percentage Completed',
                data: percentage,
                fill: false,
                backgroundColor: 'rgba(75,192,192,0.2)',
                borderColor: 'rgba(75,192,192,1)',
            },
        ],
    };

    return (
        <div>
            <h2>Todo Completion Percentage Over Time</h2>
            <Line data={data} />
        </div>
    );
}
