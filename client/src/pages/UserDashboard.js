import React, { useEffect, useState } from "react";
import axios from "axios";
import "./UserDashboard.css";

function UserDashboard() {
    const [tasks, setTasks] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        dueDate: "",
        priority: "Medium",
        category: ""
    });
    const [filter, setFilter] = useState({ priority: "", category: "", sortBy: "" });

    const token = localStorage.getItem("token");

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/tasks", {
                headers: { Authorization: `Bearer ${token}` },
                params: filter
            });
            setTasks(res.data);
        } catch (err) {
            alert("Failed to fetch tasks");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [filter]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/tasks", formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFormData({
                title: "",
                description: "",
                dueDate: "",
                priority: "Medium",
                category: ""
            });
            fetchTasks();
        } catch (err) {
            alert("Failed to create task");
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/tasks/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch {
            alert("Failed to delete task");
        }
    };

    const handleToggleComplete = async (task) => {
        try {
            await axios.put(`http://localhost:5000/api/tasks/${task._id}`, {
                isCompleted: !task.isCompleted
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTasks();
        } catch {
            alert("Failed to update task");
        }
    };

    return (
        <div className="dashboard">
            <h2>My Tasks</h2>

            <form className="task-form" onSubmit={handleSubmit}>
                <input name="title" placeholder="Title" value={formData.title} onChange={handleInputChange} required />
                <input name="description" placeholder="Description" value={formData.description} onChange={handleInputChange} />
                <input type="date" name="dueDate" value={formData.dueDate} onChange={handleInputChange} />
                <select name="priority" value={formData.priority} onChange={handleInputChange}>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>
                <input name="category" placeholder="Category" value={formData.category} onChange={handleInputChange} />
                <button type="submit">Add Task</button>
            </form>

            <div className="filters">
                <select onChange={(e) => setFilter({ ...filter, priority: e.target.value })}>
                    <option value="">All Priorities</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                </select>
                <input placeholder="Category" onChange={(e) => setFilter({ ...filter, category: e.target.value })} />
                <select onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}>
                    <option value="">Sort by</option>
                    <option value="dueDate">Due Date</option>
                    <option value="priority">Priority</option>
                </select>
            </div>

            <ul className="task-list">
                {tasks.map(task => (
                    <li className={`task-card ${task.isCompleted ? "completed" : ""}`} key={task._id}>
                        <h4>{task.title}</h4>
                        <p>{task.description}</p>
                        <p><strong>Due:</strong> {task.dueDate?.slice(0, 10)}</p>
                        <p><strong>Priority:</strong> {task.priority} | <strong>Category:</strong> {task.category}</p>
                        <div className="task-actions">
                            <button onClick={() => handleToggleComplete(task)}>
                                {task.isCompleted ? "Mark Incomplete" : "Mark Complete"}
                            </button>
                            <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserDashboard;
