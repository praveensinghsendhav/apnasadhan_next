"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Cars() {
  // Define a type for the car object
  type Car = {
    id: number;
    name: string;
    image: string;
    capacity: string;
    luggage: string;
    musicPlayer: boolean;
    ac: boolean;
    rate: string;
  };

  // Use the Car type for the cars state
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from /api/cars');
      const response = await fetch('/api/cars');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data fetched:', data);
      setCars(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedCars = [...cars];
    updatedCars[index][field] = value;
    setCars(updatedCars);
  };

  const addNewCar = () => {
    const newCar = {
      id: cars.length + 1,
      name: '',
      image: '',
      capacity: '',
      luggage: '',
      musicPlayer: false,
      ac: false,
      rate: ''
    };
    setCars([...cars, newCar]);
  };

  const deleteCar = (index) => {
    const updatedCars = cars.filter((_, i) => i !== index);
    setCars(updatedCars);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(cars),
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Cars</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage Your Cars</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        Edit the details of your cars below and save the changes.
      </p>
      {loading ? (
        <div style={{ textAlign: 'center', margin: '20px 0' }}>
          <p>Loading...</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <style jsx>{`
            div::-webkit-scrollbar {
              display: none;
            }
          `}</style>
          <div style={{ marginBottom: '15px', padding: '10px', display: 'flex', borderRadius: '5px', justifyContent: 'space-between', minWidth: '800px' }}>
            <span style={{ marginRight: '0px', padding: '5px', width: '15%' }}>Name</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '15%' }}>Image</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '15%' }}>Capacity</span>
            <span style={{ marginRight: '25px', padding: '5px', width: '12%' }}>Luggage</span>
            <span style={{ marginRight: '10px', padding: '5px', width: '10%' }}>Music</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '10%' }}>AC</span>
            <span style={{ marginRight: '10px', padding: '5px', width: '10%' }}>Rate</span>
          </div>
          {cars.map((car: any, index: number) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', minWidth: '800px' }}>
              <input
                type="text"
                value={car.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Car Name"
              />
              <input
                type="text"
                value={car.image}
                onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Image URL"
              />
              <input
                type="text"
                value={car.capacity}
                onChange={(e) => handleInputChange(index, 'capacity', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Capacity"
              />
              <input
                type="text"
                value={car.luggage}
                onChange={(e) => handleInputChange(index, 'luggage', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Luggage"
              />
              <input
                type="checkbox"
                checked={car.musicPlayer}
                onChange={(e) => handleInputChange(index, 'musicPlayer', e.target.checked)}
                style={{ marginRight: '10px', padding: '5px', width: '10%' }}
              />
              <input
                type="checkbox"
                checked={car.ac}
                onChange={(e) => handleInputChange(index, 'ac', e.target.checked)}
                style={{ marginRight: '10px', padding: '5px', width: '10%' }}
              />
              <input
                type="text"
                value={car.rate}
                onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                style={{ padding: '5px', width: '10%' }}
                placeholder="Rate"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteCar(index)}
                style={{ color: '#dc3545', cursor: 'pointer', paddingTop: '7px', paddingLeft: '10px' }}
              />
            </div>
          ))}
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-5">
        <button
          onClick={addNewCar}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer"
        >
          Add New Car
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
