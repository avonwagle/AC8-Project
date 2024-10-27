import React, { useState } from 'react';

interface AssessmentFormProps {
  onSubmit: (data: {
    id: number;
    title: string;
    description: string;
    objective: string;
    duration: number;
    categoryId: number;
  }) => void;
  categories: { id: number; name: string }[];
}

const AssessmentForm = ({ onSubmit, categories }: AssessmentFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [objective, setObjective] = useState('');
  const [duration, setDuration] = useState<number>(0);
  const [categoryId, setCategoryId] = useState<number | ''>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          objective,
          duration,
          categoryId: categoryId !== '' ? Number(categoryId) : 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit the assessment');
      }

      const newAssessment = await response.json();

      // Call the parent component's onSubmit to update the table
      onSubmit(newAssessment);

      // Clear the form after submission
      setTitle('');
      setDescription('');
      setObjective('');
      setDuration(0);
      setCategoryId('');
    } catch (error) {
      console.error('Error submitting assessment:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8 rounded-md bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Create New Assessment</h2>

      <div className="mb-4">
        <label className="block text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Description</label>
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Objective</label>
        <input
          type="text"
          value={objective}
          onChange={(e) => setObjective(e.target.value)}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Duration (minutes)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value, 10) || 0)}
          className="w-full rounded border p-2"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700">Category</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value !== '' ? Number(e.target.value) : '')}
          className="w-full rounded border p-2"
          required
        >
          <option value="">Select a category</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
      >
        Create Assessment
      </button>
    </form>
  );
};

export default AssessmentForm;
