import React from 'react';

export const Footer: React.FC = () => {
    const linkedInLogo = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAeCAYAAAA7MK6iAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIaSURBVFhH7ZfNTuNAEIb/wQMKRAyIGB2xISFGTEgMXvB/ABJbLAgJ1YQEK2LEiBAbsscuu33Z3Zn5ZGc/kO1kSTszO/O2OzM7s1y8e/c+8IvsS2g1fJc4i/h+PzO8T5+k0P/gN4SgCMvT49I1mZ0c2b29/c0QoE31f+1CgJ4v1q5v/8LwA8sSgC8rLwA4P3kKQCgBCCtPjgC4BIAKQCgBMC1AEYAHAmAnAD+SADkAFwJQJcAHApwJAAaASgE4CjAlQA4EIAuAZQC8CBAuQB2BKAJgEcAkgK4I4A7ArgcgAsBLAKQCmBBAFcExoMAHAiQCgA4EHAmgKMAHAgAKcBZAJ4E4EqAYwFIAXAmgEcA1gKQBODiAqwJABYAJAE4EgA/AZAEcCUAnwKcgwYcCUAGYFwAFgIgA/BKAHYEsCgARwKgA/BNAHcEsCeAWABEArggQCsAnwLcCGAiQCsApwKcCWAsgB0BXAzA3QA8A0A/AM8A6AFwJgCLAPQAeAZgTgAWAagDcCaA3gBMAgAHYCqARwI8AmBNAN4E4CgARwJ4IoDjAI4A4AHwIICbANwJ4DGAHAG+BOBNABcA/AvgKIBFAHwKsCqARQDcBPAFwKMAvghwIICrAIAC/BvgXgDBxLgDeCgAJwI8E4CjABwJ4EkA5wLQCfD/AXYEUCgAxwLQCuBNgDsCGA2gFIBf/D5v23bd/f8B/V1pBJA5WfAAAAAASUVORKCYII=';

    return (
        <footer className="mt-8 text-center text-gray-500 text-sm">
            <p>Data sources: AI-generated estimations based on public data from US Bureau of Labor Statistics, Glassdoor, and other real estate/commute APIs.</p>
            <div className="mt-2 flex items-center justify-center gap-2">
                 <p>PharmaPacePR by <a href="https://www.servicioxpert.com" target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline">ServicioXpert.com</a> | All data is for illustrative purposes.</p>
                 <a href="https://www.linkedin.com/in/servicioxpert" target="_blank" rel="noopener noreferrer" className="inline-block hover:opacity-75 transition-opacity">
                    <img src={linkedInLogo} alt="LinkedIn" className="w-5 h-5"/>
                </a>
            </div>
        </footer>
    );
};