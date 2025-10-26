export class WaveComponent {
    waveActive: boolean;
    waveStart: number;
    waveDuration: number; 
    baseStagger: number;
    delay: number;
    
    constructor(
        waveActive: boolean,
        waveStart: number,
        waveDuration: number, 
        baseStagger: number,
        delay: number
    ) {
        this.waveActive = waveActive;
        this.waveStart = waveStart;
        this.waveDuration = waveDuration; 
        this.baseStagger = baseStagger;
        this.delay = delay;
    }
}