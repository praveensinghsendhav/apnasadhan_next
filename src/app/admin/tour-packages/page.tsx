"use client"
import { Metadata } from "next";
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TourPackages() {
  // Define a type for the package object
  type Package = {
    name: string;
    imageUrl: string;
    city: string;
    social: { instagram: string };
  };

  // Use the Package type for the packages state
  const [packages, setPackages] = useState<Package[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/tourpackages');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setPackages(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedPackages = [...packages];
    updatedPackages[index][field] = value;
    setPackages(updatedPackages);
  };

  const addNewPackage = () => {
    const newPackage = {
      name: '',
      imageUrl: '',
      city: '',
      social: { instagram: '' }
    };
    setPackages([...packages, newPackage]);
  };

  const deletePackage = (index) => {
    const updatedPackages = packages.filter((_, i) => i !== index);
    setPackages(updatedPackages);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/tourpackages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packages),
      });

      if (response.ok) {
        toast.success('Changes saved!');
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes.');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Tour Packages</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage Your Tour Packages</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        Edit the details of your tour packages below and save the changes.
      </p>
      <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
        <div style={{ overflowX: 'auto', maxHeight: '400px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', minWidth: '800px' }}>
            <span style={{ marginRight: '0px', padding: '5px', width: '20%' }}>Name</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '20%' }}>Image URL</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '20%' }}>City</span>
            <span style={{ marginRight: '25px', padding: '5px', width: '20%' }}>Instagram</span>
          </div>
          {packages.map((pkg, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', minWidth: '800px' }}>
              <input
                type="text"
                value={pkg.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '20%' }}
                placeholder="Package Name"
              />
              <input
                type="text"
                value={pkg.imageUrl}
                onChange={(e) => handleInputChange(index, 'imageUrl', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '20%' }}
                placeholder="Image URL"
              />
              <input
                type="text"
                value={pkg.city}
                onChange={(e) => handleInputChange(index, 'city', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '20%' }}
                placeholder="City"
              />
              <input
                type="text"
                value={pkg.social.instagram}
                onChange={(e) => handleInputChange(index, 'social.instagram', e.target.value)}
                style={{ padding: '5px', width: '20%' }}
                placeholder="Instagram"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deletePackage(index)}
                style={{ color: '#dc3545', cursor: 'pointer', paddingTop: '7px' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-5">
        <button
          onClick={addNewPackage}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer"
        >
          Add New Package
        </button>
        <button
          onClick={saveChanges}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer"
        >
          Save Changes
        </button>
        <button
          onClick={fetchData}
          className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer"
        >
          Reset Data
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}
