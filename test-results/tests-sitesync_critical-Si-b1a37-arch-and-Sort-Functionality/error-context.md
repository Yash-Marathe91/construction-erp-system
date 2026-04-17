# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\sitesync_critical.spec.ts >> Sitesync Critical Flows >> Inventory - Search and Sort Functionality
- Location: tests\sitesync_critical.spec.ts:153:7

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "Drill Bits"
Received string:    "Portland Cement (Type I)"
```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - heading "Sitesync" [level=1] [ref=e4]
      - button "ME" [ref=e6]
    - main [ref=e7]:
      - generic [ref=e8]:
        - generic [ref=e9]:
          - generic [ref=e10]:
            - heading "Inventory" [level=1] [ref=e11]
            - paragraph [ref=e12]: Site Alpha - Sector 2A
          - button [ref=e13]:
            - img [ref=e14]
          - generic [ref=e16]:
            - generic [ref=e17]:
              - generic [ref=e18]:
                - img [ref=e19]
                - heading "Add New Material" [level=2] [ref=e29]
              - button [ref=e30]:
                - img [ref=e31]
            - generic [ref=e34]:
              - generic [ref=e35]:
                - generic [ref=e36]: Material Name
                - textbox "e.g. Bricks (Red)" [ref=e37]
              - generic [ref=e38]:
                - generic [ref=e39]: Category
                - combobox [ref=e40]:
                  - option "Raw Materials" [selected]
                  - option "Tools & Equipment"
                  - option "Electrical & Plumbing"
                  - option "Safety Gear"
              - generic [ref=e41]:
                - generic [ref=e42]:
                  - generic [ref=e43]: Initial Stock
                  - spinbutton [ref=e44]: "0"
                - generic [ref=e45]:
                  - generic [ref=e46]: Unit
                  - textbox "Bags, Kg, etc" [ref=e47]: Units
              - generic [ref=e48]:
                - generic [ref=e49]: Low Stock Threshold
                - generic [ref=e50]:
                  - spinbutton [ref=e51]: "0"
                  - img [ref=e52]
                - paragraph [ref=e54]: You will get a "LOW STOCK" alert when quantity hits this level.
              - button "Register Material" [ref=e56]:
                - img [ref=e57]
                - text: Register Material
        - generic [ref=e58]:
          - generic [ref=e59]:
            - img [ref=e60]
            - textbox "Search items, dates (e.g. Oct 25), or suppliers..." [ref=e63]: Portland
          - generic [ref=e64]:
            - button [ref=e65]:
              - img [ref=e66]
            - generic [ref=e69]:
              - button "Name (A-Z)" [ref=e70]
              - button "Name (Z-A)" [ref=e71]
              - button "Highest Stock" [ref=e72]
              - button "Lowest Stock" [active] [ref=e73]
              - button "High Priority First" [ref=e74]
        - generic [ref=e75]:
          - link "Stock Items" [ref=e76] [cursor=pointer]:
            - /url: /inventory?tab=stock
          - link "Deliveries" [ref=e77] [cursor=pointer]:
            - /url: /inventory?tab=deliveries
          - link "Requests" [ref=e78] [cursor=pointer]:
            - /url: /inventory?tab=requests
        - generic [ref=e81]:
          - generic [ref=e82]:
            - img [ref=e84]
            - heading "Raw Materials" [level=2] [ref=e94]
          - generic [ref=e97]:
            - generic [ref=e98]:
              - generic [ref=e99]:
                - heading "Portland Cement (Type I)" [level=3] [ref=e100]
                - paragraph [ref=e101]: "Asset ID: MAT-1"
              - generic [ref=e102]:
                - img [ref=e103]
                - text: CRITICAL
            - generic [ref=e105]:
              - generic [ref=e106]:
                - paragraph [ref=e107]: Inventory Level
                - paragraph [ref=e108]: 450 Bags
              - button "Update" [ref=e109]
    - button [ref=e110]:
      - img [ref=e111]
    - navigation [ref=e113]:
      - list [ref=e114]:
        - listitem [ref=e115]:
          - link "Dashboard" [ref=e116] [cursor=pointer]:
            - /url: /
            - img [ref=e117]
            - generic [ref=e122]: Dashboard
        - listitem [ref=e123]:
          - link "Ops" [ref=e124] [cursor=pointer]:
            - /url: /ops
            - img [ref=e125]
            - generic [ref=e129]: Ops
        - listitem [ref=e130]:
          - link "Inventory" [ref=e131] [cursor=pointer]:
            - /url: /inventory
            - img [ref=e132]
            - generic [ref=e135]: Inventory
        - listitem [ref=e136]:
          - link "Finance" [ref=e137] [cursor=pointer]:
            - /url: /finance
            - img [ref=e138]
            - generic [ref=e141]: Finance
        - listitem [ref=e142]:
          - link "Admin" [ref=e143] [cursor=pointer]:
            - /url: /admin
            - img [ref=e144]
            - generic [ref=e146]: Admin
  - button "Open Next.js Dev Tools" [ref=e152] [cursor=pointer]:
    - img [ref=e153]
  - alert [ref=e156]
```

# Test source

```ts
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
  121 |       
  122 |       // Test the Update button text
  123 |       await expect(page.locator('button:has-text("Update Delivery")')).toBeVisible();
  124 |       
  125 |       // Close modal
  126 |       await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click();
  127 |     }
  128 |   });
  129 | 
  130 |   test('Inventory - Request Approval Flow', async ({ page }) => {
  131 |     await page.goto('http://localhost:3000/inventory');
  132 |     
  133 |     // Switch to Requests tab
  134 |     await page.click('a:has-text("Requests")');
  135 |     
  136 |     // Open a request
  137 |     await page.click('button:has-text("View Details")');
  138 |     
  139 |     // Check for details
  140 |     await expect(page.locator('text=Requested Resources')).toBeVisible();
  141 |     await expect(page.locator('text=Justification')).toBeVisible();
  142 |     
  143 |     // Approve
  144 |     await page.click('button:has-text("Approve Request")');
  145 |     
  146 |     // Verify status change in modal (text search)
  147 |     await expect(page.locator('text=Approved').first()).toBeVisible();
  148 |     
  149 |     // Close modal
  150 |     await page.getByRole('button').filter({ has: page.locator('svg.w-6') }).first().click();
  151 |   });
  152 | 
  153 |   test('Inventory - Search and Sort Functionality', async ({ page }) => {
  154 |     await page.goto('http://localhost:3000/inventory');
  155 |     
  156 |     // Test Search in Stock
  157 |     await page.fill('input[placeholder*="Search"]', 'Portland');
  158 |     await expect(page.locator('text=Portland Cement')).toBeVisible();
  159 |     await expect(page.locator('text=Steel Bars')).not.toBeVisible();
  160 |     
  161 |     // Test Sort in Stock
  162 |     await page.click('button:has(svg.w-5.h-5)'); // Open dropdown
  163 |     await page.click('text=Lowest Stock');
  164 |     const firstStockName = await page.locator('h3.font-heading').first().innerText();
> 165 |     expect(firstStockName).toContain('Drill Bits'); // 15 is lower than 450
      |                            ^ Error: expect(received).toContain(expected) // indexOf
  166 |     
  167 |     // Clear search and switch to Deliveries
  168 |     await page.fill('input[placeholder*="Search"]', '');
  169 |     await page.click('a:has-text("Deliveries")');
  170 |     
  171 |     // Search by Date in Deliveries
  172 |     await page.fill('input[placeholder*="Search"]', 'Oct 25');
  173 |     await expect(page.locator('text=SteelWorks Ltd')).toBeVisible();
  174 |     await expect(page.locator('text=BuildMat Corp')).not.toBeVisible(); // BuildMat is "Today"
  175 |   });
  176 | });
  177 | 
```