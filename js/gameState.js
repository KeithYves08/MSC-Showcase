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
        angle: 0
    },
    projects: [],
    discoveredProjects: new Set(),
    currentProject: null,
    particles: [],
    stars: []
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
        x: canvas.width - 150,
        y: canvas.height - 150,
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
    return discoveredRegular.length === regularPlanets.length;
}

// Get discovery progress
export function getDiscoveryProgress() {
    const discovered = gameState.discoveredProjects.size;
    const total = gameState.projects.length;
    return { discovered, total, percentage: (discovered / total) * 100 };
}
