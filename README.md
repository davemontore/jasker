# Jasker - Your Personal Bard

An AI-powered conversational coach that helps military service members discover their accomplishments, craft them into powerful resume bullets and interview stories, and learn the art of effective storytelling.

## 🎭 The Vision

Jasker is your personal medieval bard - an inquisitive and curious companion who excels at helping you uncover the hero within, so that you may tell stories and write songs about your achievements for years to come!

## 🏗️ Project Structure

```
Jasker/
├── index.html          # Main HTML file with the app interface
├── styles.css          # Elegant old men's club aesthetic styling
├── config.js           # Configuration for Firebase, OpenAI, AssemblyAI
├── auth.js             # Authentication module (Firebase Auth)
├── conversation.js     # Voice/text conversation with Jasker
├── library.js          # Library management (stories, bullets, threads)
├── app.js              # Main application coordinator
└── README.md           # This file
```

## 🎨 Design Philosophy

- **Elegant Old Men's Club Aesthetic**: Creme background, black Courier-style fonts, forest green accents
- **Voice-First Experience**: Primary interaction through voice, with text as backup
- **Medieval Bard Persona**: Jasker speaks like a wise, curious bard helping uncover heroic tales
- **Organized Knowledge**: Stories as books, resume bullets as magazines, contextual threads as library tables

## 🚀 Getting Started

### Prerequisites

1. **Firebase Account**: For authentication and data storage
2. **OpenAI API Key**: For conversational AI (you're already verified!)
3. **AssemblyAI API Key**: For high-accuracy speech transcription
4. **GitHub Account**: For version control
5. **Vercel Account**: For deployment

### Step 1: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project called "Jasker"
3. Enable Authentication with these providers:
   - Google Sign-In
   - Apple Sign-In (requires Apple Developer account)
   - Microsoft Sign-In
   - Email/Password
4. Create a Firestore database (not Realtime Database)
5. Get your Firebase config:
   - Click on Project Settings (gear icon)
   - Scroll down to "Your apps"
   - Click "Add app" → Web
   - Copy the config object

### Step 2: Update Configuration

Open `config.js` and replace the placeholder values:

```javascript
firebase: {
    apiKey: "your-actual-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "your-app-id"
},
openai: {
    apiKey: "your-openai-api-key",
    // ... other settings
},
assemblyAI: {
    apiKey: "your-assemblyai-api-key"
}
```

### Step 3: GitHub Setup

1. **Initialize Git Repository**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Jasker app structure"
   ```

2. **Connect to GitHub**:
   - Go to your GitHub repository
   - Follow the instructions to push your local repo

3. **Basic Git Commands** (you'll use these often):
   ```bash
   git add .                    # Stage all changes
   git commit -m "Description"  # Commit changes
   git push                     # Push to GitHub
   git pull                     # Pull latest changes
   ```

### Step 4: Local Testing

1. **Simple Local Server**:
   - Install a simple HTTP server: `npm install -g http-server`
   - Run: `http-server` in your project folder
   - Open: `http://localhost:8080`

2. **Or use Python** (if you have it):
   ```bash
   python -m http.server 8000
   ```

### Step 5: Vercel Deployment

1. Go to [Vercel](https://vercel.com/)
2. Sign up with your GitHub account
3. Click "New Project"
4. Import your Jasker repository
5. Deploy!

## 🎤 Voice Features

The app currently uses:
- **Browser Speech Recognition**: For immediate voice input
- **Browser Speech Synthesis**: For Jasker's voice responses

**Next Steps for Enhanced Voice**:
- Integrate AssemblyAI for better transcription
- Use OpenAI's TTS for more natural Jasker voice
- Add voice activity detection for better UX

## 🔧 Current Features

### ✅ Implemented
- [x] Elegant UI with old men's club aesthetic
- [x] Firebase authentication (Google, Apple, Microsoft, Email)
- [x] Voice recording and transcription
- [x] Text input as backup
- [x] Jasker's medieval bard responses
- [x] Library organization (stories, bullets, threads)
- [x] Local storage for data persistence
- [x] Responsive design for mobile
- [x] Keyboard shortcuts

### 🚧 Next Steps
- [ ] Firebase Firestore integration
- [ ] OpenAI GPT-4 integration for intelligent responses
- [ ] AssemblyAI integration for better transcription
- [ ] AI-powered story extraction and organization
- [ ] Export functionality for resume bullets
- [ ] Advanced voice features

## 🎯 How to Use

1. **Sign In**: Use any of the authentication methods
2. **The Lounge**: Start a conversation with Jasker
   - Hold the microphone button to speak
   - Or type your thoughts
   - Jasker will respond with bard-like wisdom
3. **The Library**: View your organized content
   - **Core Stories**: Your epic tales as books
   - **Resume Bullets**: Quantifiable achievements as magazines
   - **Contextual Threads**: Background information on tables

## 🎭 Jasker's Persona

Jasker speaks like a medieval bard:
- **Appreciative & Affirming**: Validates your experiences
- **Curious & Inquisitive**: Asks open-ended questions
- **Patient & Methodical**: Never rushes, comfortable with pauses
- **Focused on Quantifiables**: Guides toward concrete outcomes

## 🔑 Keyboard Shortcuts

- `Ctrl/Cmd + Enter`: Send message
- `Ctrl/Cmd + L`: Go to Lounge
- `Ctrl/Cmd + B`: Go to Library
- `Space` (when voice button focused): Start/stop recording

## 🛠️ Development Notes

### File Organization
- **Modular Design**: Each major feature is in its own file
- **Event-Driven**: Uses event listeners for user interactions
- **Error Handling**: Comprehensive error handling throughout
- **Responsive**: Works on desktop and mobile

### Browser Compatibility
- **Speech Recognition**: Chrome, Edge, Safari (limited)
- **Speech Synthesis**: Most modern browsers
- **Local Storage**: All modern browsers

## 🚀 Deployment Checklist

Before deploying to production:

1. **Update API Keys**: Replace all placeholder API keys in `config.js`
2. **Firebase Rules**: Set up proper Firestore security rules
3. **Domain Setup**: Configure custom domain in Vercel
4. **SSL Certificate**: Vercel provides this automatically
5. **Environment Variables**: Consider using Vercel's env vars for API keys

## 🎯 Future Enhancements

- **Job Description Analysis**: Upload job descriptions for targeted story recommendations
- **Storytelling Practice**: Practice telling stories with AI feedback
- **Advanced AI Integration**: More sophisticated conversation analysis
- **Mobile App**: Native iOS/Android apps
- **Offline Support**: Service worker for offline functionality

## 🤝 Contributing

Since you're new to programming, here's how to make changes:

1. **Make Small Changes**: Edit one file at a time
2. **Test Locally**: Always test before committing
3. **Commit Often**: Small, frequent commits are better than big ones
4. **Ask Questions**: Don't hesitate to ask about any part you don't understand

## 📞 Support

If you run into issues:
1. Check the browser console for error messages
2. Verify all API keys are correct
3. Ensure Firebase is properly configured
4. Test with a different browser

---

**Remember**: Jasker is designed to be your trusted companion in uncovering the hero within. Every conversation is a step toward crafting your epic tale! 🎭✨ 