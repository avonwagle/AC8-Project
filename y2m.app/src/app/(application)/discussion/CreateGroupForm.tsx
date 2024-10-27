// File: /components/CreateGroupForm.tsx
import React, { useState } from 'react';

type CreateGroupFormProps = {
  onGroupCreated: (group: { id: number; name: string; description: string }) => void;
};

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [description, setDescription] = useState('');
  const [emails, setEmails] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const emailArray = emails.split(',').map((email) => email.trim());

    const response = await fetch('/api/discussion/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ groupName, description, emails: emailArray }),
    });

    const data = await response.json();
    if (response.ok) {
      onGroupCreated(data.group);
      alert('Group created successfully!');
    } else {
      alert(`Error creating group: ${data.error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <input
        type="text"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
        placeholder="Group Name"
        required
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        type="text"
        value={emails}
        onChange={(e) => setEmails(e.target.value)}
        placeholder="User Emails (comma-separated)"
        required
      />
      <button type="submit">Create Group</button>
    </form>
  );
};

export default CreateGroupForm;
