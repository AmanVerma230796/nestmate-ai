// NestMate AI — Swipe Discovery Engine with Touch/Pointer Gestures

class SwipeDeck {
  constructor() {
    this.container = null;
    this.profiles = [];
    this.filteredProfiles = [];
    this.currentIndex = 0;
    this.history = [];
    this.currentCard = null;
    this.startX = 0;
    this.startY = 0;
    this.currentX = 0;
    this.currentY = 0;
    this.isDragging = false;
    
    // Filters
    this.filters = {
      corridor: 'all',
      maxBudget: 35000,
      diet: 'all'
    };
  }

  init(containerEl) {
    this.container = containerEl;
    this.profiles = [...window.api.data.profiles];
    this.applyFilters();
  }

  setFilter(type, value) {
    this.filters[type] = value;
    this.applyFilters();
  }

  applyFilters() {
    this.filteredProfiles = this.profiles.filter(p => {
      if (this.filters.corridor !== 'all' && p.corridor !== this.filters.corridor) {
        return false;
      }
      if (p.rent > this.filters.maxBudget) {
        return false;
      }
      if (this.filters.diet !== 'all') {
        const dietText = (p.synergy.diet?.name || '').toLowerCase();
        if (this.filters.diet === 'veg' && !dietText.includes('veg')) return false;
        if (this.filters.diet === 'non-veg' && !dietText.includes('non-veg')) return false;
      }
      return true;
    });

    this.currentIndex = 0;
    this.renderDeck();
  }

  renderDeck() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const remaining = this.filteredProfiles.slice(this.currentIndex);
    if (remaining.length === 0) {
      this.renderEmptyState();
      return;
    }

    // Render top 3 cards in stack
    const stackLimit = Math.min(remaining.length, 3);
    for (let i = stackLimit - 1; i >= 0; i--) {
      const profile = remaining[i];
      const cardEl = this.createCardElement(profile, i);
      this.container.appendChild(cardEl);
      if (i === 0) {
        this.attachDragEvents(cardEl, profile);
      }
    }
  }

  renderEmptyState() {
    this.container.innerHTML = `
      <div class="h-[520px] rounded-2xl bg-surface-container-lowest border border-[#eae8e2] p-6 flex flex-col items-center justify-center text-center shadow-sm">
        <div class="w-16 h-16 rounded-full bg-secondary-container/50 text-secondary flex items-center justify-center mb-4">
          <span class="material-symbols-outlined text-3xl">deck</span>
        </div>
        <h3 class="font-headline-sm text-lg font-bold text-on-surface mb-1">You've Explored All Listings!</h3>
        <p class="font-body-sm text-xs text-on-surface-variant max-w-[280px] mb-5">
          New verified flats in DLF Phase 3 and Sector 43 drop daily at 9:00 AM.
        </p>
        <div class="flex flex-col gap-2 w-full max-w-[240px]">
          <button onclick="window.swipeDeck.resetFilters()" class="py-2.5 px-4 rounded-xl bg-primary text-white font-label-badge text-xs font-bold shadow-md hover:bg-primary-container transition-all">
            Reset Filters
          </button>
          <button onclick="window.app.openWaitlistModal()" class="py-2.5 px-4 rounded-xl bg-surface-container-low text-secondary font-label-badge text-xs font-semibold hover:bg-surface-container transition-all">
            Join Seeker Corridor Alert
          </button>
        </div>
      </div>
    `;
  }

  resetFilters() {
    this.filters = { corridor: 'all', maxBudget: 35000, diet: 'all' };
    document.querySelectorAll('.filter-chip').forEach(c => {
      if (c.dataset.filter === 'all') {
        c.className = 'filter-chip px-3 py-1.5 rounded-full text-xs font-semibold bg-secondary text-white shadow-sm';
      } else {
        c.className = 'filter-chip px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-container-low text-on-surface-variant hover:bg-surface-container';
      }
    });
    this.applyFilters();
  }

  createCardElement(profile, stackIndex) {
    const card = document.createElement('div');
    card.className = `swipe-card z-${30 - stackIndex * 10}`;
    card.dataset.profileId = profile.id;

    // Photos tab indicator
    const activePhoto = profile.photos?.room || 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80';
    const kitchenPhoto = profile.photos?.kitchen || 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80';
    const balconyPhoto = profile.photos?.balcony || 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80';

    card.innerHTML = `
      <div class="swipe-badge-like">CONNECT & TOUR</div>
      <div class="swipe-badge-pass">PASS</div>

      <!-- Compact Visual Gallery Banner -->
      <div class="relative w-full h-52 bg-surface-container-high overflow-hidden flex gap-1 p-1">
        <!-- Main Room Frame -->
        <div class="relative flex-1 rounded-xl overflow-hidden bg-slate-900 group cursor-pointer" onclick="window.swipeDeck.viewProfile('${profile.id}')">
          <img src="${activePhoto}" alt="${profile.title}" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" id="photo-main-${profile.id}" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20"></div>
          
          <!-- Lease Lead & Verified Pill -->
          <div class="absolute top-2 left-2 flex items-center gap-1">
            ${profile.isLeaseLead ? `
              <span class="px-2 py-0.5 rounded-md bg-secondary text-white font-label-caps text-[10px] font-bold tracking-wider uppercase shadow-sm">
                Lease Lead
              </span>
            ` : ''}
            <span class="px-2 py-0.5 rounded-md bg-tertiary text-white font-label-caps text-[10px] font-bold tracking-wider uppercase flex items-center gap-0.5 shadow-sm">
              <span class="material-symbols-outlined text-[11px]">verified</span> KYC OK
            </span>
          </div>

          <!-- All Inclusive Rent Tag -->
          <div class="absolute bottom-2 left-2 text-white">
            <div class="font-numeric font-bold text-lg leading-tight tracking-tight drop-shadow-md">
              ₹${profile.rent.toLocaleString('en-IN')}<span class="text-xs font-normal opacity-90">/mo · All-Inc</span>
            </div>
          </div>
        </div>

        <!-- Thumbnail Column -->
        <div class="flex flex-col w-20 gap-1 h-full shrink-0">
          <div class="relative flex-1 rounded-lg overflow-hidden cursor-pointer" onclick="window.swipeDeck.switchPhoto('${profile.id}', '${kitchenPhoto}')">
            <img src="${kitchenPhoto}" alt="Kitchen" class="w-full h-full object-cover" />
            <span class="absolute bottom-0.5 right-1 bg-black/70 text-white text-[8px] font-semibold px-1 rounded">Kitchen</span>
          </div>
          <div class="relative flex-1 rounded-lg overflow-hidden cursor-pointer" onclick="window.swipeDeck.switchPhoto('${profile.id}', '${balconyPhoto}')">
            <img src="${balconyPhoto}" alt="Balcony" class="w-full h-full object-cover" />
            <span class="absolute bottom-0.5 right-1 bg-black/70 text-white text-[8px] font-semibold px-1 rounded">Balcony</span>
          </div>
        </div>
      </div>

      <!-- Details Body -->
      <div class="px-3.5 pt-2.5 pb-3 flex flex-col gap-2">
        <!-- Title & Distance Header -->
        <div class="flex items-start justify-between gap-1">
          <div class="min-w-0">
            <div class="flex items-center gap-1.5">
              <h2 class="font-headline-sm text-sm font-bold text-on-surface truncate leading-tight">${profile.title}</h2>
              <span class="material-symbols-outlined text-secondary text-[14px]" title="Attached Washroom">bathtub</span>
            </div>
            <p class="font-body-sm text-[11px] text-on-surface-variant truncate">${profile.sublocation}</p>
          </div>
          <div class="flex items-center gap-0.5 bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full shrink-0">
            <span class="material-symbols-outlined text-[11px]">directions_walk</span>
            <span class="font-label-caps text-[10px] font-semibold">${profile.commute}</span>
          </div>
        </div>

        <!-- Leaseholder Flatmate Strip -->
        <div class="flex items-center justify-between p-2 rounded-xl bg-surface-container-low/80 cursor-pointer" onclick="window.swipeDeck.viewProfile('${profile.id}')">
          <div class="flex items-center gap-2 min-w-0">
            <div class="relative shrink-0">
              <img src="${profile.avatar}" alt="${profile.name}" class="w-8 h-8 rounded-full object-cover ring-1 ring-white" />
              <span class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-tertiary rounded-full flex items-center justify-center text-white text-[8px]">✓</span>
            </div>
            <div class="min-w-0">
              <div class="flex items-center gap-1.5">
                <span class="font-headline-sm text-xs font-bold text-on-surface truncate">${profile.name}, ${profile.age}</span>
                <span class="bg-surface-container-lowest text-tertiary text-[9px] font-label-caps font-bold px-1.5 py-0.2 rounded">${profile.company}</span>
              </div>
              <p class="font-body-sm text-[10px] text-on-surface-variant truncate">${profile.kyc}</p>
            </div>
          </div>
          <span class="material-symbols-outlined text-on-surface-variant text-[16px]">chevron_right</span>
        </div>

        <!-- Lifestyle Synergy Micro Dashboard -->
        <div class="flex flex-col gap-1.5 p-2.5 rounded-xl bg-secondary-container/20 border border-secondary-container/40">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <span class="material-symbols-outlined text-secondary text-[14px]" style="font-variation-settings: 'FILL' 1;">auto_awesome</span>
              <span class="font-label-caps text-[10px] font-bold text-secondary uppercase tracking-wider">Lifestyle Synergy</span>
            </div>
            <span class="font-numeric text-xs font-bold text-primary">${profile.compatibility}% Compatible</span>
          </div>

          <!-- Micro Progress Bars -->
          <div class="grid grid-cols-3 gap-1.5 pt-0.5">
            <div class="flex flex-col gap-0.5">
              <div class="flex justify-between text-[9px] font-label-caps text-on-surface-variant">
                <span class="truncate">${profile.synergy.diet?.name || 'Diet'}</span>
                <span class="font-bold text-tertiary">${profile.synergy.diet?.score || 95}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                <div class="bg-tertiary h-full rounded-full" style="width: ${profile.synergy.diet?.score || 95}%"></div>
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <div class="flex justify-between text-[9px] font-label-caps text-on-surface-variant">
                <span class="truncate">${profile.synergy.sleep?.name || 'Sleep'}</span>
                <span class="font-bold text-secondary">${profile.synergy.sleep?.score || 92}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                <div class="bg-secondary h-full rounded-full" style="width: ${profile.synergy.sleep?.score || 92}%"></div>
              </div>
            </div>

            <div class="flex flex-col gap-0.5">
              <div class="flex justify-between text-[9px] font-label-caps text-on-surface-variant">
                <span class="truncate">${profile.synergy.wfh?.name || 'WFH'}</span>
                <span class="font-bold text-primary">${profile.synergy.wfh?.score || 90}%</span>
              </div>
              <div class="w-full bg-surface-container-high h-1 rounded-full overflow-hidden">
                <div class="bg-primary h-full rounded-full" style="width: ${profile.synergy.wfh?.score || 90}%"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Household Cost Micro Chips -->
        <div class="grid grid-cols-4 gap-1 pt-0.5">
          <div class="bg-surface-container-low px-1.5 py-1 rounded-lg text-center">
            <span class="font-label-caps text-[8px] text-on-surface-variant block uppercase">Cook Split</span>
            <span class="font-numeric text-[11px] font-bold text-on-surface">₹${profile.householdCosts?.cook || 2500}</span>
          </div>
          <div class="bg-surface-container-low px-1.5 py-1 rounded-lg text-center">
            <span class="font-label-caps text-[8px] text-on-surface-variant block uppercase">Maid Split</span>
            <span class="font-numeric text-[11px] font-bold text-on-surface">₹${profile.householdCosts?.maid || 1200}</span>
          </div>
          <div class="bg-surface-container-low px-1.5 py-1 rounded-lg text-center">
            <span class="font-label-caps text-[8px] text-on-surface-variant block uppercase">DG Backup</span>
            <span class="font-numeric text-[11px] font-bold text-on-surface">₹${profile.householdCosts?.dg || 1000}</span>
          </div>
          <div class="bg-surface-container-low px-1.5 py-1 rounded-lg text-center">
            <span class="font-label-caps text-[8px] text-on-surface-variant block uppercase">Wifi Fiber</span>
            <span class="font-numeric text-[11px] font-bold text-on-surface">₹${profile.householdCosts?.wifi || 400}</span>
          </div>
        </div>
      </div>
    `;

    return card;
  }

  switchPhoto(profileId, photoUrl) {
    const mainImg = document.getElementById(`photo-main-${profileId}`);
    if (mainImg) {
      mainImg.src = photoUrl;
    }
  }

  viewProfile(profileId) {
    const profile = this.profiles.find(p => p.id === profileId);
    if (!profile) return;
    window.app.openProfileModal(profile);
  }

  attachDragEvents(cardEl, profile) {
    this.currentCard = cardEl;

    const onPointerDown = (e) => {
      // Don't drag if clicking buttons or specific clickable regions
      if (e.target.closest('button') || e.target.closest('a')) return;
      this.isDragging = true;
      this.startX = e.clientX || (e.touches && e.touches[0].clientX);
      this.startY = e.clientY || (e.touches && e.touches[0].clientY);
      this.currentCard.classList.add('dragging');
      this.currentCard.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e) => {
      if (!this.isDragging) return;
      const clientX = e.clientX || (e.touches && e.touches[0].clientX);
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      this.currentX = clientX - this.startX;
      this.currentY = clientY - this.startY;

      const rotate = this.currentX * 0.08;
      this.currentCard.style.transform = `translate(${this.currentX}px, ${this.currentY}px) rotate(${rotate}deg)`;

      // Decision Badges Opacity
      const likeBadge = this.currentCard.querySelector('.swipe-badge-like');
      const passBadge = this.currentCard.querySelector('.swipe-badge-pass');

      if (this.currentX > 30) {
        if (likeBadge) likeBadge.style.opacity = Math.min(1, (this.currentX - 30) / 70);
        if (passBadge) passBadge.style.opacity = 0;
      } else if (this.currentX < -30) {
        if (passBadge) passBadge.style.opacity = Math.min(1, (-this.currentX - 30) / 70);
        if (likeBadge) likeBadge.style.opacity = 0;
      } else {
        if (likeBadge) likeBadge.style.opacity = 0;
        if (passBadge) passBadge.style.opacity = 0;
      }
    };

    const onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      this.currentCard.classList.remove('dragging');

      const threshold = 85;
      if (this.currentX > threshold) {
        this.triggerSwipe('like');
      } else if (this.currentX < -threshold) {
        this.triggerSwipe('pass');
      } else {
        // Return to center
        this.currentCard.style.transform = '';
        const likeBadge = this.currentCard.querySelector('.swipe-badge-like');
        const passBadge = this.currentCard.querySelector('.swipe-badge-pass');
        if (likeBadge) likeBadge.style.opacity = 0;
        if (passBadge) passBadge.style.opacity = 0;
      }

      this.currentX = 0;
      this.currentY = 0;
    };

    cardEl.addEventListener('pointerdown', onPointerDown);
    cardEl.addEventListener('pointermove', onPointerMove);
    cardEl.addEventListener('pointerup', onPointerUp);
    cardEl.addEventListener('pointercancel', onPointerUp);
  }

  async triggerSwipe(action) {
    const profile = this.filteredProfiles[this.currentIndex];
    if (!profile) return;

    const card = this.container.querySelector(`.swipe-card[data-profile-id="${profile.id}"]`);
    if (card) {
      if (action === 'like') {
        card.classList.add('swipe-right');
      } else if (action === 'pass') {
        card.classList.add('swipe-left');
      } else if (action === 'save') {
        card.classList.add('swipe-up');
      }
    }

    this.history.push({ profile, action });
    this.currentIndex++;

    // API record
    await window.api.swipe(profile.id, action);

    if (action === 'like') {
      window.app.showToast(`✨ Mutual Match with ${profile.name}! Added to 24h Chat Room.`, 'tertiary');
      window.app.updateNavBadges();
    } else if (action === 'pass') {
      window.app.showToast(`Passed on ${profile.name}`);
    } else if (action === 'save') {
      window.app.showToast(`Saved ${profile.title} to Bookmarks!`, 'secondary');
    }

    setTimeout(() => {
      this.renderDeck();
    }, 240);
  }

  undo() {
    if (this.history.length === 0 || this.currentIndex === 0) {
      window.app.showToast('No swipes to undo');
      return;
    }
    const last = this.history.pop();
    this.currentIndex--;
    window.app.showToast(`Restored ${last.profile.name}`);
    this.renderDeck();
  }
}

window.swipeDeck = new SwipeDeck();
