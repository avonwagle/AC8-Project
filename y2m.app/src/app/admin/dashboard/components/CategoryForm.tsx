import React, { useState } from 'react';
import axios from 'axios';

interface CategoryFormProps {
  onCategoryAdded: () => void; // Notify parent component to refresh categories
}

const CategoryForm: React.FC<CategoryFormProps> = ({ onCategoryAdded }) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAddCategory = async () => {
    try {
      await axios.post('/api/admin/categories', { name: categoryName });
      setCategoryName(''); // Clear the input after adding
      onCategoryAdded(); // Notify parent component to refresh categories
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow">
      <h2 className="mb-4 text-xl font-semibold">Add Category</h2>
      <div className="flex flex-col items-center gap-4 md:flex-row">
        {/* Input field */}
        <input
          type="text"
          value={categoryName}
          onChange={(e) => setCategoryName(e.target.value)}
          placeholder="Category Name"
          className="w-full grow rounded border border-gray-300 p-2 md:w-auto"
        />

        {/* Add Category button */}
        <button
          onClick={handleAddCategory}
          className="rounded bg-green-600 px-4 py-2 font-semibold text-white shadow hover:bg-green-700"
        >
          Add Category
        </button>
      </div>
    </div>
  );
};

export default CategoryForm;
