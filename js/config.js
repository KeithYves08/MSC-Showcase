// ===================================================================
// CONFIGURATION AND CONSTANTS
// ===================================================================

// Game configuration constants
export const CONFIG = {
    ASTRONAUT: {
        SIZE: 22,  // Reduced size for better rocket proportions
        SPEED: 4,
        COLLISION_BUFFER: 10
    },
    ANIMATION: {
        PULSE_SPEED: 0.08,
        SAVE_FREQUENCY: 0.01
    },
    STORAGE_KEY: 'spaceOdysseyProgress'
};

// Project data configuration
export const PROJECT_DATA = [
    {
        id: 1,
        name: "AI Game Platform",
        description: "An intelligent gaming platform with adaptive difficulty and personalized experiences.",
        url: "https://example.com/ai-game",
        x: 200,
        y: 150,
        size: 30,
        color: "#0078D4",
        type: "game"
    },
    {
        id: 2,
        name: "Data Visualization Suite",
        description: "Interactive dashboards and charts for complex data analysis and insights.",
        url: "https://example.com/data-viz",
        x: 600,
        y: 200,
        size: 25,
        color: "#00BCF2",
        type: "web"
    },
    {
        id: 3,
        name: "Mobile Learning App",
        description: "Educational mobile application with gamified learning experiences.",
        url: "https://example.com/mobile-app",
        x: 400,
        y: 300,
        size: 28,
        color: "#5C2D91",
        type: "mobile"
    },
    {
        id: 4,
        name: "AR Experience",
        description: "Augmented reality application for immersive brand experiences.",
        url: "https://example.com/ar-app",
        x: 800,
        y: 150,
        size: 32,
        color: "#0078D4",
        type: "ar"
    },
    {
        id: 5,
        name: "E-commerce Platform",
        description: "Full-featured online shopping platform with modern UX design.",
        url: "https://example.com/ecommerce",
        x: 300,
        y: 450,
        size: 26,
        color: "#00BCF2",
        type: "web"
    },
    {
        id: 6,
        name: "IoT Dashboard",
        description: "Real-time monitoring and control system for IoT devices.",
        url: "https://example.com/iot",
        x: 700,
        y: 400,
        size: 24,
        color: "#5C2D91",
        type: "dashboard"
    },
    {
        id: 7,
        name: "Social Media Tool",
        description: "Advanced social media management and analytics platform.",
        url: "https://example.com/social",
        x: 150,
        y: 350,
        size: 27,
        color: "#0078D4",
        type: "web"
    },
    {
        id: 8,
        name: "Blockchain App",
        description: "Decentralized application for secure transactions and smart contracts.",
        url: "https://example.com/blockchain",
        x: 500,
        y: 100,
        size: 29,
        color: "#00BCF2",
        type: "blockchain"
    },
    {
        id: 9,
        name: "Music Production",
        description: "Digital audio workstation with AI-powered composition tools.",
        url: "https://example.com/music",
        x: 850,
        y: 300,
        size: 31,
        color: "#5C2D91",
        type: "audio"
    },
    {
        id: 10,
        name: "Fitness Tracker",
        description: "Comprehensive fitness and health monitoring application.",
        url: "https://example.com/fitness",
        x: 350,
        y: 180,
        size: 25,
        color: "#0078D4",
        type: "mobile"
    },
    {
        id: 11,
        name: "Cloud Storage",
        description: "Secure cloud storage solution with advanced sharing capabilities.",
        url: "https://example.com/cloud",
        x: 650,
        y: 350,
        size: 28,
        color: "#00BCF2",
        type: "cloud"
    }
];

// QR Planet data (appears only when all regular planets are discovered)
export const QR_PLANET_DATA = {
    id: 12,
    name: "QR Registration",
    description: "Complete your space odyssey journey with additional resources.",
    url: "https://example.com/register",
    size: 35,
    color: "#5C2D91",
    type: "qr",
    isQR: true
};

// Icon mapping for project types
export const PROJECT_ICONS = {
    game: '🎮',
    web: '🌐',
    mobile: '📱',
    ar: '🥽',
    dashboard: '📊',
    blockchain: '⛓️',
    audio: '🎵',
    cloud: '☁️',
    qr: '📱',
    default: '🌍'
};
