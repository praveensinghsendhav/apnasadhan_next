import React, { useState } from 'react';

interface BookingFormPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingFormPopup: React.FC<BookingFormPopupProps> = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    number: '',
    email: '',
    pickupAddress: '',
    dropAddress: '',
    pickupDate: '',
    pickupTime: '',
    passengers: '1',
    carType: 'sedan',
  });

  const [errors, setErrors] = useState({
    name: '',
    number: '',
    email: '',
    pickupAddress: '',
    dropAddress: '',
    pickupDate: '',
    pickupTime: '',
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'name' || name === 'pickupAddress' || name === 'dropAddress') {
      formattedValue = value.replace(/\b\w/g, char => char.toUpperCase());
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const { name, number, email, pickupAddress, dropAddress, pickupDate, pickupTime } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    let valid = true;
    const newErrors = { name: '', number: '', email: '', pickupAddress: '', dropAddress: '', pickupDate: '', pickupTime: '' };

    if (!name.trim()) {
      newErrors.name = 'Name is required.';
      valid = false;
    } else if (name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
      valid = false;
    }

    if (!number) {
      newErrors.number = 'Phone number is required.';
      valid = false;
    } else if (!phoneRegex.test(number)) {
      newErrors.number = 'Please enter a valid 10-digit phone number.';
      valid = false;
    }

    if (email && !emailRegex.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
      valid = false;
    }

    if (!pickupAddress.trim()) {
      newErrors.pickupAddress = 'Pickup address is required.';
      valid = false;
    }

    if (!dropAddress.trim()) {
      newErrors.dropAddress = 'Drop address is required.';
      valid = false;
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required.';
      valid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const selectedDate = new Date(pickupDate);
      if (selectedDate.getTime() < today.getTime()) {
        newErrors.pickupDate = 'Pickup date cannot be in the past.';
        valid = false;
      }
    }

    if (!pickupTime) {
      newErrors.pickupTime = 'Pickup time is required.';
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
      const bookingData = {
        id: `BK${Date.now()}`, // Generate ID internally
        ...formData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };

      const response = await fetch('/api/savebooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          resetForm();
          onClose();
          setIsSuccess(false);
        }, 2000);
      } else {
        throw new Error('Failed to submit booking');
      }
    } catch (error) {
      console.error('Booking submission error:', error);
      alert('Failed to submit booking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      email: '',
      pickupAddress: '',
      dropAddress: '',
      pickupDate: '',
      pickupTime: '',
      passengers: '1',
      carType: 'sedan',
    });
    setErrors({
      name: '',
      number: '',
      email: '',
      pickupAddress: '',
      dropAddress: '',
      pickupDate: '',
      pickupTime: '',
    });
    setIsLoading(false);
    setIsSuccess(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">🚗 Book Your Ride</h2>
            <button 
              onClick={() => { resetForm(); onClose(); }}
              className="text-white hover:text-gray-200 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-blue-100 mt-2">Quick and easy booking process</p>
        </div>

        {/* Success Message */}
        {isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded m-4">
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Booking submitted successfully!</span>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Personal Information
            </h3>
            
            <div>
              <input 
                type="text" 
                name="name" 
                placeholder="Full Name" 
                value={formData.name} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <input 
                type="tel" 
                name="number" 
                placeholder="Phone Number" 
                value={formData.number} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.number ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.number && <p className="text-red-500 text-sm mt-1">{errors.number}</p>}
            </div>

            <div>
              <input 
                type="email" 
                name="email" 
                placeholder="Email (Optional)" 
                value={formData.email} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>
          </div>

          {/* Trip Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Trip Details
            </h3>

            <div>
              <input 
                type="text" 
                name="pickupAddress" 
                placeholder="Pickup Address" 
                value={formData.pickupAddress} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.pickupAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.pickupAddress && <p className="text-red-500 text-sm mt-1">{errors.pickupAddress}</p>}
            </div>

            <div>
              <input 
                type="text" 
                name="dropAddress" 
                placeholder="Drop Address" 
                value={formData.dropAddress} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                  errors.dropAddress ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.dropAddress && <p className="text-red-500 text-sm mt-1">{errors.dropAddress}</p>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <input 
                  type="date" 
                  name="pickupDate" 
                  value={formData.pickupDate} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.pickupDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupDate && <p className="text-red-500 text-sm mt-1">{errors.pickupDate}</p>}
              </div>

              <div>
                <input 
                  type="time" 
                  name="pickupTime" 
                  value={formData.pickupTime} 
                  onChange={handleChange} 
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                    errors.pickupTime ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.pickupTime && <p className="text-red-500 text-sm mt-1">{errors.pickupTime}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <select 
                  name="passengers" 
                  value={formData.passengers} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="1">1 Passenger</option>
                  <option value="2">2 Passengers</option>
                  <option value="3">3 Passengers</option>
                  <option value="4">4 Passengers</option>
                  <option value="5">5+ Passengers</option>
                </select>
              </div>

              <div>
                <select 
                  name="carType" 
                  value={formData.carType} 
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                  <option value="mini">Mini</option>
                </select>
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
                Processing...
              </div>
            ) : (
              'Book Now'
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 rounded-b-xl">
          <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
            We'll confirm your booking within 30 minutes
          </p>
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

export default BookingFormPopup; 