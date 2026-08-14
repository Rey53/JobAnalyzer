import React from 'react';
import { ExternalLink, ShieldCheck } from 'lucide-react';
import { BENCHMARKS } from '../utils/prData';

export const Footer: React.FC = () => (
    <footer className="px-2 pb-6 pt-7 text-sm text-slate-500">
        <div className="flex flex-col justify-between gap-5 border-t border-slate-300/70 pt-5 md:flex-row md:items-start">
            <div className="max-w-2xl">
                <p className="flex items-center gap-2 font-semibold text-ink"><ShieldCheck size={16} className="text-mangrove" /> Decision support, not tax or financial advice.</p>
                <p className="mt-2 text-xs leading-relaxed">Salary, housing, commute time, tolls, and employer benefits may be estimates. Verify material decisions with the employer and qualified Puerto Rico professionals.</p>
            </div>
            <div className="md:text-right">
                <p className="font-data text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">Primary sources</p>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-2 md:justify-end">
                    {BENCHMARKS.sources.map(source => (
                        <a key={source.url} href={source.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold text-atlantic hover:text-mangrove hover:underline">
                            {source.label} <ExternalLink size={11} />
                        </a>
                    ))}
                </div>
                <p className="mt-3 text-xs">PharmaPace PR by <a href="https://www.servicioxpert.com" target="_blank" rel="noreferrer" className="font-semibold text-ink hover:underline">ServicioXpert</a></p>
            </div>
        </div>
    </footer>
);
