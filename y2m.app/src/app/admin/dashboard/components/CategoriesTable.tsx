import React from 'react';

interface CategoriesTableProps {
  categories: { id: number; name: string }[];
}

const CategoriesTable: React.FC<CategoriesTableProps> = ({ categories }) => {
  return (
    <div className="rounded-lg bg-white p-6 shadow-lg">
      <h2 className="mb-6 text-2xl font-semibold text-gray-800">Categories</h2>
      <table className="min-w-full table-auto border-collapse bg-white">
        <thead>
          <tr className="bg-gray-100 text-sm uppercase leading-normal text-gray-600">
            <th className="border-b-2 border-gray-200 px-6 py-3 text-left">ID</th>
            <th className="border-b-2 border-gray-200 px-6 py-3 text-left">Name</th>
          </tr>
        </thead>
        <tbody className="text-sm font-light text-gray-700">
          {categories.map((category) => (
            <tr key={category.id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="whitespace-nowrap px-6 py-3">{category.id}</td>
              <td className="whitespace-nowrap px-6 py-3">{category.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesTable;
