// Jasker Main Application
// Coordinates all modules and handles the overall application flow

class JaskerApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {
            auth: null,
            conversation: null,
            library: null
        };
        this.init();
    }

    async init() {
        try {
            console.log('Initializing Jasker...');
            
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupApp());
            } else {
                this.setupApp();
            }
            
        } catch (error) {
            console.error('Failed to initialize Jasker app:', error);
            this.showError('Failed to initialize the application. Please refresh the page.');
        }
    }

    setupApp() {
        // Initialize modules
        this.modules.auth = authManager;
        this.modules.conversation = conversationManager;
        this.modules.library = libraryManager;

        // Set up authentication state listener
        this.modules.auth.onAuthStateChanged((user) => {
            this.handleAuthStateChange(user);
        });

        // Set up global error handling
        this.setupErrorHandling();

        // Set up keyboard shortcuts
        this.setupKeyboardShortcuts();

        // Set up service worker for offline support (future enhancement)
        this.setupServiceWorker();

        this.isInitialized = true;
        console.log('Jasker initialized successfully');
    }

    handleAuthStateChange(user) {
        if (user) {
            // User is signed in
            console.log('User authenticated:', user.email);
            this.onUserAuthenticated(user);
        } else {
            // User is signed out
            console.log('User signed out');
            this.onUserSignedOut();
        }
    }

    onUserAuthenticated(user) {
        // Load user-specific data
        this.loadUserData(user);
        
        // Show welcome message if it's a new user
        this.checkIfNewUser(user);
        
        // Set up auto-save
        this.setupAutoSave();
    }

    onUserSignedOut() {
        // Clear sensitive data
        this.clearUserData();
        
        // Stop auto-save
        this.stopAutoSave();
    }

    async loadUserData(user) {
        try {
            // Load conversation history from Firebase
            await this.modules.conversation.loadFromFirebase(user.uid);
            
            // Load library data from Firebase
            await this.modules.library.loadFromFirebase(user.uid);
            
            console.log('User data loaded successfully');
        } catch (error) {
            console.error('Error loading user data:', error);
            // Continue with local data if Firebase fails
        }
    }

    clearUserData() {
        // Clear conversation history
        this.modules.conversation.clearConversation();
        
        // Clear library data
        this.modules.library.clearLibrary();
        
        console.log('User data cleared');
    }

    checkIfNewUser(user) {
        // Check if this is the user's first time
        const isNewUser = !localStorage.getItem(`jasker_user_${user.uid}_visited`);
        
        if (isNewUser) {
            localStorage.setItem(`jasker_user_${user.uid}_visited`, 'true');
            this.showWelcomeMessage();
        }
    }

    showWelcomeMessage() {
        // Show a welcome message for new users
        const welcomeDiv = document.createElement('div');
        welcomeDiv.id = 'welcome-message';
        welcomeDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: white;
                padding: 30px;
                border: 3px solid var(--color-forest-green);
                border-radius: 8px;
                z-index: 1000;
                max-width: 500px;
                text-align: center;
                font-family: var(--font-courier);
            ">
                <h3 style="color: var(--color-forest-green); margin-bottom: 20px;">Welcome to Jasker!</h3>
                <p style="margin-bottom: 15px;">I am your personal bard, ready to help you uncover the hero within and craft the epic tales of your journey.</p>
                <p style="margin-bottom: 20px;">Start by visiting <strong>The Lounge</strong> to begin our conversation, or explore <strong>The Library</strong> to see how your stories will be organized.</p>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: var(--color-forest-green);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 4px;
                    font-family: var(--font-courier);
                    cursor: pointer;
                    font-weight: 600;
                ">Begin Your Journey</button>
            </div>
        `;
        document.body.appendChild(welcomeDiv);
    }

    setupAutoSave() {
        // Auto-save conversation and library data every 30 seconds
        this.autoSaveInterval = setInterval(() => {
            if (this.modules.auth.isAuthenticated()) {
                this.modules.conversation.saveConversation();
                this.modules.library.saveLibraryData();
            }
        }, 30000); // 30 seconds
    }

    stopAutoSave() {
        if (this.autoSaveInterval) {
            clearInterval(this.autoSaveInterval);
            this.autoSaveInterval = null;
        }
    }

    setupErrorHandling() {
        // Global error handler
        window.addEventListener('error', (event) => {
            console.error('Global error:', event.error);
            this.showError('An unexpected error occurred. Please try refreshing the page.');
        });

        // Unhandled promise rejection handler
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.showError('An error occurred while processing your request. Please try again.');
        });
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (event) => {
            // Ctrl/Cmd + Enter to send message
            if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                const textInput = document.getElementById('text-input');
                if (textInput && document.activeElement === textInput) {
                    event.preventDefault();
                    this.modules.conversation.handleTextInput();
                }
            }

            // Ctrl/Cmd + L to focus on Lounge
            if ((event.ctrlKey || event.metaKey) && event.key === 'l') {
                event.preventDefault();
                this.modules.library.showLounge();
            }

            // Ctrl/Cmd + B to focus on Library
            if ((event.ctrlKey || event.metaKey) && event.key === 'b') {
                event.preventDefault();
                this.modules.library.showLibrary();
            }

            // Space to start/stop voice recording (when voice button is focused)
            if (event.key === ' ' && event.target.id === 'voice-btn') {
                event.preventDefault();
                if (this.modules.conversation.isRecording) {
                    this.modules.conversation.stopRecording();
                } else {
                    this.modules.conversation.startRecording();
                }
            }
        });
    }

    setupServiceWorker() {
        // Register service worker for offline support (future enhancement)
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('Service Worker registered:', registration);
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    }

    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'app-error';
        errorDiv.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #d32f2f;
                color: white;
                padding: 15px 20px;
                border-radius: 4px;
                z-index: 1000;
                font-family: var(--font-courier);
                max-width: 300px;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
            ">
                <div style="margin-bottom: 10px; font-weight: 700;">⚠️ Error</div>
                <div style="margin-bottom: 15px;">${message}</div>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: rgba(255, 255, 255, 0.2);
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-family: var(--font-courier);
                    cursor: pointer;
                ">Dismiss</button>
            </div>
        `;
        document.body.appendChild(errorDiv);

        // Auto-remove after 10 seconds
        setTimeout(() => {
            const error = document.getElementById('app-error');
            if (error) {
                error.remove();
            }
        }, 10000);
    }

    // Public API methods
    getAuthManager() {
        return this.modules.auth;
    }

    getConversationManager() {
        return this.modules.conversation;
    }

    getLibraryManager() {
        return this.modules.library;
    }

    // Utility methods
    isReady() {
        return this.isInitialized;
    }

    getVersion() {
        return config.app.version;
    }
}

// Initialize the main application
const jaskerApp = new JaskerApp();

// Make app available globally for debugging
window.jaskerApp = jaskerApp;

// Add some helpful console messages
console.log(`
🎭 Welcome to Jasker v${config.app.version}!
🎤 Your personal bard is ready to help you tell your story.
📚 Visit The Lounge to begin your conversation.
📖 Check The Library to see your organized content.
`);

// Add a simple loading indicator
document.addEventListener('DOMContentLoaded', () => {
    // Remove any loading indicators
    const loadingElements = document.querySelectorAll('.loading');
    loadingElements.forEach(element => element.remove());
}); 