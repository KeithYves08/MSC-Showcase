// ===================================================================
// CONFIGURATION AND CONSTANTS
// ===================================================================

// Game configuration constants
export const CONFIG = {
    ASTRONAUT: {
        SIZE: 30,  // Reduced size for better rocket proportions
        SPEED: 8,
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
        name: "Sarah's Personal Portfolio",
        description: "A showcase of Sarah's projects and skills as a developer.",
        url: "https://badudu.my.canva.site/realubit",
        x: 200,
        y: 150,
        size: 45,
        color: "#0078D4",
        type: "web"
    },
    {
        id: 2,
        name: "Bugged Out",
        description: "Tower-defense style game that uses computer components to defend against bugs and viruses.",
        url: "https://sonickeith.itch.io/buggedout",
        x: 400,
        y: 120,
        size: 45,
        color: "#00BCF2",
        type: "game"
    },
    {
        id: 3,
        name: "Nexus Emergence",
        description: "Created for our final output project in sports electives,  A prototype at best to test out an idea or a fun project.",
        url: "https://testsite.itch.io/nexus-emergence",
        x: 1800,
        y: 330,
        size: 45,
        color: "#5C2D91",
        type: "game"
    },
    {
        id: 4,
        name: "OUT OF THE CAVE",
        description: "OUT OF THE CAVE is a 2D Metroidvania game built with Scratch",
        url: "https://scratch.mit.edu/projects/980094012",
        x: 1550,
        y: 480,
        size: 45,
        color: "#0078D4",
        type: "game"
    },
    {
        id: 5,
        name: "Keith's Personal Portfolio",
        description: "Creator of this showcase. Showcasing my projects and skills as a developer.",
        url: "https://keithyves08.github.io/Portfolio/",
        x: 1650,
        y: 750,
        size: 45,
        color: "#00BCF2",
        type: "web"
    },
    {
        id: 6,
        name: "Engkanto",
        description: "Filipino inspired action game.",
        url: "https://sonickeith.itch.io/engkanto",
        x: 1300,
        y: 750,
        size: 45,
        color: "#5C2D91",
        type: "game"
    },
    {
        id: 7,
        name: "NU Laguna hailed HackForGov3 CTF champ",
        description: "Your very own MSC officers triumph in the field of cybersecurity.",
        url: "https://www.manilatimes.net/2024/06/27/campus-press/nu-laguna-hailed-hackforgov3-ctf-champ/1953549",
        x: 150,
        y: 650,
        size: 45,
        color: "#0078D4",
        type: "achievement"
    },
    {
        // Information System Mark&Kyle
        id: 8,
        name: "Inventory & Sales Management System using .NET and Windows Forms",
        description: "A desktop-based information system made with Microsoft technologies.",
        url: "https://medium.com/@kylesanchez3000/inventory-sales-management-system-using-net-and-windows-forms-1bb9e1523d61",
        x: 400,
        y: 350,
        size: 45,
        color: "#00BCF2",
        type: "dashboard"
    },
    {
        id: 9,
        name: "Draw of Fate",
        description: "Trapped in limbo, Mira enters a desert carnival where a single tarot card from Madame Celeste decides whether she escapes or stays forever.",
        url: "https://frncomartin.itch.io/draw-of-fate?classId=4214d68f-d428-4b3f-b736-7e532c1a4359&assignmentId=822a3e11-988a-4140-8620-8a6fb3bea918&submissionId=b261e1dd-be00-50dc-ec26-a120da12cb44",
        x: 1650,
        y: 180,
        size: 45,
        color: "#5C2D91",
        type: "game"
    },
    {   // merwin proj
        id: 10,
        name: "Love in Verses",
        description: "Showcasing creative adaptation, this project highlights literary diversity through multimedia in a gallery-style format for broad audience engagement.",
        url: "https://bespoke-pithivier-dd2da0.netlify.app/",
        x: 350,
        y: 750,
        size: 45,
        color: "#0078D4",
        type: "merwin"
    },
    {   //ralph proj
        id: 11,
        name: "Streaming Platform Design",
        description: "Modern streaming platform with user-friendly interfaces.",
        url: "https://www.figma.com/design/hOE8F6WBf5642IY1rlJ8ji/MAGNAYE---PARAON-MIDTERMS?node-id=0-1&p=f&t=gFLAYYlezUDdxDqu-0",
        x: 1400,
        y: 80,
        size: 45,
        color: "#00BCF2",
        type: "figma"
    },
    {
        // Hiraya Awakened Game (Scratch project)
        id: 12,
        name: "Hiraya: Awakened",
        description: "Souls-like action RPG game made entirely in Scratch. Embark on a journey to defeat the evil creatures of the Philippine mythology.",
        url: "https://kairusouls.itch.io/hiraya-awakened",
        x: 100,
        y: 450,
        size: 45,
        color: "#5C2D91",
        type: "hiraya"
    }
];

// QR Planet data (appears only when all regular planets are discovered)
export const QR_PLANET_DATA = {
    id: 13,
    name: "QR Registration",
    description: "Register here.",
    url: "",
    x: 900, // Center of typical screen width (1800/2)
    y: 400, // Center of typical screen height (800/2)
    size: 45, // Uniform size with other planets
    color: "#5C2D91",
    type: "qr",
    isQR: true
};

// Icon mapping for project types
export const PROJECT_ICONS = {
    game: '🎮',
    web: '🌐',
    merwin: '❤',
    ar: '🥽',
    dashboard: '📊',
    blockchain: '⛓️',
    game: '🎮',
    figma: '📹',
    qr: '📱',
    achievement: '🏆',
    hiraya: '🌅', // Custom icon for Hiraya Awakened Game
    default: '🌍'
};
