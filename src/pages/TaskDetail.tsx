import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getTaskById, deleteTask, Task } from '../services/taskService';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaHourglassHalf } from 'react-icons/fa';
import 'bootstrap/dist/css/bootstrap.min.css';

const TaskDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (!id) {
      setError('Task ID is required');
      setIsLoading(false);
      return;
    }

    const fetchTask = async () => {
      try {
        setIsLoading(true);
        const response = await getTaskById(id);
        setTask(response.data);
        setError(null);
      } catch (error: Error | unknown) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to fetch task details';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;

    try {
      await deleteTask(id);
      navigate('/tasks');
    } catch (error: Error | unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete task';
      setError(errorMessage);
      setShowDeleteModal(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mt-4">
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger" role="alert">
          {error || 'Task not found'}
        </div>
        <Link className="btn btn-primary" to="/tasks">
          <FaArrowLeft className="me-2" />
          Back to Tasks
        </Link>
      </div>
    );
  }

  const formattedDate = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Task Details</h2>
        <div>
          <Link className="btn btn-outline-secondary me-2" to="/tasks">
            <FaArrowLeft className="me-2" />
            Back to Tasks
          </Link>
          <Link className="btn btn-primary me-2" to={`/tasks/edit/${id}`}>
            <FaEdit className="me-2" />
            Edit
          </Link>
          <button className="btn btn-danger" onClick={() => setShowDeleteModal(true)}>
            <FaTrash className="me-2" />
            Delete
          </button>
        </div>
      </div>

      <div className="card shadow-sm mb-4">
        <div className="card-header d-flex align-items-center">
          <div className={`me-3 badge ${task.completed ? 'bg-success' : 'bg-warning'}`}>
            {task.completed ? (
              <>
                <FaCheck className="me-1" /> Completed
              </>
            ) : (
              <>
                <FaHourglassHalf className="me-1" /> Pending
              </>
            )}
          </div>
          <h5 className="card-title mb-0">{task.title}</h5>
        </div>
        <div className="card-body">
          <div className="mb-4">
            <h6 className="card-subtitle mb-2 text-muted">Description</h6>
            <p className="card-text">
              {task.description || (
                <span className="text-muted fst-italic">No description provided</span>
              )}
            </p>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <h6 className="card-subtitle mb-2 text-muted">Created At</h6>
              <p className="card-text">{formattedDate(task.createdAt)}</p>
            </div>
            <div className="col-md-6 mb-3">
              <h6 className="card-subtitle mb-2 text-muted">Last Updated</h6>
              <p className="card-text">{formattedDate(task.updatedAt)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1}>
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
                <p className="fw-bold">{task.title}</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  type="button"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-danger" type="button" onClick={handleDelete}>
                  Delete
                </button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </div>
      )}
    </div>
  );
};

export default TaskDetail;
