
import React, { useState, useRef } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { pharmaCompanies, municipalities, jobTitles } from '../constants';
import type { FormData } from '../types';
import { UploadCloud, FileText, X } from 'lucide-react';

interface InputFormProps {
    onAnalyze: (formData: FormData) => void;
}

const SelectInput: React.FC<{ label: string; name: string; value: string; onChange: (e: ChangeEvent<HTMLSelectElement>) => void; options: string[] }> = ({ label, name, value, onChange, options }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <select name={name} value={value} onChange={onChange} className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
    </div>
);

const NumberInput: React.FC<{ label: string; name: string; value: number; onChange: (e: ChangeEvent<HTMLInputElement>) => void; }> = ({ label, name, value, onChange }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
            <input type="number" name={name} value={value} onChange={onChange} className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" placeholder="70000" />
            <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">/ year</span>
        </div>
    </div>
);


export const InputForm: React.FC<InputFormProps> = ({ onAnalyze }) => {
    const [formData, setFormData] = useState<FormData>({
        solicitorName: '',
        company: pharmaCompanies[0],
        jobTitle: jobTitles[0],
        livingIn: 'San Juan',
        workingIn: 'Barceloneta',
        salary: 70000,
        cvFile: null,
    });
    const [fileName, setFileName] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

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

    const handleFileClear = () => {
        setFormData(prev => ({ ...prev, cvFile: null }));
        setFileName(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onAnalyze(formData);
    };
    
    return (
        <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Enter Opportunity Details</h2>
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200">
                <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name of the Solicitor</label>
                        <input 
                            type="text" 
                            name="solicitorName" 
                            value={formData.solicitorName} 
                            onChange={handleChange} 
                            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>
                    <SelectInput label="Target Company" name="company" value={formData.company} onChange={handleChange} options={pharmaCompanies} />
                    <SelectInput label="Job Title" name="jobTitle" value={formData.jobTitle} onChange={handleChange} options={jobTitles} />
                    <SelectInput label="Living In (Home Municipality)" name="livingIn" value={formData.livingIn} onChange={handleChange} options={municipalities} />
                    <SelectInput label="Working In (Work Municipality)" name="workingIn" value={formData.workingIn} onChange={handleChange} options={municipalities} />

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Offered Salary</label>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                                <input 
                                    type="number" 
                                    name="salary" 
                                    value={formData.salary} 
                                    onChange={(e) => {
                                        const annualValue = Number(e.target.value);
                                        setFormData(prev => ({ ...prev, salary: annualValue }));
                                    }}
                                    className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                    placeholder="70000" 
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">/ year</span>
                            </div>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500">$</span>
                                <input 
                                    type="number" 
                                    value={Math.round((formData.salary / 2080) * 100) / 100}
                                    onChange={(e) => {
                                        const hourlyValue = Number(e.target.value);
                                        const annualValue = Math.round(hourlyValue * 2080);
                                        setFormData(prev => ({ ...prev, salary: annualValue }));
                                    }}
                                    className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                    placeholder="33.65" 
                                    step="0.01"
                                />
                                <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 text-sm">/ hour</span>
                            </div>
                        </div>
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
                                <input ref={fileInputRef} type="file" name="cvFile" onChange={handleFileChange} className="sr-only" accept=".pdf,.doc,.docx,.txt" required />
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
