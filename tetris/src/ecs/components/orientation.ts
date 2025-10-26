export class OrientationComponent {
    index: number;
    row: number | null;

    constructor(index: number, row: number | null) {
        this.index = index;
        this.row = row;
    }
}