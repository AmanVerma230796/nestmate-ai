// NestMate AI — Main App Controller & Shell Navigation (PRD §13 Adaptive Shell)

class App {
  constructor() {
    this.currentTab = 'discover';
    this.lifecycleState = 'looking'; // 'looking' or 'coliving'
  }

  async init() {
    try {
      await window.api.loadState();
      
      // Initialize sub-modules
      window.swipeDeck.init(document.getElementById('swipe-card-stack'));
      window.chatManager.init();
      window.homeOsManager.init();
      window.quizManager.init();
      window.verifyManager.init();

      this.setupNavigation();
      this.setupLifecycleToggle();
      this.renderVerifyTab();
      this.updateNavBadges();

      console.log('NestMate AI initialized successfully.');
    } catch (err) {
      console.error('App init failed:', err);
      this.showToast('Failed to load application data', 'error');
    }
  }

  setupNavigation() {
    document.querySelectorAll('nav a[data-path]').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = link.getAttribute('data-path');
        this.switchTab(tab);
      });
    });
  }

  setupLifecycleToggle() {
    const tabLooking = document.getElementById('hub-toggle-looking');
    const tabCoLiving = document.getElementById('hub-toggle-coliving');

    if (tabLooking && tabCoLiving) {
      tabLooking.addEventListener('click', () => {
        this.setLifecycleState('looking');
      });
      tabCoLiving.addEventListener('click', () => {
        this.setLifecycleState('coliving');
      });
    }
  }

  setLifecycleState(state) {
    this.lifecycleState = state;
    const tabLooking = document.getElementById('hub-toggle-looking');
    const tabCoLiving = document.getElementById('hub-toggle-coliving');

    if (state === 'looking') {
      if (tabLooking) tabLooking.className = 'px-3 py-1.5 rounded-lg bg-surface-container-lowest text-primary font-label-badge text-xs font-bold shadow-sm transition-all';
      if (tabCoLiving) tabCoLiving.className = 'px-3 py-1.5 rounded-lg text-on-surface-variant font-label-badge text-xs transition-all';
      this.switchTab('discover');
    } else {
      if (tabCoLiving) tabCoLiving.className = 'px-3 py-1.5 rounded-lg bg-surface-container-lowest text-secondary font-label-badge text-xs font-bold shadow-sm transition-all';
      if (tabLooking) tabLooking.className = 'px-3 py-1.5 rounded-lg text-on-surface-variant font-label-badge text-xs transition-all';
      this.switchTab('home-os');
    }
  }

  switchTab(tabId) {
    this.currentTab = tabId;

    // Hide all tab panes
    document.querySelectorAll('.tab-pane').forEach(pane => {
      pane.classList.add('hidden');
    });

    // Show target tab pane
    const targetPane = document.getElementById(`tab-content-${tabId}`);
    if (targetPane) {
      targetPane.classList.remove('hidden');
    }

    // Update bottom nav active classes
    document.querySelectorAll('nav a[data-path]').forEach(link => {
      const isTarget = link.getAttribute('data-path') === tabId;
      if (isTarget) {
        link.className = 'relative flex flex-col items-center justify-center min-w-[72px] h-12 gap-0.5 text-secondary font-bold scale-[1.03] transition-all';
      } else {
        link.className = 'relative flex flex-col items-center justify-center min-w-[72px] h-12 gap-0.5 text-on-surface-variant hover:text-on-surface transition-all';
      }
    });

    // Refresh context if needed
    if (tabId === 'matches-and-chat') {
      window.chatManager.renderMatchList();
    } else if (tabId === 'home-os') {
      window.homeOsManager.renderHomeOs();
    } else if (tabId === 'profile-verify') {
      this.renderVerifyTab();
    }

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  updateNavBadges() {
    const unreadMatches = (window.api.data.matches || []).filter(m => m.unreadCount > 0).length;
    const badgeEl = document.getElementById('nav-matches-badge');
    if (badgeEl) {
      if (unreadMatches > 0) {
        badgeEl.textContent = `${unreadMatches} new`;
        badgeEl.classList.remove('hidden');
      } else {
        badgeEl.textContent = '24h';
      }
    }
  }

  renderVerifyTab() {
    const container = document.getElementById('verify-tab-content');
    if (!container) return;

    const user = window.api.data.user;

    container.innerHTML = `
      <div class="flex flex-col gap-4 pb-12">
        <!-- Identity Profile Card -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="relative">
              <img src="${user.avatar}" alt="${user.name}" class="w-14 h-14 rounded-full object-cover ring-2 ring-primary/20" />
              <div class="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-tertiary flex items-center justify-center text-white ring-2 ring-white">
                <span class="material-symbols-outlined text-[12px] font-bold">verified</span>
              </div>
            </div>
            <div>
              <div class="flex items-center gap-1.5">
                <h2 class="font-headline-sm text-base font-bold text-on-surface">${user.name}, ${user.age}</h2>
              </div>
              <p class="font-body-sm text-xs text-on-surface-variant">${user.role}</p>
              <div class="flex items-center gap-1 mt-1 text-tertiary">
                <span class="material-symbols-outlined text-[13px]">shield</span>
                <span class="font-label-caps text-[10px] font-bold">Trust & Safety Level ${user.verificationLevel} Cleared</span>
              </div>
            </div>
          </div>
          <button onclick="window.quizManager.openQuizModal()" class="w-9 h-9 rounded-xl bg-surface-container-low text-secondary flex items-center justify-center shadow-xs hover:bg-surface-container transition-all" title="Edit Profile & Quiz">
            <span class="material-symbols-outlined text-[18px]">tune</span>
          </button>
        </div>

        <!-- Living Rhythm Chips -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between px-1">
            <span class="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Living Rhythm & Habits</span>
            <button onclick="window.quizManager.openQuizModal()" class="font-label-badge text-xs text-primary font-bold">Edit</button>
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[18px]">restaurant</span>
              </div>
              <div class="min-w-0">
                <span class="font-label-caps text-[9px] text-on-surface-variant block">Food Harmony</span>
                <span class="font-body-sm text-xs font-semibold text-on-surface truncate block">${user.habits.diet}</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[18px]">bedtime</span>
              </div>
              <div class="min-w-0">
                <span class="font-label-caps text-[9px] text-on-surface-variant block">Lights Out</span>
                <span class="font-body-sm text-xs font-semibold text-on-surface truncate block">${user.habits.sleep}</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[18px]">deck</span>
              </div>
              <div class="min-w-0">
                <span class="font-label-caps text-[9px] text-on-surface-variant block">Smoker Code</span>
                <span class="font-body-sm text-xs font-semibold text-on-surface truncate block">${user.habits.smoking}</span>
              </div>
            </div>

            <div class="p-3 rounded-xl bg-surface-container-lowest border border-[#eae8e2] shadow-xs flex items-center gap-2.5">
              <div class="w-8 h-8 rounded-full bg-secondary-fixed/50 text-secondary flex items-center justify-center shrink-0">
                <span class="material-symbols-outlined text-[18px]">laptop_mac</span>
              </div>
              <div class="min-w-0">
                <span class="font-label-caps text-[9px] text-on-surface-variant block">Work Routine</span>
                <span class="font-body-sm text-xs font-semibold text-on-surface truncate block">${user.habits.work}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Target Search Summary Card -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <div class="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                <span class="material-symbols-outlined text-[18px]">travel_explore</span>
              </div>
              <h3 class="font-headline-sm text-xs font-bold text-on-surface">Target Search</h3>
            </div>
            <span class="px-2 py-0.5 rounded-full bg-primary-fixed text-primary font-label-badge text-[10px] font-bold">Move-in ${user.searchPreferences.moveInDate}</span>
          </div>

          <div class="p-2.5 rounded-xl bg-surface-container-low flex flex-col gap-0.5">
            <span class="font-label-caps text-[9px] text-on-surface-variant font-bold uppercase">Priority Corridor</span>
            <span class="font-body-md text-xs font-bold text-on-surface">DLF Phase 3 & Sector 43, Gurugram</span>
            <span class="font-body-sm text-[10px] text-secondary">Within 15 mins of Cybercity Rapid Metro</span>
          </div>

          <div class="grid grid-cols-2 gap-2">
            <div class="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
              <span class="font-label-caps text-[9px] text-on-surface-variant">Budget Bracket</span>
              <span class="font-numeric text-sm font-bold text-primary">₹${user.searchPreferences.budgetMin / 1000}k - ₹${user.searchPreferences.budgetMax / 1000}k</span>
              <span class="font-body-sm text-[9px] text-on-surface-variant">All-inclusive maintenance</span>
            </div>
            <div class="p-2.5 rounded-xl bg-surface-container-low flex flex-col">
              <span class="font-label-caps text-[9px] text-on-surface-variant">Room Layout</span>
              <span class="font-headline-sm text-xs font-bold text-on-surface mt-0.5">${user.searchPreferences.roomType}</span>
              <span class="font-body-sm text-[9px] text-on-surface-variant">Attached bath required</span>
            </div>
          </div>
        </div>

        <!-- Compatibility Matrix & Quiz Health -->
        <div class="p-4 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex flex-col gap-3">
          <div class="flex items-center justify-between">
            <div class="flex flex-col">
              <div class="flex items-center gap-1.5">
                <span class="material-symbols-outlined text-secondary text-[20px]">psychology</span>
                <h3 class="font-headline-sm text-xs font-bold text-on-surface">Compatibility Matrix</h3>
              </div>
              <p class="font-body-sm text-[11px] text-on-surface-variant mt-0.5">12 of 12 questions calibrated</p>
            </div>
            <span class="px-2.5 py-1 rounded-full bg-tertiary-container/20 text-tertiary font-label-caps text-[10px] font-bold">
              100% Complete
            </span>
          </div>

          <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden flex">
            <div class="bg-secondary h-full w-[45%]"></div>
            <div class="bg-primary h-full w-[35%]"></div>
            <div class="bg-tertiary h-full w-[20%]"></div>
          </div>

          <button onclick="window.quizManager.openQuizModal()" class="w-full py-2.5 px-4 rounded-xl bg-surface-container-low text-secondary font-headline-sm text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-surface-container transition-all">
            <span class="material-symbols-outlined text-[16px]">refresh</span>
            <span>Retake Lifestyle Quiz</span>
          </button>
        </div>

        <!-- Verification Center (F-02) -->
        <div class="flex flex-col gap-2">
          <div class="flex items-center justify-between px-1">
            <span class="font-label-caps text-[10px] text-on-surface-variant font-bold uppercase tracking-wider">Verification Center</span>
            <span class="font-label-badge text-xs text-tertiary font-bold flex items-center gap-0.5">
              <span class="material-symbols-outlined text-[13px]">verified</span> Level 3 Active
            </span>
          </div>

          <div class="p-2 rounded-2xl bg-surface-container-lowest border border-[#eae8e2] shadow-sm flex flex-col gap-1">
            <!-- Deloitte Enterprise SSO -->
            <div class="p-2.5 rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[18px]">badge</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-headline-sm text-xs font-bold text-on-surface">Deloitte Enterprise SSO</span>
                    <span class="px-1.5 py-0.2 bg-tertiary/10 text-tertiary font-label-caps text-[8px] rounded font-bold">ACTIVE</span>
                  </div>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">${user.email}</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
            </div>

            <!-- Aadhaar KYC -->
            <div class="p-2.5 rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-tertiary-fixed/40 text-tertiary flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[18px]">fingerprint</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-headline-sm text-xs font-bold text-on-surface">DigiLocker Govt ID</span>
                    <span class="px-1.5 py-0.2 bg-tertiary/10 text-tertiary font-label-caps text-[8px] rounded font-bold">VERIFIED</span>
                  </div>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">Aadhaar · UIDAI Authenticated</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-tertiary text-[18px]">check_circle</span>
            </div>

            <!-- Student / Freelancer Path (PRD §10 Test #3) -->
            <div class="p-2.5 rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer" onclick="window.verifyManager.openStudentVerifyModal()">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-primary-fixed/40 text-primary flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[18px]">school</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-headline-sm text-xs font-bold text-on-surface">Student / Freelancer Verification</span>
                  </div>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">GST, Portfolio or College ID path</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-secondary text-[16px]">chevron_right</span>
            </div>

            <!-- Phone Privacy Shield -->
            <div class="p-2.5 rounded-xl flex items-center justify-between hover:bg-surface-container-low transition-colors cursor-pointer" onclick="window.verifyManager.togglePhonePrivacy()">
              <div class="flex items-center gap-2.5">
                <div class="w-9 h-9 rounded-full bg-secondary-fixed/40 text-secondary flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-[18px]">phone_iphone</span>
                </div>
                <div>
                  <div class="flex items-center gap-1.5">
                    <span class="font-headline-sm text-xs font-bold text-on-surface">Phone Privacy Shield</span>
                    <span class="px-1.5 py-0.2 bg-secondary/10 text-secondary font-label-caps text-[8px] rounded font-bold">MASKED</span>
                  </div>
                  <span class="font-body-sm text-[10px] text-on-surface-variant">+91 ••••• ••456 (Revealed on mutual match)</span>
                </div>
              </div>
              <span class="material-symbols-outlined text-tertiary text-[18px]">shield</span>
            </div>
          </div>

          <!-- Trust & Anti-Broker Guardrails -->
          <div class="p-3 rounded-xl bg-error-container/20 border border-error/20 flex items-center justify-between gap-3 mt-1">
            <div class="flex items-center gap-2">
              <span class="material-symbols-outlined text-error text-[18px]">gavel</span>
              <span class="font-body-sm text-xs text-on-surface">Strict 3-strike anti-broker policy</span>
            </div>
            <button onclick="window.verifyManager.openBrokerReportModal()" class="px-2.5 py-1 rounded-lg bg-error text-white font-label-caps text-[10px] font-bold">
              Report Broker
            </button>
          </div>
        </div>
      </div>
    `;
  }

  openProfileModal(profile) {
    const modal = document.getElementById('profile-details-modal');
    if (!modal) return;

    document.getElementById('profile-modal-photo').src = profile.photos?.room || profile.avatar;
    document.getElementById('profile-modal-title').textContent = profile.title;
    document.getElementById('profile-modal-rent').textContent = `₹${profile.rent.toLocaleString('en-IN')}/mo`;
    document.getElementById('profile-modal-deposit').textContent = `₹${profile.deposit ? profile.deposit.toLocaleString('en-IN') : (profile.rent * 2).toLocaleString('en-IN')} (2 mo)`;
    document.getElementById('profile-modal-sublocation').textContent = `${profile.sublocation} · ${profile.commute}`;
    document.getElementById('profile-modal-name').textContent = `${profile.name}, ${profile.age}`;
    document.getElementById('profile-modal-role').textContent = profile.role;
    document.getElementById('profile-modal-bio').textContent = profile.bio;
    document.getElementById('profile-modal-compat').textContent = `${profile.compatibility}%`;

    // Amenities
    const amenitiesEl = document.getElementById('profile-modal-amenities');
    if (amenitiesEl) {
      amenitiesEl.innerHTML = (profile.amenities || []).map(a => `
        <span class="px-2.5 py-1 rounded-lg bg-surface-container-low text-on-surface text-xs font-medium">✓ ${a}</span>
      `).join('');
    }

    modal.classList.add('active');
  }

  closeProfileModal() {
    const modal = document.getElementById('profile-details-modal');
    if (modal) modal.classList.remove('active');
  }

  openWaitlistModal() {
    const modal = document.getElementById('waitlist-modal');
    if (modal) modal.classList.add('active');
  }

  closeWaitlistModal() {
    const modal = document.getElementById('waitlist-modal');
    if (modal) modal.classList.remove('active');
  }

  submitWaitlist() {
    this.closeWaitlistModal();
    this.showToast("🔔 Joined Gurugram Seeker Priority Alert queue!", "tertiary");
  }

  toggleDesktopWideMode() {
    document.body.classList.toggle('desktop-wide-mode');
    const isWide = document.body.classList.contains('desktop-wide-mode');
    this.showToast(isWide ? 'Switched to Wide View' : 'Locked to Phone Canvas Frame', 'secondary');
  }

  showToast(message, type = 'default') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';

    let icon = 'info';
    if (type === 'tertiary') {
      toast.style.backgroundColor = '#006b2c';
      icon = 'check_circle';
    } else if (type === 'secondary') {
      toast.style.backgroundColor = '#1d4e5b';
      icon = 'verified';
    } else if (type === 'error') {
      toast.style.backgroundColor = '#ba1a1a';
      icon = 'warning';
    }

    toast.innerHTML = `
      <span class="material-symbols-outlined text-[16px]">${icon}</span>
      <span>${message}</span>
    `;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.25s ease';
      setTimeout(() => toast.remove(), 250);
    }, 2800);
  }
}

window.app = new App();
window.addEventListener('DOMContentLoaded', () => {
  window.app.init();
});
