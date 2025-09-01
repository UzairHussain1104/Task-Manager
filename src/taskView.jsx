import React, { useState, useEffect } from "react";
import "./css/taskview.css"

function TaskView() {
    const [task, setTask] = useState(null);
    const token = localStorage.getItem("token");

    // Construct API path from URL
    const currentPath = window.location.pathname; // e.g. "/dashboard/123"
    const parts = currentPath.split("/").filter(Boolean);
    if (parts.length === 2 && parts[0] === "dashboard") {
        parts.splice(1, 0, "task"); // => ["dashboard", "task", "123"]
    }
    const pathname = "http://localhost:3000/" + parts.join("/");

    useEffect(() => {
        fetchTask();
    }, []);

    const fetchTask = async () => {
        const response = await fetch(pathname, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (response.ok) {
            setTask(data.task);
        } else {
            console.log(data.error);
            window.location.href = data.redirect;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!task) return;

        const { title, description, dueDate, priority, status } = task;

        if (status != "completed") {
            const response = await fetch(pathname, {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description, dueDate, priority }),
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = data.redirect;
            } else {
                console.log(data.error);
            }
        } else {
            const response = await fetch(pathname, {
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();
            if (response.ok) {
                window.location.href = data.redirect;
            } else {
                console.log(data.error);
            }
        }
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setTask((prev) => ({ ...prev, [id.replace("task_", "")]: value }));
    };

    return (
        <>
            <section className="single-task-container">
                {task ? (
                    <article className="task">
                        <form id="edit-task-form" onSubmit={handleSubmit}>
                            <label>Title:</label>
                            <input type="text" id="task_title" value={task.title} onChange={handleChange} required />

                            <label>Description:</label>
                            <textarea id="task_description" rows="4" value={task.description} onChange={handleChange} required />

                            <label>Due Date:</label>
                            <input type="date" id="task_dueDate" value={task.dueDate.split("T")[0]} onChange={handleChange} required />

                            <label>Priority:</label>
                            <select id="task_priority" value={task.priority} onChange={handleChange} required>
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>

                            <label>Status</label>
                            <select id="task_status" value={task.status} onChange={handleChange} required>
                                <option value="pending">Pending</option>
                                <option value="completed">Completed</option>
                            </select>

                            <button type="submit">Save</button>
                        </form>
                    </article>
                ) : (
                    <p>Loading task...</p>
                )}
            </section>
        </>
    );
}

export default TaskView;

