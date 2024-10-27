'use client';

import React, { useEffect, useState } from 'react';
import MainSection from '@/components/common/main-section';
import MainSectionBody from '@/components/common/main-section-body';
import Title from '@/components/common/title';
import Subtitle from '@/components/common/subtitle';

type Organization = {
  id: number | string;
  organizationname: string;
  domain: string;
  subdomain: string;
  contactemail: string;
  isactive: boolean;
};

type Feature = {
  featureName: string;
  isEnabled: boolean;
  organizationId: number | string;
};

type FeaturesMap = { [key: string]: Feature[] };

export default function FeatureFlagDashboard() {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [features, setFeatures] = useState<FeaturesMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch organizations
        const orgRes = await fetch('/api/admin/organizations/fetch');
        if (!orgRes.ok) {
          throw new Error('Failed to fetch organizations');
        }
        const orgData = await orgRes.json();
        setOrganizations(orgData.data);

        // Fetch feature flags
        const featureRes = await fetch('/api/feature-flags');
        if (!featureRes.ok) {
          throw new Error('Failed to fetch feature flags');
        }
        const featureData = await featureRes.json();

        if (featureData && featureData.featureFlags) {
          const mappedFeatures: FeaturesMap = featureData.featureFlags.reduce(
            (acc: FeaturesMap, flag: Feature) => {
              acc[flag.organizationId] = acc[flag.organizationId] || [];
              acc[flag.organizationId].push(flag);
              return acc;
            },
            {}
          );
          setFeatures(mappedFeatures);
        } else {
          throw new Error('Feature flags data is not structured as expected');
        }
      } catch (err) {
        console.error(err);
        setError('Error fetching organizations or features');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handleToggleFeature = async (organizationId: number | string, featureName: string) => {
    try {
      const currentFeature = features[organizationId].find((f) => f.featureName === featureName);
      if (!currentFeature) return; // Safety check

      // Optimistically update the state before the API call
      const updatedFeatures = {
        ...features,
        [organizationId]: features[organizationId].map((feature) =>
          feature.featureName === featureName
            ? { ...feature, isEnabled: !feature.isEnabled }
            : feature
        ),
      };
      setFeatures(updatedFeatures);

      // Update feature flag status in the backend
      const response = await fetch(`/api/feature-flags`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          organizationId,
          featureName,
          isEnabled: !currentFeature.isEnabled,
        }),
      });

      if (!response.ok) {
        throw new Error('Error updating feature status');
      }

      // Fetch the updated features again to sync the frontend state with the backend
      const featureRes = await fetch('/api/feature-flags');
      if (featureRes.ok) {
        const featureData = await featureRes.json();
        const mappedFeatures: FeaturesMap = featureData.featureFlags.reduce(
          (acc: FeaturesMap, flag: Feature) => {
            acc[flag.organizationId] = acc[flag.organizationId] || [];
            acc[flag.organizationId].push(flag);
            return acc;
          },
          {}
        );
        setFeatures(mappedFeatures);
      }
    } catch (error) {
      console.error('Error updating feature status:', error);
      alert('Error updating feature status');
    }
  };

  if (loading) {
    return <div>Loading organizations...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainSection>
        <MainSectionBody className="space-y-6">
          <Title>Feature Flag Management</Title>
          <Subtitle>Manage features for each organization here.</Subtitle>
        </MainSectionBody>
      </MainSection>

      <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <table className="min-w-full border-collapse rounded-lg border border-gray-200 shadow-md">
          <thead>
            <tr className="bg-green-600 text-white">
              <th className="border-b px-4 py-2">Organization</th>
              <th className="border-b px-4 py-2">Features</th>
              <th className="border-b px-4 py-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {organizations.map((organization) => (
              <tr
                key={organization.id}
                className={`border-t ${organization.isactive ? 'bg-white' : 'bg-gray-200'}`}
              >
                <td className="px-4 py-2 text-black">{organization.organizationname}</td>
                <td className="px-4 py-2 text-black">
                  {features[organization.id] ? (
                    <div className="space-y-2">
                      {features[organization.id].map((feature) => (
                        <div
                          key={feature.featureName}
                          className="flex items-center justify-between"
                        >
                          <span>{feature.featureName}</span>
                          <label className="relative inline-flex cursor-pointer items-center">
                            <input
                              type="checkbox"
                              checked={feature.isEnabled}
                              onChange={() =>
                                handleToggleFeature(organization.id, feature.featureName)
                              }
                              className="peer sr-only"
                            />
                            <div className="peer h-6 w-11 rounded-full bg-gray-300 peer-checked:bg-green-500 peer-focus:ring-2 peer-focus:ring-blue-300">
                              <div
                                className={`dot absolute left-0.5 top-0.5 size-5 rounded-full bg-white transition-transform duration-200 ${
                                  feature.isEnabled ? 'translate-x-5' : ''
                                }`}
                              ></div>
                            </div>
                          </label>
                        </div>
                      ))}
                    </div>
                  ) : (
                    'No features available'
                  )}
                </td>
                <td className="px-4 py-2 text-black">
                  {organization.isactive ? 'Active' : 'Inactive'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add space at the bottom of the page */}
        <div className="mt-10" />
      </div>
    </div>
  );
}
