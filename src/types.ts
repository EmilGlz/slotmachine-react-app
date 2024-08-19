export interface WinDetails {
    symbol: string;
    matchCount: number;
    payout: number;
    winningPositions: number[];
}

export interface SpinResult {
    stopPositions: number[];
    screen: string[][];
    wins: WinDetails[];
}

