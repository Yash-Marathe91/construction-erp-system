# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\sitesync_critical.spec.ts >> Sitesync Critical Flows >> Operations - End Shift Flow
- Location: tests\sitesync_critical.spec.ts:88:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic:
  - generic [active]:
    - generic [ref=e3]:
      - generic [ref=e4]:
        - generic [ref=e5]:
          - navigation [ref=e6]:
            - button "previous" [disabled] [ref=e7]:
              - img "previous" [ref=e8]
            - generic [ref=e10]:
              - generic [ref=e11]: 1/
              - text: "1"
            - button "next" [disabled] [ref=e12]:
              - img "next" [ref=e13]
          - img
        - generic [ref=e15]:
          - generic [ref=e16]:
            - img [ref=e17]
            - generic "Latest available version is detected (16.2.2)." [ref=e19]: Next.js 16.2.2
            - generic [ref=e20]: Turbopack
          - img
      - dialog "Build Error" [ref=e22]:
        - generic [ref=e25]:
          - generic [ref=e26]:
            - generic [ref=e27]:
              - generic [ref=e29]: Build Error
              - generic [ref=e30]:
                - button "Copy Error Info" [ref=e31] [cursor=pointer]:
                  - img [ref=e32]
                - link "Go to related documentation" [ref=e34] [cursor=pointer]:
                  - /url: https://nextjs.org/docs/messages/module-not-found
                  - img [ref=e35]
                - button "Attach Node.js inspector" [ref=e37] [cursor=pointer]:
                  - img [ref=e38]
            - generic [ref=e47]: "Module not found: Can't resolve '@/components/ui/dropdown-menu'"
          - generic [ref=e49]:
            - generic [ref=e51]:
              - img [ref=e53]
              - generic [ref=e56]: ./components/InventoryDashboard.tsx (16:1)
              - button "Open in editor" [ref=e57] [cursor=pointer]:
                - img [ref=e59]
            - generic [ref=e62]:
              - generic [ref=e63]: Module not found
              - generic [ref=e64]: ": Can't resolve"
              - text: "'@/components/ui/dropdown-menu'"
              - generic [ref=e65]: 14 |
              - generic [ref=e66]: ...
              - text: DeliveriesList
              - generic [ref=e67]: "}"
              - text: from ...
              - generic [ref=e68]: 15 |
              - generic [ref=e69]: ...
              - text: RequestsList
              - generic [ref=e70]: "}"
              - text: from ".... >
              - generic [ref=e71]: 16 |
              - generic [ref=e72]: ...
              - generic [ref=e73]: "|"
              - text: ^^^^^^^^ >
              - generic [ref=e74]: 17 |
              - generic [ref=e75]: ...
              - text: wnMenu
              - generic [ref=e76]: ","
              - generic [ref=e77]: "|"
              - text: ^^^^^^^^^^^^^^^ >
              - generic [ref=e78]: 18 |
              - generic [ref=e79]: ...
              - text: wnMenuContent
              - generic [ref=e80]: ","
              - generic [ref=e81]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^ >
              - generic [ref=e82]: 19 |
              - generic [ref=e83]: ...
              - text: wnMenuItem
              - generic [ref=e84]: ","
              - generic [ref=e85]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^ >
              - generic [ref=e86]: 20 |
              - generic [ref=e87]: ...
              - text: wnMenuTrigger
              - generic [ref=e88]: ","
              - generic [ref=e89]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^ >
              - generic [ref=e90]: 21 |
              - generic [ref=e91]: ...
              - text: "@/components/ui/dropdow..."
              - generic [ref=e92]: "|"
              - text: ^^^^^^^^^^^^^^^^^^^^^^^^^^
              - generic [ref=e93]: 22 |
              - generic [ref=e94]: ...
              - generic [ref=e95]: 23 |
              - generic [ref=e96]: ...
              - text: e InventoryDashboardPro..
              - generic [ref=e97]: .
              - generic [ref=e98]: 24 |
              - generic [ref=e99]:
                - text: "...lStock: any[]; Import map: aliased to relative './components/ui/dropdown-menu' inside of [project]/ Import trace: Server Component: ./components/InventoryDashboard.tsx ./app/inventory/page.tsx"
                - link "https://nextjs.org/docs/messages/module-not-found" [ref=e100] [cursor=pointer]:
                  - /url: https://nextjs.org/docs/messages/module-not-found
        - generic [ref=e101]: "1"
        - generic [ref=e102]: "2"
    - generic [ref=e107] [cursor=pointer]:
      - button "Open Next.js Dev Tools" [ref=e108]:
        - img [ref=e109]
      - button "Open issues overlay" [ref=e113]:
        - generic [ref=e114]:
          - generic [ref=e115]: "0"
          - generic [ref=e116]: "1"
        - generic [ref=e117]: Issue
  - alert [ref=e118]
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
> 14  |     await page.fill('input[type="email"]', CREDENTIALS.email);
      |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  15  |     await page.fill('input[type="password"]', CREDENTIALS.password);
  16  |     await page.click('button:has-text("Sign In")');
  17  | 
  18  |     // Handle potential error messages or navigation
  19  |     try {
  20  |       await expect(page).toHaveURL('http://localhost:3000/', { timeout: 15000 });
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
```