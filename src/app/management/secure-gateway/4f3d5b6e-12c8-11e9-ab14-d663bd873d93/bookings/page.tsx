"use client"
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faPlus, 
  faSave, 
  faRefresh, 
  faCalendarAlt, 
  faSort,
  faSearch,
  faEdit,
  faCheck,
  faTimes,
  faDownload,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface Booking {
  id?: string;
  name: string;
  number: string;
  email?: string;
  pickupAddress: string;
  dropAddress: string;
  pickupDate: string;
  pickupTime: string;
  passengers: string;
  carType: string;
  status: string;
  price?: string;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [loading, setLoading] = useState<boolean>(true);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [originalBookings, setOriginalBookings] = useState<Booking[]>([]);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchBookings = async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    try {
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/savebooking?limit=${limit}&offset=${offset}`);
      const data = await response.json();
      
      if (data.bookings) {
        setBookings(data.bookings);
        setOriginalBookings(data.bookings);
        setPagination(data.pagination);
      } else {
        // Fallback for old API format
        setBookings(data);
        setOriginalBookings(data);
        setPagination({
          total: data.length,
          limit,
          offset,
          hasMore: offset + limit < data.length
        });
      }
      setLoading(false);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      toast.error('Failed to load bookings');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings(currentPage, pagination.limit);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit }));
    setCurrentPage(1);
    fetchBookings(1, newLimit);
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch('/api/savebooking?download=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'bookings.csv';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        toast.success('CSV file downloaded successfully!');
      } else {
        throw new Error('Failed to download CSV');
      }
    } catch (error) {
      console.error('Error downloading CSV:', error);
      toast.error('Failed to download CSV file');
    }
  };

  const handleSort = () => {
    const sortedBookings = [...bookings].sort((a, b) => {
      const dateA = new Date(a.pickupDate).getTime();
      const dateB = new Date(b.pickupDate).getTime();
      
      if (isNaN(dateA) && isNaN(dateB)) return 0;
      if (isNaN(dateA)) return 1;
      if (isNaN(dateB)) return -1;
      
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });
    setBookings(sortedBookings);
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    toast.info(`Sorted by date (${sortOrder === 'asc' ? 'Oldest first' : 'Newest first'})`);
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
      id: `BK${Date.now()}`, // Use timestamp as temporary ID
      name: '',
      number: '',
      email: '',
      pickupAddress: '',
      dropAddress: '',
      pickupDate: '',
      pickupTime: '',
      passengers: '1',
      carType: 'sedan',
      status: 'pending',
      price: '',
      createdAt: new Date().toISOString(),
    };
    setBookings([newBooking, ...bookings]);
    setEditingId(newBooking.id);
    toast.info('New booking added. Please fill in the details.');
  };

  const deleteBooking = (index: number) => {
    const bookingToDelete = bookings[index];
    if (window.confirm(`Are you sure you want to delete the booking for ${bookingToDelete.name}?`)) {
    const updatedBookings = bookings.filter((_, i) => i !== index);
    setBookings(updatedBookings);
      toast.success('Booking deleted successfully');
    }
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
        toast.success('All changes saved successfully!');
        setOriginalBookings([...bookings]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes. Please try again.');
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

    // For date filtering, we need to fetch all data and filter client-side
    // since the API doesn't support date range filtering yet
    fetch('/api/savebooking?limit=1000&offset=0')
      .then(response => response.json())
      .then(data => {
        const allBookings = data.bookings || data;
        const filteredBookings = allBookings.filter((booking: Booking) => {
          const bookingDate = new Date(booking.pickupDate).getTime();
          return bookingDate >= start && bookingDate <= end;
        });

        if (filteredBookings.length === 0) {
          toast.info('No bookings found in the selected date range.');
        }

        setBookings(filteredBookings);
        setPagination({
          total: filteredBookings.length,
          limit: pagination.limit,
          offset: 0,
          hasMore: filteredBookings.length > pagination.limit
        });
        setCurrentPage(1);
      })
      .catch(error => {
        console.error('Error filtering bookings:', error);
        toast.error('Failed to filter bookings');
      });
  };

  const resetFilters = () => {
    setStartDate('');
    setEndDate('');
    setSearchTerm('');
    setCurrentPage(1);
    fetchBookings(1, pagination.limit);
    toast.info('Filters reset');
  };

  // For search functionality, we'll filter the current page data
  // In a production app, you'd want to implement server-side search
  const filteredBookings = searchTerm 
    ? bookings.filter(booking =>
        booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.number.includes(searchTerm) ||
        booking.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickupAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.dropAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (booking.pickupTime && booking.pickupTime.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.passengers && booking.passengers.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (booking.carType && booking.carType.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : bookings;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bookings Management</h1>
          <p className="text-gray-600">Manage and track all your customer bookings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-blue-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <FontAwesomeIcon icon={faEdit} className="text-yellow-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <FontAwesomeIcon icon={faCheck} className="text-green-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FontAwesomeIcon icon={faSearch} className="text-purple-600 text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Current Page</p>
                <p className="text-2xl font-bold text-gray-900">{currentPage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <FontAwesomeIcon icon={faSearch} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search bookings..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Date Range Filter */}
              <div className="flex items-center gap-2">
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
                <span className="text-gray-500">to</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          onClick={filterBookingsByDateRange}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Filter
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <button
                  onClick={handleSort}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faSort} />
                  Sort ({sortOrder})
                </button>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gray-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addNewBooking}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Booking
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FontAwesomeIcon icon={faSave} />
                Save All Changes
              </button>
              <button
                onClick={() => fetchBookings(currentPage, pagination.limit)}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2 font-medium"
              >
                <FontAwesomeIcon icon={faRefresh} />
                Refresh Data
        </button>
        <button
          onClick={downloadCSV}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <FontAwesomeIcon icon={faDownload} />
          Download CSV
        </button>
      </div>
          </div>
        </div>

        {/* Bookings Table */}
      {loading ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400 text-4xl mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
        </div>
      ) : (
                     <div className="bg-white rounded-lg shadow overflow-hidden">
             <div className="overflow-x-auto">
               <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1600px' }}>
                                 <thead className="bg-gray-50">
                   <tr>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '150px' }}>Customer</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Phone</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '180px' }}>Email</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '200px' }}>Journey</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Pickup Date</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Pickup Time</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Passengers</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Car Type</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Status</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '100px' }}>Price</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '120px' }}>Created</th>
                     <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider" style={{ width: '80px' }}>Actions</th>
              </tr>
            </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredBookings.map((booking, index) => (
                                         <tr key={booking.id || index} className="hover:bg-gray-50">
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '150px' }}>
                    <input
                      type="text"
                      value={booking.name}
                      onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                           placeholder="Customer name"
                    />
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '120px' }}>
                    <input
                           type="tel"
                      value={booking.number}
                      onChange={(e) => handleInputChange(index, 'number', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                           placeholder="Phone number"
                    />
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '180px' }}>
                    <input
                      type="email"
                           value={booking.email || ''}
                      onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                           placeholder="Email (optional)"
                    />
                  </td>
                                             <td className="px-4 py-4 whitespace-nowrap" style={{ width: '200px' }}>
                         <div className="space-y-1">
                    <input
                      type="text"
                      value={booking.pickupAddress}
                      onChange={(e) => handleInputChange(index, 'pickupAddress', e.target.value)}
                             className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                             placeholder="Pickup address"
                    />
                           <div className="text-gray-400 text-xs text-center">→</div>
                    <input
                      type="text"
                      value={booking.dropAddress}
                      onChange={(e) => handleInputChange(index, 'dropAddress', e.target.value)}
                             className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                             placeholder="Drop address"
                    />
                         </div>
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '120px' }}>
                    <input
                      type="date"
                      value={booking.pickupDate}
                      onChange={(e) => handleInputChange(index, 'pickupDate', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '100px' }}>
                    <input
                      type="time"
                      value={booking.pickupTime || ''}
                      onChange={(e) => handleInputChange(index, 'pickupTime', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                           placeholder="Time"
                    />
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '100px' }}>
                    <input
                      type="number"
                      value={booking.passengers || ''}
                      onChange={(e) => handleInputChange(index, 'passengers', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                           placeholder="Passengers"
                           min="1"
                    />
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '100px' }}>
                    <select
                      value={booking.carType || 'sedan'}
                      onChange={(e) => handleInputChange(index, 'carType', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="sedan">Sedan</option>
                      <option value="suv">SUV</option>
                      <option value="hatchback">Hatchback</option>
                      <option value="luxury">Luxury</option>
                      <option value="mini">Mini</option>
                    </select>
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '100px' }}>
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(index, e.target.value)}
                           className={`w-full px-2 py-1 border rounded text-xs font-medium ${getStatusColor(booking.status)}`}
                    >
                      <option value="pending">Pending</option>
                      <option value="completed">Completed</option>
                    </select>
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap" style={{ width: '100px' }}>
                    <input
                      type="text"
                           value={booking.price || ''}
                      onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                           className="w-full px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                           placeholder="Price"
                    />
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500" style={{ width: '120px' }}>
                         <div className="text-xs">{formatDate(booking.createdAt)}</div>
                         <div className="text-xs">{formatTime(booking.createdAt)}</div>
                  </td>
                       <td className="px-4 py-4 whitespace-nowrap text-center" style={{ width: '80px' }}>
                         <button
                      onClick={() => deleteBooking(index)}
                           className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                           title="Delete booking"
                         >
                           <FontAwesomeIcon icon={faTrash} />
                         </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            </div>
        </div>
      )}

      {/* Pagination Controls */}
      {!loading && pagination.total > 0 && (
        <div className="bg-white rounded-lg shadow mt-6 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} bookings
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage <= 1}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FontAwesomeIcon icon={faChevronLeft} />
                Previous
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, Math.ceil(pagination.total / pagination.limit)) }, (_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-2 text-sm font-medium rounded-lg ${
                        currentPage === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasMore}
                className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
                <FontAwesomeIcon icon={faChevronRight} />
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
      <ToastContainer position="top-right" />
    </div>
  );
};

export default BookingsPage;