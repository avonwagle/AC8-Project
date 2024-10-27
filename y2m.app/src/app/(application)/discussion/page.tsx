'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import QuestionForm from './QuestionForm';
import ThreadList from './ThreadList';
import CreateGroupForm from './CreateGroupForm'; // Import the CreateGroupForm component
import { Thread } from '@/app/api/discussion/types'; // Adjust the path as necessary

// Define the Group type
type Group = {
  id: number;
  name: string;
  description: string;
};

const DiscussionThread: React.FC = () => {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [showCreateGroupForm, setShowCreateGroupForm] = useState(false);
  const [groups, setGroups] = useState<Group[]>([]); // State to manage list of groups
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null); // State to track selected group

  // Fetch discussions on component mount
  useEffect(() => {
    const fetchDiscussions = async () => {
      const res = await fetch('/api/discussion');
      const data: Thread[] = await res.json();
      setThreads(data);
    };
    fetchDiscussions();
  }, []);

  // Fetch groups on component mount
  useEffect(() => {
    const fetchGroups = async () => {
      const res = await fetch('/api/groups');
      const data = await res.json();
      setGroups(data.groups);
    };
    fetchGroups();
  }, []);

  // Fetch threads specific to selected group
  useEffect(() => {
    if (selectedGroupId !== null) {
      const fetchGroupThreads = async () => {
        const res = await fetch(`/api/discussions?groupId=${selectedGroupId}`);
        const data: Thread[] = await res.json();
        setThreads(data);
      };
      fetchGroupThreads();
    }
  }, [selectedGroupId]);

  // Toggle CreateGroupForm visibility
  const toggleCreateGroupForm = () => {
    setShowCreateGroupForm((prev) => !prev);
  };

  // Handle group creation
  const handleGroupCreated = (group: Group) => {
    setGroups((prevGroups) => [...prevGroups, group]);
    setSelectedGroupId(group.id); // Automatically select new group
  };

  // Handle adding a new question
  const handleAddQuestion = async (newThread: { user: string; text: string }) => {
    const res = await fetch('/api/discussion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newThread),
    });

    const data: Thread = await res.json();
    setThreads((prevThreads) => [...prevThreads, data]);
  };

  // Handle adding an answer to a specific thread
  const handleAddAnswer = async (threadId: number, newAnswer: { user: string; text: string }) => {
    const res = await fetch('/api/discussion', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ threadId, newAnswer }),
    });

    const updatedThread: Thread = await res.json();
    setThreads((prevThreads) =>
      prevThreads.map((thread) => (thread.id === threadId ? updatedThread : thread))
    );
  };

  return (
    <div className="container mx-auto p-6">
      {/* Hero Section */}
      <HeroSection
        title="Discussion Forum"
        description="Engage in conversations and share your knowledge"
        backgroundImage="/images/discussion-bg.jpg"
      />

      {/* Group List */}
      <div className="mb-4">
        <h2>Your Groups</h2>
        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              onClick={() => setSelectedGroupId(group.id)}
              className={`cursor-pointer ${selectedGroupId === group.id ? 'font-bold' : ''}`}
            >
              {group.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Add New Question Form */}
      <QuestionForm onAddQuestion={handleAddQuestion} />

      {/* Threads List */}
      <ThreadList threads={threads} onAddAnswer={handleAddAnswer} />

      {/* Create Group Button */}
      <button onClick={toggleCreateGroupForm} className="my-4 rounded bg-blue-500 p-2 text-white">
        {showCreateGroupForm ? 'Close Create Group' : 'Create Group'}
      </button>

      {/* Create Group Form */}
      {showCreateGroupForm && <CreateGroupForm onGroupCreated={handleGroupCreated} />}
    </div>
  );
};

export default DiscussionThread;
