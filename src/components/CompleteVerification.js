import React, { useState, useEffect } from "react";

const AdvancedInteractiveForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [password, setPassword] = useState("");
  const [focused, setFocused] = useState("");

  // Handle captcha verification
  const handleCaptchaCheck = () => {
    setLoading(true);
    setTimeout(() => {
      setCaptchaVerified(true);
      setLoading(false);
    }, 1200);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  // Password strength checker
  useEffect(() => {
    if (!password) {
      setPasswordStrength(0);
      return;
    }
    
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    setPasswordStrength(strength);
  }, [password]);

  // Form validation
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!formData.name) newErrors.name = "Name is required";
      if (!formData.email) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Email is invalid";
      if (!password) newErrors.password = "Password is required";
      else if (passwordStrength < 3) newErrors.password = "Password is too weak";
    } else if (step === 2) {
      if (!formData.phone) newErrors.phone = "Phone is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) 
        newErrors.phone = "Phone should have 10 digits";
      if (!formData.company) newErrors.company = "Company is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Handle previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const isValid = validateStep(currentStep);
    
    if (isValid && captchaVerified) {
      setLoading(true);
      
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 1500);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      email: "",
      phone: "",
      company: "",
      message: ""
    });
    setPassword("");
    setCurrentStep(1);
    setSubmitted(false);
    setCaptchaVerified(false);
    setPasswordStrength(0);
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-teal-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden transform transition-all duration-500">
        {!submitted ? (
          <>
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-6 px-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-blue-500 opacity-20"></div>
              <div className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-indigo-500 opacity-20"></div>
              
              <h2 className="text-2xl font-bold text-white text-center relative z-10">
                {currentStep === 1 ? "Account Details" : 
                 currentStep === 2 ? "Personal Information" : 
                 "Complete Registration"}
              </h2>
              <p className="text-blue-100 text-center mt-1 relative z-10">Step {currentStep} of 3</p>
              
              {/* Progress bar */}
              <div className="mt-4 h-2 bg-blue-200 rounded-full overflow-hidden relative z-10">
                <div 
                  className="h-full bg-white transition-all duration-500 ease-out"
                  style={{ width: `${(currentStep / 3) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Step 1: Account Information */}
                {currentStep === 1 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name
                        </label>
                        {errors.name && <span className="text-xs text-red-500">{errors.name}</span>}
                      </div>
                      <div className={`relative ${focused === 'name' ? 'transform scale-105 transition-transform duration-300' : ''}`}>
                        <input
                          id="name"
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleChange}
                          onFocus={() => setFocused('name')}
                          onBlur={() => setFocused('')}
                          className={`w-full px-4 py-3 border ${errors.name ? 'border-red-300' : focused === 'name' ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          placeholder="Enter your full name"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email Address
                        </label>
                        {errors.email && <span className="text-xs text-red-500">{errors.email}</span>}
                      </div>
                      <div className={`relative ${focused === 'email' ? 'transform scale-105 transition-transform duration-300' : ''}`}>
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          onFocus={() => setFocused('email')}
                          onBlur={() => setFocused('')}
                          className={`w-full px-4 py-3 border ${errors.email ? 'border-red-300' : focused === 'email' ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          placeholder="Enter your email address"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Create Password
                        </label>
                        {errors.password && <span className="text-xs text-red-500">{errors.password}</span>}
                      </div>
                      <div className={`relative ${focused === 'password' ? 'transform scale-105 transition-transform duration-300' : ''}`}>
                        <input
                          id="password"
                          name="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          onFocus={() => setFocused('password')}
                          onBlur={() => setFocused('')}
                          className={`w-full px-4 py-3 border ${errors.password ? 'border-red-300' : focused === 'password' ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          placeholder="Create a secure password"
                        />
                      </div>
                      
                      {/* Password strength indicator */}
                      {password && (
                        <div className="mt-2">
                          <div className="flex justify-between mb-1">
                            <span className="text-xs text-gray-500">Password strength:</span>
                            <span className="text-xs font-medium">
                              {passwordStrength === 0 ? "Very weak" :
                              passwordStrength === 1 ? "Weak" :
                              passwordStrength === 2 ? "Medium" :
                              passwordStrength === 3 ? "Strong" : "Very strong"}
                            </span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                passwordStrength === 0 ? "bg-red-500 w-1/5" :
                                passwordStrength === 1 ? "bg-orange-500 w-2/5" :
                                passwordStrength === 2 ? "bg-yellow-500 w-3/5" :
                                passwordStrength === 3 ? "bg-lime-500 w-4/5" : "bg-green-500 w-full"
                              }`}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Step 2: Personal Information */}
                {currentStep === 2 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        {errors.phone && <span className="text-xs text-red-500">{errors.phone}</span>}
                      </div>
                      <div className={`relative ${focused === 'phone' ? 'transform scale-105 transition-transform duration-300' : ''}`}>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleChange}
                          onFocus={() => setFocused('phone')}
                          onBlur={() => setFocused('')}
                          className={`w-full px-4 py-3 border ${errors.phone ? 'border-red-300' : focused === 'phone' ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex justify-between">
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                          Company
                        </label>
                        {errors.company && <span className="text-xs text-red-500">{errors.company}</span>}
                      </div>
                      <div className={`relative ${focused === 'company' ? 'transform scale-105 transition-transform duration-300' : ''}`}>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          onFocus={() => setFocused('company')}
                          onBlur={() => setFocused('')}
                          className={`w-full px-4 py-3 border ${errors.company ? 'border-red-300' : focused === 'company' ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          placeholder="Enter your company name"
                        />
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Final step with verification */}
                {currentStep === 3 && (
                  <div className="space-y-4 animate-fadeIn">
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Information (Optional)
                      </label>
                      <div className={`relative ${focused === 'message' ? 'transform scale-105 transition-transform duration-300' : ''}`}>
                        <textarea
                          id="message"
                          name="message"
                          rows="3"
                          value={formData.message}
                          onChange={handleChange}
                          onFocus={() => setFocused('message')}
                          onBlur={() => setFocused('')}
                          className={`w-full px-4 py-3 border ${focused === 'message' ? 'border-blue-500' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all`}
                          placeholder="Anything else you'd like to share..."
                        ></textarea>
                      </div>
                    </div>
                    
                    {/* Mock verification */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-3">Verification</h3>
                      
                      {!captchaVerified ? (
                        <div
                          className="border border-gray-300 rounded-lg shadow-sm p-4 hover:border-blue-400 transition-colors cursor-pointer flex items-center justify-center gap-3"
                          onClick={handleCaptchaCheck}
                        >
                          {loading ? (
                            <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                          ) : (
                            <>
                              <div className="w-5 h-5 border border-gray-400 rounded flex items-center justify-center">
                                <div className="w-3 h-3 bg-transparent"></div>
                              </div>
                              <span className="text-sm text-gray-600">Click to verify your identity</span>
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="border border-green-200 bg-green-50 rounded-lg p-4 flex items-center gap-3">
                          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                          <span className="text-sm text-green-700">Identity verified successfully</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                
                {/* Navigation buttons */}
                <div className="flex justify-between pt-4">
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={handlePrevStep}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                  ) : (
                    <div></div>
                  )}
                  
                  {currentStep < 3 ? (
                    <button
                      type="button"
                      onClick={handleNextStep}
                      className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
                    >
                      Continue
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!captchaVerified || loading}
                      className={`px-6 py-2 rounded-lg shadow-md transition-all duration-300 ${
                        captchaVerified && !loading
                          ? "bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-lg transform hover:-translate-y-1"
                          : "bg-gray-400 text-white cursor-not-allowed"
                      }`}
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Processing...
                        </span>
                      ) : (
                        "Complete Registration"
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
          </>
        ) : (
          <div className="p-8 text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mt-6">Registration Complete!</h2>
            <p className="text-gray-600 mt-2">Thank you, {formData.name}. Your account has been created successfully.</p>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-left">
              <h3 className="text-sm font-medium text-blue-700 mb-2">Account Information:</h3>
              <p className="text-sm text-blue-800">Name: {formData.name}</p>
              <p className="text-sm text-blue-800">Email: {formData.email}</p>
              <p className="text-sm text-blue-800">Phone: {formData.phone}</p>
              <p className="text-sm text-blue-800">Company: {formData.company}</p>
            </div>
            <button
              onClick={resetForm}
              className="mt-8 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Start Over
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedInteractiveForm;