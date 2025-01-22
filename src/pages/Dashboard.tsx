import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { FileText, ChevronDown } from 'lucide-react';

interface Category {
  _id: number;
  Name: string;
  Code?: string;
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

function Dashboard() {
  const { user } = useAuth();
  console.log(user)
  const [documentType, setDocumentType] = useState('Category');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [subSubCategories, setSubSubCategories] = useState<SubSubCategory[]>([]);
  const [newName, setNewName] = useState('');
  const [newCode, setNewCode] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetchSubCategories(selectedCategory);
    }
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedSubCategory) {
      fetchSubSubCategories(selectedSubCategory);
    }
  }, [selectedSubCategory]);

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
      const response = await axios.get(`http://localhost:3000/api/documents/subcategories/${catId}`, {
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
      const response = await axios.get(`http://localhost:3000/api/documents/subsubcategories/${subCatId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubSubCategories(response.data);
    } catch (error) {
      console.error('Error fetching subsubcategories:', error);
    }
  };

  const handleAdd = async () => {
    if (!newName.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const endpoint = documentType === 'Category' 
        ? 'categories'
        : documentType === 'Sub Category'
        ? 'subcategories'
        : 'subsubcategories';

      const payload = {
        name: newName,
        code: newCode,
        ...(documentType !== 'Category' && { Cat_id: parseInt(selectedCategory) }),
        ...(documentType === 'Sub Sub Category' && { SubCat_id: parseInt(selectedSubCategory) })
      };

      await axios.post(`http://localhost:3000/api/documents/${endpoint}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setNewName('');
      setNewCode('');
      
      if (documentType === 'Category') {
        fetchCategories();
      } else if (documentType === 'Sub Category' && selectedCategory) {
        fetchSubCategories(selectedCategory);
      } else if (documentType === 'Sub Sub Category' && selectedSubCategory) {
        fetchSubSubCategories(selectedSubCategory);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const getCurrentItems = () => {
    switch (documentType) {
      case 'Category':
        return categories;
      case 'Sub Category':
        return subCategories;
      case 'Sub Sub Category':
        return subSubCategories;
      default:
        return [];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6 border-b flex items-center">
              <FileText className="h-8 w-8 text-red-600 mr-3" />
              <h1 className="text-2xl font-semibold">Regulatory Document Management System (RDMS)</h1>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Type
                  </label>
                  <div className="relative">
                    <select
                      value={documentType}
                      onChange={(e) => {
                        setDocumentType(e.target.value);
                        setSelectedCategory('');
                        setSelectedSubCategory('');
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 appearance-none"
                    >
                      <option>Category</option>
                      <option>Sub Category</option>
                      <option>Sub Sub Category</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </div>

                {documentType !== 'Category' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedCategory}
                        onChange={(e) => {
                          setSelectedCategory(e.target.value);
                          setSelectedSubCategory('');
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 appearance-none"
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
                )}

                {documentType === 'Sub Sub Category' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Sub Category
                    </label>
                    <div className="relative">
                      <select
                        value={selectedSubCategory}
                        onChange={(e) => setSelectedSubCategory(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500 appearance-none"
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
                )}
              </div>

              <div className="mt-8">
                <div className="bg-red-600 text-white py-2 px-4 grid grid-cols-12 gap-4">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-5">Code</div>
                  <div className="col-span-2">Action</div>
                </div>

                <div className="border-b py-3 grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Enter name"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="col-span-5">
                    <input
                      type="text"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                      placeholder="Enter code"
                      className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-red-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <button
                      onClick={handleAdd}
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                      Add
                    </button>
                  </div>
                </div>

                {getCurrentItems().map((item: any) => (
                  <div key={item._id} className="border-b py-3 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-5">{item.Name}</div>
                    <div className="col-span-5">{item.Code || '-'}</div>
                    <div className="col-span-2 space-x-2">
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600"
                      >
                        Update
                      </button>
                      <button
                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
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

export default Dashboard;