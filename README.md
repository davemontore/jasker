# Jasker - Your Personal Career Detective

Jasker is an AI-powered conversational assistant designed specifically for U.S. military service members transitioning to civilian life. Think of Jasker as your personal career detective - someone who helps you uncover, organize, and articulate your professional accomplishments and experiences.

## Vision

Jasker serves as a skilled investigator who:
- **Uncovers** your hidden accomplishments through thoughtful conversation
- **Organizes** your experiences into structured, resume-ready content
- **Articulates** your military experience in civilian-friendly language
- **Connects** patterns across your career to reveal your unique value proposition

## Core Features

### 🎤 The Lounge (Conversation Interface)
- **Voice-first interaction** with natural speech recognition
- **Text input** as an alternative option
- **Real-time transcription** and response
- **Natural, human-like voice** responses from Jasker

### 📚 The Library (Content Repository)
- **Core Stories**: Significant events and experiences (like books on a shelf)
- **Resume Bullets**: Quantifiable achievements (like magazines)
- **Contextual Threads**: Supporting details and connections (like notes on tables)

### 🔍 AI-Powered Analysis
- **Intelligent tagging** and categorization
- **Pattern recognition** across your experiences
- **Quantifiable extraction** from your stories
- **Civilian translation** of military terminology

## Jasker's Persona: The Competent Detective

Jasker embodies the qualities of a skilled investigator:
- **Appreciative & Affirming**: Validates your experiences and accomplishments
- **Curious & Inquisitive**: Asks thoughtful follow-up questions
- **Patient & Methodical**: Takes time to understand the full picture
- **Focused on Quantifiables**: Always seeks concrete outcomes and measurable results

## Technical Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Voice Processing**: Web Speech API (with future AssemblyAI integration)
- **AI Processing**: OpenAI GPT-4 (planned)
- **Backend**: Firebase (Authentication & Firestore)
- **Deployment**: Vercel (planned)

## Getting Started

1. **Clone the repository**
2. **Set up Firebase** (see Firebase Setup section)
3. **Configure API keys** in `config.js`
4. **Start the development server**: `python -m http.server 8000`
5. **Open**: `http://localhost:8000`

## Current Features

✅ **Authentication System**
- Google Sign-in
- Email/Password authentication
- Secure user sessions

✅ **Voice Interface**
- Real-time speech recognition
- Natural voice synthesis
- Hold-to-speak functionality

✅ **Conversation Management**
- Message history
- Local storage (testing only; persistence will use Firebase Firestore)
- Auto-save functionality

✅ **Responsive Design**
- Mobile-friendly interface
- Elegant "old men's club" aesthetic
- Professional color scheme

## Next Steps

🔄 **In Progress**
- Firebase Firestore integration
- Enhanced voice quality
- Improved AI responses

📋 **Planned**
- OpenAI GPT-4 integration
- AssemblyAI transcription
- Export functionality
- Advanced voice features
- Vercel deployment

## Development Notes

- **Voice Quality**: Currently using Web Speech API with natural voice selection
- **AI Responses**: Simple keyword-based system (GPT-4 integration planned)
- **Data Storage**: Local storage (testing only); Firebase Firestore integration in progress for persistence
- **Browser Support**: Chrome/Edge recommended for best voice experience

## Contributing

This is a personal project focused on helping military veterans. Contributions are welcome, especially around:
- Voice quality improvements
- AI response enhancement
- Military-to-civilian translation
- User experience optimization 