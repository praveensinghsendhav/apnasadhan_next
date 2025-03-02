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
  });

  const [errors, setErrors] = useState({
    name: '',
    number: '',
    email: '',
    pickupAddress: '',
    dropAddress: '',
    pickupDate: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'name' || name === 'pickupAddress' || name === 'dropAddress') {
      formattedValue = value.replace(/\b\w/g, char => char.toUpperCase());
    }

    setFormData({ ...formData, [name]: formattedValue });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const { name, number, email, pickupAddress, dropAddress, pickupDate } = formData;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    let valid = true;
    const newErrors = { name: '', number: '', email: '', pickupAddress: '', dropAddress: '', pickupDate: '' };

    if (!name) {
      newErrors.name = 'Name is required.';
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

    if (!pickupAddress) {
      newErrors.pickupAddress = 'Pickup address is required.';
      valid = false;
    }

    if (!dropAddress) {
      newErrors.dropAddress = 'Drop address is required.';
      valid = false;
    }

    if (!pickupDate) {
      newErrors.pickupDate = 'Pickup date is required.';
      valid = false;
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set time to midnight
      const selectedDate = new Date(pickupDate);
      if (selectedDate.getTime() < today.getTime()) {
        newErrors.pickupDate = 'Pickup date cannot be in the past.';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const bookingData = {
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await fetch('/api/savebooking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      number: '',
      email: '',
      pickupAddress: '',
      dropAddress: '',
      pickupDate: '',
    });
    setErrors({
      name: '',
      number: '',
      email: '',
      pickupAddress: '',
      dropAddress: '',
      pickupDate: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-99999 mx-2 ">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg overflow-hidden p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-dark dark:text-white text-center underline">Book a Cab</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="number" placeholder="Number" value={formData.number} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.number && <p className="text-red-500 text-sm">{errors.number}</p>}
          </div>
          <div className="mb-2">
            <input type="email" name="email" placeholder="Email (optional)" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="pickupAddress" placeholder="Pickup Address" value={formData.pickupAddress} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.pickupAddress && <p className="text-red-500 text-sm">{errors.pickupAddress}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="dropAddress" placeholder="Drop Address" value={formData.dropAddress} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.dropAddress && <p className="text-red-500 text-sm">{errors.dropAddress}</p>}
          </div>
          <div className="mb-2">
            <input type="date" name="pickupDate" value={formData.pickupDate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.pickupDate && <p className="text-red-500 text-sm">{errors.pickupDate}</p>}
          </div>
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-green-600 transition-colors">Book Now</button>
        </form>
        <button onClick={() => { resetForm(); onClose(); }} className="mt-4 text-red-500 w-full text-center">Close</button>
      </div>
    </div>
  );
};

export default BookingFormPopup; 