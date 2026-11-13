// NestMate AI — Lifestyle Compatibility Quiz & Vector Engine (F-03)

class QuizManager {
  constructor() {
    this.modal = null;
    this.currentAnswers = {};
  }

  init() {
    this.modal = document.getElementById('quiz-modal');
  }

  openQuizModal() {
    if (!this.modal) return;
    this.currentAnswers = { ...window.api.data.user.quizAnswers };
    this.renderQuestions();
    this.modal.classList.add('active');
  }

  closeQuizModal() {
    if (this.modal) this.modal.classList.remove('active');
  }

  renderQuestions() {
    const container = document.getElementById('quiz-questions-list');
    if (!container) return;

    const questions = window.api.data.quizQuestions || [];

    container.innerHTML = questions.map((q, idx) => {
      const selectedId = this.currentAnswers[q.id];
      const isDealbreaker = q.category.includes('Dealbreaker');

      return `
        <div class="p-4 rounded-2xl bg-surface-container-lowest border ${isDealbreaker ? 'border-primary/30' : 'border-[#eae8e2]'} shadow-xs flex flex-col gap-2.5">
          <div class="flex items-center justify-between">
            <span class="font-label-caps text-[9px] uppercase font-bold tracking-wider ${isDealbreaker ? 'text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full' : 'text-secondary'}">
              ${q.category} · Q${idx + 1}
            </span>
            ${isDealbreaker ? '<span class="text-[10px] font-bold text-primary flex items-center gap-0.5"><span class="material-symbols-outlined text-[13px]">warning</span> Dealbreaker Filter</span>' : ''}
          </div>

          <h4 class="font-headline-sm text-xs font-bold text-on-surface leading-snug">${q.question}</h4>

          <div class="flex flex-col gap-1.5 mt-1">
            ${q.options.map(opt => {
              const isChecked = selectedId === opt.id;
              return `
                <label class="flex items-center gap-2.5 p-2.5 rounded-xl border ${
                  isChecked 
                    ? 'border-secondary bg-secondary-container/20 text-on-surface font-semibold' 
                    : 'border-surface-container-high hover:bg-surface-container-low text-on-surface-variant'
                } cursor-pointer transition-all">
                  <input type="radio" name="${q.id}" value="${opt.id}" ${isChecked ? 'checked' : ''} onchange="window.quizManager.selectAnswer('${q.id}', '${opt.id}')" class="text-secondary accent-secondary" />
                  <span class="text-xs">${opt.text}</span>
                </label>
              `;
            }).join('')}
          </div>
        </div>
      `;
    }).join('');
  }

  selectAnswer(questionId, optionId) {
    this.currentAnswers[questionId] = optionId;
  }

  async submitQuiz() {
    await window.api.updateQuiz(this.currentAnswers);
    this.closeQuizModal();
    
    // Refresh Discover deck and Verify tab with new scores
    window.swipeDeck.init(document.getElementById('swipe-card-stack'));
    window.app.renderVerifyTab();
    window.chatManager.renderMatchList();
    
    window.app.showToast("✨ Compatibility vectors updated & scores recalculated!", "tertiary");
  }
}

window.quizManager = new QuizManager();
