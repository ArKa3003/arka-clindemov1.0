// src/components/IntegrationArchitecture.tsx
'use client';

import { X, ArrowRight, User, Database, MessageSquare, Monitor, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';

interface IntegrationArchitectureProps {
  isOpen: boolean;
  onClose: () => void;
}

export function IntegrationArchitecture({
  isOpen,
  onClose,
}: IntegrationArchitectureProps) {

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="integration-architecture-title"
    >
      <div
        className="bg-white rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2
            id="integration-architecture-title"
            className="text-2xl font-bold text-gray-900"
          >
            How ARKA Integrates with Your EHR
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close integration architecture modal"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Introduction */}
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
            <p className="text-base text-blue-800">
              <strong className="font-semibold">Note:</strong> This demo simulates the standalone ARKA service. 
              In production, this integrates seamlessly into the EHR ordering workflow.
            </p>
          </div>

          {/* Integration Flow Diagram */}
          <Card variant="bordered">
            <CardHeader>
              <CardTitle className="text-xl">Integration Flow</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
                {/* Physician */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-300">
                    <User className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">Physician</p>
                    <p className="text-xs text-gray-600">Orders imaging</p>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

                {/* EHR */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-100 border-2 border-green-300">
                    <Database className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">Epic/Cerner EHR</p>
                    <p className="text-xs text-gray-600">order-select hook</p>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

                {/* CDS Hooks Request */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 border-2 border-purple-300">
                    <MessageSquare className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">CDS Hooks Request</p>
                    <p className="text-xs text-gray-600">FHIR Patient/Condition</p>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

                {/* ARKA Service */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 border-2 border-blue-300">
                    <Zap className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">ARKA Service</p>
                    <p className="text-xs text-gray-600">Evaluates order</p>
                  </div>
                </div>

                <ArrowRight className="h-6 w-6 text-gray-400 flex-shrink-0" />

                {/* Recommendation Card */}
                <div className="flex flex-col items-center gap-2">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 border-2 border-amber-300">
                    <Monitor className="h-8 w-8 text-amber-600" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-900">CDS Card Response</p>
                    <p className="text-xs text-gray-600">Shows in EHR</p>
                  </div>
                </div>
              </div>

              {/* Key Integration Points */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Key Integration Points
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      order-select hook
                    </p>
                    <p className="text-sm text-gray-600">
                      Triggers automatically when imaging order is placed in EHR
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      FHIR Patient/Condition resources
                    </p>
                    <p className="text-sm text-gray-600">
                      Clinical context (age, sex, chief complaint) sent to ARKA
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      CDS Card response
                    </p>
                    <p className="text-sm text-gray-600">
                      ARKA's recommendation formatted as CDS Hooks card
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-200">
                    <p className="text-sm font-semibold text-gray-900 mb-1">
                      Inline EHR display
                    </p>
                    <p className="text-sm text-gray-600">
                      Recommendation appears directly in ordering screen
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button
              onClick={onClose}
              variant="primary"
              size="lg"
              className="min-h-[44px] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close integration architecture modal"
            >
              Close
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

