// ── Step Navigation ──────────────────────────────────────────────────────────
function goToStep(stepNum) {
    const current = document.querySelector('.step:not(.hidden)');
    const next = document.getElementById(`step-${stepNum}`);
    if (!next || current === next) return;

    current.classList.add('hidden');
    next.classList.remove('hidden');

    // Scroll to top on mobile
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── OTP Input Logic ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    const otpInputs = Array.from(document.querySelectorAll('.otp-input'));

    otpInputs.forEach((input, i) => {
        input.addEventListener('input', (e) => {
            const val = e.target.value.replace(/[^0-9]/g, '');
            e.target.value = val;

            if (val) {
                input.classList.add('filled');
                if (i < otpInputs.length - 1) otpInputs[i + 1].focus();
            } else {
                input.classList.remove('filled');
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !input.value && i > 0) {
                otpInputs[i - 1].focus();
                otpInputs[i - 1].value = '';
                otpInputs[i - 1].classList.remove('filled');
            }
        });

        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const paste = (e.clipboardData || window.clipboardData).getData('text').replace(/[^0-9]/g, '');
            paste.split('').slice(0, 6).forEach((char, j) => {
                if (otpInputs[i + j]) {
                    otpInputs[i + j].value = char;
                    otpInputs[i + j].classList.add('filled');
                }
            });
            const nextEmpty = otpInputs.find(inp => !inp.value);
            if (nextEmpty) nextEmpty.focus();
        });
    });

    // ── Role Card Selection ──────────────────────────────────────────────────
    const roleCards = document.querySelectorAll('.role-card');
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            roleCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
        });
    });

    // ── Practice Area Tags ───────────────────────────────────────────────────
    const tags = document.querySelectorAll('.tag');
    tags.forEach(tag => {
        tag.addEventListener('click', () => {
            tag.classList.toggle('selected');
        });
    });

    // ── Resend link cooldown ─────────────────────────────────────────────────
    const resendLink = document.getElementById('resend-link');
    if (resendLink) {
        resendLink.addEventListener('click', (e) => {
            e.preventDefault();
            resendLink.style.pointerEvents = 'none';
            resendLink.textContent = 'Code sent!';
            setTimeout(() => {
                resendLink.textContent = 'Resend code';
                resendLink.style.pointerEvents = '';
            }, 30000);
        });
    }

    // ── Hub Choice Selection ────────────────────────────────────────────────
    const choiceCards = document.querySelectorAll('.choice-card');
    const createFields = document.getElementById('create-hub-fields');
    const joinFields = document.getElementById('join-hub-fields');
    const submitBtn = document.getElementById('submit-hub');
    const trialText = document.getElementById('trial-text');
    const successTitle = document.getElementById('success-title');
    const successSubtitle = document.getElementById('success-subtitle');

    choiceCards.forEach(card => {
        card.addEventListener('click', () => {
            choiceCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');

            const choice = card.dataset.choice;
            if (choice === 'create') {
                createFields.classList.remove('hidden');
                joinFields.classList.add('hidden');
                submitBtn.textContent = 'Launch my Hub';
                trialText.classList.remove('hidden');
                if (successTitle) successTitle.textContent = 'Hub launched 🎉';
                if (successSubtitle) successSubtitle.innerHTML = 'Your Hub is ready at <strong>app.caseactive.com/dashboard</strong>';
            } else {
                createFields.classList.add('hidden');
                joinFields.classList.remove('hidden');
                submitBtn.textContent = 'Request to join';
                trialText.classList.add('hidden');
                if (successTitle) successTitle.textContent = 'Request sent! 📨';
                if (successSubtitle) successSubtitle.innerHTML = 'We notified your firm administrator. You\'ll be redirected once approved.';
            }
        });
    });
});
