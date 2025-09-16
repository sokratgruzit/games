export class GradientComponent {
    colors: { stop: number; color: string }[];
    
    constructor(colors: { stop: number; color: string }[]) {
        this.colors = colors;
    }
}