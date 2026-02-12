
import React from 'react';
import { Calendar, CheckCircle2, ShieldCheck, Briefcase } from 'lucide-react';

const OnboardingPhase: React.FC<{ day: string; title: string; tasks: string[] }> = ({ day, title, tasks }) => (
    <div className="relative pl-10 pb-8 last:pb-0">
        <div className="absolute left-0 top-0 bg-blue-100 p-2 rounded-full z-10">
            <Calendar className="w-5 h-5 text-blue-600" />
        </div>
        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-blue-100 last:hidden"></div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-blue-600 font-bold text-sm uppercase mb-1 block">Day {day}</span>
            <h4 className="text-xl font-bold text-slate-800 mb-4">{title}</h4>
            <ul className="space-y-3">
                {tasks.map((task, i) => (
                    <li key={i} className="flex items-start gap-3 text-slate-600 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 mt-1 shrink-0" />
                        {task}
                    </li>
                ))}
            </ul>
        </div>
    </div>
);

export const OnboardingView: React.FC = () => {
    return (
        <div className="p-8 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <ShieldCheck className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                <h2 className="text-3xl font-black text-slate-900 mb-2">PR Pharma Onboarding Guide</h2>
                <p className="text-slate-500 max-w-lg mx-auto">
                    Standard compliance-focused onboarding roadmap for technical roles in the Puerto Rico biopharmaceutical sector.
                </p>
            </div>

            <div className="space-y-4">
                <OnboardingPhase 
                    day="1-30" 
                    title="Compliance & Integration" 
                    tasks={[
                        "Site-specific GMP & Safety Training (OSHA)",
                        "LOTO (Lockout/Tagout) and Cleanroom gowning certification",
                        "FDA 21 CFR Part 11 and Data Integrity core training",
                        "Introduction to Site validation Master Plan (VMP)",
                        "Establishing relationships with Quality and EHS departments"
                    ]}
                />
                
                <OnboardingPhase 
                    day="31-60" 
                    title="Technical Specialization" 
                    tasks={[
                        "Deep dive into specific line equipment/process (GAMP5)",
                        "Assisting in protocol execution (IQ/OQ/PQ)",
                        "SOP (Standard Operating Procedure) review and recursive training",
                        "Change Control and Deviation management system access (TrackWise/Veeva)",
                        "Initial project assignment with local supervisor"
                    ]}
                />

                <OnboardingPhase 
                    day="61-90" 
                    title="Independent Execution" 
                    tasks={[
                        "Full ownership of assigned validation packages",
                        "Lead small-scale change control boards",
                        "Interaction with external vendors and contractors",
                        "Audit readiness participation (Internal site audits)",
                        "Final 90-day performance and compliance review"
                    ]}
                />
            </div>

            <div className="mt-12 bg-indigo-900 rounded-2xl p-8 text-white flex items-center gap-8 shadow-2xl overflow-hidden relative">
                <div className="relative z-10">
                    <h4 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Briefcase className="w-6 h-6" /> Expert Recruiter Tip
                    </h4>
                    <p className="text-indigo-200">
                        Most PR Pharma sites offer a "Sign-on Bonus" clawback period of 12-24 months. Ensure your onboarding checklist includes a full benefits enrollment within the first 30 days to maximize Act 60/68 tax incentives!
                    </p>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10">
                    <ShieldCheck className="w-64 h-64" />
                </div>
            </div>
        </div>
    );
};
