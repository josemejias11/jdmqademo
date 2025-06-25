import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createTask, getTaskById, updateTask } from '../services/taskService';
import { Task } from '../types';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fontsource/montserrat/700.css';
import '@fontsource/poppins/700.css';
import '@fontsource/inter/400.css';
import '@fontsource/roboto/400.css';

// TaskForm props interface
interface TaskFormProps {
  task?: Task; // Optional - if provided, we're in edit mode
  onSubmitSuccess?: () => void; // Optional callback after successful submission
}

// Form values interface
interface TaskFormValues {
  title: string;
  description: string;
  completed: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmitSuccess }) => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditMode] = useState(!!task || !!id);
  const [initialValues, setInitialValues] = useState<TaskFormValues>({
    title: task?.title || '',
    description: task?.description || '',
    completed: task?.completed || false
  });

  // Validation schema (aligned with backend)
  const TaskSchema = Yup.object().shape({
    title: Yup.string()
      .required('Title is required')
      .min(3, 'Title must be at least 3 characters')
      .max(100, 'Title must be at most 100 characters'),
    description: Yup.string().max(500, 'Description must be at most 500 characters'),
    completed: Yup.boolean()
  });

  // Fetch task data if in edit mode but no task prop was provided
  useEffect(() => {
    const fetchTask = async () => {
      if (isEditMode && !task && id) {
        try {
          setIsLoading(true);
          const response = await getTaskById(id);
          const fetchedTask = response.data;
          setInitialValues({
            title: fetchedTask.title,
            description: fetchedTask.description,
            completed: fetchedTask.completed
          });
          setError(null);
        } catch (error: Error | unknown) {
          const errorMessage =
            error instanceof Error ? error.message : 'Failed to fetch task details';
          setError(errorMessage);
        } finally {
          setIsLoading(false);
        }
      }
    };

    void fetchTask();
  }, [isEditMode, task, id]);

  const handleSubmit = async (
    values: TaskFormValues,
    { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      if (isEditMode && id) {
        // Update existing task
        await updateTask(id, values);
      } else {
        // Create new task
        await createTask(values);
      }

      // Call success callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess();
      } else {
        // Navigate back to tasks list
        navigate('/tasks');
      }
    } catch (error: Error | unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'An error occurred while saving the task';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setSubmitting(false);
    }
  };

  if (isLoading && isEditMode && !task) {
    return (
      <div className="d-flex justify-content-center my-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm" style={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}>
      <div className="card-body">
        <h3 className="card-title mb-4" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', color: '#1F75FE', fontWeight: 700 }}>{isEditMode ? 'Edit Task' : 'Create New Task'}</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={TaskSchema}
          onSubmit={handleSubmit}
        >
          {({
            errors,
            touched,
            isSubmitting,
            values
            // Deliberately not destructuring setFieldValue as it's unused
          }) => (
            <Form>
              <div className="mb-3">
                <label className="form-label" htmlFor="title" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
                  Title <span className="text-danger">*</span>
                </label>
                <Field
                  className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  type="text"
                />
                <ErrorMessage className="invalid-feedback" component="div" name="title" />
              </div>

              <div className="mb-3">
                <label className="form-label" htmlFor="description" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
                  Description
                </label>
                <Field
                  as="textarea"
                  className={`form-control ${
                    errors.description && touched.description ? 'is-invalid' : ''
                  }`}
                  id="description"
                  name="description"
                  placeholder="Enter task description"
                  rows={4}
                />
                <ErrorMessage className="invalid-feedback" component="div" name="description" />
              </div>

              <div className="mb-4 form-check">
                <Field
                  className="form-check-input"
                  id="completed"
                  name="completed"
                  type="checkbox"
                />
                <label className="form-check-label" htmlFor="completed" style={{ fontFamily: 'Montserrat, Poppins, Arial, sans-serif', fontWeight: 700 }}>
                  Mark as completed
                </label>
              </div>

              <div className="d-flex justify-content-end">
                <button
                  className="btn btn-outline-secondary me-2"
                  disabled={isSubmitting || isLoading}
                  type="button"
                  onClick={() => navigate('/tasks')}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-primary"
                  disabled={isSubmitting || isLoading}
                  type="submit"
                >
                  {isSubmitting || isLoading ? (
                    <>
                      <span
                        aria-hidden="true"
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      {isEditMode ? 'Updating...' : 'Creating...'}
                    </>
                  ) : isEditMode ? (
                    'Update Task'
                  ) : (
                    'Create Task'
                  )}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default TaskForm;
