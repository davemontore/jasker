// Jasker Configuration
// Centralized configuration for the Jasker application

const config = {
    // Firebase Configuration
    firebase: {
        apiKey: "AIzaSyBSheMk79-CssbP-GIzvRw-nMifWZZT4cE",
        authDomain: "jasker-3568c.firebaseapp.com",
        projectId: "jasker-3568c",
        storageBucket: "jasker-3568c.firebasestorage.app",
        messagingSenderId: "268015491598",
        appId: "1:268015491598:web:6e5cbe76369baebb8e7a5f"
    },

    // OpenAI Configuration - Load from environment or secure config
    openai: {
        apiKey: null, // Will be loaded from secure config
        model: "gpt-5",
        maxTokens: 1000
    },

    // AssemblyAI Configuration - Load from environment or secure config
    assemblyai: {
        apiKey: null // Will be loaded from secure config
    },

    // Jasker AI Persona - Competent, Inquisitive Detective
    jasker: {
        name: "Jasker",
        persona: "competent-detective",
        voiceEnabled: true,
        voiceProvider: "openai", // "browser" or "openai"
        openaiVoice: {
            model: "tts-1", // "tts-1" or "tts-1-hd" for higher quality
            voice: "nova", // "alloy", "echo", "fable", "onyx", "nova", "shimmer" - nova is female
            speed: 1.0, // 0.25 to 4.0
            format: "mp3" // "mp3", "opus", "aac", "flac"
        },
        browserVoice: {
            rate: 0.85,
            pitch: 1.2, // Slightly higher pitch for female voice
            volume: 0.9,
            voicePreference: "female-natural" // Changed to female preference
        },
        welcomeMessage: "Welcome to Jasker. I'm here to help you uncover and organize your professional story. I'll be asking you questions to help clarify your experiences and build a comprehensive picture of your career. To get started, just go ahead and start talking about your career. You can begin with your last assignment, what your responsibilities were, how big or small your team was... whatever comes to mind. Don't worry about getting it perfect. Let's just get the ball rolling.",
        personality: {
            tone: "appreciative-and-challenging",
            approach: "methodical-inquiry",
            style: "collaborative-exploration",
            focus: "temporal-spatial-mapping"
        },
        responseStyle: {
            appreciative: "That sounds like a significant responsibility. What specifically made it challenging?",
            inquisitive: "I want to understand this better. Can you give me a more specific example?",
            methodical: "Let me place this in context. When did this take place and where were you stationed?",
            challenging: "You mentioned 'a lot' of things. Can you give me a sense of what 'a lot' means?",
            collaborative: "I have several questions about this. Would you prefer to start with the timeline, your responsibilities, or what made this experience significant?"
        }
    },

    // App Settings
    app: {
        name: "Jasker",
        description: "Your Personal Career Story Detective",
        autoSaveInterval: 30000, // 30 seconds
        maxConversationHistory: 1000
    }
};

// Load API keys from secure sources
function loadSecureConfig() {
    // Try to load from environment variables (for production and development)
    if (typeof process !== 'undefined' && process.env) {
        if (process.env.OPENAI_API_KEY) {
            config.openai.apiKey = process.env.OPENAI_API_KEY;
            console.log('Loaded OpenAI API key from environment variables');
        }
        if (process.env.ASSEMBLYAI_API_KEY) {
            config.assemblyai.apiKey = process.env.ASSEMBLYAI_API_KEY;
            console.log('Loaded AssemblyAI API key from environment variables');
        }
    }
    
    // Try to load from localStorage (for development)
    try {
        const storedOpenAIKey = localStorage.getItem('openai_api_key');
        const storedAssemblyAIKey = localStorage.getItem('assemblyai_api_key');
        
        if (storedOpenAIKey && !config.openai.apiKey) {
            config.openai.apiKey = storedOpenAIKey;
            console.log('Loaded OpenAI API key from localStorage');
        }
        if (storedAssemblyAIKey && !config.assemblyai.apiKey) {
            config.assemblyai.apiKey = storedAssemblyAIKey;
            console.log('Loaded AssemblyAI API key from localStorage');
        }
    } catch (error) {
        console.warn('Could not load API keys from localStorage:', error);
    }
    
    // Try to load from a separate config file (if it exists)
    // This file should be in .gitignore
    try {
        const secureConfig = window.secureConfig || {};
        if (secureConfig.openaiApiKey && !config.openai.apiKey) {
            config.openai.apiKey = secureConfig.openaiApiKey;
            console.log('Loaded OpenAI API key from secure config file');
        }
        if (secureConfig.assemblyaiApiKey && !config.assemblyai.apiKey) {
            config.assemblyai.apiKey = secureConfig.assemblyaiApiKey;
            console.log('Loaded AssemblyAI API key from secure config file');
        }
    } catch (error) {
        console.warn('Could not load secure config:', error);
    }
    
    // Log the final status
    console.log('API Key Status:');
    console.log('- OpenAI:', config.openai.apiKey ? '✓ Configured' : '✗ Not configured');
    console.log('- AssemblyAI:', config.assemblyai.apiKey ? '✓ Configured' : '✗ Not configured');
}

// Function to set API keys securely
function setApiKey(service, key) {
    if (service === 'openai') {
        config.openai.apiKey = key;
        localStorage.setItem('openai_api_key', key);
    } else if (service === 'assemblyai') {
        config.assemblyai.apiKey = key;
        localStorage.setItem('assemblyai_api_key', key);
    }
}

// Function to check if API keys are configured
function hasApiKey(service) {
    if (service === 'openai') {
        return config.openai.apiKey && config.openai.apiKey.trim() !== '';
    } else if (service === 'assemblyai') {
        return config.assemblyai.apiKey && config.assemblyai.apiKey.trim() !== '';
    }
    return false;
}

// Load secure config when this file is loaded
loadSecureConfig();

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 