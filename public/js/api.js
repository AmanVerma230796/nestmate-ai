// NestMate AI — Client State & API Manager

class ApiManager {
  constructor() {
    this.data = null;
    this.localStorageKey = 'nestmate_app_state_v2';
  }

  async loadState() {
    try {
      const res = await fetch('/api/data');
      if (res.ok) {
        this.data = await res.json();
        localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
        return this.data;
      }
    } catch (e) {
      console.warn('Backend API unavailable, checking localStorage fallback:', e);
    }

    const cached = localStorage.getItem(this.localStorageKey);
    if (cached) {
      this.data = JSON.parse(cached);
      return this.data;
    }

    if (window.INITIAL_SEED_DATA) {
      this.data = JSON.parse(JSON.stringify(window.INITIAL_SEED_DATA));
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
      return this.data;
    }

    throw new Error('Failed to load initial application state.');
  }

  saveLocal() {
    if (this.data) {
      localStorage.setItem(this.localStorageKey, JSON.stringify(this.data));
    }
  }

  async swipe(profileId, action) {
    try {
      const res = await fetch('/api/swipe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.matches) this.data.matches = result.matches;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API swipe fallback to client state');
    }

    // Client-side fallback
    if (action === 'like') {
      const profile = this.data.profiles.find(p => p.id === profileId);
      if (profile && !this.data.matches.find(m => m.profileId === profileId)) {
        this.data.matches.unshift({
          profileId: profile.id,
          name: profile.name,
          avatar: profile.avatar,
          role: profile.role,
          compatibility: profile.compatibility,
          tag: 'Matched',
          tagIcon: 'verified',
          hoursLeft: 24,
          status: 'active',
          unreadCount: 1,
          lastMessage: `Hey ${this.data.user.name.split(' ')[0]}! We matched on NestMate! Check out my place in ${profile.corridor}.`,
          lastTimestamp: 'Just now',
          handshakeSent: false,
          handshakeAccepted: false
        });
      }
    }
    this.saveLocal();
    return { success: true, action, profileId };
  }

  async sendMessage(profileId, text) {
    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, text })
      });
      if (res.ok) {
        const result = await res.json();
        if (!this.data.chats[profileId]) this.data.chats[profileId] = [];
        this.data.chats[profileId].push(result.message);
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API sendMessage fallback');
    }

    // Client-side fallback
    if (!this.data.chats[profileId]) this.data.chats[profileId] = [];
    const msg = {
      id: 'msg_' + Date.now(),
      sender: 'me',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    this.data.chats[profileId].push(msg);
    this.saveLocal();
    return { success: true, message: msg };
  }

  async handshake(profileId) {
    try {
      const res = await fetch('/api/handshake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId })
      });
      if (res.ok) {
        const result = await res.json();
        const m = this.data.matches.find(match => match.profileId === profileId);
        if (m) {
          m.handshakeSent = true;
          m.handshakeAccepted = true;
        }
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API handshake fallback');
    }

    const m = this.data.matches.find(match => match.profileId === profileId);
    if (m) {
      m.handshakeSent = true;
      m.handshakeAccepted = true;
    }
    this.saveLocal();
    return { success: true, match: m };
  }

  async triggerBridge(profileId) {
    try {
      const res = await fetch('/api/bridge-action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileId, action: 'generate_constitution_tapped' })
      });
      if (res.ok) {
        const result = await res.json();
        if (result.homeOs) this.data.homeOs = result.homeOs;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API bridge fallback');
    }

    return {
      success: true,
      message: 'Bridge activated! Household Constitution & Split Ledger ready.'
    };
  }

  async updateQuiz(answers) {
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });
      if (res.ok) {
        const result = await res.json();
        this.data.user = result.user;
        this.data.profiles = result.profiles;
        this.data.matches = result.matches;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API quiz fallback');
    }

    this.data.user.quizAnswers = { ...this.data.user.quizAnswers, ...answers };
    this.saveLocal();
    return { success: true, user: this.data.user };
  }

  async toggleConstitutionRule(ruleId) {
    try {
      const res = await fetch('/api/constitution/rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ruleId, action: 'toggleApproval' })
      });
      if (res.ok) {
        const result = await res.json();
        this.data.homeOs.constitution = result.constitution;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API constitution fallback');
    }

    const rule = this.data.homeOs.constitution.find(r => r.id === ruleId);
    if (rule) {
      const userName = this.data.user.name;
      if (rule.approvedBy.includes(userName)) {
        rule.approvedBy = rule.approvedBy.filter(n => n !== userName);
      } else {
        rule.approvedBy.push(userName);
      }
      rule.status = rule.approvedBy.length >= 2 ? 'approved' : 'pending';
    }
    this.saveLocal();
    return { success: true, constitution: this.data.homeOs.constitution };
  }

  async addConstitutionRule(newRule) {
    try {
      const res = await fetch('/api/constitution/rule', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'add', newRule })
      });
      if (res.ok) {
        const result = await res.json();
        this.data.homeOs.constitution = result.constitution;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API add rule fallback');
    }

    const ruleObj = {
      id: 'c_' + Date.now(),
      title: newRule.title,
      desc: newRule.desc,
      category: newRule.category || 'General',
      status: 'approved',
      approvedBy: [this.data.user.name]
    };
    this.data.homeOs.constitution.push(ruleObj);
    this.saveLocal();
    return { success: true, constitution: this.data.homeOs.constitution };
  }

  async toggleChore(choreId) {
    try {
      const res = await fetch('/api/chores/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ choreId })
      });
      if (res.ok) {
        const result = await res.json();
        this.data.homeOs.chores = result.chores;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API chore toggle fallback');
    }

    const chore = this.data.homeOs.chores.find(c => c.id === choreId);
    if (chore) {
      chore.status = chore.status === 'completed' ? 'pending' : 'completed';
    }
    this.saveLocal();
    return { success: true, chores: this.data.homeOs.chores };
  }

  async addExpense(expenseData) {
    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(expenseData)
      });
      if (res.ok) {
        const result = await res.json();
        this.data.homeOs.expenses = result.expenses;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API expense fallback');
    }

    const numAmount = parseFloat(expenseData.amount) || 0;
    const yourShare = expenseData.splitType === 'Equally (50-50)' ? Math.round(numAmount / 2) : numAmount;

    const expenseItem = {
      id: 'e_' + Date.now(),
      title: expenseData.title,
      amount: numAmount,
      paidBy: expenseData.paidBy || this.data.user.name,
      yourShare,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: expenseData.category || 'Utilities',
      splitType: expenseData.splitType || 'Equally (50-50)',
      status: 'Pending Settlement'
    };
    this.data.homeOs.expenses.items.unshift(expenseItem);
    this.saveLocal();
    return { success: true, expenses: this.data.homeOs.expenses };
  }

  async updateVerify(type, value) {
    try {
      const res = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, value })
      });
      if (res.ok) {
        const result = await res.json();
        this.data.user = result.user;
        this.saveLocal();
        return result;
      }
    } catch (e) {
      console.warn('API verify fallback');
    }

    this.data.user.verificationLevel = 3;
    this.saveLocal();
    return { success: true, user: this.data.user };
  }
}

window.api = new ApiManager();
