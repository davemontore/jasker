// Jasker Authentication Module
// Handles user authentication using Firebase Auth

class AuthManager {
    constructor() {
        this.auth = null;
        this.currentUser = null;
        this.authStateListeners = [];
        this.init();
    }

    async init() {
        try {
            // Initialize Firebase
            firebase.initializeApp(config.firebase);
            this.auth = firebase.auth();
            
            // Set up authentication state listener
            this.auth.onAuthStateChanged((user) => {
                this.currentUser = user;
                this.handleAuthStateChange(user);
            });

            // Set up authentication providers
            this.setupProviders();
            
            console.log('Authentication initialized successfully');
        } catch (error) {
            console.error('Failed to initialize authentication:', error);
            this.showError('Authentication initialization failed. Please refresh the page.');
        }
    }

    setupProviders() {
        // Google Sign-In
        this.googleProvider = new firebase.auth.GoogleAuthProvider();
        this.googleProvider.addScope('email');
        this.googleProvider.addScope('profile');

        // Apple Sign-In (requires additional setup in Firebase console)
        this.appleProvider = new firebase.auth.OAuthProvider('apple.com');
        this.appleProvider.addScope('email');
        this.appleProvider.addScope('name');

        // Microsoft Sign-In
        this.microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
        this.microsoftProvider.addScope('email');
        this.microsoftProvider.addScope('profile');
    }

    async signInWithGoogle() {
        try {
            this.showLoading('Signing in with Google...');
            const result = await this.auth.signInWithPopup(this.googleProvider);
            console.log('Google sign-in successful:', result.user.email);
        } catch (error) {
            console.error('Google sign-in failed:', error);
            this.showError('Google sign-in failed. Please try again.');
        }
    }

    async signInWithApple() {
        try {
            this.showLoading('Signing in with Apple...');
            const result = await this.auth.signInWithPopup(this.appleProvider);
            console.log('Apple sign-in successful:', result.user.email);
        } catch (error) {
            console.error('Apple sign-in failed:', error);
            this.showError('Apple sign-in failed. Please try again.');
        }
    }

    async signInWithMicrosoft() {
        try {
            this.showLoading('Signing in with Microsoft...');
            const result = await this.auth.signInWithPopup(this.microsoftProvider);
            console.log('Microsoft sign-in successful:', result.user.email);
        } catch (error) {
            console.error('Microsoft sign-in failed:', error);
            this.showError('Microsoft sign-in failed. Please try again.');
        }
    }

    async signInWithEmail(email, password) {
        try {
            this.showLoading('Signing in...');
            const result = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Email sign-in successful:', result.user.email);
        } catch (error) {
            console.error('Email sign-in failed:', error);
            this.showError('Email sign-in failed. Please check your credentials.');
        }
    }

    async signUpWithEmail(email, password) {
        try {
            this.showLoading('Creating account...');
            const result = await this.auth.createUserWithEmailAndPassword(email, password);
            console.log('Account creation successful:', result.user.email);
        } catch (error) {
            console.error('Account creation failed:', error);
            this.showError('Account creation failed. Please try again.');
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
        if (user) {
            // User is signed in
            console.log('User signed in:', user.email);
            this.showMainApp();
            this.updateUserInfo(user);
        } else {
            // User is signed out
            console.log('User signed out');
            this.showAuthScreen();
        }

        // Notify listeners
        this.authStateListeners.forEach(listener => listener(user));
    }

    showMainApp() {
        document.getElementById('auth-screen').classList.remove('active');
        document.getElementById('main-app').classList.add('active');
    }

    showAuthScreen() {
        document.getElementById('main-app').classList.remove('active');
        document.getElementById('auth-screen').classList.add('active');
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
}

// Initialize authentication manager
const authManager = new AuthManager();

// Set up event listeners for authentication buttons
document.addEventListener('DOMContentLoaded', () => {
    // Google Sign-In
    const googleBtn = document.getElementById('google-signin');
    if (googleBtn) {
        googleBtn.addEventListener('click', () => authManager.signInWithGoogle());
    }

    // Apple Sign-In
    const appleBtn = document.getElementById('apple-signin');
    if (appleBtn) {
        appleBtn.addEventListener('click', () => authManager.signInWithApple());
    }

    // Microsoft Sign-In
    const microsoftBtn = document.getElementById('microsoft-signin');
    if (microsoftBtn) {
        microsoftBtn.addEventListener('click', () => authManager.signInWithMicrosoft());
    }

    // Email Sign-In (placeholder for now)
    const emailBtn = document.getElementById('email-signin');
    if (emailBtn) {
        emailBtn.addEventListener('click', () => {
            // For now, show a simple prompt
            const email = prompt('Enter your email:');
            const password = prompt('Enter your password:');
            if (email && password) {
                authManager.signInWithEmail(email, password);
            }
        });
    }

    // Sign Out
    const signoutBtn = document.getElementById('signout-btn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', () => authManager.signOut());
    }
}); 