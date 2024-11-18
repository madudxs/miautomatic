import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Grid,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const Configuracao = () => {
  const [mealCount, setMealCount] = useState(1);
  const [mealTimes, setMealTimes] = useState([""]);
  const [isEveryday, setIsEveryday] = useState(false);
  const [selectedDays, setSelectedDays] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.overflow = 'auto';
    };
  }, [theme]);

  const handleMealCountChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setMealCount(count);

    setMealTimes((prevMealTimes) => {
      const updatedMealTimes = [...prevMealTimes];
      if (updatedMealTimes.length < count) {
        updatedMealTimes.push(...Array(count - updatedMealTimes.length).fill(""));
      } else {
        updatedMealTimes.length = count;
      }
      return updatedMealTimes;
    });
  };

  const handleTimeChange = (index, newTime) => {
    setMealTimes((prevMealTimes) => {
      const updatedMealTimes = [...prevMealTimes];
      updatedMealTimes[index] = newTime;
      return updatedMealTimes;
    });
  };

  const handleDayChange = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleEverydayChange = (event) => {
    const { checked } = event.target;
    setIsEveryday(checked);
    if (checked) {
      setSelectedDays([]); 
    }
  };

  const handleSave = async () => {
    if (mealTimes.some((time) => !time || !/^([01]?[0-9]|2[0-3]):([0-5]?[0-9])$/.test(time))) {
      alert('Todos os horários devem ser definidos e no formato HH:MM.');
      return;
    }

    const config = {
      mealCount,
      mealTimes: mealTimes.map((time) => ({ time, fed: false, lastFedDate: "" })),
      isEveryday,
      selectedDays,
    };

    console.log(config);
    setLoading(true);

    try {
      await fetch('https://miautomatic-backend.onrender.com/save-meal-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });

      localStorage.setItem('mealConfig', JSON.stringify(config));
      navigate('/Home');
    } catch (error) {
      alert('Erro ao salvar configurações.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      padding={2}
      overflow="hidden"
    >
      <Typography variant="subtitle1">Determine a quantidade e horário das refeições automáticas:</Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Quantas refeições fornecer por dia?</InputLabel>
        <Select
          value={mealCount}
          onChange={handleMealCountChange}
          label="Quantas refeições por dia?"
        >
          {[...Array(20).keys()].map((count) => (
            <MenuItem key={count + 1} value={count + 1}>
              {count + 1} {count + 1 === 1 ? 'refeição' : 'refeições'}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {mealTimes.map((time, index) => (
        <TextField
          key={index}
          label={`Horário da refeição ${index + 1}`}
          value={time}
          onChange={(e) => handleTimeChange(index, e.target.value)}
          type="time"
          inputProps={{ step: 60 }}
          fullWidth
          margin="normal"
        />
      ))}

      <FormControlLabel
        control={<Checkbox checked={isEveryday} onChange={handleEverydayChange} />}
        label="Ativar todos os dias"
      />

      {!isEveryday && (
        <Box display="flex" flexDirection="column" marginTop={2}>
          <Grid container spacing={2}>
            {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map((day, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedDays.includes(day)}
                      onChange={() => handleDayChange(day)}
                    />
                  }
                  label={day}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      )}

      <Button
        variant="contained"
        color="primary"
        fullWidth
        style={{ marginTop: '20px' }}
        onClick={handleSave}
        disabled={loading}
      >
        {loading ? 'Salvando...' : 'Salvar Configuração'}
      </Button>
    </Box>
  );
};

export default Configuracao;
