import type { LevelConfig } from "../types";
import { BLOCK_COLORS } from "../constants";

const COLORS = BLOCK_COLORS;

export const LEVELS: Record<number, LevelConfig> = {
    1: {
        rows: 4,
        columns: 8,
        pattern: (r, _c) => COLORS[r] // автоматический BlockType
    },
    2: {
        rows: 7,
        columns: 8,
        pattern: (r, c) => {
            // ромб
            if ((c === 0 || c === 7) || r === 6) return "green";
            if (((r !== 0 && r !== 6) && (c === 1 || c === 6)) || (r === 5 && (c !== 0 && c !== 7))) return "yellow";
            if (((r === 2 || r === 3) && (c === 2 || c === 5)) || (r === 4 && c > 1 && c < 6)) return "pink";
            return "purple";
        }
    },
    3: {
        rows: 5,
        columns: 8,
        pattern: (r, c) => COLORS[(r + c) % COLORS.length]
    },
    4: {
        rows: 5,
        columns: 8,
        pattern: (r, c) => {
            const center = (8 - 1) / 2;
            const dist = Math.abs(c - center);
            const idx = (Math.round(dist) + r) % COLORS.length;
            return COLORS[idx];
        }
    },
};
