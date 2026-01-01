'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { MessageSquare, CheckCircle, Star } from 'lucide-react';

export default function FeedbackPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        // Scroll to top to show success message
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setError('Failed to submit feedback. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardContent className="p-8 sm:p-12">
              <div className="flex justify-center mb-6">
                <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Thank You for Your Feedback!
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                We'll review your input and reach out within 48 hours if you indicated interest in a pilot.
              </p>
              <Button
                onClick={() => router.push('/?returnToSplash=true')}
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-blue-100">
              <MessageSquare className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
            Radiologist Feedback
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Your feedback helps us improve ARKA and better serve the radiology community.
            We value your clinical expertise and insights.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200"
            role="alert"
            aria-live="assertive"
          >
            <p className="text-base text-red-800">{error}</p>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Share Your Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <form
                  action="https://api.web3forms.com/submit"
                  method="POST"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Hidden Web3Forms fields */}
                  <input
                    type="hidden"
                    name="access_key"
                    value="959185e8-6e13-4a27-9e0a-00e1eff5aa86"
                  />
                  <input
                    type="hidden"
                    name="subject"
                    value="New ARKA Demo Feedback"
                  />
                  <input
                    type="hidden"
                    name="from_name"
                    value="ARKA Demo Feedback"
                  />

                  {/* Honeypot (spam prevention) */}
                  <input
                    type="checkbox"
                    name="botcheck"
                    className="hidden"
                    style={{ display: 'none' }}
                    tabIndex={-1}
                    autoComplete="off"
                  />

                  {/* Name - Required */}
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-base font-medium text-gray-900 mb-2"
                    >
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px] transition-all duration-200"
                      placeholder="Dr. Jane Smith"
                      aria-required="true"
                      aria-describedby="name-description"
                    />
                    <p id="name-description" className="sr-only">
                      Enter your full name
                    </p>
                  </div>

                  {/* Email - Required */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-base font-medium text-gray-900 mb-2"
                    >
                      Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px] transition-all duration-200"
                      placeholder="jane.smith@hospital.com"
                      aria-required="true"
                      aria-describedby="email-description"
                    />
                    <p id="email-description" className="sr-only">
                      Enter your email address
                    </p>
                  </div>

                  {/* Professional Role - Required */}
                  <div>
                    <label
                      htmlFor="role"
                      className="block text-base font-medium text-gray-900 mb-2"
                    >
                      Professional Role <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="role"
                      name="role"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px] transition-all duration-200 bg-white"
                      aria-required="true"
                      aria-describedby="role-description"
                    >
                      <option value="">Select your role</option>
                      <option value="Radiologist">Radiologist</option>
                      <option value="Radiology Resident/Fellow">
                        Radiology Resident/Fellow
                      </option>
                      <option value="Emergency Medicine Physician">
                        Emergency Medicine Physician
                      </option>
                      <option value="Primary Care Physician">
                        Primary Care Physician
                      </option>
                      <option value="Hospital Administrator">
                        Hospital Administrator
                      </option>
                      <option value="Other Healthcare Professional">
                        Other Healthcare Professional
                      </option>
                      <option value="Medical Student/Resident">
                        Medical Student/Resident
                      </option>
                      <option value="Not in Healthcare">Not in Healthcare</option>
                    </select>
                    <p id="role-description" className="sr-only">
                      Select your professional role
                    </p>
                  </div>

                  {/* Institution - Optional */}
                  <div>
                    <label
                      htmlFor="institution"
                      className="block text-base font-medium text-gray-900 mb-2"
                    >
                      Institution <span className="text-gray-500 text-sm">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      id="institution"
                      name="institution"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px] transition-all duration-200"
                      placeholder="University Hospital, Research Center, etc."
                      aria-describedby="institution-description"
                    />
                    <p id="institution-description" className="sr-only">
                      Enter your institution name (optional)
                    </p>
                  </div>

                  {/* Feedback Category - Checkboxes */}
                  <div>
                    <fieldset>
                      <legend className="block text-base font-medium text-gray-900 mb-3">
                        Feedback Category{' '}
                        <span className="text-gray-500 text-sm font-normal">
                          (Select all that apply)
                        </span>
                      </legend>
                      <div className="space-y-3" role="group" aria-labelledby="category-legend">
                        {[
                          'Clinical Accuracy',
                          'Workflow Integration',
                          'UI/UX',
                          'Missing Features',
                          'Technical Issues',
                          'General Comments',
                        ].map((category) => (
                          <label
                            key={category}
                            className="flex items-center cursor-pointer min-h-[44px] p-2 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="checkbox"
                              name="category[]"
                              value={category}
                              className="mr-3 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 rounded border-gray-300"
                              aria-label={`Select ${category} category`}
                            />
                            <span className="text-base text-gray-700">{category}</span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Detailed Feedback - Required */}
                  <div>
                    <label
                      htmlFor="feedback"
                      className="block text-base font-medium text-gray-900 mb-2"
                    >
                      Detailed Feedback <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="feedback"
                      name="feedback"
                      required
                      minLength={20}
                      maxLength={1000}
                      rows={6}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-all duration-200 resize-y"
                      placeholder="Share your thoughts, suggestions, or concerns about ARKA... (20-1000 characters)"
                      aria-required="true"
                      aria-describedby="feedback-description"
                    />
                    <p id="feedback-description" className="text-sm text-gray-500 mt-1">
                      Minimum 20 characters, maximum 1000 characters
                    </p>
                  </div>

                  {/* Rating - Required */}
                  <div>
                    <fieldset>
                      <legend className="block text-base font-medium text-gray-900 mb-3">
                        How useful would this tool be in your practice?{' '}
                        <span className="text-red-600">*</span>
                      </legend>
                      <div
                        className="flex flex-wrap gap-4"
                        role="radiogroup"
                        aria-labelledby="rating-legend"
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <label
                            key={star}
                            className="flex items-center cursor-pointer min-h-[44px] px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                          >
                            <input
                              type="radio"
                              name="rating"
                              value={star}
                              required
                              className="mr-2 w-5 h-5 text-blue-600 focus:ring-2 focus:ring-blue-500 border-gray-300"
                              aria-label={`Rate ${star} out of 5 stars`}
                            />
                            <span className="text-base text-gray-700">
                              {star} <Star className="inline h-4 w-4 text-yellow-400 fill-yellow-400" />
                            </span>
                          </label>
                        ))}
                      </div>
                    </fieldset>
                  </div>

                  {/* Interest Level - Required */}
                  <div>
                    <label
                      htmlFor="interest"
                      className="block text-base font-medium text-gray-900 mb-2"
                    >
                      Interest Level <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base min-h-[44px] transition-all duration-200 bg-white"
                      aria-required="true"
                      aria-describedby="interest-description"
                    >
                      <option value="">Select one</option>
                      <option value="Interested in pilot program">
                        Interested in pilot program
                      </option>
                      <option value="Just exploring">Just exploring</option>
                      <option value="Would like to discuss further">
                        Would like to discuss further
                      </option>
                      <option value="Not interested right now">
                        Not interested right now
                      </option>
                    </select>
                    <p id="interest-description" className="sr-only">
                      Select your interest level
                    </p>
                  </div>

                  {/* Submit Button */}
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

                  {/* Privacy Note */}
                  <p className="text-sm text-gray-500 text-center">
                    Your data is sent securely. We never share your contact information.
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Recent Feedback Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Recent Feedback</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 space-y-6">
                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-base text-gray-700 mb-2">
                      "This would save us hours on inappropriate imaging orders. The ACR
                      integration is exactly what we need."
                    </p>
                    <p className="text-sm text-gray-500">
                      - Chief of Radiology, Academic Medical Center
                    </p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                          aria-hidden="true"
                        />
                      ))}
                      <Star className="h-4 w-4 text-gray-300" aria-hidden="true" />
                    </div>
                    <p className="text-base text-gray-700 mb-2">
                      "Love the traffic light visualization. Easy to understand at a glance.
                      Would like to see more pediatric scenarios."
                    </p>
                    <p className="text-sm text-gray-500">- Pediatric Radiologist</p>
                  </div>

                  <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="flex items-center gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className="h-4 w-4 text-yellow-400 fill-yellow-400"
                          aria-hidden="true"
                        />
                      ))}
                    </div>
                    <p className="text-base text-gray-700 mb-2">
                      "Finally, a CDS tool with good UX! The detailed reasoning helps us
                      educate ordering physicians."
                    </p>
                    <p className="text-sm text-gray-500">
                      - Radiology Resident, University Hospital
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

