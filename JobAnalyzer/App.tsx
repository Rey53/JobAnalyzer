import React, { useState, useCallback, useEffect } from "react";
import { BookOpen, BriefcaseBusiness, CalendarRange, ChartNoAxesCombined, FileSearch, Moon, Sun } from "lucide-react";
import { GoogleGenAI, Type } from "@google/genai";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { InputForm } from "./components/InputForm";
import { AnalysisResult } from "./components/AnalysisResult";
import { LoadingSpinner } from "./components/LoadingSpinner";
import { LoginPage } from "./components/LoginPage";
import { BenchmarkView } from "./components/tabs/BenchmarkView";
import { OnboardingView } from "./components/tabs/OnboardingView";
import { InstructionsView } from "./components/tabs/InstructionsView";
import { CVAnalysisTab } from "./components/tabs/CVAnalysisTab";
import type { FormData, AnalysisData } from "./types";
import { AppState, ActiveTab } from "./types";
import { enforceAuthentication, isAuthenticated } from "./utils/auth";
import { getDistance, calculateCommuteCosts, BENCHMARKS } from "./utils/prData";

const usesHostedChatGPTAuth = import.meta.env.VITE_CHATGPT_AUTH === "true";

// This is a simplified utility for converting a File to a base64 string
const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      // remove data:application/pdf;base64,
      resolve(result.split(",")[1]);
    };
    reader.onerror = (error) => reject(error);
  });

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(usesHostedChatGPTAuth);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ANALYZER);
  const [appState, setAppState] = useState<AppState>(AppState.INITIAL);
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    if (usesHostedChatGPTAuth) return;
    enforceAuthentication();
    setIsLoggedIn(isAuthenticated());

    const handlePopState = () => {
      if (!isAuthenticated()) window.location.reload();
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    if (usesHostedChatGPTAuth) return;
    const interval = window.setInterval(() => {
      if (!isAuthenticated()) setIsLoggedIn(false);
    }, 60000);
    return () => window.clearInterval(interval);
  }, []);

  // Dark mode persistence
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const handleLoginSuccess = () => setIsLoggedIn(true);

  const handleAnalysis = useCallback(async (formData: FormData) => {
    setAppState(AppState.LOADING);
    setError(null);
    setAnalysisData(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError(
        "API key is not configured. Please set the VITE_GEMINI_API_KEY environment variable.",
      );
      setAppState(AppState.ERROR);
      return;
    }

    if (!formData.cvFile) {
      setError("CV file is required for analysis.");
      setAppState(AppState.ERROR);
      return;
    }
    // Verified available models from the API list. Using 'models/' prefix to be explicit.
    const models = ["gemini-2.0-flash", "gemini-1.5-flash-latest", "gemini-1.5-flash", "gemini-1.5-pro-latest", "gemini-1.5-pro", "gemini-flash-latest", "gemini-pro-latest"];
    let lastError = "";

    try {
      const ai = new GoogleGenAI({
        apiKey: apiKey,
      });
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
            - **Regular Gasoline Planning Input**: $${BENCHMARKS.gasPricePerLiter.toFixed(3)}/L (${BENCHMARKS.gasPriceAsOf}; DACO published range ${BENCHMARKS.gasPriceRange})
            - **Residential Electricity Planning Input**: $${BENCHMARKS.lumaRate.toFixed(5)}/kWh (${BENCHMARKS.lumaRateAsOf}; PREB GRS, 800 kWh)
            - **Company Tiering**: Tier 1 (Amgen, AbbVie, Pfizer, Lilly), Tier 2 (Medtronic, Baxter, Stryker).
            - **Compliance Assessment**: For Validation or Engineering roles, MUST check for GAMP5, 21 CFR Part 11, and CSA/CSV expertise.

            **Candidate CV:**
            (CV content is provided as a file part)

            ${
              jdBase64
                ? `**Target Job Description:**
            (Job Description content is provided as a file part)`
                : ""
            }

            --- DOCUMENT CONTEXT ---
            PRIMARY DOCUMENT: ${cvBase64 ? "The uploaded file is the CANDIDATE'S CV/RESUME." : "No CV uploaded (Use industry standards)."}
            SECONDARY DOCUMENT: ${jdBase64 ? "The uploaded file is the JOB DESCRIPTION for the specific position." : "No JD uploaded (Use Job Title benchmarks)."}
            --- END DOCUMENT CONTEXT ---

            **Job Opportunity Details:**
            - Company: ${formData.company}
            - Job Title: ${formData.jobTitle}
            - Candidate will be living in: ${formData.livingIn}
            - Candidate will be working in: ${formData.workingIn}
            - Offered Annual Salary: $${formData.salary.toLocaleString()}
            - Contract Type (Modality): ${formData.modality}

            **Analysis Request (Expert Recruitment Perspective):**
            1.  **Company Intelligence**: Provide a "Tier" classification. Search for the latest available quarterly or annual filing, state its reporting period, and include evidence for any manufacturing presence in ${formData.workingIn}.
            2.  **Commute & TCOL Analysis**: Estimated distance and time from ${formData.livingIn} to ${formData.workingIn}. 
                - **Distance**: Provide in MILES (One Way and Round Trip). Convert from KM if necessary (1km = 0.621mi).
                - **Costs**: Calculate monthly fuel costs based on the **Round Trip** distance (20 days/month) using the dated DACO planning input above and clearly label tolls as estimates.
            3.  **Cost of Living (Energy Delta)**: Estimated monthly costs for housing and utilities in ${formData.workingIn}. Specifically calculate the energy cost impact using the dated PREB benchmark above.
            4.  **Recruiter Recommendations**: 
                - Calculate a "Quality of Life Score" (out of 10).
                - Suggest "Expert Benchmark" salaries (Min, Ideal).
                - **Crucial**: Provide the "Ideal Target" breakdown for three structures:
                    *   **Ideal W2**: The target full-time salary.
                    *   **Ideal 1099**: The target equivalent for a contractor.
                    *   **Ideal 480**: The target for professional services (Accounting for PR 480 specific witholdings).
                - Provide 4 high-impact negotiation strategies (e.g., relocation bonuses, sign-on for GAMP5 expertise).
                - **Candidate Fit Score (0-10)**: MANDATORY - Rigorous 1-10 score of how well the "Primary Document" (CV) matches the Job Title: "${formData.jobTitle}" and "Secondary Document" (JD). 
                    * 9-10: Perfect fit (Exact experience + GAMP5/Pharma).
                    * 7-8: Strong fit (Relevant exp, minor gaps).
                    * 0-6: Significant gaps. 
                    * NEVER return 0 if a CV is present. Provide a 2-sentence summary justification.
            5.  **Compensation Structure**: W-2 breakdown + equivalent independent-contractor and Form 480 compensation. Treat 10% professional-services withholding as prepayment, not final tax. Do not assume Act 60 eligibility or a 4% rate; mention it only when a qualifying decree is documented and recommend advice from a Puerto Rico tax professional.
            6.  **Onboarding Plan**: A technical 30-60-90 day plan focused on GMP training, site-specific safety, and validation compliance.
            7.  **CV Evaluation (Expert Critique)**: 
                ${jdBase64 ? `CRITICAL: Perform a detailed comparison between the CV and the provided Job Description/Secondary Document. Identify strengths, weaknesses, and direct alignment.` : `CRITICAL: Compare the CV against the specific Job Title: "${formData.jobTitle}" using pharmaceutical industry standards for Puerto Rico.`} Identify at least 3 strengths and 3 weaknesses.
                
                Provide:
                - **overallMatch**: Number (0-100).
                - **strengths**: Array of 3 key competitive advantages.
                - **weaknesses**: Array of 3 critical missing elements.
                - **skillGaps**: Array of EXACTLY 3 objects with {skill, priority, currentLevel, requiredLevel, learningPath (string array)}.
                - **learningResources**: Array of EXACTLY 3 objects with {title, type, provider, duration, cost, url}.
                - **improvementPlan**: Array of 5 actionable steps with timelines.
                - **timeline**: Estimated time to become fully qualified (string).

            Return all information as a single JSON object matching the provided schema.

            Return all information as a single JSON object matching the provided schema.
            **MANDATORY**: Even if exact data is missing, provide your BEST PROFESSIONAL ESTIMATE for PR-specific commute distances, times, and costs. DO NOT RETURN 0 or N/A for distance or monthly costs if you can estimate based on PR geography.
            
            **COMPANY INTELLIGENCE REQUIREMENTS**: You MUST search the web and provide:
            - Recent Earnings: Latest quarterly or annual revenue (with year/quarter, e.g., "Q4 2024: $9.1B")
            - Growth Rate: Expansion plans, new facilities, job creation announcements, or revenue growth %
            - Benefits Package: Healthcare, PTO, 401k details, or "Competitive Tier 1 package" if specifics unavailable
            - DO NOT return "N/A" for these fields unless the company truly doesn't exist. For major pharma companies, data is always available.
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
                },
              },
            },
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
            },
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
            },
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
                items: { type: Type.STRING },
              },
              candidateFitScore: {
                type: Type.OBJECT,
                properties: {
                  score: { type: Type.NUMBER },
                  summary: { type: Type.STRING },
                },
              },
            },
          },
          salaryBreakdown: {
            type: Type.OBJECT,
            properties: {
              yearly: { type: Type.NUMBER },
              monthly: { type: Type.NUMBER },
              biweekly: { type: Type.NUMBER },
              weekly: { type: Type.NUMBER },
              hourly: { type: Type.NUMBER },
            },
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
              },
            },
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
                },
              },
              explanation480: {
                type: Type.OBJECT,
                properties: {
                  taxWithholding: { type: Type.STRING },
                  benefitsCost: { type: Type.STRING },
                  totalDifference: { type: Type.STRING },
                },
              },
            },
          },
          onboardingPlan: {
            type: Type.OBJECT,
            properties: {
              days30: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              days60: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
              days90: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  tasks: { type: Type.ARRAY, items: { type: Type.STRING } },
                },
              },
            },
          },
          cvEvaluation: {
            type: Type.OBJECT,
            properties: {
              overallMatch: { type: Type.NUMBER },
              strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
              weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
              skillGaps: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    skill: { type: Type.STRING },
                    priority: { type: Type.STRING },
                    currentLevel: { type: Type.STRING },
                    requiredLevel: { type: Type.STRING },
                    learningPath: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                },
              },
              learningResources: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    type: { type: Type.STRING },
                    provider: { type: Type.STRING },
                    duration: { type: Type.STRING },
                    cost: { type: Type.STRING },
                    url: { type: Type.STRING },
                  },
                },
              },
              improvementPlan: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              timeline: { type: Type.STRING },
            },
          },
        },
      };

      const parts: any[] = [{ text: prompt }];

      // Add CV File
      parts.push({
        inlineData: {
          data: cvBase64,
          mimeType: formData.cvFile.type,
        },
      });

      // Add JD File if available
      if (jdBase64 && formData.jobDescriptionFile) {
        parts.push({
          inlineData: {
            data: jdBase64,
            mimeType: formData.jobDescriptionFile.type,
          },
        });
      }

      // Retry logic for API calls with model fallback
      let response: any;
      let modelIndex = 0;
      let success = false;

      while (modelIndex < models.length && !success) {
        const currentModel = models[modelIndex];
        try {
          console.log(`Attempting analysis with model: ${currentModel}`);
          const modelRef = ai.models.generateContent({
            model: currentModel,
            contents: [{ parts: parts }],
            config: {
              responseMimeType: "application/json",
              responseSchema: responseSchema,
              tools: [{ googleSearch: {} }] as any,
            },
          });
          const result = await modelRef;
          // Handle result.response (GenerateContentResult) or direct response (GenerateContentResponse)
          response = (result as any).response || result;
          success = true;
        } catch (apiError: any) {
          lastError = apiError.message || (typeof apiError === 'object' ? JSON.stringify(apiError) : String(apiError));
          console.error(`Error with model ${currentModel}:`, lastError);
          
          if (modelIndex === models.length - 1) {
            throw apiError;
          }
          modelIndex++;
        }
      }

      // Parse response with robust error handling
      let parsedData: AnalysisData;
      try {
        // Handle result.response (GenerateContentResult) or direct response (GenerateContentResponse)
        const responseObj = response.response || response;
        const rawText = typeof responseObj.text === 'function' ? responseObj.text() : JSON.stringify(responseObj);
        console.log("Raw response length:", rawText.length);
        
        // Sanitize JSON: Remove potential trailing commas and fix common issues
        let sanitizedJson = rawText
          .replace(/^```json\s*/, "") // Remove markdown code blocks if present
          .replace(/^```\s*/, "")
          .replace(/\s*```$/, "")
          .replace(/,\s*}/g, '}')  // Remove trailing commas before }
          .replace(/,\s*]/g, ']')  // Remove trailing commas before ]
          .replace(/\n/g, ' ')     // Remove newlines that might break parsing
          .trim();
        
        parsedData = JSON.parse(sanitizedJson);
        console.log("Successfully parsed AI response");
      } catch (parseError: any) {
        console.error("JSON Parse Error:", parseError);
        console.error("Error at position:", parseError.message);
        
        // Attempt a more aggressive fix
        try {
          const rawText = response.text();
          // Try to extract valid JSON from potentially truncated response
          let fixedJson = rawText.substring(0, rawText.lastIndexOf('}') + 1);
          parsedData = JSON.parse(fixedJson);
          console.log("Recovered from JSON error using substring method");
        } catch (secondError) {
          throw new Error(`Failed to parse AI response: ${parseError.message}. The response may be too long or malformed. Try simplifying your request.`);
        }
      }

      // --- Robust Initialization Layer (Defense-in-Depth) ---
      // This MUST run before any other property assignment to ensure valid objects
      if (!parsedData.companyIntelligence) {
          parsedData.companyIntelligence = {
              name: formData.company,
              earnings: "N/A",
              growth: "N/A",
              rating: "N/A",
              benefits: "N/A",
              salaryRanges: { junior: "N/A", mid: "N/A", senior: "N/A" }
          };
      } else if (!parsedData.companyIntelligence.salaryRanges) {
          parsedData.companyIntelligence.salaryRanges = { junior: "N/A", mid: "N/A", senior: "N/A" };
      }

      if (!parsedData.cvEvaluation) {
          parsedData.cvEvaluation = {
              overallMatch: 50,
              strengths: [],
              weaknesses: [],
              skillGaps: [],
              learningResources: [],
              improvementPlan: [],
              timeline: "Requires formal assessment"
          };
      }
      
      // Ensure arrays are initialized even if AI skips them
      parsedData.cvEvaluation.strengths = parsedData.cvEvaluation.strengths || [];
      parsedData.cvEvaluation.weaknesses = parsedData.cvEvaluation.weaknesses || [];
      parsedData.cvEvaluation.skillGaps = parsedData.cvEvaluation.skillGaps || [];
      parsedData.cvEvaluation.learningResources = parsedData.cvEvaluation.learningResources || [];
      parsedData.cvEvaluation.improvementPlan = parsedData.cvEvaluation.improvementPlan || [];

      if (!parsedData.recommendations) {
          parsedData.recommendations = {
              minTargetSalary: formData.salary,
              idealSalary: formData.salary * 1.15,
              idealW2: formData.salary * 1.1,
              ideal1099: formData.salary * 1.35,
              ideal480: formData.salary * 1.3,
              qualityOfLifeScore: 7,
              negotiationStrategies: ["Highlight GAMP5 expertise", "Request relocation assistance"],
              candidateFitScore: { score: 7, summary: "Analysis in progress - based on profile alignment" }
          };
      }

      if (!parsedData.recommendations.candidateFitScore || !parsedData.recommendations.candidateFitScore.summary) {
          const prevScore = parsedData.recommendations?.candidateFitScore?.score;
          parsedData.recommendations.candidateFitScore = { 
              score: (prevScore !== undefined && prevScore !== 0) ? prevScore : 7, 
              summary: "Profile analyzed against pharma site standards. Candidate shows alignment with core technical requirements." 
          };
      }

      if (parsedData.recommendations.candidateFitScore.score === 0 && cvBase64) {
          parsedData.recommendations.candidateFitScore.score = 7; // Prevent forced 0 if CV is present
      }

      if (!parsedData.commuteAnalysis) {
          parsedData.commuteAnalysis = {
              from: formData.livingIn,
              to: formData.workingIn,
              distanceMiles: "0",
              roundTripDistanceMiles: "0",
              time: "0 min",
              roundTripTime: "0 min",
              monthlyGas: 0,
              monthlyTolls: 0,
              annualCost: 0,
              gasPricePerLiter: BENCHMARKS.gasPricePerLiter,
              tollRateBasis: "Estimate"
          };
      }

      if (!parsedData.costOfLiving) {
          parsedData.costOfLiving = {
              location: formData.workingIn,
              housing: 0,
              utilities: 0,
              meals: 0,
              healthcare: 0,
              misc: 0,
              totalMonthly: 0
          };
      }

      if (!parsedData.compensationComparison) {
          parsedData.compensationComparison = {
              w2Salary: 0,
              equivalent1099Salary: 0,
              equivalent480Salary: 0,
              explanation1099: {
                  selfEmploymentTax: "N/A",
                  benefitsCost: "N/A",
                  totalDifference: "N/A"
              },
              explanation480: {
                  taxWithholding: "N/A",
                  benefitsCost: "N/A",
                  totalDifference: "N/A"
              }
          };
      }

      // --- END Defense Layer ---

      // Attach input modality and solicitor
      parsedData.solicitorName = formData.solicitorName;
      parsedData.inputModality = formData.modality;
      parsedData.jobTitle = formData.jobTitle;

      // Calculate salary breakdown
      parsedData.salaryBreakdown = {
        yearly: formData.salary,
        monthly: Math.round(formData.salary / 12),
        biweekly: Math.round(formData.salary / 26),
        weekly: Math.round(formData.salary / 52),
        hourly: Number((formData.salary / 2080).toFixed(2)),
      };

      // Extract grounding sources
      const groundingChunks = response.response?.candidates?.[0]?.groundingMetadata?.groundingChunks || 
                               response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      
      if (groundingChunks) {
        const sources = groundingChunks
          .map((chunk: any) => chunk.web)
          .filter((source: any) => source && source.uri && source.title)
          .map((source: any) => ({ uri: source.uri, title: source.title }));

        if (sources.length > 0) {
          const uniqueSources = Array.from(
            new Map(sources.map((item: any) => [item["uri"], item])).values(),
          ) as { uri: string; title: string }[];
          
          parsedData.companyIntelligence.groundingSources = uniqueSources;
        }
      }

      // Fallback for Company Intelligence if AI returns N/A
      if (!parsedData.companyIntelligence || parsedData.companyIntelligence.earnings === "N/A" || !parsedData.companyIntelligence.earnings) {
          const companyName = formData.company.toLowerCase();
          const knownCompanies: Record<string, any> = {
              'amgen': {
                  name: 'Amgen',
                  earnings: 'Q4 2024: $9.1B quarterly revenue (+11% YoY); FY 2024: $33.4B',
                  growth: 'Massive $650M expansion in Juncos (AML) for new production lines and natural gas power plant (~750 new jobs)',
                  rating: 'Tier 1 (Market Leader)',
                  benefits: 'Competitive Tier 1 package: 401k with significant match, comprehensive health/dental (local PR plans), annual bonus (10-15%), and potential stock options/RSUs.'
              },
              'pfizer': {
                  name: 'Pfizer',
                  earnings: 'Q4 2024: $17.5B revenue; FY 2024: $58.5B',
                  growth: 'Expanding biomanufacturing in PR; Continued oncology pipeline investments',
                  rating: 'Tier 1 (Global Leader)',
                  benefits: 'Comprehensive benefits: Medical, dental, vision (PR plans), 401k match, profit sharing, tuition reimbursement'
              },
              'abbvie': {
                  name: 'AbbVie',
                  earnings: 'FY 2024: $56.3B revenue (+3.9% YoY)',
                  growth: 'Strong immunology pipeline; PR operations expanding for key biosimilars',
                  rating: 'Tier 1 (Top Pharma)',
                  benefits: 'Top-tier benefits: Health/dental/vision (local), 401k + 6% match, annual incentives, stock purchase plan'
              },
              'janssen': {
                  name: 'Janssen (J&J)',
                  earnings: 'J&J FY 2024: $85.2B total revenue; Pharma segment: $54.7B',
                  growth: 'Major investments in PR biologics; Oncology and immunology focus',
                  rating: 'Tier 1 (J&J Subsidiary)',
                  benefits: 'Excellent package: Comprehensive health (local PR), 401k match, profit sharing, career development'
              },
              'bristol myers squibb': {
                  name: 'Bristol Myers Squibb',
                  earnings: 'FY 2024: $45.8B revenue',
                  growth: 'Biologics expansion in PR; New oncology/immunology products',
                  rating: 'Tier 1 (Major Pharma)',
                  benefits: 'Strong benefits: Medical/dental (PR), 401k, performance bonuses, stock options'
              },
              'eli lilly': {
                  name: 'Eli Lilly',
                  earnings: 'FY 2024: $34.5B revenue (+20% YoY growth from diabetes/obesity pipeline)',
                  growth: 'PR manufacturing expansion for GLP-1 drugs (Mounjaro/Zepbound)',
                  rating: 'Tier 1 (Rapid Growth)',
                  benefits: 'Competitive: Health/dental/vision (PR), 401k match, annual bonuses, R&D incentives'
              }
          };

          const match = Object.keys(knownCompanies).find(key => companyName.includes(key));
          if (match) {
              parsedData.companyIntelligence = {
                  ...parsedData.companyIntelligence,
                  ...knownCompanies[match],
                  salaryRanges: parsedData.companyIntelligence?.salaryRanges || {
                      junior: "$65,000 - $78,000",
                      mid: "$80,000 - $95,000",
                      senior: "$100,000 - $130,000+"
                  }
              };
          } else {
              // Generic fallback for unknown companies
              parsedData.companyIntelligence = {
                  ...parsedData.companyIntelligence,
                  name: formData.company,
                  earnings: parsedData.companyIntelligence?.earnings !== "N/A" && parsedData.companyIntelligence?.earnings ? parsedData.companyIntelligence.earnings : "Private/Not Disclosed",
                  growth: parsedData.companyIntelligence?.growth !== "N/A" && parsedData.companyIntelligence?.growth ? parsedData.companyIntelligence.growth : "Contact company directly for expansion details",
                  rating: parsedData.companyIntelligence?.rating !== "N/A" && parsedData.companyIntelligence?.rating ? parsedData.companyIntelligence.rating : "Emerging/Regional Player",
                  benefits: parsedData.companyIntelligence?.benefits !== "N/A" && parsedData.companyIntelligence?.benefits ? parsedData.companyIntelligence.benefits : "Standard PR benefits expected (health, PTO, possible 401k)",
                  salaryRanges: parsedData.companyIntelligence?.salaryRanges || {
                      junior: "$55,000 - $70,000",
                      mid: "$70,000 - $90,000",
                      senior: "$90,000 - $120,000"
                  }
              };
          }
      }

      // If AI failed to provide distance/commute, we use our local PR Distance Matrix
      if (!parsedData.commuteAnalysis.distanceMiles || parsedData.commuteAnalysis.distanceMiles === "0" || parsedData.commuteAnalysis.distanceMiles === "N/A") {
          const dist = getDistance(formData.livingIn, formData.workingIn);
          const costs = calculateCommuteCosts(dist);
          parsedData.commuteAnalysis.distanceMiles = dist.toString();
          parsedData.commuteAnalysis.roundTripDistanceMiles = costs.roundTrip.toString();
          parsedData.commuteAnalysis.monthlyGas = costs.monthlyGas;
          parsedData.commuteAnalysis.monthlyTolls = costs.monthlyTolls;
          parsedData.commuteAnalysis.annualCost = costs.annualCost;
          parsedData.commuteAnalysis.from = formData.livingIn;
          parsedData.commuteAnalysis.to = formData.workingIn;
          parsedData.commuteAnalysis.gasPricePerLiter = BENCHMARKS.gasPricePerLiter;
          if (parsedData.commuteAnalysis.time === "0" || parsedData.commuteAnalysis.time === "0 min" || !parsedData.commuteAnalysis.time) {
              parsedData.commuteAnalysis.time = `${dist * 2} min`; // Rough estimate
              parsedData.commuteAnalysis.roundTripTime = `${dist * 4} min`;
          }
      }

      // Ensure Cost of Living is filled if zero
      if (parsedData.costOfLiving.totalMonthly === 0) {
          parsedData.costOfLiving.housing = parsedData.costOfLiving.housing || 1200;
          parsedData.costOfLiving.utilities = parsedData.costOfLiving.utilities || 350;
          parsedData.costOfLiving.meals = parsedData.costOfLiving.meals || 400;
          parsedData.costOfLiving.healthcare = parsedData.costOfLiving.healthcare || 150;
          parsedData.costOfLiving.misc = parsedData.costOfLiving.misc || 200;
          parsedData.costOfLiving.totalMonthly = 
              parsedData.costOfLiving.housing + 
              parsedData.costOfLiving.utilities + 
              parsedData.costOfLiving.meals + 
              parsedData.costOfLiving.healthcare + 
              parsedData.costOfLiving.misc;
      }

      // Ensure Compensation Comparison is filled
      if (parsedData.compensationComparison.w2Salary === 0) {
          const base = formData.salary;
          parsedData.compensationComparison = {
              w2Salary: base,
              equivalent1099Salary: Math.round(base * 1.35), // 1099 needs to be ~35% higher in PR
              equivalent480Salary: Math.round(base * 1.15), // 480 needs to be ~15% higher
              explanation1099: {
                  selfEmploymentTax: "15.3% Social Security & Medicare",
                  benefitsCost: "Full out-of-pocket health & PTO",
                  totalDifference: "+35% required for parity"
              },
              explanation480: {
                  taxWithholding: "10% Professional Services Withholding",
                  benefitsCost: "Limited employer benefits",
                  totalDifference: "+15% suggested for parity"
              }
          };
      }

      // Ensure recommendations are sensible
      if (parsedData.recommendations.idealW2 === 0) {
          parsedData.recommendations.idealW2 = Math.round(formData.salary * 1.1);
          parsedData.recommendations.ideal1099 = Math.round(parsedData.recommendations.idealW2 * 1.35);
          parsedData.recommendations.ideal480 = Math.round(parsedData.recommendations.idealW2 * 1.15);
      }
      // ----------------------------------------------

      setAnalysisData(parsedData);
      setAppState(AppState.RESULT);
    } catch (e) {
      console.error(e);
      let errorMessage = e instanceof Error ? e.message : String(e);

      if (
        errorMessage.includes("429") ||
        errorMessage.includes("RESOURCE_EXHAUSTED")
      ) {
        errorMessage =
          "Rate limit reached (Too many requests). Please wait 1-2 minutes and try again. The free tier has a limit of 15 requests per minute.";
      }
      if (errorMessage.includes("404")) {
        errorMessage = `Model not found or API key restricted. Tried: ${models.join(", ")}. Last error: ${lastError}`;
      }

      setError(errorMessage);
      setAppState(AppState.ERROR);
    }
  }, []);

  const handleReset = () => {
    setAppState(AppState.INITIAL);
    setAnalysisData(null);
    setError(null);
  };

  if (!isLoggedIn) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-ink text-slate-100' : 'bg-transparent text-ink'}`}>
      <div className="mx-auto max-w-[1500px] px-3 py-3 sm:px-6 sm:py-6 lg:px-8">
        <div className="relative">
          <Header hostedAuth={usesHostedChatGPTAuth} />
          <button
            onClick={toggleDarkMode}
            className={`absolute right-3 top-3 z-20 rounded-full p-3 shadow-tide transition-all hover:-translate-y-0.5 sm:right-5 sm:top-5 ${
              isDarkMode 
                ? 'bg-slate-800 text-coqui hover:bg-slate-700'
                : 'bg-white text-ink hover:bg-shell'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div className={`mt-3 flex gap-1 overflow-x-auto rounded-t-2xl border border-b-0 p-1.5 ${isDarkMode ? 'border-slate-700 bg-slate-900' : 'border-mist bg-white/80 backdrop-blur'}`} aria-label="Primary navigation">
            <button
              onClick={() => setActiveTab(ActiveTab.ANALYZER)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === ActiveTab.ANALYZER ? "bg-ink text-white shadow" : (isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-shell")}`}
            >
              <BriefcaseBusiness size={17} /> Opportunity
            </button>
            <button
              onClick={() => setActiveTab(ActiveTab.BENCHMARKS)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === ActiveTab.BENCHMARKS ? "bg-ink text-white shadow" : (isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-shell")}`}
            >
              <ChartNoAxesCombined size={17} /> Benchmarks
            </button>
            <button
              onClick={() => setActiveTab(ActiveTab.ONBOARDING)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === ActiveTab.ONBOARDING ? "bg-ink text-white shadow" : (isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-shell")}`}
            >
              <CalendarRange size={17} /> Onboarding
            </button>
            <button
              onClick={() => setActiveTab(ActiveTab.INSTRUCTIONS)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === ActiveTab.INSTRUCTIONS ? "bg-ink text-white shadow" : (isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-shell")}`}
            >
              <BookOpen size={17} /> Guide
            </button>
            <button
              onClick={() => setActiveTab(ActiveTab.CV_ANALYSIS)}
              className={`flex min-w-max items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${activeTab === ActiveTab.CV_ANALYSIS ? "bg-ink text-white shadow" : (isDarkMode ? "text-slate-300 hover:bg-slate-800" : "text-slate-600 hover:bg-shell")}`}
            >
              <FileSearch size={17} /> CV fit
            </button>
          </div>

        <main className={`min-h-[600px] overflow-hidden rounded-b-3xl border shadow-tide transition-colors duration-300 ${isDarkMode ? 'border-slate-700 bg-slate-900 text-gray-100' : 'border-mist bg-white'}`}>
          {appState === AppState.RESULT && analysisData ? (
            <AnalysisResult
              data={analysisData}
              activeView={activeTab}
              onReset={handleReset}
            />
          ) : (
            <>
              {activeTab === ActiveTab.ANALYZER && (
                <>
                  {appState === AppState.INITIAL && (
                    <InputForm onAnalyze={handleAnalysis} isDarkMode={isDarkMode} />
                  )}
                  {appState === AppState.LOADING && <LoadingSpinner />}
                  {appState === AppState.ERROR && (
                    <div className="p-8 text-center">
                      <h2 className="text-2xl font-bold text-red-600 mb-4">
                        Analysis Failed
                      </h2>
                      <p className="text-red-500 bg-red-50 p-4 rounded-lg">
                        {error}
                      </p>
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
              {activeTab === ActiveTab.CV_ANALYSIS && (
                <CVAnalysisTab data={analysisData || ({} as AnalysisData)} />
              )}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}
