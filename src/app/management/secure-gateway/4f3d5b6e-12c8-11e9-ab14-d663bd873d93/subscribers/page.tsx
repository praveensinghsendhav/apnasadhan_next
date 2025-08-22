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
  faUsers,
  faSearch,
  faEdit,
  faEye,
  faEnvelope,
  faPhone,
  faUser,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faDownload,
  faFilter,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface Subscriber {
  id?: number;
  name: string;
  email: string;
  phone: string;
  status?: 'active' | 'inactive' | 'pending';
  subscribedAt?: string;
  source?: 'website' | 'newsletter' | 'referral' | 'social';
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const SubscribersPage = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [originalSubscribers, setOriginalSubscribers] = useState<Subscriber[]>([]);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  
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
      const response = await fetch(`/api/subscribers?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.subscribers) {
        // Add default values for new fields if they don't exist
        const processedData = data.subscribers.map((subscriber: Subscriber, index: number) => ({
          ...subscriber,
          id: subscriber.id || Date.now() + index,
          status: subscriber.status || 'active',
          subscribedAt: subscriber.subscribedAt || new Date().toISOString(),
          source: subscriber.source || 'website'
        }));
        setSubscribers(processedData);
        setOriginalSubscribers(processedData);
        setPagination(data.pagination);
      } else {
        // Fallback for old API format
        const processedData = data.map((subscriber: Subscriber, index: number) => ({
          ...subscriber,
          id: subscriber.id || Date.now() + index,
          status: subscriber.status || 'active',
          subscribedAt: subscriber.subscribedAt || new Date().toISOString(),
          source: subscriber.source || 'website'
        }));
        setSubscribers(processedData);
        setOriginalSubscribers(processedData);
        setPagination({
          total: data.length,
          limit,
          offset,
          hasMore: offset + limit < data.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load subscribers');
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

  const handleInputChange = (index: number, field: string, value: any) => {
    const updatedSubscribers = [...subscribers];
    updatedSubscribers[index][field as keyof Subscriber] = value as never;
    setSubscribers(updatedSubscribers);
  };

  const addNewSubscriber = () => {
    const newSubscriber: Subscriber = {
      id: Date.now(),
      name: '',
      email: '',
      phone: '',
      status: 'active',
      subscribedAt: new Date().toISOString(),
      source: 'website'
    };
    setSubscribers([newSubscriber, ...subscribers]);
    toast.info('New subscriber added. Please fill in the details.');
  };

  const deleteSubscriber = async (index: number) => {
    const subscriberToDelete = subscribers[index];
    if (window.confirm(`Are you sure you want to delete the subscriber "${subscriberToDelete.name}"?`)) {
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
    }
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/subscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscribers),
      });

      if (response.ok) {
        toast.success('All subscribers saved successfully!');
        setOriginalSubscribers([...subscribers]);
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
    setSourceFilter('all');
    setCurrentPage(1);
    fetchData(1, pagination.limit);
    toast.info('Data reset to original state');
  };

  const exportSubscribers = () => {
    const csvContent = [
      ['Name', 'Email', 'Phone', 'Status', 'Source', 'Subscribed At'],
      ...filteredSubscribers.map(sub => [
        sub.name,
        sub.email,
        sub.phone,
        sub.status || 'active',
        sub.source || 'website',
        formatDate(sub.subscribedAt || new Date().toISOString())
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('Subscribers exported successfully!');
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch('/api/subscribers?download=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'subscribers.csv';
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

  const filteredSubscribers = subscribers.filter(subscriber => {
    const matchesSearch = 
      subscriber.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscriber.phone.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || subscriber.status === statusFilter;
    const matchesSource = sourceFilter === 'all' || subscriber.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'website': return 'bg-blue-100 text-blue-800';
      case 'newsletter': return 'bg-purple-100 text-purple-800';
      case 'referral': return 'bg-orange-100 text-orange-800';
      case 'social': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return faCheckCircle;
      case 'inactive': return faExclamationTriangle;
      case 'pending': return faClock;
      default: return faUser;
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
            Subscribers Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage your newsletter subscribers, track their engagement, and grow your audience
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FontAwesomeIcon icon={faUsers} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscribers.filter(s => s.status === 'active').length}
                </p>
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
                  {subscribers.filter(s => s.status === 'pending').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <FontAwesomeIcon icon={faEnvelope} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">
                  {subscribers.filter(s => {
                    const subDate = new Date(s.subscribedAt || new Date());
                    const now = new Date();
                    return subDate.getMonth() === now.getMonth() && subDate.getFullYear() === now.getFullYear();
                  }).length}
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
                    placeholder="Search subscribers..."
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
                <select
                  value={sourceFilter}
                  onChange={(e) => setSourceFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Sources</option>
                  <option value="website">Website</option>
                  <option value="newsletter">Newsletter</option>
                  <option value="referral">Referral</option>
                  <option value="social">Social</option>
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
                onClick={addNewSubscriber}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Subscriber
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faSave} />
                Save All Changes
              </button>
              <button
                onClick={exportSubscribers}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faDownload} />
                Export CSV
              </button>
              <button
                onClick={downloadCSV}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faDownload} />
                Download CSV (API)
              </button>
              <button
                onClick={() => fetchData(currentPage, pagination.limit)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faRefresh} />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Subscribers Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading subscribers...</p>
          </div>
        ) : filteredSubscribers.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faUsers} className="text-gray-400 text-6xl mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No subscribers found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or add a new subscriber</p>
            <button
              onClick={addNewSubscriber}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Add Your First Subscriber
            </button>
          </div>
        ) : previewMode ? (
          // Preview Mode - Card Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSubscribers.map((subscriber, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faUser} className="text-blue-500" />
                      <span className="text-sm text-gray-500">#{subscriber.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getSourceColor(subscriber.source || 'website')}`}>
                        {subscriber.source || 'website'}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subscriber.status || 'active')}`}>
                        {subscriber.status || 'active'}
                      </span>
                    </div>
                  </div>
                  
                  {/* User Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{subscriber.name || 'Anonymous'}</h4>
                        <p className="text-sm text-gray-600">{subscriber.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faPhone} />
                        {subscriber.phone}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {formatDate(subscriber.subscribedAt || new Date().toISOString())}
                      </span>
                    </div>
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon 
                        icon={getStatusIcon(subscriber.status || 'active')} 
                        className={`text-lg ${
                          subscriber.status === 'active' ? 'text-green-500' : 
                          subscriber.status === 'inactive' ? 'text-red-500' : 'text-yellow-500'
                        }`} 
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {subscriber.status || 'active'}
                      </span>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteSubscriber(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete subscriber"
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
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1200px' }}>
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>ID</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '200px' }}>Email</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '130px' }}>Phone</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Source</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Subscribed At</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredSubscribers.map((subscriber, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{subscriber.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={subscriber.name}
                          onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Name"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="email"
                          value={subscriber.email}
                          onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Email"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="tel"
                          value={subscriber.phone}
                          onChange={(e) => handleInputChange(index, 'phone', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Phone"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={subscriber.status}
                          onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="active">Active</option>
                          <option value="inactive">Inactive</option>
                          <option value="pending">Pending</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={subscriber.source}
                          onChange={(e) => handleInputChange(index, 'source', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="website">Website</option>
                          <option value="newsletter">Newsletter</option>
                          <option value="referral">Referral</option>
                          <option value="social">Social</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(subscriber.subscribedAt || new Date().toISOString())}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteSubscriber(index)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete subscriber"
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
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} subscribers
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

export default SubscribersPage;
