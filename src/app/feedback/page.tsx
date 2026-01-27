'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { FieldError } from '@/components/ui/FieldError';
import { FDABanner } from '@/components/fda/FDABanner';
import { FDAComplianceModal } from '@/components/fda/FDAComplianceModal';
import { AppHeader } from '@/components/AppHeader';
import { AppFooter } from '@/components/AppFooter';
import { MessageSquare, CheckCircle, Star, ArrowLeft, X } from 'lucide-react';
import { clsx } from 'clsx';

const MIN_FEEDBACK_CHARS = 10;
const MAX_FEEDBACK_CHARS = 1000;
const PANEL_TRANSITION_MS = 350;
const EMPTY_FIELD_MSG = 'This field cannot be empty';

/** Email must contain @ and domain extension (.com, .org, .edu, etc.) */
function isValidEmail(value: string): boolean {
  const t = value.trim();
  if (!t) return false;
  return t.includes('@') && /@[^@]+\.[a-zA-Z]{2,}$/.test(t);
}

type FieldErrors = { name?: string; email?: string; feedback?: string; role?: string; interest?: string; rating?: string };

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showFDAComplianceModal, setShowFDAComplianceModal] = useState(false);
  const [panelVisible, setPanelVisible] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [feedbackValue, setFeedbackValue] = useState('');

  const goToEvaluate = useCallback(() => {
    router.push('/evaluate');
  }, [router]);

  // Ensure browser Back from Feedback goes to /evaluate (Page 2), not splash
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      const fromEvaluate = document.referrer?.includes('/evaluate');
      if (!fromEvaluate) {
        window.history.replaceState({}, '', '/evaluate');
        window.history.pushState({}, '', '/feedback');
      }
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.title = 'Provide Feedback | ARKA';
  }, []);

  // Slide-in panel animation
  useEffect(() => {
    const t = setTimeout(() => setPanelVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const validateForm = (form: HTMLFormElement): FieldErrors => {
    const nameEl = form.querySelector<HTMLInputElement>('#name');
    const emailEl = form.querySelector<HTMLInputElement>('#email');
    const roleEl = form.querySelector<HTMLSelectElement>('#role');
    const interestEl = form.querySelector<HTMLSelectElement>('#interest');
    const ratingChecked = form.querySelector<HTMLInputElement>('input[name="rating"]:checked');
    const err: FieldErrors = {};
    const fv = feedbackValue.trim();
    if (nameEl) {
      const v = nameEl.value.trim();
      if (!v) err.name = EMPTY_FIELD_MSG;
    }
    if (emailEl) {
      const v = emailEl.value.trim();
      if (!v) err.email = EMPTY_FIELD_MSG;
      else if (!isValidEmail(v)) err.email = 'Please enter a valid email address';
    }
    if (!fv) err.feedback = EMPTY_FIELD_MSG;
    else if (fv.length < MIN_FEEDBACK_CHARS) err.feedback = `Please provide feedback (minimum ${MIN_FEEDBACK_CHARS} characters)`;
    else if (fv.length > MAX_FEEDBACK_CHARS) err.feedback = `Feedback must be ${MAX_FEEDBACK_CHARS} characters or fewer`;
    if (roleEl) {
      if (!roleEl.value.trim()) err.role = 'Please select your professional role';
    }
    if (interestEl) {
      if (!interestEl.value.trim()) err.interest = 'Please select an option';
    }
    if (!ratingChecked) err.rating = 'Please select a rating';
    return err;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const errors = validateForm(form);
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(form);
    const nameEl = form.querySelector<HTMLInputElement>('#name');
    const emailEl = form.querySelector<HTMLInputElement>('#email');
    if (nameEl) formData.set('name', nameEl.value.trim());
    if (emailEl) formData.set('email', emailEl.value.trim());
    formData.set('feedback', feedbackValue.trim());

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.success) {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClassName = (hasError: boolean) =>
    clsx(
      'w-full p-3 border rounded-lg focus:ring-2 text-base min-h-[44px] transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white',
      hasError ? 'input-error border-[#dc2626] focus:ring-[#dc2626] focus:border-[#dc2626]' : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500'
    );

  if (isSuccess) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
        <AppHeader />
        <div className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto">
            <Card className="text-center">
              <CardContent className="p-8 sm:p-12">
                <div className="flex justify-center mb-6">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  Thank You for Your Feedback!
                </h1>
                <p className="text-lg text-gray-700 dark:text-gray-300 mb-6">
                  We&apos;ll review your input and reach out within 48 hours if you indicated interest in a pilot.
                </p>
                <Button
                  onClick={goToEvaluate}
                  variant="primary"
                  size="lg"
                  className="min-h-[44px]"
                >
                  Return to ARKA Demo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
        <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
        <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <FDABanner onOpenComplianceModal={() => setShowFDAComplianceModal(true)} />
      <AppHeader />
      {/* Overlay + slide-in panel */}
      <div className="fixed inset-0 z-40 flex flex-col sm:flex-row" aria-modal="true" role="dialog">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/40 transition-opacity duration-300"
          style={{ opacity: panelVisible ? 1 : 0 }}
          onClick={goToEvaluate}
          aria-hidden="true"
        />
        {/* Panel: slides in from right */}
        <div
          className="relative ml-auto w-full max-w-2xl sm:max-w-xl md:max-w-2xl h-full bg-white dark:bg-gray-900 shadow-2xl flex flex-col overflow-hidden transition-transform ease-out"
          style={{
            transitionDuration: `${PANEL_TRANSITION_MS}ms`,
            transform: panelVisible ? 'translateX(0)' : 'translateX(100%)',
          }}
        >
          {/* Panel header: Back + Close */}
          <div className="flex items-center justify-between shrink-0 border-b border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900">
            <button
              type="button"
              onClick={goToEvaluate}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors min-h-[44px]"
              aria-label="Back to Imaging Appropriateness Evaluation"
            >
              <ArrowLeft className="h-5 w-5" />
              Back
            </button>
            <button
              type="button"
              onClick={goToEvaluate}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white transition-colors"
              aria-label="Close feedback"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Scrollable form content */}
          <div className="flex-1 overflow-y-auto">
            <div className="py-6 px-4 sm:px-6">
              <div className="mb-6 text-center">
                <div className="flex justify-center mb-4">
                  <div className="flex items-center justify-center w-14 h-14 rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                    <MessageSquare className="h-7 w-7 text-cyan-600 dark:text-cyan-400" />
                  </div>
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2" id="page-title">
                  Provide Feedback
                </h1>
                <p className="text-base text-gray-600 dark:text-gray-400">
                  Your feedback helps us improve ARKA and better serve the radiology community.
                </p>
              </div>

              {error && (
                <div
                  className="mb-6 p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                  role="alert"
                  aria-live="assertive"
                >
                  <p className="text-base text-red-800 dark:text-red-200">{error}</p>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Share Your Feedback</CardTitle>
                </CardHeader>
                <CardContent className="p-4 sm:p-6">
                  {Object.keys(fieldErrors).length > 0 && (
                    <div
                      id="form-error-summary"
                      className="mb-4 rounded-lg border border-[#dc2626]/30 bg-[#fef2f2] dark:bg-red-950/20 p-3"
                      role="alert"
                      aria-live="polite"
                    >
                      <p className="form-field-error text-sm font-medium">
                        Please fix the errors below before submitting.
                      </p>
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                    <input type="hidden" name="access_key" value="959185e8-6e13-4a27-9e0a-00e1eff5aa86" />
                    <input type="hidden" name="subject" value="New ARKA Demo Feedback" />
                    <input type="hidden" name="from_name" value="ARKA Demo Feedback" />
                    <input
                      type="checkbox"
                      name="botcheck"
                      className="hidden"
                      style={{ display: 'none' }}
                      tabIndex={-1}
                      autoComplete="off"
                    />

                    {/* Name */}
                    <div>
                      <label htmlFor="name" className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                        Name <span className="text-[#dc2626]">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className={inputClassName(!!fieldErrors.name)}
                        placeholder="Dr. Jane Smith"
                        aria-required
                        aria-invalid={!!fieldErrors.name}
                        aria-describedby={fieldErrors.name ? 'name-error' : undefined}
                      />
                      {fieldErrors.name && <FieldError id="name-error" message={fieldErrors.name} />}
                    </div>

                    {/* Email */}
                    <div>
                      <label htmlFor="email" className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                        Email <span className="text-[#dc2626]">*</span>
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className={inputClassName(!!fieldErrors.email)}
                        placeholder="jane.smith@hospital.com"
                        aria-required
                        aria-invalid={!!fieldErrors.email}
                        aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                      />
                      {fieldErrors.email && <FieldError id="email-error" message={fieldErrors.email} />}
                    </div>

                    {/* Professional Role */}
                    <div>
                      <label htmlFor="role" className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                        Professional Role <span className="text-[#dc2626]">*</span>
                      </label>
                      <select
                        id="role"
                        name="role"
                        required
                        className={inputClassName(!!fieldErrors.role)}
                        aria-required
                        aria-invalid={!!fieldErrors.role}
                        aria-describedby={fieldErrors.role ? 'role-error' : undefined}
                      >
                        <option value="">Select your role</option>
                        <option value="Radiologist">Radiologist</option>
                        <option value="Radiology Resident/Fellow">Radiology Resident/Fellow</option>
                        <option value="Emergency Medicine Physician">Emergency Medicine Physician</option>
                        <option value="Primary Care Physician">Primary Care Physician</option>
                        <option value="Hospital Administrator">Hospital Administrator</option>
                        <option value="Other Healthcare Professional">Other Healthcare Professional</option>
                        <option value="Medical Student/Resident">Medical Student/Resident</option>
                        <option value="Not in Healthcare">Not in Healthcare</option>
                      </select>
                      {fieldErrors.role && <FieldError id="role-error" message={fieldErrors.role} />}
                    </div>

                    {/* Institution - Optional */}
                    <div>
                      <label htmlFor="institution" className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                        Institution <span className="text-gray-500 text-sm">(Optional)</span>
                      </label>
                      <input
                        type="text"
                        id="institution"
                        name="institution"
                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px] transition-all duration-200 bg-white dark:bg-gray-800 dark:text-white"
                        placeholder="University Hospital, Research Center, etc."
                      />
                    </div>

                    {/* Feedback Category - Checkboxes */}
                    <div>
                      <fieldset>
                        <legend className="block text-base font-medium text-gray-900 dark:text-white mb-3">
                          Feedback Category <span className="text-gray-500 text-sm font-normal">(Select all that apply)</span>
                        </legend>
                        <div className="space-y-3" role="group">
                          {['Clinical Accuracy', 'Workflow Integration', 'UI/UX', 'Missing Features', 'Technical Issues', 'General Comments'].map((category) => (
                            <label
                              key={category}
                              className="flex items-center cursor-pointer min-h-[44px] p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <input
                                type="checkbox"
                                name="category[]"
                                value={category}
                                className="mr-3 w-5 h-5 text-cyan-600 focus:ring-2 focus:ring-cyan-500 rounded border-gray-300 dark:border-gray-600"
                                aria-label={`Select ${category} category`}
                              />
                              <span className="text-base text-gray-700 dark:text-gray-300">{category}</span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                    </div>

                    {/* Detailed Feedback */}
                    <div>
                      <label htmlFor="feedback" className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                        Detailed Feedback <span className="text-[#dc2626]">*</span>
                      </label>
                      <textarea
                        id="feedback"
                        name="feedback"
                        required
                        minLength={MIN_FEEDBACK_CHARS}
                        maxLength={MAX_FEEDBACK_CHARS}
                        rows={5}
                        value={feedbackValue}
                        onChange={(e) => setFeedbackValue(e.target.value)}
                        onBlur={(e) => {
                          const v = e.target.value.trim();
                          if (v !== e.target.value) setFeedbackValue(v);
                        }}
                        className={clsx(
                          'w-full p-3 border rounded-lg focus:ring-2 text-base transition-all duration-200 resize-y bg-white dark:bg-gray-800 dark:text-white',
                          fieldErrors.feedback ? 'input-error border-[#dc2626]' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
                        )}
                        placeholder={`Share your thoughts (minimum ${MIN_FEEDBACK_CHARS} characters)`}
                        aria-required
                        aria-invalid={!!fieldErrors.feedback}
                        aria-describedby={fieldErrors.feedback ? 'feedback-error' : 'feedback-desc'}
                      />
                      {fieldErrors.feedback ? (
                        <FieldError id="feedback-error" message={fieldErrors.feedback} />
                      ) : null}
                      <p id="feedback-desc" className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 text-right" aria-live="polite">
                        {feedbackValue.trim().length} / {MAX_FEEDBACK_CHARS} (min {MIN_FEEDBACK_CHARS})
                      </p>
                    </div>

                    {/* Rating */}
                    <div role="group" aria-labelledby="rating-legend" aria-describedby={fieldErrors.rating ? 'rating-error' : undefined}>
                      <fieldset>
                        <legend id="rating-legend" className="block text-base font-medium text-gray-900 dark:text-white mb-3">
                          How useful would this tool be in your practice? <span className="text-[#dc2626]">*</span>
                        </legend>
                        <div className="flex flex-wrap gap-4" role="radiogroup">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <label
                              key={star}
                              className="flex items-center cursor-pointer min-h-[44px] px-4 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                              <input
                                type="radio"
                                name="rating"
                                value={star}
                                required
                                aria-invalid={!!fieldErrors.rating}
                                className="mr-2 w-5 h-5 text-cyan-600 focus:ring-2 focus:ring-cyan-500 border-gray-300 dark:border-gray-600"
                                aria-label={`Rate ${star} out of 5 stars`}
                              />
                              <span className="text-base text-gray-700 dark:text-gray-300">
                                {star} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" />
                              </span>
                            </label>
                          ))}
                        </div>
                      </fieldset>
                      {fieldErrors.rating && <FieldError id="rating-error" message={fieldErrors.rating} />}
                    </div>

                    {/* Interest Level */}
                    <div>
                      <label htmlFor="interest" className="block text-base font-medium text-gray-900 dark:text-white mb-2">
                        Interest Level <span className="text-[#dc2626]">*</span>
                      </label>
                      <select
                        id="interest"
                        name="interest"
                        required
                        className={inputClassName(!!fieldErrors.interest)}
                        aria-required
                        aria-invalid={!!fieldErrors.interest}
                        aria-describedby={fieldErrors.interest ? 'interest-error' : undefined}
                      >
                        <option value="">Select one</option>
                        <option value="Interested in pilot program">Interested in pilot program</option>
                        <option value="Just exploring">Just exploring</option>
                        <option value="Would like to discuss further">Would like to discuss further</option>
                        <option value="Not interested right now">Not interested right now</option>
                      </select>
                      {fieldErrors.interest && <FieldError id="interest-error" message={fieldErrors.interest} />}
                    </div>

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      className="w-full min-h-[44px]"
                      isLoading={isSubmitting}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                    </Button>

                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                      Your data is sent securely. We never share your contact information.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
      <AppFooter onOpenFDAComplianceModal={() => setShowFDAComplianceModal(true)} />
      <FDAComplianceModal isOpen={showFDAComplianceModal} onClose={() => setShowFDAComplianceModal(false)} />
    </div>
  );
}
