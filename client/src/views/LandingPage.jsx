import React, { useState } from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import ExercisePage from './ExercisePage';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('exercise'); // default to 'exercise'

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <div>
      <AppBar position="static">
        <Tabs value={activeTab} onChange={handleTabChange}>
          <Tab label="Exercise" value="exercise" />
          {/* ... other tabs */}
        </Tabs>
      </AppBar>

      {activeTab === 'exercise' && <ExercisePage />}
    </div>
  );
};

export default LandingPage;
