// ===================================================================
// MAIN GAME MODULE
// ===================================================================

import { initializeGameState, gameState } from './gameState.js';
import { loadProgress, autoSave } from './saveLoad.js';
import { drawAstronaut, drawProjects, clearCanvas, clearDirtyRects, drawBackground, initSpaceCursor, animateSpaceCursor, updateCursorMode } from './renderer.js';
import { updateAstronaut, checkCollisions, adjustProjectPositions } from './physics.js';
import { resizeCanvas, updateProgress, initializeModalEventListeners } from './ui.js';
import { initializeInputHandlers, initializeTouchHandlers } from './input.js';
import { initializeAudio, playBackgroundMusic } from './audio.js';

// Main game class
class SpaceOdyssey {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.animationId = null;
        
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initialize());
        } else {
            // DOM is already loaded
            setTimeout(() => this.initialize(), 0);
        }
    }
    
    initialize() {
        // Ensure canvas exists and is properly sized
        if (!this.canvas) {
            console.error('Canvas not found!');
            return;
        }
        
        // Set up canvas dimensions first
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        
        // Initialize game state with properly sized canvas
        initializeGameState(this.canvas, this.ctx);
        
        // Initialize audio system
        initializeAudio();
        
        // Set up input handlers
        initializeInputHandlers();
        initializeTouchHandlers();
        
        // Initialize modal event listeners
        initializeModalEventListeners();
        
        // Initialize custom space cursor
        initSpaceCursor();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            resizeCanvas();
            adjustProjectPositions();
        });
        
        // Load saved progress
        loadProgress();
        updateProgress();
        
        // Adjust project positions for screen size
        adjustProjectPositions();
        
        // Start game loop when ready
        this.startGameLoop();
    }
    
    startGameLoop() {
        this.gameLoop();
    }
    
    gameLoop() {
        // Clear entire canvas to prevent visual artifacts
        clearCanvas();
        
        // Draw the space background
        drawBackground();
        
        // Update cursor mode based on game state
        updateCursorMode();
        
        // Only update game logic if game has started
        if (gameState.gameStarted) {
            // Update game state
            updateAstronaut();
            checkCollisions();
            
            // Auto-save progress periodically
            autoSave();
        }
        
        // Always render (so we can see the game before starting)
        drawProjects();
        if (gameState.gameStarted) {
            drawAstronaut();
        }
        
        // Continue the loop
        this.animationId = requestAnimationFrame(() => this.gameLoop());
    }
    
    // Stop the game loop (useful for cleanup)
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.spaceOdyssey = new SpaceOdyssey();
});

// Export for potential external use
export default SpaceOdyssey;
