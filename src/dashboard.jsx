import React, { useState, useEffect } from "react";
import "./css/dashboard.css"

function Dashboard() {
    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/dashboard/tasks", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            setTasks(data.taskList);
        } else {
            console.log(data.error);
            window.location.href = data.redirect;
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case "high": return "rgb(185, 65, 61)";
            case "medium": return "rgb(179, 150, 55)";
            case "low": return "rgb(55, 179, 96)";
            default: return "#ccc";
        }
    };

    return (
        <>
            <h2 className="tasks_title">Tasks</h2>
            <section className="tasks_container">
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <article key={task._id} className="task">
                            <div className="task_metaContainer">
                                <span className="task_priority" style={{ backgroundColor: getPriorityColor(task.priority) }}>
                                    {task.priority} Priority
                                </span>
                                <span className="task_date">Deadline: {formatDate(task.dueDate)}</span>
                            </div>
                            <h3 className="task_title">{task.title}</h3>
                            <p className="task_description">{task.description}</p>
                            <a href={`/dashboard/${task._id}`} className="task_updateLink">update</a>
                        </article>
                    ))
                ) : (
                    <p>No tasks found.</p>
                )}
            </section>
        </>
    );
}

export default Dashboard;