"use client"
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface WorkWithUs {
  id: number;
  carName: string;
  carCapacity: string;
  model: string;
  rate: string;
  city: string;
  contactNumber: string;
  status: string;
  createdAt: string;
}

const WorkWithUsPage = () => {
  const [workWithUsData, setWorkWithUsData] = useState<WorkWithUs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchWorkWithUsData = async () => {
    setLoading(true);
    const response = await fetch('/api/saveworkwithus');
    const data = await response.json();
    setWorkWithUsData(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkWithUsData();
  }, []);

  const handleInputChange = (index: number, field: keyof WorkWithUs, value: string) => {
    const updatedData = [...workWithUsData];
    updatedData[index][field] = value as never;
    setWorkWithUsData(updatedData);
  };

  const addNewEntry = () => {
    const newEntry = {
      id: workWithUsData.length + 1,
      carName: '',
      carCapacity: '',
      model: '',
      rate: '',
      city: '',
      contactNumber: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setWorkWithUsData([...workWithUsData, newEntry]);
  };

  const deleteEntry = (index: number) => {
    const updatedData = workWithUsData.filter((_, i) => i !== index);
    setWorkWithUsData(updatedData);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/saveworkwithus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workWithUsData),
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Work With Us</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage Your Entries</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        Edit the details of your entries below and save the changes.
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
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '2000px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Car Name</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Car Capacity</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Model</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Rate</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>City</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Contact Number</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Status</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Date</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Time</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}></th>
              </tr>
            </thead>
            <tbody>
              {workWithUsData.map((entry, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={entry.carName}
                      onChange={(e) => handleInputChange(index, 'carName', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={entry.carCapacity}
                      onChange={(e) => handleInputChange(index, 'carCapacity', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={entry.model}
                      onChange={(e) => handleInputChange(index, 'model', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={entry.rate}
                      onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={entry.city}
                      onChange={(e) => handleInputChange(index, 'city', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={entry.contactNumber}
                      onChange={(e) => handleInputChange(index, 'contactNumber', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <select
                      value={entry.status}
                      onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {new Date(entry.createdAt).toLocaleTimeString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteEntry(index)}
                      style={{ color: '#dc3545', cursor: 'pointer', paddingTop: '7px', paddingLeft: '10px' }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-5">
        <button
          onClick={addNewEntry}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer"
        >
          Add New Entry
        </button>
        <button
          onClick={saveChanges}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer"
        >
          Save Changes
        </button>
        <button
          onClick={fetchWorkWithUsData}
          className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer"
        >
          Reset Data
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default WorkWithUsPage;