
import React from 'react';
import { HelpCircle, BookOpen, MessageSquare, Info, ShieldCheck, Zap } from 'lucide-react';

export const InstructionsView: React.FC = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto space-y-12 pb-24">
            <div className="text-center space-y-4">
                <div className="inline-flex items-center justify-center p-3 bg-blue-100 rounded-2xl mb-2">
                    <HelpCircle className="w-10 h-10 text-blue-600" />
                </div>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">System Guide & FAQ</h2>
                <p className="text-slate-500 text-lg">Understanding the PharmaPace PR analytical framework.</p>
            </div>

            {/* Quick Start */}
            <section className="grid md:grid-cols-2 gap-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <Zap className="w-6 h-6 text-yellow-500" />
                        <h3 className="font-bold text-xl text-slate-800">How it works</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        PharmaPace uses **Gemini 1.5 Pro** to cross-reference your CV against the specific requirements of the PR Pharma industry. It calculates commute costs, utility impact, and market benchmarks to give you a "Fair Market Scoreboard."
                    </p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck className="w-6 h-6 text-green-500" />
                        <h3 className="font-bold text-xl text-slate-800">ALCOA+ Compliance</h3>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Every report is generated using FDA Data Integrity principles. This means your data is <strong>Attributable, Legible, Contemporaneous, Original, and Accurate</strong>. Perfect for formal recruiter presentations.
                    </p>
                </div>
            </section>

            {/* Detailed FAQ */}
            <div className="space-y-6">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                    Frequently Asked Questions
                </h3>
                
                <div className="space-y-4">
                    <FAQItem 
                        question="Why is there a difference between the 'Offer' and the 'Recommended' salary?"
                        answer="The 'Recommended' targets at the top are AI-calculated based on current PR market scarcity and your specific fit score. The 'Offer' at the bottom is simply a mathematical conversion of what the company initially proposed. The 'Gap' between them is your negotiation leverage."
                    />
                    <FAQItem 
                        question="What is the 'LUMA Delta'?"
                        answer="Puerto Rico has higher residential energy costs ($0.33/kWh) than many areas. The LUMA Delta reflects how this specific local cost impacts your actual take-home purchasing power."
                    />
                    <FAQItem 
                        question="How are 1099 and 480 equivalent rates calculated?"
                        answer="We apply localized tax logic for Puerto Rico. For 1099, we account for the 15.3% Self-Employment tax. For Form 480, we factor in the standard 10% withholding and lack of employer-paid benefits to show what you 'really' need to earn to match a W2 offer."
                    />
                    <FAQItem 
                        question="Why are distances in miles?"
                        answer="While PR signs use KM, business logistics and vehicle calculations in the US/PR industrial sector standardized on Miles for annual depreciation and fuel efficiency reporting."
                    />
                </div>
            </div>

            {/* Support/Footer */}
            <div className="bg-slate-900 text-white rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
                <div className="relative z-10">
                    <h4 className="text-xl font-bold mb-2">Need a custom validation dashboard?</h4>
                    <p className="text-slate-400 text-sm">Contact ServicioXpert for specialized Pharma compliance solutions.</p>
                </div>
                <button className="relative z-10 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap">
                    Request Consultation
                </button>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <MessageSquare className="w-48 h-48 -mr-12 -mt-12" />
                </div>
            </div>
        </div>
    );
};

const FAQItem = ({ question, answer }: { question: string; answer: string }) => (
    <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 hover:bg-white transition-colors">
        <h4 className="font-bold text-slate-800 mb-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-400 mt-1 shrink-0" />
            {question}
        </h4>
        <p className="text-slate-600 text-sm leading-relaxed ml-6">{answer}</p>
    </div>
);
