
import React, { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { pharmaCompanies, municipalities, jobTitles, modalities } from '../constants';
import type { FormData } from '../types';
import { UploadCloud, FileText, X } from 'lucide-react';


interface InputFormProps {
    onAnalyze: (formData: FormData) => void;
    isDarkMode?: boolean;
}

const SelectInput: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: string[]; isDarkMode?: boolean }> = ({ label, name, value, onChange, options, isDarkMode = false }) => (
    <div className="font-serif">
        <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{label}</label>
        <select name={name} value={value} onChange={onChange} className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-serif font-medium ${isDarkMode ? 'bg-slate-100 border-gray-600 text-black' : 'bg-white border-gray-300 text-black'}`}>
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const NumberInput: React.FC<{ label: string; name: string; value: number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; isDarkMode?: boolean }> = ({ label, name, value, onChange, isDarkMode = false }) => (
    <div className="font-serif">
        <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-900'}`}>{label}</label>
        <div className="relative">
            <span className={`absolute inset-y-0 left-0 pl-3 flex items-center font-bold ${isDarkMode ? 'text-gray-900' : 'text-gray-500'}`}>$</span>
            <input type="number" name={name} value={value} onChange={onChange} className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-serif font-medium ${isDarkMode ? 'bg-slate-100 border-gray-600 text-black' : 'bg-white border-gray-300 text-black'}`} placeholder="70000" />
            <span className={`absolute inset-y-0 right-0 pr-3 flex items-center font-bold ${isDarkMode ? 'text-gray-900' : 'text-gray-500'}`}>/ year</span>
        </div>
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

    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'salary' ? Number(value) : value }));
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, cvFile: file }));
            setFileName(file.name);
        }
    };

    const handleJdFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setFormData(prev => ({ ...prev, jobDescriptionFile: file }));
            setJdFileName(file.name);
        }
    };

    const handleFileClear = () => {
        setFormData(prev => ({ ...prev, cvFile: null }));
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleJdFileClear = () => {
        setFormData(prev => ({ ...prev, jobDescriptionFile: null }));
        setJdFileName(null);
        if (jdFileInputRef.current) {
            jdFileInputRef.current.value = "";
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onAnalyze(formData);
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-8">
            <h2 className={`text-2xl font-bold mb-6 ${isDarkMode ? 'text-gray-100' : 'text-gray-800'}`}>Enter Opportunity Details</h2>
            <div className={`rounded-xl p-6 border-2 ${isDarkMode ? 'bg-gray-800/50 border-blue-500' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 font-serif">
                        <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Name of the Solicitor</label>
                        <input 
                            type="text" 
                            name="solicitorName" 
                            value={formData.solicitorName} 
                            onChange={handleChange} 
                            className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-serif font-medium ${isDarkMode ? 'bg-slate-100 border-gray-600 text-black' : 'bg-white border-gray-300 text-black'}`}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                    <SelectInput label="Target Company" name="company" value={formData.company} onChange={handleChange} options={pharmaCompanies} />
                    <SelectInput label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} options={jobTitles} />
                    <SelectInput label="Living In (Home Municipality)" name="livingIn" value={formData.livingIn} onChange={handleChange} options={municipalities} />
                    <SelectInput label="Working In (Work Municipality)" name="workingIn" value={formData.workingIn} onChange={handleChange} options={municipalities} />

                    <div className="md:col-span-2">
                         <SelectInput 
                            label="Employment Modality (Contract Type)" 
                            name="modality" 
                            value={formData.modality} 
                            onChange={handleChange} 
                            options={modalities} 
                        />
                        <p className="text-[10px] text-indigo-600 mt-1 italic">
                            * Selecting W2 assumes standard employee benefits. 1099/480 will calculate tax and benefit overhead adjustments.
                        </p>
                    </div>

                    <div className="md:col-span-2 font-serif">
                        <label className={`block text-sm font-bold mb-1 ${isDarkMode ? 'text-gray-100' : 'text-gray-700'}`}>Offered Salary (Based on {formData.modality})</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 pl-3 flex items-center font-bold ${isDarkMode ? 'text-gray-900' : 'text-gray-500'}`}>$</span>
                                <input 
                                    type="number" 
                                    name="salary" 
                                    value={formData.salary} 
                                    onChange={(e) => {
                                        const annualValue = Number(e.target.value);
                                        setFormData(prev => ({ ...prev, salary: annualValue }));
                                    }}
                                    className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-serif font-medium ${isDarkMode ? 'bg-slate-100 border-gray-600 text-black' : 'bg-white border-gray-300 text-black'}`} 
                                    placeholder="70000" 
                                />
                                <span className={`absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-sm ${isDarkMode ? 'text-gray-900' : 'text-gray-500'}`}>/ year</span>
                            </div>
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 pl-3 flex items-center font-bold ${isDarkMode ? 'text-gray-900' : 'text-gray-500'}`}>$</span>
                                <input 
                                    type="number" 
                                    value={Math.round((formData.salary / 2080) * 100) / 100}
                                    onChange={(e) => {
                                        const hourlyValue = Number(e.target.value);
                                        const annualValue = Math.round(hourlyValue * 2080);
                                        setFormData(prev => ({ ...prev, salary: annualValue }));
                                    }}
                                    className={`w-full pl-7 pr-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 font-serif font-medium ${isDarkMode ? 'bg-slate-100 border-gray-600 text-black' : 'bg-white border-gray-300 text-black'}`} 
                                    placeholder="33.65" 
                                    step="0.01"
                                />
                                <span className={`absolute inset-y-0 right-0 pr-3 flex items-center font-bold text-sm ${isDarkMode ? 'text-gray-900' : 'text-gray-500'}`}>/ hour</span>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2 bg-white/50 p-4 rounded-lg border border-indigo-100 mb-4">
                        <h4 className="text-xs font-bold text-indigo-800 uppercase mb-2">Live Market Equivalent Analysis</h4>
                        <div className="grid grid-cols-3 gap-2">
                            <div className={`p-2 rounded border ${formData.modality === 'W2' ? 'bg-blue-100 border-blue-300' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">W2 Basis</p>
                                <p className="text-sm font-bold text-gray-800">
                                    {formData.modality === 'W2' 
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary)
                                        : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary * 0.77)}
                                </p>
                            </div>
                            <div className={`p-2 rounded border ${formData.modality === '1099' ? 'bg-amber-100 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">1099 Equivalent</p>
                                <p className="text-sm font-bold text-gray-800">
                                    {formData.modality === '1099' 
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary)
                                        : formData.modality === 'W2'
                                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary * 1.3)
                                            : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary)}
                                </p>
                            </div>
                            <div className={`p-2 rounded border ${formData.modality === '480' ? 'bg-teal-100 border-teal-300' : 'bg-gray-50 border-gray-200 opacity-70'}`}>
                                <p className="text-[10px] font-bold text-gray-500 uppercase">480 Equivalent</p>
                                <p className="text-sm font-bold text-gray-800">
                                    {formData.modality === '480' 
                                        ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary)
                                        : formData.modality === 'W2'
                                            ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary * 1.25)
                                            : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(formData.salary * 0.95)}
                                </p>
                            </div>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-2 italic">
                            * Quick estimates for comparison. Full analysis will provide precise Puerto Rico tax and benefit breakdowns.
                        </p>
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload CV for Personalized Analysis</label>
                        {fileName ? (
                             <div className="flex items-center justify-between bg-white p-3 border border-gray-300 rounded-md shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-blue-600"/>
                                    <span className="font-medium text-gray-700">{fileName}</span>
                                </div>
                                <button type="button" onClick={handleFileClear} className="text-gray-500 hover:text-red-600">
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                        ) : (
                            <div 
                                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-indigo-400 cursor-pointer"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Click to upload or drag and drop
                                </span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    PDF, DOCX, or TXT
                                </span>
                        <input ref={fileInputRef} type="file" name="cvFile" onChange={handleFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt" required />
                            </div>
                        )}
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Upload Job Description (Optional but Recommended)</label>
                        {jdFileName ? (
                             <div className="flex items-center justify-between bg-white p-3 border border-gray-300 rounded-md shadow-sm">
                                <div className="flex items-center gap-3">
                                    <FileText className="w-6 h-6 text-indigo-600"/>
                                    <span className="font-medium text-gray-700">{jdFileName}</span>
                                </div>
                                <button type="button" onClick={handleJdFileClear} className="text-gray-500 hover:text-red-600">
                                    <X className="w-5 h-5"/>
                                </button>
                            </div>
                        ) : (
                            <div 
                                className="relative block w-full border-2 border-gray-300 border-dashed rounded-lg p-8 text-center hover:border-indigo-400 cursor-pointer bg-slate-50/50"
                                onClick={() => jdFileInputRef.current?.click()}
                            >
                                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                                <span className="mt-2 block text-sm font-medium text-gray-900">
                                    Click to upload Job Description
                                </span>
                                <span className="mt-1 block text-xs text-gray-500">
                                    PDF, DOCX, or TXT
                                </span>
                                <input ref={jdFileInputRef} type="file" name="jobDescriptionFile" onChange={handleJdFileChange} className="hidden" accept=".pdf,.doc,.docx,.txt" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-8 text-center">
                <button type="submit" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg text-lg flex items-center justify-center mx-auto gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-wand-sparkles"><path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L11.8 8.2a1.21 1.21 0 0 0 0 1.72l5.8 5.8a1.21 1.21 0 0 0 1.72 0l6.84-6.84a1.21 1.21 0 0 0 0-1.72Z"/><path d="m14 7 3 3"/><path d="M5 6v4"/><path d="M19 14v4"/><path d="M10 2v2"/><path d="M7 8H3"/><path d="M7 16H3"/><path d="M17 2v2"/><path d="M17 16h4"/></svg>
                    Run Smart Analysis
                </button>
            </div>
        </form>
    );
};
