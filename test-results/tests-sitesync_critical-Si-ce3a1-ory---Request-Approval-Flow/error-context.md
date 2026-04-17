# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\sitesync_critical.spec.ts >> Sitesync Critical Flows >> Inventory - Request Approval Flow
- Location: tests\sitesync_critical.spec.ts:130:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: expect(page).toHaveURL(expected) failed

Expected: "http://localhost:3000/"
Received: "http://localhost:3000/login"

Call log:
  - Expect "toHaveURL" with timeout 15000ms
    3 × unexpected value "http://localhost:3000/login?"
    5 × unexpected value "http://localhost:3000/login"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - img [ref=e6]
      - heading "Sitesync" [level=1] [ref=e11]
      - paragraph [ref=e12]: ENTERPRISE OS
    - generic [ref=e13]:
      - generic [ref=e14]:
        - generic [ref=e15]: Email Address
        - textbox "manager@example.com" [ref=e16]
      - generic [ref=e17]:
        - generic [ref=e18]: Password
        - textbox "••••••••" [ref=e19]
      - generic [ref=e20]:
        - button "Create Account" [ref=e21]
        - button "Sign In" [ref=e22]
    - paragraph [ref=e23]: Protected by role-based access control.
  - button "Open Next.js Dev Tools" [ref=e29] [cursor=pointer]:
    - img [ref=e30]
  - alert [ref=e33]
```

# Test source

```ts
  1   | import { test, expect } from '@playwright/test';
  2   | 
  3   | const CREDENTIALS = {
  4   |   email: 'yashmarathe4141@gmail.com',
  5   |   password: 'pass123'
  6   | };
  7   | 
  8   | test.describe('Sitesync Critical Flows', () => {
  9   |   test.beforeEach(async ({ page }) => {
  10  |     // Go to login page
  11  |     await page.goto('http://localhost:3000/login');
  12  |     
  13  |     // Perform login
  14  |     await page.fill('input[type="email"]', CREDENTIALS.email);
  15  |     await page.fill('input[type="password"]', CREDENTIALS.password);
  16  |     await page.click('button:has-text("Sign In")');
  17  | 
  18  |     // Handle potential error messages or navigation
  19  |     try {
> 20  |       await expect(page).toHaveURL('http://localhost:3000/', { timeout: 15000 });
      |                          ^ Error: expect(page).toHaveURL(expected) failed
  21  |     } catch (e) {
  22  |       const errorText = await page.locator('.bg-\\[\\#ffdad6\\]').innerText().catch(() => "No error visible");
  23  |       console.error("Login failed with error on UI:", errorText);
  24  |       throw e;
  25  |     }
  26  |   });
  27  | 
  28  |   test('Operations - Attendance Sorting and Logs', async ({ page }) => {
  29  |     await page.goto('http://localhost:3000/ops');
  30  |     
  31  |     // Switch to Attendance tab (Link)
  32  |     await page.click('a:has-text("Attendance")');
  33  |     
  34  |     // Open View All Logs
  35  |     await page.click('button:has-text("View All Logs")');
  36  |     await expect(page.locator('text=Comprehensive Attendance Logs')).toBeVisible();
  37  |     
  38  |     // Test Sorting
  39  |     await page.selectOption('select', 'present'); 
  40  |     const rows = page.locator('table tr');
  41  |     expect(await rows.count()).toBeGreaterThan(5);
  42  |     
  43  |     // Close modal (X button or just check visibility then close)
  44  |     await page.click('button:has-text("Export Logs")'); // Just to see if it responds
  45  |     await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Click X
  46  |   });
  47  | 
  48  |   test('Operations - Payroll and Salary Distribution', async ({ page }) => {
  49  |     await page.goto('http://localhost:3000/ops');
  50  |     
  51  |     // Switch to Payroll tab
  52  |     await page.click('a:has-text("Payroll")');
  53  |     
  54  |     // Add New Salary (Configure Payroll button)
  55  |     await page.click('button:has-text("Configure Payroll")');
  56  |     await page.fill('input[placeholder="0.00"]', '50000');
  57  |     
  58  |     // Verify Net Pay calculation text
  59  |     const netPayText = await page.locator('p.text-3xl').innerText();
  60  |     expect(netPayText).not.toBe('$0');
  61  |     
  62  |     await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Click X
  63  |     
  64  |     // View Details (onClick on the card)
  65  |     const cards = page.locator('div.cursor-pointer');
  66  |     if (await cards.count() > 0) {
  67  |       await cards.first().click();
  68  |       await expect(page.locator('text=Net Monthly Salary')).toBeVisible();
  69  |       await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Close
  70  |     }
  71  |   });
  72  | 
  73  |   test('Operations - Payments and Receipts', async ({ page }) => {
  74  |     await page.goto('http://localhost:3000/ops');
  75  |     
  76  |     // Switch to Payments tab
  77  |     await page.click('a:has-text("Payments")');
  78  |     
  79  |     // View Receipt
  80  |     const viewReceiptButtons = page.locator('button:has-text("View Receipt")');
  81  |     if (await viewReceiptButtons.count() > 0) {
  82  |       await viewReceiptButtons.first().click();
  83  |       await expect(page.locator('text=Payment Receipt')).toBeVisible();
  84  |       await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click(); // Close
  85  |     }
  86  |   });
  87  | 
  88  |   test('Operations - End Shift Flow', async ({ page }) => {
  89  |     await page.goto('http://localhost:3000/ops');
  90  |     
  91  |     // Click End Shift
  92  |     await page.click('button:has-text("End Shift")');
  93  |     
  94  |     // Step 1: Verification
  95  |     await expect(page.locator('text=End Operational Shift')).toBeVisible();
  96  |     await expect(page.locator('text=Pre-Closing Checklist')).toBeVisible();
  97  |     await page.click('button:has-text("Confirm & Close Shift")');
  98  |     
  99  |     // Step 2: Success
  100 |     await expect(page.locator('text=Shift Secured')).toBeVisible({ timeout: 10000 });
  101 |     await page.click('button:has-text("Return to Operations")');
  102 |     
  103 |     // Modal should be closed
  104 |     await expect(page.locator('text=Shift Secured')).not.toBeVisible();
  105 |   });
  106 | 
  107 |   test('Inventory - Deliveries Detail and Contacts', async ({ page }) => {
  108 |     await page.goto('http://localhost:3000/inventory');
  109 |     
  110 |     // Switch to Deliveries tab
  111 |     await page.click('a:has-text("Deliveries")');
  112 |     
  113 |     // Open a delivery
  114 |     const deliveryCards = page.locator('div.cursor-pointer');
  115 |     if (await deliveryCards.count() > 0) {
  116 |       await deliveryCards.first().click();
  117 |       
  118 |       // Check for details
  119 |       await expect(page.locator('text=Supplier Contacts')).toBeVisible();
  120 |       await expect(page.locator('text=Management Controls')).toBeVisible();
```