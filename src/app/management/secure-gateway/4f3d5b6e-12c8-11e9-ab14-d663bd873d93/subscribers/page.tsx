"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Subscribers() {
  // Define a type for the subscriber object
  type Subscriber = {
    name: string;
    email: string;
    phone: string;
  };

  // Use the Subscriber type for the subscribers state
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from /api/subscribers');
      const response = await fetch('/api/subscribers');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data fetched:', data);
      setSubscribers(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteSubscriber = async (index: number) => {
    try {
      const response = await fetch('/api/subscribers', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
      });

      if (response.ok) {
        const updatedSubscribers = subscribers.filter((_, i) => i !== index);
        setSubscribers(updatedSubscribers);
        toast.success('Subscriber deleted successfully');
      } else {
        throw new Error('Failed to delete subscriber');
      }
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Failed to delete subscriber');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Subscribers</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage Your Subscribers</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        View and manage the subscribers below.
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
            <span style={{ marginRight: '0px', padding: '5px', width: '30%' }}>Name</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '30%' }}>Email</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '30%' }}>Phone</span>
          </div>
          {subscribers.map((subscriber: Subscriber, index: number) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', minWidth: '800px' }}>
              <span style={{ marginRight: '10px', padding: '5px', width: '30%' }}>{subscriber.name}</span>
              <span style={{ marginRight: '10px', padding: '5px', width: '30%', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{subscriber.email}</span>
              <span style={{ marginRight: '10px', padding: '5px', width: '30%' }}>{subscriber.phone}</span>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteSubscriber(index)}
                style={{ color: '#dc3545', cursor: 'pointer', paddingTop: '7px', paddingLeft: '10px' }}
              />
            </div>
          ))}
        </div>
      )}
      <ToastContainer />
    </div>
  );
}
