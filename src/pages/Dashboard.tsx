import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { TaskContext } from '../context/TaskContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCheckCircle, FaClipboardList, FaHourglassHalf, FaPlus } from 'react-icons/fa';
import '@fontsource/montserrat/700.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/roboto/400.css';

// Task type definition

const Dashboard: React.FC = () => {
  const { authState } = useAuth();
  const taskContext = useContext(TaskContext);
  if (!taskContext) {
    return (
      <div className="container mt-4">
        <div className="alert alert-danger mt-5" role="alert">
          Task context is not available. Please try reloading the page or contact support.
        </div>
      </div>
    );
  }
  const tasks = taskContext.tasks;
  const isLoading = taskContext.loading;
  const error = taskContext.error;

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="container mt-4" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', color: '#1F75FE', fontWeight: 700 }}>Welcome, {authState.user?.username}!</h2>
              <p className="card-text" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>Here&apos;s an overview of your tasks and progress.</p>
            </div>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="d-flex justify-content-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <>
          <div className="row mb-4">
            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-white bg-primary h-100" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
                <div className="card-body d-flex align-items-center">
                  <FaClipboardList className="me-3" size={24} />
                  <div>
                    <h5 className="card-title mb-0">Total Tasks</h5>
                    <h2 className="mt-2 mb-0">{totalTasks}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4 mb-3 mb-md-0">
              <div className="card text-white bg-success h-100" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
                <div className="card-body d-flex align-items-center">
                  <FaCheckCircle className="me-3" size={24} />
                  <div>
                    <h5 className="card-title mb-0">Completed</h5>
                    <h2 className="mt-2 mb-0">{completedTasks}</h2>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card text-white bg-warning h-100" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
                <div className="card-body d-flex align-items-center">
                  <FaHourglassHalf className="me-3" size={24} />
                  <div>
                    <h5 className="card-title mb-0">Pending</h5>
                    <h2 className="mt-2 mb-0">{pendingTasks}</h2>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>Task Completion</h5>
                  <div className="progress">
                    <div
                      aria-valuemax={100}
                      aria-valuemin={0}
                      aria-valuenow={completionPercentage}
                      className="progress-bar"
                      role="progressbar"
                      style={{ width: `${completionPercentage}%` }}
                    >
                      {completionPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3 mb-md-0">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>Recent Tasks</h5>
                  {tasks.length === 0 ? (
                    <p className="card-text text-muted">No tasks available</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {tasks.slice(0, 3).map(task => (
                        <li className="list-group-item px-0" key={task.id}>
                          <div className="d-flex align-items-center">
                            <span
                              className={`me-2 ${task.completed ? 'text-success' : 'text-warning'}`}
                            >
                              {task.completed ? <FaCheckCircle /> : <FaHourglassHalf />}
                            </span>
                            <span className={task.completed ? 'text-decoration-line-through' : ''}>
                              {task.title}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="card-footer bg-transparent">
                  <Link className="btn btn-primary btn-sm" to="/tasks">
                    View All Tasks
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body text-center d-flex flex-column justify-content-center">
                  <FaPlus className="mx-auto mb-3 text-primary" size={48} />
                  <h5 className="card-title" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>Add New Task</h5>
                  <p className="card-text" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>Create a new task to keep track of your work</p>
                  <Link className="btn btn-outline-primary mt-auto" to="/tasks/new">
                    Create Task
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
