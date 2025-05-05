document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePasswordButton = document.querySelector('.toggle-password');
    const loginButton = document.querySelector('.login-button');

    // Toggle password visibility
    togglePasswordButton.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePasswordButton.textContent = type === 'password' ? 'Show' : 'Hide';
    });

    // Real-time validation
    const validateField = (input, criteria) => {
        const errorElement = input.parentElement.querySelector('.error-message') ||
                           input.parentElement.parentElement.querySelector('.error-message');
        
        if (!input.value) {
            errorElement.textContent = 'This field is required';
            errorElement.classList.add('visible');
            return false;
        }
        
        if (criteria && !criteria(input.value)) {
            errorElement.textContent = input.dataset.errorMessage || 'Invalid input';
            errorElement.classList.add('visible');
            return false;
        }
        
        errorElement.classList.remove('visible');
        return true;
    };

    // Input validation events
    [usernameInput, passwordInput].forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.value) validateField(input);
        });
    });

    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validate all fields
        const isUsernameValid = validateField(usernameInput);
        const isPasswordValid = validateField(passwordInput);

        if (!isUsernameValid || !isPasswordValid) {
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
            return;
        }

        // Show loading state
        loginButton.classList.add('loading');
        loginButton.disabled = true;

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Check credentials
            if (usernameInput.value === 'admin' && passwordInput.value === 'admin') {
                // Success - redirect or handle successful login
                alert('Login successful!');
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (error) {
            // Show error
            loginForm.classList.add('shake');
            setTimeout(() => loginForm.classList.remove('shake'), 500);
            
            const errorElement = passwordInput.parentElement.querySelector('.error-message');
            errorElement.textContent = 'Invalid username or password';
            errorElement.classList.add('visible');
        } finally {
            // Reset loading state
            loginButton.classList.remove('loading');
            loginButton.disabled = false;
        }
    });

    // Accessibility: Handle Enter key on toggle password button
    togglePasswordButton.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            togglePasswordButton.click();
        }
    });
});