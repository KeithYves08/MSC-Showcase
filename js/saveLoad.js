// ===================================================================
// SAVE/LOAD SYSTEM
// ===================================================================

import { CONFIG } from './config.js';
import { gameState, clearAllTrails } from './gameState.js';
import { updateProgress } from './ui.js';
import { stopThrustSound } from './audio.js';

// Load saved progress from localStorage
export function loadProgress() {
    const saved = localStorage.getItem(CONFIG.STORAGE_KEY);
    if (saved) {
        try {
            const progress = JSON.parse(saved);
            const canvas = gameState.canvas;
            
            gameState.astronaut.x = progress.astronautX || canvas.width / 2;
            gameState.astronaut.y = progress.astronautY || canvas.height / 2;
            gameState.astronaut.targetX = gameState.astronaut.x;
            gameState.astronaut.targetY = gameState.astronaut.y;
            gameState.discoveredProjects = new Set(progress.discovered || []);
            
            // Update project states
            gameState.projects.forEach(project => {
                if (gameState.discoveredProjects.has(project.id)) {
                    project.discovered = true;
                }
            });
            
            return true;
        } catch (error) {
            console.warn('Failed to load progress:', error);
            return false;
        }
    }
    return false;
}

// Save progress to localStorage
export function saveProgress() {
    try {
        const progress = {
            astronautX: gameState.astronaut.x,
            astronautY: gameState.astronaut.y,
            discovered: Array.from(gameState.discoveredProjects),
            timestamp: Date.now()
        };
        localStorage.setItem(CONFIG.STORAGE_KEY, JSON.stringify(progress));
        return true;
    } catch (error) {
        console.warn('Failed to save progress:', error);
        return false;
    }
}

// Clear saved progress
export function clearProgress() {
    try {
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        return true;
    } catch (error) {
        console.warn('Failed to clear progress:', error);
        return false;
    }
}

// Auto-save progress periodically
export function autoSave() {
    if (Math.random() < CONFIG.ANIMATION.SAVE_FREQUENCY) {
        saveProgress();
    }
}

// Reset all progress and restart the game
export function resetProgress() {
    try {
        // Stop any playing sounds
        stopThrustSound();
        
        // Clear localStorage
        localStorage.removeItem(CONFIG.STORAGE_KEY);
        
        // Reset game state
        gameState.discoveredProjects.clear();
        gameState.currentProject = null;
        gameState.gameStarted = false;
        
        // Clear all trails
        clearAllTrails();
        
        // Reset all projects to undiscovered
        gameState.projects.forEach(project => {
            project.discovered = false;
        });
        
        // Reset astronaut to center
        const canvas = gameState.canvas;
        if (canvas) {
            gameState.astronaut.x = canvas.width / 2;
            gameState.astronaut.y = canvas.height / 2;
            gameState.astronaut.targetX = canvas.width / 2;
            gameState.astronaut.targetY = canvas.height / 2;
        }
        
        // Close any open panels
        if (window.closeProject) {
            window.closeProject();
        }
        
        // Update progress display
        updateProgress();
        
        console.log('Progress reset successfully');
        return true;
    } catch (error) {
        console.warn('Failed to reset progress:', error);
        return false;
    }
}
