// ===================================================================
// UI AND INTERFACE FUNCTIONS
// ===================================================================

import { gameState, getDiscoveryProgress } from './gameState.js';
import { CONFIG } from './config.js';
import { resetProgress } from './saveLoad.js';

// Generate animated stars background
export function generateStars() {
    const starsContainer = document.getElementById('stars');
    if (!starsContainer) return;
    
    // Clear existing stars
    starsContainer.innerHTML = '';
    
    // Generate regular stars
    for (let i = 0; i < CONFIG.STARS.COUNT; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        
        // Add variety to stars - different sizes and brightness
        const size = Math.random() * 3 + 1; // 1-4px
        const opacity = Math.random() * 0.8 + 0.2; // 0.2-1.0
        
        star.style.width = size + 'px';
        star.style.height = size + 'px';
        star.style.opacity = opacity;
        
        // Some stars twinkle faster
        if (Math.random() < 0.3) {
            star.style.animationDuration = (Math.random() * 2 + 1) + 's';
        }
        
        starsContainer.appendChild(star);
    }
    
    // Generate bright stars (fewer, more special)
    for (let i = 0; i < 20; i++) {
        const brightStar = document.createElement('div');
        brightStar.className = 'bright-star';
        brightStar.style.left = Math.random() * 100 + '%';
        brightStar.style.top = Math.random() * 100 + '%';
        brightStar.style.animationDelay = Math.random() * 4 + 's';
        starsContainer.appendChild(brightStar);
    }
    
    // Generate shooting stars (very few, random timing)
    for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        shootingStar.style.left = Math.random() * 100 + '%';
        shootingStar.style.top = Math.random() * 50 + '%'; // Keep in upper half
        shootingStar.style.animationDelay = Math.random() * 10 + 5 + 's'; // 5-15s delay
        shootingStar.style.animationDuration = (Math.random() * 2 + 2) + 's'; // 2-4s duration
        starsContainer.appendChild(shootingStar);
    }
}

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
    
    const projectTitle = document.getElementById('projectTitle');
    const projectDescription = document.getElementById('projectDescription');
    const projectPanel = document.getElementById('projectPanel');
    
    if (projectTitle) projectTitle.textContent = project.name;
    if (projectDescription) projectDescription.textContent = project.description;
    if (projectPanel) projectPanel.classList.add('active');
    
    updateProgress(); // Update progress when a project is shown
}

// Close project panel
export function closeProject() {
    const projectPanel = document.getElementById('projectPanel');
    const qrArea = document.getElementById('qrArea');
    
    if (projectPanel) projectPanel.classList.remove('active');
    if (qrArea) qrArea.classList.remove('active');
    
    gameState.currentProject = null;
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
    gameState.musicEnabled = !gameState.musicEnabled;
    // Add music toggle logic here
    console.log('Music', gameState.musicEnabled ? 'enabled' : 'disabled');
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
    }
}

// Reset progress with confirmation and return to landing page
export function resetGameProgress() {
    const confirmed = confirm(
        "Are you sure you want to reset all progress?\n\n" +
        "This will:\n" +
        "• Clear all discovered planets\n" +
        "• Reset astronaut position\n" +
        "• Remove saved progress\n" +
        "• Return to landing page\n\n" +
        "This action cannot be undone!"
    );
    
    if (confirmed) {
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
            
            // Regenerate stars for the landing page
            generateStars();
            
            // Update progress display
            updateProgress();
            
            // Show success message after a brief delay
            setTimeout(() => {
                alert("Progress has been reset successfully!\nWelcome back to the launch pad! 🚀");
            }, 100);
        } else {
            alert("Failed to reset progress. Please try again.");
        }
    }
}

// Generate stars immediately when the module loads
document.addEventListener('DOMContentLoaded', () => {
    generateStars();
});

// Also generate stars if DOM is already loaded
if (document.readyState !== 'loading') {
    generateStars();
}

// Make functions globally available for HTML onclick handlers
window.startJourney = startJourney;
window.startJourneyWithAnimation = startJourneyWithAnimation;
window.closeProject = closeProject;
window.openDemo = openDemo;
window.showProjectPanel = showProjectPanel;
window.resetGameProgress = resetGameProgress;
