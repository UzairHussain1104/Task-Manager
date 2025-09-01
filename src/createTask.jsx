import React, { useState } from "react";
import "./css/createTask.css"

function CreateTask() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [priority, setPriority] = useState("low");
    const [error, setError] = useState("");

    const handleCreateTask = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:3000/dashboard/createTask", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description, dueDate, priority }),
        });

        const data = await response.json();

        if (response.ok) {
            window.location.href = data.redirect; // Redirect to dashboard
        } else {
            setError(data.error || "Failed to create task");
            if (data.redirect) {
                window.location.href = data.redirect;
            }
        }
    };

    return (
        <>
            <section className="createTask">
                <h2>Create a New Task</h2>
                <form id="create-task-form" onSubmit={handleCreateTask}>
                    
                    <label htmlFor="title">Task Title</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task Title" required />
                    
                    <label htmlFor="description">Description</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the task..." rows="4" required />
                    
                    <label htmlFor="dueDate">Due Date</label>
                    <input type="date" id="dueDate" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                    
                    <label htmlFor="priority">Priority</label>
                    <select id="priority" value={priority} onChange={(e) => setPriority(e.target.value)} required>
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                    
                    <button type="submit">Create Task</button>
                </form>
                {error && <p className="errorMessage">{error}</p>}
            
            </section>
        </>
    );
  }
  
export default CreateTask;