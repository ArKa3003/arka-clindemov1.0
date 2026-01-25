// src/components/AlternativesList.tsx
'use client';

import { Alternative, ClinicalScenario } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { clsx } from 'clsx';

interface AlternativesListProps {
  alternatives: Alternative[];
  currentProcedure: string;
  scenario: ClinicalScenario;
  onSwitchToAlternative?: (alternative: Alternative) => void;
}

export function AlternativesList({
  alternatives,
  currentProcedure,
  scenario,
  onSwitchToAlternative,
}: AlternativesListProps) {
  if (alternatives.length === 0) {
    return null;
  }

  return (
    <Card className="transition-all duration-200 animate-in fade-in">
      <CardHeader>
        <CardTitle>Alternative Recommendations</CardTitle>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <p className="text-base text-gray-600 mb-4">
          Based on AIIE evidence-based methodology, consider these alternatives to{' '}
          <strong>{currentProcedure}</strong>:
        </p>
        <div className="space-y-4">
          {alternatives.map((alt, index) => (
            <AlternativeItem
              key={index}
              alternative={alt}
              rank={index + 1}
              onSwitch={() => onSwitchToAlternative?.(alt)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AlternativeItem({
  alternative,
  rank,
  onSwitch,
}: {
  alternative: Alternative;
  rank: number;
  onSwitch?: () => void;
}) {
  const scoreColor =
    alternative.rating >= 7
      ? 'success'
      : alternative.rating >= 4
        ? 'warning'
        : 'error';

  return (
    <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 transition-all duration-200 hover:shadow-md hover:border-gray-300">
      <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
        {/* Rank */}
        <div className="flex-shrink-0 flex items-center justify-center w-10 h-10 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
          {rank}
        </div>
        {/* Content */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
            <h4 className="font-medium text-gray-900 text-base">{alternative.procedure}</h4>
            <div className="self-start sm:self-center">
              <Badge variant={scoreColor} size="sm">
                {alternative.rating}/9
              </Badge>
            </div>
          </div>
          <p className="text-base text-gray-600 mb-3">{alternative.reasoning}</p>
          {/* Comparison Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            <ComparisonTag
              label="Cost"
              value={alternative.costComparison}
              positiveValue="lower"
            />
            <ComparisonTag
              label="Radiation"
              value={alternative.radiationComparison}
              positiveValue="lower"
              neutralValue="none"
            />
          </div>
          {/* Switch Button */}
          {onSwitch && (
            <Button
              onClick={onSwitch}
              variant="outline"
              size="sm"
              className="w-full sm:w-auto min-h-[44px]"
            >
              Switch to this order
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function ComparisonTag({
  label,
  value,
  positiveValue,
  neutralValue,
}: {
  label: string;
  value: string;
  positiveValue: string;
  neutralValue?: string;
}) {
  const isPositive = value === positiveValue || value === neutralValue;
  const isNeutral = value === 'similar' || value === neutralValue;

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-sm',
        isPositive && 'bg-green-100 text-green-700',
        isNeutral && !isPositive && 'bg-gray-100 text-gray-600',
        !isPositive && !isNeutral && 'bg-orange-100 text-orange-700'
      )}
    >
      {isPositive && value !== neutralValue && '↓'}
      {!isPositive && !isNeutral && '↑'}
      {label}: {value === 'none' ? 'None' : value}
    </span>
  );
}

