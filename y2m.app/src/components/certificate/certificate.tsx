import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from '@/components/ui/quizcard';
import Image from 'next/image'; // Import the Image component from next/image
import html2canvas from 'html2canvas'; // Import html2canvas for screenshot
import jsPDF from 'jspdf'; // Import jsPDF to create the PDF

interface CertificateProps {
  title: string;
  issuedAt: string;
  userName: string;
}

const CertificateCard: React.FC<CertificateProps> = ({ title, issuedAt, userName }) => {
  const downloadAsPDF = async () => {
    const certificateElement = document.getElementById('certificate');
    if (certificateElement) {
      // Use html2canvas to capture the certificate content
      const canvas = await html2canvas(certificateElement, {
        scale: 10, // Higher scale for better resolution
        useCORS: true, // Handle cross-origin images if applicable
        allowTaint: true, // Allow rendering of tainted canvases (if needed)
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');

      // Further reduce the content size - scale it down for the PDF
      const imgWidth = 50; // Further reduced width to fit content smaller on the page
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Calculate height proportionally

      // Add a border (outline) for the entire page
      pdf.setLineWidth(1);
      pdf.rect(10, 10, 277, 190); // Create a rectangle for A4 landscape (297mm x 210mm with padding)

      // Add the image (certificate content) to the PDF
      pdf.addImage(imgData, 'PNG', 20, 20, imgWidth, imgHeight); // Adjusted position and size

      // Download the PDF
      pdf.save('certificate.pdf');
    }
  };

  return (
    <Card
      id="certificate"
      className="mx-auto max-w-lg rounded-lg border bg-white p-4 text-center shadow-md"
    >
      {/* Logo at the top */}
      <Image
        src={'/y2m-logo.png'}
        alt="You2Mentor"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />

      <CardHeader>
        {/* Title in green */}
        <CardTitle className="text-3xl font-bold text-green-600">
          Certificate of Achievement
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Black text for other content */}
        <p className="text-xl text-black">This is to certify that</p>
        <p className="mt-2 text-2xl font-semibold text-black">{userName}</p>
        <p className="mt-4 text-lg text-black">has successfully passed the assessment titled</p>
        <p className="text-xl font-semibold text-black">{title}</p>
        <p className="mt-4 text-black">Issued on {new Date(issuedAt).toLocaleDateString()}</p>
      </CardContent>

      <CardFooter>
        <button
          onClick={downloadAsPDF}
          className="mt-4 inline-block rounded-lg bg-blue-500 px-6 py-2 text-white hover:bg-blue-600"
        >
          Download PDF
        </button>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
