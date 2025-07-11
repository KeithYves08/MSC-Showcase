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
        this.lastFrameTime = 0;
        this.deltaTime = 0;
        this.frameCount = 0;
        this.targetFPS = 60;
        this.frameInterval = 1000 / this.targetFPS;
        this.isVisible = true;
        
        // Performance monitoring
        this.performanceStats = {
            fps: 0,
            frameTime: 0,
            lastFPSUpdate: 0,
            framesSinceLastUpdate: 0
        };
        
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
        
        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            this.isVisible = !document.hidden;
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
        this.lastFrameTime = performance.now();
        this.gameLoop();
    }
    
    gameLoop(currentTime = performance.now()) {
        // Skip rendering if tab is hidden
        if (!this.isVisible) {
            this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
            return;
        }
        
        // Calculate delta time
        this.deltaTime = currentTime - this.lastFrameTime;
        
        // Update performance stats
        this.performanceStats.frameTime = this.deltaTime;
        this.performanceStats.framesSinceLastUpdate++;
        
        if (currentTime - this.performanceStats.lastFPSUpdate >= 1000) {
            this.performanceStats.fps = this.performanceStats.framesSinceLastUpdate;
            this.performanceStats.framesSinceLastUpdate = 0;
            this.performanceStats.lastFPSUpdate = currentTime;
            
            // Log performance if FPS drops below 30
            if (this.performanceStats.fps < 30) {
                console.warn(`Low FPS detected: ${this.performanceStats.fps} FPS, Frame time: ${this.performanceStats.frameTime.toFixed(2)}ms`);
            }
        }
        
        // Cap frame rate for consistent performance
        if (this.deltaTime >= this.frameInterval) {
            this.lastFrameTime = currentTime - (this.deltaTime % this.frameInterval);
            
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
                
                // Auto-save progress periodically (less frequent)
                if (this.frameCount % 300 === 0) { // Every 5 seconds at 60fps
                    autoSave();
                }
            }
            
            // Always render (so we can see the game before starting)
            drawProjects();
            if (gameState.gameStarted) {
                drawAstronaut();
            }
            
            this.frameCount++;
        }
        
        // Continue the loop
        this.animationId = requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    // Stop the game loop (useful for cleanup)
    stop() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }
    
    // Get performance stats (for debugging)
    getPerformanceStats() {
        return this.performanceStats;
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.spaceOdyssey = new SpaceOdyssey();
    
    // Add performance monitoring to console (for debugging)
    window.getPerformanceStats = () => window.spaceOdyssey.getPerformanceStats();
    
    // Optional: Add performance display in console every 10 seconds
    setInterval(() => {
        const stats = window.spaceOdyssey.getPerformanceStats();
        if (stats.fps > 0) {
            console.log(`Performance: ${stats.fps} FPS, Frame time: ${stats.frameTime.toFixed(2)}ms`);
        }
    }, 10000);
});

// Export for potential external use
export default SpaceOdyssey;
