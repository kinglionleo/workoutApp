import React, { useState } from 'react';
import { AppBar, Tabs, Tab } from '@mui/material';
import ExercisePage from './ExercisePage';
import WorkoutPage from './WorkoutPage';

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
          <Tab label="Workout" value="workout" />
        </Tabs>
      </AppBar>

      {activeTab === 'exercise' && <ExercisePage />}
      {activeTab === 'workout' && <WorkoutPage />}
    </div>
  );
};

export default LandingPage;
