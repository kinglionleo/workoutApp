import React, { useState } from 'react';
import { Box, Button } from '@mui/material';
import ExercisePage from './ExercisePage';
import WorkoutPage from './WorkoutPage';
import ReportPage from './ReportPage';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('exercise');

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 2, bgcolor: 'background.paper' }}>
        <Button
          variant={activeTab === 'exercise' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('exercise')}
          sx={{ mx: 1 }}
        >
          Exercises
        </Button>
        <Button
          variant={activeTab === 'workout' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('workout')}
          sx={{ mx: 1 }}
        >
          Workout
        </Button>
        <Button
          variant={activeTab === 'report' ? 'contained' : 'outlined'}
          onClick={() => setActiveTab('report')}
          sx={{ mx: 1 }}
        >
          Report
        </Button>
      </Box>

      <Box sx={{ mt: 3 }}>
        {activeTab === 'exercise' && <ExercisePage />}
        {activeTab === 'workout' && <WorkoutPage />}
        {activeTab === 'report' && <ReportPage />}
      </Box>
    </Box>
  );
};

export default LandingPage;
