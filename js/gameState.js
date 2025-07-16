import { CONFIG, PROJECT_DATA, QR_PLANET_DATA } from './config.js';

// Global game state
export const gameState = {
    canvas: null,
    ctx: null,
    gameStarted: false,
    musicEnabled: true,
    astronaut: {
        x: 0,
        y: 0,
        targetX: 0,
        targetY: 0,
        size: CONFIG.ASTRONAUT.SIZE,
        speed: CONFIG.ASTRONAUT.SPEED,
        angle: 0,
        isMoving: false
    },
    projects: [],
    discoveredProjects: new Set(),
    currentProject: null,
    recentlyClosedProject: null, // Track recently closed project to prevent immediate reopening
    projectPanelTimer: null, // Timer for auto-closing project panel
    particles: [],
    rocketTrails: [],
    smokeTrails: []
};

// Initialize game state
export function initializeGameState(canvas, ctx) {
    gameState.canvas = canvas;
    gameState.ctx = ctx;
    
    // Set initial astronaut position
    gameState.astronaut.x = canvas.width / 2;
    gameState.astronaut.y = canvas.height / 2;
    gameState.astronaut.targetX = canvas.width / 2;
    gameState.astronaut.targetY = canvas.height / 2;
    
    // Initialize projects with default properties
    gameState.projects = PROJECT_DATA.map(project => ({
        ...project,
        discovered: false,
        glowIntensity: 5,
        pulse: 0
    }));
}

// Add QR planet when all regular planets are discovered
export function addQRPlanet() {
    const canvas = gameState.canvas;
    const qrPlanet = {
        ...QR_PLANET_DATA,
        x: canvas.width / 2, // Center horizontally
        y: canvas.height / 2, // Center vertically
        discovered: false,
        glowIntensity: 5,
        pulse: 0
    };
    
    gameState.projects.push(qrPlanet);
}

// Check if all regular planets are discovered
export function areAllRegularPlanetsDiscovered() {
    const regularPlanets = gameState.projects.filter(p => !p.isQR);
    const discoveredRegular = regularPlanets.filter(p => p.discovered);
    
    return discoveredRegular.length === regularPlanets.length && regularPlanets.length === 12;
}

// Get discovery progress
export function getDiscoveryProgress() {
    const discovered = gameState.discoveredProjects.size;
    const regularPlanets = gameState.projects.filter(p => !p.isQR);
    const total = regularPlanets.length; // Only count regular planets, not QR planet
    return { discovered, total, percentage: total > 0 ? (discovered / total) * 100 : 0 };
}

// Clear all trails (for performance and cleanup)
export function clearAllTrails() {
    gameState.rocketTrails = [];
    gameState.smokeTrails = [];
}

// Remove QR planet from projects array
export function removeQRPlanet() {
    const beforeCount = gameState.projects.length;
    gameState.projects = gameState.projects.filter(project => !project.isQR);
    const afterCount = gameState.projects.length;
    
    if (beforeCount !== afterCount) {
        console.log(`QR planet removed. Projects count: ${beforeCount} → ${afterCount}`);
    }
}

// Debug function to check planet status
export function debugPlanetStatus() {
    console.log('=== PLANET STATUS DEBUG ===');
    console.log(`Total projects in gameState: ${gameState.projects.length}`);
    console.log(`Regular planets: ${gameState.projects.filter(p => !p.isQR).length}`);
    console.log(`QR planets: ${gameState.projects.filter(p => p.isQR).length}`);
    console.log(`Discovered projects: ${gameState.discoveredProjects.size}`);
    console.log('Discovered IDs:', Array.from(gameState.discoveredProjects));
    console.log('Project details:');
    gameState.projects.forEach(p => {
        console.log(`  ${p.id}: ${p.name} - Discovered: ${p.discovered}, IsQR: ${!!p.isQR}`);
    });
    console.log('=== END DEBUG ===');
}
