document.addEventListener('DOMContentLoaded', () => {
    const authToggle = document.getElementById('auth-toggle');
    const authTitle = document.getElementById('auth-title');
    const authSubtitle = document.getElementById('auth-subtitle');
    const toggleContainer = document.getElementById('toggle-container');
    const submitBtn = document.querySelector('.submit-btn');

    let isSignUp = false;

    authToggle.addEventListener('click', (e) => {
        e.preventDefault();
        isSignUp = !isSignUp;

        if (isSignUp) {
            authTitle.textContent = 'Create your account';
            authSubtitle.textContent = 'Join 500+ firms who trust CaseActive to manage their cases.';
            submitBtn.textContent = 'Create account';
            toggleContainer.innerHTML = 'Already have an account? <a href="#" id="auth-toggle">Sign in</a>';
        } else {
            authTitle.textContent = 'Welcome back';
            authSubtitle.textContent = 'New here? Entering your email automatically creates an account.';
            submitBtn.textContent = 'Continue with email';
            toggleContainer.innerHTML = 'New here? <a href="#" id="auth-toggle">Create an account</a>';
        }

        // Re-attach listener because we replaced innerHTML
        const newToggle = document.getElementById('auth-toggle');
        newToggle.addEventListener('click', arguments.callee);
        
        // Add a subtle transition effect
        const card = document.querySelector('.auth-card');
        card.style.transform = 'scale(0.99)';
        setTimeout(() => {
            card.style.transform = 'scale(1)';
        }, 100);
    });

    // Handle form submission
    const form = document.querySelector('.auth-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="loader"></span>';
        
        console.log(`Authenticating ${email}...`);
        
        // Simulate API call
        setTimeout(() => {
            alert(isSignUp ? 'Account created! Welcome to CaseActive.' : 'Checking your email for a magic link...');
            submitBtn.disabled = false;
            submitBtn.textContent = isSignUp ? 'Create account' : 'Continue with email';
        }, 1500);
    });
});
