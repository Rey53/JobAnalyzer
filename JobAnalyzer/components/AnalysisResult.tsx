
import React, { useState, useRef } from 'react';
import type { AnalysisData } from '../types';
import { OpportunityAnalyzerTab } from './tabs/OpportunityAnalyzerTab';
import { SalaryBenchmarksTab } from './tabs/SalaryBenchmarksTab';
import { OnboardingPlanTab } from './tabs/OnboardingPlanTab';
import { Download, RefreshCw, Briefcase, DollarSign, CalendarCheck } from 'lucide-react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


interface AnalysisResultProps {
    data: AnalysisData;
    onReset: () => void;
}

type Tab = 'analyzer' | 'benchmarks' | 'onboarding';

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ data, onReset }) => {
    const [activeTab, setActiveTab] = useState<Tab>('analyzer');
    const [isDownloading, setIsDownloading] = useState(false);
    const reportContentRef = useRef<HTMLDivElement>(null);

    const handleDownloadPdf = async () => {
        if (!reportContentRef.current) return;
        setIsDownloading(true);

        try {
            const canvas = await html2canvas(reportContentRef.current, {
                scale: 2,
                windowWidth: reportContentRef.current.scrollWidth,
                windowHeight: reportContentRef.current.scrollHeight,
                useCORS: true,
            });
            
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: [canvas.width, canvas.height],
                hotfixes: ['px_scaling'],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save('PharmaPacePR_Report.pdf');

        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Sorry, there was an error generating the PDF. Please try again.");
        } finally {
            setIsDownloading(false);
        }
    };


    const renderTabContent = () => {
        switch (activeTab) {
            case 'analyzer':
                return <OpportunityAnalyzerTab data={data} />;
            case 'benchmarks':
                return <SalaryBenchmarksTab data={data} />;
            case 'onboarding':
                return <OnboardingPlanTab data={data} />;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{id: Tab, label: string, icon: React.ReactNode}> = ({id, label, icon}) => {
        const isActive = activeTab === id;
        return (
             <button 
                onClick={() => setActiveTab(id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-t font-medium transition-all ${isActive ? 'bg-white text-blue-700 shadow-md border-t-2 border-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
             >
                {icon} {label}
            </button>
        )
    }

    const analysisTimestamp = new Date().toLocaleString('en-US', {
        timeZone: 'America/Puerto_Rico',
        dateStyle: 'full',
        timeStyle: 'medium'
    });

    return (
        <div>
            <div className="border-b bg-gray-50 flex flex-wrap items-center justify-between pr-4">
                <div className="flex gap-1 p-2">
                   <TabButton id="analyzer" label="Opportunity Analyzer" icon={<Briefcase size={18}/>} />
                   <TabButton id="benchmarks" label="Salary Benchmarks" icon={<DollarSign size={18}/>} />
                   <TabButton id="onboarding" label="Onboarding Plan" icon={<CalendarCheck size={18}/>} />
                </div>
                <div className="text-[10px] text-slate-400 font-mono flex items-center gap-1 uppercase tracking-wider hidden md:flex">
                    <span className="bg-slate-200 px-1.5 py-0.5 rounded text-slate-600 font-bold">ALCOA+</span>
                    <span>Contemporaneous: {analysisTimestamp} (AST)</span>
                </div>
            </div>

            <div ref={reportContentRef} className="bg-white">
                 <div className="p-4 md:p-8">
                    {/* Compliance Header for PDF */}
                    <div className="mb-6 pb-4 border-b border-slate-100 flex justify-between items-end">
                        <div>
                            <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Formal Analysis Report</h2>
                            <p className="text-xs text-slate-400">System ID: PP-PR-{data.companyIntelligence.name.substring(0,3).toUpperCase()}-{Date.now().toString().slice(-6)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold text-slate-500 uppercase">Analysis Date & Time (Contemporaneous)</p>
                            <p className="text-[10px] text-blue-600 font-mono">{analysisTimestamp} Atlantic Standard Time</p>
                        </div>
                    </div>

                    {renderTabContent()}
                    
                    {/* Compliance Footer for PDF */}
                    <div className="mt-12 pt-4 border-t border-slate-100 flex justify-between items-center opacity-50 grayscale">
                        <p className="text-[9px] text-slate-400 italic">This document is electronically generated and attributed to the current session. Verification of data accuracy is required per GAMP5 standards.</p>
                        <p className="text-[9px] font-bold text-slate-500">© ServicioXpert.com • Data Integrity Secured</p>
                    </div>
                 </div>
            </div>

            <div className="p-8 border-t flex flex-col md:flex-row items-center justify-center gap-4 text-center bg-slate-50">
                 <button 
                    onClick={handleDownloadPdf}
                    disabled={isDownloading}
                    className="w-full md:w-auto bg-gray-800 text-white px-8 py-3 rounded-lg font-semibold hover:bg-gray-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-wait shadow-lg"
                 >
                    <Download className="w-5 h-5" />
                    {isDownloading ? 'Generating Secure PDF...' : 'Download Full Compliance Report (PDF)'}
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
