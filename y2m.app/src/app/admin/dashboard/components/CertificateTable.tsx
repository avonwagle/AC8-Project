// components/CertificateTable.tsx
import React, { useState, useEffect } from 'react';

// Define the Certificate interface to type the data
interface Certificate {
  id: number;
  userId: string;
  assessmentId: number;
  resultId: number;
  url: string;
  issuedAt: string;
}

export default function CertificateTable() {
  // State to hold the certificates fetched from the API
  const [certificates, setCertificates] = useState<Certificate[]>([]);

  // Fetch certificates when the component mounts
  useEffect(() => {
    fetchCertificates();
  }, []);

  // Function to fetch certificates from the API
  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/admin/certificates'); // Adjust API endpoint if needed
      if (!response.ok) {
        throw new Error('Error fetching certificates');
      }
      const data = await response.json();
      setCertificates(data.certificates); // Set the fetched certificates in the state
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full overflow-hidden rounded-lg border border-gray-300 bg-white shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="border-b px-4 py-2 text-left font-medium">Certificate ID</th>
            <th className="border-b px-4 py-2 text-left font-medium">User ID</th>
            <th className="border-b px-4 py-2 text-left font-medium">Assessment ID</th>
            <th className="border-b px-4 py-2 text-left font-medium">Result ID</th>
            <th className="border-b px-4 py-2 text-left font-medium">Certificate URL</th>
            <th className="border-b px-4 py-2 text-left font-medium">Issued At</th>
          </tr>
        </thead>
        <tbody>
          {certificates.length === 0 ? (
            <tr>
              <td colSpan={6} className="py-4 text-center">
                No certificates available
              </td>
            </tr>
          ) : (
            certificates.map((certificate) => (
              <tr key={certificate.id} className="hover:bg-gray-50">
                <td className="border-b px-4 py-2">{certificate.id}</td>
                <td className="border-b px-4 py-2">{certificate.userId}</td>
                <td className="border-b px-4 py-2">{certificate.assessmentId}</td>
                <td className="border-b px-4 py-2">{certificate.resultId}</td>
                <td className="border-b px-4 py-2">
                  <a
                    href={certificate.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-600 underline hover:text-green-700"
                  >
                    {certificate.url} {/* Display the URL directly */}
                  </a>
                </td>
                <td className="border-b px-4 py-2">
                  {new Date(certificate.issuedAt).toLocaleDateString()}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
