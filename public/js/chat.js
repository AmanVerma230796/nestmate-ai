// NestMate AI — Match Pipeline, Interactive Chat & The Bridge CTA (F-05 & F-06)

class ChatManager {
  constructor() {
    this.activeProfileId = null;
    this.chatModal = null;
    this.messageList = null;
    this.input = null;
  }

  init() {
    this.chatModal = document.getElementById('chat-modal');
    this.messageList = document.getElementById('chat-messages-container');
    this.input = document.getElementById('chat-input-field');

    // Handle Enter key for sending messages
    if (this.input) {
      this.input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          this.sendMessage();
        }
      });
    }
  }

  renderMatchList() {
    const listEl = document.getElementById('matches-pipeline-list');
    if (!listEl) return;

    const matches = window.api.data.matches || [];
    if (matches.length === 0) {
      listEl.innerHTML = `
        <div class="p-6 rounded-xl bg-surface-container-lowest text-center">
          <p class="font-body-sm text-xs text-on-surface-variant">No mutual matches yet. Keep swiping in Discover!</p>
        </div>
      `;
      return;
    }

    listEl.innerHTML = matches.map(m => {
      const isExpiringSoon = m.hoursLeft <= 4;
      const urgencyBadgeClass = isExpiringSoon 
        ? 'bg-error-container text-on-error-container font-bold pulse-urgent' 
        : 'bg-primary-fixed/50 text-on-primary-fixed-variant';

      return `
        <div class="p-3.5 rounded-xl bg-surface-container-lowest shadow-sm flex items-center justify-between gap-3 relative overflow-hidden transition-all active:scale-[0.99] border border-[#eae8e2]">
          <div class="relative w-13 h-13 rounded-full flex-shrink-0 overflow-hidden bg-surface-container cursor-pointer" onclick="window.chatManager.openChat('${m.profileId}')">
            <img src="${m.avatar}" alt="${m.name}" class="w-13 h-13 rounded-full object-cover" />
            <span class="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-tertiary flex items-center justify-center text-white text-[9px] shadow-sm">✓</span>
          </div>
          
          <div class="flex flex-col flex-1 min-w-0 cursor-pointer" onclick="window.chatManager.openChat('${m.profileId}')">
            <div class="flex items-center gap-2">
              <span class="font-headline-sm text-sm font-bold text-on-surface truncate">${m.name}</span>
              <span class="px-1.5 py-0.5 rounded bg-tertiary-fixed text-on-tertiary-fixed font-label-badge text-[10px] font-bold">
                ${m.compatibility}% Match
              </span>
            </div>
            <span class="font-body-sm text-[11px] text-on-surface-variant truncate">${m.role}</span>
            
            <div class="flex items-center gap-2 mt-1">
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-surface-container text-secondary font-label-caps text-[9px]">
                <span class="material-symbols-outlined text-[10px]">${m.tagIcon || 'verified'}</span> ${m.tag}
              </span>
              <span class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded ${urgencyBadgeClass} font-label-caps text-[9px]">
                <span class="material-symbols-outlined text-[10px]">timer</span> ${m.hoursLeft}h left
              </span>
            </div>
          </div>

          <button onclick="window.chatManager.openChat('${m.profileId}')" class="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center shadow-md active:bg-primary-container transition-all flex-shrink-0 hover:scale-105">
            <span class="material-symbols-outlined text-[18px]">chat</span>
          </button>
        </div>
      `;
    }).join('');
  }

  openChat(profileId) {
    this.activeProfileId = profileId;
    const match = window.api.data.matches.find(m => m.profileId === profileId);
    const profile = window.api.data.profiles.find(p => p.id === profileId);

    if (!match && !profile) return;

    const name = match ? match.name : profile.name;
    const avatar = match ? match.avatar : profile.avatar;
    const role = match ? match.role : profile.role;
    const compatibility = match ? match.compatibility : profile.compatibility;
    const hoursLeft = match ? match.hoursLeft : 24;

    // Set Header
    document.getElementById('chat-recipient-avatar').src = avatar;
    document.getElementById('chat-recipient-name').textContent = name;
    document.getElementById('chat-recipient-role').textContent = role;
    document.getElementById('chat-recipient-compat').textContent = `${compatibility}% Match`;
    document.getElementById('chat-timer-text').textContent = `${hoursLeft}h window`;

    // Render Handshake state
    this.renderHandshakeButton(match);

    // Render Icebreaker chips
    this.renderIcebreakers(profile);

    // Render Messages
    this.renderMessages();

    // Show Modal
    this.chatModal.classList.add('active');
    
    // Clear unread count
    if (match) {
      match.unreadCount = 0;
      window.app.updateNavBadges();
    }
  }

  renderHandshakeButton(match) {
    const handshakeContainer = document.getElementById('chat-handshake-wrapper');
    if (!handshakeContainer) return;

    const isConfirmed = match && match.handshakeSent && match.handshakeAccepted;

    if (isConfirmed) {
      handshakeContainer.innerHTML = `
        <div class="px-3 py-1.5 rounded-full bg-tertiary-container/30 text-tertiary border border-tertiary-container flex items-center gap-1.5 text-xs font-bold shadow-xs">
          <span class="material-symbols-outlined text-[16px]">handshake</span>
          <span>Move-In Agreed!</span>
        </div>
      `;
    } else {
      handshakeContainer.innerHTML = `
        <button onclick="window.chatManager.triggerHandshake()" class="px-3 py-1.5 rounded-full bg-primary text-white flex items-center gap-1.5 text-xs font-bold shadow-md hover:bg-primary-container transition-all active:scale-95">
          <span class="material-symbols-outlined text-[16px]">handshake</span>
          <span>We're Moving In</span>
        </button>
      `;
    }
  }

  renderIcebreakers(profile) {
    const container = document.getElementById('chat-icebreakers-container');
    if (!container) return;

    const prompts = [
      "Let's split cook Raju & maid Sunita!",
      "Are you good with 11pm quiet hours?",
      "Can we do a chai visit tomorrow at DLF Phase 3?",
      "How do you prefer splitting wifi and DG backup?"
    ];

    container.innerHTML = `
      <div class="flex items-center gap-1 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider mb-1 px-1">
        <span class="material-symbols-outlined text-[13px] text-primary">tips_and_updates</span>
        <span>Suggested Synergy Prompts</span>
      </div>
      <div class="flex gap-1.5 overflow-x-auto no-scrollbar pb-1">
        ${prompts.map(p => `
          <button onclick="window.chatManager.sendPresetMessage('${p.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-full bg-secondary-container/50 hover:bg-secondary-container text-secondary text-xs font-medium whitespace-nowrap transition-colors border border-secondary-container">
            ${p}
          </button>
        `).join('')}
      </div>
    `;
  }

  renderMessages() {
    if (!this.messageList || !this.activeProfileId) return;

    const chats = window.api.data.chats[this.activeProfileId] || [];
    const match = window.api.data.matches.find(m => m.profileId === this.activeProfileId);
    const isHandshakeConfirmed = match && match.handshakeSent && match.handshakeAccepted;

    let html = chats.map(msg => {
      const isMe = msg.sender === 'me';
      return `
        <div class="flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-2.5">
          <div class="max-w-[78%] px-3.5 py-2 rounded-2xl text-xs ${
            isMe 
              ? 'bg-primary text-white rounded-tr-none shadow-sm' 
              : 'bg-surface-container-lowest text-on-surface border border-[#eae8e2] rounded-tl-none shadow-xs'
          }">
            <p class="leading-relaxed">${msg.text}</p>
          </div>
          <span class="text-[9px] text-on-surface-variant/70 mt-0.5 px-1">${msg.time}</span>
        </div>
      `;
    }).join('');

    // --- THE MAKE-OR-BREAK BRIDGE CTA (F-06 & PRD §10 TEST #1) ---
    // If move-in handshake is confirmed or active, display the 1-Tap Bridge CTA!
    if (isHandshakeConfirmed) {
      html += `
        <div class="my-4 p-3.5 rounded-2xl bg-gradient-to-br from-primary-fixed/60 via-surface-container-lowest to-secondary-container/40 border border-primary/30 shadow-md flex flex-col gap-2.5">
          <div class="flex items-center gap-2 text-primary">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">cottage</span>
            <div>
              <span class="font-label-caps text-[10px] font-extrabold uppercase tracking-wider block">Bridge to Co-Living</span>
              <h4 class="font-headline-sm text-xs font-bold text-on-surface">Move-In Handshake Active!</h4>
            </div>
          </div>
          <p class="font-body-sm text-xs text-on-surface-variant">
            Generate your household rules (Quiet hours, Non-veg kitchen, Smoking) and shared expense split ledger in 1 tap.
          </p>
          <button onclick="window.chatManager.clickBridgeCta('${this.activeProfileId}')" class="w-full py-2.5 px-4 rounded-xl bg-primary text-white font-label-badge text-xs font-bold shadow-md hover:bg-primary-container transition-all flex items-center justify-center gap-1.5 active:scale-98">
            <span class="material-symbols-outlined text-[16px]">auto_awesome</span>
            <span>Generate Our House Rules & Split Sheet</span>
          </button>
        </div>
      `;
    }

    this.messageList.innerHTML = html;
    this.messageList.scrollTop = this.messageList.scrollHeight;
  }

  async sendPresetMessage(text) {
    if (this.input) {
      this.input.value = text;
      await this.sendMessage();
    }
  }

  async sendMessage() {
    if (!this.input || !this.activeProfileId) return;
    const text = this.input.value.trim();
    if (!text) return;

    this.input.value = '';
    
    // Add locally and send to API
    await window.api.sendMessage(this.activeProfileId, text);
    this.renderMessages();

    // Check if message text triggers move-in
    if (text.toLowerCase().includes('moving in') || text.toLowerCase().includes('move-in together') || text.toLowerCase().includes('take the room')) {
      await this.triggerHandshake();
    }
  }

  async triggerHandshake() {
    if (!this.activeProfileId) return;
    const res = await window.api.handshake(this.activeProfileId);
    
    const match = window.api.data.matches.find(m => m.profileId === this.activeProfileId);
    this.renderHandshakeButton(match);
    this.renderMessages();

    window.app.showToast("🤝 Move-In Handshake Confirmed! Bridge CTA Activated.", "tertiary");
  }

  async clickBridgeCta(profileId) {
    // Record bridge fake-door tap metric (§10 Test #1)
    const result = await window.api.triggerBridge(profileId);
    
    window.app.showToast("✨ House Constitution & Split Ledger Generated!", "tertiary");
    
    // Close chat modal
    this.closeChat();

    // Transition directly to Home OS Tab
    window.app.switchTab('home-os');
  }

  closeChat() {
    if (this.chatModal) {
      this.chatModal.classList.remove('active');
    }
    this.activeProfileId = null;
  }
}

window.chatManager = new ChatManager();
