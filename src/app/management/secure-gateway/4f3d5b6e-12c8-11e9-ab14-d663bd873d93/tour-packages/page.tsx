"use client"
import React, { useState, useEffect, useCallback } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrash, 
  faPlus, 
  faSave, 
  faRefresh, 
  faMapMarkedAlt, 
  faImage,
  faSearch,
  faEdit,
  faEye,
  faGlobe,
  faShare,
  faDownload,
  faChevronLeft,
  faChevronRight
} from '@fortawesome/free-solid-svg-icons';
import Image from "next/image";

interface TourPackage {
    name: string;
    imageUrl: string;
    city: string;
  social: { 
    instagram: string;
  };
}

interface PaginationInfo {
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

const TourPackagesPage = () => {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [originalPackages, setOriginalPackages] = useState<TourPackage[]>([]);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  
  // Pagination state
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false
  });
  const [currentPage, setCurrentPage] = useState<number>(1);

  const fetchData = useCallback(async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const offset = (page - 1) * limit;
      const response = await fetch(`/api/tourpackages?limit=${limit}&offset=${offset}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      
      if (data.packages) {
        setPackages(data.packages);
        setOriginalPackages(data.packages);
        setPagination(data.pagination);
      } else {
        // Fallback for old API format
        setPackages(data);
        setOriginalPackages(data);
        setPagination({
          total: data.length,
          limit,
          offset,
          hasMore: offset + limit < data.length
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Failed to load tour packages');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData(currentPage, pagination.limit);
  }, [currentPage, pagination.limit, fetchData]);

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
      const response = await fetch('/api/tourpackages?download=csv');
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'tour-packages.csv';
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

  const handleInputChange = (index: number, field: string, value: string) => {
    const updatedPackages = [...packages];
    if (field === 'social.instagram') {
      updatedPackages[index].social.instagram = value;
    } else {
      updatedPackages[index][field as keyof TourPackage] = value as never;
    }
    setPackages(updatedPackages);
  };

  const addNewPackage = () => {
    const newPackage: TourPackage = {
      name: '',
      imageUrl: '',
      city: '',
      social: { instagram: '' }
    };
    setPackages([newPackage, ...packages]);
    toast.info('New tour package added. Please fill in the details.');
  };

  const deletePackage = (index: number) => {
    const packageToDelete = packages[index];
    if (window.confirm(`Are you sure you want to delete the tour package "${packageToDelete.name}"?`)) {
    const updatedPackages = packages.filter((_, i) => i !== index);
    setPackages(updatedPackages);
      toast.success('Tour package deleted successfully');
    }
  };

  const saveChanges = async () => {
    try {
      const response = await fetch('/api/tourpackages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(packages),
      });

      if (response.ok) {
        toast.success('All tour packages saved successfully!');
        setOriginalPackages([...packages]);
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
  const filteredPackages = searchTerm 
    ? packages.filter(pkg =>
        pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        pkg.imageUrl.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : packages;

  const formatPackageName = (name: string) => {
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Tour Packages Management
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Manage and showcase your beautiful tour destinations with stunning visuals and detailed information
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl">
                <FontAwesomeIcon icon={faMapMarkedAlt} className="text-white text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Packages</p>
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
                  {packages.filter(p => p.imageUrl).length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="flex items-center">
                             <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl">
                 <FontAwesomeIcon icon={faShare} className="text-white text-xl" />
               </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Social Links</p>
                <p className="text-2xl font-bold text-gray-900">
                  {packages.filter(p => p.social.instagram).length}
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
                <p className="text-2xl font-bold text-gray-900">{filteredPackages.length}</p>
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
                      placeholder="Search tour packages..."
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
                onClick={addNewPackage}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg hover:shadow-xl"
              >
                <FontAwesomeIcon icon={faPlus} />
                Add New Package
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

        {/* Pagination */}
        <div className="flex justify-center items-center gap-2 mb-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Previous page"
          >
            <FontAwesomeIcon icon={faChevronLeft} />
          </button>
          <span className="text-gray-700">
            Page {currentPage} of {Math.ceil(pagination.total / pagination.limit)}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!pagination.hasMore}
            className="p-2 rounded-full bg-gray-200 text-gray-600 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            title="Next page"
          >
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        </div>

        {/* Tour Packages Display */}
      {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <p className="text-gray-600 text-lg">Loading tour packages...</p>
          </div>
        ) : filteredPackages.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FontAwesomeIcon icon={faMapMarkedAlt} className="text-gray-400 text-6xl mb-6" />
            <h3 className="text-2xl font-medium text-gray-900 mb-3">No tour packages found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or add a new package</p>
            <button
              onClick={addNewPackage}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              Add Your First Package
            </button>
          </div>
        ) : previewMode ? (
          // Preview Mode - Card Layout
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPackages.map((pkg, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow border border-gray-100 relative">
                                 <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center relative">
                   {pkg.imageUrl ? (
                     <Image
                       src={pkg.imageUrl}
                       alt={pkg.name || 'Tour package image'}
                       fill
                       className="object-cover rounded-t-xl"
                       onError={(e) => {
                         const target = e.currentTarget as HTMLElement;
                         target.style.display = 'none';
                         const nextElement = target.nextElementSibling as HTMLElement;
                         if (nextElement) {
                           nextElement.style.display = 'flex';
                         }
                       }}
                     />
                   ) : (
                     <FontAwesomeIcon icon={faImage} className="text-gray-400 text-4xl" />
                   )}
                   <div className="absolute top-3 right-3">
                     <button
                       onClick={() => deletePackage(index)}
                       className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                       title="Delete package"
                     >
                       <FontAwesomeIcon icon={faTrash} />
                     </button>
                   </div>
                 </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{pkg.name || 'Unnamed Package'}</h3>
                  <p className="text-gray-600 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMapMarkedAlt} className="text-blue-500" />
                    {pkg.city || 'Location not specified'}
                  </p>
                  {pkg.social.instagram && (
                                         <a
                       href={pkg.social.instagram}
                       target="_blank"
                       rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors"
                     >
                       <FontAwesomeIcon icon={faShare} />
                       View on Instagram
                     </a>
                  )}
                </div>
              </div>
            ))}
        </div>
      ) : (
          // Edit Mode - Table Layout
          <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200" style={{ minWidth: '1000px' }}>
                <thead className="bg-gradient-to-r from-gray-50 to-blue-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '200px' }}>Package Details</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '250px' }}>Image URL</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '150px' }}>Location</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '200px' }}>Social Media</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider" style={{ width: '100px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPackages.map((pkg, index) => (
                    <tr key={index} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={pkg.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="Package name"
                />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="space-y-2">
                <input
                  type="text"
                  value={pkg.imageUrl}
                  onChange={(e) => handleInputChange(index, 'imageUrl', e.target.value)}
                             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Image URL"
                />
                                                                                                          {pkg.imageUrl && (
                              <div className="w-12 h-12 rounded-lg overflow-hidden border border-gray-200 relative">
                                <Image
                                  src={pkg.imageUrl}
                                  alt="Preview"
                                  fill
                                  className="object-cover"
                                  onError={(e) => {
                                    const target = e.currentTarget as HTMLElement;
                                    target.style.display = 'none';
                                  }}
                                />
                              </div>
                            )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                <input
                  type="text"
                  value={pkg.city}
                  onChange={(e) => handleInputChange(index, 'city', e.target.value)}
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                           placeholder="City/Location"
                />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                                                 <div className="flex items-center gap-2">
                           <FontAwesomeIcon icon={faShare} className="text-purple-500" />
                <input
                  type="text"
                  value={pkg.social.instagram}
                  onChange={(e) => handleInputChange(index, 'social.instagram', e.target.value)}
                             className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                             placeholder="Instagram URL"
                />
              </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <button
                          onClick={() => deletePackage(index)}
                          className="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50 transition-colors"
                          title="Delete package"
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
              Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} packages
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

export default TourPackagesPage;