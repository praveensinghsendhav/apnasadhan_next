"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function UserSays() {
  const [userSays, setUserSays] = useState([]);

  const fetchData = async () => {
    try {
      const response = await fetch('/api/usersays');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUserSays(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (index, field, value) => {
    const updatedUserSays = [...userSays];
    updatedUserSays[index][field] = value;
    setUserSays(updatedUserSays);
  };

  const addNewUserSay = () => {
    const newUserSay = {
      id: userSays.length + 1,
      name: '',
      designation: '',
      content: '',
      image: '',
      star: 0
    };
    setUserSays([...userSays, newUserSay]);
  };

  const deleteUserSay = (index) => {
    const updatedUserSays = userSays.filter((_, i) => i !== index);
    setUserSays(updatedUserSays);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/usersays', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userSays),
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
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>User Testimonials</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage User Testimonials</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        Edit the details of user testimonials below and save the changes.
      </p>
      <div style={{ overflowX: 'auto', paddingBottom: '10px' }}>
        <div style={{ overflowX: 'auto', maxHeight: '400px', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', minWidth: '800px' }}>
            <span style={{ marginRight: '10px', padding: '5px', width: '15%' }}>Name</span>
            <span style={{ marginRight: '10px', padding: '5px', width: '15%' }}>Designation</span>
            <span style={{ marginRight: '10px', padding: '5px', width: '30%' }}>Content</span>
            <span style={{ marginRight: '10px', padding: '5px', width: '15%' }}>Image</span>
            <span style={{ marginRight: '25px', padding: '5px', width: '10%' }}>Stars</span>
          </div>
          {userSays.map((userSay, index) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', minWidth: '800px' }}>
              <input
                type="text"
                value={userSay.name}
                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Name"
              />
              <input
                type="text"
                value={userSay.designation}
                onChange={(e) => handleInputChange(index, 'designation', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Designation"
              />
              <input
                type="text"
                value={userSay.content}
                onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '30%' }}
                placeholder="Content"
              />
              <input
                type="text"
                value={userSay.image}
                onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '15%' }}
                placeholder="Image URL"
              />
              <input
                type="number"
                value={userSay.star}
                onChange={(e) => handleInputChange(index, 'star', e.target.value)}
                style={{ marginRight: '10px', padding: '5px', width: '10%' }}
                placeholder="Stars"
              />
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteUserSay(index)}
                style={{ color: '#dc3545', cursor: 'pointer', paddingTop: '7px' }}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4 mt-5">
        <button
          onClick={addNewUserSay}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer"
        >
          Add New Testimonial
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
