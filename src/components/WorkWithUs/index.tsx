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
  });

  const [errors, setErrors] = useState({
    carName: '',
    carCapacity: '',
    model: '',
    rate: '',
    city: '',
    contactNumber: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' }); // Clear error on change
  };

  const validateForm = () => {
    const { carName, carCapacity, model, rate, city, contactNumber } = formData;
    const phoneRegex = /^[0-9]{10}$/;
    let valid = true;
    const newErrors = { carName: '', carCapacity: '', model: '', rate: '', city: '', contactNumber: '' };

    if (!carName) {
      newErrors.carName = 'Car name is required.';
      valid = false;
    }

    if (!carCapacity) {
      newErrors.carCapacity = 'Car capacity is required.';
      valid = false;
    }

    if (!model) {
      newErrors.model = 'Model is required.';
      valid = false;
    }

    if (!rate) {
      newErrors.rate = 'Rate is required.';
      valid = false;
    }

    if (!city) {
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

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const workWithUsData = {
      ...formData,
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await fetch('/api/saveworkwithus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(workWithUsData),
    });

    resetForm();
    onClose();
  };

  const resetForm = () => {
    setFormData({
      carName: '',
      carCapacity: '',
      model: '',
      rate: '',
      city: '',
      contactNumber: '',
    });
    setErrors({
      carName: '',
      carCapacity: '',
      model: '',
      rate: '',
      city: '',
      contactNumber: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-99999 mx-2">
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-900 rounded-lg shadow-lg overflow-hidden p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-dark dark:text-white text-center underline">Work With Us</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            <input type="text" name="carName" placeholder="Car Name" value={formData.carName} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.carName && <p className="text-red-500 text-sm">{errors.carName}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="carCapacity" placeholder="Car Capacity" value={formData.carCapacity} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.carCapacity && <p className="text-red-500 text-sm">{errors.carCapacity}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="model" placeholder="Model" value={formData.model} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.model && <p className="text-red-500 text-sm">{errors.model}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="rate" placeholder="Rate" value={formData.rate} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.rate && <p className="text-red-500 text-sm">{errors.rate}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="city" placeholder="City" value={formData.city} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.city && <p className="text-red-500 text-sm">{errors.city}</p>}
          </div>
          <div className="mb-2">
            <input type="text" name="contactNumber" placeholder="Contact Number" value={formData.contactNumber} onChange={handleChange} className="w-full p-2 border rounded-lg" />
            {errors.contactNumber && <p className="text-red-500 text-sm">{errors.contactNumber}</p>}
          </div>
          <button type="submit" className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-green-600 transition-colors">Submit</button>
        </form>
        <button onClick={() => { resetForm(); onClose(); }} className="mt-4 text-red-500 w-full text-center">Close</button>
      </div>
    </div>
  );
};

export default WorkWithUsForm;
