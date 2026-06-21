# Task Manager Domain Model

Unified task management platform with test session isolation.

## Language

**Task**:
A work item containing a title, description, and completion status.
_Avoid_: Todo, action item

**TaskStore**:
A deep module in the frontend that coordinates local state, caches tasks, and acts as the single seam for all UI mutations.
_Avoid_: TaskContext, TaskService

**AuthStore**:
The deep module in the frontend that manages token storage, authentication state, and encapsulates authentication API communication.
_Avoid_: AuthContext, authService, AuthService

**SessionTaskStore**:
The deep module in the backend that isolates, validates, and manages task states per test session in memory.
_Avoid_: In-memory DB, server helper

**Session**:
An isolated execution context keyed by a unique session ID, allowing concurrent tests to run without interfering with each other's data state.
_Avoid_: Thread, test group
