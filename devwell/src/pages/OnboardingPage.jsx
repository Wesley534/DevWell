import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/Card';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const OnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    nickname: '',
    timezone: 'Africa/Nairobi',
    work_hours_start: '09:00',
    work_hours_end: '17:00',
    coding_style: 'pomodoro',
    wellness_goals: [],
    diet_preference: 'balanced',
    reminder_frequency: 'balanced',
    age: '',
    weight: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 🔹 Handle form field changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      wellness_goals: checked
        ? [...prev.wellness_goals, value]
        : prev.wellness_goals.filter((goal) => goal !== value),
    }));
  };

  // 🔹 Step validation
  const validateStep = () => {
    if (step === 1) return formData.nickname && formData.timezone;
    if (step === 2) return formData.work_hours_start && formData.work_hours_end && formData.coding_style;
    if (step === 3) return formData.wellness_goals.length > 0;
    if (step === 4) return formData.diet_preference && formData.reminder_frequency;
    return true; // Step 5 is optional
  };

  const handleNext = () => {
    if (validateStep()) {
      setError('');
      setStep(step + 1);
    } else {
      setError('Please fill out all required fields');
      toast.error('Please fill out all required fields');
    }
  };

  const handlePrevious = () => {
    setError('');
    setStep(step - 1);
  };

  // 🔹 Final submission
  const handleSubmit = async () => {
    if (loading) return;
    setError('');
    setLoading(true);

    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (!token) {
      toast.error('Session expired. Please log in again.');
      setTimeout(() => navigate('/login', { replace: true }), 1500);
      return;
    }

    const payload = {
      ...formData,
      wellness_goals: formData.wellness_goals.join(','), // convert array → CSV
      age: formData.age ? parseInt(formData.age, 10) : null,
      weight: formData.weight ? parseFloat(formData.weight) : null,
    };

    try {
      const response = await fetch(`${API_URL}/api/profile/onboarding`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success('Profile setup completed successfully!');
        setTimeout(() => navigate('/dashboard', { replace: true }), 1500);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        toast.error('Session expired. Please log in again.');
        setTimeout(() => navigate('/login', { replace: true }), 1500);
      } else {
        const errorData = await response.json();
        const errorMessage = Array.isArray(errorData.detail)
          ? errorData.detail.map((err) => `${err.loc.join('.')}: ${err.msg}`).join('; ')
          : errorData.detail || 'Failed to complete onboarding';

        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    } catch (err) {
      console.error('Network error:', err);
      toast.error('Network error while completing onboarding');
      setError('Network error while completing onboarding');
      setLoading(false);
    }
  };

  // 🔹 UI Rendering
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome to DevWell</CardTitle>
          <CardDescription>Step {step} of 5: Let&apos;s set up your profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* 🔹 Step content */}
            {(() => {
              switch (step) {
                case 1:
                  return (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-emerald-700">Profile Basics</h3>
                      <div>
                        <label className="text-sm text-emerald-700">Nickname *</label>
                        <input
                          type="text"
                          name="nickname"
                          value={formData.nickname}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          placeholder="Enter your nickname"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-emerald-700">Timezone *</label>
                        <select
                          name="timezone"
                          value={formData.timezone}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          disabled={loading}
                        >
                          <option value="Africa/Nairobi">Africa/Nairobi</option>
                          <option value="America/New_York">America/New_York</option>
                          <option value="Europe/London">Europe/London</option>
                          <option value="Asia/Tokyo">Asia/Tokyo</option>
                        </select>
                      </div>
                    </div>
                  );
                case 2:
                  return (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-emerald-700">Work Preferences</h3>
                      <div>
                        <label className="text-sm text-emerald-700">Work Hours Start *</label>
                        <input
                          type="time"
                          name="work_hours_start"
                          value={formData.work_hours_start}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-emerald-700">Work Hours End *</label>
                        <input
                          type="time"
                          name="work_hours_end"
                          value={formData.work_hours_end}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-emerald-700">Coding Style *</label>
                        <select
                          name="coding_style"
                          value={formData.coding_style}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          disabled={loading}
                        >
                          <option value="pomodoro">Pomodoro (25-min sessions)</option>
                          <option value="long">Long Sessions</option>
                        </select>
                      </div>
                    </div>
                  );
                case 3:
                  return (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-emerald-700">Wellness Goals *</h3>
                      <div className="space-y-2">
                        {['hydration', 'mental_health', 'nutrition', 'balance'].map((goal) => (
                          <label key={goal} className="flex items-center text-sm text-emerald-700">
                            <input
                              type="checkbox"
                              value={goal}
                              checked={formData.wellness_goals.includes(goal)}
                              onChange={handleCheckboxChange}
                              className="mr-2 h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-emerald-300"
                              disabled={loading}
                            />
                            {goal.replace('_', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                case 4:
                  return (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-emerald-700">Preferences</h3>
                      <div>
                        <label className="text-sm text-emerald-700">Diet Preference *</label>
                        <select
                          name="diet_preference"
                          value={formData.diet_preference}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          disabled={loading}
                        >
                          <option value="vegetarian">Vegetarian</option>
                          <option value="vegan">Vegan</option>
                          <option value="protein-focused">Protein-Focused</option>
                          <option value="balanced">Balanced</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm text-emerald-700">Reminder Frequency *</label>
                        <select
                          name="reminder_frequency"
                          value={formData.reminder_frequency}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          disabled={loading}
                        >
                          <option value="minimal">Minimal</option>
                          <option value="balanced">Balanced</option>
                          <option value="frequent">Frequent</option>
                        </select>
                      </div>
                    </div>
                  );
                case 5:
                  return (
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-emerald-700">Additional Info (Optional)</h3>
                      <div>
                        <label className="text-sm text-emerald-700">Age</label>
                        <input
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          placeholder="Enter your age"
                          disabled={loading}
                        />
                      </div>
                      <div>
                        <label className="text-sm text-emerald-700">Weight (kg)</label>
                        <input
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleInputChange}
                          className="w-full p-2 border rounded border-emerald-300 focus:ring-emerald-500"
                          placeholder="Enter your weight"
                          disabled={loading}
                        />
                      </div>
                    </div>
                  );
                default:
                  return null;
              }
            })()}

            {/* 🔹 Error message */}
            {error && <p className="text-red-500 dark:text-red-400">{error}</p>}

            {/* 🔹 Navigation buttons */}
            <div className="flex justify-between">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  className="border-emerald-600 text-emerald-600 hover:bg-emerald-100"
                  disabled={loading}
                >
                  Previous
                </Button>
              )}
              {step < 5 ? (
                <Button
                  onClick={handleNext}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Complete Setup'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
      <ToastContainer />
    </div>
  );
};

export default OnboardingPage;
