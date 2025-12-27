// src/components/AppropriatenessScore.tsx
'use client';

import { EvaluationResult } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Badge } from './ui/Badge';
import { clsx } from 'clsx';

interface AppropriatenessScoreProps {
  result: EvaluationResult;
}

export function AppropriatenessScore({ result }: AppropriatenessScoreProps) {
  const { appropriatenessScore, trafficLight, matchedCriteria, reasoning } =
    result;

  return (
    <Card variant="elevated" className="overflow-hidden">
      {/* Traffic Light Header */}
      <div
        className={clsx(
          'p-6',
          trafficLight === 'green' && 'bg-green-50',
          trafficLight === 'yellow' && 'bg-yellow-50',
          trafficLight === 'red' && 'bg-red-50'
        )}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Appropriateness Assessment
            </h2>
            <p className="mt-1 text-gray-600">
              Based on ACR Appropriateness Criteria
            </p>
          </div>
          {/* Traffic Light Indicator */}
          <div className="flex items-center gap-4">
            <TrafficLightIndicator light={trafficLight} />
            <ScoreCircle score={appropriatenessScore.value} light={trafficLight} />
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        {/* Category Badge */}
        <div className="mb-4">
          <Badge
            variant={
              appropriatenessScore.category === 'usually-appropriate'
                ? 'success'
                : appropriatenessScore.category === 'may-be-appropriate'
                  ? 'warning'
                  : 'error'
            }
            size="md"
          >
            {appropriatenessScore.category === 'usually-appropriate' &&
              '✓ Usually Appropriate'}
            {appropriatenessScore.category === 'may-be-appropriate' &&
              '◐ May Be Appropriate'}
            {appropriatenessScore.category === 'usually-not-appropriate' &&
              '✗ Usually NOT Appropriate'}
          </Badge>
        </div>

        {/* Matched Criteria */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <h3 className="mb-2 font-semibold text-gray-900">
            Matched ACR Criteria
          </h3>
          <p className="text-sm text-gray-700">
            <strong>Topic:</strong> {matchedCriteria.topic}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Variant:</strong> {matchedCriteria.variant}
          </p>
          <p className="text-sm text-gray-700">
            <strong>Source:</strong> {matchedCriteria.source}
          </p>
        </div>

        {/* Reasoning - CRITICAL FOR NON-DEVICE CDS */}
        <div>
          <h3 className="mb-3 font-semibold text-gray-900">
            Clinical Reasoning
            <span className="ml-2 text-xs font-normal text-gray-500">
              (Transparent basis for recommendation)
            </span>
          </h3>
          <ul className="space-y-2">
            {reasoning.map((reason, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-gray-700"
              >
                <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-gray-400" />
                {reason}
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

// Traffic Light Indicator Component
function TrafficLightIndicator({
  light,
}: {
  light: 'green' | 'yellow' | 'red';
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-gray-800 p-2">
      <div
        className={clsx(
          'h-6 w-6 rounded-full transition-all',
          light === 'red'
            ? 'bg-red-500 shadow-lg shadow-red-500/50'
            : 'bg-gray-600'
        )}
      />
      <div
        className={clsx(
          'h-6 w-6 rounded-full transition-all',
          light === 'yellow'
            ? 'bg-yellow-400 shadow-lg shadow-yellow-400/50'
            : 'bg-gray-600'
        )}
      />
      <div
        className={clsx(
          'h-6 w-6 rounded-full transition-all',
          light === 'green'
            ? 'bg-green-500 shadow-lg shadow-green-500/50'
            : 'bg-gray-600'
        )}
      />
    </div>
  );
}

// Score Circle Component
function ScoreCircle({
  score,
  light,
}: {
  score: number;
  light: 'green' | 'yellow' | 'red';
}) {
  return (
    <div
      className={clsx(
        'flex h-20 w-20 items-center justify-center rounded-full border-4',
        light === 'green' && 'border-green-500 bg-green-100',
        light === 'yellow' && 'border-yellow-500 bg-yellow-100',
        light === 'red' && 'border-red-500 bg-red-100'
      )}
    >
      <div className="text-center">
        <span className="text-3xl font-bold">{score}</span>
        <span className="text-lg text-gray-500">/9</span>
      </div>
    </div>
  );
}

