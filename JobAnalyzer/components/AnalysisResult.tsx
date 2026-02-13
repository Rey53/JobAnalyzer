import React, { useState, useRef } from 'react';
import type { AnalysisData } from '../types';
import { ActiveTab } from '../types';
import { OpportunityAnalyzerTab } from './tabs/OpportunityAnalyzerTab';
import { SalaryBenchmarksTab } from './tabs/SalaryBenchmarksTab';
import { OnboardingPlanTab } from './tabs/OnboardingPlanTab';
import { InstructionsView } from './tabs/InstructionsView';
import { CVAnalysisTab } from './tabs/CVAnalysisTab';
import { Download, RefreshCw, Briefcase, DollarSign, CalendarCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface AnalysisResultProps {
    data: AnalysisData;
    activeView: ActiveTab;
    onReset: () => void;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, activeView, onReset }) => {
    const [isDownloading, setIsDownloading] = useState(false);
    const reportContentRef = useRef<HTMLDivElement>(null);
    const fullReportRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        if (!fullReportRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(fullReportRef.current, {
                scale: 2,
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff',
                windowWidth: 1200, // Force a desktop width
                x: 0,
                y: 0,
                scrollX: 0,
                scrollY: 0
            });
            
            const imgData = canvas.toDataURL('image/png');
            // Check if image data is empty (only has header)
            if (imgData.length < 1000) {
                 throw new Error("Generated PDF content is empty.");
            }

            // Calculate PDF dimensions to match the canvas aspect ratio
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [imgWidth, imgHeight],
                hotfixes: ['px_scaling'],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
            pdf.save(`PharmaPacePR_Full_Report_${data.companyIntelligence.name}.pdf`);

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error generating the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };


    const renderTabContent = () => {
        switch (activeView) {
            case ActiveTab.ANALYZER:
                return <OpportunityAnalyzerTab data={data} />;
            case ActiveTab.BENCHMARKS:
                return <SalaryBenchmarksTab data={data} />;
            case ActiveTab.ONBOARDING:
                return <OnboardingPlanTab data={data} />;
            case ActiveTab.CV_ANALYSIS:
                return <CVAnalysisTab data={data} />;
            case ActiveTab.INSTRUCTIONS:
                return <InstructionsView />;
            default:
                return <OpportunityAnalyzerTab data={data} />;
        }
    };

    const analysisTimestamp = new Date().toLocaleString('en-US', {
        timeZone: 'America/Puerto_Rico',
        dateStyle: 'full',
        timeStyle: 'medium'
    });

    const reportId = `PP-PR-${data.companyIntelligence.name.substring(0,3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

    return (
        <div className="flex flex-col h-full">
            {/* Hidden Full Report Container for PDF Generation */}
            <div className="absolute left-[-9999px] top-0 w-[1024px]">
                <div ref={fullReportRef} className="bg-white p-12 space-y-12">
                     <div className="flex mb-6 pb-4 border-b border-slate-100 justify-between items-end">
                        <div>
                            <h2 className="text-xl font-black text-blue-800 uppercase tracking-widest">Formal Analysis Report</h2>
                            <p className="text-sm text-slate-500 font-bold">Solicitor: <span className="text-blue-600">{data.solicitorName}</span></p>
                            <p className="text-xs text-slate-400">System ID: {reportId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Analysis Date & Time (Contemporaneous)</p>
                            <p className="text-[10px] text-blue-600 font-mono">{analysisTimestamp} Atlantic Standard Time (AST)</p>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-4 border-blue-600 inline-block">1. Opportunity Analysis</h2>
                            <OpportunityAnalyzerTab data={data} />
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-4 border-indigo-600 inline-block">2. Salary Benchmarks & Market Scoring</h2>
                            <SalaryBenchmarksTab data={data} />
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-4 border-teal-600 inline-block">3. Technical Onboarding Plan</h2>
                            <OnboardingPlanTab data={data} />
                        </section>
                        <section>
                            <h2 className="text-2xl font-bold text-slate-800 mb-6 pb-2 border-b-4 border-red-600 inline-block">4. Expert CV Critique & Gap Analysis</h2>
                            <CVAnalysisTab data={data} forceUnlock={true} />
                        </section>
                    </div>

                    <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between items-center opacity-50">
                        <p className="text-[10px] text-slate-400 italic">This comprehensive document is electronically generated and attributed to the current session. ALCOA+ Compliant.</p>
                        <p className="text-[10px] font-bold text-slate-500">Generated by PharmaPace PR for {data.solicitorName}</p>
                    </div>
                </div>
            </div>

            {/* Unified Compliance Header */}
            <div className="bg-slate-50 border-b px-8 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded tracking-tighter uppercase">Active Analysis</span>
                    <h2 className="text-sm font-bold text-slate-700 truncate max-w-[200px] md:max-w-md">{data.companyIntelligence.name} Report for {data.solicitorName}</h2>
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase tracking-wider">
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold hidden md:inline">ALCOA+</span>
                    <span>Contemporaneous: {analysisTimestamp} (AST)</span>
                </div>
            </div>

            <div ref={reportContentRef} className="bg-white flex-grow">
                 <div className="p-4 md:p-8">
                    {renderTabContent()}
                 </div>
            </div>

            <div className="p-8 border-t flex flex-col md:flex-row items-center justify-center gap-4 text-center bg-slate-50 rounded-b-2xl">
                 <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="w-full md:w-auto bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait shadow-lg"
                 >
                    <Download className="w-5 h-5" />
                    {isDownloading ? 'Assembling Full Report...' : 'Download Full Compliance Report (PDF)'}
                </button>
                 <button 
                    onClick={onReset} 
                    className="w-full md:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className="w-5 h-5" />
                    Start New Analysis
                </button>
            </div>
        </div>
    );
};
