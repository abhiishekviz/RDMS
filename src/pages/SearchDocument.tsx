import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { Download } from 'lucide-react';

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

interface Document {
  _id: string;
  title: string;
  description: string;
  category: Category;
  subCategory: SubCategory;
  subSubCategory: SubSubCategory;
  fileDate: string;
  createdAt: string;
  file: {
    filename: string;
  };
}

function SearchDocument() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    category: '',
    subCategory: '',
    subSubCategory: '',
    startDate: '',
    endDate: ''
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchParams.category) {
      fetchSubCategories(searchParams.category);
    }
  }, [searchParams.category]);

  useEffect(() => {
    if (searchParams.subCategory) {
      fetchSubSubCategories(searchParams.subCategory);
    }
  }, [searchParams.subCategory]);

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSearchParams({ ...searchParams, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/documents/search', {
        params: searchParams,
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error searching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickSearch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/documents/search', {
        params: { keyword: searchParams.keyword },
        headers: { Authorization: `Bearer ${token}` }
      });
      setDocuments(response.data);
    } catch (error) {
      console.error('Error performing quick search:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchParams({
      keyword: '',
      category: '',
      subCategory: '',
      subSubCategory: '',
      startDate: '',
      endDate: ''
    });
    setDocuments([]);
  };

  const handleDownload = async (documentId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:4000/api/documents/download/${documentId}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'document.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b">
              <h1 className="text-xl font-semibold text-center">Search Document</h1>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <div className="flex gap-4">
                  <input
                    type="text"
                    name="keyword"
                    value={searchParams.keyword}
                    onChange={handleChange}
                    placeholder="Keyword Search"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                  />
                  <button
                    onClick={handleQuickSearch}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Quick Search
                  </button>
                </div>
              </div>

              <form onSubmit={handleSearch} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      name="category"
                      value={searchParams.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Category
                    </label>
                    <select
                      name="subCategory"
                      value={searchParams.subCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      disabled={!searchParams.category}
                    >
                      <option value="">All Sub Categories</option>
                      {subCategories.map((subCat) => (
                        <option key={subCat._id} value={subCat._id}>
                          {subCat.Name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sub Sub Category
                    </label>
                    <select
                      name="subSubCategory"
                      value={searchParams.subSubCategory}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                      disabled={!searchParams.subCategory}
                    >
                      <option value="">All Sub Sub Categories</option>
                      {subSubCategories.map((subSubCat) => (
                        <option key={subSubCat._id} value={subSubCat._id}>
                          {subSubCat.Name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Date
                    </label>
                    <input
                      type="date"
                      name="startDate"
                      value={searchParams.startDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Date
                    </label>
                    <input
                      type="date"
                      name="endDate"
                      value={searchParams.endDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
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
                    Search
                  </button>
                </div>
              </form>

              {documents.length > 0 && (
                <div className="mt-8">
                  <h2 className="text-lg font-semibold mb-4">Search Results</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-gray-500 border-b">
                          <th className="pb-4">Title</th>
                          <th className="pb-4">Category</th>
                          <th className="pb-4">Sub Category</th>
                          <th className="pb-4">Sub Sub Category</th>
                          <th className="pb-4">File Date</th>
                          <th className="pb-4">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {documents.map((doc) => (
                          <tr key={doc._id} className="border-b">
                            <td className="py-4">{doc.title}</td>
                            <td className="py-4">{doc.category.Name}</td>
                            <td className="py-4">{doc.subCategory.Name}</td>
                            <td className="py-4">{doc.subSubCategory.Name}</td>
                            <td className="py-4">
                              {new Date(doc.fileDate).toLocaleDateString()}
                            </td>
                            <td className="py-4">
                              <button
                                onClick={() => handleDownload(doc._id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Download className="h-5 w-5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {documents.length === 0 && searchParams.keyword && !loading && (
                <div className="mt-8 text-center text-gray-500">
                  No documents found matching your search criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchDocument;