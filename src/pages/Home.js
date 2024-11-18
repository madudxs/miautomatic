import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const Home = () => {
  const [nextMealTime, setNextMealTime] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [nomeAnimal, setNomeAnimal] = useState('');
  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]);

  useEffect(() => {
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    document.body.style.height = '100vh';

    const preventScroll = (e) => e.preventDefault();
    document.addEventListener('touchmove', preventScroll, { passive: false });

    return () => {
      document.documentElement.style.overflow = 'auto';
      document.body.style.overflow = 'auto';
      document.body.style.height = 'auto';

      document.removeEventListener('touchmove', preventScroll);
    };
  }, []);

  const calculateTimeUntilNextMeal = () => {
    const config = JSON.parse(localStorage.getItem('mealConfig'));
    if (!config || !config.mealTimes || config.mealTimes.length === 0) {
      console.log('Nenhuma configuração encontrada.');
      return;
    }

    const now = new Date();
    const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();

    const mealTimesInMinutes = config.mealTimes.map((meal) => {
      const [hours, minutes] = meal.time.split(':').map(Number);
      return hours * 60 + minutes;
    });

    const nextTimeInMinutes =
      mealTimesInMinutes.find((time) => time > currentTimeInMinutes) ||
      mealTimesInMinutes[0];

    const isNextDay = nextTimeInMinutes <= currentTimeInMinutes;
    const nextMealDate = new Date(now);

    if (isNextDay) nextMealDate.setDate(now.getDate() + 1);
    nextMealDate.setHours(Math.floor(nextTimeInMinutes / 60));
    nextMealDate.setMinutes(nextTimeInMinutes % 60);

    setNextMealTime(nextMealDate);

    const timeDifferenceInMs = nextMealDate - now;
    const hours = Math.floor(timeDifferenceInMs / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifferenceInMs % (1000 * 60 * 60)) / (1000 * 60));
    setTimeRemaining(`${hours}h ${minutes}min`);
  };

  useEffect(() => {
    const petData = JSON.parse(localStorage.getItem('petData'));
    if (petData?.nome) {
      setNomeAnimal(petData.nome);
    }

    const config = JSON.parse(localStorage.getItem('mealConfig'));
    if (!config?.mealTimes?.length) {
      console.log('Nenhuma configuração de alimentação encontrada.');
    } else {
      calculateTimeUntilNextMeal();
    }

    const intervalId = setInterval(() => calculateTimeUntilNextMeal(), 60000);
    return () => clearInterval(intervalId);
  }, []);

  const handleFeedNow = async () => {
    try {
      const response = await fetch('https://miautomatic-backend.onrender.com/feed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Erro ao comunicar com o backend.');
      }

      setOpenSnackbar(true);
    } catch (error) {
      console.error('Erro ao alimentar o pet:', error);
    }
  };

  const handleSnackbarClose = () => setOpenSnackbar(false);

  if (!nextMealTime) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
      >
        <Typography variant="h6">
          Nenhuma configuração encontrada. Configure os horários primeiro.
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
    >
      <Typography variant="h5">Próxima refeição em:</Typography>
      <Typography variant="h4" color="primary" fontWeight="bold" marginY={2}>
        {timeRemaining}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={handleFeedNow}
        style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          fontSize: '24px',
          fontWeight: 'bold',
        }}
      >
        Alimentar agora
      </Button>

      <Snackbar
        open={openSnackbar}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={3000}
        sx={{
          '& .MuiSnackbarContent-root': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            maxWidth: '400px',
            borderRadius: '12px',
          },
        }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity="success"
          sx={{
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            textAlign: 'center',
          }}
        >
          Uma refeição está sendo fornecida agora para <strong>{nomeAnimal}</strong>.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Home;
