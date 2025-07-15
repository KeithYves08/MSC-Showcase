// ===================================================================
// AUDIO SYSTEM - Background Music and Sound Effects
// ===================================================================

import { gameState } from './gameState.js';

// Audio configuration
const AUDIO_CONFIG = {
    BGM_VOLUME: 0.15, // Optimized volume
    SFX_VOLUME: 0.3, // Optimized volume
    FADE_DURATION: 500, // Faster fade for better performance
    BGM_DURATION: 30, // Shorter loop for better performance
    SAMPLE_RATE_FACTOR: 0.7 // Reduce sample rate for better performance
};

// Audio context and sources
let audioContext = null;
let bgmSource = null;
let bgmGain = null;
let sfxGain = null;
let thrustSource = null;
let isAudioInitialized = false;

// Audio buffers
const audioBuffers = new Map();
const audioSources = new Map();

// Initialize audio system with lazy loading
export function initializeAudio() {
    if (isAudioInitialized) return;
    
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
        
        // Generate procedural audio in background
        setTimeout(() => generateProceduralAudio(), 100);
        
        isAudioInitialized = true;
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

// Generate space odyssey background music (optimized)
function generateAmbientBGM() {
    const duration = AUDIO_CONFIG.BGM_DURATION; // Shorter duration for better performance
    const sampleRate = audioContext.sampleRate * AUDIO_CONFIG.SAMPLE_RATE_FACTOR;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(2, length, sampleRate);
    const leftChannel = buffer.getChannelData(0);
    const rightChannel = buffer.getChannelData(1);
    
    // Optimized epic space odyssey music with reduced complexity
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        
        // Simplified bass foundation
        const bassFreq = 44 + Math.sin(time * 0.1) * 6;
        const bass = Math.sin(time * 2 * Math.PI * bassFreq) * 0.15;
        
        // Simplified melody
        const phase = time * 0.3;
        const melodyPhase = Math.floor(phase) % 3;
        const melodyFreq = melodyPhase === 0 ? 220 : melodyPhase === 1 ? 330 : 440;
        const melody = Math.sin(time * 2 * Math.PI * melodyFreq) * 0.1 * Math.sin(time * 0.4);
        
        // Simplified strings
        const stringFreq = 110 + Math.sin(time * 0.2) * 15;
        const strings = Math.sin(time * 2 * Math.PI * stringFreq) * 0.06 * Math.sin(time * 0.5);
        
        // Ambient wind (reduced complexity)
        const wind = (Math.random() - 0.5) * 0.02 * Math.sin(time * 0.08);
        
        const sample = bass + melody + strings + wind;
        leftChannel[i] = sample;
        rightChannel[i] = sample * 0.9 + wind * 0.1;
    }
    
    audioBuffers.set('bgm', buffer);
}

// Generate sound effects
function generateSoundEffects() {
    // Rocket thrust sound
    generateRocketThrust();
}

// Generate rocket thrust sound effect (optimized)
function generateRocketThrust() {
    const duration = 0.4; // Shorter for better performance
    const sampleRate = audioContext.sampleRate * AUDIO_CONFIG.SAMPLE_RATE_FACTOR;
    const length = duration * sampleRate;
    
    const buffer = audioContext.createBuffer(1, length, sampleRate);
    const channelData = buffer.getChannelData(0);
    
    for (let i = 0; i < length; i++) {
        const time = i / sampleRate;
        const noise = (Math.random() - 0.5) * 0.6; // Reduced noise
        const lowFreq = Math.sin(time * 2 * Math.PI * 110) * 0.3;
        const midFreq = Math.sin(time * 2 * Math.PI * 180) * 0.15;
        
        channelData[i] = (lowFreq + midFreq + noise) * 0.25;
    }
    
    audioBuffers.set('rocket_thrust', buffer);
    
    // Optimized continuous thrust sound
    const contDuration = 0.8; // Shorter loop
    const contLength = contDuration * sampleRate;
    const contBuffer = audioContext.createBuffer(1, contLength, sampleRate);
    const contChannelData = contBuffer.getChannelData(0);
    
    for (let i = 0; i < contLength; i++) {
        const time = i / sampleRate;
        const noise = (Math.random() - 0.5) * 0.4; // Reduced noise
        const lowFreq = Math.sin(time * 2 * Math.PI * 95) * 0.25;
        const modulation = Math.sin(time * 2 * Math.PI * 6) * 0.08 + 0.92;
        
        contChannelData[i] = (noise * 0.15 + lowFreq) * modulation * 0.2;
    }
    
    audioBuffers.set('rocket_thrust_loop', contBuffer);
}

// Play background music (optimized)
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
        
        // Add error handling
        bgmSource.onerror = () => {
            console.warn('BGM playback error');
            bgmSource = null;
        };
        
        console.log('Background music started');
    } catch (error) {
        console.warn('Failed to play background music:', error);
    }
}

// Stop background music (optimized)
export function stopBackgroundMusic() {
    if (bgmSource) {
        try {
            bgmSource.stop();
        } catch (error) {
            // Ignore errors when stopping
        }
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

// Play sound effect (optimized with throttling)
const soundEffectThrottle = new Map();

export function playSoundEffect(soundName) {
    if (!audioContext || !audioBuffers.has(soundName)) return;
    
    // Throttle sound effects to prevent spam
    const now = Date.now();
    const lastPlayed = soundEffectThrottle.get(soundName) || 0;
    const throttleTime = 100; // Standard throttling for all sounds
    
    if (now - lastPlayed < throttleTime) return;
    
    try {
        // Resume audio context if suspended
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffers.get(soundName);
        source.connect(sfxGain);
        source.start();
        
        soundEffectThrottle.set(soundName, now);
        
        // Clean up after sound finishes
        source.onended = () => {
            try {
                source.disconnect();
            } catch (error) {
                // Ignore disconnect errors
            }
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

// Cleanup audio resources (optimized)
export function cleanupAudio() {
    // Stop all audio sources
    if (bgmSource) {
        try {
            bgmSource.stop();
        } catch (error) {
            // Ignore errors
        }
        bgmSource = null;
    }
    
    if (thrustSource) {
        try {
            thrustSource.stop();
        } catch (error) {
            // Ignore errors
        }
        thrustSource = null;
    }
    
    // Clear throttle map
    soundEffectThrottle.clear();
    
    // Clean up audio context
    if (audioContext && audioContext.state !== 'closed') {
        try {
            audioContext.close();
        } catch (error) {
            console.warn('Error closing audio context:', error);
        }
        audioContext = null;
    }
    
    // Clear buffers and sources
    audioBuffers.clear();
    audioSources.clear();
    
    // Reset initialization flag
    isAudioInitialized = false;
}
