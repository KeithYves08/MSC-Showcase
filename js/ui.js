// ===================================================================
// UI AND INTERFACE FUNCTIONS
// ===================================================================

import { gameState, getDiscoveryProgress } from './gameState.js';
import { CONFIG } from './config.js';
import { resetProgress } from './saveLoad.js';
import { toggleBackgroundMusic, playBackgroundMusic } from './audio.js';

// Update progress display
export function updateProgress() {
    const progress = getDiscoveryProgress();
    
    const progressBar = document.getElementById('progressBar');
    const discoveredCount = document.getElementById('discoveredCount');
    const totalCount = document.getElementById('totalCount');
    
    console.log('Updating progress:', progress); // Debug log
    
    if (progressBar) {
        progressBar.style.width = progress.percentage + '%';
        console.log('Progress bar width set to:', progress.percentage + '%'); // Debug log
    }
    if (discoveredCount) discoveredCount.textContent = progress.discovered;
    if (totalCount) totalCount.textContent = progress.total;
}

// Show project information panel
export function showProjectPanel(project) {
    gameState.currentProject = project;
    
    // Clear any existing timer
    if (gameState.projectPanelTimer) {
        clearTimeout(gameState.projectPanelTimer);
    }
    
    // Define button handlers inline to ensure proper scope access
    const handleViewDemo = function() {
        console.log('View Demo clicked'); // Debug log
        if (gameState.currentProject && gameState.currentProject.url) {
            window.open(gameState.currentProject.url, '_blank');
            closeProject();
        } else {
            console.error('No project URL available');
        }
    };
    
    const handleCloseProject = function() {
        console.log('Continue Exploring clicked'); // Debug log
        closeProject();
    };
    
    // Show project as info notification with demo button
    showNotification(
        'info',
        project.name,
        project.description,
        'Explore this amazing project!',
        'OK',
        [
            {
                text: 'View Demo',
                icon: 'fa-solid fa-external-link',
                class: 'demo-btn',
                onclick: handleViewDemo
            },
            {
                text: 'Continue Exploring',
                icon: 'fa-solid fa-rocket',
                class: 'close-btn',
                onclick: handleCloseProject
            }
        ]
    );
    
    // Set up 5-second auto-close timer
    gameState.projectPanelTimer = setTimeout(() => {
        console.log('Auto-closing project panel after 5 seconds');
        closeProject();
    }, 5000);
    
    updateProgress(); // Update progress when a project is shown
}

// Close project panel
export function closeProject() {
    // Clear the auto-close timer if it exists
    if (gameState.projectPanelTimer) {
        clearTimeout(gameState.projectPanelTimer);
        gameState.projectPanelTimer = null;
    }
    
    // Close the notification modal
    closeNotificationModal();
    
    // Store the recently closed project to prevent immediate reopening
    gameState.recentlyClosedProject = gameState.currentProject;
    gameState.currentProject = null;
    
    // Also handle legacy project panel elements
    const projectPanel = document.getElementById('projectPanel');
    const qrArea = document.getElementById('qrArea');
    
    if (projectPanel) projectPanel.classList.remove('active');
    if (qrArea) qrArea.classList.remove('active');
}

// Open project demo in new tab
export function openDemo() {
    if (gameState.currentProject && gameState.currentProject.url) {
        window.open(gameState.currentProject.url, '_blank');
    }
}

// Start the space journey
export function startJourney() {
    const landingPage = document.getElementById('landingPage');
    if (landingPage) {
        landingPage.classList.add('hidden');
    }
    
    gameState.gameStarted = true;
    
    // Start background music when game begins
    playBackgroundMusic();
    
    // Initialize mute button state
    initializeMuteButton();
    
    updateProgress(); // Ensure progress is updated when game starts
}

// Start the space journey with rocket animation
export function startJourneyWithAnimation() {
    const rocketBtn = document.querySelector('.rocket-btn');
    
    // Prevent multiple clicks during animation
    if (rocketBtn && rocketBtn.classList.contains('launching')) {
        return; // Already launching
    }
    
    if (rocketBtn) {
        // Add launching class to trigger animation
        rocketBtn.classList.add('launching');
        
        // Start the actual journey after animation completes
        setTimeout(() => {
            startJourney();
        }, 1200); // Match the animation duration
    } else {
        // Fallback if button not found
        startJourney();
    }
}

// Toggle music
export function toggleMusic() {
    const enabled = toggleBackgroundMusic();
    console.log('Music', enabled ? 'enabled' : 'disabled');
    
    // Update mute button appearance
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');
    const muteText = document.getElementById('muteText');
    
    if (muteBtn && muteIcon && muteText) {
        if (enabled) {
            // Music is enabled - show volume icon
            muteBtn.classList.remove('muted');
            muteIcon.className = 'fa-solid fa-volume-high';
            muteText.textContent = 'Mute';
        } else {
            // Music is disabled - show muted icon
            muteBtn.classList.add('muted');
            muteIcon.className = 'fa-solid fa-volume-xmark';
            muteText.textContent = 'Unmute';
        }
    }
}

// Resize canvas to fit window
export function resizeCanvas() {
    const canvas = gameState.canvas;
    if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Update astronaut position if it's outside bounds
        if (gameState.astronaut.x > canvas.width) gameState.astronaut.x = canvas.width / 2;
        if (gameState.astronaut.y > canvas.height) gameState.astronaut.y = canvas.height / 2;
        
        // Reset background cache when window is resized
        if (window.resetBackgroundCache) {
            window.resetBackgroundCache();
        }
    }
}

// Reset progress with confirmation and return to landing page
export function resetGameProgress() {
    showNotification(
        'warning',
        'Reset Progress',
        'Are you sure you want to reset all progress?',
        'This will clear all discovered planets, reset astronaut position, remove saved progress, and return to landing page. This action cannot be undone!',
        'OK',
        [
            {
                text: 'Cancel',
                icon: 'fa-solid fa-xmark',
                class: 'cancel-btn',
                onclick: closeNotificationModal
            },
            {
                text: 'Reset Progress',
                icon: 'fa-solid fa-arrows-rotate',
                class: 'confirm-btn',
                onclick: confirmReset
            }
        ]
    );
}

// Confirm reset action
export function confirmReset() {
    closeNotificationModal();
    
    const success = resetProgress();
    if (success) {
        // Show the landing page again
        const landingPage = document.getElementById('landingPage');
        if (landingPage) {
            landingPage.classList.remove('hidden');
        }
        
        // Reset rocket button state
        const rocketBtn = document.querySelector('.rocket-btn');
        if (rocketBtn) {
            rocketBtn.classList.remove('launching');
        }
        
        // Reset game state
        gameState.gameStarted = false;
        
        // Update progress display
        updateProgress();
        
        // Show success message after a brief delay
        setTimeout(() => {
            showNotification(
                'success',
                'Reset Complete',
                'Progress has been reset successfully!',
                'Welcome back to the launch pad! 🚀'
            );
        }, 500);
    } else {
        showNotification(
            'error',
            'Error',
            'Failed to reset progress. Please try again.'
        );
    }
}

// Generic notification system
export function showNotification(type, title, message, subtitle = '', buttonText = 'OK', buttons = []) {
    const notificationModal = document.getElementById('notificationModal');
    const notificationHeader = document.getElementById('notificationHeader');
    const notificationIcon = document.getElementById('notificationIcon');
    const notificationTitle = document.getElementById('notificationTitle');
    const notificationLargeIcon = document.getElementById('notificationLargeIcon');
    const notificationMessage = document.getElementById('notificationMessage');
    const notificationSubtitle = document.getElementById('notificationSubtitle');
    const notificationFooter = document.querySelector('#notificationModal .notification-modal-footer');
    
    if (!notificationFooter) {
        console.error('Notification footer not found');
        return;
    }
    
    // Set type-specific styles and icons
    const typeConfig = {
        error: {
            icon: 'fa-solid fa-circle-exclamation',
            largeIcon: 'fa-solid fa-triangle-exclamation',
            color: '#e74c3c'
        },
        success: {
            icon: 'fa-solid fa-check-circle',
            largeIcon: 'fa-solid fa-rocket',
            color: '#27ae60'
        },
        warning: {
            icon: 'fa-solid fa-exclamation-triangle',
            largeIcon: 'fa-solid fa-exclamation-triangle',
            color: '#f39c12'
        },
        info: {
            icon: 'fa-solid fa-info-circle',
            largeIcon: 'fa-solid fa-info-circle',
            color: '#0078D4'
        }
    };
    
    const config = typeConfig[type] || typeConfig.info;
    
    // Clear existing type classes
    notificationModal.classList.remove('error', 'success', 'warning', 'info');
    
    // Add new type class
    notificationModal.classList.add(type);
    
    // Set content
    if (notificationIcon) {
        notificationIcon.className = `notification-icon ${config.icon}`;
    }
    if (notificationTitle) {
        notificationTitle.textContent = title;
    }
    if (notificationLargeIcon) {
        notificationLargeIcon.className = `notification-large-icon ${config.largeIcon}`;
        notificationLargeIcon.style.color = config.color;
    }
    if (notificationMessage) {
        notificationMessage.textContent = message;
        notificationMessage.style.color = config.color;
    }
    if (notificationSubtitle) {
        notificationSubtitle.textContent = subtitle;
        notificationSubtitle.style.display = subtitle ? 'block' : 'none';
    }
    
    // Handle multiple buttons for confirmation dialogs
    if (buttons.length > 0) {
        notificationFooter.innerHTML = '';
        buttons.forEach((button, index) => {
            const btn = document.createElement('button');
            btn.className = `notification-btn ${button.class || ''}`;
            btn.innerHTML = `${button.icon ? `<i class="${button.icon}"></i>` : ''} ${button.text}`;
            
            // Ensure onclick is properly set using addEventListener
            if (button.onclick && typeof button.onclick === 'function') {
                btn.addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    button.onclick();
                });
            }
            
            notificationFooter.appendChild(btn);
        });
    } else {
        // Single button (default behavior)
        notificationFooter.innerHTML = '';
        const btn = document.createElement('button');
        btn.className = 'notification-btn';
        btn.id = 'notificationButton';
        btn.innerHTML = `<i class="fa-solid fa-check"></i> ${buttonText}`;
        
        // Use addEventListener instead of onclick attribute
        btn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeNotificationModal();
        });
        
        notificationFooter.appendChild(btn);
    }
    
    // Show modal
    if (notificationModal) {
        notificationModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// Close notification modal
export function closeNotificationModal() {
    const notificationModal = document.getElementById('notificationModal');
    if (notificationModal) {
        notificationModal.classList.remove('active');
        document.body.style.overflow = 'hidden'; // Keep hidden since we're in a game
    }
}

// Initialize modal event listeners
export function initializeModalEventListeners() {
    // Close button in header
    const closeBtn = document.getElementById('closeNotificationBtn');
    if (closeBtn) {
        closeBtn.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeNotificationModal();
        });
    }
    
    // Overlay click to close
    const overlay = document.getElementById('notificationOverlay');
    if (overlay) {
        overlay.addEventListener('click', function(event) {
            event.preventDefault();
            event.stopPropagation();
            closeNotificationModal();
        });
    }
}

// Initialize mute button state
export function initializeMuteButton() {
    const muteBtn = document.getElementById('muteBtn');
    const muteIcon = document.getElementById('muteIcon');
    const muteText = document.getElementById('muteText');
    
    if (muteBtn && muteIcon && muteText) {
        // Set initial state based on game state
        if (gameState.musicEnabled) {
            muteBtn.classList.remove('muted');
            muteIcon.className = 'fa-solid fa-volume-high';
            muteText.textContent = 'Mute';
        } else {
            muteBtn.classList.add('muted');
            muteIcon.className = 'fa-solid fa-volume-xmark';
            muteText.textContent = 'Unmute';
        }
    }
}

// Generate stars immediately when the module loads
document.addEventListener('DOMContentLoaded', () => {
    initializeModalEventListeners();
});

// Also generate stars if DOM is already loaded
if (document.readyState !== 'loading') {
    initializeModalEventListeners();
}

// Make functions globally available for HTML onclick handlers
window.startJourney = startJourney;
window.startJourneyWithAnimation = startJourneyWithAnimation;
window.closeProject = closeProject;
window.openDemo = openDemo;
window.showProjectPanel = showProjectPanel;
window.resetGameProgress = resetGameProgress;
window.confirmReset = confirmReset;
window.showNotification = showNotification;
window.closeNotificationModal = closeNotificationModal;
window.toggleMusic = toggleMusic;
