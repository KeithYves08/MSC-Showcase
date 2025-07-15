// ===================================================================
// GAME PHYSICS AND LOGIC
// ===================================================================

import { gameState, areAllRegularPlanetsDiscovered, addQRPlanet } from './gameState.js';
import { CONFIG } from './config.js';
import { saveProgress } from './saveLoad.js';
import { updateProgress } from './ui.js';
import { startThrustSound, stopThrustSound } from './audio.js';

// Check for collisions between astronaut and planets
export function checkCollisions() {
    const astronaut = gameState.astronaut;
    
    // Skip collision detection if astronaut is not moving (optimization)
    if (!astronaut.isMoving) {
        return;
    }
    
    // Use spatial optimization - only check nearby projects
    const nearbyProjects = gameState.projects.filter(project => {
        const dx = Math.abs(astronaut.x - project.x);
        const dy = Math.abs(astronaut.y - project.y);
        const maxDistance = astronaut.size + project.size + CONFIG.ASTRONAUT.COLLISION_BUFFER + 50;
        
        // Quick distance check using Manhattan distance first
        return dx < maxDistance && dy < maxDistance;
    });
    
    // Further optimize by checking only the closest projects
    if (nearbyProjects.length > 3) {
        nearbyProjects.sort((a, b) => {
            const distA = Math.abs(astronaut.x - a.x) + Math.abs(astronaut.y - a.y);
            const distB = Math.abs(astronaut.x - b.x) + Math.abs(astronaut.y - b.y);
            return distA - distB;
        });
        nearbyProjects.splice(3); // Keep only the 3 closest
    }
    
    nearbyProjects.forEach(project => {
        const dx = astronaut.x - project.x;
        const dy = astronaut.y - project.y;
        const distanceSquared = dx * dx + dy * dy;
        const collisionDistance = astronaut.size + project.size + CONFIG.ASTRONAUT.COLLISION_BUFFER;
        
        if (distanceSquared < collisionDistance * collisionDistance) {
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
    
    // Use distance squared for better performance (avoid sqrt when possible)
    const distanceSquared = dx * dx + dy * dy;
    const threshold = 25; // 5 squared
    
    if (distanceSquared > threshold) {
        // Play rocket thrust sound when starting to move
        if (!astronaut.isMoving) {
            startThrustSound();
            astronaut.isMoving = true;
        }
        
        // Use normalized movement for smoother motion
        const invDistance = 1 / distance;
        astronaut.x += dx * invDistance * astronaut.speed;
        astronaut.y += dy * invDistance * astronaut.speed;
        
        // Update angle based on movement direction (wooza.png already points right)
        astronaut.angle = Math.atan2(dy, dx);
    } else {
        // Stop thrust sound when not moving
        if (astronaut.isMoving) {
            stopThrustSound();
            astronaut.isMoving = false;
        }
        
        // Snap to target when very close to prevent micro-movements
        astronaut.x = astronaut.targetX;
        astronaut.y = astronaut.targetY;
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
