import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { FileText, ChevronDown, Calendar } from 'lucide-react';

interface Category {
  _id: number;
  Name: string;
}

interface SubCategory {
  _id: number;
  Name: string;
  Cat_id: number;
}

interface SubSubCategory {
  _id: number;
  Name: string;
  Cat_id: number;
  SubCat_id: number;
}

function UploadDocument() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    form: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    description: '',
    keyword: '',
    fileDate: new Date().toISOString().split('T')[0]
  });
  const [file, setFile] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const formTypes = [
    'Regulation',
    'Order',
    'Guideline',
    'Policy',
    'Circular',
    'Notice'
  ];

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(formData.category);
      setFormData(prev => ({ ...prev, subCategory: '', subSubCategory: '' }));
    }
  }, [formData.category]);

  useEffect(() => {
    if (formData.subCategory) {
      fetchSubSubCategories(formData.subCategory);
      setFormData(prev => ({ ...prev, subSubCategory: '' }));
    }
  }, [formData.subCategory]);

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/documents/categories', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSubCategories = async (catId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/documents/subcategories/${catId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching subcategories:', error);
    }
  };

  const fetchSubSubCategories = async (subCatId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/documents/subsubcategories/${subCatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching subsubcategories:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccess('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file only');
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleClear = () => {
    setFormData({
      form: '',
      category: '',
      subCategory: '',
      subSubCategory: '',
      description: '',
      keyword: '',
      fileDate: new Date().toISOString().split('T')[0]
    });
    setFile(null);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!formData.form || !formData.category || !formData.description || !formData.keyword || !file) {
      setError('Please fill in all required fields and select a PDF file');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });
      if (file) {
        formDataToSend.append('file', file);
      }

      await axios.post('http://localhost:4000/api/documents/upload', formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess('Document uploaded successfully!');
      handleClear();
    } catch (err) {
      setError('Failed to upload document. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-red-600 mr-3" />
                <h1 className="text-2xl font-semibold">Regulatory Document Management System (RDMS)</h1>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6">Upload Document</h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-600 rounded">
                  {error}
                </div>
              )}

              {success && (
                <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-600 rounded">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Form <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="form"
                        value={formData.form}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 appearance-none"
                        required
                      >
                        <option value="">Select Form</option>
                        {formTypes.map((form) => (
                          <option key={form} value={form}>
                            {form}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Category <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 appearance-none"
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat._id}>
                            {cat.Name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Sub Category
                    </label>
                    <div className="relative">
                      <select
                        name="subCategory"
                        value={formData.subCategory}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 appearance-none"
                        disabled={!formData.category}
                      >
                        <option value="">Select Sub Category</option>
                        {subCategories.map((subCat) => (
                          <option key={subCat._id} value={subCat._id}>
                            {subCat.Name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keyword <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="keyword"
                    value={formData.keyword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    placeholder="Enter keywords separated by commas"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      File Date <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="date"
                        name="fileDate"
                        value={formData.fileDate}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                        required
                      />
                      <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select File for Upload (.PDF) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf"
                      className="w-full"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={handleClear}
                    className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    {loading ? 'Uploading...' : 'Save'}
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Copyright © 2024-2025 BSES Delhi (BSES Development Team). All Rights Reserved.
          </div>
        </div>
      </div>
    </div>
  );
}

export default UploadDocument;