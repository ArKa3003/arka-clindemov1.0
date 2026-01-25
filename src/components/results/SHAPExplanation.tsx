'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Lightbulb, BookOpen } from 'lucide-react';

interface Factor {
  name: string;
  value: string;
  contribution: number;
  direction: 'supports' | 'opposes' | 'neutral';
  explanation: string;
  evidenceCitation: string;
}

interface Props {
  factors: Factor[];
  baselineScore: number;
  finalScore: number;
}

export default function SHAPExplanation({ factors, baselineScore, finalScore }: Props) {
  const [expanded, setExpanded] = useState(true);
  const [showCitations, setShowCitations] = useState(false);

  const maxContribution = Math.max(...factors.map(f => Math.abs(f.contribution)), 1);

  return (
    <div className="bg-white border rounded-xl overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-6 py-4 flex items-center justify-between bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Lightbulb className="h-5 w-5 text-purple-600" />
          </div>
          <div className="text-left">
            <h3 className="font-semibold text-gray-900">Why This Score? (SHAP Explanation)</h3>
            <p className="text-sm text-gray-500">Transparent scoring - see exactly how each factor contributed</p>
          </div>
        </div>
        {expanded ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
      </button>

      {expanded && (
        <div className="p-6 space-y-6">
          {/* Score Calculation Summary */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <span className="text-gray-600">Baseline Score:</span>
            <span className="font-mono font-medium">{baselineScore.toFixed(1)}</span>
          </div>

          {/* Factor Bars */}
          <div className="space-y-4">
            {factors.map((factor, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-700">{factor.name}</span>
                  <span className={`font-mono ${
                    factor.contribution > 0 ? 'text-green-600' : 
                    factor.contribution < 0 ? 'text-red-600' : 'text-gray-500'
                  }`}>
                    {factor.contribution > 0 ? '+' : ''}{factor.contribution.toFixed(1)}
                  </span>
                </div>
                
                {/* Visual Bar */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-6 bg-gray-100 rounded relative overflow-hidden">
                    {/* Center line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gray-300" />
                    
                    {/* Contribution bar */}
                    <div
                      className={`absolute top-0 h-full rounded ${
                        factor.contribution > 0 
                          ? 'bg-green-500 left-1/2' 
                          : 'bg-red-500 right-1/2'
                      }`}
                      style={{
                        width: `${(Math.abs(factor.contribution) / maxContribution) * 50}%`,
                        ...(factor.contribution < 0 ? { right: '50%', left: 'auto' } : {})
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-24 truncate" title={factor.value}>
                    {factor.value}
                  </span>
                </div>
                
                {/* Explanation */}
                <p className="text-xs text-gray-500 mt-1">{factor.explanation}</p>
                
                {showCitations && (
                  <p className="text-xs text-blue-600 flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    {factor.evidenceCitation}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Final Score */}
          <div className="flex items-center justify-between p-3 bg-gray-900 text-white rounded-lg">
            <span>Final Score:</span>
            <span className="font-mono font-bold text-xl">{finalScore} / 9</span>
          </div>

          {/* Toggle Citations */}
          <button
            onClick={() => setShowCitations(!showCitations)}
            className="text-sm text-teal-600 hover:underline flex items-center gap-1"
          >
            <BookOpen className="h-4 w-4" />
            {showCitations ? 'Hide' : 'Show'} evidence citations
          </button>
          
          {/* Methodology Notice */}
          <p className="text-xs text-gray-500 pt-4 border-t">
            <strong>Note:</strong> These weights are derived from peer-reviewed medical literature. 
            AIIE is a proprietary methodology using RAND/UCLA + GRADE.
          </p>
        </div>
      )}
    </div>
  );
}
