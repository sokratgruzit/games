export interface TetrominoCell {
    x: number;        // текущая позиция (пиксели)
    y: number;
    targetX: number;  // куда должен прийти
    targetY: number;
    startX: number;   // позиция в момент старта волны
    startY: number;
    width: number;
    height: number;
    color: string;
    lag: number;      // базовый лаг (коэффициент интерполяции в волне)
    delay: number;    // задержка волны (ms)
    index: number;    // порядковый индекс (удобно для волны)
    grounded: boolean;
    shift: number;
    row: number | null;
}

export interface Pivot {
    x: number;
    y: number;
}
