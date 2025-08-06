// Jasker Configuration
// This file contains all the configuration settings for the app

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