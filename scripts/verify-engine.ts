
import { calculatePlanetaryPositions } from '../lib/cosmic-engine';
import { SUDHANSHU_DATA } from '../data/user-data';
import { getZodiacSign } from '../lib/cosmic-engine';

// Helper to format degrees to DMS for readability
function toDMS(deg: number) {
    const d = Math.floor(deg);
    const m = Math.floor((deg - d) * 60);
    const s = Math.round(((deg - d) * 60 - m) * 60);
    return `${d}°${m}'${s}"`;
}

async function runVerification() {
    console.log("Starting Verification Audit against authentic report data...");
    console.log("---------------------------------------------------------");

    // 1. Setup Date
    // DOB: 14 October 2005, 3:33 PM IST
    // 15:33:33 calculated from previous interactions or assumed precise
    const dob = new Date("2005-10-14T15:33:33+05:30");
    console.log(`Analyzing Chart for: ${dob.toLocaleString()}`);

    // 2. Run Engine Calculation
    const calculated = calculatePlanetaryPositions(dob);

    // 3. Compare
    const reportData = SUDHANSHU_DATA.planetaryPositions;

    let totalError = 0;
    const planets = ['sun', 'moon', 'mars', 'mercury', 'jupiter', 'venus', 'saturn', 'rahu', 'ketu'];

    console.log("\nPLANETARY POSITION AUDIT:");
    console.log("--------------------------------------------------------------------------------");
    console.log(String("PLANET").padEnd(10) + String("REPORT (Sign)").padEnd(15) + String("ENGINE (Sign)").padEnd(15) + String("DIFF (Deg)").padEnd(12) + "STATUS");
    console.log("--------------------------------------------------------------------------------");

    planets.forEach(p => {
        const reportPlanet = reportData[p as keyof typeof reportData];
        const engineLon = calculated[p as keyof typeof calculated];

        if (!reportPlanet || typeof engineLon !== 'number') return;

        // Sign Comparison
        const engineSign = getZodiacSign(engineLon);
        const signMatch = reportPlanet.sign === engineSign.name;

        // Longitude Comparison (Absolute)
        const reportLon = reportPlanet.absoluteLongitude || 0;
        let diff = Math.abs(reportLon - engineLon);

        // Handle 360 wrapping
        if (diff > 180) diff = 360 - diff;

        totalError += diff;

        const status = (signMatch && diff < 1.0) ? "✅ VERIFIED" : (diff < 3.0 ? "⚠️ DEVIATION" : "❌ MISMATCH");

        console.log(
            p.toUpperCase().padEnd(10) +
            reportPlanet.sign.padEnd(15) +
            engineSign.name.padEnd(15) +
            diff.toFixed(2).padEnd(12) +
            status
        );
    });

    console.log("--------------------------------------------------------------------------------");
    console.log(`Average Error: ${(totalError / planets.length).toFixed(4)} degrees`);

    if ((totalError / planets.length) < 0.5) {
        console.log("\n[CONCLUSION]: ENGINE IS CALIBRATED AND ACCURATE.");
    } else {
        console.log("\n[CONCLUSION]: ENGINE REQUIRES CALIBRATION.");
    }
}

runVerification().catch(console.error);
