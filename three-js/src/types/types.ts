import { Comet } from "../entities/Comet";
import { CometTail } from "../entities/CometTail";

export interface Collided {
    obj1: Comet | CometTail | null;
    obj2: Comet | CometTail | null;
    collided: boolean;
}