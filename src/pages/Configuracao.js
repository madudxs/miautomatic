import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, FormControlLabel, Checkbox, Grid, Select, MenuItem, InputLabel, FormControl, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';

const Configuracao = () => {
  const [mealCount, setMealCount] = useState(1); 
  const [mealTimes, setMealTimes] = useState([null]); 
  const [isEveryday, setIsEveryday] = useState(false); 
  const [selectedDays, setSelectedDays] = useState([]); 
  const navigate = useNavigate();

  const theme = useTheme(); 

  useEffect(() => {
    document.body.style.backgroundColor = theme.palette.background.default;

    return () => {
      document.body.style.backgroundColor = '';
    };
  }, [theme]); 

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  const handleMealCountChange = (event) => {
    const count = event.target.value;
    setMealCount(count);

    setMealTimes(Array(count).fill(null)); 
  };

  const handleTimeChange = (index, newTime) => {
    const updatedMealTimes = [...mealTimes];
    updatedMealTimes[index] = newTime;
    setMealTimes(updatedMealTimes); 
    console.log(`Horário da refeição ${index + 1} atualizado:`, newTime);  
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

  const handleSave = () => {
    const config = {
      mealCount,
      mealTimes,
      isEveryday,
      selectedDays,
    };

    console.log('Configurações antes de salvar:', config); 
    localStorage.setItem('mealConfig', JSON.stringify(config));

    navigate('/principal');
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
     <Typography variant='subtitle1'>Determine quantidade e horário das refeições automáticas</Typography>
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

      {Array.from({ length: mealCount }).map((_, index) => (
        <TextField
          key={index}
          label={`Horário da refeição ${index + 1}`}
          value={mealTimes[index] || ""}
          onChange={(e) => handleTimeChange(index, e.target.value)}
          type="time"
          inputProps={{
            step: 60, 
          }}
          fullWidth
          margin="normal"
          style={{ marginTop: '20px' }}
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
              <Grid item xs={4} key={index}>
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
      >
        Salvar Configuração
      </Button>
    </Box>
  );
};

export default Configuracao;
