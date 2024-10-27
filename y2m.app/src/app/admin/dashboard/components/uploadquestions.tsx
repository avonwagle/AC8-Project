'use client';
import { useState } from 'react';
import axios from 'axios';
import Papa, { ParseResult } from 'papaparse';

// Define the structure of a question in the CSV
interface CSVQuestion {
  text: string;
  questionType: string;
  options: string[];
  correctOption: string;
  assessmentId: string;
}

const UploadQuestions = () => {
  const [questionData, setQuestionData] = useState({
    text: '',
    questionType: 'MULTIPLE_CHOICE',
    options: ['', '', '', ''],
    correctOption: '',
    assessmentId: '',
  });

  const [file, setFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setQuestionData({
      ...questionData,
      [name]: value,
    });
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...questionData.options];
    newOptions[index] = value;
    setQuestionData({
      ...questionData,
      options: newOptions,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const resetForm = () => {
    setQuestionData({
      text: '',
      questionType: 'MULTIPLE_CHOICE',
      options: ['', '', '', ''],
      correctOption: '',
      assessmentId: '',
    });
    setFile(null); // Reset the file if needed
  };

  const submitForm = async (e: React.FormEvent) => {
    e.preventDefault();

    // Filter out empty options
    const filteredOptions = questionData.options.filter((option) => option.trim() !== '');

    if (filteredOptions.length < 2) {
      alert('Please provide at least two options for the question.');
      return;
    }

    // Find the index of the correct option
    const correctOptionIndex = filteredOptions.findIndex(
      (option) => option === questionData.correctOption
    );

    if (correctOptionIndex === -1) {
      alert('Please select a correct option.');
      return;
    }

    const dataToSubmit = {
      ...questionData,
      options: filteredOptions,
      correctOptionIndex, // Send correctOptionIndex instead of correctOption
    };

    try {
      await axios.post('/api/admin/uploadsinglequestion', dataToSubmit);
      alert('Question uploaded successfully!');
      resetForm(); // Reset form after success
    } catch (error) {
      console.error(error);
      alert('Failed to upload question');
      resetForm(); // Reset form even after failure
    }
  };

  const submitFile = async () => {
    if (!file) return;

    Papa.parse<CSVQuestion>(file, {
      complete: async (results: ParseResult<CSVQuestion>) => {
        try {
          await axios.post('/api/admin/uploadfile', {
            questions: results.data,
          });
          alert('File upload successful');
          resetForm(); // Reset form after success
        } catch (error) {
          console.error(error);
          alert('File upload failed');
          resetForm(); // Reset form even after failure
        }
      },
      header: true,
    });
  };

  return (
    <div className="p-5">
      <h1 className="mb-4 text-2xl font-bold">Upload Questions</h1>

      <form onSubmit={submitForm} className="flex flex-col gap-4">
        <div>
          <label className="block text-gray-700">Question Text</label>
          <input
            type="text"
            name="text"
            value={questionData.text}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <div>
          <label className="block text-gray-700">Question Type</label>
          <select
            name="questionType"
            value={questionData.questionType}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 p-2"
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True/False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-700">Options</label>
          {questionData.options.map((option, index) => (
            <input
              key={index}
              type="text"
              value={option}
              onChange={(e) => handleOptionChange(index, e.target.value)}
              className="mb-2 w-full rounded-lg border border-gray-300 p-2"
            />
          ))}
        </div>

        <div>
          <label className="block text-gray-700">Correct Option</label>
          {questionData.options.map((option, index) => (
            <div key={index} className="mb-2 flex items-center gap-2">
              <input
                type="radio"
                name="correctOption"
                value={option}
                checked={questionData.correctOption === option}
                onChange={(e) =>
                  setQuestionData({ ...questionData, correctOption: e.target.value })
                }
                className="mr-2"
              />
              <label>{option}</label>
            </div>
          ))}
        </div>

        <div>
          <label className="block text-gray-700">Assessment ID</label>
          <input
            type="number"
            name="assessmentId"
            value={questionData.assessmentId}
            onChange={handleInputChange}
            className="w-full rounded-lg border border-gray-300 p-2"
          />
        </div>

        <button type="submit" className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700">
          Upload Question
        </button>
      </form>

      <h2 className="mb-4 mt-8 text-xl font-bold">Upload CSV</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={submitFile}
        className="rounded-lg bg-green-600 p-2 text-white hover:bg-green-700"
      >
        Upload CSV
      </button>
    </div>
  );
};

export default UploadQuestions;
