
/**
 * Puerto Rico Industrial Sector Data & Benchmarks
 */

export const PR_MUNICIPALITIES = [
    'San Juan', 'Juncos', 'Barceloneta', 'Canóvanas', 'Carolina', 
    'Ponce', 'Mayagüez', 'Arecibo', 'Manatí', 'Humacao', 
    'Fajardo', 'Guaynabo', 'Bayamón', 'Caguas', 'Gurabo',
    'Las Piedras', 'Dorado', 'Vega Baja', 'Aguadilla'
];

// Rough distance matrix (approximate miles one-way)
// This is used as a fallback if the AI fails to provide distance.
export const PR_DISTANCE_MATRIX: Record<string, Record<string, number>> = {
    'San Juan': {
        'Juncos': 28,
        'Barceloneta': 35,
        'Canóvanas': 15,
        'Manatí': 32,
        'Humacao': 35,
        'Caguas': 18,
        'Ponce': 72,
        'Gurabo': 22,
        'Las Piedras': 32,
    },
    'Guaynabo': {
        'Juncos': 25,
        'Barceloneta': 32,
        'Manatí': 29,
        'Caguas': 12,
    },
    'Bayamón': {
        'Barceloneta': 28,
        'Manatí': 25,
        'Juncos': 35,
    },
    'Caguas': {
        'Juncos': 10,
        'Humacao': 18,
        'Las Piedras': 12,
        'San Juan': 18,
        'Ponce': 55,
    },
    'Carolina': {
        'Canóvanas': 8,
        'Juncos': 20,
        'Fajardo': 30,
    }
};

export const getDistance = (from: string, to: string): number => {
    const f = from.trim();
    const t = to.trim();
    
    // Check matrix
    if (PR_DISTANCE_MATRIX[f]?.[t]) return PR_DISTANCE_MATRIX[f][t];
    if (PR_DISTANCE_MATRIX[t]?.[f]) return PR_DISTANCE_MATRIX[t][f];
    
    // Generic fallbacks for PR
    if (f === t) return 5; // Local commute
    return 25; // Average PR industrial commute
};

export const BENCHMARKS = {
    gasPricePerLiter: 0.91,
    lumaRate: 0.33,
    avgMpg: 22,
    workingDaysPerMonth: 20
};

export const calculateCommuteCosts = (distanceOneWay: number) => {
    const roundTrip = distanceOneWay * 2;
    const monthlyMiles = roundTrip * BENCHMARKS.workingDaysPerMonth;
    const gallonsMonthly = monthlyMiles / BENCHMARKS.avgMpg;
    const litersMonthly = gallonsMonthly * 3.78541;
    const gasCost = litersMonthly * BENCHMARKS.gasPricePerLiter;
    
    // Estimating tolls based on distance (PR toll roads are roughly $1-3 per segment)
    const tolls = distanceOneWay > 15 ? 4 * BENCHMARKS.workingDaysPerMonth : 0; // Simple estimate
    
    return {
        distance: distanceOneWay,
        roundTrip: roundTrip,
        monthlyGas: Math.round(gasCost),
        monthlyTolls: Math.round(tolls),
        annualCost: Math.round((gasCost + tolls) * 12)
    };
};
