
export enum AppState {
    INITIAL = 'INITIAL',
    LOADING = 'LOADING',
    RESULT = 'RESULT',
    ERROR = 'ERROR',
}

export enum ActiveTab {
    ANALYZER = 'ANALYZER',
    BENCHMARKS = 'BENCHMARKS',
    ONBOARDING = 'ONBOARDING',
}

export interface FormData {
    company: string;
    jobTitle: string;
    livingIn: string;
    workingIn: string;
    salary: number;
    cvFile: File | null;
}

export interface SalaryBenchmark {
    role: string;
    junior: string;
    mid: string;
    senior: string;
}

export interface CompensationComparison {
    w2Salary: number;
    equivalent1099Salary: number;
    equivalent480Salary: number;
    explanation1099: {
        selfEmploymentTax: string;
        benefitsCost: string;
        totalDifference: string;
    };
    explanation480: {
        taxWithholding: string;
        benefitsCost: string;
        totalDifference: string;
    };
}

export interface OnboardingPlan {
    days30: { title: string; tasks: string[] };
    days60: { title: string; tasks: string[] };
    days90: { title: string; tasks: string[] };
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface AnalysisData {
    companyIntelligence: {
        name: string;
        earnings: string;
        growth: string;
        rating: string;
        benefits: string;
        salaryRanges: {
            junior: string;
            mid: string;
            senior: string;
        };
        groundingSources?: GroundingSource[];
    };
    commuteAnalysis: {
        from: string;
        to: string;
        distance: string;
        time: string;
        monthlyGas: number;
        monthlyTolls: number;
        annualCost: number;
    };
    costOfLiving: {
        location: string;
        housing: number;
        utilities: number;
        meals: number;
        healthcare: number;
        misc: number;
        totalMonthly: number;
    };
    recommendations: {
        minTargetSalary: number;
        idealSalary: number;
        qualityOfLifeScore: number;
        negotiationStrategies: string[];
        candidateFitScore: {
            score: number;
            summary: string;
        };
    };
    salaryBreakdown: {
        yearly: number;
        monthly: number;
        biweekly: number;
        weekly: number;
        hourly: number;
    };
    salaryBenchmarks: SalaryBenchmark[];
    compensationComparison: CompensationComparison;
    onboardingPlan: OnboardingPlan;
}
