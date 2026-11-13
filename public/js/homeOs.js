// NestMate AI — Home OS Household Manager (F-07, F-08, F-09)

class HomeOsManager {
  constructor() {
    this.activeSection = 'overview'; // 'overview', 'constitution', 'chores', 'expenses'
  }

  init() {
    this.renderHomeOs();
  }

  renderHomeOs() {
    const container = document.getElementById('home-os-tab-content');
    if (!container) return;

    const homeOs = window.api.data.homeOs;
    if (!homeOs) return;

    const { flat, constitution, chores, staff, expenses } = homeOs;

    container.innerHTML = `
      <div class="flex flex-col gap-4 pb-12">
        <!-- Flat Identity Header -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex items-center justify-between">
          <div>
            <div class="flex items-center gap-1.5 text-secondary">
              <span class="material-symbols-outlined text-[18px]">apartment</span>
              <span class="font-label-caps text-[10px] font-bold uppercase tracking-wider">${flat.address || 'DLF Phase 3, Gurugram'}</span>
            </div>
            <h2 class="font-headline-sm text-base font-bold text-on-surface mt-0.5">${flat.name}</h2>
          </div>
          <!-- Resident Avatar Stack -->
          <div class="flex items-center -space-x-2">
            ${flat.members.map(m => `
              <img src="${m.avatar}" alt="${m.name}" title="${m.name} (${m.role})" class="w-9 h-9 rounded-full object-cover ring-2 ring-white" />
            `).join('')}
          </div>
        </div>

        <!-- Co-Living Multi-Metric Bento -->
        <div class="grid grid-cols-2 gap-3">
          <!-- Expense Card -->
          <div class="p-3.5 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex flex-col justify-between cursor-pointer hover:border-secondary transition-all" onclick="window.homeOsManager.openUpiModal()">
            <div class="flex items-center justify-between text-secondary">
              <span class="material-symbols-outlined text-[20px]">receipt_long</span>
              <span class="px-1.5 py-0.5 rounded-full bg-tertiary-container/20 text-tertiary font-label-caps text-[9px] font-bold">UPI Auto</span>
            </div>
            <div class="my-2">
              <span class="font-numeric text-xl font-black text-tertiary tracking-tight">+₹${expenses.netReceivable.toLocaleString('en-IN')}</span>
              <p class="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">Net receivable from Kabir</p>
            </div>
            <div class="pt-2 border-t border-surface-container-high/60 flex items-center justify-between">
              <span class="font-label-caps text-[10px] text-primary font-bold">Pay via UPI</span>
              <span class="material-symbols-outlined text-[14px] text-primary">arrow_forward</span>
            </div>
          </div>

          <!-- Chore Rota Card -->
          <div class="p-3.5 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex flex-col justify-between">
            <div class="flex items-center justify-between text-primary">
              <span class="material-symbols-outlined text-[20px]">water_drop</span>
              <span class="px-1.5 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-caps text-[9px] font-bold">Today</span>
            </div>
            <div class="my-2">
              <span class="font-headline-sm text-sm font-bold text-on-surface">Bisleri 20L Can</span>
              <p class="font-body-sm text-[11px] text-on-surface-variant leading-tight mt-0.5">Kabir's turn to receive & pay</p>
            </div>
            <div class="pt-2 border-t border-surface-container-high/60 flex items-center justify-between text-on-surface-variant">
              <span class="font-label-caps text-[10px]">Slot: 4 - 6 PM</span>
              <span class="material-symbols-outlined text-[14px] text-tertiary">schedule</span>
            </div>
          </div>
        </div>

        <!-- Living Constitution Banner -->
        <div class="p-3.5 rounded-2xl bg-surface-container-low border border-[#eae8e2] flex items-center justify-between gap-3">
          <div class="flex items-center gap-2.5">
            <div class="w-10 h-10 rounded-xl bg-tertiary/10 text-tertiary flex items-center justify-center shrink-0">
              <span class="material-symbols-outlined text-[22px]">gavel</span>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <span class="font-headline-sm text-xs font-bold text-on-surface">House Constitution</span>
                <span class="px-1.5 py-0.2 rounded bg-tertiary/15 text-tertiary font-label-caps text-[9px] font-bold">100% Peace</span>
              </div>
              <p class="font-body-sm text-[11px] text-on-surface-variant mt-0.5">6 of 6 living rules approved by both flatmates</p>
            </div>
          </div>
          <button onclick="window.homeOsManager.openAddRuleModal()" class="px-2.5 py-1.5 rounded-xl bg-surface-container-lowest text-secondary font-label-badge text-xs font-semibold shadow-xs hover:bg-surface-container transition-all">
            + Rule
          </button>
        </div>

        <!-- Section 1: House Constitution Detailed Rules -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-secondary text-[18px]">verified</span>
              <h3 class="font-headline-sm text-sm font-bold text-on-surface">Agreed House Constitution</h3>
            </div>
            <span class="font-label-caps text-[10px] text-on-surface-variant uppercase font-semibold">Approval-Gated (F-07)</span>
          </div>

          <div class="flex flex-col gap-2" id="constitution-rules-list">
            ${constitution.map(r => `
              <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex flex-col gap-1.5 transition-all">
                <div class="flex items-start justify-between gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="material-symbols-outlined text-[16px] ${r.status === 'approved' ? 'text-tertiary' : 'text-amber-600'}">
                      ${r.status === 'approved' ? 'check_circle' : 'pending'}
                    </span>
                    <h4 class="font-headline-sm text-xs font-bold text-on-surface">${r.title}</h4>
                  </div>
                  <span class="px-2 py-0.2 rounded-full bg-surface-container-low text-on-surface-variant font-label-caps text-[9px]">
                    ${r.category}
                  </span>
                </div>
                <p class="font-body-sm text-[11px] text-on-surface-variant leading-relaxed pl-5">${r.desc}</p>
                
                <div class="flex items-center justify-between pt-1.5 pl-5 border-t border-surface-container-high/40 text-[10px]">
                  <div class="flex items-center gap-1 text-on-surface-variant">
                    <span class="material-symbols-outlined text-[12px] text-tertiary">draw</span>
                    <span>Signed by: ${r.approvedBy.join(', ')}</span>
                  </div>
                  <button onclick="window.homeOsManager.toggleRuleApproval('${r.id}')" class="text-secondary font-semibold hover:underline">
                    ${r.approvedBy.includes(window.api.data.user.name) ? 'Signed ✓' : 'Sign & Approve'}
                  </button>
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <!-- Section 2: Chores & Domestic Staff Rotation (F-08) -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-primary text-[18px]">rotate_right</span>
              <h3 class="font-headline-sm text-sm font-bold text-on-surface">Chore & Staff Rota</h3>
            </div>
            <span class="font-label-caps text-[10px] text-secondary font-bold">Auto-Rotates</span>
          </div>

          <!-- Chores List -->
          <div class="grid grid-cols-1 gap-2">
            ${chores.map(ch => {
              const isDone = ch.status === 'completed';
              return `
                <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex items-center justify-between gap-3">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <button onclick="window.homeOsManager.toggleChore('${ch.id}')" class="w-6 h-6 rounded-lg ${isDone ? 'bg-tertiary text-white' : 'border border-surface-container-high bg-white'} flex items-center justify-center shrink-0 transition-colors">
                      ${isDone ? '<span class="material-symbols-outlined text-[16px]">check</span>' : ''}
                    </button>
                    <div class="min-w-0">
                      <h4 class="font-headline-sm text-xs font-bold text-on-surface ${isDone ? 'line-through text-on-surface-variant/70' : ''}">${ch.task}</h4>
                      <p class="font-body-sm text-[10px] text-on-surface-variant truncate">${ch.desc} · <span class="font-semibold text-secondary">${ch.assignee}</span></p>
                    </div>
                  </div>
                  <span class="px-2 py-0.5 rounded-full ${isDone ? 'bg-tertiary/10 text-tertiary' : 'bg-primary-fixed/50 text-on-primary-fixed-variant'} font-label-caps text-[9px] shrink-0">
                    ${ch.due}
                  </span>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Domestic Staff Roster -->
          <div class="p-3.5 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex flex-col gap-2.5 mt-1">
            <span class="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Household Staff Contacts (Gurugram)</span>
            <div class="flex flex-col gap-2">
              ${staff.map(s => `
                <div class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/70">
                  <div class="flex items-center gap-2.5 min-w-0">
                    <img src="${s.avatar}" alt="${s.name}" class="w-8 h-8 rounded-full object-cover" />
                    <div class="min-w-0">
                      <span class="font-headline-sm text-xs font-bold text-on-surface block truncate">${s.name} (${s.role})</span>
                      <span class="font-body-sm text-[10px] text-tertiary font-semibold">${s.status}</span>
                    </div>
                  </div>
                  <div class="flex items-center gap-1.5 shrink-0">
                    <a href="tel:${s.phone}" class="w-7 h-7 rounded-lg bg-surface-container-lowest text-secondary flex items-center justify-center shadow-xs" title="Call">
                      <span class="material-symbols-outlined text-[15px]">call</span>
                    </a>
                    <a href="https://wa.me/${s.phone.replace(/[^0-9]/g, '')}" target="_blank" class="w-7 h-7 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center shadow-xs" title="WhatsApp">
                      <span class="material-symbols-outlined text-[15px]">chat</span>
                    </a>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- Section 3: Expense Split Ledger (F-09) -->
        <div class="flex flex-col gap-2.5">
          <div class="flex items-center justify-between px-1">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-secondary text-[18px]">account_balance_wallet</span>
              <h3 class="font-headline-sm text-sm font-bold text-on-surface">Household Ledger & Splits</h3>
            </div>
            <button onclick="window.homeOsManager.openAddExpenseModal()" class="font-label-badge text-xs font-bold text-primary flex items-center gap-0.5">
              <span>+ Add Split</span>
            </button>
          </div>

          <div class="flex flex-col gap-2">
            ${expenses.items.map(e => `
              <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex items-center justify-between gap-3">
                <div class="flex flex-col min-w-0">
                  <span class="font-headline-sm text-xs font-bold text-on-surface truncate">${e.title}</span>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">${e.date} · Paid by ${e.paidBy} (${e.splitType})</span>
                </div>
                <div class="text-right shrink-0">
                  <span class="font-numeric text-xs font-bold text-on-surface block">₹${e.amount.toLocaleString('en-IN')}</span>
                  <span class="font-label-caps text-[9px] ${e.status === 'Settled' ? 'text-tertiary' : 'text-amber-600'} font-bold">${e.status}</span>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="flex items-center justify-between p-3 rounded-xl bg-secondary-container/20 border border-secondary-container/40">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-secondary text-[18px]">notifications_active</span>
              <span class="font-body-sm text-xs text-on-surface">Neutral scheduled rent & staff alert</span>
            </div>
            <button onclick="window.homeOsManager.sendNeutralReminder()" class="px-2.5 py-1 rounded-lg bg-secondary text-white font-label-caps text-[10px] font-bold">
              Send Alert
            </button>
          </div>
        </div>
      </div>
    `;
  }

  async toggleRuleApproval(ruleId) {
    await window.api.toggleConstitutionRule(ruleId);
    this.renderHomeOs();
    window.app.showToast("Rule signed & constitution updated!", "tertiary");
  }

  openAddRuleModal() {
    const modal = document.getElementById('add-rule-modal');
    if (modal) modal.classList.add('active');
  }

  closeAddRuleModal() {
    const modal = document.getElementById('add-rule-modal');
    if (modal) modal.classList.remove('active');
  }

  async submitNewRule() {
    const titleInput = document.getElementById('new-rule-title');
    const descInput = document.getElementById('new-rule-desc');
    const categorySelect = document.getElementById('new-rule-category');

    if (!titleInput || !descInput) return;

    const title = titleInput.value.trim();
    const desc = descInput.value.trim();
    const category = categorySelect ? categorySelect.value : 'General';

    if (!title || !desc) {
      window.app.showToast("Please provide both rule title and clause details");
      return;
    }

    await window.api.addConstitutionRule({ title, desc, category });
    titleInput.value = '';
    descInput.value = '';
    this.closeAddRuleModal();
    this.renderHomeOs();
    window.app.showToast("New house rule added to Constitution!", "tertiary");
  }

  async toggleChore(choreId) {
    await window.api.toggleChore(choreId);
    this.renderHomeOs();
    window.app.showToast("Chore status updated!", "secondary");
  }

  openAddExpenseModal() {
    const modal = document.getElementById('add-expense-modal');
    if (modal) modal.classList.add('active');
  }

  closeAddExpenseModal() {
    const modal = document.getElementById('add-expense-modal');
    if (modal) modal.classList.remove('active');
  }

  async submitNewExpense() {
    const title = document.getElementById('expense-title')?.value.trim();
    const amount = document.getElementById('expense-amount')?.value.trim();
    const category = document.getElementById('expense-category')?.value;
    const splitType = document.getElementById('expense-split-type')?.value;

    if (!title || !amount) {
      window.app.showToast("Please enter an expense title and amount");
      return;
    }

    await window.api.addExpense({ title, amount, category, splitType });
    this.closeAddExpenseModal();
    this.renderHomeOs();
    window.app.showToast("Expense split recorded in ledger!", "tertiary");
  }

  openUpiModal() {
    const modal = document.getElementById('upi-payment-modal');
    if (modal) {
      const expenses = window.api.data.homeOs.expenses;
      document.getElementById('upi-amount-display').textContent = `₹${expenses.netReceivable.toLocaleString('en-IN')}`;
      document.getElementById('upi-id-display').textContent = expenses.upiId;
      modal.classList.add('active');
    }
  }

  closeUpiModal() {
    const modal = document.getElementById('upi-payment-modal');
    if (modal) modal.classList.remove('active');
  }

  launchUpiDeepLink() {
    const expenses = window.api.data.homeOs.expenses;
    const upiLink = `upi://pay?pa=${expenses.upiId}&pn=Kabir%20Mehta&am=${expenses.netReceivable}&cu=INR&tn=NestMate%20Flat%20Split`;
    
    // Copy link & trigger
    navigator.clipboard?.writeText(upiLink);
    window.app.showToast("UPI Deep Link opened! Copied to clipboard.", "tertiary");
    
    // Try opening URL scheme
    window.location.href = upiLink;
  }

  sendNeutralReminder() {
    window.app.showToast("Scheduled neutral reminder sent to flatmates: 'Rent & cook split due Friday'", "secondary");
  }
}

window.homeOsManager = new HomeOsManager();
