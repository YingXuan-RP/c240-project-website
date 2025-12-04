/**
 * CampusConnect - Main JavaScript Application
 * 
 * JavaScript Features for Enhanced Interactivity:
 * 1. Smart Matchmaking Algorithm with preference scoring
 * 2. Real-time form validation with accessibility
 * 3. Progressive Web App features for mobile users
 * 4. Intersection Observer for performance optimization
 * 5. Local Storage for user preferences
 * 6. Debounced search for smooth UX
 * 7. Keyboard navigation support
 * 8. Dynamic content loading
 */

class CampusConnect {
    constructor() {
        this.users = []; // Mock user database
        this.currentUser = null;
        this.matches = [];
        this.debounceTimer = null;
        
        this.init();
        this.setupEventListeners();
        this.setupDemoFunctionality();
        this.loadMockData();
        this.initializeChatbot();
    }

    /**
     * Initialize Chatbot
     */
    initializeChatbot() {
        this.chatbotResponses = {
            greetings: [
                "Hello! How can I help you with your studies today?",
                "Hi there! I'm here to help you find the perfect study partner.",
                "Welcome! What study assistance do you need?"
            ],
            findPartners: [
                "Great! To find study partners, I'll need to know:\n• What subjects are you studying?\n• What's your preferred study style?\n• When are you available?\n\nWould you like me to help you set up your profile first?",
                "I can help you find compatible study partners! Based on your profile, I'll match you with students who share similar subjects and schedules. Have you completed your study preferences yet?"
            ],
            studyTips: [
                "Here are some effective study techniques:\n• Use the Pomodoro Technique (25min study + 5min break)\n• Create study groups of 3-4 people\n• Teach concepts to others to reinforce learning\n• Use active recall instead of just re-reading\n\nWould you like specific tips for your subject?",
                "Collaborative studying can boost retention by 50%! Try:\n• Discussing concepts with peers\n• Creating group study schedules\n• Sharing notes and resources\n• Quiz each other regularly\n\nWhat subject are you focusing on?"
            ],
            help: [
                "I'm here to help! You can ask me about:\n• Finding study partners\n• Study techniques and tips\n• How CampusConnect works\n• Setting up your profile\n• Scheduling study sessions\n\nWhat specific help do you need?",
                "Need assistance? I can guide you through:\n• Creating your study profile\n• Setting preferences\n• Understanding the matching system\n• Using the messaging features\n\nWhat would you like to know more about?"
            ],
            matching: [
                "Our matching system uses AI to find compatible study partners based on:\n• Subject compatibility (30%)\n• Schedule overlap (40%)\n• Study style preferences (20%)\n• Location proximity (10%)\n\nThe system learns from your interactions to improve future matches!",
                "CampusConnect's smart matching considers multiple factors to find your ideal study partners. The more complete your profile, the better your matches will be!"
            ],
            profile: [
                "Your profile is the key to great matches! Include:\n• Your subjects and courses\n• Study preferences (quiet vs discussion)\n• Available time slots\n• Preferred study locations\n• Academic goals\n\nWould you like me to guide you through profile setup?",
                "A complete profile gets 3x better matches! Make sure to add your subjects, schedule, and study style preferences. Need help with any specific section?"
            ],
            default: [
                "That's an interesting question! While I'm still learning, I can help you with finding study partners, study tips, and using CampusConnect features. Could you rephrase your question?",
                "I'm not sure about that specific topic, but I'm great at helping with study partner matching, study techniques, and platform features. What else can I help you with?",
                "Hmm, I might need more context to help you better. I specialize in study partner recommendations, academic tips, and CampusConnect features. What are you looking to achieve?"
            ]
        };

        this.setupChatbotEvents();
    }

    /**
     * Setup Chatbot Events
     */
    setupChatbotEvents() {
        const chatbotToggle = document.getElementById('chatbotToggle');
        const chatbotWidget = document.getElementById('chatbotWidget');
        const closeChatbot = document.getElementById('closeChatbot');
        const minimizeChatbot = document.getElementById('minimizeChatbot');
        const sendMessage = document.getElementById('sendMessage');
        const chatbotInput = document.getElementById('chatbotInput');

        // Toggle chatbot
        chatbotToggle.addEventListener('click', () => {
            chatbotWidget.classList.toggle('open');
            if (chatbotWidget.classList.contains('open')) {
                chatbotInput.focus();
                this.hideChatbotBadge();
            }
        });

        // Close chatbot
        closeChatbot.addEventListener('click', () => {
            chatbotWidget.classList.remove('open');
        });

        // Minimize chatbot
        minimizeChatbot.addEventListener('click', () => {
            chatbotWidget.classList.toggle('minimized');
        });

        // Send message
        sendMessage.addEventListener('click', () => {
            this.sendChatMessage();
        });

        // Enter to send
        chatbotInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendChatMessage();
            }
        });

        // Quick actions
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('quick-action-btn')) {
                const action = e.target.dataset.action;
                this.handleQuickAction(action);
            }
            
            if (e.target.classList.contains('suggestion-chip')) {
                const suggestion = e.target.dataset.suggestion;
                chatbotInput.value = suggestion;
                this.sendChatMessage();
            }
        });
    }

    /**
     * Send Chat Message
     */
    sendChatMessage() {
        const input = document.getElementById('chatbotInput');
        const message = input.value.trim();
        
        if (!message) return;

        // Add user message
        this.addChatMessage(message, 'user');
        input.value = '';

        // Show typing indicator
        this.showTypingIndicator();

        // Generate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            const response = this.generateAIResponse(message);
            this.addChatMessage(response, 'bot');
        }, 1000 + Math.random() * 1000); // Simulate thinking time
    }

    /**
     * Add Chat Message
     */
    addChatMessage(message, sender) {
        const messagesContainer = document.getElementById('chatbotMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const currentTime = new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
            </div>
            <div class="message-content">
                <p>${message.replace(/\n/g, '<br>')}</p>
            </div>
            <div class="message-time">${currentTime}</div>
        `;
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    /**
     * Generate AI Response
     */
    generateAIResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        // Greeting detection
        if (message.includes('hello') || message.includes('hi') || message.includes('hey')) {
            return this.getRandomResponse('greetings');
        }
        
        // Find partners
        if (message.includes('find') && message.includes('partner') || message.includes('match')) {
            return this.getRandomResponse('findPartners');
        }
        
        // Study tips
        if (message.includes('study') && (message.includes('tip') || message.includes('technique') || message.includes('method'))) {
            return this.getRandomResponse('studyTips');
        }
        
        // Help requests
        if (message.includes('help') || message.includes('how') || message.includes('what')) {
            return this.getRandomResponse('help');
        }
        
        // Matching system
        if (message.includes('matching') || message.includes('algorithm') || message.includes('work')) {
            return this.getRandomResponse('matching');
        }
        
        // Profile questions
        if (message.includes('profile') || message.includes('setup') || message.includes('complete')) {
            return this.getRandomResponse('profile');
        }
        
        // Default response
        return this.getRandomResponse('default');
    }

    /**
     * Get Random Response
     */
    getRandomResponse(category) {
        const responses = this.chatbotResponses[category];
        return responses[Math.floor(Math.random() * responses.length)];
    }

    /**
     * Handle Quick Actions
     */
    handleQuickAction(action) {
        switch (action) {
            case 'find-partners':
                this.addChatMessage("I'd like help finding study partners", 'user');
                setTimeout(() => {
                    const response = this.getRandomResponse('findPartners');
                    this.addChatMessage(response, 'bot');
                }, 500);
                break;
                
            case 'study-tips':
                this.addChatMessage("Can you give me some study tips?", 'user');
                setTimeout(() => {
                    const response = this.getRandomResponse('studyTips');
                    this.addChatMessage(response, 'bot');
                }, 500);
                break;
                
            case 'help':
                this.addChatMessage("I need help with CampusConnect", 'user');
                setTimeout(() => {
                    const response = this.getRandomResponse('help');
                    this.addChatMessage(response, 'bot');
                }, 500);
                break;
        }
    }

    /**
     * Typing Indicator
     */
    showTypingIndicator() {
        const messagesContainer = document.getElementById('chatbotMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>Typing...</p>
            </div>
        `;
        messagesContainer.appendChild(typingDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.querySelector('.typing-indicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Show/Hide Chatbot Badge
     */
    showChatbotBadge() {
        const badge = document.getElementById('chatbotBadge');
        if (badge) {
            badge.style.display = 'flex';
        }
    }

    hideChatbotBadge() {
        const badge = document.getElementById('chatbotBadge');
        if (badge) {
            badge.style.display = 'none';
        }
    }

    setupDemoFunctionality() {
        // Demo functionality can be added here
    }

    init() {
        console.log('🎓 CampusConnect initialized');
        this.setupAccessibility();
        this.setupServiceWorker();
        this.loadUserPreferences();
        this.checkUserSession();
    }

    /**
     * Smart Matchmaking Algorithm
     * Scores potential study partners based on:
     * - Schedule compatibility (40%)
     * - Subject overlap (30%)
     * - Study style compatibility (20%)
     * - Location proximity (10%)
     */
    calculateCompatibilityScore(user1, user2) {
        let score = 0;
        
        // Schedule compatibility (40 points max)
        const scheduleOverlap = this.calculateScheduleOverlap(user1.schedule, user2.schedule);
        score += scheduleOverlap * 0.4;
        
        // Subject overlap (30 points max)
        const subjectMatch = this.calculateSubjectMatch(user1.subjects, user2.subjects);
        score += subjectMatch * 0.3;
        
        // Study style compatibility (20 points max)
        const styleMatch = user1.studyStyle === user2.studyStyle ? 1 : 0.5;
        score += styleMatch * 0.2;
        
        // Location proximity (10 points max)
        const locationScore = this.calculateLocationScore(user1.location, user2.location);
        score += locationScore * 0.1;
        
        return Math.round(score * 100); // Return percentage
    }

    calculateScheduleOverlap(schedule1, schedule2) {
        const overlap = schedule1.filter(slot => 
            schedule2.some(s => s.day === slot.day && this.timeOverlaps(s.time, slot.time))
        );
        return overlap.length / Math.max(schedule1.length, schedule2.length);
    }

    calculateSubjectMatch(subjects1, subjects2) {
        const commonSubjects = subjects1.filter(subject => subjects2.includes(subject));
        return commonSubjects.length / Math.max(subjects1.length, subjects2.length);
    }

    calculateLocationScore(loc1, loc2) {
        // Simple distance calculation (in real app, would use actual coordinates)
        const buildings = ['Library', 'Engineering', 'Science', 'Arts', 'Business'];
        const index1 = buildings.indexOf(loc1);
        const index2 = buildings.indexOf(loc2);
        const distance = Math.abs(index1 - index2);
        return Math.max(0, 1 - (distance / buildings.length));
    }

    timeOverlaps(time1, time2) {
        // Simplified time overlap check
        return time1 === time2;
    }

    /**
     * Real-time Search with Debouncing
     * Improves performance and reduces API calls
     */
    setupSearchDebounce(inputElement, callback, delay = 300) {
        inputElement.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimer);
            this.debounceTimer = setTimeout(() => {
                callback(e.target.value);
            }, delay);
        });
    }

    /**
     * Intersection Observer for Performance
     * Lazy loads content as user scrolls
     */
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '50px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // Lazy load images
                    const img = entry.target.querySelector('img[data-src]');
                    if (img) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                }
            });
        }, observerOptions);

        // Observe feature cards and other elements
        document.querySelectorAll('.feature-card, .step, .hero-card').forEach(el => {
            observer.observe(el);
        });
    }

    /**
     * Accessibility Enhancements
     * Keyboard navigation, ARIA labels, focus management
     */
    setupAccessibility() {
        // Keyboard navigation for modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
            
            if (e.key === 'Tab') {
                this.manageFocusTrapping(e);
            }
        });

        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'sr-only';
        skipLink.addEventListener('focus', () => skipLink.classList.remove('sr-only'));
        skipLink.addEventListener('blur', () => skipLink.classList.add('sr-only'));
        document.body.prepend(skipLink);

        // Announce page changes to screen readers
        this.setupLiveRegion();
    }

    setupLiveRegion() {
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'live-region';
        document.body.appendChild(liveRegion);
    }

    announceToScreenReader(message) {
        const liveRegion = document.getElementById('live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => liveRegion.textContent = '', 1000);
        }
    }

    manageFocusTrapping(e) {
        const modal = document.querySelector('.modal.show');
        if (!modal) return;

        const focusableElements = modal.querySelectorAll(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
        }
    }

    /**
     * Progressive Web App Setup
     * Enables offline functionality and app-like experience
     */
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(registration => {
                        console.log('SW registered: ', registration);
                    })
                    .catch(registrationError => {
                        console.log('SW registration failed: ', registrationError);
                    });
            });
        }
    }

    /**
     * Local Storage for User Preferences
     * Remembers user settings and preferences
     */
    loadUserPreferences() {
        const preferences = localStorage.getItem('campusconnect-preferences');
        if (preferences) {
            const parsed = JSON.parse(preferences);
            this.applyUserPreferences(parsed);
        }
    }

    saveUserPreferences(preferences) {
        localStorage.setItem('campusconnect-preferences', JSON.stringify(preferences));
    }

    applyUserPreferences(preferences) {
        // Apply theme, notification settings, etc.
        if (preferences.theme) {
            document.documentElement.setAttribute('data-theme', preferences.theme);
        }
    }

    /**
     * Event Listeners Setup
     * Handles user interactions and form submissions
     */
    setupEventListeners() {
        // Navigation toggle
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle) {
            navToggle.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                navToggle.setAttribute('aria-expanded', navMenu.classList.contains('active'));
            });
        }

        // Modal triggers
        document.addEventListener('click', (e) => {
            // Signup modal triggers
            if (e.target.id === 'signupBtn' || e.target.id === 'getStartedBtn' || e.target.id === 'joinNowBtn') {
                this.openSignupModal();
            }
            
            // Login modal triggers
            if (e.target.id === 'loginBtn') {
                this.openLoginModal();
            }
            
            // Contact modal triggers
            if (e.target.id === 'contactLink' || e.target.id === 'navContactLink') {
                this.openContactModal();
            }
            
            // Switch between login and signup
            if (e.target.id === 'switchToSignup') {
                e.preventDefault();
                this.closeModal();
                setTimeout(() => this.openSignupModal(), 300);
            }
            
            // Forgot password (placeholder)
            if (e.target.id === 'forgotPasswordLink') {
                e.preventDefault();
                this.showToast('Password reset functionality coming soon!', 'info');
            }
            
            // Close modal triggers
            if (e.target.classList.contains('modal-close') || e.target.classList.contains('modal')) {
                this.closeModal();
            }
        });

        // Form submissions
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => this.handleSignup(e));
            this.setupFormValidation(signupForm);
        }
        
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
            this.setupFormValidation(loginForm);
        }
        
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleContact(e));
            this.setupFormValidation(contactForm);
        }

        // Smooth scrolling for navigation
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Demo button functionality
        const watchDemoBtn = document.getElementById('watchDemoBtn');
        if (watchDemoBtn) {
            watchDemoBtn.addEventListener('click', () => this.showDemo());
        }
    }

    /**
     * Advanced Form Validation
     * Real-time validation with accessibility support
     */
    setupFormValidation(form) {
        const inputs = form.querySelectorAll('input, select');
        
        inputs.forEach(input => {
            // Real-time validation
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        let errorMessage = '';

        // Remove previous error states
        field.classList.remove('error');
        
        // Required field check
        if (field.hasAttribute('required') && !value) {
            isValid = false;
            errorMessage = `${this.getFieldLabel(field)} is required`;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Please enter a valid email address';
            }
        }
        
        // Password validation (for login)
        if (field.type === 'password' && value && value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters';
        }
        
        // Textarea validation (for contact)
        if (field.tagName === 'TEXTAREA' && value && value.length < 10) {
            isValid = false;
            errorMessage = 'Message must be at least 10 characters';
        }

        // Display error
        if (!isValid) {
            this.showFieldError(field, errorMessage);
        } else {
            this.clearFieldError(field);
        }

        return isValid;
    }

    showFieldError(field, message) {
        field.classList.add('error');
        field.setAttribute('aria-invalid', 'true');
        
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
        }
    }

    clearFieldError(field) {
        field.classList.remove('error');
        field.setAttribute('aria-invalid', 'false');
        
        const errorElement = document.getElementById(field.name + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
        }
    }

    getFieldLabel(field) {
        const label = document.querySelector(`label[for="${field.id}"]`);
        return label ? label.textContent : field.name;
    }

    /**
     * Modal Management
     * Accessible modal handling with focus management
     */
    openSignupModal() {
        const modal = document.getElementById('signupModal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Prevent background scroll
            document.body.style.overflow = 'hidden';
            
            this.announceToScreenReader('Sign up modal opened');
        }
    }

    openLoginModal() {
        const modal = document.getElementById('loginModal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Prevent background scroll
            document.body.style.overflow = 'hidden';
            
            this.announceToScreenReader('Login modal opened');
        }
    }

    openContactModal() {
        const modal = document.getElementById('contactModal');
        if (modal) {
            modal.classList.add('show');
            modal.setAttribute('aria-hidden', 'false');
            
            // Focus first input
            const firstInput = modal.querySelector('input');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
            
            // Prevent background scroll
            document.body.style.overflow = 'hidden';
            
            this.announceToScreenReader('Contact modal opened');
        }
    }

    closeModal() {
        const modal = document.querySelector('.modal.show');
        if (modal) {
            modal.classList.remove('show');
            modal.setAttribute('aria-hidden', 'true');
            document.body.style.overflow = '';
            
            // Return focus to trigger button
            const triggerBtn = document.getElementById('signupBtn');
            if (triggerBtn) {
                triggerBtn.focus();
            }
            
            this.announceToScreenReader('Modal closed');
        }
    }

    /**
     * Form Submission Handler
     * Processes signup with validation and feedback
     */
    async handleSignup(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input, select');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.announceToScreenReader('Please correct the errors in the form');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            const result = await this.simulateSignup(Object.fromEntries(formData));
            
            // Success feedback
            this.showSuccessMessage('Account created successfully! Welcome to CampusConnect.');
            this.closeModal();
            
            // Automatically log in the user after successful signup
            localStorage.setItem('campusconnect-current-user', JSON.stringify(result.user));
            
            // Update UI for logged in state
            this.updateUIForLoggedInUser();
            
        } catch (error) {
            this.showErrorMessage('Something went wrong. Please try again.');
            console.error('Signup error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateSignup(userData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Create user object
        const newUser = {
            ...userData,
            id: Date.now(),
            joinDate: new Date().toISOString()
        };
        
        // Store user data locally (in real app, would send to server)
        const users = JSON.parse(localStorage.getItem('campusconnect-users') || '[]');
        users.push(newUser);
        localStorage.setItem('campusconnect-users', JSON.stringify(users));
        
        return { success: true, user: newUser };
    }

    /**
     * Login Handler
     * Processes user login with validation and authentication
     */
    async handleLogin(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.announceToScreenReader('Please correct the errors in the form');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateLogin(Object.fromEntries(formData));
            
            // Success feedback
            this.showSuccessMessage('Welcome back! You have successfully logged in.');
            this.closeModal();
            
            // Update UI for logged in state
            this.updateUIForLoggedInUser();
            
        } catch (error) {
            this.showErrorMessage('Invalid email or password. Please try again.');
            console.error('Login error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateLogin(userData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Simple validation (in real app, would validate against server)
        const users = JSON.parse(localStorage.getItem('campusconnect-users') || '[]');
        const user = users.find(u => u.email === userData.loginEmail);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        // Store current user session
        localStorage.setItem('campusconnect-current-user', JSON.stringify(user));
        
        return { success: true, user };
    }

    /**
     * Contact Form Handler
     * Processes contact form submissions
     */
    async handleContact(e) {
        e.preventDefault();
        
        const form = e.target;
        const formData = new FormData(form);
        
        // Validate all fields
        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.announceToScreenReader('Please correct the errors in the form');
            return;
        }
        
        // Show loading state
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate API call
            await this.simulateContactSubmission(Object.fromEntries(formData));
            
            // Success feedback
            this.showSuccessMessage('Thank you for your message! We will get back to you soon.');
            this.closeModal();
            
            // Reset form
            form.reset();
            
        } catch (error) {
            this.showErrorMessage('Something went wrong. Please try again later.');
            console.error('Contact error:', error);
        } finally {
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    async simulateContactSubmission(contactData) {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Store contact submission locally (in real app, would send to server)
        const submissions = JSON.parse(localStorage.getItem('campusconnect-contacts') || '[]');
        submissions.push({
            ...contactData,
            id: Date.now(),
            submittedAt: new Date().toISOString(),
            status: 'new'
        });
        localStorage.setItem('campusconnect-contacts', JSON.stringify(submissions));
        
        return { success: true };
    }

    /**
     * Update UI for logged in user
     */
    updateUIForLoggedInUser() {
        const currentUser = JSON.parse(localStorage.getItem('campusconnect-current-user') || 'null');
        
        if (currentUser) {
            // Update navigation buttons
            const navAuth = document.querySelector('.nav-auth');
            if (navAuth) {
                navAuth.innerHTML = `
                    <span class="user-greeting">Welcome, ${currentUser.email.split('@')[0]}!</span>
                    <button class="btn btn-outline" id="logoutBtn">Logout</button>
                `;
                
                // Add logout functionality
                document.getElementById('logoutBtn').addEventListener('click', () => {
                    this.handleLogout();
                });
            }

            // Show dashboard and hide main content
            this.showDashboard(currentUser);
        }
    }

    /**
     * Show Dashboard
     */
    showDashboard(user) {
        // Hide main content sections
        const sectionsToHide = ['home', 'how-it-works', 'features', 'what-you-can-do'];
        sectionsToHide.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'none';
            }
        });

        // Hide CTA section
        const ctaSection = document.querySelector('.cta');
        if (ctaSection) {
            ctaSection.style.display = 'none';
        }

        // Show dashboard
        const dashboard = document.getElementById('userDashboard');
        if (dashboard) {
            dashboard.style.display = 'block';
            
            // Update welcome message
            const welcomeMsg = document.getElementById('userWelcome');
            if (welcomeMsg) {
                welcomeMsg.textContent = `Hello ${user.email.split('@')[0]}, ready to find your perfect study partner?`;
            }
        }

        // Setup dashboard button functionality
        this.setupDashboardButtons();
    }

    /**
     * Setup Dashboard Button Functionality
     */
    setupDashboardButtons() {
        // Profile building
        const buildProfileBtn = document.getElementById('buildProfileBtn');
        if (buildProfileBtn) {
            buildProfileBtn.addEventListener('click', () => {
                this.openProfileBuilder();
            });
        }

        // Study preferences
        const setPreferencesBtn = document.getElementById('setPreferencesBtn');
        if (setPreferencesBtn) {
            setPreferencesBtn.addEventListener('click', () => {
                this.openPreferencesModal();
            });
        }

        // Find partners
        const findPartnersBtn = document.getElementById('findPartnersBtn');
        if (findPartnersBtn) {
            findPartnersBtn.addEventListener('click', () => {
                this.showMatchingInterface();
            });
        }

        // Browse requests
        const browseRequestsBtn = document.getElementById('browseRequestsBtn');
        if (browseRequestsBtn) {
            browseRequestsBtn.addEventListener('click', () => {
                this.showStudyRequests();
            });
        }

        // Create session
        const createSessionBtn = document.getElementById('createSessionBtn');
        if (createSessionBtn) {
            createSessionBtn.addEventListener('click', () => {
                this.openSessionCreator();
            });
        }

        // Messages
        const messagesBtn = document.getElementById('messagesBtn');
        if (messagesBtn) {
            messagesBtn.addEventListener('click', () => {
                this.openMessagingInterface();
            });
        }

        // Study history
        const studyHistoryBtn = document.getElementById('studyHistoryBtn');
        if (studyHistoryBtn) {
            studyHistoryBtn.addEventListener('click', () => {
                this.showStudyHistory();
            });
        }

        // Favourites
        const favouritesBtn = document.getElementById('favouritesBtn');
        if (favouritesBtn) {
            favouritesBtn.addEventListener('click', () => {
                this.showFavouritePartners();
            });
        }

        // Recommendations
        const recommendationsBtn = document.getElementById('recommendationsBtn');
        if (recommendationsBtn) {
            recommendationsBtn.addEventListener('click', () => {
                this.showRecommendations();
            });
        }
    }

    /**
     * Dashboard Feature Methods (Placeholder implementations)
     */
    openProfileBuilder() {
        this.showToast('Profile builder coming soon! Complete your profile to get better matches.', 'info');
    }

    openPreferencesModal() {
        this.showToast('Preferences panel coming soon! Set your study style and availability.', 'info');
    }

    showMatchingInterface() {
        this.showToast('Matching interface loading... Found 3 potential study partners!', 'success');
    }

    showStudyRequests() {
        this.showToast('Study requests loaded! Browse 5 new study sessions from other students.', 'info');
    }

    openSessionCreator() {
        this.showToast('Session creator opening... Create your study session post.', 'info');
    }

    openMessagingInterface() {
        this.showToast('Messages loading... You have 2 new messages from study partners.', 'info');
    }

    showStudyHistory() {
        this.showToast('Study history loaded! Review your 3 completed study sessions.', 'info');
    }

    showFavouritePartners() {
        this.showToast('Favourite partners loaded! You have 1 saved study partner.', 'info');
    }

    showRecommendations() {
        this.showToast('Recommendations loaded! 4 new study partner suggestions available.', 'success');
    }

    /**
     * Logout Handler
     */
    handleLogout() {
        localStorage.removeItem('campusconnect-current-user');
        
        // Reset navigation
        const navAuth = document.querySelector('.nav-auth');
        if (navAuth) {
            navAuth.innerHTML = `
                <button class="btn btn-outline" id="loginBtn">Login</button>
                <button class="btn btn-primary" id="signupBtn">Sign Up</button>
            `;
        }

        // Hide dashboard and show main content
        const dashboard = document.getElementById('userDashboard');
        if (dashboard) {
            dashboard.style.display = 'none';
        }

        // Show main content sections
        const sectionsToShow = ['home', 'how-it-works', 'features', 'what-you-can-do'];
        sectionsToShow.forEach(sectionId => {
            const section = document.getElementById(sectionId);
            if (section) {
                section.style.display = 'block';
            }
        });

        // Show CTA section
        const ctaSection = document.querySelector('.cta');
        if (ctaSection) {
            ctaSection.style.display = 'block';
        }
        
        this.showSuccessMessage('You have been logged out successfully.');
    }

    /**
     * Check if user is already logged in
     */
    checkUserSession() {
        const currentUser = JSON.parse(localStorage.getItem('campusconnect-current-user') || 'null');
        if (currentUser) {
            this.updateUIForLoggedInUser();
        }
    }

    /**
     * Demo Functionality
     * Interactive demo of the matching process
     */
    showDemo() {
        // Create demo overlay
        const demoOverlay = document.createElement('div');
        demoOverlay.className = 'demo-overlay';
        demoOverlay.innerHTML = `
            <div class="demo-content">
                <h3>🎯 Smart Matching Demo</h3>
                <div class="demo-step">
                    <div class="demo-profile">
                        <img src="assets/images/demo-user.jpg" alt="Your profile">
                        <div>
                            <h4>You</h4>
                            <p>Computer Science • Prefers Discussion</p>
                            <div class="subjects">
                                <span class="subject-tag">JavaScript</span>
                                <span class="subject-tag">Algorithms</span>
                            </div>
                        </div>
                    </div>
                    <div class="demo-arrow">→</div>
                    <div class="demo-matches">
                        <div class="match-card">
                            <div class="match-score">95% Match</div>
                            <h4>Sarah M.</h4>
                            <p>Available: Mon 2-4 PM</p>
                        </div>
                        <div class="match-card">
                            <div class="match-score">87% Match</div>
                            <h4>Mike L.</h4>
                            <p>Available: Tue 10-12 AM</p>
                        </div>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="this.parentElement.parentElement.remove()">
                    Close Demo
                </button>
            </div>
        `;
        
        document.body.appendChild(demoOverlay);
        
        // Animate demo
        setTimeout(() => {
            demoOverlay.classList.add('show');
        }, 100);
    }

    /**
     * Feedback System
     * User feedback with accessible announcements
     */
    showSuccessMessage(message) {
        this.showToast(message, 'success');
        this.announceToScreenReader(message);
    }

    showErrorMessage(message) {
        this.showToast(message, 'error');
        this.announceToScreenReader(message);
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        toast.setAttribute('role', 'alert');
        
        document.body.appendChild(toast);
        
        // Show toast
        setTimeout(() => toast.classList.add('show'), 100);
        
        // Remove toast
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }

    /**
     * Load Mock Data for Demo
     * Simulates real user data for testing
     */
    loadMockData() {
        this.users = [
            {
                id: 1,
                name: 'Sarah M.',
                major: 'Computer Science',
                year: 3,
                subjects: ['JavaScript', 'Algorithms', 'Data Structures'],
                studyStyle: 'discussion',
                schedule: [
                    { day: 'Monday', time: '14:00-16:00' },
                    { day: 'Wednesday', time: '10:00-12:00' }
                ],
                location: 'Engineering',
                rating: 4.8,
                avatar: 'assets/images/user1.jpg'
            },
            {
                id: 2,
                name: 'Mike L.',
                major: 'Computer Science',
                year: 2,
                subjects: ['JavaScript', 'Web Development', 'Databases'],
                studyStyle: 'silent',
                schedule: [
                    { day: 'Tuesday', time: '10:00-12:00' },
                    { day: 'Thursday', time: '14:00-16:00' }
                ],
                location: 'Library',
                rating: 4.6,
                avatar: 'assets/images/user2.jpg'
            }
        ];
    }
}

// Additional utility functions for enhanced UX

/**
 * Utility Functions
 */
const Utils = {
    // Debounce function for performance
    debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    },

    // Format time for display
    formatTime(time) {
        const [hour, minute] = time.split(':');
        const hourNum = parseInt(hour);
        const ampm = hourNum >= 12 ? 'PM' : 'AM';
        const displayHour = hourNum % 12 || 12;
        return `${displayHour}:${minute} ${ampm}`;
    },

    // Calculate study session duration
    calculateDuration(startTime, endTime) {
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        const diffMs = end - start;
        const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
    },

    // Animate number counters
    animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            element.textContent = Math.floor(start);
            
            if (start >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    }
};

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.campusConnect = new CampusConnect();
    
    // Animate hero stats when they come into view
    const stats = document.querySelectorAll('.stat-number');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const value = parseInt(target.textContent.replace(/[^0-9]/g, ''));
                Utils.animateCounter(target, value);
                observer.unobserve(target);
            }
        });
    });
    
    stats.forEach(stat => observer.observe(stat));
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { CampusConnect, Utils };
}