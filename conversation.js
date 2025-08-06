// Jasker Conversation Module
// Handles voice recording, transcription, and AI conversation

class ConversationManager {
    constructor() {
        this.isRecording = false;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.conversationHistory = [];
        this.currentSession = null;
        this.recognition = null;
        this.synthesis = null;
        this.init();
    }

    init() {
        this.setupSpeechRecognition();
        this.setupSpeechSynthesis();
        this.setupEventListeners();
        this.loadConversationHistory();
    }

    setupSpeechRecognition() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            
            this.recognition.continuous = true;
            this.recognition.interimResults = true;
            this.recognition.lang = 'en-US';
            
            this.recognition.onstart = () => {
                console.log('Speech recognition started');
                this.updateVoiceStatus('Listening...');
            };
            
            this.recognition.onresult = (event) => {
                let finalTranscript = '';
                let interimTranscript = '';
                
                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }
                
                if (finalTranscript) {
                    this.handleUserInput(finalTranscript);
                }
                
                this.updateVoiceStatus(interimTranscript || 'Listening...');
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceStatus('Error: ' + event.error);
                this.stopRecording();
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.updateVoiceStatus('Click to speak');
                this.stopRecording();
            };
        } else {
            console.warn('Speech recognition not supported in this browser');
        }
    }

    setupSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    }

    setupEventListeners() {
        const voiceBtn = document.getElementById('voice-btn');
        const textInput = document.getElementById('text-input');
        const sendBtn = document.getElementById('send-btn');

        if (voiceBtn) {
            voiceBtn.addEventListener('mousedown', () => this.startRecording());
            voiceBtn.addEventListener('mouseup', () => this.stopRecording());
            voiceBtn.addEventListener('mouseleave', () => this.stopRecording());
            
            // Touch events for mobile
            voiceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startRecording();
            });
            voiceBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopRecording();
            });
        }

        if (textInput) {
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.handleTextInput();
                }
            });
        }

        if (sendBtn) {
            sendBtn.addEventListener('click', () => this.handleTextInput());
        }
    }

    startRecording() {
        if (this.isRecording) return;
        
        this.isRecording = true;
        this.audioChunks = [];
        
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.classList.add('recording');
        }
        
        this.updateVoiceStatus('Recording...');
        
        // Start speech recognition
        if (this.recognition) {
            this.recognition.start();
        }
        
        // Also start media recording for backup
        this.startMediaRecording();
    }

    stopRecording() {
        if (!this.isRecording) return;
        
        this.isRecording = false;
        
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            voiceBtn.classList.remove('recording');
        }
        
        this.updateVoiceStatus('Processing...');
        
        // Stop speech recognition
        if (this.recognition) {
            this.recognition.stop();
        }
        
        // Stop media recording
        this.stopMediaRecording();
    }

    startMediaRecording() {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                this.mediaRecorder = new MediaRecorder(stream);
                this.audioChunks = [];
                
                this.mediaRecorder.ondataavailable = (event) => {
                    this.audioChunks.push(event.data);
                };
                
                this.mediaRecorder.onstop = () => {
                    // For now, we'll use the speech recognition results
                    // In the future, we can send audio to AssemblyAI for better transcription
                    console.log('Media recording stopped');
                };
                
                this.mediaRecorder.start();
            })
            .catch(error => {
                console.error('Error accessing microphone:', error);
            });
    }

    stopMediaRecording() {
        if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
            this.mediaRecorder.stop();
            this.mediaRecorder.stream.getTracks().forEach(track => track.stop());
        }
    }

    updateVoiceStatus(status) {
        const statusElement = document.getElementById('voice-status');
        if (statusElement) {
            statusElement.textContent = status;
        }
    }

    handleTextInput() {
        const textInput = document.getElementById('text-input');
        if (textInput && textInput.value.trim()) {
            this.handleUserInput(textInput.value.trim());
            textInput.value = '';
        }
    }

    async handleUserInput(input) {
        if (!input.trim()) return;
        
        // Add user message to conversation
        this.addMessage('user', input);
        
        // Show typing indicator
        this.showTypingIndicator();
        
        try {
            // Get AI response
            const response = await this.getAIResponse(input);
            
            // Hide typing indicator
            this.hideTypingIndicator();
            
            // Add AI response to conversation
            this.addMessage('jasker', response);
            
            // Speak the response if voice is enabled
            if (config.jasker.voiceEnabled) {
                this.speakResponse(response);
            }
            
            // Save conversation
            this.saveConversation();
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.hideTypingIndicator();
            this.addMessage('jasker', 'I apologize, but I seem to have lost my voice for a moment. Could you try again?');
        }
    }

    async getAIResponse(userInput) {
        // For now, we'll use a simple response system
        // In the future, this will integrate with OpenAI GPT-4
        
        const responses = [
            "Ah, what a fascinating tale you weave! Tell me more about that experience - what challenges did you face, and how did you overcome them?",
            "Your story speaks of great courage and wisdom. I sense there's more to this chapter - what was the outcome of your actions?",
            "A truly remarkable journey you describe! I'm curious about the people involved - who were your companions in this adventure?",
            "Your words paint a vivid picture of leadership and determination. What lessons did you learn from this experience?",
            "Such a compelling narrative! I wonder, what was the most significant moment in this story for you?"
        ];
        
        // Simple keyword-based responses for now
        if (userInput.toLowerCase().includes('team') || userInput.toLowerCase().includes('squad')) {
            return "Ah, the bonds of comradeship! Tell me about your team - how many were under your command, and what was your role in leading them?";
        } else if (userInput.toLowerCase().includes('mission') || userInput.toLowerCase().includes('deployment')) {
            return "A mission of great importance! What was the objective, and what obstacles did you encounter along the way?";
        } else if (userInput.toLowerCase().includes('training') || userInput.toLowerCase().includes('exercise')) {
            return "Training shapes the warrior! What skills did you develop, and how did this prepare you for future challenges?";
        } else {
            // Random response from the array
            return responses[Math.floor(Math.random() * responses.length)];
        }
    }

    addMessage(sender, content) {
        const message = {
            id: Date.now(),
            sender: sender,
            content: content,
            timestamp: new Date().toISOString()
        };
        
        this.conversationHistory.push(message);
        this.displayMessage(message);
    }

    displayMessage(message) {
        const conversationHistory = document.getElementById('conversation-history');
        if (!conversationHistory) return;
        
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${message.sender}`;
        
        const headerDiv = document.createElement('div');
        headerDiv.className = 'message-header';
        headerDiv.textContent = message.sender === 'user' ? 'You' : 'Jasker';
        
        const contentDiv = document.createElement('div');
        contentDiv.className = 'message-content';
        contentDiv.textContent = message.content;
        
        messageDiv.appendChild(headerDiv);
        messageDiv.appendChild(contentDiv);
        
        conversationHistory.appendChild(messageDiv);
        conversationHistory.scrollTop = conversationHistory.scrollHeight;
    }

    showTypingIndicator() {
        const conversationHistory = document.getElementById('conversation-history');
        if (!conversationHistory) return;
        
        const typingDiv = document.createElement('div');
        typingDiv.id = 'typing-indicator';
        typingDiv.className = 'message jasker typing';
        typingDiv.innerHTML = `
            <div class="message-header">Jasker</div>
            <div class="message-content">
                <span class="typing-dots">
                    <span>.</span><span>.</span><span>.</span>
                </span>
            </div>
        `;
        
        conversationHistory.appendChild(typingDiv);
        conversationHistory.scrollTop = conversationHistory.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    speakResponse(text) {
        if (!this.synthesis) return;
        
        // Cancel any ongoing speech
        this.synthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9; // Slightly slower for the bard's voice
        utterance.pitch = 1.1; // Slightly higher pitch
        utterance.volume = 0.8;
        
        // Try to use a male voice if available
        const voices = this.synthesis.getVoices();
        const maleVoice = voices.find(voice => voice.name.includes('Male') || voice.name.includes('David') || voice.name.includes('James'));
        if (maleVoice) {
            utterance.voice = maleVoice;
        }
        
        this.synthesis.speak(utterance);
    }

    loadConversationHistory() {
        // Load conversation history from localStorage or Firebase
        const saved = localStorage.getItem('jasker_conversation');
        if (saved) {
            try {
                this.conversationHistory = JSON.parse(saved);
                this.conversationHistory.forEach(message => this.displayMessage(message));
            } catch (error) {
                console.error('Error loading conversation history:', error);
            }
        }
        
        // If this is the first conversation, show welcome message
        if (this.conversationHistory.length === 0) {
            this.addMessage('jasker', config.jasker.welcomeMessage);
        }
    }

    saveConversation() {
        // Save conversation to localStorage and Firebase
        try {
            localStorage.setItem('jasker_conversation', JSON.stringify(this.conversationHistory));
            
            // TODO: Save to Firebase when user is authenticated
            if (authManager.isAuthenticated()) {
                this.saveToFirebase();
            }
        } catch (error) {
            console.error('Error saving conversation:', error);
        }
    }

    async saveToFirebase() {
        // TODO: Implement Firebase saving
        console.log('Saving conversation to Firebase...');
    }

    clearConversation() {
        this.conversationHistory = [];
        const conversationHistory = document.getElementById('conversation-history');
        if (conversationHistory) {
            conversationHistory.innerHTML = '';
        }
        localStorage.removeItem('jasker_conversation');
    }
}

// Initialize conversation manager
const conversationManager = new ConversationManager();

// Add some CSS for typing indicator
const style = document.createElement('style');
style.textContent = `
    .typing-dots span {
        animation: typing 1.4s infinite;
        opacity: 0;
    }
    .typing-dots span:nth-child(1) { animation-delay: 0s; }
    .typing-dots span:nth-child(2) { animation-delay: 0.2s; }
    .typing-dots span:nth-child(3) { animation-delay: 0.4s; }
    
    @keyframes typing {
        0%, 60%, 100% { opacity: 0; }
        30% { opacity: 1; }
    }
`;
document.head.appendChild(style); 