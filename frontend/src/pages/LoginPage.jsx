import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Link eklendi
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  CircularProgress, 
  Alert, 
  Paper 
} from '@mui/material';

function LoginPage() {
  const [username, setUsername] = useState(''); // State adı 'username' olarak kalabilir, çünkü login fonksiyonunuz onu bekliyor
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(username, password);
      console.log('Giriş Başarılı! Yönlendiriliyor...');
      navigate('/'); // Dashboard veya ana sayfaya yönlendir
    } catch (err) {
      console.error('Giriş hatası:', err.message);
      setError(err.message || 'Kullanıcı adı veya şifre hatalı.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper 
        elevation={6} 
        sx={{ 
          marginTop: 8, 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          padding: 4 
        }}
      >
        <Typography component="h1" variant="h5">
          Giriş Yap
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="E-posta Adresi"
            name="email"
            autoComplete="email"
            autoFocus
            type="email" // Tipi email
            value={username} // State'imiz hala username
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Şifre"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          {error && <Alert severity="error" sx={{ width: '100%', mt: 2 }}>{error}</Alert>}
          
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Giriş Yap'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default LoginPage;