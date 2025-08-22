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
  faCar,
  faSearch,
  faEdit,
  faEye,
  faPhone,
  faUser,
  faCalendarAlt,
  faClock,
  faCheckCircle,
  faExclamationTriangle,
  faMapMarkerAlt,
  faMoneyBillWave,
  faUsers,
  faFilter,
  faDownload,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';

interface WorkWithUs {
  id: string;
  carName: string;
  carCapacity: string;
  model: string;
  rate: string;
  city: string;
  contactNumber: string;
  ownerName: string;
  experience: string;
  carCondition: string;
  availability: string;
  status: string;
  createdAt: string;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const WorkWithUsPage = () => {
  const [workWithUsData, setWorkWithUsData] = useState<WorkWithUs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [originalData, setOriginalData] = useState<WorkWithUs[]>([]);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [cityFilter, setCityFilter] = useState<string>('all');
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchWorkWithUsData = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/saveworkwithus?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.workWithUsData) {
        setWorkWithUsData(data.workWithUsData);
        setOriginalData(data.workWithUsData);
        setPagination(data.pagination);
      } else {
        // Fallback for old API format
        setWorkWithUsData(data);
        setOriginalData(data);
        setPagination({
          total: data.length,
          limit,
          offset,
          hasMore: offset + limit < data.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load work with us data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkWithUsData(currentPage, pagination.limit);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleLimitChange = (newLimit: number) => {
    setPagination(prev => ({ ...prev, limit: newLimit }));
    setCurrentPage(1);
    fetchWorkWithUsData(1, newLimit);
  };

  const downloadCSV = async () => {
    try {
      const response = await fetch('/api/saveworkwithus?download=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'work-with-us.csv';
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

  const handleInputChange = (index: number, field: keyof WorkWithUs, value: string) => {
    const updatedData = [...workWithUsData];
    updatedData[index][field] = value as never;
    setWorkWithUsData(updatedData);
  };

  const addNewEntry = () => {
    const newEntry = {
      id: `WW${Date.now()}`, // Generate a temporary ID for new entries
      carName: '',
      carCapacity: '',
      model: '',
      rate: '',
      city: '',
      contactNumber: '',
      ownerName: '',
      experience: '',
      carCondition: 'excellent',
      availability: 'full-time',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setWorkWithUsData([newEntry, ...workWithUsData]);
    toast.info('New entry added. Please fill in the details.');
  };

  const deleteEntry = (index: number) => {
    const entryToDelete = workWithUsData[index];
    if (window.confirm(`Are you sure you want to delete the entry for "${entryToDelete.carName}"?`)) {
      const updatedData = workWithUsData.filter((_, i) => i !== index);
      setWorkWithUsData(updatedData);
      toast.success('Entry deleted successfully');
    }
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
        toast.success('All changes saved successfully!');
        setOriginalData([...workWithUsData]);
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
    setCityFilter('all');
    setCurrentPage(1);
    fetchWorkWithUsData(1, pagination.limit);
    toast.info('Data reset to original state');
  };

  const filteredData = workWithUsData.filter(entry => {
    const matchesSearch = 
      entry.carName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.contactNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (entry.ownerName && entry.ownerName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.experience && entry.experience.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.carCondition && entry.carCondition.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (entry.availability && entry.availability.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    const matchesCity = cityFilter === 'all' || entry.city === cityFilter;
    
    return matchesSearch && matchesStatus && matchesCity;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return faClock;
      case 'approved': return faCheckCircle;
      default: return faExclamationTriangle;
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

  const getUniqueCities = () => {
    const cities = workWithUsData.map(entry => entry.city).filter(city => city);
    return [...new Set(cities)];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Work With Us Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage partner applications, track car registrations, and grow your fleet network
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FontAwesomeIcon icon={faCar} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
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
                  {workWithUsData.filter(entry => entry.status === 'pending').length}
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
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-gray-900">
                  {workWithUsData.filter(entry => entry.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                <FontAwesomeIcon icon={faMapMarkerAlt} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Cities</p>
                <p className="text-2xl font-bold text-gray-900">
                  {getUniqueCities().length}
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
                    placeholder="Search applications..."
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
                  <option value="approved">Approved</option>
                </select>
                <select
                  value={cityFilter}
                  onChange={(e) => setCityFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="all">All Cities</option>
                  {getUniqueCities().map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
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
                <button
                  onClick={downloadCSV}
                  className="px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faDownload} />
                  Download CSV
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 bg-gradient-to-r from-gray-50 to-blue-50">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={addNewEntry}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Application
              </button>
              <button
                onClick={saveChanges}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faSave} />
                Save All Changes
              </button>
              <button
                onClick={() => fetchWorkWithUsData(currentPage, pagination.limit)}
                className="px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faRefresh} />
                Refresh Data
              </button>
            </div>
          </div>
        </div>

        {/* Applications Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading applications...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faCar} className="text-gray-400 text-6xl mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No applications found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or add a new application</p>
            <button
              onClick={addNewEntry}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Add Your First Application
            </button>
          </div>
        ) : previewMode ? (
          // Preview Mode - Card Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredData.map((entry, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon icon={faCar} className="text-blue-500" />
                      <span className="text-sm text-gray-500">#{entry.id}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(entry.status)}`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>
                  
                  {/* Car Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <FontAwesomeIcon icon={faCar} className="text-blue-600 text-lg" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{entry.carName || 'Car Name'}</h4>
                        <p className="text-sm text-gray-600">{entry.model || 'Model'}</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUsers} />
                        {entry.carCapacity || 'Capacity'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faMoneyBillWave} />
                        ₹{entry.rate || 'Rate'}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faUser} />
                        {entry.ownerName || 'Owner'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCalendarAlt} />
                        {entry.experience || '0'} years
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mt-2">
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faCheckCircle} />
                        {entry.carCondition || 'Condition'}
                      </span>
                      <span className="flex items-center gap-1">
                        <FontAwesomeIcon icon={faClock} />
                        {entry.availability || 'Availability'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Location & Contact */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faMapMarkerAlt} />
                      <span>{entry.city || 'City'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faPhone} />
                      <span>{entry.contactNumber || 'Contact'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <FontAwesomeIcon icon={faCalendarAlt} />
                      <span>{formatDate(entry.createdAt)}</span>
                    </div>
                  </div>
                  
                  {/* Status Icon */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FontAwesomeIcon 
                        icon={getStatusIcon(entry.status)} 
                        className={`text-lg ${
                          entry.status === 'approved' ? 'text-green-500' : 'text-yellow-500'
                        }`} 
                      />
                      <span className="text-sm text-gray-600 capitalize">
                        {entry.status}
                      </span>
                    </div>
                    
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteEntry(index)}
                      className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
                      title="Delete application"
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
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1800px' }}>
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>ID</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Car Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>Capacity</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>Model</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Rate</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>City</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Owner Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Contact</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>Experience</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>Condition</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '120px' }}>Availability</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Status</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Created At</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                        #{entry.id}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.carName}
                          onChange={(e) => handleInputChange(index, 'carName', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Car Name"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.carCapacity}
                          onChange={(e) => handleInputChange(index, 'carCapacity', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Capacity"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.model}
                          onChange={(e) => handleInputChange(index, 'model', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Model"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.rate}
                          onChange={(e) => handleInputChange(index, 'rate', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Rate"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.city}
                          onChange={(e) => handleInputChange(index, 'city', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="City"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.ownerName || ''}
                          onChange={(e) => handleInputChange(index, 'ownerName', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Owner Name"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="tel"
                          value={entry.contactNumber}
                          onChange={(e) => handleInputChange(index, 'contactNumber', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Contact"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <input
                          type="text"
                          value={entry.experience || ''}
                          onChange={(e) => handleInputChange(index, 'experience', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                          placeholder="Experience"
                        />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={entry.carCondition || 'excellent'}
                          onChange={(e) => handleInputChange(index, 'carCondition', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="excellent">Excellent</option>
                          <option value="good">Good</option>
                          <option value="fair">Fair</option>
                          <option value="poor">Poor</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={entry.availability || 'full-time'}
                          onChange={(e) => handleInputChange(index, 'availability', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="full-time">Full Time</option>
                          <option value="part-time">Part Time</option>
                          <option value="weekends">Weekends</option>
                          <option value="on-demand">On Demand</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={entry.status}
                          onChange={(e) => handleInputChange(index, 'status', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                        {formatDate(entry.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteEntry(index)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete application"
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
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} applications
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

export default WorkWithUsPage;