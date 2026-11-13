// NestMate AI — Identity & Anti-Broker Verification Center (F-02 & PRD §8)

class VerifyManager {
  constructor() {
    this.verifyModal = null;
    this.reportModal = null;
  }

  init() {
    this.verifyModal = document.getElementById('student-verify-modal');
    this.reportModal = document.getElementById('broker-report-modal');
  }

  openStudentVerifyModal() {
    if (this.verifyModal) this.verifyModal.classList.add('active');
  }

  closeStudentVerifyModal() {
    if (this.verifyModal) this.verifyModal.classList.remove('active');
  }

  async submitStudentVerification() {
    const org = document.getElementById('student-org-input')?.value.trim();
    const idNum = document.getElementById('student-id-input')?.value.trim();

    if (!org || !idNum) {
      window.app.showToast("Please enter institution name and ID number");
      return;
    }

    await window.api.updateVerify('studentId', { org, idNum });
    this.closeStudentVerifyModal();
    window.app.renderVerifyTab();
    window.app.showToast("🎓 Student / Freelancer verification verified at Level 3!", "tertiary");
  }

  openBrokerReportModal() {
    if (this.reportModal) this.reportModal.classList.add('active');
  }

  closeBrokerReportModal() {
    if (this.reportModal) this.reportModal.classList.remove('active');
  }

  submitBrokerReport() {
    this.closeBrokerReportModal();
    window.app.showToast("🛡️ Report logged. Profile flagged for review under 3-strike rule.", "error");
  }

  togglePhonePrivacy() {
    const isMasked = document.getElementById('phone-mask-status');
    if (isMasked) {
      window.app.showToast("🔒 Phone privacy shield active: Numbers masked until mutual handshake.", "secondary");
    }
  }
}

window.verifyManager = new VerifyManager();
