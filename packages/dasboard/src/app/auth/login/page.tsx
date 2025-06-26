// packages/dashboard/src/app/auth/login/page.tsx
'use client';
import { useState } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Typography, 
  Alert,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Divider,
  Chip
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Google,
  GitHub,
  Apple
} from '@mui/icons-material';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('Simulated login:', form);
    const user = { 
      email: form.email, 
      organizations: [{ id: 1, name: 'Acme Corp', subdomain: 'acme' }] 
    };
    setMessage(`✅ Welcome back, ${user.email}`);
    console.log('Organizations:', user.organizations);
    setLoading(false);
  }

  const handleSocialLogin = (provider: string) => {
    console.log(`Social login with ${provider}`);
    setMessage(`✅ Logging in with ${provider}...`);
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper 
        elevation={24}
        sx={{
          maxWidth: 440,
          width: '100%',
          p: 4,
          borderRadius: 3,
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Box textAlign="center" mb={3}>
          <Typography 
            variant="h4" 
            gutterBottom 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Welcome Back
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Sign in to your account to continue
          </Typography>
        </Box>

        {/* Social Login Buttons */}
        <Box mb={3}>
          <Box display="flex" gap={1} mb={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialLogin('Google')}
              sx={{ textTransform: 'none' }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={() => handleSocialLogin('GitHub')}
              sx={{ textTransform: 'none' }}
            >
              GitHub
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Apple />}
              onClick={() => handleSocialLogin('Apple')}
              sx={{ textTransform: 'none' }}
            >
              Apple
            </Button>
          </Box>
          
          <Divider>
            <Chip label="or continue with email" size="small" />
          </Divider>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="email"
            label="Email Address"
            type="email"
            margin="normal"
            value={form.email}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="action" />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />
          
          <TextField
            fullWidth
            name="password"
            label="Password"
            type={showPassword ? 'text' : 'password'}
            margin="normal"
            value={form.password}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <Box display="flex" justifyContent="space-between" alignItems="center" mt={1} mb={3}>
            <Box>
              {/* Remember me could go here */}
            </Box>
            <Link 
              href="#" 
              variant="body2" 
              sx={{ 
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Forgot password?
            </Link>
          </Box>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #5a67d8, #6b46c1)',
              }
            }}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </Button>
        </form>

        {message && (
          <Alert 
            severity="success" 
            sx={{ 
              mt: 2,
              borderRadius: 2 
            }}
          >
            {message}
          </Alert>
        )}

        <Box textAlign="center" mt={3}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link 
              href="/auth/signup" 
              sx={{ 
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}