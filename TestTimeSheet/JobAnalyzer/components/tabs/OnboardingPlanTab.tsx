import React, { useState } from 'react';
import type { AnalysisData } from '../../types';
import { CalendarCheck, Check, ChevronDown, ChevronUp } from 'lucide-react';

interface TabProps {
    data: AnalysisData;
}

const OnboardingPhaseCard: React.FC<{ phase: string; title: string; tasks: string[]; isLast?: boolean }> = ({ phase, title, tasks, isLast = false }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="relative pl-24">
            <div className="absolute left-0 top-0 flex flex-col items-center h-full">
                <div className="flex-shrink-0 bg-green-500 text-white font-bold rounded-full w-16 h-16 flex items-center justify-center text-xl z-10 border-4 border-white">
                    {phase}
                </div>
                {!isLast && <div className="w-1 flex-grow bg-green-200"></div>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow-lg mb-8 cursor-pointer transition-all hover:bg-slate-50" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-lg text-gray-800 mb-2">{title}</h4>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </div>
                {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        {tasks && tasks.length > 0 ? (
                            <ul className="space-y-3">
                                {tasks.map((task, index) => (
                                    <li key={index} className="flex items-start gap-3 text-gray-700">
                                        <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                        <span>{task}</span>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500 italic text-sm">No specific tasks defined for this phase.</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};


export const OnboardingPlanTab: React.FC<TabProps> = ({ data }) => {
    const plan = data?.onboardingPlan || {};
    
    // Industry standard fallbacks in case AI fails to return tasks
    const fallbackTasks30 = [
        "Site-specific GMP & Safety Training (OSHA)",
        "LOTO (Lockout/Tagout) and Cleanroom gowning certification",
        "FDA 21 CFR Part 11 and Data Integrity core training",
        "Introduction to Site validation Master Plan (VMP)",
        "Establishing relationships with Quality and EHS departments"
    ];
    
    const fallbackTasks60 = [
        "Deep dive into specific line equipment/process (GAMP5)",
        "Assisting in protocol execution (IQ/OQ/PQ)",
        "SOP (Standard Operating Procedure) review and recursive training",
        "Change Control and Deviation management system access (TrackWise/Veeva)",
        "Initial project assignment with local supervisor"
    ];
    
    const fallbackTasks90 = [
        "Full ownership of assigned validation packages",
        "Lead small-scale change control boards",
        "Interaction with external vendors and contractors",
        "Audit readiness participation (Internal site audits)",
        "Final 90-day performance and compliance review"
    ];

    const days30 = plan.days30 || { title: 'First 30 Days', tasks: [] };
    const days60 = plan.days60 || { title: 'First 60 Days', tasks: [] };
    const days90 = plan.days90 || { title: 'First 90 Days', tasks: [] };

    const getTasks = (tasks: any, fallback: string[]) => {
        return Array.isArray(tasks) && tasks.length > 0 ? tasks : fallback;
    };

    return (
        <div className="space-y-6">
            <section className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border-2 border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <CalendarCheck className="w-6 h-6 text-green-600" />
                    Sample 30-60-90 Day Onboarding Plan
                </h3>
                <p className="text-gray-600 mb-6">Use this plan as a guide to hit the ground running and make a strong impact in your new role.</p>

                <div className="space-y-0 relative z-0">
                   <OnboardingPhaseCard phase="30" title={days30.title || 'First 30 Days'} tasks={getTasks(days30.tasks, fallbackTasks30)} />
                   <OnboardingPhaseCard phase="60" title={days60.title || 'First 60 Days'} tasks={getTasks(days60.tasks, fallbackTasks60)} />
                   <OnboardingPhaseCard phase="90" title={days90.title || 'First 90 Days'} tasks={getTasks(days90.tasks, fallbackTasks90)} isLast={true} />
                </div>
            </section>
        </div>
    );
};
