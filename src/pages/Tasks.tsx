import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TaskContext } from '../context/TaskContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheck, FaEdit, FaEye, FaPlus, FaTrash } from 'react-icons/fa';
import '@fontsource/montserrat/700.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/roboto/400.css';

// Task type definition
import type { Task } from '../types';

const ModalFooterButtons: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
}> = ({ onCancel, onConfirm, confirmLabel = 'Delete' }) => (
  <div className="modal-footer">
    <button className="btn btn-secondary" type="button" onClick={onCancel}>
      Cancel
    </button>
    <button className="btn btn-danger" type="button" onClick={onConfirm}>
      {confirmLabel}
    </button>
  </div>
);

const Tasks: React.FC = () => {
  const navigate = useNavigate();
  const taskContext = useContext(TaskContext);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'completed', 'pending'
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);

  // Use context tasks if available
  const tasks = taskContext ? taskContext.tasks : [];
  const isLoading = taskContext ? taskContext.loading : false;
  const error = taskContext ? taskContext.error : null;

  // Define applyFiltersAndSearch function before it's used in useEffect
  // Apply filters and search to the task list
  const applyFiltersAndSearch = useCallback(() => {
    let result = [...tasks];

    // Apply status filter
    if (filter === 'completed') {
      result = result.filter(task => task.completed);
    } else if (filter === 'pending') {
      result = result.filter(task => !task.completed);
    }

    // Apply search term
    if (searchTerm.trim() !== '') {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        task =>
          task.title.toLowerCase().includes(term) || task.description.toLowerCase().includes(term)
      );
    }

    setFilteredTasks(result);
  }, [filter, searchTerm, tasks]);

  // Fetch tasks on component mount
  useEffect(() => {
    // No need to fetch tasks here; context handles it
  }, []);

  // Apply filters and search when tasks, filter, or searchTerm changes
  useEffect(() => {
    applyFiltersAndSearch();
  }, [tasks, filter, searchTerm, applyFiltersAndSearch]);

  const confirmDelete = (taskId: string) => {
    setTaskToDelete(taskId);
    setShowDeleteModal(true);
  };

  // Use context's deleteTask method for proper state management
  const handleDelete = async () => {
    if (!taskToDelete || !taskContext) return;
    try {
      taskContext.deleteTask(taskToDelete);
      setShowDeleteModal(false);
      setTaskToDelete(null);
    } catch (error: Error | unknown) {
      // Optionally show a local error
    }
  };

  // Replace toggleTaskStatus with context's toggleTaskDone
  const handleToggleTask = (taskId: string) => {
    if (taskContext) {
      taskContext.toggleTaskDone(taskId);
    }
  };

  return (
    <div className="container mt-4" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2
          style={{
            fontFamily: 'Montserrat, Poppins, Arial, sans-serif',
            color: '#1F75FE',
            fontWeight: 700
          }}
        >
          My Tasks
        </h2>
        <Link className="btn btn-primary" to="/tasks/new">
          <FaPlus className="me-2" />
          New Task
        </Link>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <div className="input-group">
                <input
                  className="form-control"
                  placeholder="Search tasks..."
                  type="text"
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button
                    className="btn btn-outline-secondary"
                    type="button"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="btn-group w-100">
                <button
                  className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline-primary'}`}
                  type="button"
                  onClick={() => setFilter('all')}
                >
                  All
                </button>
                <button
                  className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline-primary'}`}
                  type="button"
                  onClick={() => setFilter('pending')}
                >
                  Pending
                </button>
                <button
                  className={`btn ${filter === 'completed' ? 'btn-primary' : 'btn-outline-primary'}`}
                  type="button"
                  onClick={() => setFilter('completed')}
                >
                  Completed
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="card shadow-sm">
          <div className="card-body text-center py-5">
            <h5
              className="text-muted mb-3"
              style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}
            >
              No tasks found
            </h5>
            <p className="text-muted" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
              {searchTerm || filter !== 'all'
                ? 'Try changing your search or filter criteria'
                : 'Click the "New Task" button to create your first task'}
            </p>
          </div>
        </div>
      ) : (
        <div className="card shadow-sm">
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>Status</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th style={{ width: '160px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => (
                  <tr key={task.id}>
                    <td>
                      <button
                        className={`btn btn-sm ${
                          task.completed ? 'btn-success' : 'btn-outline-secondary'
                        }`}
                        title={task.completed ? 'Mark as pending' : 'Mark as completed'}
                        onClick={() => handleToggleTask(task.id)}
                      >
                        <FaCheck />
                      </button>
                    </td>
                    <td className={task.completed ? 'text-decoration-line-through text-muted' : ''}>
                      {task.title}
                    </td>
                    <td className={task.completed ? 'text-muted' : ''}>
                      {task.description.length > 50
                        ? `${task.description.substring(0, 50)}...`
                        : task.description}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          title="View details"
                          onClick={() => navigate(`/tasks/${task.id}`)}
                        >
                          <FaEye />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          title="Edit task"
                          onClick={() => navigate(`/tasks/edit/${task.id}`)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          title="Delete task"
                          onClick={() => confirmDelete(task.id)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal show d-block" role="dialog" tabIndex={-1 as number}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirm Delete</h5>
                <button
                  className="btn-close"
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this task? This action cannot be undone.</p>
              </div>
              <ModalFooterButtons
                onCancel={() => setShowDeleteModal(false)}
                onConfirm={handleDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
