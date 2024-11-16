import React, { useEffect, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { TextField, Button, Select, MenuItem, FormControl, InputLabel, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; 
import logo from '../assets/images/logo.png';

const Cadastro = () => {
  const theme = useTheme();
  const navigate = useNavigate(); 

  const [nomeAnimal, setNomeAnimal] = useState('');
  const [idade, setIdade] = useState('');
  const [peso, setPeso] = useState('');
  const [especie, setEspecie] = useState('');

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

  const handleCadastro = () => {
    if (!nomeAnimal || !idade || !peso || !especie) {
      alert('Por favor, preencha todos os campos.');
    } else {
      const petData = {
        nome: nomeAnimal,
        idade,
        peso,
        especie,
      };
      localStorage.setItem('petData', JSON.stringify(petData));

      navigate('/Configuracao');
    }
  };

  return (
    <>
      <Box
        component="header"
        display="flex"
        justifyContent="center"
        alignItems="center"
        position="absolute"
        top={0}
        width="100%"
        zIndex={10}
      >
        <img src={logo} alt="Logo" style={{ maxWidth: '400px', width: '100%' }} />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        minHeight="100vh"
        padding={2}
        overflow="hidden"
      >
        <TextField
          label="Nome do Animal"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={nomeAnimal}
          onChange={(e) => setNomeAnimal(e.target.value)}
        />
        <TextField
          label="Idade (em anos)"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={idade}
          onChange={(e) => setIdade(e.target.value)}
        />
        <TextField
          label="Peso (kg)"
          variant="outlined"
          fullWidth
          margin="normal"
          required
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
        />
        <FormControl fullWidth margin="normal" required>
          <InputLabel>Espécie</InputLabel>
          <Select
            value={especie}
            onChange={(e) => setEspecie(e.target.value)}
          >
            <MenuItem value="cachorro">Cachorro</MenuItem>
            <MenuItem value="gato">Gato</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handleCadastro} 
        >
          Cadastrar
        </Button>
      </Box>
    </>
  );
};

export default Cadastro;
