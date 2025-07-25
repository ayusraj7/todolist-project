import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskAPI, userAPI } from '../services/api';
import socketService from '../services/socket';
import { Task, User } from '../types';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';

interface DashboardProps {
  user: User;
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    search: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
    fetchUsers();
    socketService.joinRoom('tasks');

    socketService.onTaskCreated((task) => {
      setTasks(prev => [task, ...prev]);
    });

    socketService.onTaskUpdated((updatedTask) => {
      setTasks(prev => prev.map(task => 
        task._id === updatedTask._id ? updatedTask : task
      ));
    });

    socketService.onTaskDeleted((taskId) => {
      setTasks(prev => prev.filter(task => task._id !== taskId));
    });

    return () => {
      socketService.off('task-created');
      socketService.off('task-updated');
      socketService.off('task-deleted');
    };
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks(filters);
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await userAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTaskClick = (taskId: string) => {
    navigate(`/task/${taskId}`);
  };

  const handleCreateTask = () => {
    setShowModal(true);
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setShowModal(false);
  };

  const filteredTasks = tasks.filter(task => {
    if (filters.status && task.status !== filters.status) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      return (
        task.title.toLowerCase().includes(searchLower) ||
        task.description.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">Task Manager</div>
          <div className="user-info">
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <span>{user.username}</span>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="dashboard">
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Tasks</h1>
            <button onClick={handleCreateTask} className="btn btn-primary">
              Create Task
            </button>
          </div>

          <div className="filters">
            <input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="search-input"
            />
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="filter-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="task-grid">
            {filteredTasks.length === 0 ? (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
                <p>No tasks found. Create your first task!</p>
              </div>
            ) : (
              filteredTasks.map(task => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onClick={() => handleTaskClick(task._id)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <TaskModal
          users={users}
          onClose={() => setShowModal(false)}
          onTaskCreated={handleTaskCreated}
        />
      )}
    </div>
  );
};

export default Dashboard; 