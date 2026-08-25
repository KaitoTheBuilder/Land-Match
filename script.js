const MOCK_USERS = {
    farmer: { id: 'f1', role: 'farmer', name: 'Juan Dela Cruz', email: 'juan@example.com' },
    owner: { id: 'o1', role: 'owner', name: 'Mr. Reyes', email: 'reyes@example.com' }
};

const MOCK_LISTINGS = [
    { id: 1, location: "Pili, Camarines Sur", size: "2.5 Hectares", soil: "Volcanic Soil", price: 25000, period: "Annual", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80", distance: "5 km from you", moisture: "Optimal", temp: "28°C" },
    { id: 2, location: "Bula, Camarines Sur", size: "5.0 Hectares", soil: "Rich Loam", price: 40000, period: "Annual", image: "https://unsplash.com/photos/house-in-green-fields-and-vineyards-WPapb9IqRKw?auto=format&fit=crop&w=800&q=80", distance: "12 km from you", moisture: "High", temp: "26°C" },
    { id: 3, location: "Nabua, Camarines Sur", size: "1.2 Hectares", soil: "Clay Loam", price: 15000, period: "Semi-Annual", image: "https://images.unsplash.com/photo-1605000797499-95a51c5269ae?auto=format&fit=crop&w=800&q=80", distance: "18 km from you", moisture: "Medium", temp: "30°C" }
];

const MOCK_REQUESTS = [
    { id: 101, farmerName: "Juan Dela Cruz", verified: true, intent: "I want to plant corn this season. I need land with good water supply.", requestedSize: "2.0 Hectares", date: "Oct 12", experience: "8 Years", rating: 4.9, pastLeases: 4, badges: ['Identity Verified', 'DOA Registered', 'Clean Background Check'] },
    { id: 102, farmerName: "Maria Santos", verified: false, intent: "I am starting a vegetable farm to sell at the local market.", requestedSize: "1.5 Hectares", date: "Oct 11", experience: "2 Years", rating: 4.2, pastLeases: 1, badges: ['Email Verified'] }
];

let MOCK_CHATS = [
    { id: 'c1', partnerName: 'Mr. Reyes (Owner)', property: '2.5 Hectares - Pili', price: 25000, phone: '+63 917 123 4567', email: 'reyes.properties@email.com', messages: [ { sender: 'them', text: 'Hello! I saw your plant request for my land in Pili.', time: '10:40 AM' }, { sender: 'me', text: 'Good morning. Yes, I would like to lease it. Is it ready for planting?', time: '10:42 AM' }, { sender: 'them', text: 'Yes, it is available. Standard terms apply. We can start the payment process when you are ready.', time: '10:45 AM' }, { sender: 'them', text: 'Here is a recent photo of the soil condition after the last rain.', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80', time: '10:46 AM' } ] },
    { id: 'c2', partnerName: 'Maria Santos (Farmer)', property: '1.2 Hectares - Nabua', price: 15000, phone: '+63 920 987 6543', email: 'm.santos@email.com', messages: [ { sender: 'me', text: 'I have accepted your plant request.', time: 'Yesterday' }, { sender: 'them', text: 'Thank you, I will review the contract.', time: 'Yesterday' } ] }
];

const MOCK_HISTORY = [
    { id: 'h1', title: '1.2 Hectares - Nabua', date: 'Jan 2026 - Jun 2026', status: 'Completed', amount: 15000 },
    { id: 'h2', title: '3.0 Hectares - Ocampo', date: 'Mar 2025 - Mar 2026', status: 'Completed', amount: 35000 }
];

const MOCK_ACTIVE_LISTINGS = [
    { id: 'l1', location: "Pili, Camarines Sur", size: "2.5 Hectares", price: 25000, status: "Active - 2 Requests", image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80" }
];

let MOCK_PENDING_REQUESTS = [
    { id: 'p1', property: '5.0 Hectares - Bula', date: 'Yesterday', status: 'Awaiting Owner Approval' }
];

const MOCK_NOTIFICATIONS = [
    { id: 2, title: 'Escrow Payment Secured', desc: 'Your payment of ₱25,000 is safely held in escrow.', time: '1h ago', icon: 'shield-check', color: 'text-secondary' },
    { id: 3, title: 'New Land Alert', desc: 'A new 4.0 Hectare property matching your Volcanic Soil filter was listed.', time: '1d ago', icon: 'map-pin', color: 'text-[#D97706]' }
];

let state = {
    currentUser: null,
    activeTab: 'home', 
    authMode: 'signin', 
    authRole: 'farmer',
    authLoading: false,
    
    farmerIndex: 0,
    swipeHistory: [], 
    showFilters: false,
    showMatchModal: false,
    matchedProperty: null,
    
    selectedFarmerProfile: null, 
    
    selectedChatId: null,
    aiWidgetOpen: false,
    showNotifications: false,
    messagesViewTab: 'active',

    showContractModal: false,
    contractSigned: false,
    isProcessingPayment: false,
    paymentComplete: false
};

function setState(newState) {
    state = { ...state, ...newState };
    renderApp();
}

function animateAndSwipe(direction) {
    const card = document.getElementById('swipe-card');
    if (!card) return executeSwipe(direction);
    
    const windowWidth = window.innerWidth;
    card.style.transition = 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.3s ease-out';
    card.style.transform = `translate(${direction === 'right' ? windowWidth : -windowWidth}px, ${direction === 'right' ? 20 : -20}deg)`;
    card.style.opacity = '0';
    
    setTimeout(() => {
        executeSwipe(direction);
    }, 300);
}

function executeSwipe(direction) {
    if (state.farmerIndex >= MOCK_LISTINGS.length) return;
    
    const currentProperty = MOCK_LISTINGS[state.farmerIndex];
    
    if (direction === 'right') {
        MOCK_PENDING_REQUESTS.unshift({
            id: 'p' + Date.now(),
            property: currentProperty.size + ' - ' + currentProperty.location.split(',')[0],
            date: 'Just now',
            status: 'Awaiting Owner Approval'
        });
    }
    
    setState({ 
        swipeHistory: [...state.swipeHistory, state.farmerIndex], 
        farmerIndex: state.farmerIndex + 1, 
        showMatchModal: direction === 'right' ? true : state.showMatchModal,
        matchedProperty: direction === 'right' ? currentProperty : state.matchedProperty
    });
}

window.actions = {
    setAuthMode: (mode) => setState({ authMode: mode }),
    setAuthRole: (role) => setState({ authRole: role }),
    submitAuth: (e) => {
        e.preventDefault();
        setState({ authLoading: true });
        setTimeout(() => {
            const nameInput = document.getElementById('auth-name');
            const user = { ...MOCK_USERS[state.authRole] };
            if (state.authMode === 'signup' && nameInput) user.name = nameInput.value;
            setState({ currentUser: user, authLoading: false });
        }, 600);
    },
    logout: () => setState({ currentUser: null, activeTab: 'home', showMatchModal: false, selectedChatId: null, contractSigned: false, paymentComplete: false, showNotifications: false }),
    setTab: (tab) => setState({ activeTab: tab, selectedChatId: null, showFilters: false, contractSigned: false, paymentComplete: false, showNotifications: false, messagesViewTab: 'active' }),
    setMessagesViewTab: (tab) => setState({ messagesViewTab: tab }),

    swipePass: () => animateAndSwipe('left'),
    swipePlant: () => animateAndSwipe('right'),
    undoSwipe: () => {
        if (state.swipeHistory.length === 0) return;
        const newHistory = [...state.swipeHistory];
        const prevIndex = newHistory.pop();
        setState({ swipeHistory: newHistory, farmerIndex: prevIndex });
    },
    resetSwipes: () => setState({ farmerIndex: 0, swipeHistory: [] }),
    toggleFilters: (val) => setState({ showFilters: val }),
    closeMatchModal: () => setState({ showMatchModal: false }),

    openFarmerProfile: (id) => {
        const farmer = MOCK_REQUESTS.find(r => r.id === id);
        setState({ selectedFarmerProfile: farmer });
    },
    closeFarmerProfile: () => setState({ selectedFarmerProfile: null }),
    messageFarmerFromProfile: () => {
        setState({ selectedFarmerProfile: null, activeTab: 'messages', selectedChatId: 'c2', contractSigned: false, paymentComplete: false });
    },

    selectChat: (id) => setState({ selectedChatId: id, contractSigned: false, paymentComplete: false }),
    sendMessage: () => {
        const input = document.getElementById('chat-input');
        const text = input ? input.value.trim() : '';
        if (!text || !state.selectedChatId) return;
        const chatIndex = MOCK_CHATS.findIndex(c => c.id === state.selectedChatId);
        if (chatIndex > -1) {
            MOCK_CHATS[chatIndex].messages.push({ sender: 'me', text: text, time: 'Just now' });
            renderApp(); 
            setTimeout(() => {
                const box = document.getElementById('chat-messages-box');
                if(box) box.scrollTop = box.scrollHeight;
            }, 50);
        }
    },
    sendPhoto: () => {
        if (!state.selectedChatId) return;
        const chatIndex = MOCK_CHATS.findIndex(c => c.id === state.selectedChatId);
        if (chatIndex > -1) {
            MOCK_CHATS[chatIndex].messages.push({ 
                sender: 'me', 
                text: 'Here is the proof of the transaction processing.', 
                image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80', 
                time: 'Just now' 
            });
            renderApp(); 
            setTimeout(() => {
                const box = document.getElementById('chat-messages-box');
                if(box) box.scrollTop = box.scrollHeight;
            }, 50);
        }
    },
    openContractModal: () => setState({ showContractModal: true }),
    closeContractModal: () => setState({ showContractModal: false }),
    signContract: () => setState({ contractSigned: true, showContractModal: false }),

    processPayment: () => {
        setState({ isProcessingPayment: true });
        setTimeout(() => {
            setState({ isProcessingPayment: false, paymentComplete: true });
        }, 1500); 
    },

    toggleAiWidget: () => setState({ aiWidgetOpen: !state.aiWidgetOpen }),
    toggleNotifications: () => setState({ showNotifications: !state.showNotifications })
};

function getAuthHTML() {
    const isSignIn = state.authMode === 'signin';
    const bgUrl = "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80";
    const logoUrl = "https://raw.githubusercontent.com/KaitoTheBuilder/Land-Match/main/assets/Land%20Match.jpeg";
    
    return `
    <div class="min-h-screen flex flex-col md:flex-row bg-bg text-text">
        <div class="w-full md:w-5/12 p-8 md:p-16 flex flex-col justify-between relative overflow-hidden bg-primary text-bg min-h-[40vh] md:min-h-screen">
            <div class="absolute inset-0 z-0 opacity-20 pointer-events-none mix-blend-overlay">
                <img src="${bgUrl}" onerror="this.style.display='none'" alt="Farm Field" class="w-full h-full object-cover grayscale" />
            </div>
            <div class="relative z-10 flex flex-col h-full justify-center md:justify-start">
                <div class="flex items-center gap-4 mb-8 md:mb-16">
                    <img src="${logoUrl}" alt="Land Match Logo" class="w-12 h-12 object-cover rounded-full shadow-lg border-2 border-white/20" />
                    <span class="font-display font-medium tracking-wide text-xl">Land Match</span>
                </div>
                <div class="mt-4 md:mt-8">
                    <h1 class="font-display text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4 md:mb-6">Cultivate<br />connections.</h1>
                    <p class="font-light max-w-sm leading-relaxed text-sm sm:text-base md:text-lg opacity-80">A premium marketplace for agricultural operators and property owners to seamlessly negotiate leases.</p>
                </div>
            </div>
        </div>

        <div class="w-full md:w-7/12 p-6 sm:p-8 md:p-24 flex items-center justify-center bg-bg animate-view">
            <div class="w-full max-w-md bg-white p-6 sm:p-8 rounded-2xl shadow-xl shadow-accent/10 border border-accent/40">
                <div class="flex gap-4 sm:gap-8 mb-8 border-b border-accent/40">
                    <button onclick="actions.setAuthMode('signin')" class="flex-1 pb-4 text-sm font-medium relative transition-colors ${isSignIn ? 'text-primary' : 'text-text/50 hover:text-text'}">
                        Sign In
                        ${isSignIn ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>' : ''}
                    </button>
                    <button onclick="actions.setAuthMode('signup')" class="flex-1 pb-4 text-sm font-medium relative transition-colors ${!isSignIn ? 'text-primary' : 'text-text/50 hover:text-text'}">
                        Create Account
                        ${!isSignIn ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>' : ''}
                    </button>
                </div>

                <form onsubmit="actions.submitAuth(event)" class="flex flex-col gap-6">
                    <div>
                        <label class="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-3 text-text/70">Account Type</label>
                        <div class="grid grid-cols-2 gap-4">
                            <button type="button" onclick="actions.setAuthRole('farmer')" class="p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${state.authRole === 'farmer' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-accent/50 text-text/50 hover:border-primary/50'}">
                                <i data-lucide="tractor" class="w-5 h-5 sm:w-6 sm:h-6"></i>
                                <span class="text-xs sm:text-sm font-medium">Farmer</span>
                            </button>
                            <button type="button" onclick="actions.setAuthRole('owner')" class="p-3 sm:p-4 rounded-2xl flex flex-col items-center justify-center gap-2 transition-all border ${state.authRole === 'owner' ? 'border-primary bg-primary/5 text-primary shadow-sm' : 'border-accent/50 text-text/50 hover:border-primary/50'}">
                                <i data-lucide="briefcase" class="w-5 h-5 sm:w-6 sm:h-6"></i>
                                <span class="text-xs sm:text-sm font-medium">Landowner</span>
                            </button>
                        </div>
                    </div>

                    <div class="flex flex-col gap-4">
                        ${!isSignIn ? `
                        <div>
                            <label class="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 text-text/70">Full Name</label>
                            <div class="relative group">
                                <i data-lucide="user" class="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 w-4 h-4 group-focus-within:text-primary transition-colors"></i>
                                <input id="auth-name" type="text" required class="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-bg border border-accent/40 text-text hover:border-accent shadow-sm" placeholder="Juan Dela Cruz" />
                            </div>
                        </div>
                        ` : ''}
                        <div>
                            <label class="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 text-text/70">Email Address</label>
                            <div class="relative group">
                                <i data-lucide="mail" class="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 w-4 h-4 group-focus-within:text-primary transition-colors"></i>
                                <input type="email" required class="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-bg border border-accent/40 text-text hover:border-accent shadow-sm" placeholder="name@email.com" />
                            </div>
                        </div>
                        <div>
                            <label class="block text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 text-text/70">Password</label>
                            <div class="relative group">
                                <i data-lucide="lock" class="absolute left-3 top-1/2 -translate-y-1/2 text-text/40 w-4 h-4 group-focus-within:text-primary transition-colors"></i>
                                <input type="password" required class="w-full pl-10 pr-4 py-3 rounded-xl text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all bg-bg border border-accent/40 text-text hover:border-accent shadow-sm" placeholder="••••••••" />
                            </div>
                        </div>
                    </div>

                    <button type="submit" ${state.authLoading ? 'disabled' : ''} class="w-full mt-2 py-4 rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2 bg-primary text-bg hover:opacity-90 shadow-md">
                        ${state.authLoading ? '<i data-lucide="loader" class="w-4 h-4 animate-spin"></i> Processing' : (isSignIn ? 'Access Account' : 'Initialize Account')}
                    </button>
                </form>
            </div>
        </div>
    </div>`;
}

function getHeaderHTML() {
    const logoUrl = "https://placehold.co/80x80/335C32/F9F8F6?text=LM&font=Montserrat";
    return `
    <header class="sticky top-0 z-40 glass-panel px-4 sm:px-6 py-3 sm:py-4 flex justify-between items-center shadow-sm">
        <div class="flex items-center gap-3 sm:gap-4">
            <img src="${logoUrl}" alt="Logo" class="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-accent/40 shadow-sm" />
            <div class="hidden sm:block">
                <h1 class="font-display font-medium text-base sm:text-lg tracking-wide leading-none text-text">Land Match</h1>
                <p class="text-[9px] sm:text-[10px] uppercase tracking-widest mt-1 font-semibold text-secondary">${state.currentUser.role}</p>
            </div>
        </div>
        
        <div class="flex items-center gap-4 sm:gap-8">
            <nav class="hidden md:flex items-center gap-8 pr-8 border-r border-accent/40">
                <button onclick="actions.setTab('home')" class="text-sm font-medium transition-colors ${state.activeTab === 'home' ? 'text-primary' : 'text-text/60 hover:text-text'}">Dashboard</button>
                <button onclick="actions.setTab('messages')" class="text-sm font-medium transition-colors ${state.activeTab === 'messages' ? 'text-primary' : 'text-text/60 hover:text-text'}">Messages</button>
                <button onclick="actions.setTab('profile')" class="text-sm font-medium transition-colors ${state.activeTab === 'profile' ? 'text-primary' : 'text-text/60 hover:text-text'}">Profile</button>
            </nav>
            
            <div class="flex items-center gap-3 sm:gap-4">
                <div class="relative">
                    <button onclick="actions.toggleNotifications()" class="p-2 transition-colors text-text/50 hover:text-text bg-bg rounded-full border border-accent/20 shadow-sm relative">
                        <i data-lucide="bell" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                        <span class="absolute top-0 right-0 w-2 h-2 rounded-full bg-[#D97706] shadow-sm"></span>
                    </button>
                    ${state.showNotifications ? `
                    <div class="absolute right-0 mt-2 w-72 sm:w-80 glass-panel rounded-2xl shadow-xl border border-accent/40 overflow-hidden z-50 animate-view" style="transform-origin: top right;">
                        <div class="p-4 border-b border-accent/30 bg-white/50 flex justify-between items-center">
                            <h3 class="font-display font-medium text-sm text-text">Notifications</h3>
                            <button onclick="actions.toggleNotifications()" class="text-text/50 hover:text-text"><i data-lucide="x" class="w-4 h-4"></i></button>
                        </div>
                        <div class="max-h-[60vh] overflow-y-auto bg-white/80">
                            ${MOCK_NOTIFICATIONS.map(notif => `
                                <div class="p-4 border-b border-accent/20 hover:bg-bg/80 transition-colors flex gap-3 items-start cursor-pointer">
                                    <div class="mt-0.5 w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-accent/20 ${notif.color}">
                                        <i data-lucide="${notif.icon}" class="w-4 h-4"></i>
                                    </div>
                                    <div>
                                        <p class="text-xs font-medium text-text mb-0.5">${notif.title}</p>
                                        <p class="text-[10px] text-text/70 leading-relaxed mb-1">${notif.desc}</p>
                                        <p class="text-[8px] font-semibold uppercase tracking-widest text-text/40">${notif.time}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <div class="p-3 text-center bg-white/50 border-t border-accent/30">
                            <button onclick="actions.toggleNotifications()" class="text-[10px] font-semibold uppercase tracking-widest text-primary hover:underline">Mark all as read</button>
                        </div>
                    </div>
                    ` : ''}
                </div>
                <div class="text-right hidden sm:block">
                    <p class="text-sm font-medium leading-none text-text">${state.currentUser.name}</p>
                </div>
                <button onclick="actions.logout()" class="p-2 transition-colors text-text/50 hover:text-text bg-bg rounded-full border border-accent/20 shadow-sm">
                    <i data-lucide="log-out" class="w-4 h-4 sm:w-5 sm:h-5"></i>
                </button>
            </div>
        </div>
    </header>`;
}

function getFilterDrawerHTML() {
    return `
    <div class="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${state.showFilters ? 'opacity-100 animate-backdrop' : 'opacity-0 pointer-events-none'}">
        <div class="w-full max-w-xs sm:max-w-sm bg-white h-full shadow-2xl flex flex-col transition-transform duration-300 transform border-l border-accent/40 ${state.showFilters ? 'translate-x-0' : 'translate-x-full'}">
            <div class="p-6 flex justify-between items-center border-b border-accent/40 bg-bg/50">
                <h2 class="font-display text-lg font-medium tracking-wide text-text flex items-center gap-2"><i data-lucide="sliders-horizontal" class="w-5 h-5 text-primary"></i> Search Preferences</h2>
                <button onclick="actions.toggleFilters(false)" class="p-2 text-text/50 hover:text-text bg-white rounded-full border border-accent/30 shadow-sm"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div class="flex-1 p-6 overflow-y-auto space-y-8">
                <div>
                    <label class="block text-[10px] font-semibold uppercase tracking-widest mb-4 text-text/70">Distance Radius (km)</label>
                    <input type="range" min="1" max="50" value="15" />
                    <div class="flex justify-between text-xs mt-2 text-text/50 font-medium"><span>1 km</span><span>50 km</span></div>
                </div>
                <div>
                    <label class="block text-[10px] font-semibold uppercase tracking-widest mb-4 text-text/70">Price Range (₱)</label>
                    <input type="range" min="10000" max="100000" value="40000" />
                    <div class="flex justify-between text-xs mt-2 text-text/50 font-medium"><span>₱10k</span><span>₱100k+</span></div>
                </div>
                <div>
                    <label class="block text-[10px] font-semibold uppercase tracking-widest mb-4 text-text/70">Soil Preferences</label>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 accent-[#335C32]" /><span class="text-sm font-medium text-text">Volcanic Soil (High Yield)</span></label>
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 accent-[#335C32]" /><span class="text-sm font-medium text-text">Rich Loam</span></label>
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" class="w-4 h-4 accent-[#335C32]" /><span class="text-sm font-medium text-text">Clay Loam</span></label>
                    </div>
                </div>
                <div>
                    <label class="block text-[10px] font-semibold uppercase tracking-widest mb-4 text-text/70">Lease Duration</label>
                    <div class="space-y-3">
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 accent-[#335C32]" /><span class="text-sm font-medium text-text">Annual (12 Months)</span></label>
                        <label class="flex items-center gap-3 cursor-pointer"><input type="checkbox" checked class="w-4 h-4 accent-[#335C32]" /><span class="text-sm font-medium text-text">Semi-Annual (6 Months)</span></label>
                    </div>
                </div>
            </div>
            <div class="p-6 border-t border-accent/40 bg-bg/50">
                <button onclick="actions.toggleFilters(false)" class="w-full py-4 rounded-xl text-sm font-medium transition-colors bg-primary text-bg hover:opacity-90 shadow-md flex items-center justify-center gap-2">
                    <i data-lucide="check-circle-2" class="w-4 h-4"></i> Apply Filters
                </button>
            </div>
        </div>
    </div>`;
}

function getFarmerViewHTML() {
    if (state.farmerIndex >= MOCK_LISTINGS.length) {
        return `
        <div class="flex-1 flex flex-col items-center justify-center p-6 text-center min-h-[60vh] relative animate-view">
            <button onclick="actions.toggleFilters(true)" class="absolute top-4 right-4 sm:top-6 sm:right-6 p-3 bg-white rounded-full shadow-sm border border-accent/50 text-text hover:bg-bg transition-colors flex items-center gap-2">
                <i data-lucide="sliders-horizontal" class="w-4 h-4"></i> <span class="text-xs font-semibold uppercase tracking-widest hidden sm:inline">Filters</span>
            </button>
            <div class="w-16 h-16 rounded-full flex items-center justify-center mb-6 shadow-inner border border-accent/50 bg-bg">
                <i data-lucide="search" class="w-6 h-6 text-primary"></i>
            </div>
            <h2 class="font-display text-xl font-medium mb-2 text-text">No more land available.</h2>
            <p class="text-sm mb-8 max-w-sm text-text/60">You have reviewed all available agricultural properties matching your filters.</p>
            <button onclick="actions.resetSwipes()" class="px-6 py-3 bg-white rounded-xl text-sm font-medium transition-colors border border-accent/50 text-text hover:bg-bg shadow-sm">Reset Swipes</button>
            ${getFilterDrawerHTML()}
        </div>`;
    }

    const item = MOCK_LISTINGS[state.farmerIndex];
    return `
    <div class="flex flex-col h-full w-full max-w-lg mx-auto p-4 sm:p-8 justify-center items-center relative min-h-[70vh] animate-view">
        <div class="w-full flex justify-end mb-4">
            <button onclick="actions.toggleFilters(true)" class="flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-xs font-semibold uppercase tracking-widest transition-colors hover:bg-bg border border-accent/50 text-text">
                <i data-lucide="sliders-horizontal" class="w-4 h-4"></i> Filters
            </button>
        </div>

        <div id="swipe-card" class="w-full bg-white rounded-2xl overflow-hidden shadow-xl shadow-accent/10 border border-accent/50 cursor-grab active:cursor-grabbing select-none" style="touch-action: none; transform-origin: 50% 100%;">
            <div class="relative w-full aspect-[4/3] bg-bg pointer-events-none">
                <img src="${item.image}" onerror="this.onerror=null; this.src='https://placehold.co/800x600/709F40/FFFFFF?text=Agricultural+Land'" alt="Farm Land" class="absolute inset-0 w-full h-full object-cover" />
                <div class="absolute top-4 left-4">
                    <span class="bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-lg text-[10px] font-semibold tracking-widest uppercase flex items-center gap-1.5 shadow-sm text-text border border-accent/30">
                        <i data-lucide="map-pin" class="w-3 h-3 text-primary"></i> ${item.distance}
                    </span>
                </div>
            </div>
            
            <div class="p-6 md:p-8">
                <div class="flex justify-between items-start mb-6">
                    <div>
                        <h2 class="font-display text-xl font-medium tracking-tight mb-1 text-text">${item.location}</h2>
                        <p class="text-sm text-text/60">${item.size} • ${item.soil}</p>
                    </div>
                    <div class="text-right">
                        <p class="text-lg font-semibold text-primary">₱${(item.price/1000).toFixed(0)}k</p>
                        <p class="text-[10px] font-semibold uppercase tracking-widest text-text/50">${item.period}</p>
                    </div>
                </div>
                <div class="grid grid-cols-2 gap-4 pt-6 border-t border-accent/30">
                    <div>
                        <p class="text-[10px] font-semibold uppercase tracking-widest mb-1.5 text-text/50">Water / Moisture</p>
                        <p class="text-sm font-medium flex items-center gap-1.5 text-text"><i data-lucide="droplet" class="w-4 h-4 text-secondary"></i> ${item.moisture}</p>
                    </div>
                    <div>
                        <p class="text-[10px] font-semibold uppercase tracking-widest mb-1.5 text-text/50">Average Temp</p>
                        <p class="text-sm font-medium flex items-center gap-1.5 text-text"><i data-lucide="thermometer-sun" class="w-4 h-4 text-accent"></i> ${item.temp}</p>
                    </div>
                </div>
            </div>
        </div>

        <div class="flex items-center justify-center gap-4 mt-8 w-full max-w-sm">
            <button onclick="actions.swipePass()" class="w-14 h-14 bg-white rounded-full flex items-center justify-center transition-colors border border-accent/80 text-text/50 hover:text-text hover:bg-bg shadow-sm"><i data-lucide="x" class="w-6 h-6"></i></button>
            <button onclick="actions.undoSwipe()" ${state.swipeHistory.length === 0 ? 'disabled' : ''} class="w-14 h-14 bg-white rounded-full flex items-center justify-center transition-colors shadow-sm ${state.swipeHistory.length === 0 ? 'border border-accent/40 text-text/30 cursor-not-allowed' : 'border border-accent/80 text-text/60 hover:text-text hover:bg-bg'}"><i data-lucide="rotate-ccw" class="w-5 h-5"></i></button>
            <button onclick="actions.swipePlant()" class="flex-1 h-14 rounded-2xl flex items-center justify-center gap-2 transition-colors font-medium text-sm bg-primary text-bg hover:opacity-90 shadow-md"><i data-lucide="sprout" class="w-5 h-5"></i> Request Match</button>
        </div>
        ${getFilterDrawerHTML()}
    </div>`;
}

function getOwnerViewHTML() {
    return `
    <div class="max-w-6xl mx-auto p-4 md:p-12 flex flex-col lg:flex-row gap-12 pb-24 md:pb-12 animate-view">
        <div class="w-full lg:w-5/12 flex flex-col gap-6">
            <div class="flex justify-between items-end pb-4 border-b border-accent/40">
                <h2 class="font-display text-lg font-medium tracking-tight text-text">Farmer Requests</h2>
                <span class="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-md bg-secondary/15 text-secondary">2 Pending</span>
            </div>
            <div class="space-y-4">
                ${MOCK_REQUESTS.map((req, index) => `
                <div class="bg-white rounded-2xl p-6 shadow-sm border border-accent/40 hover:shadow-md transition-shadow animate-stagger" style="animation-delay: ${index * 0.1}s">
                    <div class="flex justify-between items-start mb-4">
                        <div>
                            <h3 class="font-medium flex items-center gap-1.5 mb-1 text-text">
                                ${req.farmerName} ${req.verified ? '<i data-lucide="shield-check" class="w-4 h-4 text-primary"></i>' : ''}
                            </h3>
                            <button onclick="actions.openFarmerProfile(${req.id})" class="text-[10px] font-semibold uppercase tracking-widest text-primary hover:underline">View Full Profile</button>
                        </div>
                        <span class="text-sm font-medium text-text bg-bg px-2 py-1 rounded border border-accent/30">${req.requestedSize}</span>
                    </div>
                    <p class="text-sm leading-relaxed mb-6 p-4 rounded-xl bg-bg border border-accent/20 text-text/80">"${req.intent}"</p>
                    <div class="flex gap-4">
                        <button class="flex-1 py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors border border-accent/50 text-text/60 hover:bg-bg">Decline</button>
                        <button onclick="actions.setTab('messages')" class="flex-[2] py-3 rounded-xl text-xs font-semibold uppercase tracking-widest transition-colors flex justify-center items-center gap-2 bg-primary text-bg shadow-sm hover:opacity-90"><i data-lucide="message-square" class="w-4 h-4"></i> Chat</button>
                    </div>
                </div>
                `).join('')}
            </div>
            
            <div class="mt-12 animate-view" style="animation-delay: 0.2s">
                <div class="flex justify-between items-end pb-4 border-b border-accent/40 mb-4">
                    <h2 class="font-display text-lg font-medium tracking-tight text-text">My Active Listings</h2>
                    <span class="text-[10px] font-semibold uppercase tracking-widest px-3 py-1 rounded-md bg-primary/10 text-primary">${MOCK_ACTIVE_LISTINGS.length} Active</span>
                </div>
                <div class="space-y-4">
                    ${MOCK_ACTIVE_LISTINGS.map((listing, index) => `
                    <div class="bg-white rounded-2xl p-4 shadow-sm border border-accent/40 flex items-center gap-4 hover:shadow-md transition-shadow cursor-pointer animate-stagger" style="animation-delay: ${index * 0.1}s">
                        <img src="${listing.image}" onerror="this.onerror=null; this.src='https://placehold.co/100x100/709F40/FFFFFF?text=Land'" class="w-16 h-16 rounded-xl object-cover shadow-sm border border-accent/30" />
                        <div class="flex-1">
                            <h3 class="font-medium text-text text-sm">${listing.location}</h3>
                            <p class="text-xs text-text/60 mt-0.5">${listing.size} • ₱${(listing.price/1000).toFixed(0)}k/yr</p>
                            <span class="inline-block mt-2 text-[9px] font-semibold uppercase tracking-widest text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">${listing.status}</span>
                        </div>
                        <button class="text-text/40 hover:text-primary transition-colors"><i data-lucide="chevron-right" class="w-5 h-5"></i></button>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>

        <div class="w-full lg:w-7/12">
            <div class="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-accent/40">
                <div class="pb-4 mb-6 border-b border-accent/40">
                    <h2 class="font-display text-lg font-medium tracking-tight text-text">Create Land Listing</h2>
                </div>
                <form onsubmit="event.preventDefault()" class="space-y-6">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div class="space-y-2">
                            <label class="text-[10px] font-semibold uppercase tracking-widest text-text/60">Location</label>
                            <input type="text" placeholder="City, Region" class="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors bg-bg border border-accent/50 text-text focus:border-primary focus:ring-1 focus:ring-primary" />
                        </div>
                        <div class="space-y-2">
                            <label class="text-[10px] font-semibold uppercase tracking-widest text-text/60">Size (Hectares)</label>
                            <input type="number" placeholder="0.0" step="0.1" class="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors bg-bg border border-accent/50 text-text focus:border-primary focus:ring-1 focus:ring-primary" />
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-semibold uppercase tracking-widest text-text/60">Lease Term</label>
                        <div class="relative group">
                            <select class="w-full px-4 py-3 rounded-xl text-sm focus:outline-none transition-colors bg-bg border border-accent/50 text-text focus:border-primary focus:ring-1 focus:ring-primary appearance-none cursor-pointer hover:border-accent shadow-sm">
                                <option value="annual">Annual (12 Months)</option>
                                <option value="semi-annual">Semi-Annual (6 Months)</option>
                            </select>
                            <i data-lucide="chevron-down" class="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 w-4 h-4 group-focus-within:text-primary transition-colors pointer-events-none"></i>
                        </div>
                    </div>
                    <div class="space-y-2">
                        <label class="text-[10px] font-semibold uppercase tracking-widest text-text/60">Upload Documentation</label>
                        <div class="border border-dashed border-accent rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors bg-bg hover:bg-white">
                            <i data-lucide="upload-cloud" class="w-6 h-6 mb-3 text-primary"></i>
                            <p class="text-sm font-medium mb-1 text-text">Upload Photos & Titles</p>
                            <p class="text-[10px] uppercase tracking-widest text-text/50">PDF or JPG up to 10MB</p>
                        </div>
                    </div>
                    <div class="pt-4 pb-2">
                        <label class="text-[10px] font-semibold uppercase tracking-widest mb-3 block text-text/60">Marketplace Services (Optional)</label>
                        <div class="space-y-3">
                            <label class="flex items-start gap-3 cursor-pointer">
                                <input type="checkbox" class="mt-1 accent-[#335C32]" />
                                <div><p class="text-sm font-medium text-text"><i data-lucide="star" class="w-3 h-3 inline text-secondary"></i> Premium Visibility (+₱100)</p><p class="text-xs text-text/60">Highlight your land at the top of the feed.</p></div>
                            </label>
                        </div>
                    </div>
                    <button type="submit" class="w-full py-4 mt-2 rounded-xl text-sm font-medium transition-colors bg-primary text-bg shadow-md hover:opacity-90">Publish Land Listing (Base Fee: ₱50)</button>
                </form>
            </div>
        </div>
    </div>`;
}

function getContractModalHTML() {
    if (!state.showContractModal) return '';
    const chat = MOCK_CHATS.find(c => c.id === state.selectedChatId);
    return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-backdrop">
        <div class="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-accent/40 flex flex-col max-h-[85vh] animate-modal">
            <div class="p-6 border-b border-accent/40 bg-bg/50 flex justify-between items-center">
                <h2 class="font-display text-lg font-medium text-text flex items-center gap-2"><i data-lucide="file-text" class="w-5 h-5 text-primary"></i> AI Smart Lease Agreement</h2>
                <button onclick="actions.closeContractModal()" class="p-2 text-text/50 hover:text-text bg-white rounded-full border border-accent/30"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div class="p-6 overflow-y-auto flex-1 font-serif text-sm text-text/80 space-y-4 bg-white">
                <div class="text-center mb-6">
                    <h3 class="font-display font-medium text-text text-lg">AGRICULTURAL LEASE AGREEMENT</h3>
                    <p class="text-xs text-text/50 uppercase tracking-widest mt-1">Generated by Land Match AI</p>
                </div>
                <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Property Detail:</strong> ${chat.property}</p>
                <p><strong>Lessor (Owner):</strong> ${chat.partnerName.replace(' (Owner)', '')}</p>
                <p><strong>Lessee (Operator):</strong> ${state.currentUser.name}</p>
                <p><strong>Agreed Escrow Amount:</strong> ₱${chat.price} / Term</p>
                <hr class="border-accent/30 my-6" />
                <p class="leading-relaxed text-justify">This document constitutes a legally binding preliminary agreement generated via the Land Match platform. The Lessee agrees to remit the Agreed Escrow Amount to the secure holding facility managed by Land Match. Upon successful transfer, direct communication coordinates shall be decrypted for both parties to finalize physical turnover.</p>
                <p class="leading-relaxed text-justify mt-4">By executing this digital signature, both parties affirm their intent to enter into a formal agricultural lease governing the aforementioned Property Detail.</p>
            </div>
            <div class="p-6 border-t border-accent/40 bg-bg/50">
                <button onclick="actions.signContract()" class="w-full py-4 rounded-xl text-sm font-medium transition-colors bg-primary text-bg hover:opacity-90 flex items-center justify-center gap-2 shadow-md">
                    <i data-lucide="pen-tool" class="w-4 h-4"></i> Digitally Sign & Unlock Checkout
                </button>
            </div>
        </div>
    </div>`;
}

function getChatCheckoutHTML() {
    if (!state.selectedChatId) {
        const isFarmer = state.currentUser.role === 'farmer';
        return `
        <div class="max-w-4xl mx-auto p-4 md:p-12 h-full pb-24 md:pb-12 animate-view">
            ${isFarmer ? `
            <div class="flex gap-6 mb-6 border-b border-accent/40">
                <button onclick="actions.setMessagesViewTab('active')" class="pb-3 text-sm font-medium relative transition-colors ${state.messagesViewTab === 'active' ? 'text-primary' : 'text-text/50 hover:text-text'}">
                    Active Connections
                    ${state.messagesViewTab === 'active' ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>' : ''}
                </button>
                <button onclick="actions.setMessagesViewTab('pending')" class="pb-3 text-sm font-medium relative transition-colors ${state.messagesViewTab === 'pending' ? 'text-primary' : 'text-text/50 hover:text-text'}">
                    Pending Requests
                    ${state.messagesViewTab === 'pending' ? '<div class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"></div>' : ''}
                </button>
            </div>
            ` : `
            <h2 class="font-display text-xl font-medium tracking-tight mb-6 text-text">Active Connections</h2>
            `}
            
            <div class="flex flex-col gap-4">
                ${state.messagesViewTab === 'active' || !isFarmer ? 
                MOCK_CHATS.map((chat, index) => `
                <div onclick="actions.selectChat('${chat.id}')" class="bg-white p-5 rounded-2xl shadow-sm cursor-pointer transition-all border border-accent/40 hover:border-primary/50 hover:shadow-md group animate-stagger" style="animation-delay: ${index * 0.1}s">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-medium text-text group-hover:text-primary transition-colors">${chat.partnerName}</h3>
                        <span class="text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-md bg-bg text-primary border border-accent/20">${chat.property}</span>
                    </div>
                    <p class="text-sm truncate text-text/70">${chat.messages[chat.messages.length - 1].text}</p>
                </div>
                `).join('') :
                MOCK_PENDING_REQUESTS.map((req, index) => `
                <div class="bg-white/60 p-5 rounded-2xl shadow-sm border border-accent/40 animate-stagger opacity-80" style="animation-delay: ${index * 0.1}s">
                    <div class="flex justify-between items-center mb-2">
                        <h3 class="font-medium text-text flex items-center gap-2"><i data-lucide="clock" class="w-4 h-4 text-text/50"></i> Waiting on Owner</h3>
                        <span class="text-[10px] font-semibold uppercase tracking-widest px-3 py-1.5 rounded-md bg-accent/20 text-text/70 border border-accent/20">Pending</span>
                    </div>
                    <p class="text-sm truncate text-text/70">You requested a match for ${req.property} on ${req.date}.</p>
                </div>
                `).join('')}
            </div>
        </div>`;
    }

    const chat = MOCK_CHATS.find(c => c.id === state.selectedChatId);
    let rightPanelContent = '';
    
    if (state.paymentComplete) {
        rightPanelContent = `
        <div class="flex flex-col items-center text-center h-full animate-view pt-8">
            <div class="w-20 h-20 rounded-full bg-primary text-bg flex items-center justify-center mb-6 shadow-xl border-4 border-white animate-bloom">
                <i data-lucide="check" class="w-10 h-10"></i>
            </div>
            <h3 class="font-display text-2xl font-medium text-text mb-3">Escrow Secured</h3>
            <p class="text-sm font-light text-text/70 mb-8 px-4 leading-relaxed">The initial payment is securely held. Direct communication coordinates have been decrypted.</p>
            
            <div class="w-full bg-bg border border-accent/40 rounded-2xl p-6 text-left space-y-4 shadow-inner">
                <p class="text-[10px] font-semibold uppercase tracking-widest text-text/50 border-b border-accent/30 pb-3 mb-2 flex items-center gap-2"><i data-lucide="unlock" class="w-3 h-3 text-secondary"></i> Direct Contact Details</p>
                <div class="flex items-center gap-4 text-sm font-medium text-text bg-white p-3 rounded-xl border border-accent/20 shadow-sm">
                    <i data-lucide="phone" class="w-5 h-5 text-primary"></i> ${chat.phone}
                </div>
                <div class="flex items-center gap-4 text-sm font-medium text-text bg-white p-3 rounded-xl border border-accent/20 shadow-sm">
                    <i data-lucide="mail" class="w-5 h-5 text-primary"></i> ${chat.email}
                </div>
            </div>
            <button onclick="actions.setTab('messages')" class="mt-8 text-sm font-medium text-primary hover:underline flex items-center gap-2"><i data-lucide="arrow-left" class="w-4 h-4"></i> Return to Connections</button>
        </div>
        `;
    } else {
        rightPanelContent = `
        <h2 class="font-display text-lg font-medium mb-6 flex items-center gap-2 pb-4 text-text border-b border-accent/40">
            <i data-lucide="shield-check" class="w-5 h-5 text-primary"></i> Secure Transaction
        </h2>
        <div class="mb-8">
            <p class="font-medium text-sm text-text">${chat.property}</p>
            <p class="text-[10px] font-semibold uppercase tracking-widest mt-1 mb-6 text-text/50">Agreed Initial Payment</p>
            <div class="space-y-4 text-sm font-light text-text/80">
                <div class="flex justify-between"><p>Lease Price</p><p>₱${chat.price}</p></div>
                <div class="flex justify-between text-text/60"><p>Platform Fee (5%)</p><p>-₱${(chat.price * 0.05).toFixed(0)}</p></div>
                <div class="flex justify-between pt-4 mt-2 border-t border-accent/40">
                    <p class="font-medium uppercase text-xs tracking-wider mt-1 text-text">Total to Owner</p>
                    <p class="font-medium text-xl text-primary">₱${(chat.price * 0.95).toFixed(0)}</p>
                </div>
            </div>
        </div>
        <div class="p-4 rounded-xl text-xs font-light mb-8 leading-relaxed bg-bg border border-accent/40 text-text/80 flex gap-3 items-start">
            <i data-lucide="lock" class="w-4 h-4 shrink-0 mt-0.5 text-text/50"></i>
            <span><strong>Contact Unlock:</strong> Direct contact details are revealed only after initial payment is secured.</span>
        </div>
        
        <div class="mt-auto md:mt-0 space-y-3">
            ${state.contractSigned ? `
                <button onclick="actions.processPayment()" ${state.isProcessingPayment ? 'disabled' : ''} class="w-full py-4 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2 bg-primary text-bg shadow-md hover:bg-[#264625]">
                    ${state.isProcessingPayment ? '<i data-lucide="loader" class="w-5 h-5 animate-spin"></i> Processing...' : `<i data-lucide="credit-card" class="w-5 h-5"></i> Checkout (₱${chat.price})`}
                </button>
                <p class="text-center text-[9px] font-semibold uppercase tracking-widest text-text/40"><i data-lucide="check-circle" class="w-3 h-3 inline"></i> Contract Signed • Escrow Ready</p>
            ` : `
                <button onclick="actions.openContractModal()" class="w-full py-4 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2 bg-text text-bg shadow-md hover:bg-black">
                    <i data-lucide="sparkles" class="w-5 h-5"></i> Generate AI Smart Lease
                </button>
                <button disabled class="w-full py-4 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2 bg-text/5 text-text/30 cursor-not-allowed border border-accent/20">
                    <i data-lucide="lock" class="w-5 h-5"></i> Checkout Locked
                </button>
                <p class="text-center text-[9px] font-semibold uppercase tracking-widest text-text/40">Sign lease to unlock payment</p>
            `}
        </div>
        `;
    }
    
    return `
    <div class="max-w-6xl mx-auto h-[calc(100vh-140px)] md:h-[calc(100vh-80px)] p-4 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 pb-24 md:pb-8">
        <div class="flex-1 bg-white shadow-sm rounded-2xl flex flex-col overflow-hidden border border-accent/40">
            <div class="p-4 md:p-6 flex items-center gap-4 bg-bg/50 border-b border-accent/40">
                <button onclick="actions.setTab('messages')" class="p-2 md:hidden text-text bg-white rounded-full border border-accent/30"><i data-lucide="chevron-left" class="w-5 h-5"></i></button>
                <div class="w-12 h-12 rounded-full flex items-center justify-center bg-accent/30 text-primary border border-accent/50"><i data-lucide="user" class="w-6 h-6"></i></div>
                <div>
                    <h3 class="font-medium text-sm mb-1 text-text">${chat.partnerName}</h3>
                    <p class="text-[9px] font-semibold uppercase tracking-widest flex items-center gap-1.5 text-secondary"><span class="w-1.5 h-1.5 rounded-full bg-secondary"></span> In-App Chat</p>
                </div>
            </div>
            <div id="chat-messages-box" class="flex-1 p-6 overflow-y-auto flex flex-col gap-6 bg-white">
                ${chat.messages.map((msg, index) => {
                    const animClass = index === chat.messages.length - 1 ? 'animate-message' : '';
                    return `
                    <div class="max-w-[80%] p-4 rounded-2xl ${msg.sender === 'me' ? 'self-end rounded-tr-sm bg-primary text-bg' : 'self-start rounded-tl-sm bg-bg text-text border border-accent/40'} ${animClass}">
                        ${msg.image ? `<img src="${msg.image}" onerror="this.onerror=null; this.src='https://placehold.co/400x400/D2B48C/2C2C2C?text=Document+Attached'" alt="Attached photo" class="w-full max-w-[280px] h-auto rounded-lg mb-3 object-cover shadow-sm ${msg.sender === 'me' ? 'border border-bg/30' : 'border border-accent/40'}" />` : ''}
                        ${msg.text ? `<p class="text-sm font-light leading-relaxed">${msg.text}</p>` : ''}
                        <p class="text-[9px] uppercase tracking-widest mt-2 text-right opacity-60">${msg.time}</p>
                    </div>`
                }).join('')}
            </div>
            <div class="p-4 bg-bg/50 border-t border-accent/40">
                <div class="flex items-center gap-3">
                    <button onclick="actions.sendPhoto()" class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-white border border-accent/50 text-text/50 hover:text-primary hover:border-primary shadow-sm" aria-label="Attach Photo"><i data-lucide="image" class="w-5 h-5"></i></button>
                    <input id="chat-input" type="text" onkeypress="event.key === 'Enter' && actions.sendMessage()" placeholder="Type a message..." class="flex-1 bg-white px-4 py-3 rounded-xl outline-none text-sm transition-colors border border-accent/50 text-text focus:border-primary focus:ring-1 focus:ring-primary" />
                    <button onclick="actions.sendMessage()" class="w-12 h-12 rounded-xl flex items-center justify-center transition-colors bg-primary text-bg hover:opacity-90 shadow-sm"><i data-lucide="send" class="w-5 h-5"></i></button>
                </div>
            </div>
        </div>
        <div class="w-full md:w-[380px] bg-white shadow-sm rounded-2xl p-6 md:p-8 flex flex-col h-fit border border-accent/40">
            ${rightPanelContent}
        </div>
    </div>`;
}

function getProfileViewHTML() {
    return `
    <div class="max-w-4xl mx-auto p-4 md:p-12 pb-24 md:pb-12 animate-view">
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 border border-accent/40">
            <div class="p-8 md:p-12 flex flex-col md:flex-row items-center md:items-start gap-8 bg-bg border-b border-accent/40 relative">
                <div class="absolute top-4 right-4">
                     <button class="p-3 bg-white rounded-full shadow-sm text-text/50 hover:text-text border border-accent/30"><i data-lucide="settings" class="w-5 h-5"></i></button>
                </div>
                <div class="w-24 h-24 rounded-full flex items-center justify-center shrink-0 bg-white shadow-md border-4 border-white text-primary">
                    <i data-lucide="user" class="w-12 h-12"></i>
                </div>
                <div class="text-center md:text-left flex-1 mt-2">
                    <h2 class="font-display text-3xl font-medium tracking-tight mb-2 text-text">${state.currentUser.name}</h2>
                    <p class="text-xs font-semibold uppercase tracking-widest mb-4 text-primary">${state.currentUser.role} Account</p>
                    <div class="flex flex-wrap justify-center md:justify-start gap-3">
                        <span class="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-white border border-accent/40 text-text shadow-sm"><i data-lucide="mail" class="w-4 h-4 text-text/50"></i> ${state.currentUser.email}</span>
                        <span class="flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg bg-white border border-accent/40 text-text shadow-sm"><i data-lucide="shield-check" class="w-4 h-4 text-primary"></i> Verified User</span>
                    </div>
                </div>
            </div>
            
            <div class="p-8 md:p-12">
                <h3 class="font-display text-lg font-medium tracking-tight mb-6 text-text">Transaction History</h3>
                <div class="space-y-4">
                    ${MOCK_HISTORY.map((hist, index) => `
                    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center p-5 rounded-xl border border-accent/40 hover:bg-bg transition-colors animate-stagger" style="animation-delay: ${index * 0.1}s">
                        <div class="mb-2 sm:mb-0">
                            <p class="font-medium text-sm mb-1 text-text flex items-center gap-2"><i data-lucide="file-text" class="w-4 h-4 text-secondary"></i> ${hist.title}</p>
                            <p class="text-[10px] font-semibold uppercase tracking-widest text-text/50">${hist.date}</p>
                        </div>
                        <div class="text-right w-full sm:w-auto flex justify-between sm:block">
                            <p class="font-semibold text-sm text-text">₱${hist.amount}</p>
                            <p class="text-[10px] font-semibold uppercase tracking-widest text-primary">${hist.status}</p>
                        </div>
                    </div>
                    `).join('')}
                </div>
            </div>
        </div>
    </div>`;
}

function getMobileNavHTML() {
    return `
    <nav class="md:hidden fixed bottom-0 w-full z-40 bg-white/90 backdrop-blur-md border-t border-accent/40 pb-safe shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <div class="flex justify-around items-center h-16 px-2">
            <button onclick="actions.setTab('home')" class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${state.activeTab === 'home' ? 'text-primary' : 'text-text/50'}">
                <i data-lucide="search" class="w-5 h-5"></i>
                <span class="text-[9px] font-semibold uppercase tracking-widest">Home</span>
            </button>
            <button onclick="actions.setTab('messages')" class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${state.activeTab === 'messages' ? 'text-primary' : 'text-text/50'}">
                <i data-lucide="message-square" class="w-5 h-5"></i>
                <span class="text-[9px] font-semibold uppercase tracking-widest">Chat</span>
            </button>
            <button onclick="actions.setTab('profile')" class="flex-1 flex flex-col items-center justify-center gap-1 transition-colors ${state.activeTab === 'profile' ? 'text-primary' : 'text-text/50'}">
                <i data-lucide="user" class="w-5 h-5"></i>
                <span class="text-[9px] font-semibold uppercase tracking-widest">Profile</span>
            </button>
        </div>
    </nav>`;
}

function getMatchModalHTML() {
    if (!state.matchedProperty) return '';
    const prop = state.matchedProperty;

    return `
    <div class="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 backdrop-blur-sm animate-backdrop">
        <div class="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl border border-accent/40 animate-modal">
            <div class="relative w-24 h-24 mx-auto mb-6">
                <img src="${prop.image}" onerror="this.onerror=null; this.src='https://placehold.co/400x400/709F40/FFFFFF?text=Land'" class="w-full h-full object-cover rounded-full shadow-lg border-4 border-white" alt="Matched Property" />
                <div class="absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center bg-primary text-bg shadow-lg border-2 border-white">
                    <i data-lucide="sprout" class="w-5 h-5"></i>
                </div>
            </div>
            <h2 class="font-display text-2xl font-medium mb-1 tracking-tight text-text">Request Sent!</h2>
            <h3 class="font-display text-sm font-semibold text-primary mb-3">${prop.location}</h3>
            <p class="font-light mb-8 text-sm leading-relaxed px-2 text-text/70">The property owner has received your request for the ${prop.size} plot. Once they accept, secure messaging will open.</p>
            <button onclick="actions.setTab('messages'); actions.closeMatchModal()" class="w-full py-4 rounded-xl text-sm font-medium mb-3 transition-colors bg-primary text-bg shadow-md hover:opacity-90">View Pending Requests</button>
            <button onclick="actions.closeMatchModal()" class="w-full py-4 bg-white rounded-xl text-sm font-medium transition-colors border border-accent/50 text-text hover:bg-bg shadow-sm">Continue Browsing</button>
        </div>
    </div>`;
}

function getFarmerProfileModalHTML() {
    if (!state.selectedFarmerProfile) return '';
    const farmer = state.selectedFarmerProfile;
    const badgesHTML = farmer.badges ? farmer.badges.map(b => `<span class="px-3 py-1.5 rounded-full bg-secondary/10 text-primary text-xs font-semibold flex items-center gap-1.5 border border-secondary/20"><i data-lucide="shield-check" class="w-3.5 h-3.5"></i> ${b}</span>`).join('') : '';

    return `
    <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-backdrop">
        <div class="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-accent/40 relative overflow-hidden animate-modal">
            <div class="absolute top-0 left-0 w-full h-24 bg-bg/50 border-b border-accent/30"></div>
            <button onclick="actions.closeFarmerProfile()" class="absolute top-6 right-6 z-10 p-2 bg-white rounded-full shadow-sm text-text/50 hover:text-text border border-accent/30"><i data-lucide="x" class="w-4 h-4"></i></button>
            
            <div class="relative z-10 flex flex-col items-center mt-4 mb-6">
                 <div class="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center text-primary border-4 border-white mb-3"><i data-lucide="user" class="w-10 h-10"></i></div>
                 <h2 class="font-display text-xl font-medium text-text flex items-center gap-2">${farmer.farmerName} ${farmer.verified ? '<i data-lucide="badge-check" class="w-5 h-5 text-primary"></i>' : ''}</h2>
                 <p class="text-xs font-semibold uppercase tracking-widest text-secondary mt-1">Verified Operator</p>
            </div>

            <div class="grid grid-cols-2 gap-4 mb-6 p-4 rounded-2xl bg-bg border border-accent/30">
                <div class="text-center border-r border-accent/30">
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-text/50 mb-1">Platform Rating</p>
                    <p class="text-lg font-medium text-text flex items-center justify-center gap-1"><i data-lucide="star" class="w-4 h-4 text-[#D97706] fill-current"></i> ${farmer.rating}</p>
                </div>
                <div class="text-center">
                    <p class="text-[10px] font-semibold uppercase tracking-widest text-text/50 mb-1">Past Leases</p>
                    <p class="text-lg font-medium text-text">${farmer.pastLeases}</p>
                </div>
            </div>

            <div class="mb-8">
                <p class="text-[10px] font-semibold uppercase tracking-widest mb-3 text-text/50">Trust & Verification Badges</p>
                <div class="flex flex-wrap gap-2">
                    ${badgesHTML}
                </div>
            </div>

            <button onclick="actions.messageFarmerFromProfile()" class="w-full py-4 rounded-2xl text-sm font-medium bg-primary text-bg transition-colors flex justify-center items-center gap-2 shadow-md hover:opacity-90">
                <i data-lucide="message-square" class="w-4 h-4"></i> Open Direct Message
            </button>
        </div>
    </div>`;
}

function getAiWidgetHTML() {
    if (!state.currentUser) return '';
    const aiMessage = state.currentUser.role === 'farmer' 
        ? "Market Tip: Properties within 10km of Pili are highly competitive right now. Request a match quickly to secure a viewing."
        : "Pricing Tip: To maximize lease value, select 'Premium Visibility'. Highlighted properties rent 15% faster.";

    return `
    <div class="fixed bottom-24 md:bottom-8 right-6 z-50 flex flex-col items-end">
        ${state.aiWidgetOpen ? `
        <div class="bg-white p-6 rounded-2xl shadow-2xl mb-4 w-[320px] border border-accent/40 animate-bloom">
            <div class="flex justify-between items-center mb-4 pb-4 border-b border-accent/30">
                <span class="font-semibold text-xs uppercase tracking-widest flex items-center gap-2 text-text"><i data-lucide="bot" class="w-4 h-4 text-primary"></i> AI Assistant</span>
                <button onclick="actions.toggleAiWidget()" class="transition-colors text-text/40 hover:text-text bg-bg p-1.5 rounded-full"><i data-lucide="x" class="w-4 h-4"></i></button>
            </div>
            <div class="mb-5 text-sm font-light leading-relaxed p-4 rounded-xl bg-bg border border-accent/30 text-text/80 shadow-inner">
                ${aiMessage}
            </div>
            <div class="flex rounded-xl overflow-hidden transition-colors bg-white border border-accent/50 focus-within:border-primary focus-within:ring-1 focus-within:ring-primary shadow-sm">
                <input type="text" placeholder="Ask AI a question..." class="flex-1 px-4 py-3 text-xs outline-none font-medium text-text" />
                <button class="px-5 transition-colors bg-primary text-bg hover:opacity-90"><i data-lucide="chevron-right" class="w-4 h-4"></i></button>
            </div>
        </div>
        ` : ''}
        <button onclick="actions.toggleAiWidget()" class="w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-lg ${state.aiWidgetOpen ? 'bg-bg text-text border border-accent' : 'bg-secondary text-white hover:opacity-90 border-2 border-white'}" aria-label="Toggle AI Assistant">
            <i data-lucide="${state.aiWidgetOpen ? 'x' : 'bot'}" class="w-6 h-6"></i>
        </button>
    </div>`;
}

function attachSwipeListeners() {
    const card = document.getElementById('swipe-card');
    if (!card) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    const startDrag = (e) => {
        if (e.type === 'mousedown' && e.button !== 0) return; 
        isDragging = true;
        startX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        card.style.transition = 'none';
    };

    const drag = (e) => {
        if (!isDragging) return;
        e.preventDefault(); 
        currentX = e.type.includes('mouse') ? e.pageX : e.touches[0].clientX;
        const deltaX = currentX - startX;
        const rotate = deltaX * 0.05;
        card.style.transform = `translate(${deltaX}px, 0) rotate(${rotate}deg)`;
    };

    const endDrag = (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        if (!currentX) return; 

        const deltaX = currentX - startX;
        
        if (deltaX > 100) {
            animateAndSwipe('right');
        } else if (deltaX < -100) {
            animateAndSwipe('left');
        } else {
            card.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            card.style.transform = 'translate(0px, 0px) rotate(0deg)';
        }
        currentX = 0;
        startX = 0;
    };

    card.addEventListener('mousedown', startDrag);
    card.addEventListener('mousemove', drag);
    card.addEventListener('mouseup', endDrag);
    card.addEventListener('mouseleave', endDrag);

    card.addEventListener('touchstart', startDrag, {passive: false});
    card.addEventListener('touchmove', drag, {passive: false});
    card.addEventListener('touchend', endDrag);
}

function renderApp() {
    const root = document.getElementById('root');
    
    if (!state.currentUser) {
        root.innerHTML = getAuthHTML();
    } else {
        let content = '';
        if (state.activeTab === 'home') {
            content = state.currentUser.role === 'farmer' ? getFarmerViewHTML() : getOwnerViewHTML();
        } else if (state.activeTab === 'messages') {
            content = getChatCheckoutHTML();
        } else if (state.activeTab === 'profile') {
            content = getProfileViewHTML();
        }

        root.innerHTML = `
            ${getHeaderHTML()}
            <main class="main-content relative pb-24 md:pb-8">
                ${content}
            </main>
            ${getMobileNavHTML()}
            ${getAiWidgetHTML()}
            ${state.showMatchModal ? getMatchModalHTML() : ''}
            ${getFarmerProfileModalHTML()}
            ${getContractModalHTML()}
        `;
    }

    setTimeout(() => {
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        if (state.activeTab === 'home' && state.currentUser && state.currentUser.role === 'farmer') {
            attachSwipeListeners();
        }
    }, 0);
}

// Start application
renderApp();
