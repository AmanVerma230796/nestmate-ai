# NestMate AI — Working Lean MVP (v2.0)

**NestMate AI** is a mobile-first Progressive Web App (PWA) tailored for urban Indian renters in high-density tech corridors (Gurugram: DLF Phase 3, Sector 43, Golf Course Road).

It solves the dual problem of shared urban housing:
1. **Pre-move-in Discovery:** Verified, lifestyle-compatible flatmate matching via swipe deck, hard dealbreakers (diet, smoking, budget, gender), and deterministic 0–100% compatibility scoring.
2. **Post-move-in Household OS:** An AI-assisted co-living manager featuring an approval-gated House Constitution, chore & domestic staff rotation (maid/cook/water), and expense split ledger with direct UPI deep links.
3. **The Make-or-Break Bridge (F-06):** Seamless 1-tap conversion inside chat from mutual match handshake to active shared household workspace.

---

## 🚀 Quick Start

### 1. Launch with Node.js Server
```bash
# Run the local server
npm start
# or
node server.js
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### 2. Standalone / Zero-Dependency Mode
You can also open [`public/index.html`](file:///Users/amanverma/Desktop/Flatmate/public/index.html) directly in Chrome, Safari, or Edge. The app includes local state persistence (`localStorage`) and instant seed calibration.

---

## 📱 Core Features & Implementation Architecture

### 1. Swipe Discovery Deck (`F-01`, `F-03`, `F-04`)
- **Real Touch & Pointer Gestures:** Drag left to **Pass**, drag right to **Connect & Tour**, drag up to **Save**, or use tactile control buttons.
- **Micro-Dashboard Lifestyle Synergy:** Shows deterministic compatibility % (sub-50ms engine) and breakdown for Diet, Sleep schedule, and WFH habits.
- **All-Inclusive Financials & Costs:** Displays rent inclusive of maintenance and DG power backup, plus splits for cook, maid, and wifi.
- **Corridor & Dealbreaker Filters:** Instant filtering by Gurugram corridor (DLF Phase 3, Sector 43, Golf Course Rd), budget, and dietary preferences.
- **Empty State & Seeker Queue:** Seeker waitlist alert for corridor liquidity management.

### 2. Match Pipeline & 24h Chat Room (`F-05`, `F-06`)
- **24-Hour Mutual Window:** Urgent countdown timer badges to encourage quick connections.
- **Dynamic Icebreaker Chips:** Contextual conversation starters generated from mutual synergies and friction points.
- **Move-In Handshake Trigger:** Mutual "We're Moving In Together" confirmation.
- **The Critical Bridge CTA (F-06):** Surfaces dynamically upon move-in intent: *"Generate our House Rules & Split Sheet in 1-tap"*. Validates the PRD §10 conversion test and immediately links the matched pair into Home OS.

### 3. Home OS Co-Living Manager (`F-07`, `F-08`, `F-09`)
- **House Constitution (F-07):** 6 living rules tailored for Gurugram urban flats (11 PM quiet hours, separate non-veg cookware, balcony-only smoking, overnight guests notice, 24°C AC thermostat, 1st-of-month cook/maid settlement). Multi-signatory approval gating with interactive signatures.
- **Chore & Domestic Staff Rotation (F-08):** Daily task checklist (Bisleri 20L water can, kitchen dry/wet waste segregation, deep clean) with auto-rotation. Direct 1-tap Call and WhatsApp buttons for maid (Sunita Bai), cook (Raju Bhaiya), and water supplier.
- **Expense Split Ledger & UPI Deep Links (F-09):** Real-time balance tracker (+₹2,100 receivable), expense logger with customizable split options, neutral scheduled reminders, and a **Direct UPI Settle-Up modal** with live QR code and `upi://pay` deep links (supporting GPay, PhonePe, Paytm, and BHIM).

### 4. Identity & Verification Center (`F-02`, `F-03`)
- **Trust & Safety Level 3:** Verified corporate SSO (Deloitte Enterprise), DigiLocker Aadhaar KYC, and LinkedIn Work Identity sync.
- **Inclusive Verification:** Dedicated student ID and freelancer GST/portfolio submission paths.
- **Phone Privacy Shield:** Numbers remain masked until mutual match and handshake confirmation.
- **Anti-Broker Guardrails:** Strict 3-strike policy with in-app reporting tool to keep brokers below 1.5%.
- **12-Question Lifestyle Quiz:** Dealbreakers first, soft habits after, with instant recalculation of user compatibility vectors.

---

## 🎨 Design System: Warm Urban Trust
Adheres strictly to the guidelines defined in `stitch_nestmate_ai_prd/warm_urban_trust/DESIGN.md`:
- **Terracotta Rust (`#A83223` / `#E05A47`):** High-intent conversions, brand affirmative actions, and primary CTAs.
- **Deep Slate Teal (`#1D4E5B` / `#366572`):** Identity verification, trust badges, and active navigation indicators.
- **Emerald Mint (`#006B2C` / `#16A34A`):** KYC verification checkmarks and high-compatibility indicators.
- **Typography:** *Plus Jakarta Sans* for editorial warmth paired with *Inter* (with `font-variant-numeric: tabular-nums`) for currency and metrics.
- **Shell:** Fixed 4-tab adaptive dock, 420px mobile-first thumb zone, and desktop canvas toggle.

---

## 📂 Project Directory Structure

```
Flatmate/
├── data/
│   ├── seedData.json           # Seed profiles, matches, chats, constitution, and chores
│   └── db.json                 # Persistent database state
├── public/
│   ├── css/
│   │   └── style.css           # Warm Urban Trust custom CSS & swipe gesture physics
│   ├── js/
│   │   ├── seed.js             # Standalone fallback seed data
│   │   ├── api.js              # State manager & REST client with localStorage fallback
│   │   ├── swipe.js            # Card stack drag gestures, physics & filters
│   │   ├── chat.js             # 24h Chat room, icebreakers & Bridge CTA
│   │   ├── homeOs.js           # Constitution, chore rota, staff & UPI settlement
│   │   ├── quiz.js             # 12-Question compatibility quiz modal
│   │   ├── verify.js           # KYC, SSO, Student/Freelancer & Anti-broker flows
│   │   └── app.js              # App coordinator, navigation & toasts
│   ├── index.html              # Main application entry point
│   ├── manifest.json           # PWA web app manifest
│   └── sw.js                   # Service Worker for offline PWA caching
├── stitch_nestmate_ai_prd/     # Original design specs & HTML mocks
├── server.js                   # Node.js HTTP & REST API server
├── package.json
└── README.md
```
