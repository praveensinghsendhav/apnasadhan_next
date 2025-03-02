"use client"
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface Booking {
  id: number;
  name: string;
  number: string;
  email?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupDate: string;
  status: string;
  price: string;
  createdAt: string;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');

  const fetchBookings = async () => {
    setLoading(true);
    const response = await fetch('/api/savebooking');
    const data = await response.json();
    setBookings(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleSort = () => {
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(a.pickupDate).getTime();
      const dateB = new Date(b.pickupDate).getTime();
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setBookings(sortedBookings);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedBookings = [...bookings];
    updatedBookings[index].status = newStatus;
    setBookings(updatedBookings);
  };

  const handleInputChange = (index: number, field: keyof Booking, value: string) => {
    const updatedBookings = [...bookings];
    updatedBookings[index][field] = value as never;
    setBookings(updatedBookings);
  };

  const addNewBooking = () => {
    const newBooking = {
      id: bookings.length + 1,
      name: '',
      number: '',
      email: '',
      pickupAddress: '',
      dropAddress: '',
      pickupDate: '',
      status: 'pending',
      price: '',
      createdAt: new Date().toISOString(),
    };
    setBookings([...bookings, newBooking]);
  };

  const deleteBooking = (index: number) => {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/savebooking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookings),
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

  const filterBookingsByDateRange = () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates.');
      return;
    }

    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    if (start > end) {
      toast.error('Start date cannot be after end date.');
      return;
    }

    const filteredBookings = bookings.filter((booking) => {
      const bookingDate = new Date(booking.pickupDate).getTime();
      return bookingDate >= start && bookingDate <= end;
    });

    if (filteredBookings.length === 0) {
      toast.info('No bookings found in the selected date range.');
    }

    setBookings(filteredBookings);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Bookings</h1>
      <h2 style={{ textAlign: 'center', marginBottom: '10px', color: '#555' }}>Manage Your Bookings</h2>
      <p style={{ textAlign: 'center', marginBottom: '20px', color: '#777' }}>
        Edit the details of your bookings below and save the changes.
      </p>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{ marginRight: '10px' }}
        />
        <button
          onClick={filterBookingsByDateRange}
          style={{ padding: '10px', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
        >
          Filter by Date Range
        </button>
      </div>
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
          <button onClick={handleSort} style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Sort by Date ({sortOrder})
          </button>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '2000px' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ccc', padding: '10px', width: '300px' }}>Name</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Number</th>
                <th style={{ border: '1px solid #ccc', padding: '10px', width: '400px' }}>Email</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Pickup Address</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Drop Address</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Pickup Date</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Status</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Price</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Date</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}>Time</th>
                <th style={{ border: '1px solid #ccc', padding: '10px' }}></th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={booking.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={booking.number}
                      onChange={(e) => handleInputChange(index, 'number', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="email"
                      value={booking.email}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={booking.pickupAddress}
                      onChange={(e) => handleInputChange(index, 'pickupAddress', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={booking.dropAddress}
                      onChange={(e) => handleInputChange(index, 'dropAddress', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="date"
                      value={booking.pickupDate}
                      onChange={(e) => handleInputChange(index, 'pickupDate', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                      style={{ width: '100%' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <input
                      type="text"
                      value={booking.price}
                      onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                      style={{ width: '100%' }}
                    />
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    {new Date(booking.createdAt).toLocaleTimeString()}
                  </td>
                  <td style={{ border: '1px solid #ccc', padding: '10px' }}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      onClick={() => deleteBooking(index)}
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
          onClick={addNewBooking}
          className="w-full sm:w-auto px-4 py-2 bg-green-600 text-white border-none rounded cursor-pointer"
        >
          Add New Booking
        </button>
        <button
          onClick={saveChanges}
          className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white border-none rounded cursor-pointer"
        >
          Save Changes
        </button>
        <button
          onClick={fetchBookings}
          className="w-full sm:w-auto px-4 py-2 bg-gray-600 text-white border-none rounded cursor-pointer"
        >
          Reset Data
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookingsPage;
