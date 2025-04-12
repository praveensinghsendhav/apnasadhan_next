"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

export default function Tickets() {
  // Define a type for the ticket object
  type Ticket = {
    name: string;
    email: string;
    phone: string;
    message: string;
  };

  // Use the Ticket type for the tickets state
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      console.log('Fetching data from /api/tickets');
      const response = await fetch('/api/tickets');
      console.log('Response status:', response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log('Data fetched:', data);
      setTickets(data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const deleteTicket = async (index: number) => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ index }),
      });

      if (response.ok) {
        const updatedTickets = tickets.filter((_, i) => i !== index);
        setTickets(updatedTickets);
        toast.success('Ticket deleted successfully');
      } else {
        throw new Error('Failed to delete ticket');
      }
    } catch (error) {
      console.error('Error deleting ticket:', error);
      toast.error('Failed to delete ticket');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Tickets</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage Your Tickets</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        View and manage the submitted tickets below.
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
            <span style={{ marginRight: '0px', padding: '5px', width: '20%' }}>Name</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '20%' }}>Email</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '20%' }}>Phone</span>
            <span style={{ marginRight: '0px', padding: '5px', width: '30%' }}>Message</span>
          </div>
          {tickets.map((ticket: Ticket, index: number) => (
            <div key={index} style={{ marginBottom: '15px', padding: '10px', border: '1px solid #ccc', borderRadius: '5px', display: 'flex', justifyContent: 'space-between', minWidth: '800px' }}>
              <span style={{ marginRight: '10px', padding: '5px', width: '20%' }}>{ticket.name}</span>
              <span style={{ marginRight: '10px', padding: '5px', width: '20%', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{ticket.email}</span>
              <span style={{ marginRight: '10px', padding: '5px', width: '20%' }}>{ticket.phone}</span>
              <span style={{ marginRight: '10px', padding: '5px', width: '30%', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>{ticket.message}</span>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteTicket(index)}
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
