"use client"
import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faPlus, 
  faSave, 
  faRefresh, 
  faTicketAlt,
  faSearch,
  faEdit,
  faEye,
  faEnvelope,
  faPhone,
  faUser,
  faMessage,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faDownload,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface Ticket {
  id?: number;
  name: string;
  email: string;
  phone: string;
  message: string;
  status?: 'pending' | 'in-progress' | 'resolved';
  createdAt?: string;
  priority?: 'low' | 'medium' | 'high';
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const TicketsPage = () => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [originalTickets, setOriginalTickets] = useState<Ticket[]>([]);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchData = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/tickets?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.tickets) {
        // Add default values for new fields if they don't exist
        const processedData = data.tickets.map((ticket: Ticket, index: number) => ({
          ...ticket,
          id: ticket.id || Date.now() + index,
          status: ticket.status || 'pending',
          createdAt: ticket.createdAt || new Date().toISOString(),
          priority: ticket.priority || 'medium'
        }));
        setTickets(processedData);
        setOriginalTickets(processedData);
        setPagination(data.pagination);
      } else {
        // Fallback for old API format
        const processedData = data.map((ticket: Ticket, index: number) => ({
          ...ticket,
          id: ticket.id || Date.now() + index,
          status: ticket.status || 'pending',
          createdAt: ticket.createdAt || new Date().toISOString(),
          priority: ticket.priority || 'medium'
        }));
        setTickets(processedData);
        setOriginalTickets(processedData);
        setPagination({
          total: data.length,
          limit,
          offset,
          hasMore: offset + limit < data.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage, pagination.limit);
  }, [currentPage, pagination.limit]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit }));
    setCurrentPage(1);
    fetchData(1, newLimit);
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch('/api/tickets?download=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'support-tickets.csv';
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

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field as keyof Ticket] = value as never;
    setTickets(updatedTickets);
  };

  const addNewTicket = () => {
    const newTicket: Ticket = {
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      message: '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      priority: 'medium'
    };
    setTickets([newTicket, ...tickets]);
    toast.info('New ticket added. Please fill in the details.');
  };

  const deleteTicket = async (index: number) => {
    const ticketToDelete = tickets[index];
    if (window.confirm(`Are you sure you want to delete the ticket from "${ticketToDelete.name}"?`)) {
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
    }
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tickets),
      });

      if (response.ok) {
        toast.success('All tickets saved successfully!');
        setOriginalTickets([...tickets]);
      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      toast.error('Failed to save changes. Please try again.');
    }
  };

  const resetData = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setPriorityFilter('all');
    setCurrentPage(1);
    fetchData(1, pagination.limit);
    toast.info('Data reset to original state');
  };

  // For search functionality, we'll filter the current page data
  // In a production app, you'd want to implement server-side search
  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = 
      ticket.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || ticket.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || ticket.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return faClock;
      case 'in-progress': return faEdit;
      case 'resolved': return faCheckCircle;
      default: return faTicketAlt;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Support Tickets Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage customer support tickets, track their status, and provide excellent service
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FontAwesomeIcon icon={faTicketAlt} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
                <FontAwesomeIcon icon={faClock} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FontAwesomeIcon icon={faEdit} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'in-progress').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Resolved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {tickets.filter(t => t.status === 'resolved').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-lg mb-6 border border-gray-100">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="flex items-center border border-gray-300 rounded-xl focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                  <FontAwesomeIcon icon={faSearch} className="ml-3 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tickets..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-3 border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-3">
                <select
                  value={pagination.limit}
                  onChange={(e) => handleLimitChange(parseInt(e.target.value))}
                  className="px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
                <select
                  value={priorityFilter}
                  onChange={(e) => setPriorityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
                <button
                  onClick={() => setPreviewMode(!previewMode)}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faEye} />
                  {previewMode ? 'Edit Mode' : 'Preview Mode'}
                </button>
                <button
                  onClick={resetData}
                  className="px-4 py-2 bg-gray-500 text-white rounded-xl hover:bg-gray-600 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faRefresh} />
                  Reset
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addNewTicket}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Ticket
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faSave} />
                Save All Changes
              </button>
              <button
                onClick={() => fetchData(currentPage, pagination.limit)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faRefresh} />
                Refresh Data
              </button>
              <button
                onClick={downloadCSV}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Tickets Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading tickets...</p>
          </div>
        ) : filteredTickets.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faTicketAlt} className="text-gray-400 text-6xl mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No tickets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or add a new ticket</p>
            <button
              onClick={addNewTicket}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Add Your First Ticket
            </button>
          </div>
        ) : previewMode ? (
          // Preview Mode - Card Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTickets.map((ticket, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faTicketAlt} className="text-blue-500" />
                      <span className="text-sm text-gray-500">#{ticket.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority || 'medium')}`}>
                        {ticket.priority || 'medium'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status || 'pending')}`}>
                        {ticket.status || 'pending'}
                      </span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{ticket.name || 'Anonymous'}</h4>
                        <p className="text-sm text-gray-600">{ticket.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faPhone} />
                        {ticket.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {formatDate(ticket.createdAt || new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                  
                  {/* Message */}
                  <div className="mb-4">
                    <div className="flex items-start gap-2">
                      <FontAwesomeIcon icon={faMessage} className="text-gray-400 mt-1" />
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {ticket.message || 'No message available'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon 
                        icon={getStatusIcon(ticket.status || 'pending')} 
                        className={`text-lg ${
                          ticket.status === 'resolved' ? 'text-green-500' : 
                          ticket.status === 'in-progress' ? 'text-blue-500' : 'text-yellow-500'
                        }`} 
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {ticket.status || 'pending'}
                      </span>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteTicket(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete ticket"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // Edit Mode - Table Layout
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1400px' }}>
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>ID</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '180px' }}>Email</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '130px' }}>Phone</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '250px' }}>Message</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Priority</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredTickets.map((ticket, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{ticket.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={ticket.name}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Name"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="email"
                          value={ticket.email}
                          onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Email"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="tel"
                          value={ticket.phone}
                          onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Phone"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <textarea
                          value={ticket.message}
                          onChange={(e) => handleInputChange(index, 'message', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                          placeholder="Message"
                          rows={3}
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={ticket.status}
                          onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="in-progress">In Progress</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={ticket.priority}
                          onChange={(e) => handleInputChange(index, 'priority', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteTicket(index)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete ticket"
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
        <div className="bg-white rounded-xl shadow-lg mt-6 p-4 border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} tickets
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

export default TicketsPage;
