/**
 * Global setup for the test suite
 * This runs once before all tests
 */
import { FullConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Global setup runs once for the entire test suite
 * Use it to set up environment, create shared data, etc.
 */
async function globalSetup(_config: FullConfig): Promise<void> {
  // Load environment variables from .env file
  dotenv.config({ path: path.join(__dirname, '../../../.env') });

  // You can add more setup code here, for example:
  // - Set up test data in the database
  // - Set up authentication state to share
  // - Prepare external APIs needed for tests

  console.log('Global setup complete');
}

export default globalSetup;
