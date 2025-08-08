// Jasker Authentication Module
// Supports both Google and Email/Password authentication

class AuthManager {
    constructor() {
        this.auth = null;
        this.currentUser = null;
        this.authStateListeners = [];
        this.googleProvider = null;
    }

    async init() {
        try {
            // Initialize Firebase
            firebase.initializeApp(config.firebase);
            this.auth = firebase.auth();
            
            // Set up Google provider
            this.googleProvider = new firebase.auth.GoogleAuthProvider();
            this.googleProvider.setCustomParameters({
                prompt: 'select_account'
            });
            
            // Set up authentication state listener
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.handleAuthStateChange(user);
            });
            
            // Handle redirect result immediately on init
            this.handleRedirectResult();
            
            console.log('Authentication initialized successfully');
        } catch (error) {
            console.error('Failed to initialize authentication:', error);
            this.showError('Authentication initialization failed. Please refresh the page.');
        }
    }

    // Google sign-in - using redirect for reliability
    async signInWithGoogle() {
        try {
            this.showLoading('Redirecting to Google...');
            await this.auth.signInWithRedirect(this.googleProvider);
            // The page will redirect, so we don't need to hide loading
        } catch (error) {
            console.error('Google sign-in failed:', error);
            this.hideLoading();
            this.showError('Google sign-in failed. Please try again.');
        }
    }

    // Handle redirect result (for when popup fails and redirect is used)
    async handleRedirectResult() {
        try {
            const result = await this.auth.getRedirectResult();
            if (result.user) {
                console.log('Redirect sign-in successful:', result.user.email);
                // The auth state listener will handle showing the main app
            }
        } catch (error) {
            console.error('Redirect sign-in failed:', error);
            // Only show error if it's not a "no redirect result" error
            if (error.code !== 'auth/no-auth-event') {
                this.showError('Sign-in failed. Please try again.');
            }
        }
    }

    // Email/password authentication
    async signInWithEmail(email, password) {
        try {
            this.showLoading('Signing in...');
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Email sign-in successful:', result.user.email);
            this.hideLoading();
        } catch (error) {
            console.error('Email sign-in failed:', error);
            this.hideLoading();
            
            let errorMessage = 'Email sign-in failed. Please check your credentials.';
            if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email. Please create an account first.';
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password. Please try again.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            }
            
            this.showError(errorMessage);
        }
    }

    async signUpWithEmail(email, password) {
        try {
            this.showLoading('Creating account...');
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            console.log('Account creation successful:', result.user.email);
            this.hideLoading();
        } catch (error) {
            console.error('Account creation failed:', error);
            this.hideLoading();
            
            let errorMessage = 'Account creation failed. Please try again.';
            if (error.code === 'auth/email-already-in-use') {
                errorMessage = 'An account with this email already exists. Please sign in instead.';
            } else if (error.code === 'auth/weak-password') {
                errorMessage = 'Password is too weak. Please use at least 6 characters.';
            } else if (error.code === 'auth/invalid-email') {
                errorMessage = 'Please enter a valid email address.';
            }
            
            this.showError(errorMessage);
        }
    }

    async signOut() {
        try {
            await this.auth.signOut();
            console.log('Sign out successful');
        } catch (error) {
            console.error('Sign out failed:', error);
            this.showError('Sign out failed. Please try again.');
        }
    }

    handleAuthStateChange(user) {
        console.log('Auth state changed:', user ? user.email : 'No user');
        
        if (user) {
            // User is signed in
            console.log('User signed in:', user.email);
            this.hideLoading();
            this.showMainApp();
            this.updateUserInfo(user);
        } else {
            // User is signed out
            console.log('User signed out');
            this.hideLoading();
            this.showAuthScreen();
        }

        // Notify listeners
        this.authStateListeners.forEach(listener => listener(user));
    }

    showMainApp() {
        console.log('Showing main app');
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        console.log('Auth screen element:', authScreen);
        console.log('Main app element:', mainApp);
        
        if (authScreen) {
            authScreen.classList.remove('active');
            console.log('Removed active from auth screen');
        }
        if (mainApp) {
            mainApp.classList.add('active');
            console.log('Added active to main app');
        }
    }

    showAuthScreen() {
        console.log('Showing auth screen');
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        console.log('Auth screen element:', authScreen);
        console.log('Main app element:', mainApp);
        
        if (mainApp) {
            mainApp.classList.remove('active');
            console.log('Removed active from main app');
        }
        if (authScreen) {
            authScreen.classList.add('active');
            console.log('Added active to auth screen');
        }
    }

    updateUserInfo(user) {
        const userInfoElement = document.getElementById('user-info');
        if (userInfoElement) {
            userInfoElement.textContent = user.email || user.displayName || 'User';
        }
    }

    showLoading(message) {
        // Create a simple loading indicator
        const loadingDiv = document.createElement('div');
        loadingDiv.id = 'loading-indicator';
        loadingDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border: 2px solid var(--color-forest-green);
                border-radius: 8px;
                z-index: 1000;
                font-family: var(--font-courier);
                text-align: center;
            ">
                <div style="margin-bottom: 10px;">⏳</div>
                <div>${message}</div>
            </div>
        `;
        document.body.appendChild(loadingDiv);
    }

    hideLoading() {
        const loadingDiv = document.getElementById('loading-indicator');
        if (loadingDiv) {
            loadingDiv.remove();
        }
    }

    showError(message) {
        this.hideLoading();
        
        // Create a simple error indicator
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-indicator';
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 20px;
                border: 2px solid #d32f2f;
                border-radius: 8px;
                z-index: 1000;
                font-family: var(--font-courier);
                text-align: center;
                max-width: 300px;
            ">
                <div style="margin-bottom: 10px; color: #d32f2f;">❌</div>
                <div style="color: #d32f2f; margin-bottom: 15px;">${message}</div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: #d32f2f;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-family: var(--font-courier);
                    cursor: pointer;
                ">OK</button>
            </div>
        `;
        document.body.appendChild(errorDiv);
    }

    // Add listener for auth state changes
    onAuthStateChanged(listener) {
        this.authStateListeners.push(listener);
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Check if user is authenticated
    isAuthenticated() {
        return this.currentUser !== null;
    }

    // Test function to manually switch screens
    testScreenSwitch() {
        console.log('Testing app functionality...');
        
        // Force show main app with inline styles
        const authScreen = document.getElementById('auth-screen');
        const mainApp = document.getElementById('main-app');
        
        if (authScreen) {
            authScreen.style.display = 'none';
            console.log('Forced auth screen to hide');
        }
        if (mainApp) {
            mainApp.style.display = 'flex';
            console.log('Forced main app to show');
        }
        
        // Simulate user authentication and trigger welcome message
        setTimeout(() => {
            console.log('Triggering welcome message...');
            if (window.jaskerApp) {
                window.jaskerApp.showAppropriateWelcomeMessage();
            }
        }, 500);
    }

    saveApiKey() {
        const openaiKeyInput = document.getElementById('openai-key-input');
        const saveBtn = document.getElementById('save-api-key');
        
        if (!openaiKeyInput) return;
        
        const apiKey = openaiKeyInput.value.trim();
        
        if (!apiKey) {
            this.showError('Please enter your OpenAI API key');
            return;
        }
        
        // Save to localStorage
        localStorage.setItem('openai_api_key', apiKey);
        
        // Update config
        if (typeof setApiKey === 'function') {
            setApiKey('openai', apiKey);
        }
        
        // Update button text
        if (saveBtn) {
            saveBtn.innerHTML = '<span>✓ API Key Saved</span>';
            saveBtn.style.background = '#28a745';
            
            setTimeout(() => {
                saveBtn.innerHTML = '<span>Save API Key</span>';
                saveBtn.style.background = '#2c5530';
            }, 2000);
        }
        
        console.log('OpenAI API key saved successfully');
    }
}

// Initialize authentication manager
const authManager = new AuthManager();

// Set up event listeners for authentication buttons
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AuthManager after DOM is loaded
    authManager.init();

    // Google Sign-In
    const googleBtn = document.getElementById('google-signin');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => {
            authManager.signInWithGoogle();
        });
    }

    // Email Sign-In
    const emailBtn = document.getElementById('email-signin');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            showEmailSignInForm();
        });
    }

    // Test Screen Switch
    const testBtn = document.getElementById('test-screen-switch');
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            console.log('Test screen switch button clicked');
            authManager.testScreenSwitch();
        });
    }

    // Sign Out
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => authManager.signOut());
    }

    // API Settings
    const apiSettingsBtn = document.getElementById('api-settings-btn');
    if (apiSettingsBtn) {
        apiSettingsBtn.addEventListener('click', () => {
            showApiSettingsModal();
        });
    }

    // API Key Setup
    const saveApiKeyBtn = document.getElementById('save-api-key');
    const openaiKeyInput = document.getElementById('openai-key-input');

    if (saveApiKeyBtn) {
        saveApiKeyBtn.addEventListener('click', () => {
            authManager.saveApiKey();
        });
    }

    if (openaiKeyInput) {
        // Load existing key if available
        const existingKey = localStorage.getItem('openai_api_key');
        if (existingKey) {
            openaiKeyInput.value = existingKey;
        }
    }
});

// Email sign-in form function
function showEmailSignInForm() {
    const formDiv = document.createElement('div');
    formDiv.id = 'email-signin-form';
    formDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border: 2px solid var(--color-forest-green);
            border-radius: 8px;
            z-index: 1000;
            font-family: var(--font-courier);
            min-width: 300px;
        ">
            <h3 style="margin-bottom: 20px; color: var(--color-forest-green);">Sign In with Email</h3>
            <form id="email-form">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Email:</label>
                    <input type="email" id="email-input" required style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid var(--color-forest-green);
                        border-radius: 4px;
                        font-family: var(--font-courier);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">Password:</label>
                    <input type="password" id="password-input" required style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid var(--color-forest-green);
                        border-radius: 4px;
                        font-family: var(--font-courier);
                    ">
                </div>
                <div style="display: flex; gap: 10px; justify-content: space-between;">
                    <button type="submit" style="
                        background: var(--color-forest-green);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-family: var(--font-courier);
                        cursor: pointer;
                    ">Sign In</button>
                    <button type="button" onclick="showEmailSignUpForm()" style="
                        background: var(--color-gold);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-family: var(--font-courier);
                        cursor: pointer;
                    ">Sign Up</button>
                    <button type="button" onclick="closeEmailForm()" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-family: var(--font-courier);
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(formDiv);

    // Handle form submission
    document.getElementById('email-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('email-input').value;
        const password = document.getElementById('password-input').value;
        authManager.signInWithEmail(email, password);
        closeEmailForm();
    });
}

function showEmailSignUpForm() {
    closeEmailForm();
    const formDiv = document.createElement('div');
    formDiv.id = 'email-signup-form';
    formDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border: 2px solid var(--color-forest-green);
            border-radius: 8px;
            z-index: 1000;
            font-family: var(--font-courier);
            min-width: 300px;
        ">
            <h3 style="margin-bottom: 20px; color: var(--color-forest-green);">Create Account</h3>
            <form id="signup-form">
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Email:</label>
                    <input type="email" id="signup-email-input" required style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid var(--color-forest-green);
                        border-radius: 4px;
                        font-family: var(--font-courier);
                    ">
                </div>
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px;">Password:</label>
                    <input type="password" id="signup-password-input" required minlength="6" style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid var(--color-forest-green);
                        border-radius: 4px;
                        font-family: var(--font-courier);
                    ">
                </div>
                <div style="margin-bottom: 20px;">
                    <label style="display: block; margin-bottom: 5px;">Confirm Password:</label>
                    <input type="password" id="signup-confirm-password-input" required style="
                        width: 100%;
                        padding: 8px;
                        border: 1px solid var(--color-forest-green);
                        border-radius: 4px;
                        font-family: var(--font-courier);
                    ">
                </div>
                <div style="display: flex; gap: 10px; justify-content: space-between;">
                    <button type="submit" style="
                        background: var(--color-forest-green);
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-family: var(--font-courier);
                        cursor: pointer;
                    ">Create Account</button>
                    <button type="button" onclick="closeEmailForm()" style="
                        background: #666;
                        color: white;
                        border: none;
                        padding: 10px 20px;
                        border-radius: 4px;
                        font-family: var(--font-courier);
                        cursor: pointer;
                    ">Cancel</button>
                </div>
            </form>
        </div>
    `;
    document.body.appendChild(formDiv);

    // Handle form submission
    document.getElementById('signup-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const email = document.getElementById('signup-email-input').value;
        const password = document.getElementById('signup-password-input').value;
        const confirmPassword = document.getElementById('signup-confirm-password-input').value;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }
        
        authManager.signUpWithEmail(email, password);
        closeEmailForm();
    });
}

function closeEmailForm() {
    const signinForm = document.getElementById('email-signin-form');
    const signupForm = document.getElementById('email-signup-form');
    if (signinForm) signinForm.remove();
    if (signupForm) signupForm.remove();
}

function showApiSettingsModal() {
    const modalDiv = document.createElement('div');
    modalDiv.id = 'api-settings-modal';
    modalDiv.innerHTML = `
        <div style="
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 30px;
            border: 2px solid var(--color-forest-green);
            border-radius: 8px;
            z-index: 1000;
            font-family: var(--font-courier);
            min-width: 400px;
            max-width: 500px;
        ">
            <h3 style="margin-bottom: 20px; color: var(--color-forest-green);">API Settings</h3>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px; color: var(--color-forest-green);">OpenAI API Key</h4>
                <p style="margin-bottom: 10px; font-size: 14px; color: #666;">
                    For better voice quality, add your OpenAI API key:
                </p>
                <input type="password" id="openai-key-input" placeholder="sk-your-openai-api-key-here" 
                       style="width: 100%; padding: 8px; margin-bottom: 10px; border: 1px solid var(--color-forest-green); border-radius: 4px; font-family: var(--font-courier);">
                <button id="save-openai-key" style="
                    background: var(--color-forest-green);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-family: var(--font-courier);
                    cursor: pointer;
                    margin-right: 10px;
                ">Save OpenAI Key</button>
                <button id="test-openai-key" style="
                    background: var(--color-gold);
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    font-family: var(--font-courier);
                    cursor: pointer;
                ">Test Voice</button>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px; color: var(--color-forest-green);">Current Status</h4>
                <div id="api-status" style="padding: 10px; background: #f5f5f5; border-radius: 4px; font-size: 14px;">
                    Loading...
                </div>
            </div>
            
            <div style="margin-bottom: 20px;">
                <h4 style="margin-bottom: 10px; color: var(--color-forest-green);">Instructions</h4>
                <ul style="font-size: 14px; color: #666; margin: 0; padding-left: 20px;">
                    <li>Get your OpenAI API key from <a href="https://platform.openai.com/api-keys" target="_blank" style="color: var(--color-forest-green);">OpenAI Platform</a></li>
                    <li>For development: Add to <code>.env.local</code> file</li>
                    <li>For production: Add as environment variable in Vercel</li>
                </ul>
            </div>
            
            <div style="text-align: right;">
                <button onclick="closeApiSettingsModal()" style="
                    background: #666;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-family: var(--font-courier);
                    cursor: pointer;
                ">Close</button>
            </div>
        </div>
    `;
    document.body.appendChild(modalDiv);
    
    // Load existing key if available
    const openaiKeyInput = document.getElementById('openai-key-input');
    const existingKey = localStorage.getItem('openai_api_key');
    if (existingKey && openaiKeyInput) {
        openaiKeyInput.value = existingKey;
    }
    
    // Update status
    updateApiStatus();
    
    // Add event listeners
    const saveBtn = document.getElementById('save-openai-key');
    const testBtn = document.getElementById('test-openai-key');
    
    if (saveBtn) {
        saveBtn.addEventListener('click', () => {
            saveOpenAIKey();
        });
    }
    
    if (testBtn) {
        testBtn.addEventListener('click', () => {
            testOpenAIVoice();
        });
    }
}

function closeApiSettingsModal() {
    const modal = document.getElementById('api-settings-modal');
    if (modal) {
        modal.remove();
    }
}

function saveOpenAIKey() {
    const openaiKeyInput = document.getElementById('openai-key-input');
    const saveBtn = document.getElementById('save-openai-key');
    
    if (!openaiKeyInput) return;
    
    const apiKey = openaiKeyInput.value.trim();
    
    if (!apiKey) {
        alert('Please enter your OpenAI API key');
        return;
    }
    
    // Save to localStorage
    localStorage.setItem('openai_api_key', apiKey);
    
    // Update config
    if (typeof setApiKey === 'function') {
        setApiKey('openai', apiKey);
    }
    
    // Update button text
    if (saveBtn) {
        saveBtn.textContent = '✓ Saved!';
        saveBtn.style.background = '#28a745';
        
        setTimeout(() => {
            saveBtn.textContent = 'Save OpenAI Key';
            saveBtn.style.background = 'var(--color-forest-green)';
        }, 2000);
    }
    
    // Update status
    updateApiStatus();
    
    console.log('OpenAI API key saved successfully');
}

function testOpenAIVoice() {
    const testBtn = document.getElementById('test-openai-key');
    
    if (testBtn) {
        testBtn.textContent = 'Testing...';
        testBtn.disabled = true;
    }
    
    // Test the voice by triggering a conversation
    if (typeof conversationManager !== 'undefined') {
        conversationManager.handleUserInput('This is a test of the OpenAI voice system.');
    } else {
        alert('Conversation manager not available. Please try again.');
    }
    
    if (testBtn) {
        setTimeout(() => {
            testBtn.textContent = 'Test Voice';
            testBtn.disabled = false;
        }, 3000);
    }
}

function updateApiStatus() {
    const statusDiv = document.getElementById('api-status');
    if (!statusDiv) return;
    
    const openaiKey = config.openai.apiKey;
    const hasOpenAI = openaiKey && openaiKey.trim() !== '';
    
    let statusHTML = '';
    
    if (hasOpenAI) {
        statusHTML = `
            <div style="color: #28a745;">✓ OpenAI API Key: Configured</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
                Voice quality: High (OpenAI TTS)
            </div>
        `;
    } else {
        statusHTML = `
            <div style="color: #d32f2f;">✗ OpenAI API Key: Not configured</div>
            <div style="font-size: 12px; color: #666; margin-top: 5px;">
                Voice quality: Basic (Browser speech synthesis)
            </div>
        `;
    }
    
    statusDiv.innerHTML = statusHTML;
} 