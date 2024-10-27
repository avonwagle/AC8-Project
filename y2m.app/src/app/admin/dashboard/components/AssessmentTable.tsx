import React, { useEffect, useState } from 'react';

interface Assessment {
  id: number;
  title: string;
  description: string;
  objective: string;
  duration: number;
}

export default function AssessmentTable() {
  const [assessments, setAssessments] = useState<Assessment[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editData, setEditData] = useState<Partial<Assessment>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAssessments() {
      try {
        const response = await fetch('/api/admin/assessments');
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
        const data = await response.json();
        setAssessments(data);
      } catch (error) {
        console.error('Error fetching assessments:', error);
        setError('Failed to fetch assessments.');
      }
    }

    fetchAssessments();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, field: keyof Assessment) => {
    setEditData({
      ...editData,
      [field]: field === 'duration' ? parseInt(e.target.value, 10) : e.target.value,
    });
  };

  const handleEdit = (assessment: Assessment) => {
    setIsEditing(assessment.id);
    setEditData(assessment);
  };

  const handleSave = async (id: number) => {
    try {
      const response = await fetch(`/api/admin/assessments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editData),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }

      setAssessments((prev) =>
        prev.map((item) => (item.id === id ? { ...item, ...editData } : item))
      );
      setIsEditing(null);
    } catch (error) {
      console.error('Error updating assessment:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <h3 className="mb-6 text-2xl font-semibold text-gray-800">Available Assessments</h3>
      <div className="overflow-hidden rounded-lg shadow-lg">
        <table className="min-w-full rounded-lg border border-gray-300 bg-white">
          <thead className="rounded-lg bg-gray-100">
            <tr>
              <th className="rounded-tl-lg px-4 py-3 text-left font-semibold text-gray-600">ID</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Title</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Description</th>
              <th className="px-4 py-3 text-left font-semibold text-gray-600">Duration</th>
              <th className="rounded-tr-lg px-4 py-3 text-left font-semibold text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="rounded-lg">
            {assessments.map((assessment, index) => (
              <tr
                key={assessment.id}
                className={`border-t ${index === assessments.length - 1 ? 'rounded-b-lg' : ''}`}
              >
                <td className="px-4 py-3">{assessment.id}</td>
                <td className="px-4 py-3">
                  {isEditing === assessment.id ? (
                    <input
                      type="text"
                      value={editData.title || ''}
                      onChange={(e) => handleInputChange(e, 'title')}
                      className="w-full rounded border p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{assessment.title}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing === assessment.id ? (
                    <input
                      type="text"
                      value={editData.description || ''}
                      onChange={(e) => handleInputChange(e, 'description')}
                      className="w-full rounded border p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{assessment.description}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing === assessment.id ? (
                    <input
                      type="number"
                      value={editData.duration || 0}
                      onChange={(e) => handleInputChange(e, 'duration')}
                      className="w-full rounded border p-2"
                    />
                  ) : (
                    <span className="text-gray-700">{assessment.duration}</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {isEditing === assessment.id ? (
                    <span
                      onClick={() => handleSave(assessment.id)}
                      className="cursor-pointer text-green-600 hover:underline"
                    >
                      Save
                    </span>
                  ) : (
                    <span
                      onClick={() => handleEdit(assessment)}
                      className="cursor-pointer text-green-600 hover:underline"
                    >
                      Edit
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
