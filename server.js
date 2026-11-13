const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const SEED_FILE = path.join(DATA_DIR, 'seedData.json');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const PUBLIC_DIR = path.join(__dirname, 'public');

// Initialize database
let db = {};
function initDb() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const content = fs.readFileSync(DB_FILE, 'utf-8');
      db = JSON.parse(content);
    } else {
      const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
      db = JSON.parse(seedContent);
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    }
  } catch (err) {
    console.error('Error loading db, using seed fallback:', err);
    const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
    db = JSON.parse(seedContent);
  }
}
initDb();

function saveDb() {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
  } catch (err) {
    console.error('Error saving db:', err);
  }
}

// MIME types dictionary
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

// Deterministic Compatibility Scoring Engine (TypeScript/Node sub-50ms implementation as per PRD §8 & §11)
function calculateCompatibility(userAnswers, profile) {
  let score = 70; // baseline
  
  // Dealbreaker 1: Diet
  if (userAnswers.q1_diet === 'non-veg') {
    score += 10;
  } else if (userAnswers.q1_diet === 'pure-veg' && profile.amenities && profile.amenities.includes('Pure Veg')) {
    score += 15;
  } else if (userAnswers.q1_diet === 'pure-veg' && !profile.amenities.includes('Pure Veg')) {
    score -= 20; // dealbreaker penalty
  }

  // Dealbreaker 2: Smoking
  if (userAnswers.q2_smoking === 'balcony') {
    score += 5;
  } else if (userAnswers.q2_smoking === 'strictly-no' && profile.bio.toLowerCase().includes('smoke')) {
    score -= 15;
  }

  // Soft Habit 1: Sleep
  if (userAnswers.q3_sleep === 'night-owl' && (profile.bio.toLowerCase().includes('night owl') || profile.compatibility >= 90)) {
    score += 8;
  }

  // Soft Habit 2: Cleanliness
  if (userAnswers.q4_cleanliness === 'spotless' || userAnswers.q4_cleanliness === 'regular') {
    score += 6;
  }

  // Soft Habit 3: Staff & Cook
  if (userAnswers.q7_maid_cook === 'essential' && profile.householdCosts && profile.householdCosts.cook > 0) {
    score += 6;
  }

  return Math.min(99, Math.max(55, score));
}

// Request dispatcher
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // Helper for JSON responses
  const sendJson = (data, status = 200) => {
    res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify(data));
  };

  // Helper for reading request body
  const readBody = (callback) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const json = body ? JSON.parse(body) : {};
        callback(null, json);
      } catch (e) {
        callback(e);
      }
    });
  };

  // --- API ROUTES ---
  if (pathname.startsWith('/api/')) {
    // 1. Get entire application state
    if (pathname === '/api/data' && req.method === 'GET') {
      return sendJson(db);
    }

    // 2. Swipe action
    if (pathname === '/api/swipe' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { profileId, action } = data; // action: 'like', 'pass', 'save'
        
        const profile = db.profiles.find(p => p.id === profileId);
        if (!profile) return sendJson({ error: 'Profile not found' }, 404);

        if (action === 'like') {
          // Check if already in matches
          let match = db.matches.find(m => m.profileId === profileId);
          if (!match) {
            match = {
              profileId: profile.id,
              name: profile.name,
              avatar: profile.avatar,
              role: profile.role,
              compatibility: profile.compatibility,
              tag: profile.synergy.sleep ? profile.synergy.sleep.name : 'Verified',
              tagIcon: 'verified',
              hoursLeft: 24,
              status: 'active',
              unreadCount: 1,
              lastMessage: `Hey ${db.user.name.split(' ')[0]}! We matched on NestMate! Check out my place in ${profile.corridor}.`,
              lastTimestamp: 'Just now',
              handshakeSent: false,
              handshakeAccepted: false
            };
            db.matches.unshift(match);
            
            // Add initial chat
            if (!db.chats[profileId]) {
              db.chats[profileId] = [
                {
                  id: 'm_' + Date.now(),
                  sender: 'them',
                  text: `Hey ${db.user.name.split(' ')[0]}! Mutual match with ${profile.compatibility}% compatibility score. The place in ${profile.sublocation} is open for move-in!`,
                  time: 'Just now'
                }
              ];
            }
          }
        }
        
        saveDb();
        return sendJson({ success: true, action, profileId, matches: db.matches });
      });
    }

    // 3. Post a message to chat
    if (pathname === '/api/messages' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { profileId, text } = data;
        if (!profileId || !text) return sendJson({ error: 'Missing profileId or text' }, 400);

        if (!db.chats[profileId]) {
          db.chats[profileId] = [];
        }

        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const newMsg = {
          id: 'msg_' + Date.now(),
          sender: 'me',
          text,
          time: timeStr
        };
        db.chats[profileId].push(newMsg);

        // Update last message in matches
        const match = db.matches.find(m => m.profileId === profileId);
        if (match) {
          match.lastMessage = text;
          match.lastTimestamp = timeStr;
        }

        // Automatic simulated smart response from flatmate
        const profile = db.profiles.find(p => p.id === profileId);
        const profileName = profile ? profile.name.split(' ')[0] : 'Flatmate';

        setTimeout(() => {
          let replyText = `Thanks for the ping! Let me know when you'd like to do a quick chai or video walk-through of the room.`;
          const lower = text.toLowerCase();
          
          if (lower.includes('cook') || lower.includes('maid') || lower.includes('food')) {
            replyText = `Yes! Our cook Raju Bhaiya makes healthy meals twice a day and Sunita Bai takes care of daily deep cleaning. Total staff split is around ₹3,700/mo.`;
          } else if (lower.includes('rent') || lower.includes('deposit') || lower.includes('cost')) {
            replyText = `Rent is ₹${profile ? profile.rent : 24000}/mo all-inclusive (includes maintenance and 100% DG power backup). Deposit is 2 months, straight with leaseholder.`;
          } else if (lower.includes('move') || lower.includes('handshake') || lower.includes('ready')) {
            replyText = `Awesome! I'm completely in. Tap the "Move-in Together" handshake or the Bridge button so we can generate our house rules & expense splits! 🤝`;
          } else if (lower.includes('constitution') || lower.includes('rule') || lower.includes('split')) {
            replyText = `Generated! I've already signed the 11pm quiet hours and separate non-veg cookware clause in our Home OS. Take a look and approve! 📄✨`;
          }

          const replyMsg = {
            id: 'reply_' + Date.now(),
            sender: 'them',
            text: replyText,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          if (db.chats[profileId]) {
            db.chats[profileId].push(replyMsg);
            if (match) {
              match.lastMessage = replyText;
              match.lastTimestamp = replyMsg.time;
              match.unreadCount = (match.unreadCount || 0) + 1;
            }
            saveDb();
          }
        }, 1200);

        saveDb();
        return sendJson({ success: true, message: newMsg });
      });
    }

    // 4. Move-in Handshake
    if (pathname === '/api/handshake' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { profileId } = data;
        const match = db.matches.find(m => m.profileId === profileId);
        if (!match) return sendJson({ error: 'Match not found' }, 404);

        match.handshakeSent = true;
        match.handshakeAccepted = true; // mutual confirmation
        saveDb();
        return sendJson({ success: true, match });
      });
    }

    // 5. The Bridge CTA (Make-or-break test §10 & F-06)
    if (pathname === '/api/bridge-action' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { profileId, action } = data;
        
        // Record bridge event analytics
        if (!db.bridgeAnalytics) db.bridgeAnalytics = [];
        db.bridgeAnalytics.push({
          timestamp: new Date().toISOString(),
          profileId,
          action: action || 'generate_constitution_tapped',
          converted: true
        });

        // Ensure flat in Home OS reflects this match
        const profile = db.profiles.find(p => p.id === profileId);
        if (profile) {
          db.homeOs.flat.members = [
            { name: db.user.name, role: 'Tenant', avatar: db.user.avatar },
            { name: profile.name, role: profile.isLeaseLead ? 'Lease Lead' : 'Co-Tenant', avatar: profile.avatar }
          ];
          db.homeOs.flat.name = `${profile.corridor} · ${profile.title}`;
          db.homeOs.flat.address = profile.sublocation;
        }

        saveDb();
        return sendJson({
          success: true,
          message: 'Bridge test tap recorded. House Constitution & Split Ledger activated!',
          homeOs: db.homeOs
        });
      });
    }

    // 6. Update Quiz Answers & Recalculate Scores
    if (pathname === '/api/quiz' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { answers } = data;
        if (!answers) return sendJson({ error: 'Missing answers' }, 400);

        db.user.quizAnswers = { ...db.user.quizAnswers, ...answers };

        // Update habits summary
        if (answers.q1_diet) {
          db.user.habits.diet = answers.q1_diet === 'non-veg' ? 'Non-veg friendly' : answers.q1_diet === 'eggetarian' ? 'Eggetarian' : 'Strict Vegetarian';
        }
        if (answers.q2_smoking) {
          db.user.habits.smoking = answers.q2_smoking === 'strictly-no' ? 'Strictly Non-Smoking' : 'Balcony only';
        }
        if (answers.q3_sleep) {
          db.user.habits.sleep = answers.q3_sleep === 'early-bird' ? '10:30 PM sleep' : answers.q3_sleep === 'moderate' ? '11:45 PM sleep' : '1:30 AM sleep';
        }
        if (answers.q5_work) {
          db.user.habits.work = answers.q5_work === 'fully-office' ? 'Office Daily' : answers.q5_work === 'hybrid' ? 'Hybrid (2d office)' : '100% Remote';
        }

        // Recalculate scores for all profiles
        db.profiles.forEach(p => {
          p.compatibility = calculateCompatibility(db.user.quizAnswers, p);
        });

        // Update matches compatibility
        db.matches.forEach(m => {
          const matchedProfile = db.profiles.find(p => p.id === m.profileId);
          if (matchedProfile) {
            m.compatibility = matchedProfile.compatibility;
          }
        });

        saveDb();
        return sendJson({ success: true, user: db.user, profiles: db.profiles, matches: db.matches });
      });
    }

    // 7. Constitution Rule Action (Add, Toggle Approval)
    if (pathname === '/api/constitution/rule' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { ruleId, action, newRule } = data;

        if (action === 'toggleApproval') {
          const rule = db.homeOs.constitution.find(r => r.id === ruleId);
          if (rule) {
            const userName = db.user.name;
            if (rule.approvedBy.includes(userName)) {
              rule.approvedBy = rule.approvedBy.filter(n => n !== userName);
            } else {
              rule.approvedBy.push(userName);
            }
            rule.status = rule.approvedBy.length >= 2 ? 'approved' : 'pending';
          }
        } else if (action === 'add' && newRule) {
          const ruleObj = {
            id: 'c_' + Date.now(),
            title: newRule.title,
            desc: newRule.desc,
            category: newRule.category || 'General',
            status: 'approved',
            approvedBy: [db.user.name]
          };
          db.homeOs.constitution.push(ruleObj);
        }

        saveDb();
        return sendJson({ success: true, constitution: db.homeOs.constitution });
      });
    }

    // 8. Chores Toggle
    if (pathname === '/api/chores/toggle' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { choreId } = data;
        const chore = db.homeOs.chores.find(c => c.id === choreId);
        if (!chore) return sendJson({ error: 'Chore not found' }, 404);

        chore.status = chore.status === 'completed' ? 'pending' : 'completed';
        saveDb();
        return sendJson({ success: true, chore, chores: db.homeOs.chores });
      });
    }

    // 9. Add Expense
    if (pathname === '/api/expenses' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { title, amount, category, splitType, paidBy } = data;
        
        const numAmount = parseFloat(amount) || 0;
        const yourShare = splitType === 'Equally (50-50)' ? Math.round(numAmount / 2) : numAmount;

        const expenseItem = {
          id: 'e_' + Date.now(),
          title,
          amount: numAmount,
          paidBy: paidBy || db.user.name,
          yourShare,
          date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
          category: category || 'Utilities',
          splitType: splitType || 'Equally (50-50)',
          status: 'Pending Settlement'
        };

        db.homeOs.expenses.items.unshift(expenseItem);
        
        // Recalculate net receivable
        if (expenseItem.paidBy === db.user.name) {
          db.homeOs.expenses.netReceivable += yourShare;
        } else {
          db.homeOs.expenses.netReceivable -= yourShare;
        }

        saveDb();
        return sendJson({ success: true, expenses: db.homeOs.expenses });
      });
    }

    // 10. Update Profile & Verification Status
    if (pathname === '/api/verify' && req.method === 'POST') {
      return readBody((err, data) => {
        if (err) return sendJson({ error: 'Invalid JSON' }, 400);
        const { type, value } = data;

        if (type === 'workSso') {
          db.user.workSsoActive = value;
          db.user.verificationLevel = value ? 3 : 2;
        } else if (type === 'studentId') {
          db.user.studentVerified = true;
          db.user.role = 'Student / Researcher';
          db.user.verificationLevel = 3;
        } else if (type === 'freelancer') {
          db.user.freelancerVerified = true;
          db.user.role = 'Independent Consultant';
          db.user.verificationLevel = 3;
        }

        saveDb();
        return sendJson({ success: true, user: db.user });
      });
    }

    // 11. Reset database to seed
    if (pathname === '/api/reset' && req.method === 'POST') {
      const seedContent = fs.readFileSync(SEED_FILE, 'utf-8');
      db = JSON.parse(seedContent);
      saveDb();
      return sendJson({ success: true, message: 'Reset database to initial seed data' });
    }

    // Route not found
    return sendJson({ error: 'API endpoint not found' }, 404);
  }

  // --- STATIC FILE SERVER ---
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Security check to avoid path traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403);
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA/PWA routing
      filePath = path.join(PUBLIC_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    fs.readFile(filePath, (readErr, content) => {
      if (readErr) {
        res.writeHead(500);
        res.end('Server Error reading file');
        return;
      }
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
    });
  });
});

if (require.main === module) {
  server.listen(PORT, () => {
    console.log(`NestMate AI Lean MVP running at http://localhost:${PORT}`);
  });
}

module.exports = server;
