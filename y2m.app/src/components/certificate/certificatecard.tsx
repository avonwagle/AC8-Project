import React from 'react';
import { Card, CardHeader, CardFooter, CardTitle, CardContent } from '@/components/ui/quizcard';
import Image from 'next/image';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface CertificateProps {
  title: string;
  issuedAt: string;
  userName: string;
  resultId: string; // Make sure to include this
}

const CertificateCard: React.FC<CertificateProps> = ({ title, issuedAt, userName }) => {
  const downloadAsPDF = async () => {
    const certificateElement = document.getElementById('certificate');
    if (certificateElement) {
      const canvas = await html2canvas(certificateElement, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const imgWidth = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save('certificate.pdf');
    }
  };

  return (
    <Card
      id="certificate"
      className="mx-auto max-w-lg rounded-lg border bg-white p-4 text-center shadow-md"
    >
      <Image
        src={'/y2m-logo.png'}
        alt="You2Mentor"
        width={80}
        height={80}
        className="mx-auto mb-4"
      />
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-green-600">
          Certificate of Achievement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xl text-black">This is to certify that</p>
        <p className="mt-1 text-2xl font-semibold text-black">{userName}</p>
        <p className="mt-4 text-lg text-black">has successfully passed the assessment titled</p>
        <p className="mt-1 text-xl font-semibold text-black">{title}</p>
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
