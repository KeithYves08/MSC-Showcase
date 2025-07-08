// ===================================================================
// GAME PHYSICS AND LOGIC
// ===================================================================

import { gameState, areAllRegularPlanetsDiscovered, addQRPlanet } from './gameState.js';
import { CONFIG } from './config.js';
import { saveProgress } from './saveLoad.js';
import { updateProgress } from './ui.js';

// Check for collisions between astronaut and planets
export function checkCollisions() {
    const astronaut = gameState.astronaut;
    
    gameState.projects.forEach(project => {
        const dx = astronaut.x - project.x;
        const dy = astronaut.y - project.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < astronaut.size + project.size + CONFIG.ASTRONAUT.COLLISION_BUFFER) {
            if (!project.discovered) {
                project.discovered = true;
                gameState.discoveredProjects.add(project.id);
                saveProgress();
                updateProgress(); // Update progress bar immediately
                
                // Check if all regular planets are discovered and QR planet should appear
                if (areAllRegularPlanetsDiscovered() && !hasQRPlanet()) {
                    addQRPlanet();
                }
            }
            
            // Check if this project was recently closed - if so, don't reopen it
            if (gameState.recentlyClosedProject && gameState.recentlyClosedProject.id === project.id) {
                return; // Skip showing the panel for this project
            }
            
            // Only show project panel if there's no current project or it's different
            if (!gameState.currentProject || gameState.currentProject.id !== project.id) {
                // Set current project for UI display
                gameState.currentProject = project;
                
                // Trigger UI updates
                if (window.showProjectPanel) {
                    window.showProjectPanel(project);
                }
                
                // Show QR area if it's the QR project
                if (project.isQR && document.getElementById('qrArea')) {
                    document.getElementById('qrArea').classList.add('active');
                }
            }
        } else {
            // If astronaut moves away from the recently closed project, clear the flag
            if (gameState.recentlyClosedProject && gameState.recentlyClosedProject.id === project.id) {
                gameState.recentlyClosedProject = null;
            }
        }
    });
}

// Update astronaut movement towards target
export function updateAstronaut() {
    const astronaut = gameState.astronaut;
    const dx = astronaut.targetX - astronaut.x;
    const dy = astronaut.targetY - astronaut.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
        astronaut.x += (dx / distance) * astronaut.speed;
        astronaut.y += (dy / distance) * astronaut.speed;
        
        // Update angle based on movement direction
        astronaut.angle = Math.atan2(dy, dx) + Math.PI / 2;
    }
}

// Set astronaut target position
export function setAstronautTarget(x, y) {
    gameState.astronaut.targetX = x;
    gameState.astronaut.targetY = y;
}

// Adjust project positions to fit within screen bounds
export function adjustProjectPositions() {
    const canvas = gameState.canvas;
    if (!canvas) return;
    
    gameState.projects.forEach(project => {
        // Ensure projects stay within bounds with some padding
        project.x = Math.min(project.x, canvas.width - project.size - 50);
        project.y = Math.min(project.y, canvas.height - project.size - 50);
        project.x = Math.max(project.x, project.size + 50);
        project.y = Math.max(project.y, project.size + 50);
    });
}

// Check if QR planet exists
function hasQRPlanet() {
    return gameState.projects.some(project => project.isQR);
}
