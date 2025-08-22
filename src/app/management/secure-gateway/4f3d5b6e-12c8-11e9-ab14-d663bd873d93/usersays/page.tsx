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
  faUser,
  faImage,
  faSearch,
  faEdit,
  faEye,
  faStar,
  faQuoteLeft,
  faBriefcase,
  faDownload,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

interface UserSay {
    id: number;
    name: string;
    designation: string;
    content: string;
    image: string;
    star: number;
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const UserSaysPage = () => {
  const [userSays, setUserSays] = useState<UserSay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [originalUserSays, setOriginalUserSays] = useState<UserSay[]>([]);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
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
      const response = await fetch(`/api/usersays?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.userSays) {
        setUserSays(data.userSays);
        setOriginalUserSays(data.userSays);
        setPagination(data.pagination);
      } else {
        // Fallback for old API format
        setUserSays(data);
        setOriginalUserSays(data);
        setPagination({
          total: data.length,
          limit,
          offset,
          hasMore: offset + limit < data.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load testimonials');
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
      const response = await fetch('/api/usersays?download=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'user-testimonials.csv';
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
    const updatedUserSays = [...userSays];
    updatedUserSays[index][field as keyof UserSay] = value as never;
    setUserSays(updatedUserSays);
  };

  const addNewUserSay = () => {
    const newUserSay: UserSay = {
      id: Date.now(),
      name: '',
      designation: '',
      content: '',
      image: '',
      star: 5
    };
    setUserSays([newUserSay, ...userSays]);
    toast.info('New testimonial added. Please fill in the details.');
  };

  const deleteUserSay = (index: number) => {
    const userSayToDelete = userSays[index];
    if (window.confirm(`Are you sure you want to delete the testimonial from "${userSayToDelete.name}"?`)) {
    const updatedUserSays = userSays.filter((_, i) => i !== index);
    setUserSays(updatedUserSays);
      toast.success('Testimonial deleted successfully');
    }
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
        toast.success('All testimonials saved successfully!');
        setOriginalUserSays([...userSays]);
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
    setCurrentPage(1);
    fetchData(1, pagination.limit);
    toast.info('Data reset to original state');
  };

  // For search functionality, we'll filter the current page data
  // In a production app, you'd want to implement server-side search
  const filteredUserSays = searchTerm 
    ? userSays.filter(userSay =>
        userSay.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userSay.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        userSay.content.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : userSays;

  const renderStars = (stars: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <FontAwesomeIcon
        key={i}
        icon={faStar}
        className={i < stars ? "text-yellow-400" : "text-gray-300"}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            User Testimonials Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and showcase customer testimonials with ratings and professional profiles
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FontAwesomeIcon icon={faUser} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Testimonials</p>
                <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl">
                <FontAwesomeIcon icon={faImage} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">With Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userSays.filter(u => u.image).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl">
                <FontAwesomeIcon icon={faStar} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">5-Star Reviews</p>
                <p className="text-2xl font-bold text-gray-900">
                  {userSays.filter(u => u.star === 5).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl">
                <FontAwesomeIcon icon={faSearch} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Filtered</p>
                <p className="text-2xl font-bold text-gray-900">{filteredUserSays.length}</p>
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
                    placeholder="Search testimonials..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-3 py-3 border-none outline-none bg-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
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
                onClick={addNewUserSay}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Testimonial
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

        {/* Testimonials Display */}
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading testimonials...</p>
          </div>
        ) : filteredUserSays.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faUser} className="text-gray-400 text-6xl mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No testimonials found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or add a new testimonial</p>
            <button
              onClick={addNewUserSay}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Add Your First Testimonial
            </button>
          </div>
        ) : previewMode ? (
          // Preview Mode - Card Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUserSays.map((userSay, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100">
                <div className="p-6">
                  {/* Quote Icon */}
                  <div className="mb-4">
                    <FontAwesomeIcon icon={faQuoteLeft} className="text-blue-500 text-2xl" />
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-700 mb-4 italic">
                    &quot;{userSay.content || 'No content available'}&quot;
                  </p>


                  
                  {/* Stars */}
                  <div className="flex items-center mb-4">
                    {renderStars(userSay.star)}
                    <span className="ml-2 text-sm text-gray-600">({userSay.star}/5)</span>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-200 flex items-center justify-center bg-gradient-to-br from-blue-100 to-purple-100">
                      {userSay.image ? (
                        <Image
                          src={userSay.image}
                          alt={userSay.name || 'User'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.currentTarget as HTMLElement;
                            target.style.display = 'none';
                            const nextElement = target.nextElementSibling as HTMLElement;
                            if (nextElement) {
                              nextElement.style.display = 'flex';
                            }
                          }}
                        />
                      ) : null}
                      <div className="w-full h-full flex items-center justify-center" style={{ display: userSay.image ? 'none' : 'flex' }}>
                        <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                      </div>
                    </div>
                    <div className="ml-3">
                      <h4 className="font-semibold text-gray-900">{userSay.name || 'Anonymous'}</h4>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <FontAwesomeIcon icon={faBriefcase} className="text-gray-400" />
                        {userSay.designation || 'Customer'}
                      </p>
                    </div>
                  </div>
                  
                  {/* Delete Button */}
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={() => deleteUserSay(index)}
                      className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                      title="Delete testimonial"
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
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Name</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Designation</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '300px' }}>Content</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '200px' }}>Image URL</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Stars</th>
                    <th className="px-4 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '80px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUserSays.map((userSay, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={userSay.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Name"
                />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={userSay.designation}
                  onChange={(e) => handleInputChange(index, 'designation', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Designation"
                />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <textarea
                  value={userSay.content}
                  onChange={(e) => handleInputChange(index, 'content', e.target.value)}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm resize-none"
                          placeholder="Testimonial content"
                          rows={3}
                />
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                <input
                  type="text"
                  value={userSay.image}
                  onChange={(e) => handleInputChange(index, 'image', e.target.value)}
                            className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  placeholder="Image URL"
                />
                          {userSay.image && (
                            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200">
                              <Image
                                src={userSay.image}
                                alt="Preview"
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.currentTarget as HTMLElement;
                                  target.style.display = 'none';
                                }}
                />
              </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <select
                          value={userSay.star}
                          onChange={(e) => handleInputChange(index, 'star', parseInt(e.target.value))}
                          className="w-full px-2 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                        >
                          {[1, 2, 3, 4, 5].map(star => (
                            <option key={star} value={star}>{star} Star{star > 1 ? 's' : ''}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deleteUserSay(index)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete testimonial"
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
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} testimonials
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

export default UserSaysPage;
