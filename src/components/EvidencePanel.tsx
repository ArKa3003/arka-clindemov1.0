// src/components/EvidencePanel.tsx
'use client';

import { EvaluationResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { clsx } from 'clsx';

interface EvidencePanelProps {
  result: EvaluationResult;
}

export function EvidencePanel({ result }: EvidencePanelProps) {
  const { warnings, evidenceLinks, matchedCriteria } = result;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Warnings */}
      {warnings.length > 0 && (
        <Card variant="bordered" className="transition-all duration-200 animate-in fade-in">
          <CardHeader>
            <CardTitle>Alerts & Warnings</CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            <div className="space-y-3">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className={clsx(
                    'p-3 rounded-lg border transition-all duration-200',
                    warning.severity === 'critical'
                      ? 'bg-red-50 border-red-200'
                      : warning.severity === 'warning'
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-blue-50 border-blue-200'
                  )}
                  role={warning.severity === 'critical' ? 'alert' : 'status'}
                  aria-live={warning.severity === 'critical' ? 'assertive' : 'polite'}
                >
                  <div className="flex items-start gap-2">
                    <Badge
                      variant={
                        warning.severity === 'critical'
                          ? 'error'
                          : warning.severity === 'warning'
                            ? 'warning'
                            : 'info'
                      }
                      size="sm"
                      aria-label={`${warning.severity} ${warning.type.replace('-', ' ')}`}
                    >
                      {warning.type.replace('-', ' ')}
                    </Badge>
                    <p className="text-base text-gray-700">{warning.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Evidence Links - CRITICAL FOR NON-DEVICE CDS */}
      <Card variant="bordered" className="transition-all duration-200 animate-in fade-in">
        <CardHeader>
          <CardTitle>
            Evidence & Guidelines
            <span className="ml-2 text-sm font-normal text-gray-500">
              (Independent review source)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <p className="text-base text-gray-600 mb-4">
            The following resources support this recommendation and allow you to
            independently verify the clinical basis:
          </p>
          <div className="space-y-2">
            {evidenceLinks.map((link, index) => (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 hover:border-gray-300 hover:shadow-sm transition-all duration-200 min-h-[44px]"
              >
                <span className="text-blue-600">
                  {link.type === 'guideline' && '📋'}
                  {link.type === 'study' && '📄'}
                  {link.type === 'recommendation' && '✓'}
                </span>
                <div className="flex-1">
                  <p className="text-base font-medium text-blue-600 hover:underline">
                    {link.title}
                  </p>
                  <p className="text-sm text-gray-500">{link.url}</p>
                </div>
                <span className="text-gray-400">→</span>
              </a>
            ))}
          </div>
          {/* Transparency Notice */}
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Transparency Notice:</strong> AIIE uses RAND/UCLA methodology with peer-reviewed evidence. 
              All scoring factors are transparent. You maintain complete authority over clinical decisions.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

