// ===================================================================
// INPUT HANDLING
// ===================================================================

import { gameState } from './gameState.js';
import { setAstronautTarget } from './physics.js';
import { toggleMusic } from './ui.js';

// Initialize input handlers
export function initializeInputHandlers() {
    const canvas = gameState.canvas;
    
    // Mouse/touch controls for astronaut movement
    canvas.addEventListener('click', handleCanvasClick);
    
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
}

// Handle canvas click events
function handleCanvasClick(e) {
    if (!gameState.gameStarted) return;
    
    const rect = gameState.canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setAstronautTarget(x, y);
}

// Handle keyboard events
function handleKeyDown(e) {
    switch(e.key.toLowerCase()) {
        case 'm':
            toggleMusic();
            break;
        case 'escape':
            // Close any open panels
            if (window.closeProject) {
                window.closeProject();
            }
            break;
        case 'r':
            // Reset progress (with Ctrl+R or Shift+R)
            if (e.ctrlKey || e.shiftKey) {
                e.preventDefault();
                if (window.resetGameProgress) {
                    window.resetGameProgress();
                }
            }
            break;
        // Add more keyboard shortcuts as needed
    }
}

// Handle touch events for mobile
export function initializeTouchHandlers() {
    const canvas = gameState.canvas;
    
    canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
}

function handleTouchStart(e) {
    e.preventDefault();
    if (!gameState.gameStarted) return;
    
    const touch = e.touches[0];
    const rect = gameState.canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    setAstronautTarget(x, y);
}

function handleTouchMove(e) {
    e.preventDefault();
}
