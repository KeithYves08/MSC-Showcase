// ===================================================================
// RENDERING FUNCTIONS
// ===================================================================

import { gameState } from './gameState.js';
import { PROJECT_ICONS } from './config.js';

// Draw the astronaut/spaceship character
export function drawAstronaut() {
    const astronaut = gameState.astronaut;
    const ctx = gameState.ctx;
    
    ctx.save();
    ctx.translate(astronaut.x, astronaut.y);
    ctx.rotate(astronaut.angle);
    
    // Astronaut body (simplified spaceship design)
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.ellipse(0, 0, astronaut.size, astronaut.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Astronaut details
    ctx.fillStyle = '#0078D4';
    ctx.beginPath();
    ctx.ellipse(0, -5, astronaut.size * 0.6, astronaut.size * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Thruster glow
    ctx.fillStyle = '#00BCF2';
    ctx.globalAlpha = 0.6;
    ctx.beginPath();
    ctx.ellipse(0, astronaut.size, astronaut.size * 0.3, astronaut.size * 0.2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    ctx.restore();
}

// Draw all project planets with pulsing effects
export function drawProjects() {
    const ctx = gameState.ctx;
    
    gameState.projects.forEach(project => {
        ctx.save();
        
        // Planet glow effect with pulsing
        const glowPulse = Math.sin(project.pulse) * 0.5 + 0.5; // Creates value between 0 and 1
        if (project.discovered) {
            ctx.shadowColor = project.color;
            ctx.shadowBlur = 15 + (glowPulse * 20); // Pulses between 15 and 35
        } else {
            ctx.shadowColor = project.color;
            ctx.shadowBlur = 8 + (glowPulse * 12); // Pulses between 8 and 20
        }
        
        // Planet body
        ctx.fillStyle = project.color;
        ctx.beginPath();
        ctx.arc(project.x, project.y, project.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet surface details
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc(project.x - project.size * 0.3, project.y - project.size * 0.3, project.size * 0.4, 0, Math.PI * 2);
        ctx.fill();
        
        // Discovery indicator ring
        if (project.discovered) {
            ctx.strokeStyle = '#00BCF2';
            ctx.lineWidth = 3;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(project.x, project.y, project.size + 10, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        // Project type icon
        ctx.fillStyle = '#ffffff';
        ctx.font = `${project.size * 0.6}px Arial`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Get icon for project type
        const icon = PROJECT_ICONS[project.type] || PROJECT_ICONS.default;
        ctx.fillText(icon, project.x, project.y);
        
        ctx.restore();
        
        // Update pulse animation
        project.pulse += 0.08;
    });
}

// Clear the canvas
export function clearCanvas() {
    const ctx = gameState.ctx;
    const canvas = gameState.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
