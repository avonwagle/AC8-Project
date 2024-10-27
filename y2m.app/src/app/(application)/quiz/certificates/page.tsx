'use client';
import { useState, useEffect } from 'react';
import CertificateCard from '@/components/certificate/certificatecard';
import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';
import Title from '@/components/common/title';
import { useUser } from '@auth0/nextjs-auth0/client';

interface CertificateData {
  id: number;
  issuedAt: string;
  assessmentTitle: string;
  userName: string;
  resultId: string;
}

const CertificatesPage = () => {
  const { user, isLoading } = useUser();
  const [certificates, setCertificates] = useState<CertificateData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Define default user name outside of the useEffect hook
  const defaultUserName = user?.name || 'Anonymous';

  useEffect(() => {
    async function fetchCertificates() {
      if (!user?.sub) return;

      try {
        const response = await fetch(`/api/certificates?userId=${user.sub}`);
        const data = await response.json();

        if (data.success) {
          const formattedCertificates = data.certificates.map((cert: CertificateData) => ({
            ...cert,
            userName: cert.userName || defaultUserName,
          }));
          setCertificates(formattedCertificates);
        } else {
          console.error('Failed to fetch certificates:', data.message);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user?.sub) {
      fetchCertificates();
    }
  }, [user?.sub, defaultUserName]);

  if (isLoading || loading) return <div>Loading certificates...</div>;

  if (!user) return <div>Please log in to view your certificates.</div>;

  return (
    <div className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <MainSection>
        <MainSectionBody className="space-y-6">
          <div className="space-y-6 md:w-1/2">
            <Title>Your Certificates</Title>
          </div>
          <h2>
            Here are the certificates you have earned. Download and showcase your achievements!
          </h2>
        </MainSectionBody>
      </MainSection>

      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        {certificates.length === 0 ? (
          <p>No certificates available at the moment.</p>
        ) : (
          certificates.map((certificate) => (
            <CertificateCard
              key={certificate.id}
              title={certificate.assessmentTitle}
              issuedAt={certificate.issuedAt}
              userName={certificate.userName}
              resultId={certificate.resultId}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default CertificatesPage;
