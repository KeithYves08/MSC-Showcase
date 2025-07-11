// ===================================================================
// RENDERING FUNCTIONS
// ===================================================================

import { gameState } from './gameState.js';
import { PROJECT_ICONS } from './config.js';

// Rendering optimization variables
let lastAstronautPos = { x: 0, y: 0 };
let dirtyRects = [];
let backgroundCanvas = null;
let backgroundCtx = null;
let backgroundGenerated = false;

// Load wooza avatar image
let woozaImage = null;
const loadWoozaImage = () => {
    if (!woozaImage) {
        woozaImage = new Image();
        woozaImage.src = 'assets/wooza.png';
        woozaImage.onload = () => {
            console.log('Wooza image loaded successfully');
        };
    }
    return woozaImage;
};

// Initialize wooza image
loadWoozaImage();

// Create offscreen canvas for background
function createBackgroundCanvas() {
    if (!backgroundCanvas) {
        backgroundCanvas = document.createElement('canvas');
        backgroundCtx = backgroundCanvas.getContext('2d');
    }
}

// Generate background once and reuse
function generateBackground() {
    if (backgroundGenerated) return;
    
    createBackgroundCanvas();
    const canvas = gameState.canvas;
    
    backgroundCanvas.width = canvas.width;
    backgroundCanvas.height = canvas.height;
    
    // Create gradient background
    const gradient = backgroundCtx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#0B0B2F');
    gradient.addColorStop(0.5, '#1E1E3F');
    gradient.addColorStop(1, '#2D2D5F');
    
    backgroundCtx.fillStyle = gradient;
    backgroundCtx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw stars efficiently
    backgroundCtx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 2 + 0.5;
        
        backgroundCtx.beginPath();
        backgroundCtx.arc(x, y, size, 0, Math.PI * 2);
        backgroundCtx.fill();
    }
    
    backgroundGenerated = true;
}

// Reset background cache (called on resize)
export function resetBackgroundCache() {
    backgroundGenerated = false;
    if (backgroundCanvas) {
        backgroundCanvas.width = 0;
        backgroundCanvas.height = 0;
    }
}

// Export to global for access from UI
window.resetBackgroundCache = resetBackgroundCache;

// Add dirty rectangle to be redrawn
function addDirtyRect(x, y, width, height) {
    dirtyRects.push({
        x: Math.max(0, x - 5), // Add 5px padding
        y: Math.max(0, y - 5),
        width: width + 10,
        height: height + 10
    });
}

// Clear only dirty rectangles
export function clearDirtyRects() {
    const ctx = gameState.ctx;
    
    dirtyRects.forEach(rect => {
        ctx.clearRect(rect.x, rect.y, rect.width, rect.height);
    });
    
    dirtyRects = [];
}

// Draw the wooza avatar with trails
export function drawAstronaut() {
    const astronaut = gameState.astronaut;
    const ctx = gameState.ctx;
    
    // Add dirty rect for previous position
    if (lastAstronautPos.x !== astronaut.x || lastAstronautPos.y !== astronaut.y) {
        addDirtyRect(lastAstronautPos.x - astronaut.size * 3, lastAstronautPos.y - astronaut.size * 3, 
                     astronaut.size * 6, astronaut.size * 6);
        
        // Add dirty rect for current position
        addDirtyRect(astronaut.x - astronaut.size * 3, astronaut.y - astronaut.size * 3, 
                     astronaut.size * 6, astronaut.size * 6);
        
        lastAstronautPos.x = astronaut.x;
        lastAstronautPos.y = astronaut.y;
    }
    
    ctx.save();
    ctx.translate(astronaut.x, astronaut.y);
    
    // Rotate to match the wooza.png orientation (rocket already points right in the image)
    // Just use the astronaut.angle directly since the PNG is oriented correctly
    ctx.rotate(astronaut.angle);
    
    // Draw rocket trails first (behind avatar)
    drawRocketTrails(ctx, astronaut);
    
    // Draw wooza avatar
    if (woozaImage && woozaImage.complete) {
        const size = astronaut.size * 2;
        ctx.drawImage(woozaImage, -size/2, -size/2, size, size);
    } else {
        // Fallback: draw simple circle if image not loaded
        ctx.fillStyle = '#00BCF2';
        ctx.beginPath();
        ctx.arc(0, 0, astronaut.size, 0, Math.PI * 2);
        ctx.fill();
    }
    
    ctx.restore();
}

// Draw rocket trails
function drawRocketTrails(ctx, astronaut) {
    if (!gameState.rocketTrails) {
        gameState.rocketTrails = [];
    }
    
    if (!gameState.smokeTrails) {
        gameState.smokeTrails = [];
    }
    
    // Add new trail point if rocket is moving
    const isMoving = Math.abs(astronaut.x - astronaut.targetX) > 5 || 
                    Math.abs(astronaut.y - astronaut.targetY) > 5;
    
    if (isMoving) {
        // Add more flame trail particles with ultra-smooth spacing for fluid animation
        // Position trails at the back of the rocket (left side since rocket points right)
        for (let i = 0; i < 16; i++) { // Increased particle count for ultra-smooth trail
            gameState.rocketTrails.push({
                x: -astronaut.size * 1.4 - i * 2, // Further reduced spacing for seamless continuity
                y: (Math.random() - 0.5) * 4, // Reduced random spread for smoother flow
                age: 0,
                maxAge: 30 + Math.random() * 15, // More consistent lifetime for smoother fade
                trailIndex: Math.floor(i / 2), // Even more gradual color transitions
                type: i, // Different types for gradient colors
                velocity: {
                    x: -(Math.random() * 0.2 + 0.05), // Reduced drift for smoother movement
                    y: (Math.random() - 0.5) * 0.2 // Gentler vertical movement
                },
                initialSize: 0.9 + Math.random() * 0.3, // More consistent sizes for smoother appearance
                birthTime: Date.now() // Track when particle was born for sub-frame interpolation
            });
        }
        
        // Add more smoke trail particles with ultra-smooth fluidity
        for (let i = 0; i < 10; i++) { // Increased smoke particles for seamless smoke
            gameState.smokeTrails.push({
                x: -astronaut.size * 1.9 - i * 1.5, // Closer spacing for smoother smoke
                y: Math.random() * 4 - 2, // Reduced vertical spread for cleaner flow
                age: 0,
                maxAge: 35 + Math.random() * 15, // More consistent smoke lifetime
                vx: -(Math.random() * 0.2 + 0.1), // Smoother backward movement
                vy: (Math.random() - 0.5) * 0.15, // Minimal vertical drift
                initialSize: 0.9 + Math.random() * 0.2, // More consistent smoke sizes
                birthTime: Date.now() // Track birth time for interpolation
            });
        }
    }
    
    // Draw smoke trails first (furthest back) with ultra-smooth fluidity
    gameState.smokeTrails.forEach((smoke, index) => {
        // Ultra-smooth easing function for alpha transition
        const ageProgress = smoke.age / smoke.maxAge;
        const smoothEase = 1 - (ageProgress * ageProgress * (3 - 2 * ageProgress)); // Smoothstep function
        const alpha = Math.max(0, smoothEase);
        
        // Ultra-smooth size transition with custom easing
        const sizeProgress = 1 - ageProgress;
        const smoothSize = sizeProgress * sizeProgress * (3 - 2 * sizeProgress); // Smoothstep for size
        const size = smoothSize * astronaut.size * 0.6 * smoke.initialSize;
        
        // Sub-frame interpolation for ultra-smooth movement
        const timeSinceBirth = Date.now() - smoke.birthTime;
        const subFrameOffset = (timeSinceBirth % 16.67) / 16.67; // 60fps timing
        
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = `rgba(220, 220, 220, ${alpha * 0.5})`;
        ctx.beginPath();
        ctx.ellipse(
            smoke.x + smoke.vx * subFrameOffset, 
            smoke.y + smoke.vy * subFrameOffset, 
            size * 0.6, size * 0.8, 0, 0, Math.PI * 2
        );
        ctx.fill();
        
        // Update smoke position with ultra-smooth movement
        smoke.x += smoke.vx;
        smoke.y += smoke.vy;
        
        // Apply gradual drag for more realistic movement
        smoke.vx *= 0.995;
        smoke.vy *= 0.99;
        
        smoke.age += 0.8; // Slower aging for smoother transitions
        
        if (smoke.age >= smoke.maxAge) {
            gameState.smokeTrails.splice(index, 1);
        }
    });
    
    // Draw flame trails with Microsoft brand color gradient and ultra-smooth fluidity
    gameState.rocketTrails.forEach((trail, index) => {
        // Ultra-smooth easing functions for perfect animation
        const ageProgress = trail.age / trail.maxAge;
        const smoothEase = 1 - (ageProgress * ageProgress * ageProgress); // Cubic ease-out for ultra-smooth fade
        const alpha = Math.max(0.15, smoothEase); // Higher minimum alpha for better visibility
        
        // Microsoft brand color gradient based on fixed trail position, not age
        // Color distribution: Red 60% (0-6), Yellow 25% (7-9), Green 10% (10), Blue 5% (11)
        let color;
        const trailPos = trail.trailIndex;
        
        if (trailPos <= 3) {
            // Red section - #f25022 (60% - positions 0-6)
            color = `rgba(242, 80, 34, ${Math.max(0.8, alpha)})`;
        } else if (trailPos <= 5) {
            // Yellow section - #ffb900 (25% - positions 7-9)
            color = `rgba(255, 185, 0, ${Math.max(0.8, alpha)})`;
        } else if (trailPos <= 6) {
            // Green section - #7fba00 (10% - position 10)
            color = `rgba(127, 186, 0, ${Math.max(0.7, alpha)})`;
        } else {
            // Blue section - #00a4ef (5% - position 11)
            color = `rgba(0, 164, 239, ${Math.max(0.6, alpha)})`;
        }
        
        ctx.globalAlpha = 1;
        ctx.fillStyle = color;
        
        // Ultra-smooth glow effect with subtle pulsing
        ctx.shadowColor = color;
        ctx.shadowBlur = 5 + Math.sin(trail.age * 0.2) * 1; // Gentler pulsating glow
        
        // Ultra-smooth size transitions with perfect easing
        const sizeProgress = 1 - ageProgress;
        const smoothSize = sizeProgress * sizeProgress * (3 - 2 * sizeProgress); // Smoothstep
        const baseSize = astronaut.size * 0.8 * trail.initialSize;
        const wedgeWidth = baseSize * 0.9 * smoothSize;
        const wedgeLength = baseSize * 1.6 * smoothSize;
        
        // Sub-frame interpolation for ultra-smooth particle movement
        const timeSinceBirth = Date.now() - trail.birthTime;
        const subFrameOffset = (timeSinceBirth % 16.67) / 16.67; // 60fps timing
        
        // Update particle position with ultra-smooth fluid movement
        if (trail.velocity) {
            const smoothVelX = trail.velocity.x * subFrameOffset;
            const smoothVelY = trail.velocity.y * subFrameOffset;
            
            trail.x += trail.velocity.x;
            trail.y += trail.velocity.y;
            
            // Apply ultra-gradual drag for more realistic physics
            trail.velocity.x *= 0.992;
            trail.velocity.y *= 0.988;
        }
        
        // Draw wedge shape with ultra-smooth curves
        ctx.beginPath();
        ctx.moveTo(trail.x, trail.y - wedgeWidth/2);
        // Ultra-smooth bezier curves for organic flame look
        ctx.bezierCurveTo(
            trail.x - wedgeLength * 0.2, trail.y - wedgeWidth * 0.4,
            trail.x - wedgeLength * 0.6, trail.y - wedgeWidth * 0.1,
            trail.x - wedgeLength, trail.y
        );
        ctx.bezierCurveTo(
            trail.x - wedgeLength * 0.6, trail.y + wedgeWidth * 0.1,
            trail.x - wedgeLength * 0.2, trail.y + wedgeWidth * 0.4,
            trail.x, trail.y + wedgeWidth/2
        );
        ctx.closePath();
        ctx.fill();
        
        // Add inner bright core with ultra-smooth transitions
        if (alpha > 0.25) {
            ctx.shadowBlur = 3 + Math.sin(trail.age * 0.25) * 0.8; // Ultra-subtle pulsing
            const coreAlpha = Math.min(1, alpha * 1.4);
            const coreColor = color.replace(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*[\d.]+\)/, 
                `rgba($1, $2, $3, ${coreAlpha})`);
            ctx.fillStyle = coreColor;
            
            // Inner wedge core with ultra-smooth bezier curves
            const coreWidth = wedgeWidth * 0.6;
            const coreLength = wedgeLength * 0.75;
            
            ctx.beginPath();
            ctx.moveTo(trail.x, trail.y - coreWidth/2);
            ctx.bezierCurveTo(
                trail.x - coreLength * 0.2, trail.y - coreWidth * 0.3,
                trail.x - coreLength * 0.6, trail.y - coreWidth * 0.05,
                trail.x - coreLength, trail.y
            );
            ctx.bezierCurveTo(
                trail.x - coreLength * 0.6, trail.y + coreWidth * 0.05,
                trail.x - coreLength * 0.2, trail.y + coreWidth * 0.3,
                trail.x, trail.y + coreWidth/2
            );
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.shadowBlur = 0;
        trail.age += 0.7; // Slower aging for smoother, longer-lasting trails
        if (trail.age >= trail.maxAge) {
            gameState.rocketTrails.splice(index, 1);
        }
    });
    
    ctx.globalAlpha = 1;
}

// Draw all project planets with pulsing effects
export function drawProjects() {
    const ctx = gameState.ctx;
    
    gameState.projects.forEach(project => {
        ctx.save();
        
        // Simplified planet rendering for better performance
        
        // Planet glow effect (simplified)
        if (project.discovered) {
            ctx.shadowColor = project.color;
            ctx.shadowBlur = 15;
        } else {
            ctx.shadowColor = project.color;
            ctx.shadowBlur = 8;
        }
        
        // Single planet body (remove multiple layers for performance)
        const planetGradient = ctx.createRadialGradient(
            project.x - project.size * 0.3, project.y - project.size * 0.3, 0,
            project.x, project.y, project.size
        );
        
        // Create color variations based on project type
        const r = parseInt(project.color.substr(1, 2), 16);
        const g = parseInt(project.color.substr(3, 2), 16);
        const b = parseInt(project.color.substr(5, 2), 16);
        
        planetGradient.addColorStop(0, `rgba(${Math.min(255, r + 60)}, ${Math.min(255, g + 60)}, ${Math.min(255, b + 60)}, 1)`);
        planetGradient.addColorStop(0.3, project.color);
        planetGradient.addColorStop(0.7, `rgba(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)}, 1)`);
        planetGradient.addColorStop(1, `rgba(${Math.max(0, r - 80)}, ${Math.max(0, g - 80)}, ${Math.max(0, b - 80)}, 0.8)`);
        
        ctx.fillStyle = planetGradient;
        ctx.beginPath();
        ctx.arc(project.x, project.y, project.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet surface features - multiple layers
        // Large surface formations
        ctx.fillStyle = `rgba(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)}, 0.3)`;
        ctx.beginPath();
        ctx.arc(project.x - project.size * 0.3, project.y - project.size * 0.4, project.size * 0.2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(project.x + project.size * 0.4, project.y - project.size * 0.1, project.size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Dark surface features (craters/valleys)
        ctx.fillStyle = `rgba(${Math.max(0, r - 60)}, ${Math.max(0, g - 60)}, ${Math.max(0, b - 60)}, 0.4)`;
        ctx.beginPath();
        ctx.arc(project.x + project.size * 0.1, project.y + project.size * 0.3, project.size * 0.12, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(project.x - project.size * 0.5, project.y + project.size * 0.1, project.size * 0.08, 0, Math.PI * 2);
        ctx.fill();
        
        // Smaller surface details
        ctx.fillStyle = `rgba(${Math.min(255, r + 20)}, ${Math.min(255, g + 20)}, ${Math.min(255, b + 20)}, 0.2)`;
        ctx.beginPath();
        ctx.arc(project.x + project.size * 0.2, project.y - project.size * 0.6, project.size * 0.06, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.beginPath();
        ctx.arc(project.x - project.size * 0.1, project.y + project.size * 0.5, project.size * 0.05, 0, Math.PI * 2);
        ctx.fill();
        
        // Planet terminator line (day/night division)
        const terminatorGradient = ctx.createLinearGradient(
            project.x - project.size, project.y - project.size,
            project.x + project.size, project.y + project.size
        );
        terminatorGradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        terminatorGradient.addColorStop(0.6, 'rgba(0, 0, 0, 0.1)');
        terminatorGradient.addColorStop(0.8, 'rgba(0, 0, 0, 0.3)');
        terminatorGradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
        
        ctx.fillStyle = terminatorGradient;
        ctx.beginPath();
        ctx.arc(project.x, project.y, project.size, 0, Math.PI * 2);
        ctx.fill();
        
        // Discovery ring effects
        if (project.discovered) {
            // Inner discovery ring
            ctx.strokeStyle = project.color;
            ctx.lineWidth = 3;
            ctx.globalAlpha = 0.8;
            ctx.beginPath();
            ctx.arc(project.x, project.y, project.size + 15, 0, Math.PI * 2);
            ctx.stroke();
            
            // Outer discovery ring
            ctx.strokeStyle = project.color;
            ctx.lineWidth = 2;
            ctx.globalAlpha = 0.5;
            ctx.beginPath();
            ctx.arc(project.x, project.y, project.size + 25, 0, Math.PI * 2);
            ctx.stroke();
            ctx.globalAlpha = 1;
        }
        
        // Planet icon with enhanced visibility
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.beginPath();
        ctx.arc(project.x, project.y, 18, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.shadowBlur = 0;
        ctx.fillStyle = 'white';
        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(PROJECT_ICONS[project.type] || '🌐', project.x, project.y);
        
        ctx.restore();
        
        // Update pulse animation
        project.pulse += 0.08;
    });
}

// Draw the space background
export function drawBackground() {
    const ctx = gameState.ctx;
    const canvas = gameState.canvas;
    
    // Check if context and canvas are available
    if (!ctx || !canvas) {
        console.error('Canvas context or canvas not available for background drawing');
        return;
    }
    
    // Generate background once and reuse
    generateBackground();
    
    // Simply draw the pre-generated background
    if (backgroundCanvas && backgroundGenerated) {
        ctx.drawImage(backgroundCanvas, 0, 0);
    }
}

// Clear the canvas
export function clearCanvas() {
    const ctx = gameState.ctx;
    const canvas = gameState.canvas;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// ===================================================================
// CUSTOM SPACE ODYSSEY CURSOR
// ===================================================================

// Cursor variables
let spaceCursor = null;
let cursorTrails = [];
let lastCursorPos = { x: 0, y: 0 };
let cursorTrailTimer = 0;
let cursorAnimationId = null;

// Initialize custom cursor
export function initSpaceCursor() {
    spaceCursor = document.getElementById('spaceCursor');
    if (!spaceCursor) return;
    
    // Mouse move handler
    document.addEventListener('mousemove', handleCursorMove);
    
    // Mouse enter/leave handlers for hover effects
    document.addEventListener('mouseenter', showCursor);
    document.addEventListener('mouseleave', hideCursor);
    
    // Click handlers for click effects
    document.addEventListener('mousedown', handleCursorClick);
    document.addEventListener('mouseup', handleCursorRelease);
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll(
        'button, .rocket-btn, canvas, a, input, textarea, select, .clickable, .interactive, .nav-item, .modal-close'
    );
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', () => {
            spaceCursor.classList.add('hover');
        });
        element.addEventListener('mouseleave', () => {
            spaceCursor.classList.remove('hover');
        });
    });
    
    // Start cursor visible
    showCursor();
}

// Handle cursor movement
function handleCursorMove(e) {
    if (!spaceCursor) return;
    
    const x = e.clientX;
    const y = e.clientY;
    
    // Use transform for better performance instead of left/top
    spaceCursor.style.transform = `translate(${x}px, ${y}px)`;
    
    // Reduce trail creation frequency to minimize DOM operations
    createCursorTrail(x, y);
    
    lastCursorPos = { x, y };
}

// Create cursor trail particles
function createCursorTrail(x, y) {
    cursorTrailTimer++;
    
    // Create trail every 8 frames for minimal DOM operations
    if (cursorTrailTimer % 8 === 0) {
        const trail = document.createElement('div');
        trail.className = 'cursor-trail';
        trail.style.transform = `translate(${x}px, ${y}px)`; // Use transform for better performance
        trail.style.position = 'fixed';
        trail.style.zIndex = '9998';
        trail.style.pointerEvents = 'none';
        
        document.body.appendChild(trail);
        cursorTrails.push(trail);
        
        // Remove trail after animation with minimal timeout
        setTimeout(() => {
            if (trail.parentNode) {
                trail.parentNode.removeChild(trail);
            }
            const index = cursorTrails.indexOf(trail);
            if (index > -1) {
                cursorTrails.splice(index, 1);
            }
        }, 300); // Reduced from 400ms
    }
    
    // Limit trail count more aggressively
    if (cursorTrails.length > 5) {
        const oldTrail = cursorTrails.shift();
        if (oldTrail.parentNode) {
            oldTrail.parentNode.removeChild(oldTrail);
        }
    }
}

// Show cursor
function showCursor() {
    if (spaceCursor) {
        spaceCursor.style.opacity = '1';
    }
}

// Hide cursor
function hideCursor() {
    if (spaceCursor) {
        spaceCursor.style.opacity = '0';
    }
}

// Animate cursor with space effects
export function animateSpaceCursor() {
    if (!spaceCursor) return;
    
    // Skip animation if cursor is hovering over buttons for better performance
    if (spaceCursor.classList.contains('hover')) return;
    
    // Use a separate animation loop for cursor to avoid blocking main game loop
    if (cursorAnimationId) return; // Already animating
    
    let lastCursorAnimTime = 0;
    const cursorAnimInterval = 100; // Slower cursor animation (10 FPS)
    
    function cursorAnimationLoop(currentTime) {
        if (!spaceCursor) return;
        
        // Skip if hovering
        if (spaceCursor.classList.contains('hover')) {
            cursorAnimationId = requestAnimationFrame(cursorAnimationLoop);
            return;
        }
        
        // Throttle cursor animation
        if (currentTime - lastCursorAnimTime < cursorAnimInterval) {
            cursorAnimationId = requestAnimationFrame(cursorAnimationLoop);
            return;
        }
        
        lastCursorAnimTime = currentTime;
        const time = currentTime * 0.0003; // Even slower time multiplier
        const outer = spaceCursor.querySelector('.cursor-outer');
        const inner = spaceCursor.querySelector('.cursor-inner');
        
        if (outer && inner) {
            // Only animate if not in rocket mode
            if (!spaceCursor.classList.contains('rocket-mode')) {
                // Minimal animations for better performance
                outer.style.transform = `rotate(${time * 5}deg)`;
                
                const pulseScale = 1 + Math.sin(time * 1.5) * 0.03;
                inner.style.transform = `translate(-50%, -50%) scale(${pulseScale})`;
            }
        }
        
        cursorAnimationId = requestAnimationFrame(cursorAnimationLoop);
    }
    
    cursorAnimationLoop();
}

// Handle cursor click
function handleCursorClick() {
    if (spaceCursor) {
        spaceCursor.classList.add('clicking');
        
        // Create click ripple effect
        createClickRipple(lastCursorPos.x, lastCursorPos.y);
    }
}

// Handle cursor release
function handleCursorRelease() {
    if (spaceCursor) {
        spaceCursor.classList.remove('clicking');
    }
}

// Create click ripple effect
function createClickRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.transform = `translate(${x}px, ${y}px)`; // Use transform for better performance
    ripple.style.width = '12px';
    ripple.style.height = '12px';
    ripple.style.borderRadius = '50%';
    ripple.style.border = '1px solid #00BCF2';
    ripple.style.pointerEvents = 'none';
    ripple.style.zIndex = '9997';
    ripple.style.opacity = '0.8';
    ripple.style.animation = 'clickRipple 0.3s ease-out forwards'; // Faster animation
    
    document.body.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
        if (ripple.parentNode) {
            ripple.parentNode.removeChild(ripple);
        }
    }, 300); // Reduced from 400ms
}

// Switch cursor mode based on game state
export function updateCursorMode() {
    if (!spaceCursor) return;
    
    // Switch to rocket mode when game is active
    if (gameState.gameStarted) {
        spaceCursor.classList.add('rocket-mode');
    } else {
        spaceCursor.classList.remove('rocket-mode');
    }
}
