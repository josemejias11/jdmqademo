/**
 * Centralized locators for the Task Manager application
 * This file contains all the locators used across the application for testing
 */

export const AppLocators = {
  // === LOGIN PAGE ===
  login: {
    usernameInput: 'input[name="username"]',
    usernameInputById: '#username',
    passwordInput: 'input[name="password"]',
    passwordInputById: '#password',
    loginButton: 'button[type="submit"]',
    loginForm: 'form',
    errorMessage: '.modal.show .text-danger, .alert-danger',
    invalidFeedback: '.invalid-feedback',
    appTitle: 'h4',
    loginButtonText: 'Login',
    loadingSpinner: '.spinner-border',

    // Alternative selectors for different strategies
    usernameByLabel: 'input[id="username"]',
    passwordByLabel: 'input[id="password"]',
    submitByRole: 'button[type="submit"]'
  },

  // === DASHBOARD PAGE ===
  dashboard: {
    welcomeMessage: 'h2.card-title',
    welcomeCard: '.card.shadow-sm',
    statsContainer: '.row.mb-4',

    // Statistics cards - updated to match actual HTML structure
    totalTasksCard: '.card.bg-primary',
    completedTasksCard: '.card.bg-success',
    pendingTasksCard: '.card.bg-warning',
    completionCard: '.col-12 .card.shadow-sm',

    // Action buttons
    viewAllTasksButton: 'a[href="/tasks"]',
    createNewTaskButton: 'a[href="/tasks/new"]',
    quickActionsSection: '.row:last-child',

    // Quick actions cards
    viewTasksCard: '.col-md-6:nth-child(1) .card',
    createTaskCard: '.col-md-6:nth-child(2) .card',

    // Icons
    totalTasksIcon: '.fa-clipboard-list',
    completedTasksIcon: '.fa-check-circle',
    pendingTasksIcon: '.fa-hourglass-half',
    createTaskIcon: '.fa-plus'
  },

  // === TASK FORM (Create/Edit) ===
  taskForm: {
    form: 'form',
    titleInput: 'input[name="title"]',
    titleInputById: '#title',
    titleLabel: 'label[for="title"]',
    descriptionTextarea: 'textarea[name="description"]',
    descriptionTextareaById: '#description',
    descriptionLabel: 'label[for="description"]',
    completedCheckbox: 'input[name="completed"]',
    completedCheckboxById: '#completed',
    completedLabel: 'label[for="completed"]',

    // Form validation
    titleError: '.invalid-feedback',
    descriptionError: '.invalid-feedback',

    // Form buttons
    submitButton: 'button[type="submit"]',
    cancelButton: 'a.btn-secondary',
    saveButton: 'button[type="submit"]',

    // Form states
    loadingSpinner: '.spinner-border',
    errorAlert: '.alert-danger',
    successAlert: '.alert-success'
  },

  // === TASKS LIST PAGE ===
  tasksList: {
    container: '.container',
    pageTitle: 'h1',
    searchInput: 'input[type="search"]',
    searchInputGroup: '.input-group',
    filterButtons: '.btn-group',
    allTasksFilter: 'button:contains("All")',
    completedFilter: 'button:contains("Completed")',
    pendingFilter: 'button:contains("Pending")',

    // Task items
    taskCard: '.card.task-card',
    taskTitle: '.card-title',
    taskDescription: '.card-text',
    taskStatus: '.badge',
    taskActions: '.card-body .btn-group',

    // Task actions
    viewButton: '.btn-primary',
    editButton: '.btn-secondary',
    deleteButton: '.btn-danger',
    toggleCompleteButton: '.btn-outline-success, .btn-outline-warning',

    // Task status badges
    completedBadge: '.badge.bg-success',
    pendingBadge: '.badge.bg-warning',

    // Empty state
    emptyState: '.text-center.py-5',
    noTasksMessage: 'p:contains("No tasks found")',

    // Pagination (if exists)
    pagination: '.pagination',

    // Create task button
    createTaskButton: 'a[href="/tasks/new"]'
  },

  // === TASK DETAIL PAGE ===
  taskDetail: {
    container: '.container',
    backButton: 'a.btn-outline-secondary',
    editButton: 'a.btn-primary',
    deleteButton: 'button.btn-danger',

    // Task information
    taskCard: '.card.shadow-sm',
    taskHeader: '.card-header',
    taskBody: '.card-body',
    taskTitle: '.card-title',
    taskDescription: '.card-text',
    taskStatus: '.badge',

    // Action buttons
    actionButtons: '.d-flex.justify-content-between',

    // Delete confirmation modal
    deleteModal: '.modal',
    deleteConfirmButton: '.modal .btn-danger',
    deleteCancelButton: '.modal .btn-secondary',

    // Loading and error states
    loadingSpinner: '.spinner-border',
    errorAlert: '.alert-danger'
  },

  // === NAVIGATION ===
  navigation: {
    navbar: '.navbar',
    navbarBrand: '.navbar-brand',
    navbarToggler: '.navbar-toggler',
    navbarNav: '.navbar-nav',

    // Navigation links
    dashboardLink: 'a[href="/dashboard"]',
    tasksLink: 'a[href="/tasks"]',
    logoutButton: 'button:contains("Logout")',

    // User info
    userGreeting: '.navbar-text',

    // Mobile navigation
    mobileMenu: '.navbar-collapse'
  },

  // === COMMON ELEMENTS ===
  common: {
    // Buttons
    primaryButton: '.btn-primary',
    secondaryButton: '.btn-secondary',
    dangerButton: '.btn-danger',
    successButton: '.btn-success',
    warningButton: '.btn-warning',

    // Alerts and notifications
    successAlert: '.alert-success',
    errorAlert: '.alert-danger',
    warningAlert: '.alert-warning',
    infoAlert: '.alert-info',

    // Form elements
    formControl: '.form-control',
    formCheck: '.form-check',
    formCheckInput: '.form-check-input',
    formLabel: '.form-label',
    invalidFeedback: '.invalid-feedback',

    // Loading states
    spinner: '.spinner-border',
    loadingText: ':contains("Loading")',

    // Cards
    card: '.card',
    cardHeader: '.card-header',
    cardBody: '.card-body',
    cardTitle: '.card-title',
    cardText: '.card-text',

    // Modals
    modal: '.modal',
    modalDialog: '.modal-dialog',
    modalContent: '.modal-content',
    modalHeader: '.modal-header',
    modalBody: '.modal-body',
    modalFooter: '.modal-footer',
    modalCloseButton: '.btn-close',

    // Icons (React Icons)
    checkIcon: '.fa-check',
    editIcon: '.fa-edit',
    deleteIcon: '.fa-trash',
    backIcon: '.fa-arrow-left',
    homeIcon: '.fa-home',
    plusIcon: '.fa-plus',

    // Layout
    container: '.container',
    row: '.row',
    column: '[class*="col-"]'
  },

  // === ERROR AND NOT FOUND PAGES ===
  errorPages: {
    notFoundContainer: '.container.mt-5',
    notFoundCard: '.card.shadow-sm.text-center',
    notFoundIcon: '.fa-exclamation-triangle',
    notFoundTitle: 'h1:contains("404")',
    notFoundSubtitle: 'h2:contains("Page Not Found")',
    notFoundMessage: '.card-text.text-muted',
    homeButton: 'a[href="/dashboard"]',
    tasksButton: 'a[href="/tasks"]'
  },

  // === ACCESSIBILITY SELECTORS ===
  accessibility: {
    // ARIA roles
    main: '[role="main"]',
    navigation: '[role="navigation"]',
    button: '[role="button"]',
    alert: '[role="alert"]',
    status: '[role="status"]',

    // ARIA labels
    usernameField: '[aria-label*="username" i], [aria-labelledby*="username" i]',
    passwordField: '[aria-label*="password" i], [aria-labelledby*="password" i]',

    // Data test ids (if we add them)
    testId: (id: string) => `[data-testid="${id}"]`,

    // Headings by level
    h1: 'h1',
    h2: 'h2',
    h3: 'h3',
    h4: 'h4'
  }
} as const;

// Export individual sections for convenience
export const {
  login,
  dashboard,
  taskForm,
  tasksList,
  taskDetail,
  navigation,
  common,
  errorPages,
  accessibility
} = AppLocators;
