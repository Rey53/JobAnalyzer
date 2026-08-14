import React from 'react';
import { FlaskConical, LockKeyhole, MapPinned, ShieldCheck } from 'lucide-react';

const corridorStops = ['Metro', 'Barceloneta', 'Juncos', 'Humacao'];

export const Header: React.FC<{ hostedAuth?: boolean }> = ({ hostedAuth = false }) => (
    <header className="relative flex-1 overflow-hidden rounded-3xl bg-ink text-white shadow-tide">
        <div className="paper-grid absolute inset-0 opacity-20" aria-hidden="true" />
        <div className="relative grid gap-7 p-6 sm:p-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:p-10">
            <div className="enter-rise max-w-3xl">
                <div className="mb-5 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 font-data text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-100">
                        <FlaskConical size={14} /> Pharma opportunity intelligence
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-mangrove/70 px-3 py-1.5 text-xs font-semibold text-white">
                        <LockKeyhole size={13} /> {hostedAuth ? 'ChatGPT sign-in protected' : 'Authenticated session'}
                    </span>
                </div>
                <h1 className="font-display text-4xl font-semibold leading-[0.98] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
                    Read the offer.<br />
                    <span className="text-[#8bd9d2]">See the whole move.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
                    Compare compensation, commute, contract structure, and CV fit for Puerto Rico’s regulated life-sciences corridor.
                </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-5 backdrop-blur-sm">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <div>
                        <p className="font-data text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Industrial corridor</p>
                        <p className="mt-1 font-display text-lg font-semibold">PR life-sciences route</p>
                    </div>
                    <MapPinned className="text-coqui" size={25} />
                </div>
                <div className="relative">
                    <div className="corridor-line absolute left-2 right-2 top-2 h-0.5" aria-hidden="true" />
                    <div className="relative flex justify-between gap-2">
                        {corridorStops.map((stop, index) => (
                            <div key={stop} className="flex max-w-[6rem] flex-col items-center text-center">
                                <span className={`h-4 w-4 rounded-full border-[3px] border-ink ${index === 0 ? 'bg-coqui' : 'bg-reef'}`} />
                                <span className="mt-2 text-[11px] font-semibold text-slate-300">{stop}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="mt-5 flex items-start gap-2 border-t border-white/10 pt-4 text-xs leading-relaxed text-slate-400">
                    <ShieldCheck className="mt-0.5 shrink-0 text-[#8bd9d2]" size={15} />
                    Dated public inputs are separated from planning estimates in every report.
                </div>
            </div>
        </div>
    </header>
);
