"use client"
import React, { useState } from 'react';

interface WorkWithUsFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const WorkWithUsForm: React.FC<WorkWithUsFormProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    carName: '',
    carCapacity: '',
    model: '',
    rate: '',
    city: '',
    contactNumber: '',
    ownerName: '',
    experience: '',
    carCondition: 'excellent',
    availability: 'full-time',
  });

  const [errors, setErrors] = useState({
    carName: '',
    carCapacity: '',
    model: '',
    rate: '',
    city: '',
    contactNumber: '',
    ownerName: '',
    experience: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const { carName, carCapacity, model, rate, city, contactNumber, ownerName, experience } = formData;
    const phoneRegex = /^[0-9]{10}$/;
    const rateRegex = /^\d+$/;
    let valid = true;
    const newErrors = { carName: '', carCapacity: '', model: '', rate: '', city: '', contactNumber: '', ownerName: '', experience: '' };

    if (!carName.trim()) {
      newErrors.carName = 'Car name is required.';
      valid = false;
    }

    if (!carCapacity.trim()) {
      newErrors.carCapacity = 'Car capacity is required.';
      valid = false;
    }

    if (!model.trim()) {
      newErrors.model = 'Model is required.';
      valid = false;
    }

    if (!rate.trim()) {
      newErrors.rate = 'Rate is required.';
      valid = false;
    } else if (!rateRegex.test(rate)) {
      newErrors.rate = 'Rate must be a valid number.';
      valid = false;
    }

    if (!city.trim()) {
      newErrors.city = 'City is required.';
      valid = false;
    }

    if (!contactNumber) {
      newErrors.contactNumber = 'Contact number is required.';
      valid = false;
    } else if (!phoneRegex.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number.';
      valid = false;
    }

    if (!ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required.';
      valid = false;
    }

    if (!experience.trim()) {
      newErrors.experience = 'Experience is required.';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const workWithUsData = {
        id: `WW${Date.now()}`, // Generate ID internally
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/saveworkwithus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workWithUsData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          resetForm();
          onClose();
          setIsSuccess(false);
        }, 2000);
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error) {
      console.error('Work with us submission error:', error);
      alert('Failed to submit application. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      carName: '',
      carCapacity: '',
      model: '',
      rate: '',
      city: '',
      contactNumber: '',
      ownerName: '',
      experience: '',
      carCondition: 'excellent',
      availability: 'full-time',
    });
    setErrors({
      carName: '',
      carCapacity: '',
      model: '',
      rate: '',
      city: '',
      contactNumber: '',
      ownerName: '',
      experience: '',
    });
    setIsLoading(false);
    setIsSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🚗 Join Our Fleet</h2>
            <button 
              onClick={() => { resetForm(); onClose(); }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-blue-100 mt-2">Partner with us and earn more with your vehicle</p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Application submitted successfully! We&apos;ll contact you soon.</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              Vehicle Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input 
                  type="text" 
                  name="carName" 
                  placeholder="Car Name (e.g., Swift Dzire)" 
                  value={formData.carName} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.carName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.carName && <p className="text-red-500 text-sm mt-1">{errors.carName}</p>}
              </div>

              <div>
                <input 
                  type="text" 
                  name="carCapacity" 
                  placeholder="Car Capacity (e.g., 4 Seater)" 
                  value={formData.carCapacity} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.carCapacity ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.carCapacity && <p className="text-red-500 text-sm mt-1">{errors.carCapacity}</p>}
              </div>

              <div>
                <input 
                  type="text" 
                  name="model" 
                  placeholder="Model Year (e.g., 2020)" 
                  value={formData.model} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.model ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.model && <p className="text-red-500 text-sm mt-1">{errors.model}</p>}
              </div>

              <div>
                <input 
                  type="text" 
                  name="rate" 
                  placeholder="Daily Rate (₹)" 
                  value={formData.rate} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.rate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.rate && <p className="text-red-500 text-sm mt-1">{errors.rate}</p>}
              </div>

              <div>
                <input 
                  type="text" 
                  name="city" 
                  placeholder="City" 
                  value={formData.city} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.city ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <select 
                  name="carCondition" 
                  value={formData.carCondition} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="excellent">Excellent Condition</option>
                  <option value="good">Good Condition</option>
                  <option value="fair">Fair Condition</option>
                </select>
              </div>

              <div>
                <select 
                  name="availability" 
                  value={formData.availability} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="full-time">Full Time</option>
                  <option value="part-time">Part Time</option>
                  <option value="weekends">Weekends Only</option>
                </select>
              </div>
            </div>
          </div>

          {/* Owner Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Owner Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <input 
                  type="text" 
                  name="ownerName" 
                  placeholder="Owner Name" 
                  value={formData.ownerName} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.ownerName ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.ownerName && <p className="text-red-500 text-sm mt-1">{errors.ownerName}</p>}
              </div>

              <div>
                <input 
                  type="tel" 
                  name="contactNumber" 
                  placeholder="Contact Number" 
                  value={formData.contactNumber} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.contactNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.contactNumber && <p className="text-red-500 text-sm mt-1">{errors.contactNumber}</p>}
              </div>

              <div>
                <input 
                  type="text" 
                  name="experience" 
                  placeholder="Driving Experience (Years)" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.experience ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.experience && <p className="text-red-500 text-sm mt-1">{errors.experience}</p>}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all duration-200 ${
              isLoading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 transform hover:scale-105'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Submitting...
              </div>
            ) : (
              'Submit Application'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-xl">
          <div className="text-sm text-gray-600 dark:text-gray-400 text-center space-y-1">
            <p>We&apos;ll review your application and contact you within 24 hours</p>
            <p className="text-xs">Benefits: Higher earnings, flexible hours, insurance coverage</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;  /* Internet Explorer 10+ */
          scrollbar-width: none;  /* Firefox */
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;  /* Safari and Chrome */
        }
      `}</style>
    </div>
  );
};

export default WorkWithUsForm;
