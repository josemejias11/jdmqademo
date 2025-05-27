const fs = require('fs');
const path = require('path');

// Files and directories to remove
const toRemove = ['src/logo.svg', 'src/reportWebVitals.tsx', 'src/components/shared', 'docs'];

// Function to safely remove a file or directory
const removeItem = itemPath => {
  try {
    const fullPath = path.join(__dirname, itemPath);

    // Check if path exists
    if (!fs.existsSync(fullPath)) {
      console.log(`⚠️ ${itemPath} does not exist, skipping...`);
      return;
    }

    // Check if it's a directory
    const stats = fs.statSync(fullPath);
    if (stats.isDirectory()) {
      // Remove directory recursively
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`🗑️ Removed directory: ${itemPath}`);
    } else {
      // Remove file
      fs.unlinkSync(fullPath);
      console.log(`🗑️ Removed file: ${itemPath}`);
    }
  } catch (error) {
    console.error(`❌ Error removing ${itemPath}:`, error.message);
  }
};

// Update index.tsx to remove reportWebVitals import and call
const updateIndexFile = () => {
  try {
    const indexPath = path.join(__dirname, 'src/index.tsx');

    // Check if file exists
    if (!fs.existsSync(indexPath)) {
      console.log('⚠️ src/index.tsx does not exist, skipping update...');
      return;
    }

    // Read index.tsx
    let content = fs.readFileSync(indexPath, 'utf8');

    // Remove reportWebVitals import
    content = content.replace(
      /import\s+reportWebVitals\s+from\s+['"]\.\/reportWebVitals['"];?\n?/g,
      ''
    );

    // Remove reportWebVitals call
    content = content.replace(/reportWebVitals\(\);?\n?/g, '');

    // Write updated content back to file
    fs.writeFileSync(indexPath, content);
    console.log('✅ Updated src/index.tsx to remove reportWebVitals references');
  } catch (error) {
    console.error('❌ Error updating src/index.tsx:', error.message);
  }
};

// Main execution
console.log('🧹 Starting cleanup of unused files and components...');

// Remove each item in the list
toRemove.forEach(item => removeItem(item));

// Update index.tsx
updateIndexFile();

console.log('✨ Cleanup completed!');
