# LEDGER ZERO – Hackathon Judge Demo Script

**Estimated Duration:** 3 to 5 minutes  
**Goal:** Demonstrate the complete **Observe → Investigate → Plan → Validate → Request Approval → Execute → Verify** autonomous loop.

---

## Step 1: The Overview & Liquidity Surveillance (0:00 – 0:45)

1. **Load Dashboard (`/`):**
   - Point to the persistent **"Demo data – simulated"** banner at the top.
   - Point out the headline metrics for **Harbor & Pine Supply Co.**:
     - Confirmed Cash: **$20,000.00**
     - Customer Receivables: **$25,000.00**
     - 7-Day Payables: **$45,000.00**
     - 7-Day Liquidity Buffer: **-$25,000.00** (Shortfall alert)
2. **Observe the Critical Shortfall Alert:**
   - Note the red alert banner: *"Projected Working Capital Shortfall Detected on Oct 21 (-$25,000.00 deficit)"*.
   - Point out the **Cash Balance Trajectory** chart: hovering over Oct 21 shows the balance dipping below the zero line when the Cascade Lumber $25k bill matures.
3. **Trigger Autonomous Investigation:**
   - Click the red **"Investigate with AI"** button in the alert banner.

---

## Step 2: Autonomous Investigation & Evidence Gathering (0:45 – 1:45)

1. **Observe the Agent Execution Stream:**
   - The AI Workspace launches with the goal: *"Help me avoid a cash shortage next week"*.
   - Watch the agent's step-by-step progress:
     - `goal_received` → Logs goal.
     - `plan_created` → Formulates 4-step investigation plan.
     - `tool_call_start` → Calls `calculate_cash_flow_forecast(days: 7)`.
     - `tool_call_start` → Calls `list_overdue_receivables()`.
     - `evidence_found` → Discovers that **Apex Retail Partners** has an uncollected invoice of **$15,000.00** (6 days overdue).
     - `draft_produced` → Drafts an expedited collection reminder offering a 2% early wire discount.
     - `approval_requested` → **Halts execution** and creates a governed Action Card.
2. **Auditable Evidence & Facts:**
   - In the right-hand panel, note the separation between **Verified Facts** (grounded in the ledger) and **Assumptions**.

---

## Step 3: Human Authorization & Governance (1:45 – 2:30)

1. **Review the Action Approval Card:**
   - Inspect the proposed task: *"Dispatch Collection Reminder with 2% Early Settlement Discount"*.
   - Point out the Risk Level (**MEDIUM**) and Required Role (**Owner**).
2. **Demonstrate Role-Based Enforcement (Judge Favorite):**
   - In the top bar, click the **Role Switcher** and select **"Viewer"**.
   - Notice the **"Approve & Execute"** button immediately disables with a clear security notice: *"Your current role (Viewer) is read-only for approvals"*.
   - Switch role back to **"Owner"**. The button re-enables!
3. **Authorize and Execute:**
   - Click **"Approve & Execute"**.
   - Watch the execution animation.
   - Status updates to **"COMPLETED"** with verified receipt:  
     `"Logged in-app (simulated delivery). Customer reminder dispatched and recorded in audit log."`

---

## Step 4: Verify in Cash Flow Simulator (2:30 – 3:30)

1. **Navigate to "Cash Flow & Scenarios" (`/cash-flow`):**
   - Look at the comparative chart:
     - **Dashed gray line:** The baseline projection showing the -$25,000 shortfall.
     - **Solid green curve:** The modified scenario with accelerated collections and payment deferral.
   - Note the green banner: *"Shortfall Successfully Resolved! +$34,700 Liquidity Improvement"*.
2. **Inspect Active Scenario Levers:**
   - Toggle the assumption levers to demonstrate that calculations run purely client-side without mutating live ledger data.

---

## Step 5: Universal Multi-Currency & CSV Import (3:30 – 4:30)

1. **Switch Currency Preset:**
   - In the top bar, open the **Locale Switcher** and select **"BDT - Bangladesh (৳)"** or **"EUR - European Union (€)"**.
   - Watch all figures, charts, and tables update instantly with localized currency formatting and exact minor units.
2. **Transactions CSV Import:**
   - Click **"Transactions"** in the sidebar.
   - Click **"Import CSV"**.
   - Upload any CSV or inspect the preview table to show automatic duplicate detection.
3. **Audit Trail Verification:**
   - Click **"Agent Audit Logs"** to view the immutable cryptographic trail logging every step of the agent's reasoning and the user's approval.

---

## Conclusion
LEDGER ZERO delivers on the vision of **"From financial insight to real-world action"** by combining pure financial calculation, deterministic simulation, and governed human approval.
