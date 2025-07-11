// ===================================================================
// AUDIO SYSTEM - Background Music and Sound Effects
// ===================================================================

import { gameState } from './gameState.js';

// Audio configuration
const AUDIO_CONFIG = {
    BGM_VOLUME: 0.3,
    SFX_VOLUME: 0.5,
    FADE_DURATION: 1000
};

// Audio context and sources
let audioContext = null;
let bgmSource = null;
let bgmGain = null;
let sfxGain = null;
let thrustSource = null;

// Audio buffers
const audioBuffers = new Map();
const audioSources = new Map();

// Initialize audio system
export function initializeAudio() {
    try {
        // Create audio context
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create gain nodes
        bgmGain = audioContext.createGain();
        sfxGain = audioContext.createGain();
        
        bgmGain.gain.value = AUDIO_CONFIG.BGM_VOLUME;
        sfxGain.gain.value = AUDIO_CONFIG.SFX_VOLUME;
        
        // Connect to destination
        bgmGain.connect(audioContext.destination);
        sfxGain.connect(audioContext.destination);
        
        // Generate procedural audio
        generateProceduralAudio();
        
        console.log('Audio system initialized successfully');
    } catch (error) {
        console.warn('Audio initialization failed:', error);
    }
}

// Generate procedural background music and sound effects
function generateProceduralAudio() {
    if (!audioContext) return;
    
    // Generate ambient space background music
    generateAmbientBGM();
    
    // Generate sound effects
    generateSoundEffects();
}

// Generate space odyssey background music
function generateAmbientBGM() {
    const duration = 60; // 60 seconds loop for more epic feel
    const sampleRate = audioContext.sampleRate;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    
    // Generate epic space odyssey music
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        
        // Deep orchestral bass foundation
        const bassFreq = 44 + Math.sin(time * 0.05) * 8 + Math.sin(time * 0.13) * 4;
        const bass = Math.sin(time * 2 * Math.PI * bassFreq) * 0.18 * 
                    (0.7 + 0.3 * Math.sin(time * 0.1));
        
        // Majestic brass-like melody (inspired by "Also sprach Zarathustra")
        const phase = time * 0.25;
        const melodyPhase = Math.floor(phase) % 4;
        let melodyFreq = 220;
        
        if (melodyPhase === 0) melodyFreq = 220; // C
        else if (melodyPhase === 1) melodyFreq = 330; // E
        else if (melodyPhase === 2) melodyFreq = 440; // A
        else melodyFreq = 220; // C octave
        
        const melody = Math.sin(time * 2 * Math.PI * melodyFreq) * 0.12 * 
                      Math.sin(time * 0.3) * (0.8 + 0.2 * Math.sin(time * 1.2));
        
        // Harmonic overtones for richness
        const harmonic1 = Math.sin(time * 2 * Math.PI * melodyFreq * 1.5) * 0.04;
        const harmonic2 = Math.sin(time * 2 * Math.PI * melodyFreq * 2) * 0.03;
        
        // Cosmic strings section
        const stringFreq = 110 + Math.sin(time * 0.2) * 20;
        const strings = Math.sin(time * 2 * Math.PI * stringFreq) * 0.08 * 
                       Math.sin(time * 0.4) * Math.sin(time * 0.07);
        
        // Ethereal choir-like pad
        const padFreq = 330 + Math.sin(time * 0.15) * 40;
        const pad = Math.sin(time * 2 * Math.PI * padFreq) * 0.06 * 
                   Math.sin(time * 0.6) * Math.sin(time * 0.09);
        
        // Cosmic wind and space ambience
        const wind1 = (Math.random() - 0.5) * 0.025 * Math.sin(time * 0.06);
        const wind2 = (Math.random() - 0.5) * 0.015 * Math.sin(time * 0.11);
        
        // Distant stellar echoes
        const echo = Math.sin(time * 2 * Math.PI * 880) * 0.03 * 
                    Math.sin(time * 0.18) * Math.sin(time * 0.8);
        
        // Subtle timpani-like percussion for drama
        const timeDivision = Math.floor(time * 0.5) % 8;
        const perc = Math.sin(time * 2 * Math.PI * 60) * 0.1 * 
                    (timeDivision === 0 || timeDivision === 4 ? Math.exp(-((time * 0.5) % 1) * 6) : 0);
        
        const sample = bass + melody + harmonic1 + harmonic2 + strings + pad + wind1 + wind2 + echo + perc;
        leftChannel[i] = sample;
        rightChannel[i] = sample * 0.92 + strings * 0.15 + wind2 * 0.08;

    }
    
    audioBuffers.set('bgm', buffer);
}

// Generate sound effects
function generateSoundEffects() {
    // Rocket thrust sound
    generateRocketThrust();
    
    // Planet discovery sound
    generatePlanetDiscovery();
    
    // UI interaction sounds
    generateUIClick();
    generateUIHover();
}

// Generate rocket thrust sound effect
function generateRocketThrust() {
    const duration = 0.5; // Shorter for looping
    const sampleRate = audioContext.sampleRate;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const noise = (Math.random() - 0.5) * 2;
        const envelope = 1; // Constant volume for looping
        const lowFreq = Math.sin(time * 2 * Math.PI * 120) * 0.4;
        const midFreq = Math.sin(time * 2 * Math.PI * 200) * 0.2;
        const highFreq = noise * 0.3;
        
        channelData[i] = (lowFreq + midFreq + highFreq) * envelope * 0.3;
    }
    
    audioBuffers.set('rocket_thrust', buffer);
    
    // Generate continuous thrust sound
    const contDuration = 1;
    const contLength = contDuration * sampleRate;
    const contBuffer = audioContext.createBuffer(1, contLength, sampleRate);
    const contChannelData = contBuffer.getChannelData(0);
    
    for (let i = 0; i < contLength; i++) {
        const time = i / sampleRate;
        const noise = (Math.random() - 0.5) * 2;
        const lowFreq = Math.sin(time * 2 * Math.PI * 100) * 0.3;
        const modulation = Math.sin(time * 2 * Math.PI * 8) * 0.1 + 0.9;
        
        contChannelData[i] = (noise * 0.2 + lowFreq) * modulation * 0.25;
    }
    
    audioBuffers.set('rocket_thrust_loop', contBuffer);
}

// Generate planet discovery sound
function generatePlanetDiscovery() {
    const duration = 2;
    const sampleRate = audioContext.sampleRate;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const frequency = 440 + Math.sin(time * 8) * 100;
        const envelope = Math.exp(-time * 0.8);
        const harmonic = Math.sin(time * 2 * Math.PI * frequency * 1.5) * 0.3;
        
        channelData[i] = (Math.sin(time * 2 * Math.PI * frequency) + harmonic) * envelope * 0.2;
    }
    
    audioBuffers.set('planet_discovery', buffer);
}

// Generate UI click sound
function generateUIClick() {
    const duration = 0.1;
    const sampleRate = audioContext.sampleRate;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const envelope = Math.exp(-time * 30);
        
        channelData[i] = Math.sin(time * 2 * Math.PI * 800) * envelope * 0.3;
    }
    
    audioBuffers.set('ui_click', buffer);
}

// Generate UI hover sound
function generateUIHover() {
    const duration = 0.05;
    const sampleRate = audioContext.sampleRate;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const envelope = Math.exp(-time * 20);
        
        channelData[i] = Math.sin(time * 2 * Math.PI * 1200) * envelope * 0.1;
    }
    
    audioBuffers.set('ui_hover', buffer);
}

// Play background music
export function playBackgroundMusic() {
    if (!audioContext || !audioBuffers.has('bgm') || !gameState.musicEnabled) return;
    
    try {
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Stop current BGM if playing
        if (bgmSource) {
            bgmSource.stop();
        }
        
        // Create and start new BGM source
        bgmSource = audioContext.createBufferSource();
        bgmSource.buffer = audioBuffers.get('bgm');
        bgmSource.loop = true;
        bgmSource.connect(bgmGain);
        bgmSource.start();
        
        console.log('Background music started');
    } catch (error) {
        console.warn('Failed to play background music:', error);
    }
}

// Stop background music
export function stopBackgroundMusic() {
    if (bgmSource) {
        bgmSource.stop();
        bgmSource = null;
    }
}

// Play continuous thrust sound
export function startThrustSound() {
    if (!audioContext || !audioBuffers.has('rocket_thrust_loop')) return;
    
    try {
        // Stop current thrust if playing
        if (thrustSource) {
            thrustSource.stop();
        }
        
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        thrustSource = audioContext.createBufferSource();
        thrustSource.buffer = audioBuffers.get('rocket_thrust_loop');
        thrustSource.loop = true;
        thrustSource.connect(sfxGain);
        thrustSource.start();
        
    } catch (error) {
        console.warn('Failed to start thrust sound:', error);
    }
}

// Stop continuous thrust sound
export function stopThrustSound() {
    if (thrustSource) {
        try {
            thrustSource.stop();
        } catch (error) {
            // Ignore errors when stopping
        }
        thrustSource = null;
    }
}

// Play sound effect
export function playSoundEffect(soundName) {
    if (!audioContext || !audioBuffers.has(soundName)) return;
    
    try {
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers.get(soundName);
        source.connect(sfxGain);
        source.start();
        
        // Clean up after sound finishes
        source.onended = () => {
            source.disconnect();
        };
        
    } catch (error) {
        console.warn(`Failed to play sound effect ${soundName}:`, error);
    }
}

// Toggle background music
export function toggleBackgroundMusic() {
    gameState.musicEnabled = !gameState.musicEnabled;
    
    if (gameState.musicEnabled) {
        playBackgroundMusic();
    } else {
        stopBackgroundMusic();
    }
    
    return gameState.musicEnabled;
}

// Set volume levels
export function setVolume(type, volume) {
    if (!audioContext) return;
    
    volume = Math.max(0, Math.min(1, volume));
    
    switch (type) {
        case 'bgm':
            if (bgmGain) bgmGain.gain.value = volume;
            break;
        case 'sfx':
            if (sfxGain) sfxGain.gain.value = volume;
            break;
    }
}

// Get current volume
export function getVolume(type) {
    if (!audioContext) return 0;
    
    switch (type) {
        case 'bgm':
            return bgmGain ? bgmGain.gain.value : 0;
        case 'sfx':
            return sfxGain ? sfxGain.gain.value : 0;
        default:
            return 0;
    }
}

// Cleanup audio resources
export function cleanupAudio() {
    if (bgmSource) {
        bgmSource.stop();
        bgmSource = null;
    }
    
    if (thrustSource) {
        thrustSource.stop();
        thrustSource = null;
    }
    
    if (audioContext) {
        audioContext.close();
        audioContext = null;
    }
    
    audioBuffers.clear();
    audioSources.clear();
}
