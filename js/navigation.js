// Navigation System with Back Buttons and Step Management
// Share navigationHistory across modules via window to avoid undefined references
let navigationHistory = (typeof window !== 'undefined' && Array.isArray(window.navigationHistory)) 
    ? window.navigationHistory 
    : [];
try { if (typeof window !== 'undefined') { window.navigationHistory = navigationHistory; } } catch (_) { if (typeof logError === "function") logError(_); }
let currentStep = 'setup';

const STEPS = {
    setup: 'setup',
    evaluation: 'evaluation', 
    comments: 'comments',
    sectionI: 'sectionI',
    summary: 'summary'
};

// Centralized UI constants with safe fallbacks and SHOW/HIDE aliases
const baseUI = (window.CONSTANTS && window.CONSTANTS.UI_SETTINGS)
    ? window.CONSTANTS.UI_SETTINGS
    : { DISPLAY: { BLOCK: 'block', NONE: 'none', FLEX: 'flex', INLINE_BLOCK: 'inline-block' }, CSS: { ACTIVE: 'active' } };
const UI = {
    DISPLAY: Object.assign({}, baseUI.DISPLAY, { SHOW: baseUI.DISPLAY.BLOCK, HIDE: baseUI.DISPLAY.NONE }),
    CSS: baseUI.CSS
};

// Navigation Functions
function updateNavigationState(step) {
    currentStep = step;
    navigationHistory.push(step);
    try {
        history.pushState({ step }, '', '#' + step);
    } catch (_) { if (typeof logError === "function") logError(_); }

    // Update navigation menu states
    updateNavigationMenu();

    // Update progress bar
    updateNavigationProgress();

    // Update breadcrumbs
    renderBreadcrumbs();

    // Toggle compact header mode for evaluation steps
    updateHeaderCompactMode(step);
}

/**
 * Toggle compact header mode based on current step
 * Compact mode: evaluation, comments, sectionI, summary
 * Full mode: setup (and home/login screens)
 */
function updateHeaderCompactMode(step) {
    const header = document.querySelector('.header');
    if (!header) return;

    const compactSteps = [STEPS.evaluation, STEPS.comments, STEPS.sectionI, STEPS.summary];
    header.classList.toggle('compact', compactSteps.includes(step));
}

function goBack() {
    if (navigationHistory.length <= 1) return;
    // Guard unsaved changes
    if (window.UIStates && typeof window.UIStates.guardNavigation === 'function') {
        if (!window.UIStates.guardNavigation()) return;
    }
    
    // Remove current step from history
    navigationHistory.pop();
    
    // Get previous step
    const previousStep = navigationHistory[navigationHistory.length - 1];
    
    // Navigate to previous step
    switch(previousStep) {
        case STEPS.setup:
            showSetupCard();
            break;
        case STEPS.evaluation:
            showEvaluationStep();
            break;
        case STEPS.comments:
            showDirectedCommentsScreen();
            break;
        case STEPS.sectionI:
            showSectionIGeneration();
            break;
        case STEPS.summary:
            showSummary();
            break;
    }
    
    currentStep = previousStep;
    updateNavigationState(previousStep);
}

function jumpToStep(step) {
    // Validate if step is accessible
    if (!isStepAccessible(step)) {
        showToast('Please complete previous steps first', 'warning');
        return;
    }
    // Guard unsaved changes
    if (window.UIStates && typeof window.UIStates.guardNavigation === 'function') {
        if (!window.UIStates.guardNavigation()) return;
    }
    
    // Navigate to step
    switch(step) {
        case STEPS.setup:
            showSetupCard();
            break;
        case STEPS.evaluation:
            showEvaluationStep();
            break;
        case STEPS.comments:
            showDirectedCommentsScreen();
            break;
        case STEPS.sectionI:
            showSectionIGeneration();
            break;
        case STEPS.summary:
            showSummary();
            break;
    }
    
    updateNavigationState(step);
    toggleMenu(); // Close menu after navigation
}

function isStepAccessible(step) {
    switch(step) {
        case STEPS.setup:
            return true;
        case STEPS.evaluation:
            try {
                const name = document.getElementById('marineNameInput')?.value?.trim();
                const from = document.getElementById('fromDateInput')?.value;
                const to = document.getElementById('toDateInput')?.value;
                const rank = document.getElementById('marineRankSelect')?.value;
                const occasion = document.getElementById('evaluationOccasionSetup')?.value;
                const rsSel = document.getElementById('reportingSeniorSelect')?.value;
                return Boolean((evaluationMeta && evaluationMeta.marineName) || (name && from && to && rank && occasion && rsSel));
            } catch (_) { return Boolean(evaluationMeta && evaluationMeta.marineName); }
        case STEPS.comments:
            return Object.keys(evaluationResults).length > 0; // Some evaluations completed
        case STEPS.sectionI:
            return currentTraitIndex >= allTraits.length; // All evaluations completed
        case STEPS.summary:
            return evaluationMeta.sectionIComments !== undefined; // Section I completed
        default:
            return false;
    }
}

function updateNavigationMenu() {
    const navItems = {
        navSetup: STEPS.setup,
        navEvaluation: STEPS.evaluation,
        navComments: STEPS.comments,
        navSectionI: STEPS.sectionI,
        navSummary: STEPS.summary
    };
    
    Object.keys(navItems).forEach(navId => {
        const navItem = document.getElementById(navId);
        const step = navItems[navId];
        
        if (isStepAccessible(step)) {
            navItem.disabled = false;
            navItem.classList.remove('disabled');
            
            if (step === currentStep) {
                navItem.classList.add(UI.CSS.ACTIVE);
            } else {
                navItem.classList.remove(UI.CSS.ACTIVE);
            }
        } else {
            navItem.disabled = true;
            navItem.classList.add('disabled');
            navItem.classList.remove(UI.CSS.ACTIVE);
        }
    });
}

function updateNavigationProgress() {
    const stepOrder = [STEPS.setup, STEPS.evaluation, STEPS.comments, STEPS.sectionI, STEPS.summary];
    const currentIndex = stepOrder.indexOf(currentStep);
    const progress = ((currentIndex + 1) / stepOrder.length) * 100;
    
    const progressFill = document.getElementById('navProgressFill');
    const progressText = document.getElementById('navProgressText');
    
    if (progressFill) {
        progressFill.style.width = progress + '%';
    }
    
    if (progressText) {
        const stepNames = {
            setup: 'Setup',
            evaluation: 'Evaluation',
            comments: 'Directed Comments',
            sectionI: 'Section I',
            summary: 'Summary'
        };
        progressText.textContent = stepNames[currentStep] || 'Unknown';
    }
}

function toggleMenu() {
    const overlay = document.getElementById('navMenuOverlay');
    overlay.classList.toggle(UI.CSS.ACTIVE);
    
    // Prevent body scroll when menu is open
    if (overlay.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

function renderBreadcrumbs() {
    const el = document.getElementById('breadcrumbs');
    if (!el) return;
    const labels = { setup: 'Setup', evaluation: 'Evaluation', comments: 'Directed Comments', sectionI: 'Section I', summary: 'Summary' };
    const deduped = [];
    for (const s of navigationHistory) {
        if (deduped.length === 0 || deduped[deduped.length - 1] !== s) deduped.push(s);
    }
    const accessibleTrail = deduped.filter(isStepAccessible);
    el.innerHTML = '';
    accessibleTrail.forEach((s, idx) => {
        const a = document.createElement('a');
        a.className = 'crumb' + (s === currentStep ? (' ' + UI.CSS.ACTIVE) : '');
        a.textContent = labels[s] || s;
        if (s !== currentStep) a.href = '#' + s;
        a.addEventListener('click', (e) => { e.preventDefault(); jumpToStep(s); });
        el.appendChild(a);
        if (idx < accessibleTrail.length - 1) {
            const sep = document.createElement('span'); sep.className = 'sep'; sep.textContent = '›'; el.appendChild(sep);
        }
    });
}

// Step Navigation Functions
function showSetupCard() {
    try { document.body.classList.remove('home-mode'); } catch (_) { if (typeof logError === "function") logError(_); }
    hideAllCards();
    const setupCard = document.getElementById('setupCard');
    if (setupCard) {
        setupCard.classList.add(UI.CSS.ACTIVE);
        setupCard.style.display = UI.DISPLAY.SHOW;
        // Sync evaluator setup fields from restored evaluation meta
        if (typeof updateEvaluatorSetupDisplay === 'function') {
            try { updateEvaluatorSetupDisplay(); } catch (_) { if (typeof logError === "function") logError(_); }
        }
        try { setupCard.setAttribute('tabindex','-1'); setupCard.focus(); } catch (_) { if (typeof logError === "function") logError(_); }
    }
}

// Sync the evaluator (Reporting Senior) setup fields from restored evaluation meta.
function updateEvaluatorSetupDisplay() {
    const evaluatorInput = document.getElementById('evaluatorNameInput');
    const evaluatorRank = document.getElementById('evaluatorRankSelect');
    const combinedInput = document.getElementById('evaluatorCombinedInput');

    if (evaluatorInput) {
        const restoredName = (typeof evaluationMeta === 'object' && evaluationMeta && evaluationMeta.evaluatorName) ? evaluationMeta.evaluatorName : '';
        if (restoredName && !evaluatorInput.value) {
            evaluatorInput.value = restoredName;
        }
        evaluatorInput.style.display = 'none';
        try { evaluatorInput.disabled = true; } catch (_) { if (typeof logError === "function") logError(_); }
        try { evaluatorInput.readOnly = true; } catch (_) { if (typeof logError === "function") logError(_); }
        try { evaluatorInput.required = true; } catch (_) { if (typeof logError === "function") logError(_); }
        try { evaluatorInput.setAttribute('aria-hidden', 'false'); } catch (_) { if (typeof logError === "function") logError(_); }
    }
    if (evaluatorRank) {
        const restoredRank = (typeof evaluationMeta === 'object' && evaluationMeta && evaluationMeta.evaluatorRank) ? evaluationMeta.evaluatorRank : '';
        if (restoredRank && !evaluatorRank.value) {
            evaluatorRank.value = restoredRank;
        } else {
            evaluatorRank.value = '';
        }
        evaluatorRank.style.display = 'none';
        try { evaluatorRank.disabled = true; } catch (_) { if (typeof logError === "function") logError(_); }
        try { evaluatorRank.setAttribute('aria-hidden', 'false'); } catch (_) { if (typeof logError === "function") logError(_); }
    }
    if (combinedInput) {
        const restoredRank = (typeof evaluationMeta === 'object' && evaluationMeta && evaluationMeta.evaluatorRank) ? evaluationMeta.evaluatorRank : '';
        const restoredName = (typeof evaluationMeta === 'object' && evaluationMeta && evaluationMeta.evaluatorName) ? evaluationMeta.evaluatorName : '';
        combinedInput.value = (restoredRank ? (restoredRank + ' ') : '') + (restoredName || '');
        try { combinedInput.setAttribute('aria-hidden', 'false'); } catch (_) { if (typeof logError === "function") logError(_); }
    }
}

function showEvaluationStep() {
    try { document.body.classList.remove('home-mode'); } catch (_) { if (typeof logError === "function") logError(_); }
    hideAllCards();
    const container = document.getElementById('evaluationContainer');
    if (container) {
        container.style.display = UI.DISPLAY.SHOW;
        renderCurrentTrait();
        try { container.setAttribute('tabindex','-1'); container.focus(); } catch (_) { if (typeof logError === "function") logError(_); }
    }
}

function showDirectedCommentsStep() {
    try { document.body.classList.remove('home-mode'); } catch (_) { if (typeof logError === "function") logError(_); }
    hideAllCards();
    const card = document.getElementById('directedCommentsCard');
    if (card) {
        card.classList.add(UI.CSS.ACTIVE);
        card.style.display = UI.DISPLAY.SHOW;
        try { card.setAttribute('tabindex','-1'); card.focus(); } catch (_) { if (typeof logError === "function") logError(_); }
    }
}

function showSectionIStep() {
    try { document.body.classList.remove('home-mode'); } catch (_) { if (typeof logError === "function") logError(_); }
    hideAllCards();
    const card = document.getElementById('sectionIGenerationCard');
    if (card) {
        card.classList.add(UI.CSS.ACTIVE);
        card.style.display = UI.DISPLAY.SHOW;
        try { card.setAttribute('tabindex','-1'); card.focus(); } catch (_) { if (typeof logError === "function") logError(_); }
    }
}

function showSummaryStep() {
    try { document.body.classList.remove('home-mode'); } catch (_) { if (typeof logError === "function") logError(_); }
    hideAllCards();
    const card = document.getElementById('summaryCard');
    if (card) {
        card.classList.add(UI.CSS.ACTIVE);
        card.style.display = UI.DISPLAY.SHOW;
        try { card.setAttribute('tabindex','-1'); card.focus(); } catch (_) { if (typeof logError === "function") logError(_); }
    }
}

// Delegate to the single implementation in evaluation.js
function showSummary() {
    if (typeof window.evaluationShowSummary === 'function') {
        return window.evaluationShowSummary();
    }
    // Fallback if evaluation.js not ready
    showSummaryStep();
}

function hideAllCards() {
    // PoC: profileLoginCard and profileDashboardCard DOM elements removed.
    const cards = [
        'modeSelectionCard',
        'setupCard', 'howItWorksCard', 'evaluationContainer',
        'directedCommentsCard', 'sectionIGenerationCard', 'summaryCard'
    ];
    
    cards.forEach(cardId => {
        const card = document.getElementById(cardId);
        if (card) {
            card.classList.remove(UI.CSS.ACTIVE);
            card.style.display = UI.DISPLAY.HIDE;
        }
    });
}

// Update the original functions to use the new step functions
function showDirectedCommentsScreen() {
    showDirectedCommentsStep();
    renderDirectedCommentsGrid();
}

function showSectionIGeneration() {
    showSectionIStep();
    
    // Update progress indicator
    document.getElementById('progressText').textContent = 'Section I Comment Generation';
    
    // Initialize the analysis
    const analysis = analyzeTraitEvaluations();
    updateAnalysisDisplay(analysis);
}

// Edit Functions
function editPreviousEvaluations() {
    if (confirm('This will take you back to edit your trait evaluations. Continue?')) {
        // Save current progress
        saveProgressToStorage();
        
        // Reset to evaluation step
        currentTraitIndex = 0;
        currentEvaluationLevel = 'B';
        
        jumpToStep(STEPS.evaluation);
        showToast('You can now edit your evaluations. Use navigation to jump between completed traits.', 'info');
    }
}

function editSummaryEvaluation() {
    if (confirm('This will take you back to the beginning to edit this evaluation. Continue?')) {
        // Save current progress first
        saveProgressToStorage();
        
        // Reset to setup but keep the data for easy restoration
        jumpToStep(STEPS.setup);
        showToast('You can now edit your evaluation from the beginning.', 'info');
    }
}

function editEvaluation() {
    editSummaryEvaluation();
}

// Mobile-friendly touch handlers
function initializeTouchHandlers() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn, .tool-btn, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        button.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 150);
        });
    });
    
    // Close menu on outside touch
    document.addEventListener('touchstart', function(e) {
        const overlay = document.getElementById('navMenuOverlay');
        const menuBtn = document.getElementById('menuBtn');
        
        if (overlay.classList.contains('active') && 
            !overlay.contains(e.target) && 
            !menuBtn.contains(e.target)) {
            toggleMenu();
        }
    });
}

// Keyboard navigation
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC to close modals/menus
        if (e.key === 'Escape') {
            const overlay = document.getElementById('navMenuOverlay');
            const justificationModal = document.getElementById('justificationModal');
            const helpModal = document.getElementById('helpModal');
            
            if (overlay.classList.contains('active')) {
                toggleMenu();
            } else if (justificationModal.classList.contains('active')) {
                cancelJustification();
            } else if (helpModal.classList.contains('active')) {
                closeHelpModal();
            }
        }
        
        // Ctrl+S to save progress
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            saveProgress();
            showToast('Progress saved!', 'success');
        }
    });
}

// Initialize navigation system
function initializeNavigation() {
    initializeTouchHandlers();
    initializeKeyboardNavigation();
    updateNavigationState(STEPS.setup);
    // Browser back/forward
    window.addEventListener('popstate', (e) => {
        const step = (e && e.state && e.state.step) ? e.state.step : null;
        if (!step) { goBack(); return; }
        if (!isStepAccessible(step)) return;
        // Guard unsaved
        if (window.UIStates && typeof window.UIStates.guardNavigation === 'function') {
            if (!window.UIStates.guardNavigation()) return;
        }
        switch(step) {
            case STEPS.setup: showSetupCard(); break;
            case STEPS.evaluation: showEvaluationStep(); break;
            case STEPS.comments: showDirectedCommentsStep(); break;
            case STEPS.sectionI: showSectionIStep(); break;
            case STEPS.summary: showSummaryStep(); break;
        }
        currentStep = step;
        navigationHistory.push(step);
        renderBreadcrumbs();
        updateNavigationMenu();
        updateNavigationProgress();
    });
}
