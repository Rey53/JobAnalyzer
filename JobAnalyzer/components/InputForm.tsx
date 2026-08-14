import React, { useRef, useState } from 'react';
import type { ChangeEvent, FormEvent, RefObject } from 'react';
import { ArrowRight, FileText, Fuel, Landmark, ReceiptText, UploadCloud, X, Zap } from 'lucide-react';
import { pharmaCompanies, municipalities, jobTitles, modalities } from '../constants';
import type { FormData } from '../types';
import { BENCHMARKS } from '../utils/prData';

interface InputFormProps {
    onAnalyze: (formData: FormData) => void;
    isDarkMode?: boolean;
}

const money = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
});

const FieldLabel = ({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) => (
    <span className={`mb-1.5 block text-sm font-semibold ${dark ? 'text-slate-200' : 'text-ink'}`}>{children}</span>
);

const SelectInput = ({ label, name, value, onChange, options, dark = false }: {
    label: string;
    name: string;
    value: string;
    onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
    options: string[];
    dark?: boolean;
}) => (
    <label className="block">
        <FieldLabel dark={dark}>{label}</FieldLabel>
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={`w-full rounded-xl border px-3.5 py-3 text-sm font-medium shadow-sm transition focus:border-reef focus:ring-2 focus:ring-reef/20 ${dark ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-ink'}`}
        >
            {options.map(option => <option key={option} value={option}>{option}</option>)}
        </select>
    </label>
);

const FileDrop = ({ label, description, fileName, inputRef, required, onChange, onClear, dark = false }: {
    label: string;
    description: string;
    fileName: string | null;
    inputRef: RefObject<HTMLInputElement | null>;
    required?: boolean;
    onChange: (event: ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
    dark?: boolean;
}) => (
    <div>
        <FieldLabel dark={dark}>{label}{required ? ' *' : ''}</FieldLabel>
        {fileName ? (
            <div className="flex min-h-24 items-center justify-between gap-4 rounded-2xl border border-reef/30 bg-[#edf9f7] p-4">
                <div className="flex min-w-0 items-center gap-3">
                    <span className="rounded-xl bg-white p-2.5 text-mangrove shadow-sm"><FileText size={22} /></span>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-ink">{fileName}</p>
                        <p className="text-xs text-slate-500">Ready for analysis</p>
                    </div>
                </div>
                <button type="button" onClick={onClear} className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-red-600" aria-label={`Remove ${fileName}`}>
                    <X size={18} />
                </button>
            </div>
        ) : (
            <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="group flex min-h-24 w-full items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-left transition hover:border-reef hover:bg-[#f2fbfa]"
            >
                <span className="rounded-xl border border-slate-200 bg-white p-2.5 text-atlantic shadow-sm transition group-hover:border-reef/30 group-hover:text-mangrove"><UploadCloud size={22} /></span>
                <span>
                    <span className="block text-sm font-semibold text-ink">Choose a document</span>
                    <span className="mt-0.5 block text-xs text-slate-500">{description}</span>
                </span>
            </button>
        )}
        <input ref={inputRef} type="file" onChange={onChange} className="hidden" accept=".pdf,.doc,.docx,.txt" required={required} />
    </div>
);

export const InputForm: React.FC<InputFormProps> = ({ onAnalyze, isDarkMode = false }) => {
    const [formData, setFormData] = useState<FormData>({
        solicitorName: '',
        company: pharmaCompanies[0],
        jobTitle: jobTitles[0],
        livingIn: 'San Juan',
        workingIn: 'Barceloneta',
        salary: 70000,
        modality: modalities[0],
        cvFile: null,
        jobDescriptionFile: null,
    });
    const [fileName, setFileName] = useState<string | null>(null);
    const [jdFileName, setJdFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const jdFileInputRef = useRef<HTMLInputElement>(null);

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target;
        setFormData(previous => ({ ...previous, [name]: name === 'salary' ? Number(value) : value }));
    };

    const setFile = (key: 'cvFile' | 'jobDescriptionFile', file: File | null) => {
        setFormData(previous => ({ ...previous, [key]: file }));
        if (key === 'cvFile') setFileName(file?.name ?? null);
        else setJdFileName(file?.name ?? null);
    };

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        onAnalyze(formData);
    };

    const w2Equivalent = formData.modality === 'W2' ? formData.salary : Math.round(formData.salary / (formData.modality === '1099' ? 1.30 : 1.25));
    const equivalents = {
        W2: w2Equivalent,
        '1099': formData.modality === '1099' ? formData.salary : Math.round(w2Equivalent * 1.30),
        '480': formData.modality === '480' ? formData.salary : Math.round(w2Equivalent * 1.25),
    };

    const surface = isDarkMode ? 'bg-slate-900 text-white' : 'bg-white text-ink';
    const panel = isDarkMode ? 'border-slate-700 bg-slate-800/70' : 'border-mist bg-shell/70';

    return (
        <form onSubmit={handleSubmit} className={`enter-rise ${surface}`}>
            <section className={`grid gap-8 border-b p-6 sm:p-8 lg:grid-cols-[0.78fr_1.22fr] lg:p-10 ${isDarkMode ? 'border-slate-700' : 'border-mist'}`}>
                <div className="max-w-xl">
                    <p className="font-data text-[11px] font-semibold uppercase tracking-[0.18em] text-mangrove">Decision brief</p>
                    <h2 className="mt-3 font-display text-3xl font-semibold tracking-[-0.035em] sm:text-4xl">Start with what the offer leaves out.</h2>
                    <p className={`mt-4 leading-relaxed ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                        Add the role, route, compensation structure, and documents. The report separates verified public inputs from recruiter estimates.
                    </p>
                </div>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {[
                        { icon: Fuel, label: 'Regular gas', value: BENCHMARKS.gasPriceRange, note: BENCHMARKS.gasPriceAsOf },
                        { icon: Zap, label: 'Residential power', value: `$${BENCHMARKS.lumaRate.toFixed(5)}/kWh`, note: BENCHMARKS.lumaRateAsOf },
                        { icon: ReceiptText, label: 'Services withholding', value: '10%', note: 'Hacienda general rule' },
                        { icon: Landmark, label: 'Self-employment tax', value: '15.3%', note: 'Social Security + Medicare' },
                    ].map(({ icon: Icon, label, value, note }) => (
                        <div key={label} className={`rounded-2xl border p-3.5 ${panel}`}>
                            <Icon size={18} className="text-mangrove" />
                            <p className={`mt-3 text-[10px] font-bold uppercase tracking-[0.12em] ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{label}</p>
                            <p className="mt-1 font-data text-sm font-semibold">{value}</p>
                            <p className={`mt-1 text-[10px] leading-tight ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{note}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1fr_0.72fr] lg:p-10">
                <div className="space-y-8">
                    <section>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="font-data text-xs font-semibold text-mangrove">01</span>
                            <h3 className="font-display text-xl font-semibold">Opportunity and route</h3>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <label className="block sm:col-span-2">
                                <FieldLabel dark={isDarkMode}>Your name</FieldLabel>
                                <input name="solicitorName" value={formData.solicitorName} onChange={handleChange} placeholder="e.g. Luis Reyes" required className={`w-full rounded-xl border px-3.5 py-3 text-sm shadow-sm focus:border-reef focus:ring-2 focus:ring-reef/20 ${isDarkMode ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-ink'}`} />
                            </label>
                            <SelectInput label="Target company" name="company" value={formData.company} onChange={handleChange} options={pharmaCompanies} dark={isDarkMode} />
                            <SelectInput label="Target role" name="jobTitle" value={formData.jobTitle} onChange={handleChange} options={jobTitles} dark={isDarkMode} />
                            <SelectInput label="Home municipality" name="livingIn" value={formData.livingIn} onChange={handleChange} options={municipalities} dark={isDarkMode} />
                            <SelectInput label="Work municipality" name="workingIn" value={formData.workingIn} onChange={handleChange} options={municipalities} dark={isDarkMode} />
                        </div>
                    </section>

                    <section>
                        <div className="mb-4 flex items-center gap-3">
                            <span className="font-data text-xs font-semibold text-mangrove">02</span>
                            <h3 className="font-display text-xl font-semibold">Offer structure</h3>
                        </div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <SelectInput label="Contract type" name="modality" value={formData.modality} onChange={handleChange} options={modalities} dark={isDarkMode} />
                            <label className="block">
                                <FieldLabel dark={isDarkMode}>Annual compensation</FieldLabel>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 font-data text-sm text-slate-500">$</span>
                                    <input type="number" name="salary" min="0" step="500" value={formData.salary} onChange={handleChange} required className={`w-full rounded-xl border py-3 pl-8 pr-16 text-sm font-semibold shadow-sm focus:border-reef focus:ring-2 focus:ring-reef/20 ${isDarkMode ? 'border-slate-600 bg-slate-800 text-white' : 'border-slate-300 bg-white text-ink'}`} />
                                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-xs text-slate-500">/ year</span>
                                </div>
                            </label>
                        </div>
                        <div className={`mt-4 rounded-2xl border p-4 ${panel}`}>
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-mangrove">Planning equivalents</p>
                                <p className="text-[10px] text-slate-500">Not a tax calculation</p>
                            </div>
                            <div className="grid grid-cols-3 divide-x divide-slate-200">
                                {Object.entries(equivalents).map(([label, value]) => (
                                    <div key={label} className="px-2 first:pl-0 last:pr-0">
                                        <p className="text-[10px] font-bold uppercase text-slate-500">{label}</p>
                                        <p className="mt-1 font-data text-sm font-semibold sm:text-base">{money.format(value)}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>

                <aside className={`rounded-3xl border p-5 sm:p-6 ${panel}`}>
                    <div className="mb-5 flex items-center gap-3">
                        <span className="font-data text-xs font-semibold text-mangrove">03</span>
                        <div>
                            <h3 className="font-display text-xl font-semibold">Evidence</h3>
                            <p className="mt-0.5 text-xs text-slate-500">Documents improve fit accuracy.</p>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <FileDrop
                            label="CV or résumé"
                            description="PDF, DOCX, or TXT"
                            fileName={fileName}
                            inputRef={fileInputRef}
                            required
                            dark={isDarkMode}
                            onChange={event => setFile('cvFile', event.target.files?.[0] ?? null)}
                            onClear={() => { setFile('cvFile', null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                        />
                        <FileDrop
                            label="Job description"
                            description="Optional, but recommended"
                            fileName={jdFileName}
                            inputRef={jdFileInputRef}
                            dark={isDarkMode}
                            onChange={event => setFile('jobDescriptionFile', event.target.files?.[0] ?? null)}
                            onClear={() => { setFile('jobDescriptionFile', null); if (jdFileInputRef.current) jdFileInputRef.current.value = ''; }}
                        />
                    </div>
                    <button type="submit" className="mt-6 flex w-full items-center justify-between rounded-2xl bg-ink px-5 py-4 text-left text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-atlantic">
                        <span>
                            <span className="block font-display text-base font-semibold">Analyze this opportunity</span>
                            <span className="mt-0.5 block text-xs text-slate-300">Compensation · route · CV fit</span>
                        </span>
                        <ArrowRight size={21} />
                    </button>
                    <p className="mt-3 text-center text-[11px] leading-relaxed text-slate-500">Your access is protected by Sign in with ChatGPT. Review uploaded-document handling before using sensitive personal data.</p>
                </aside>
            </div>

            <div className={`flex flex-wrap items-center justify-between gap-3 border-t px-6 py-4 text-[11px] sm:px-10 ${isDarkMode ? 'border-slate-700 bg-slate-950 text-slate-400' : 'border-mist bg-shell text-slate-500'}`}>
                <span>Public inputs checked against DACO, PREB, Hacienda, and IRS sources.</span>
                <span className="font-data">Benchmark set · 2026-Q3</span>
            </div>
        </form>
    );
};
