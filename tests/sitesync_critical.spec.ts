import { test, expect } from '@playwright/test';

const CREDENTIALS = {
  email: 'yashmarathe4141@gmail.com',
  password: 'pass123'
};

test.describe('Sitesync Critical Flows', () => {
  test.beforeEach(async ({ page }) => {
    // Go to login page
    await page.goto('http://localhost:3000/login');
    
    // Perform login
    await page.fill('input[type="email"]', CREDENTIALS.email);
    await page.fill('input[type="password"]', CREDENTIALS.password);
    await page.click('button:has-text("Sign In")');

    // Handle potential error messages or navigation
    try {
      await expect(page).toHaveURL('http://localhost:3000/', { timeout: 15000 });
    } catch (e) {
      const errorText = await page.locator('.bg-\\[\\#ffdad6\\]').innerText().catch(() => "No error visible");
      console.error("Login failed with error on UI:", errorText);
      throw e;
    }
  });

  test('Operations - Attendance Sorting and Logs', async ({ page }) => {
    await page.goto('http://localhost:3000/ops');
    
    // Switch to Attendance tab (Link)
    await page.click('a:has-text("Attendance")');
    
    // Open View All Logs
    await page.click('button:has-text("View All Logs")');
    await expect(page.locator('text=Comprehensive Attendance Logs')).toBeVisible();
    
    // Test Sorting
    await page.selectOption('select', 'present'); 
    const rows = page.locator('table tr');
    expect(await rows.count()).toBeGreaterThan(5);
    
    // Close modal (X button or just check visibility then close)
    await page.click('button:has-text("Export Logs")'); // Just to see if it responds
    await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Click X
  });

  test('Operations - Payroll and Salary Distribution', async ({ page }) => {
    await page.goto('http://localhost:3000/ops');
    
    // Switch to Payroll tab
    await page.click('a:has-text("Payroll")');
    
    // Add New Salary (Configure Payroll button)
    await page.click('button:has-text("Configure Payroll")');
    await page.fill('input[placeholder="0.00"]', '50000');
    
    // Verify Net Pay calculation text
    const netPayText = await page.locator('p.text-3xl').innerText();
    expect(netPayText).not.toBe('$0');
    
    await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Click X
    
    // View Details (onClick on the card)
    const cards = page.locator('div.cursor-pointer');
    if (await cards.count() > 0) {
      await cards.first().click();
      await expect(page.locator('text=Net Monthly Salary')).toBeVisible();
      await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Close
    }
  });

  test('Operations - Payments and Receipts', async ({ page }) => {
    await page.goto('http://localhost:3000/ops');
    
    // Switch to Payments tab
    await page.click('a:has-text("Payments")');
    
    // View Receipt
    const viewReceiptButtons = page.locator('button:has-text("View Receipt")');
    if (await viewReceiptButtons.count() > 0) {
      await viewReceiptButtons.first().click();
      await expect(page.locator('text=Payment Receipt')).toBeVisible();
      await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Close
    }
  });

  test('Operations - End Shift Flow', async ({ page }) => {
    await page.goto('http://localhost:3000/ops');
    
    // Click End Shift
    await page.click('button:has-text("End Shift")');
    
    // Step 1: Verification
    await expect(page.locator('text=End Operational Shift')).toBeVisible();
    await expect(page.locator('text=Pre-Closing Checklist')).toBeVisible();
    await page.click('button:has-text("Confirm & Close Shift")');
    
    // Step 2: Success
    await expect(page.locator('text=Shift Secured')).toBeVisible({ timeout: 10000 });
    await page.click('button:has-text("Return to Operations")');
    
    // Modal should be closed
    await expect(page.locator('text=Shift Secured')).not.toBeVisible();
  });

  test('Inventory - Deliveries Detail and Contacts', async ({ page }) => {
    await page.goto('http://localhost:3000/inventory');
    
    // Switch to Deliveries tab
    await page.click('a:has-text("Deliveries")');
    
    // Open a delivery
    const deliveryCards = page.locator('div.cursor-pointer');
    if (await deliveryCards.count() > 0) {
      await deliveryCards.first().click();
      
      // Check for details
      await expect(page.locator('text=Supplier Contacts')).toBeVisible();
      await expect(page.locator('text=Management Controls')).toBeVisible();
      
      // Test the Update button text
      await expect(page.locator('button:has-text("Update Delivery")')).toBeVisible();
      
      // Close modal
      await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click();
    }
  });

  test('Inventory - Request Approval Flow', async ({ page }) => {
    await page.goto('http://localhost:3000/inventory');
    
    // Switch to Requests tab
    await page.click('a:has-text("Requests")');
    
    // Open a request
    await page.click('button:has-text("View Details")');
    
    // Check for details
    await expect(page.locator('text=Requested Resources')).toBeVisible();
    await expect(page.locator('text=Justification')).toBeVisible();
    
    // Approve
    await page.click('button:has-text("Approve Request")');
    
    // Verify status change in modal (text search)
    await expect(page.locator('text=Approved').first()).toBeVisible();
    
    // Close modal
    await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click();
  });

  test('Inventory - Search and Sort Functionality', async ({ page }) => {
    await page.goto('http://localhost:3000/inventory');
    
    // Test Search in Stock
    await page.fill('input[placeholder*="Search"]', 'Portland');
    await expect(page.locator('text=Portland Cement')).toBeVisible();
    await expect(page.locator('text=Steel Bars')).not.toBeVisible();
    
    // Test Sort in Stock
    await page.click('button:has(svg.w-5.h-5)'); // Open dropdown
    await page.click('text=Lowest Stock');
    const firstStockName = await page.locator('h3.font-heading').first().innerText();
    expect(firstStockName).toContain('Drill Bits'); // 15 is lower than 450
    
    // Clear search and switch to Deliveries
    await page.fill('input[placeholder*="Search"]', '');
    await page.click('a:has-text("Deliveries")');
    
    // Search by Date in Deliveries
    await page.fill('input[placeholder*="Search"]', 'Oct 25');
    await expect(page.locator('text=SteelWorks Ltd')).toBeVisible();
    await expect(page.locator('text=BuildMat Corp')).not.toBeVisible(); // BuildMat is "Today"
  });
});
