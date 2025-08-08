// Jasker Conversation Module
// Handles voice recording, transcription, and AI conversation

class ConversationManager {
    constructor() {
        this.conversationHistory = [];
        this.conversationState = {
            currentTopic: {
                title: "Your professional story",
                confidence: 0.1,
                type: "initial"
            },
            pendingQuestions: [],
            satisfiedQuestions: [],
            currentDutyAssignment: null,
            conversationFlow: "initial_exploration", // initial_exploration, deep_dive, transition
            userPreferences: [],
            temporalContext: {
                dutyAssignments: [],
                currentTimeframe: null,
                spatialAnchors: []
            }
        };
        
        this.voiceEnabled = true;
        this.recognition = null;
        this.synthesis = null;
        this.isRecording = false;
        this.isProcessing = false; // New state variable for processing
        
        this.initializeSpeechRecognition();
        this.initializeSpeechSynthesis();
        this.loadConversationState();
    }

    // Load conversation state from localStorage
    loadConversationState() {
        const savedState = localStorage.getItem('jasker_conversation_state');
        if (savedState) {
            try {
                const parsed = JSON.parse(savedState);
                this.conversationState = { ...this.conversationState, ...parsed };
            } catch (e) {
                console.log('Could not load conversation state:', e);
            }
        }
        
        const savedHistory = localStorage.getItem('jasker_conversation_history');
        if (savedHistory) {
            try {
                this.conversationHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.log('Could not load conversation history:', e);
            }
        }
    }

    // Save conversation state to localStorage
    saveConversationState() {
        localStorage.setItem('jasker_conversation_state', JSON.stringify(this.conversationState));
        localStorage.setItem('jasker_conversation_history', JSON.stringify(this.conversationHistory));
    }

    // Load conversation data from Firebase (placeholder for future implementation)
    async loadFromFirebase(userId) {
        try {
            // For now, just load from localStorage
            // TODO: Implement Firebase loading when Firebase is set up
            console.log('Loading conversation data for user:', userId);
            this.loadConversationState();
            return true;
        } catch (error) {
            console.error('Error loading from Firebase:', error);
            // Fallback to localStorage
            this.loadConversationState();
            return false;
        }
    }

    // Save conversation data to Firebase (placeholder for future implementation)
    async saveToFirebase(userId) {
        try {
            // For now, just save to localStorage
            // TODO: Implement Firebase saving when Firebase is set up
            console.log('Saving conversation data for user:', userId);
            this.saveConversationState();
            return true;
        } catch (error) {
            console.error('Error saving to Firebase:', error);
            // Fallback to localStorage
            this.saveConversationState();
            return false;
        }
    }

    // Save conversation (alias for saveConversationState for compatibility)
    saveConversation() {
        this.saveConversationState();
    }

    // Clear conversation data
    clearConversation() {
        this.conversationHistory = [];
        this.conversationState = {
            currentTopic: {
                title: "Your professional story",
                confidence: 0.1,
                type: "initial"
            },
            pendingQuestions: [],
            satisfiedQuestions: [],
            currentDutyAssignment: null,
            conversationFlow: "initial_exploration",
            userPreferences: [],
            temporalContext: {
                dutyAssignments: [],
                currentTimeframe: null,
                spatialAnchors: []
            }
        };
        this.saveConversationState();
        this.updateTopicDisplay();
        
        // Clear the conversation history display
        const historyElement = document.getElementById('conversation-history');
        if (historyElement) {
            historyElement.innerHTML = '';
        }
    }

    // Force show welcome message (for debugging and fallback)
    forceShowWelcomeMessage() {
        console.log('Force showing welcome message');
        this.clearConversation(); // Clear any existing state
        this.showAppropriateWelcomeMessage();
    }

    // Initialize speech recognition
    initializeSpeechRecognition() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            this.recognition = new SpeechRecognition();
            this.recognition.continuous = false; // Changed from true to false to prevent auto-restart
            this.recognition.interimResults = false;
            this.recognition.lang = 'en-US';
            
            this.recognition.onresult = (event) => {
                const transcript = event.results[event.results.length - 1][0].transcript;
                console.log('Speech recognized:', transcript);
                
                // Only process if we're not already processing
                if (!this.isProcessing) {
                    this.handleUserInput(transcript);
                }
            };
            
            this.recognition.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                this.updateVoiceStatus('Error: ' + event.error);
                this.isRecording = false;
                this.isProcessing = false;
                this.updateVoiceButton();
            };
            
            this.recognition.onend = () => {
                console.log('Speech recognition ended');
                this.isRecording = false;
                this.updateVoiceButton();
                this.updateVoiceStatus('🎤 Click to speak');
            };
        }
    }

    // Initialize speech synthesis
    initializeSpeechSynthesis() {
        if ('speechSynthesis' in window) {
            this.synthesis = window.speechSynthesis;
        }
    }

    // Handle user input (voice or text)
    async handleUserInput(input) {
        if (!input || input.trim() === '') return;
        
        // Add user message to history
        this.addMessage('user', input);
        
        // Update voice status
        this.updateVoiceStatus('⏳ Processing...');
        this.isProcessing = true; // Set processing to true
        
        try {
            // Get AI response with enhanced logic
            const response = await this.getAIResponse(input);
            
            // Add AI response to history
            this.addMessage('jasker', response);
            
            // Speak the response
            this.speakResponse(response);
            
            // Update voice status
            this.updateVoiceStatus('🎤 Click to speak');
            
        } catch (error) {
            console.error('Error getting AI response:', error);
            this.updateVoiceStatus('❌ Error processing response');
        } finally {
            this.isProcessing = false; // Set processing to false after response
        }
    }

    // Enhanced AI response system with temporal-spatial mapping
    async getAIResponse(userInput) {
        console.log('Analyzing user input:', userInput);
        
        // Step 1: Analyze input for temporal-spatial context
        const analysis = this.analyzeUserInput(userInput);
        console.log('Input analysis:', analysis);
        
        // Step 2: Update temporal context and duty assignments
        this.updateTemporalContext(analysis, userInput);
        
        // Step 3: Try to get GPT-5 response, fallback to local analysis
        let response;
        try {
            if (hasApiKey('openai')) {
                response = await this.getGPT5Response(userInput, analysis);
                console.log('Using GPT-5 response');
            } else {
                throw new Error('No OpenAI API key available');
            }
        } catch (error) {
            console.error('GPT-5 failed, using fallback:', error);
            response = this.generateContextualResponse(analysis, userInput);
        }
        
        // Step 4: Update conversation state
        this.updateConversationState(analysis);
        
        // Step 5: Save state
        this.saveConversationState();
        
        return response;
    }

    // Get GPT-5 response
    async getGPT5Response(userInput, analysis) {
        try {
            // Add timeout to prevent hanging
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.openai.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: config.openai.model,
                    messages: [
                        {
                            role: "system",
                            content: `You are Jasker, an AI career detective helping military service members transition to civilian life. You are appreciative, collaborative but challenging, curious, patient, and methodical. You focus on quantifiables and temporal-spatial mapping. You help users uncover their accomplishments and translate military experience into civilian language.`
                        },
                        {
                            role: "user",
                            content: userInput
                        }
                    ],
                    max_tokens: config.openai.maxTokens,
                    temperature: 0.7
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.status}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;

        } catch (error) {
            console.error('GPT-5 API call failed:', error);
            throw error;
        }
    }

    // Analyze user input for temporal-spatial context
    analyzeUserInput(userInput) {
        const input = userInput.toLowerCase();
        const analysis = {
            type: 'new_information',
            keywords: [],
            emotions: [],
            quantifiables: [],
            timeline: null,
            people: [],
            locations: [],
            skills: [],
            dutyAssignment: null,
            vagueness: [],
            confidence: 'low',
            temporalReferences: [],
            spatialReferences: []
        };

        // Extract temporal references
        const temporalPatterns = [
            /(?:in|during|back in|around)\s+(\d{4})/gi,
            /(?:before|after)\s+(\d{4})/gi,
            /(?:early|mid|late)\s+(?:19|20)\d{2}/gi,
            /(?:spring|summer|fall|winter)\s+(\d{4})/gi,
            /(?:first|second|third|fourth)\s+(?:deployment|assignment|tour)/gi
        ];
        
        temporalPatterns.forEach(pattern => {
            const matches = [...input.matchAll(pattern)];
            analysis.temporalReferences.push(...matches.map(m => m[0]));
        });

        // Extract spatial references (military bases, locations)
        const spatialPatterns = [
            /(?:fort|camp|base)\s+[a-zA-Z]+/gi,
            /(?:afghanistan|iraq|kuwait|germany|korea|japan|italy|spain)/gi,
            /(?:deployment|overseas|stateside|training|exercise)/gi
        ];
        
        spatialPatterns.forEach(pattern => {
            const matches = [...input.matchAll(pattern)];
            analysis.spatialReferences.push(...matches.map(m => m[0]));
        });

        // Extract quantifiables
        const numberPattern = /(\d+(?:\.\d+)?)\s*(?:people|person|soldiers|troops|team|members|dollars?|\$|percent|%|months?|years?|weeks?|days?)/gi;
        const matches = [...input.matchAll(numberPattern)];
        analysis.quantifiables = matches.map(match => match[0]);

        // Extract people mentioned
        const peoplePattern = /(?:sergeant|sgt\.|lieutenant|lt\.|captain|cpt\.|colonel|col\.|general|gen\.|commander|officer|soldier|troop|team member|subordinate|supervisor|boss|colleague|peer)/gi;
        const peopleMatches = [...input.matchAll(peoplePattern)];
        analysis.people = peopleMatches.map(match => match[0]);

        // Extract emotions and feelings
        const emotionKeywords = ['stressful', 'challenging', 'difficult', 'frustrating', 'rewarding', 'satisfying', 'proud', 'accomplished', 'overwhelmed', 'confident', 'worried', 'excited'];
        analysis.emotions = emotionKeywords.filter(emotion => input.includes(emotion));

        // Extract skills and themes
        const skillKeywords = ['leadership', 'management', 'training', 'logistics', 'planning', 'coordination', 'communication', 'budget', 'supervision', 'mentoring', 'problem-solving', 'decision-making'];
        analysis.skills = skillKeywords.filter(skill => input.includes(skill));

        // Identify vagueness indicators
        const vaguenessPatterns = [
            /(?:a lot|many|several|some|few|various|different|multiple)/gi,
            /(?:kind of|sort of|pretty much|basically|generally)/gi,
            /(?:things|stuff|situations|circumstances|experiences)/gi
        ];
        
        vaguenessPatterns.forEach(pattern => {
            const matches = [...input.matchAll(pattern)];
            analysis.vagueness.push(...matches.map(m => m[0]));
        });

        // Determine information type and confidence
        if (analysis.temporalReferences.length > 0 || analysis.spatialReferences.length > 0) {
            analysis.type = 'temporal_spatial_context';
            analysis.confidence = 'high';
        } else if (analysis.quantifiables.length > 0) {
            analysis.type = 'quantifiable_information';
            analysis.confidence = 'high';
        } else if (analysis.vagueness.length > 0) {
            analysis.type = 'vague_information';
            analysis.confidence = 'low';
        } else if (analysis.emotions.length > 0) {
            analysis.type = 'emotional_context';
            analysis.confidence = 'medium';
        } else {
            analysis.type = 'general_information';
            analysis.confidence = 'low';
        }

        return analysis;
    }

    // Update temporal context with new information
    updateTemporalContext(analysis, userInput) {
        // Extract potential duty assignment information
        if (analysis.temporalReferences.length > 0 || analysis.spatialReferences.length > 0) {
            const newAssignment = this.extractDutyAssignment(analysis, userInput);
            if (newAssignment) {
                this.conversationState.temporalContext.dutyAssignments.push(newAssignment);
            }
        }
    }

    // Extract duty assignment from user input
    extractDutyAssignment(analysis, userInput) {
        const input = userInput.toLowerCase();
        
        // Look for role + location + timeframe patterns
        const rolePatterns = [
            /(?:platoon sergeant|platoon leader|company commander|battalion commander|staff officer)/gi
        ];
        
        const locationPatterns = [
            /(?:fort|camp|base)\s+([a-zA-Z]+)/gi,
            /(?:afghanistan|iraq|kuwait|germany|korea|japan)/gi
        ];
        
        const timeframePatterns = [
            /(\d{4})\s*(?:to|-)\s*(\d{4})/gi,
            /(?:in|during|from)\s+(\d{4})/gi
        ];
        
        // Extract components
        const role = rolePatterns.find(pattern => pattern.test(input))?.exec(input)?.[0];
        const location = locationPatterns.find(pattern => pattern.test(input))?.exec(input)?.[0];
        const timeframe = timeframePatterns.find(pattern => pattern.test(input))?.exec(input)?.[0];
        
        if (role || location || timeframe) {
            return {
                role: role || 'unknown',
                location: location || 'unknown',
                timeframe: timeframe || 'unknown',
                confidence: 'medium',
                extractedFrom: userInput
            };
        }
        
        return null;
    }

    // Generate contextual response based on conversation state
    generateContextualResponse(analysis, userInput) {
        const input = userInput.toLowerCase();
        
        // Check if this is a test input
        if (input.includes('test') || input.includes('microphone') || input.includes('testing')) {
            return "I can hear you clearly! The voice system is working well. Now, let's talk about your professional experiences. What would you like to explore today?";
        }

        // Handle temporal-spatial context first
        if (analysis.type === 'temporal_spatial_context') {
            return this.generateTemporalSpatialResponse(analysis, userInput);
        }

        // Handle vague information with challenging questions
        if (analysis.type === 'vague_information') {
            return this.generateVaguenessChallenge(analysis, userInput);
        }

        // Handle quantifiable information
        if (analysis.type === 'quantifiable_information') {
            return this.generateQuantifiableResponse(analysis, userInput);
        }

        // Handle emotional context
        if (analysis.type === 'emotional_context') {
            return this.generateEmotionalResponse(analysis, userInput);
        }

        // Default response for general information
        return this.generateGeneralResponse(analysis, userInput);
    }

    // Generate response for temporal-spatial context
    generateTemporalSpatialResponse(analysis, userInput) {
        const input = userInput.toLowerCase();
        
        // Check if we can map to existing duty assignments
        const existingAssignments = this.conversationState.temporalContext.dutyAssignments;
        
        if (existingAssignments.length > 0) {
            // Try to match with existing assignments
            const potentialMatch = this.findTemporalMatch(analysis, existingAssignments);
            
            if (potentialMatch) {
                return `Ah, so this was during your time as ${potentialMatch.role} at ${potentialMatch.location} from ${potentialMatch.timeframe}. I have several questions about this period. Would you prefer to start with your main responsibilities, what made this assignment challenging, or the specific outcomes you achieved?`;
            }
        }
        
        // New temporal-spatial information
        const newAssignment = this.extractDutyAssignment(analysis, userInput);
        if (newAssignment) {
            this.conversationState.currentDutyAssignment = newAssignment;
            return `I'm mapping this to your time as ${newAssignment.role} at ${newAssignment.location}. To help me understand this period better, I have several questions. Would you prefer to start with the timeline and location details, your main responsibilities, or what made this experience significant?`;
        }
        
        return "I'm sorry, I'm having trouble processing your response properly. Let me take a moment to fix this so I can give you a better conversation experience.";
    }

    // Generate challenging response for vague information
    generateVaguenessChallenge(analysis, userInput) {
        const input = userInput.toLowerCase();
        
        if (input.includes('a lot') || input.includes('many')) {
            return "You mentioned dealing with 'a lot' of things. To help me understand the scope of your responsibility, can you give me a sense of what 'a lot' means? Were we talking about 5-10 items, 20-30, or something else entirely?";
        }
        
        if (input.includes('stressful') || input.includes('challenging')) {
            return "You mentioned this was stressful or challenging. What specifically made it difficult? Was it the timeline pressure, limited resources, personnel issues, or something else? I want to understand what you were up against.";
        }
        
        if (input.includes('things') || input.includes('stuff')) {
            return "You mentioned managing 'things' or 'stuff.' Can you be more specific about what you were responsible for? Were these people, equipment, processes, or something else?";
        }
        
        return "I want to understand this better. Can you give me a more specific example of what you're describing? What exactly were you dealing with?";
    }

    // Generate response for quantifiable information
    generateQuantifiableResponse(analysis, userInput) {
        return `That's helpful context - you mentioned ${analysis.quantifiables.join(', ')}. To build on this, I have a few follow-up questions. Would you prefer to explore the impact this had on your team, what made this achievement possible, or how this experience shaped your leadership approach?`;
    }

    // Generate response for emotional context
    generateEmotionalResponse(analysis, userInput) {
        const emotions = analysis.emotions.join(', ');
        return `You mentioned feeling ${emotions} about this experience. That tells me this was significant for you. What specifically about this situation led to those feelings? I want to understand what made this moment stand out in your career.`;
    }

    // Generate general response
    generateGeneralResponse(analysis, userInput) {
        return "I'm sorry, I'm having trouble processing your response properly. Let me take a moment to fix this so I can give you a better conversation experience.";
    }

    // Find temporal match with existing assignments
    findTemporalMatch(analysis, existingAssignments) {
        // Simple matching logic - can be enhanced with vector similarity later
        for (const assignment of existingAssignments) {
            if (analysis.temporalReferences.some(ref => 
                assignment.timeframe.includes(ref) || ref.includes(assignment.timeframe)
            )) {
                return assignment;
            }
        }
        return null;
    }

    // Update conversation state
    updateConversationState(analysis) {
        // Update current topic based on analysis
        if (analysis.confidence === 'high') {
            this.conversationState.currentTopic = {
                title: this.generateTopicTitle(analysis),
                confidence: 0.8,
                type: analysis.type
            };
        }
        
        // Update conversation flow
        if (this.conversationState.conversationFlow === 'initial_exploration' && analysis.confidence === 'high') {
            this.conversationState.conversationFlow = 'deep_dive';
        }
        
        // Update topic display
        this.updateTopicDisplay();
    }

    // Generate topic title from analysis
    generateTopicTitle(analysis) {
        if (analysis.type === 'temporal_spatial_context') {
            return "Mapping your career timeline";
        } else if (analysis.type === 'vague_information') {
            return "Clarifying your experiences";
        } else if (analysis.type === 'quantifiable_information') {
            return "Exploring your achievements";
        } else if (analysis.type === 'emotional_context') {
            return "Understanding your career impact";
        } else {
            return "Your professional story";
        }
    }

    // Update topic display
    updateTopicDisplay() {
        const topicElement = document.getElementById('current-topic');
        if (topicElement) {
            topicElement.textContent = this.conversationState.currentTopic.title;
            topicElement.style.opacity = '0.7';
            setTimeout(() => {
                topicElement.style.opacity = '1';
            }, 100);
        }
    }

    // Add message to conversation history
    addMessage(sender, content) {
        const message = {
            sender: sender,
            content: content,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        this.conversationHistory.push(message);
        
        // Use typewriter effect for Jasker's responses, regular display for user
        if (sender === 'jasker') {
            this.displayMessageWithTypewriter(message);
        } else {
            this.displayMessage(message);
        }
    }

    // Display message in the conversation area
    displayMessage(message) {
        const historyElement = document.getElementById('conversation-history');
        if (!historyElement) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        messageElement.innerHTML = `
            <div class="message-header">${message.sender === 'user' ? 'You' : 'Jasker'}</div>
            <div class="message-content">${message.content}</div>
        `;
        
        historyElement.appendChild(messageElement);
        historyElement.scrollTop = historyElement.scrollHeight;
    }

    // Voice control methods
    startRecording() {
        if (this.recognition && !this.isRecording && !this.isProcessing) {
            console.log('Starting recording...');
            this.recognition.start();
            this.isRecording = true;
            this.updateVoiceButton();
            this.updateVoiceStatus("I'm listening...");
        } else {
            console.log('Cannot start recording - already recording or processing');
        }
    }

    stopRecording() {
        if (this.recognition && this.isRecording) {
            console.log('Stopping recording...');
            this.recognition.stop();
            this.isRecording = false;
            this.updateVoiceButton();
        }
    }

    updateVoiceButton() {
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            const icon = voiceBtn.querySelector('.voice-icon');
            if (icon) {
                icon.textContent = this.isRecording ? '🔴' : '🎤';
            }
        }
    }

    updateVoiceStatus(status) {
        const statusElement = document.getElementById('voice-status');
        if (statusElement) {
            if (status === 'Listening...') {
                statusElement.textContent = "I'm listening...";
            } else if (status === 'Recording...') {
                statusElement.textContent = "I'm listening...";
            } else if (status === 'Processing...') {
                statusElement.textContent = '⏳ Processing...';
            } else if (status.includes('Error')) {
                statusElement.textContent = '❌ ' + status;
            } else {
                statusElement.textContent = '🎤 Click to speak';
            }
        }
    }

    // Speech synthesis methods
    speakResponse(text) {
        if (!text || text.trim() === '') return;
        
        // Stop any current speech first
        if (this.synthesis) {
            this.synthesis.cancel();
        }
        
        // Use OpenAI TTS if configured, otherwise fall back to browser
        if (config.jasker.voiceProvider === 'openai' && hasApiKey('openai')) {
            this.speakWithOpenAI(text);
        } else {
            this.speakWithBrowser(text);
        }
    }

    async speakWithOpenAI(text) {
        try {
            const response = await fetch('https://api.openai.com/v1/audio/speech', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${config.openai.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: config.jasker.openaiVoice.model,
                    voice: config.jasker.openaiVoice.voice,
                    speed: config.jasker.openaiVoice.speed,
                    input: text
                })
            });

            if (!response.ok) {
                throw new Error(`OpenAI TTS error: ${response.status}`);
            }

            const audioBlob = await response.blob();
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            
            // Handle audio play with proper error handling
            try {
                await audio.play();
            } catch (playError) {
                console.log('Audio autoplay blocked, user needs to interact first:', playError);
                // Don't throw error, just log it
            }

        } catch (error) {
            console.error('OpenAI TTS failed, falling back to browser:', error);
            this.speakWithBrowser(text);
        }
    }

    speakWithBrowser(text) {
        if (!this.synthesis) {
            console.error('Speech synthesis not supported');
            return;
        }

        // Stop any current speech
        this.synthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = config.jasker.browserVoice.rate;
        utterance.pitch = config.jasker.browserVoice.pitch;
        utterance.volume = config.jasker.browserVoice.volume;

        // Try to find a good voice
        const voices = this.synthesis.getVoices();
        const preferredVoice = voices.find(voice => 
            voice.name.toLowerCase().includes('female') && 
            voice.lang.startsWith('en')
        ) || voices.find(voice => 
            voice.name.toLowerCase().includes('woman') && 
            voice.lang.startsWith('en')
        ) || voices.find(voice => 
            voice.name.toLowerCase().includes('samantha') && 
            voice.lang.startsWith('en')
        ) || voices.find(voice => 
            voice.name.toLowerCase().includes('victoria') && 
            voice.lang.startsWith('en')
        );
        
        if (preferredVoice) {
            utterance.voice = preferredVoice;
        }

        this.synthesis.speak(utterance);
    }

    // Show welcome message for new users
    showWelcomeMessage() {
        if (this.conversationHistory.length === 0) {
            // Add message with typewriter effect
            this.addMessageWithTypewriter('jasker', config.jasker.welcomeMessage);
            
            // Set up one-time click listener to play welcome message
            const playWelcomeOnClick = () => {
                this.speakResponse(config.jasker.welcomeMessage);
                document.removeEventListener('click', playWelcomeOnClick);
            };
            document.addEventListener('click', playWelcomeOnClick, { once: true });
        }
    }

    // Show appropriate welcome message based on user status
    showAppropriateWelcomeMessage() {
        console.log('showAppropriateWelcomeMessage called');
        console.log('Conversation history length:', this.conversationHistory.length);
        
        // Check if this is a new user (no conversation history)
        const isNewUser = this.conversationHistory.length === 0;
        console.log('Is new user:', isNewUser);
        
        let message;
        if (isNewUser) {
            message = config.jasker.welcomeMessage;
        } else {
            message = "Welcome back! I'm ready to continue helping you explore your professional story. What would you like to work on today?";
        }
        
        console.log('Welcome message:', message);
        
        // Add message with typewriter effect
        this.addMessageWithTypewriter('jasker', message);
        
        // Set up one-time click listener to play welcome message
        const playWelcomeOnClick = () => {
            console.log('Playing welcome message audio...');
            this.speakResponse(message);
            document.removeEventListener('click', playWelcomeOnClick);
        };
        document.addEventListener('click', playWelcomeOnClick, { once: true });
    }

    // Add message with typewriter effect that syncs with speech
    addMessageWithTypewriter(sender, content) {
        const message = {
            sender: sender,
            content: content,
            timestamp: new Date().toISOString(),
            id: Date.now()
        };
        
        this.conversationHistory.push(message);
        this.displayMessageWithTypewriter(message);
    }

    // Display message with typewriter effect
    displayMessageWithTypewriter(message) {
        const historyElement = document.getElementById('conversation-history');
        if (!historyElement) return;
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.sender}`;
        messageElement.innerHTML = `
            <div class="message-header">${message.sender === 'user' ? 'You' : 'Jasker'}</div>
            <div class="message-content typewriter-content"></div>
        `;
        
        historyElement.appendChild(messageElement);
        historyElement.scrollTop = historyElement.scrollHeight;
        
        // Start typewriter effect
        this.startTypewriterEffect(messageElement.querySelector('.typewriter-content'), message.content);
    }

    // Typewriter effect that syncs with speech
    startTypewriterEffect(element, text) {
        const words = text.split(' ');
        let currentWordIndex = 0;
        
        // Calculate timing based on Nova's speech rate
        // Nova speaks at ~150 words per minute at speed 1.0
        // Adjust based on the configured speed
        const baseWordsPerMinute = 150;
        const speedMultiplier = config.jasker.openaiVoice.speed || 1.0;
        const adjustedWordsPerMinute = baseWordsPerMinute * speedMultiplier;
        const wordDelay = (60 * 1000) / adjustedWordsPerMinute; // milliseconds per word
        
        const typeNextWord = () => {
            if (currentWordIndex < words.length) {
                const word = words[currentWordIndex];
                element.textContent += (currentWordIndex > 0 ? ' ' : '') + word;
                currentWordIndex++;
                
                // Schedule next word
                setTimeout(typeNextWord, wordDelay);
            }
        };
        
        // Start the typewriter effect
        typeNextWord();
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Voice button
        const voiceBtn = document.getElementById('voice-btn');
        if (voiceBtn) {
            // Mouse events
            voiceBtn.addEventListener('mousedown', (e) => {
                e.preventDefault();
                this.startRecording();
            });
            voiceBtn.addEventListener('mouseup', (e) => {
                e.preventDefault();
                this.stopRecording();
            });
            voiceBtn.addEventListener('mouseleave', (e) => {
                e.preventDefault();
                this.stopRecording();
            });
            
            // Touch events for mobile
            voiceBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.startRecording();
            }, { passive: false });
            voiceBtn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.stopRecording();
            }, { passive: false });
            voiceBtn.addEventListener('touchcancel', (e) => {
                e.preventDefault();
                this.stopRecording();
            }, { passive: false });
        }

        // Text input
        const textInput = document.getElementById('text-input');
        const sendBtn = document.getElementById('send-btn');
        
        if (textInput && sendBtn) {
            const sendMessage = () => {
                const text = textInput.value.trim();
                if (text) {
                    this.handleUserInput(text);
                    textInput.value = '';
                }
            };

            sendBtn.addEventListener('click', sendMessage);
            textInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }

        // Test conversation button
        const testBtn = document.getElementById('test-conversation');
        if (testBtn) {
            testBtn.addEventListener('click', () => {
                this.handleUserInput("I was a platoon sergeant responsible for 30 soldiers during a deployment to Afghanistan in 2019. It was a challenging but rewarding experience where I had to manage logistics, training, and mission planning.");
            });
        }
    }
}

// Initialize conversation manager
const conversationManager = new ConversationManager();

// Add some CSS for typing indicator and typewriter effect
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
    
    .typewriter-content {
        font-family: 'Courier New', monospace;
        position: relative;
        overflow: hidden;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
    
    .typewriter-content::after {
        content: '|';
        animation: blink 1s infinite;
        color: var(--color-accent);
        font-weight: bold;
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    .message.jasker .typewriter-content {
        border-left: 3px solid var(--color-accent);
        padding-left: 15px;
    }
`;
document.head.appendChild(style); 