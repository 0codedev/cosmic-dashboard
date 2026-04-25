import type { AstrologyUserData } from "../types/astrology";
import { Nakshatra } from "../types/astrology";

export type TradingStatus = "Red" | "Yellow" | "Green" | "Prime" | "Danger";

export interface TodayStatus {
    status: TradingStatus;
    reason: string;
    tradeLimit: number;
    activeFlags: string[];
    currentPeriods: {
        mahadasha: string;
        antardasha: string;
        pratyantar: string;
        mudda: string;
        chara: string;
    };
}

/**
 * Timing Engine
 * The "brain" of the Cosmic Operating System.
 * Calculates real-time alerts and trading limits based on Sudhanshu's specific chart data.
 */

export function getTodayStatus(userData: AstrologyUserData, moonNakshatra?: string, customDate?: Date): TodayStatus {
    const now = customDate || new Date();
    const dayOfWeek = now.toLocaleDateString('en-US', { weekday: 'long' });
    
    // 1. Find Current Periods from the active user profile
    const currentPratyantar = userData.dashaSystem.vimshottari.pratyantars.find(p => {
        const start = parseDate(p.start);
        const end = parseDate(p.end);
        return now >= start && now < end;
    });

    const currentAntardasha = userData.dashaSystem.vimshottari.antardashas.find(a => {
        const start = parseDate(a.start);
        const end = parseDate(a.end);
        return now >= start && now < end;
    });

    const currentMudda = userData.dashaSystem.mudda.find(m => {
        const start = parseDate(m.start);
        const end = parseDate(m.end);
        return now >= start && now < end;
    });

    const currentChara = userData.dashaSystem.chara.find(c => {
        const start = parseDate(c.start);
        const end = parseDate(c.end);
        return now >= start && now < end;
    });

    // 2. Identify Flags
    const activeFlags: string[] = [];
    let baseStatus: TradingStatus = "Green";
    let limit = 10;
    const reasons: string[] = [];

    // Tuesday Law
    if (dayOfWeek === "Tuesday") {
        activeFlags.push("TUESDAY LAW");
        limit = Math.min(limit, 5);
        reasons.push("Tuesday (Mars day) requires caution.");
    }

    // Pratyantar Check
    if (currentPratyantar) {
        if (currentPratyantar.signal === "Danger") {
            baseStatus = "Danger";
            limit = Math.min(limit, 3);
            reasons.push(`Danger Pratyantar: ${currentPratyantar.lord.toString().toUpperCase()} active.`);
        } else if (currentPratyantar.signal === "Red") {
            baseStatus = "Red";
            limit = Math.min(limit, 3);
        } else if (currentPratyantar.signal === "Yellow") {
            baseStatus = "Yellow";
            limit = Math.min(limit, 5);
        } else if (currentPratyantar.signal === "Prime") {
            if (baseStatus === "Green") baseStatus = "Prime";
        }
    }

    // Mudda Check
    if (currentMudda) {
        if (currentMudda.signal === "Danger") {
            activeFlags.push("MUDDA DANGER");
            baseStatus = "Danger";
            limit = Math.min(limit, 3);
            reasons.push(`Mudda Danger: ${currentMudda.lord.toString().toUpperCase()} period.`);
        } else if (currentMudda.signal === "Red") {
            if (baseStatus !== "Danger") baseStatus = "Red";
            limit = Math.min(limit, 3);
        }
    }

    // Navatara Check (if Moon Nakshatra is provided)
    if (moonNakshatra) {
        const navatara = userData.navataraChakra.find(tier => 
            tier.nakshatras.includes(moonNakshatra as Nakshatra)
        );
        if (navatara) {
            activeFlags.push(`NAVATARA: ${navatara.name.toUpperCase()}`);
            if (navatara.status === "Destruction") {
                baseStatus = "Red";
                limit = 0;
                reasons.push("Naidhana (Destruction) Nakshatra - NO TRADE.");
            } else if (navatara.status === "Danger") {
                if (baseStatus !== "Red") baseStatus = "Yellow";
                limit = Math.min(limit, 5);
                reasons.push("Vipat (Danger) Nakshatra - Reduce size.");
            } else if (navatara.status === "Success" || navatara.status === "Prosperity" || navatara.status === "Allies") {
                if (baseStatus === "Green") baseStatus = "Prime";
            }
        }
    }

    return {
        status: baseStatus,
        reason: reasons.join(" ") || "No major cosmic conflicts detected.",
        tradeLimit: limit,
        activeFlags,
        currentPeriods: {
            mahadasha: "Jupiter",
            antardasha: currentAntardasha?.lord as string || "N/A",
            pratyantar: currentPratyantar?.lord as string || "N/A",
            mudda: currentMudda?.lord as string || "N/A",
            chara: currentChara?.lord as string || "N/A",
        }
    };
}

/**
 * Helper to parse "DD/MM/YYYY" or "DD Month YYYY"
 */
function parseDate(dateStr: string): Date {
    const parts = dateStr.split("/");
    if (parts.length === 3) {
        // DD/MM/YYYY format
        return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
    }
    
    // Try parsing "15 Dec 2025" or similar
    const date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;

    // Fallback or error
    return new Date(0);
}
