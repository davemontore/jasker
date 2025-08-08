// Jasker Library Module
// Manages the organized content: Core Stories, Resume Bullets, and Contextual Threads

class LibraryManager {
    constructor() {
        this.coreStories = [];
        this.resumeBullets = [];
        this.contextualThreads = [];
        this.currentTab = 'stories';
        this.init();
    }

    init() {
        this.loadLibraryData();
        this.setupEventListeners();
        this.renderLibrary();
    }

    setupEventListeners() {
        // Tab switching
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tab = button.getAttribute('data-tab');
                this.switchTab(tab);
            });
        });

        // Navigation between Lounge and Library
        const loungeBtn = document.getElementById('lounge-btn');
        const libraryBtn = document.getElementById('library-btn');

        if (loungeBtn) {
            loungeBtn.addEventListener('click', () => this.showLounge());
        }

        if (libraryBtn) {
            libraryBtn.addEventListener('click', () => this.showLibrary());
        }
    }

    switchTab(tabName) {
        // Update active tab button
        const tabButtons = document.querySelectorAll('.tab-btn');
        tabButtons.forEach(button => {
            button.classList.remove('active');
            if (button.getAttribute('data-tab') === tabName) {
                button.classList.add('active');
            }
        });

        // Update active tab content
        const tabContents = document.querySelectorAll('.tab-content');
        tabContents.forEach(content => {
            content.classList.remove('active');
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            }
        });

        this.currentTab = tabName;
        this.renderCurrentTab();
    }

    showLounge() {
        document.getElementById('library-screen').classList.remove('active');
        document.getElementById('lounge-screen').classList.add('active');
        
        // Update navigation buttons
        document.getElementById('library-btn').classList.remove('active');
        document.getElementById('lounge-btn').classList.add('active');
    }

    showLibrary() {
        document.getElementById('lounge-screen').classList.remove('active');
        document.getElementById('library-screen').classList.add('active');
        
        // Update navigation buttons
        document.getElementById('lounge-btn').classList.remove('active');
        document.getElementById('library-btn').classList.add('active');
    }

    renderLibrary() {
        this.renderCoreStories();
        this.renderResumeBullets();
        this.renderContextualThreads();
    }

    renderCurrentTab() {
        switch (this.currentTab) {
            case 'stories':
                this.renderCoreStories();
                break;
            case 'bullets':
                this.renderResumeBullets();
                break;
            case 'threads':
                this.renderContextualThreads();
                break;
        }
    }

    renderCoreStories() {
        const bookshelf = document.querySelector('.bookshelf');
        if (!bookshelf) return;

        if (this.coreStories.length === 0) {
            bookshelf.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📚</div>
                    <h4>No Core Stories Yet</h4>
                    <p>Your epic tales will appear here as books on the shelf.</p>
                    <p>Start a conversation in The Lounge to begin collecting your stories!</p>
                </div>
            `;
            return;
        }

        bookshelf.innerHTML = this.coreStories.map(story => `
            <div class="book" data-id="${story.id}">
                <div class="book-spine">
                    <div class="book-title">${story.title}</div>
                    <div class="book-date">${this.formatDate(story.dateRange)}</div>
                </div>
                <div class="book-content">
                    <h4>${story.title}</h4>
                    <p class="story-summary">${story.summary}</p>
                    <div class="story-meta">
                        <span class="location">📍 ${story.location || 'Unknown'}</span>
                        <span class="people">👥 ${story.peopleInvolved?.length || 0} people</span>
                    </div>
                    <div class="story-tags">
                        ${story.tags?.map(tag => `<span class="tag">${tag}</span>`).join('') || ''}
                    </div>
                    <div class="book-actions">
                        <button class="edit-btn" onclick="libraryManager.editStory('${story.id}')">Edit</button>
                        <button class="export-btn" onclick="libraryManager.exportStory('${story.id}')">Export</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderResumeBullets() {
        const magazineRack = document.querySelector('.magazine-rack');
        if (!magazineRack) return;

        if (this.resumeBullets.length === 0) {
            magazineRack.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📰</div>
                    <h4>No Resume Bullets Yet</h4>
                    <p>Your quantifiable achievements will appear here as magazines.</p>
                    <p>Continue your conversations to generate powerful resume bullets!</p>
                </div>
            `;
            return;
        }

        magazineRack.innerHTML = this.resumeBullets.map(bullet => `
            <div class="magazine" data-id="${bullet.id}">
                <div class="magazine-cover">
                    <div class="magazine-title">${bullet.title}</div>
                    <div class="magazine-metric">${bullet.metric}</div>
                </div>
                <div class="magazine-content">
                    <h4>${bullet.title}</h4>
                    <p class="bullet-text">${bullet.text}</p>
                    <div class="bullet-meta">
                        <span class="impact">💪 ${bullet.impact}</span>
                        <span class="story-link">📚 From: ${bullet.relatedStory || 'Unknown'}</span>
                    </div>
                    <div class="magazine-actions">
                        <button class="edit-btn" onclick="libraryManager.editBullet('${bullet.id}')">Edit</button>
                        <button class="copy-btn" onclick="libraryManager.copyBullet('${bullet.id}')">Copy</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    renderContextualThreads() {
        const libraryTables = document.querySelector('.library-tables');
        if (!libraryTables) return;

        if (this.contextualThreads.length === 0) {
            libraryTables.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🧵</div>
                    <h4>No Contextual Threads Yet</h4>
                    <p>Background information and connections will appear here.</p>
                    <p>These threads help weave your stories together!</p>
                </div>
            `;
            return;
        }

        libraryTables.innerHTML = this.contextualThreads.map(thread => `
            <div class="thread-card" data-id="${thread.id}">
                <div class="thread-header">
                    <h4>${thread.title}</h4>
                    <span class="thread-type">${thread.type}</span>
                </div>
                <p class="thread-content">${thread.content}</p>
                <div class="thread-connections">
                    <span class="connections-label">Connections:</span>
                    ${thread.connections?.map(conn => `<span class="connection">${conn}</span>`).join('') || 'None yet'}
                </div>
                <div class="thread-actions">
                    <button class="edit-btn" onclick="libraryManager.editThread('${thread.id}')">Edit</button>
                    <button class="delete-btn" onclick="libraryManager.deleteThread('${thread.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    // Core Story Management
    addCoreStory(storyData) {
        const story = {
            id: Date.now().toString(),
            title: storyData.title || 'Untitled Story',
            summary: storyData.summary || '',
            dateRange: storyData.dateRange || '',
            location: storyData.location || '',
            peopleInvolved: storyData.peopleInvolved || [],
            tags: storyData.tags || [],
            content: storyData.content || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.coreStories.push(story);
        this.saveLibraryData();
        this.renderCoreStories();
        return story;
    }

    editStory(storyId) {
        const story = this.coreStories.find(s => s.id === storyId);
        if (!story) return;

        // For now, show a simple edit dialog
        const newTitle = prompt('Edit story title:', story.title);
        if (newTitle !== null) {
            story.title = newTitle;
            story.updatedAt = new Date().toISOString();
            this.saveLibraryData();
            this.renderCoreStories();
        }
    }

    exportStory(storyId) {
        const story = this.coreStories.find(s => s.id === storyId);
        if (!story) return;

        const exportText = `
Core Story: ${story.title}
Date Range: ${story.dateRange}
Location: ${story.location}
Summary: ${story.summary}
Content: ${story.content}
Tags: ${story.tags.join(', ')}
        `.trim();

        navigator.clipboard.writeText(exportText).then(() => {
            alert('Story copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = exportText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Story copied to clipboard!');
        });
    }

    // Resume Bullet Management
    addResumeBullet(bulletData) {
        const bullet = {
            id: Date.now().toString(),
            title: bulletData.title || 'Untitled Achievement',
            text: bulletData.text || '',
            metric: bulletData.metric || '',
            impact: bulletData.impact || '',
            relatedStory: bulletData.relatedStory || '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.resumeBullets.push(bullet);
        this.saveLibraryData();
        this.renderResumeBullets();
        return bullet;
    }

    editBullet(bulletId) {
        const bullet = this.resumeBullets.find(b => b.id === bulletId);
        if (!bullet) return;

        const newText = prompt('Edit resume bullet:', bullet.text);
        if (newText !== null) {
            bullet.text = newText;
            bullet.updatedAt = new Date().toISOString();
            this.saveLibraryData();
            this.renderResumeBullets();
        }
    }

    copyBullet(bulletId) {
        const bullet = this.resumeBullets.find(b => b.id === bulletId);
        if (!bullet) return;

        navigator.clipboard.writeText(bullet.text).then(() => {
            alert('Resume bullet copied to clipboard!');
        }).catch(() => {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = bullet.text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            alert('Resume bullet copied to clipboard!');
        });
    }

    // Contextual Thread Management
    addContextualThread(threadData) {
        const thread = {
            id: Date.now().toString(),
            title: threadData.title || 'Untitled Thread',
            content: threadData.content || '',
            type: threadData.type || 'general',
            connections: threadData.connections || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        this.contextualThreads.push(thread);
        this.saveLibraryData();
        this.renderContextualThreads();
        return thread;
    }

    editThread(threadId) {
        const thread = this.contextualThreads.find(t => t.id === threadId);
        if (!thread) return;

        const newContent = prompt('Edit thread content:', thread.content);
        if (newContent !== null) {
            thread.content = newContent;
            thread.updatedAt = new Date().toISOString();
            this.saveLibraryData();
            this.renderContextualThreads();
        }
    }

    deleteThread(threadId) {
        if (confirm('Are you sure you want to delete this thread?')) {
            this.contextualThreads = this.contextualThreads.filter(t => t.id !== threadId);
            this.saveLibraryData();
            this.renderContextualThreads();
        }
    }

    // Data Persistence
    loadLibraryData() {
        try {
            const saved = localStorage.getItem('jasker_library');
            if (saved) {
                const data = JSON.parse(saved);
                this.coreStories = data.coreStories || [];
                this.resumeBullets = data.resumeBullets || [];
                this.contextualThreads = data.contextualThreads || [];
            }
        } catch (error) {
            console.error('Error loading library data:', error);
        }
    }

    saveLibraryData() {
        try {
            const data = {
                coreStories: this.coreStories,
                resumeBullets: this.resumeBullets,
                contextualThreads: this.contextualThreads
            };
            localStorage.setItem('jasker_library', JSON.stringify(data));
            
            // TODO: Save to Firebase when user is authenticated
            if (authManager.isAuthenticated()) {
                this.saveToFirebase(data);
            }
        } catch (error) {
            console.error('Error saving library data:', error);
        }
    }

    async saveToFirebase(data) {
        // TODO: Implement Firebase saving
        console.log('Saving library data to Firebase...');
    }

    // Utility Functions
    formatDate(dateString) {
        if (!dateString) return 'Unknown';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch {
            return dateString;
        }
    }

    // AI Integration - These will be called by the conversation manager
    processConversationForLibrary(conversationData) {
        // TODO: Implement AI analysis to extract stories, bullets, and threads
        console.log('Processing conversation for library...', conversationData);
    }

    // Add missing functions for app.js
    clearLibrary() {
        this.coreStories = [];
        this.resumeBullets = [];
        this.contextualThreads = [];
        this.saveLibraryData();
        console.log('Library cleared');
    }

    async loadFromFirebase(userId) {
        // TODO: Implement Firebase loading
        console.log('Loading library data from Firebase for user:', userId);
    }
}

// Initialize library manager
const libraryManager = new LibraryManager();

// Add CSS for library components
const libraryStyle = document.createElement('style');
libraryStyle.textContent = `
    .empty-state {
        text-align: center;
        padding: 40px 20px;
        color: var(--color-black);
    }
    
    .empty-icon {
        font-size: 3rem;
        margin-bottom: 20px;
        opacity: 0.5;
    }
    
    .empty-state h4 {
        font-family: var(--font-serif);
        margin-bottom: 10px;
        color: var(--color-forest-green);
    }
    
    .empty-state p {
        margin-bottom: 10px;
        opacity: 0.8;
    }
    
    .bookshelf {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .book {
        background: var(--color-brown);
        border-radius: 4px;
        padding: 15px;
        cursor: pointer;
        transition: transform 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
    
    .book:hover {
        transform: translateY(-5px);
    }
    
    .book-spine {
        border-left: 4px solid var(--color-gold);
        padding-left: 10px;
        margin-bottom: 10px;
    }
    
    .book-title {
        font-weight: 700;
        color: white;
        margin-bottom: 5px;
    }
    
    .book-date {
        font-size: 0.8rem;
        color: rgba(255, 255, 255, 0.8);
    }
    
    .book-content {
        background: white;
        padding: 15px;
        border-radius: 4px;
    }
    
    .book-content h4 {
        font-family: var(--font-serif);
        color: var(--color-forest-green);
        margin-bottom: 10px;
    }
    
    .story-summary {
        margin-bottom: 10px;
        line-height: 1.4;
    }
    
    .story-meta {
        display: flex;
        gap: 10px;
        margin-bottom: 10px;
        font-size: 0.9rem;
    }
    
    .story-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        margin-bottom: 15px;
    }
    
    .tag {
        background: var(--color-forest-green);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .book-actions {
        display: flex;
        gap: 10px;
    }
    
    .edit-btn, .export-btn, .copy-btn, .delete-btn {
        background: var(--color-forest-green);
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        font-family: var(--font-courier);
        font-size: 0.8rem;
        cursor: pointer;
        transition: background 0.3s ease;
    }
    
    .edit-btn:hover, .export-btn:hover, .copy-btn:hover {
        background: var(--color-forest-green-light);
    }
    
    .delete-btn {
        background: #d32f2f;
    }
    
    .delete-btn:hover {
        background: #b71c1c;
    }
    
    .magazine-rack {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .magazine {
        background: white;
        border: 2px solid var(--color-forest-green);
        border-radius: 8px;
        overflow: hidden;
        transition: transform 0.3s ease;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
    
    .magazine:hover {
        transform: translateY(-3px);
    }
    
    .magazine-cover {
        background: var(--color-forest-green);
        color: white;
        padding: 15px;
        text-align: center;
    }
    
    .magazine-title {
        font-weight: 700;
        margin-bottom: 5px;
    }
    
    .magazine-metric {
        font-size: 0.9rem;
        opacity: 0.9;
    }
    
    .magazine-content {
        padding: 15px;
    }
    
    .magazine-content h4 {
        font-family: var(--font-serif);
        color: var(--color-forest-green);
        margin-bottom: 10px;
    }
    
    .bullet-text {
        margin-bottom: 10px;
        line-height: 1.4;
    }
    
    .bullet-meta {
        display: flex;
        flex-direction: column;
        gap: 5px;
        margin-bottom: 15px;
        font-size: 0.9rem;
    }
    
    .magazine-actions {
        display: flex;
        gap: 10px;
    }
    
    .library-tables {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 20px;
        padding: 20px;
    }
    
    .thread-card {
        background: white;
        border: 1px solid var(--color-forest-green);
        border-radius: 8px;
        padding: 20px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
    
    .thread-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
    }
    
    .thread-header h4 {
        font-family: var(--font-serif);
        color: var(--color-forest-green);
        margin: 0;
    }
    
    .thread-type {
        background: var(--color-gold);
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .thread-content {
        margin-bottom: 15px;
        line-height: 1.4;
    }
    
    .thread-connections {
        margin-bottom: 15px;
    }
    
    .connections-label {
        font-weight: 700;
        margin-right: 10px;
    }
    
    .connection {
        background: var(--color-creme-dark);
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 0.8rem;
        margin-right: 5px;
    }
    
    .thread-actions {
        display: flex;
        gap: 10px;
    }
`;
document.head.appendChild(libraryStyle); 