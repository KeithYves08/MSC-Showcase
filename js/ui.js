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
    
    for (let i = 0; i < CONFIG.STARS.COUNT; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 3 + 's';
        starsContainer.appendChild(star);
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

// Reset progress with confirmation
export function resetGameProgress() {
    const confirmed = confirm(
        "Are you sure you want to reset all progress?\n\n" +
        "This will:\n" +
        "• Clear all discovered planets\n" +
        "• Reset astronaut position\n" +
        "• Remove saved progress\n\n" +
        "This action cannot be undone!"
    );
    
    if (confirmed) {
        const success = resetProgress();
        if (success) {
            alert("Progress has been reset successfully!");
        } else {
            alert("Failed to reset progress. Please try again.");
        }
    }
}

// Make functions globally available for HTML onclick handlers
window.startJourney = startJourney;
window.startJourneyWithAnimation = startJourneyWithAnimation;
window.closeProject = closeProject;
window.openDemo = openDemo;
window.showProjectPanel = showProjectPanel;
window.resetGameProgress = resetGameProgress;
