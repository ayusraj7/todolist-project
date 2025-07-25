import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI, userAPI } from '../services/api';
import socketService from '../services/socket';
import { Task, User, CommentForm } from '../types';

interface TaskDetailProps {
  user: User;
  onLogout: () => void;
}

const TaskDetail: React.FC<TaskDetailProps> = ({ user, onLogout }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask();
      fetchUsers();
      socketService.joinRoom('tasks');

      socketService.onTaskUpdated((updatedTask) => {
        if (updatedTask._id === id) {
          setTask(updatedTask);
        }
      });
    }

    return () => {
      socketService.off('task-updated');
    };
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await taskAPI.getTask(id!);
      setTask(response.data);
    } catch (error) {
      console.error('Error fetching task:', error);
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

  const handleStatusChange = async (newStatus: 'pending' | 'in-progress' | 'completed') => {
    if (!task) return;

    try {
      const response = await taskAPI.updateTask(task._id, { status: newStatus });
      setTask(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async () => {
    if (!task || !window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskAPI.deleteTask(task._id);
      navigate('/');
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };



  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'status-pending';
      case 'in-progress':
        return 'status-in-progress';
      case 'completed':
        return 'status-completed';
      default:
        return '';
    }
  };



  if (loading) {
    return <div className="loading">Loading task...</div>;
  }

  if (!task) {
    return <div className="loading">Task not found</div>;
  }

  return (
    <div>
      <header className="header">
        <div className="header-content">
          <div className="logo">Task Manager</div>
          <div className="user-info">
            <div className="avatar">{user.username.charAt(0).toUpperCase()}</div>
            <span>{user.username}</span>
            <button onClick={() => navigate('/')} className="btn btn-secondary">
              Back
            </button>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <div className="task-detail">
          <div className="task-detail-header">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <h1 className="task-detail-title">{task.title}</h1>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setEditing(!editing)}
                  className="btn btn-primary"
                >
                  {editing ? 'Cancel Edit' : 'Edit'}
                </button>
                <button
                  onClick={handleDelete}
                  className="btn btn-danger"
                >
                  Delete
                </button>
              </div>
            </div>

            <p className="task-detail-description">{task.description}</p>

            <div className="task-detail-meta">
              <div className="meta-item">
                <span className="meta-label">Status</span>
                <span className={`meta-value ${getStatusClass(task.status)}`}>
                  {task.status.replace('-', ' ')}
                </span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created By</span>
                <span className="meta-value">{task.createdBy.username}</span>
              </div>
              <div className="meta-item">
                <span className="meta-label">Created</span>
                <span className="meta-value">{formatDate(task.createdAt)}</span>
              </div>
            </div>

            {task.tags.length > 0 && (
              <div style={{ marginTop: '1rem' }}>
                <span className="meta-label">Tags</span>
                <div style={{ marginTop: '0.5rem' }}>
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        padding: '0.3rem 0.8rem',
                        borderRadius: '15px',
                        fontSize: '0.8rem',
                        marginRight: '0.5rem',
                        display: 'inline-block',
                        marginBottom: '0.5rem'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {editing && (
              <div style={{ marginTop: '1rem', padding: '1rem', background: '#f8f9fa', borderRadius: '5px' }}>
                <h3>Quick Status Update</h3>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {(['pending', 'in-progress', 'completed'] as const).map(status => (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status)}
                      className={`btn ${task.status === status ? 'btn-primary' : 'btn-secondary'}`}
                      style={{ fontSize: '0.8rem' }}
                    >
                      {status.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>


        </div>
      </div>
    </div>
  );
};

export default TaskDetail; 