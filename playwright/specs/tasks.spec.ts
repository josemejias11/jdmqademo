import { test, expect, Page } from '@playwright/test';
import testData from '../fixtures/testData.json';

class TasksPage {
  constructor(private page: Page) {}

  // Navigation and Layout Locators
  get tasksNavLink() {
    return this.page.locator('[data-testid="tasks-nav"], a:has-text("Tasks")');
  }
  get dashboardNavLink() {
    return this.page.locator('[data-testid="dashboard-nav"], a:has-text("Dashboard")');
  }
  get logoutButton() {
    return this.page.locator('[data-testid="logout-button"], button:has-text("Logout")');
  }

  // Task List Locators
  get taskList() {
    return this.page.locator('[data-testid="task-list"], .task-list');
  }
  get taskItems() {
    return this.page.locator('[data-testid="task-item"], .task-item');
  }
  get emptyState() {
    return this.page.locator('[data-testid="empty-state"], .empty-state');
  }
  get loadingSpinner() {
    return this.page.locator('[data-testid="loading"], .spinner');
  }

  // Task Creation/Edit Form Locators
  get createTaskButton() {
    return this.page.locator(
      '[data-testid="create-task-btn"], button:has-text("Create Task"), button:has-text("Add Task")'
    );
  }
  get taskModal() {
    return this.page.locator('[data-testid="task-modal"], .modal');
  }
  get taskTitleInput() {
    return this.page.locator('[data-testid="task-title"], input[name="title"]');
  }
  get taskDescriptionInput() {
    return this.page.locator('[data-testid="task-description"], textarea[name="description"]');
  }
  get saveTaskButton() {
    return this.page.locator(
      '[data-testid="save-task"], button:has-text("Save"), button[type="submit"]'
    );
  }
  get cancelButton() {
    return this.page.locator('[data-testid="cancel-btn"], button:has-text("Cancel")');
  }
  get closeModalButton() {
    return this.page.locator('[data-testid="close-modal"], .modal .close, .modal .btn-close');
  }

  // Task Actions Locators
  get editButtons() {
    return this.page.locator('[data-testid="edit-task"], .edit-btn, button:has-text("Edit")');
  }
  get deleteButtons() {
    return this.page.locator('[data-testid="delete-task"], .delete-btn, button:has-text("Delete")');
  }
  get completeButtons() {
    return this.page.locator(
      '[data-testid="complete-task"], .complete-btn, input[type="checkbox"]'
    );
  }
  get taskStatus() {
    return this.page.locator('[data-testid="task-status"], .task-status');
  }

  // Filter and Search Locators
  get searchInput() {
    return this.page.locator('[data-testid="search-tasks"], input[placeholder*="Search"]');
  }
  get filterDropdown() {
    return this.page.locator('[data-testid="filter-dropdown"], select, .filter-dropdown');
  }
  get filterAll() {
    return this.page.locator('[data-testid="filter-all"], option[value="all"]');
  }
  get filterCompleted() {
    return this.page.locator('[data-testid="filter-completed"], option[value="completed"]');
  }
  get filterPending() {
    return this.page.locator('[data-testid="filter-pending"], option[value="pending"]');
  }

  // Confirmation and Messages
  get confirmationModal() {
    return this.page.locator('[data-testid="confirmation-modal"], .modal.confirmation');
  }
  get confirmDeleteButton() {
    return this.page.locator(
      '[data-testid="confirm-delete"], button:has-text("Delete"), .btn-danger'
    );
  }
  get successMessage() {
    return this.page.locator('[data-testid="success-message"], .alert-success');
  }
  get errorMessage() {
    return this.page.locator('[data-testid="error-message"], .alert-danger');
  }

  // Actions
  async navigateToTasks() {
    await this.tasksNavLink.click();
    await this.page.waitForURL('**/tasks', { timeout: testData.timeouts.navigation });
  }

  async createTask(title: string, description: string) {
    await this.createTaskButton.click();
    await this.taskModal.waitFor({ state: 'visible' });
    await this.taskTitleInput.fill(title);
    await this.taskDescriptionInput.fill(description);
    await this.saveTaskButton.click();
  }

  async editTask(taskIndex: number, newTitle: string, newDescription: string) {
    await this.editButtons.nth(taskIndex).click();
    await this.taskModal.waitFor({ state: 'visible' });
    await this.taskTitleInput.clear();
    await this.taskTitleInput.fill(newTitle);
    await this.taskDescriptionInput.clear();
    await this.taskDescriptionInput.fill(newDescription);
    await this.saveTaskButton.click();
  }

  async deleteTask(taskIndex: number) {
    await this.deleteButtons.nth(taskIndex).click();
    await this.confirmationModal.waitFor({ state: 'visible' });
    await this.confirmDeleteButton.click();
  }

  async toggleTaskComplete(taskIndex: number) {
    await this.completeButtons.nth(taskIndex).click();
  }

  async searchTasks(searchTerm: string) {
    await this.searchInput.fill(searchTerm);
    // Wait for search results to update
    await this.page.waitForTimeout(500);
  }

  async filterTasks(filterType: 'all' | 'completed' | 'pending') {
    await this.filterDropdown.selectOption(filterType);
    await this.page.waitForTimeout(500);
  }

  async getTaskCount() {
    return await this.taskItems.count();
  }

  async getTaskTitle(taskIndex: number) {
    return await this.taskItems
      .nth(taskIndex)
      .locator('[data-testid="task-title"], .task-title')
      .textContent();
  }

  async getTaskDescription(taskIndex: number) {
    return await this.taskItems
      .nth(taskIndex)
      .locator('[data-testid="task-description"], .task-description')
      .textContent();
  }

  async isTaskCompleted(taskIndex: number) {
    const taskItem = this.taskItems.nth(taskIndex);
    const checkbox = taskItem.locator('input[type="checkbox"]');
    return await checkbox.isChecked();
  }
}

// Helper function to login before each test
async function loginUser(page: Page) {
  const validUser = testData.users.valid;
  await page.goto(testData.testEnvironments.development.baseUrl);
  await page.locator('[data-testid="username"], input[name="username"]').fill(validUser.username);
  await page.locator('[data-testid="password"], input[name="password"]').fill(validUser.password);
  await page.locator('[data-testid="login-button"], button[type="submit"]').click();
  await page.waitForURL('**/dashboard', { timeout: testData.timeouts.navigation });
}

test.describe('Task Management', () => {
  let tasksPage: TasksPage;

  test.beforeEach(async ({ page }) => {
    tasksPage = new TasksPage(page);
    await loginUser(page);
    await tasksPage.navigateToTasks();
  });

  test.describe('Task Creation', () => {
    test('should create a new task successfully', async ({ page }) => {
      const newTask = testData.tasks.valid[0];

      await tasksPage.createTask(newTask.title, newTask.description);

      // Should show success message
      await expect(tasksPage.successMessage).toBeVisible();
      await expect(tasksPage.successMessage).toContainText(testData.messages.success.taskCreated);

      // Task should appear in the list
      await expect(tasksPage.taskItems).toContainText(newTask.title);
      await expect(tasksPage.taskItems).toContainText(newTask.description);

      // Modal should close
      await expect(tasksPage.taskModal).not.toBeVisible();
    });

    test('should create multiple tasks', async ({ page }) => {
      const tasks = testData.tasks.valid.slice(0, 3);

      for (const task of tasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }

      // All tasks should be visible
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBeGreaterThanOrEqual(tasks.length);

      // Check if all task titles are present
      for (const task of tasks) {
        await expect(tasksPage.taskList).toContainText(task.title);
      }
    });

    test('should show validation error for empty title', async ({ page }) => {
      const invalidTask = testData.tasks.invalid[0];

      await tasksPage.createTask(invalidTask.title, invalidTask.description);

      // Should show error message
      await expect(tasksPage.errorMessage).toBeVisible();
      await expect(tasksPage.errorMessage).toContainText(invalidTask.expectedError);

      // Modal should remain open
      await expect(tasksPage.taskModal).toBeVisible();
    });

    test('should show validation error for title too long', async ({ page }) => {
      const invalidTask = testData.tasks.invalid[1];

      await tasksPage.createTask(invalidTask.title, invalidTask.description);

      // Should show error message
      await expect(tasksPage.errorMessage).toBeVisible();
      await expect(tasksPage.errorMessage).toContainText(invalidTask.expectedError);
    });

    test('should show validation error for description too long', async ({ page }) => {
      const invalidTask = testData.tasks.invalid[2];

      await tasksPage.createTask(invalidTask.title, invalidTask.description);

      // Should show error message
      await expect(tasksPage.errorMessage).toBeVisible();
      await expect(tasksPage.errorMessage).toContainText(invalidTask.expectedError);
    });

    test('should cancel task creation', async ({ page }) => {
      await tasksPage.createTaskButton.click();
      await tasksPage.taskModal.waitFor({ state: 'visible' });

      // Fill form partially
      await tasksPage.taskTitleInput.fill('Test Task');

      // Cancel
      await tasksPage.cancelButton.click();

      // Modal should close
      await expect(tasksPage.taskModal).not.toBeVisible();

      // Task should not be created
      await expect(tasksPage.taskList).not.toContainText('Test Task');
    });
  });

  test.describe('Task Reading/Display', () => {
    test.beforeEach(async ({ page }) => {
      // Create some test tasks
      const tasks = testData.tasks.valid.slice(0, 2);
      for (const task of tasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }
    });

    test('should display task list correctly', async ({ page }) => {
      // Should show task items
      await expect(tasksPage.taskItems).toHaveCount(2);

      // Should show task details
      const firstTask = testData.tasks.valid[0];
      await expect(tasksPage.taskList).toContainText(firstTask.title);
      await expect(tasksPage.taskList).toContainText(firstTask.description);
    });

    test('should show empty state when no tasks', async ({ page }) => {
      // Delete all tasks first
      const taskCount = await tasksPage.getTaskCount();
      for (let i = 0; i < taskCount; i++) {
        await tasksPage.deleteTask(0);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }

      // Should show empty state
      await expect(tasksPage.emptyState).toBeVisible();
      await expect(tasksPage.taskItems).toHaveCount(0);
    });

    test('should show loading state', async ({ page }) => {
      // Reload page to trigger loading
      await page.reload();

      // Should show loading spinner briefly
      await expect(tasksPage.loadingSpinner).toBeVisible();
    });
  });

  test.describe('Task Editing', () => {
    test.beforeEach(async ({ page }) => {
      // Create a test task
      const task = testData.tasks.valid[0];
      await tasksPage.createTask(task.title, task.description);
      await tasksPage.successMessage.waitFor({ state: 'hidden' });
    });

    test('should edit task successfully', async ({ page }) => {
      const updatedTitle = testData.tasks.updates.titleUpdates[0];
      const updatedDescription = testData.tasks.updates.descriptionUpdates[0];

      await tasksPage.editTask(0, updatedTitle, updatedDescription);

      // Should show success message
      await expect(tasksPage.successMessage).toBeVisible();
      await expect(tasksPage.successMessage).toContainText(testData.messages.success.taskUpdated);

      // Task should show updated content
      await expect(tasksPage.taskList).toContainText(updatedTitle);
      await expect(tasksPage.taskList).toContainText(updatedDescription);

      // Modal should close
      await expect(tasksPage.taskModal).not.toBeVisible();
    });

    test('should pre-populate form when editing', async ({ page }) => {
      const originalTask = testData.tasks.valid[0];

      await tasksPage.editButtons.first().click();
      await tasksPage.taskModal.waitFor({ state: 'visible' });

      // Form should be pre-populated
      await expect(tasksPage.taskTitleInput).toHaveValue(originalTask.title);
      await expect(tasksPage.taskDescriptionInput).toHaveValue(originalTask.description);
    });

    test('should cancel task editing', async ({ page }) => {
      const originalTask = testData.tasks.valid[0];

      await tasksPage.editButtons.first().click();
      await tasksPage.taskModal.waitFor({ state: 'visible' });

      // Make changes
      await tasksPage.taskTitleInput.fill('Changed Title');

      // Cancel
      await tasksPage.cancelButton.click();

      // Modal should close
      await expect(tasksPage.taskModal).not.toBeVisible();

      // Task should remain unchanged
      await expect(tasksPage.taskList).toContainText(originalTask.title);
      await expect(tasksPage.taskList).not.toContainText('Changed Title');
    });
  });

  test.describe('Task Deletion', () => {
    test.beforeEach(async ({ page }) => {
      // Create test tasks
      const tasks = testData.tasks.valid.slice(0, 2);
      for (const task of tasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }
    });

    test('should delete task successfully', async ({ page }) => {
      const taskToDelete = testData.tasks.valid[0];
      const initialCount = await tasksPage.getTaskCount();

      await tasksPage.deleteTask(0);

      // Should show success message
      await expect(tasksPage.successMessage).toBeVisible();
      await expect(tasksPage.successMessage).toContainText(testData.messages.success.taskDeleted);

      // Task should be removed from list
      await expect(tasksPage.taskList).not.toContainText(taskToDelete.title);

      // Task count should decrease
      const newCount = await tasksPage.getTaskCount();
      expect(newCount).toBe(initialCount - 1);
    });

    test('should show confirmation dialog before deletion', async ({ page }) => {
      await tasksPage.deleteButtons.first().click();

      // Should show confirmation modal
      await expect(tasksPage.confirmationModal).toBeVisible();
      await expect(tasksPage.confirmationModal).toContainText(
        testData.messages.confirmations.deleteTask
      );
    });

    test('should cancel task deletion', async ({ page }) => {
      const taskToKeep = testData.tasks.valid[0];
      const initialCount = await tasksPage.getTaskCount();

      await tasksPage.deleteButtons.first().click();
      await tasksPage.confirmationModal.waitFor({ state: 'visible' });

      // Cancel deletion
      await tasksPage.cancelButton.click();

      // Modal should close
      await expect(tasksPage.confirmationModal).not.toBeVisible();

      // Task should remain in list
      await expect(tasksPage.taskList).toContainText(taskToKeep.title);

      // Task count should remain the same
      const newCount = await tasksPage.getTaskCount();
      expect(newCount).toBe(initialCount);
    });
  });

  test.describe('Task Status Toggle', () => {
    test.beforeEach(async ({ page }) => {
      // Create test tasks
      const tasks = testData.tasks.valid.slice(0, 2);
      for (const task of tasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }
    });

    test('should toggle task completion status', async ({ page }) => {
      // Initially task should be pending
      const initialStatus = await tasksPage.isTaskCompleted(0);
      expect(initialStatus).toBe(false);

      // Toggle to completed
      await tasksPage.toggleTaskComplete(0);

      // Should be completed now
      const newStatus = await tasksPage.isTaskCompleted(0);
      expect(newStatus).toBe(true);

      // Toggle back to pending
      await tasksPage.toggleTaskComplete(0);

      // Should be pending again
      const finalStatus = await tasksPage.isTaskCompleted(0);
      expect(finalStatus).toBe(false);
    });

    test('should show visual indication of completed tasks', async ({ page }) => {
      await tasksPage.toggleTaskComplete(0);

      // Should have completed styling
      const taskItem = tasksPage.taskItems.first();
      await expect(taskItem).toHaveClass(/completed|done|finished/);
    });
  });

  test.describe('Task Filtering', () => {
    test.beforeEach(async ({ page }) => {
      // Create mixed status tasks
      const tasks = testData.tasks.valid.slice(0, 4);
      for (const task of tasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }

      // Mark first two as completed
      await tasksPage.toggleTaskComplete(0);
      await tasksPage.toggleTaskComplete(1);
    });

    test('should filter all tasks', async ({ page }) => {
      await tasksPage.filterTasks('all');

      // Should show all tasks
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(4);
    });

    test('should filter completed tasks', async ({ page }) => {
      await tasksPage.filterTasks('completed');

      // Should show only completed tasks
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(2);

      // All visible tasks should be completed
      for (let i = 0; i < taskCount; i++) {
        const isCompleted = await tasksPage.isTaskCompleted(i);
        expect(isCompleted).toBe(true);
      }
    });

    test('should filter pending tasks', async ({ page }) => {
      await tasksPage.filterTasks('pending');

      // Should show only pending tasks
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(2);

      // All visible tasks should be pending
      for (let i = 0; i < taskCount; i++) {
        const isCompleted = await tasksPage.isTaskCompleted(i);
        expect(isCompleted).toBe(false);
      }
    });
  });

  test.describe('Task Search', () => {
    test.beforeEach(async ({ page }) => {
      // Create tasks with different content
      const tasks = testData.tasks.valid.slice(0, 3);
      for (const task of tasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }
    });

    test('should search tasks by title', async ({ page }) => {
      const searchTerm = testData.filters.search[0];

      await tasksPage.searchTasks(searchTerm.term);

      // Should show only matching tasks
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(searchTerm.expectedResults);

      // Visible tasks should contain search term
      if (taskCount > 0) {
        await expect(tasksPage.taskList).toContainText(searchTerm.term);
      }
    });

    test('should search tasks by description', async ({ page }) => {
      const searchTerm = testData.filters.search[1];

      await tasksPage.searchTasks(searchTerm.term);

      // Should show matching tasks
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(searchTerm.expectedResults);
    });

    test('should show no results for non-existent search', async ({ page }) => {
      const searchTerm = testData.filters.search[2];

      await tasksPage.searchTasks(searchTerm.term);

      // Should show no tasks
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(0);

      // Should show empty state or no results message
      await expect(tasksPage.emptyState).toBeVisible();
    });

    test('should show all tasks when search is cleared', async ({ page }) => {
      // First search for something
      await tasksPage.searchTasks('documentation');

      // Then clear search
      await tasksPage.searchTasks('');

      // Should show all tasks again
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(3);
    });
  });

  test.describe('Responsive Design', () => {
    test.beforeEach(async ({ page }) => {
      // Create a test task
      const task = testData.tasks.valid[0];
      await tasksPage.createTask(task.title, task.description);
      await tasksPage.successMessage.waitFor({ state: 'hidden' });
    });

    test('should work properly on mobile devices', async ({ page }) => {
      const mobileViewport = testData.ui.breakpoints.mobile;
      await page.setViewportSize({ width: mobileViewport.width, height: mobileViewport.height });

      // Task list should be visible
      await expect(tasksPage.taskList).toBeVisible();

      // Should be able to create tasks on mobile
      await tasksPage.createTask('Mobile Task', 'Created on mobile');
      await expect(tasksPage.successMessage).toBeVisible();
    });

    test('should work properly on tablet devices', async ({ page }) => {
      const tabletViewport = testData.ui.breakpoints.tablet;
      await page.setViewportSize({ width: tabletViewport.width, height: tabletViewport.height });

      // All functionality should work on tablet
      await tasksPage.createTask('Tablet Task', 'Created on tablet');
      await expect(tasksPage.successMessage).toBeVisible();

      // Should be able to edit tasks
      await tasksPage.editTask(0, 'Updated Task', 'Updated description');
      await expect(tasksPage.successMessage).toBeVisible();
    });
  });

  test.describe('Performance', () => {
    test('should handle bulk task creation', async ({ page }) => {
      const bulkTasks = testData.tasks.bulk;

      // Create multiple tasks
      for (const task of bulkTasks) {
        await tasksPage.createTask(task.title, task.description);
        await tasksPage.successMessage.waitFor({ state: 'hidden' });
      }

      // All tasks should be visible
      const taskCount = await tasksPage.getTaskCount();
      expect(taskCount).toBe(bulkTasks.length);
    });

    test('should load tasks within acceptable time', async ({ page }) => {
      // Navigate to tasks and measure load time
      const startTime = Date.now();
      await tasksPage.navigateToTasks();
      const loadTime = Date.now() - startTime;

      // Should load within threshold
      expect(loadTime).toBeLessThan(testData.performance.thresholds.pageLoadTime);
    });
  });

  test.describe('Error Handling', () => {
    test('should handle network errors gracefully', async ({ page }) => {
      // Simulate network failure
      await page.route('**/api/tasks', route => route.abort());

      await page.reload();

      // Should show error message
      await expect(tasksPage.errorMessage).toBeVisible();
      await expect(tasksPage.errorMessage).toContainText(testData.errors.network.connectionError);
    });

    test('should handle server errors gracefully', async ({ page }) => {
      // Simulate server error
      await page.route('**/api/tasks', route => route.fulfill({ status: 500 }));

      await tasksPage.createTaskButton.click();
      await tasksPage.createTask('Test Task', 'Test Description');

      // Should show error message
      await expect(tasksPage.errorMessage).toBeVisible();
      await expect(tasksPage.errorMessage).toContainText(testData.errors.network.serverError);
    });
  });
});
