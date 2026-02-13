
import React, { useState, useCallback, useEffect } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { InputForm } from './components/InputForm';
import { AnalysisResult } from './components/AnalysisResult';
import { LoadingSpinner } from './components/LoadingSpinner';
import { LoginPage } from './components/LoginPage';
import { BenchmarkView } from './components/tabs/BenchmarkView';
import { OnboardingView } from './components/tabs/OnboardingView';
import { InstructionsView } from './components/tabs/InstructionsView';
import type { FormData, AnalysisData } from './types';
import { AppState, ActiveTab } from './types';
import { isAuthenticated, enforceAuthentication } from './utils/auth';

// This is a simplified utility for converting a File to a base64 string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        // remove data:application/pdf;base64,
        resolve(result.split(',')[1]);
    }
    reader.onerror = (error) => reject(error);
  });

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ANALYZER);
    const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [error, setError] = useState<string | null>(null);

    // Security: Check authentication on mount and enforce it
    useEffect(() => {
        enforceAuthentication();
        setIsLoggedIn(isAuthenticated());
        
        // Prevent browser back button bypass
        const handlePopState = () => {
            if (!isAuthenticated()) {
                window.location.reload();
            }
        };
        
        window.addEventListener('popstate', handlePopState);
        return () => window.removeEventListener('popstate', handlePopState);
    }, []);

    // Security: Periodic authentication check
    useEffect(() => {
        const interval = setInterval(() => {
            if (!isAuthenticated()) {
                setIsLoggedIn(false);
            }
        }, 60000); // Check every minute
        
        return () => clearInterval(interval);
    }, []);

    const handleLoginSuccess = () => {
        setIsLoggedIn(true);
    };

    const handleAnalysis = useCallback(async (formData: FormData) => {
        setAppState(AppState.LOADING);
        setError(null);
        setAnalysisData(null);

        if (!process.env.API_KEY) {
            setError("API key is not configured. Please set the API_KEY environment variable.");
            setAppState(AppState.ERROR);
            return;
        }

        if (!formData.cvFile) {
            setError("CV file is required for analysis.");
            setAppState(AppState.ERROR);
            return;
        }
        
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const cvBase64 = await fileToBase64(formData.cvFile);
            let jdBase64 = null;
            if (formData.jobDescriptionFile) {
                jdBase64 = await fileToBase64(formData.jobDescriptionFile);
            }

            const prompt = `
            You are an Expert Pharma Recruiter specializing in the Puerto Rico industrial sector. 
            Analyze the following job opportunity in Puerto Rico's pharmaceutical sector based on the provided CV and Job Description (if provided). 
            Provide a comprehensive, data-driven analysis using your industry-specific Knowledge Base (KB).

            **Expert Recruiter Constraints (Hardcoded PR Data):**
            - **Current Gasoline Price**: $0.91/L (Regular)
            - **LUMA Energy Rate**: $0.33/kWh (Residential Average)
            - **Company Tiering**: Tier 1 (Amgen, AbbVie, Pfizer, Lilly), Tier 2 (Medtronic, Baxter, Stryker).
            - **Compliance Assessment**: For Validation or Engineering roles, MUST check for GAMP5, 21 CFR Part 11, and CSA/CSV expertise.

            **Candidate CV:**
            (CV content is provided as a file part)

            ${jdBase64 ? `**Target Job Description:**
            (Job Description content is provided as a file part)` : ''}

            **Job Opportunity Details:**
            - Company: ${formData.company}
            - Job Title: ${formData.jobTitle}
            - Candidate will be living in: ${formData.livingIn}
            - Candidate will be working in: ${formData.workingIn}
            - Offered Annual Salary: $${formData.salary.toLocaleString()}
            - Contract Type (Modality): ${formData.modality}

            **Analysis Request (Expert Recruitment Perspective):**
            1.  **Company Intelligence**: Provide a "Tier" classification. Use a real-time web search to find the latest quarterly earnings (Q3/Q4 2024 or Q1 2025). Include the specific manufacturing presence in ${formData.workingIn}.
            2.  **Commute & TCOL Analysis**: Estimated distance and time from ${formData.livingIn} to ${formData.workingIn}. 
                - **Distance**: Provide in MILES (One Way and Round Trip). Convert from KM if necessary (1km = 0.621mi).
                - **Costs**: Calculate monthly fuel costs based on the **Round Trip** distance (20 days/month) using $0.91/L ($3.44/gal approx) and estimated PR-22/PR-52 tolls. 
            3.  **Cost of Living (The "LUMA Delta")**: Estimated monthly costs for housing and utilities in ${formData.workingIn}. Specifically calculate the energy cost impact using the $0.33/kWh benchmark.
            4.  **Recruiter Recommendations**: 
                - Calculate a "Quality of Life Score" (out of 10).
                - Suggest "Expert Benchmark" salaries (Min, Ideal).
                - **Crucial**: Provide the "Ideal Target" breakdown for three structures:
                    *   **Ideal W2**: The target full-time salary.
                    *   **Ideal 1099**: The target equivalent for a contractor.
                    *   **Ideal 480**: The target for professional services (Accounting for PR 480 specific witholdings).
                - Provide 4 high-impact negotiation strategies (e.g., relocation bonuses, sign-on for GAMP5 expertise).
                - **Candidate Fit Score (0-10)**: Rigorous assessment of CV vs. Pharma Tier expectations. Deduct if missing GAMP5 for Senior roles. ${jdBase64 ? 'Specifically score against the requirements in the uploaded Job Description.' : ''}
            5.  **Compensation Structure**: W2 Breakdown + Equivalent 1099 and Form 480 (PR Services) salaries. Explain the 4% tax benefit under Act 60 if applicable for professional services.
            6.  **Onboarding Plan**: A technical 30-60-90 day plan focused on GMP training, site-specific safety, and validation compliance.
            7.  **CV Evaluation (Expert Critique)**: Compare the provided CV against the ${jdBase64 ? 'Uploaded Job Description' : 'Job Title and Industry Standards'}. Identify 3-5 key Strengths, 3-5 Critical Weaknesses/Gaps, and a concrete Improvement Plan to increase their chances. ${jdBase64 ? 'Recommend specific information to reinforce or skills to learn based on the JD gaps.' : ''}

            Return all information as a single JSON object matching the provided schema.
            `;
            
            const responseSchema = {
                type: Type.OBJECT,
                properties: {
                    companyIntelligence: {
                        type: Type.OBJECT,
                        properties: {
                            name: { type: Type.STRING },
                            earnings: { type: Type.STRING },
                            growth: { type: Type.STRING },
                            rating: { type: Type.STRING },
                            benefits: { type: Type.STRING },
                            salaryRanges: {
                                type: Type.OBJECT,
                                properties: {
                                    junior: { type: Type.STRING },
                                    mid: { type: Type.STRING },
                                    senior: { type: Type.STRING },
                                }
                            }
                        }
                    },
                    commuteAnalysis: {
                        type: Type.OBJECT,
                        properties: {
                            from: { type: Type.STRING },
                            to: { type: Type.STRING },
                            distanceMiles: { type: Type.STRING },
                            roundTripDistanceMiles: { type: Type.STRING },
                            time: { type: Type.STRING },
                            roundTripTime: { type: Type.STRING },
                            monthlyGas: { type: Type.NUMBER },
                            monthlyTolls: { type: Type.NUMBER },
                            annualCost: { type: Type.NUMBER },
                            gasPricePerLiter: { type: Type.NUMBER },
                            tollRateBasis: { type: Type.STRING },
                        }
                    },
                    costOfLiving: {
                        type: Type.OBJECT,
                        properties: {
                            location: { type: Type.STRING },
                            housing: { type: Type.NUMBER },
                            utilities: { type: Type.NUMBER },
                            meals: { type: Type.NUMBER },
                            healthcare: { type: Type.NUMBER },
                            misc: { type: Type.NUMBER },
                            totalMonthly: { type: Type.NUMBER },
                        }
                    },
                    recommendations: {
                        type: Type.OBJECT,
                        properties: {
                            minTargetSalary: { type: Type.NUMBER },
                            idealSalary: { type: Type.NUMBER },
                            idealW2: { type: Type.NUMBER },
                            ideal1099: { type: Type.NUMBER },
                            ideal480: { type: Type.NUMBER },
                            qualityOfLifeScore: { type: Type.NUMBER },
                            negotiationStrategies: {
                                type: Type.ARRAY,
                                items: { type: Type.STRING }
                            },
                            candidateFitScore: {
                                type: Type.OBJECT,
                                properties: {
                                    score: { type: Type.NUMBER },
                                    summary: { type: Type.STRING }
                                }
                            }
                        }
                    },
                    salaryBreakdown: {
                        type: Type.OBJECT,
                        properties: {
                            yearly: { type: Type.NUMBER },
                            monthly: { type: Type.NUMBER },
                            biweekly: { type: Type.NUMBER },
                            weekly: { type: Type.NUMBER },
                            hourly: { type: Type.NUMBER },
                        }
                    },
                    salaryBenchmarks: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                role: { type: Type.STRING },
                                junior: { type: Type.STRING },
                                mid: { type: Type.STRING },
                                senior: { type: Type.STRING },
                            }
                        }
                    },
                    compensationComparison: {
                        type: Type.OBJECT,
                        properties: {
                            w2Salary: { type: Type.NUMBER },
                            equivalent1099Salary: { type: Type.NUMBER },
                            equivalent480Salary: { type: Type.NUMBER },
                            explanation1099: {
                                type: Type.OBJECT,
                                properties: {
                                    selfEmploymentTax: { type: Type.STRING },
                                    benefitsCost: { type: Type.STRING },
                                    totalDifference: { type: Type.STRING },
                                }
                            },
                             explanation480: {
                                type: Type.OBJECT,
                                properties: {
                                    taxWithholding: { type: Type.STRING },
                                    benefitsCost: { type: Type.STRING },
                                    totalDifference: { type: Type.STRING },
                                }
                            }
                        }
                    },
                    onboardingPlan: {
                        type: Type.OBJECT,
                        properties: {
                            days30: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            },
                            days60: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            },
                            days90: {
                                type: Type.OBJECT,
                                properties: {
                                    title: { type: Type.STRING },
                                    tasks: { type: Type.ARRAY, items: { type: Type.STRING } }
                                }
                            }
                        }
                    },
                    cvEvaluation: {
                        type: Type.OBJECT,
                        properties: {
                            strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                            weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                            improvementPlan: { type: Type.ARRAY, items: { type: Type.STRING } }
                        }
                    }
                }
            };
            
            
            const parts: any[] = [{ text: prompt }];

            // Add CV File
            parts.push({
                inlineData: {
                    data: cvBase64,
                    mimeType: formData.cvFile.type,
                }
            });

            // Add JD File if available
            if (jdBase64 && formData.jobDescriptionFile) {
                parts.push({
                    inlineData: {
                        data: jdBase64,
                        mimeType: formData.jobDescriptionFile.type,
                    }
                });
            }

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash-001',
                contents: {
                    parts: parts
                },
                config: {
                    responseMimeType: 'application/json',
                    responseSchema: responseSchema,
                    tools: [{googleSearch: {}}],
                },
            });
            
            const jsonText = response.text.trim();
            const parsedData = JSON.parse(jsonText);
            parsedData.solicitorName = formData.solicitorName;
            parsedData.inputModality = formData.modality;

            // Ensure Salary Breakdown is mathematically accurate based on input
            parsedData.salaryBreakdown = {
                yearly: formData.salary,
                monthly: Math.round(formData.salary / 12),
                biweekly: Math.round(formData.salary / 26),
                weekly: Math.round(formData.salary / 52),
                hourly: Number((formData.salary / 2080).toFixed(2))
            };

            // Extract grounding sources
            const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
            if (groundingChunks) {
                const sources = groundingChunks
                    .map((chunk: any) => chunk.web)
                    .filter((source: any) => source && source.uri && source.title)
                    .map((source: any) => ({ uri: source.uri, title: source.title }));
                
                // Deduplicate sources based on URI
                const uniqueSources = Array.from(new Map(sources.map(item => [item['uri'], item])).values());

                if (uniqueSources.length > 0) {
                    parsedData.companyIntelligence.groundingSources = uniqueSources;
                }
            }

            setAnalysisData(parsedData);
            setAppState(AppState.RESULT);

        } catch (e) {
            console.error(e);
            setError(`An error occurred during analysis. Please check the console for details. Error: ${e instanceof Error ? e.message : String(e)}`);
            setAppState(AppState.ERROR);
        }
    }, []);

    const handleReset = () => {
        setAppState(AppState.INITIAL);
        setAnalysisData(null);
        setError(null);
    };

    // Security Gate: Show login page if not authenticated
    if (!isLoggedIn) {
        return <LoginPage onLoginSuccess={handleLoginSuccess} />;
    }

    return (
        <div className="min-h-screen bg-slate-100 font-sans text-gray-800">
            <div className="container mx-auto p-4 md:p-8">
                <Header />
                
                {/* Global Navigation Tabs */}
                {isLoggedIn && (
                    <div className="bg-gray-50 border-x px-8 py-2 flex gap-1">
                        <button 
                            onClick={() => setActiveTab(ActiveTab.ANALYZER)}
                            className={`px-6 py-3 rounded-t font-medium transition-all ${activeTab === ActiveTab.ANALYZER ? 'bg-white text-blue-700 shadow-md border-t-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            💼 Opportunity Analyzer
                        </button>
                        <button 
                            onClick={() => setActiveTab(ActiveTab.BENCHMARKS)}
                            className={`px-6 py-3 rounded-t font-medium transition-all ${activeTab === ActiveTab.BENCHMARKS ? 'bg-white text-blue-700 shadow-md border-t-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            💰 Salary Benchmarks
                        </button>
                        <button 
                            onClick={() => setActiveTab(ActiveTab.ONBOARDING)}
                            className={`px-6 py-3 rounded-t font-medium transition-all ${activeTab === ActiveTab.ONBOARDING ? 'bg-white text-blue-700 shadow-md border-t-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            📅 Onboarding Plan
                        </button>
                        <button 
                            onClick={() => setActiveTab(ActiveTab.INSTRUCTIONS)}
                            className={`px-6 py-3 rounded-t font-medium transition-all ${activeTab === ActiveTab.INSTRUCTIONS ? 'bg-white text-blue-700 shadow-md border-t-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            ❓ Instructions & FAQ
                        </button>
                        <button 
                            onClick={() => setActiveTab(ActiveTab.CV_ANALYSIS)}
                            className={`px-6 py-3 rounded-t font-medium transition-all ${activeTab === ActiveTab.CV_ANALYSIS ? 'bg-white text-blue-700 shadow-md border-t-2 border-blue-600' : 'text-gray-500 hover:text-blue-600'}`}
                        >
                            🔐 CV Analysis (Expert)
                        </button>
                    </div>
                )}

                <main className="bg-white rounded-b-2xl shadow-2xl overflow-hidden min-h-[600px]">
                    {appState === AppState.RESULT && analysisData ? (
                        <AnalysisResult data={analysisData} activeView={activeTab} onReset={handleReset} />
                    ) : (
                        <>
                            {activeTab === ActiveTab.ANALYZER && (
                                <>
                                    {appState === AppState.INITIAL && <InputForm onAnalyze={handleAnalysis} />}
                                    {appState === AppState.LOADING && <LoadingSpinner />}
                                    {appState === AppState.ERROR && (
                                        <div className="p-8 text-center">
                                            <h2 className="text-2xl font-bold text-red-600 mb-4">Analysis Failed</h2>
                                            <p className="text-red-500 bg-red-50 p-4 rounded-lg">{error}</p>
                                            <button
                                                onClick={handleReset}
                                                className="mt-6 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-all"
                                            >
                                                Try Again
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                            
                            {activeTab === ActiveTab.BENCHMARKS && <BenchmarkView />}
                            {activeTab === ActiveTab.ONBOARDING && <OnboardingView />}
                            {activeTab === ActiveTab.INSTRUCTIONS && <InstructionsView />}
                        </>
                    )}
                </main>
                <Footer />
            </div>
        </div>
    );
}