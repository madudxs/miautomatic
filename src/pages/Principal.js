import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';

const Principal = () => {
  const [nextMealTime, setNextMealTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [nomeAnimal, setNomeAnimal] = useState('');

  const calculateTimeUntilNextMeal = () => {
    const config = JSON.parse(localStorage.getItem('mealConfig'));
    if (!config || !config.mealTimes) {
      console.log('Nenhuma configuração encontrada.');
      return;
    }

    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes(); 

    const mealMinutes = config.mealTimes.map((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    });

    const nextTime = mealMinutes.find((time) => time > currentTime) || mealMinutes[0]; 
    const isTomorrow = nextTime <= currentTime;

    const nextDate = new Date(now);
    if (isTomorrow) nextDate.setDate(now.getDate() + 1);
    nextDate.setHours(Math.floor(nextTime / 60));
    nextDate.setMinutes(nextTime % 60);

    setNextMealTime(nextDate);

    const remainingMs = nextDate - now;
    const hours = Math.floor(remainingMs / (1000 * 60 * 60));
    const minutes = Math.floor((remainingMs % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining(`${hours}h ${minutes}min`);
  };

  useEffect(() => {
    const petData = JSON.parse(localStorage.getItem('petData'));
    if (petData && petData.nome) { 
      setNomeAnimal(petData.nome); 
    }

    calculateTimeUntilNextMeal();
    const timer = setInterval(() => calculateTimeUntilNextMeal(), 1000); 
    return () => clearInterval(timer);
  }, []);

  const handleFeedNow = () => {
    setOpenSnackbar(true); 
  };

  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };

  if (!nextMealTime) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
        <Typography variant="h6">Nenhuma configuração encontrada. Configure os horários primeiro.</Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh">
      <Typography variant="h5">Próxima refeição em:</Typography>
      <Typography variant="h4" color="primary" fontWeight="bold" marginY={2}>
        {timeRemaining}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleFeedNow}
        style={{
          width: '150px',
          height: '150px',
          borderRadius: '50%',
          fontSize: '18px',
          fontWeight: 'bold',
        }}
      >
        Alimentar
      </Button>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000} 
        onClose={handleSnackbarClose}
      >
        <Box display="flex" justifyContent="center" alignItems="center" style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 9999 }}>
          <Alert 
            onClose={handleSnackbarClose} 
            severity="success" 
            sx={{ 
              width: '300px', 
              fontSize: '18px', 
              fontWeight: 'bold', 
              backgroundColor: '#4caf50', 
              color: '#fff', 
              padding: '15px', 
              borderRadius: '16px', 
            }}
          >
            Uma refeição está sendo fornecida agora para <strong>{nomeAnimal}</strong>
          </Alert>
        </Box>
      </Snackbar>
    </Box>
  );
};

export default Principal;
