import React, { useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { Player } from '@lottiefiles/react-lottie-player';
import { useTheme } from '@mui/material/styles';
import animation from '../assets/images/animation.json';
import logo from '../assets/images/logo.png';

const Login = () => {
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
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width="100%"
          maxWidth="400px"
          zIndex={1}
          >
        <Typography variant='h5'>Acesse sua conta</Typography>
          <TextField label="E-mail" variant="outlined" fullWidth margin="normal" />
          <TextField label="Senha" type="password" variant="outlined" fullWidth margin="normal" />
          <Button variant="contained" color="primary" fullWidth>
            Entrar
          </Button>
          <Typography variant="body2" marginTop={2}>
            Ainda não tem uma conta?{' '}
            <Link component={RouterLink} to="/cadastro" color="primary" underline="hover">
              Cadastre-se aqui
            </Link>
          </Typography>
        </Box>

        <Box
          position="absolute"
          bottom="0"
          transform="translateX(-50%)" 
          width="100%"
          maxWidth="300px" 
        >
          <Player
            autoplay
            loop
            src={animation}
            style={{
              width: '100%',
              height: 'auto', 
            }}
          />
        </Box>
      </Box>
    </>
  );
};

export default Login;
