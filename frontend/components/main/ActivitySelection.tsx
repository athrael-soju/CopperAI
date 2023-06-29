import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { Button, Space } from 'antd';
import useGetPreference from '@/hooks/useGetPreference';

const ActivitySelection = () => {
  const router = useRouter();
  const [selectedActivity, setSelectedActivity] = useState('');
  const session = useSession();
  const {
    data: preferences,
    refetch,
    isSuccess,
  } = useGetPreference(session.data?.user?.email ?? '');
  const user = session.data?.user;

  if (!user) return null;

  if (!isSuccess) {
    return null;
  }

  if (preferences?.activity.length) {
    router.push('/voice-prompt');
    return null;
  }

  async function createPreference(activity: string) {
    try {
      await axios.post('/api/preferences/create', {
        activity,
        userEmail: user?.email,
      });
      refetch();
    } catch (error) {
      console.error('Failed to create new chat:', error);
    }
  }

  const handleActivitySelection = (activity: string) => {
    setSelectedActivity(activity);
    createPreference(activity);
  };

  return (
    <div>
      <h1>Welcome to our platform!</h1>
      <p>To get started, please select your preferred activity:</p>
      <Space>
        <Button
          type="primary"
          onClick={() => handleActivitySelection('Just Chat')}
        >
          Just Voice Chat
        </Button>
        {/* <Button
        // SHOW THIS based on a flag
          disabled
          type="primary"
          onClick={() => handleActivitySelection('Query Document')}
        >
          Query Document
        </Button> */}
      </Space>
      {selectedActivity && (
        <p>Selected activity: {selectedActivity}</p>
        // Render the appropriate component or redirect based on the selected activity
      )}
    </div>
  );
};

export default ActivitySelection;
