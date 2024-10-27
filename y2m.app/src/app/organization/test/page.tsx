'use client'; // This marks the entire component as a Client Component

export default function TenantHome({ params }: { params: { tenant_name: string } }) {
  return (
    <div>
      <h1>Welcome to the Tenant Dashboard</h1>
      <p>Tenant Name: {params.tenant_name}</p>
    </div>
  );
}
