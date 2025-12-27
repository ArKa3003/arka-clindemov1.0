// src/components/AlternativesList.tsx
'use client';

import { Alternative } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { clsx } from 'clsx';

interface AlternativesListProps {
  alternatives: Alternative[];
  currentProcedure: string;
}

export function AlternativesList({
  alternatives,
  currentProcedure,
}: AlternativesListProps) {
  if (alternatives.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alternative Recommendations</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-4">
          Based on ACR Appropriateness Criteria, consider these alternatives to{' '}
          <strong>{currentProcedure}</strong>:
        </p>
        <div className="space-y-3">
          {alternatives.map((alt, index) => (
            <AlternativeItem key={index} alternative={alt} rank={index + 1} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AlternativeItem({
  alternative,
  rank,
}: {
  alternative: Alternative;
  rank: number;
}) {
  const scoreColor =
    alternative.rating >= 7
      ? 'success'
      : alternative.rating >= 4
        ? 'warning'
        : 'error';

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
      {/* Rank */}
      <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
        {rank}
      </div>
      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-gray-900">{alternative.procedure}</h4>
          <Badge variant={scoreColor} size="sm">
            {alternative.rating}/9
          </Badge>
        </div>
        <p className="text-sm text-gray-600 mb-2">{alternative.reasoning}</p>
        {/* Comparison Tags */}
        <div className="flex gap-2">
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
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs',
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

