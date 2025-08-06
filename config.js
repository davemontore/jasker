// Jasker Configuration
// This file contains all the configuration settings for the app

const config = {
    // Firebase Configuration
    // You'll need to replace these with your actual Firebase project credentials
    firebase: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_FIREBASE_AUTH_DOMAIN",
        projectId: "YOUR_FIREBASE_PROJECT_ID",
        storageBucket: "YOUR_FIREBASE_STORAGE_BUCKET",
        messagingSenderId: "YOUR_FIREBASE_MESSAGING_SENDER_ID",
        appId: "YOUR_FIREBASE_APP_ID"
    },
    
    // OpenAI Configuration
    openai: {
        apiKey: "YOUR_OPENAI_API_KEY",
        model: "gpt-4",
        voiceModel: "tts-1", // For text-to-speech
        maxTokens: 2000
    },
    
    // AssemblyAI Configuration
    assemblyAI: {
        apiKey: "YOUR_ASSEMBLYAI_API_KEY"
    },
    
    // App Settings
    app: {
        name: "Jasker",
        version: "1.0.0",
        maxMessageLength: 4000,
        voiceTimeout: 30000, // 30 seconds max recording
        autoSaveInterval: 5000 // Save conversation every 5 seconds
    },
    
    // Jasker AI Persona Settings
    jasker: {
        name: "Jasker",
        persona: "medieval_bard",
        welcomeMessage: "Welcome to Jasker, noble friend! I am your personal bard, here to help you uncover the hero within and craft the epic tales of your journey. To begin our quest, simply start speaking of your career - your last assignment, your responsibilities, the size of your team... whatever comes to mind. Worry not about perfection, for every great story begins with a single word. Let us begin our tale!",
        returnMessage: "Ah, welcome back, brave soul! What new chapter of your story shall we explore today?",
        voiceEnabled: true,
        textEnabled: true
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = config;
} 