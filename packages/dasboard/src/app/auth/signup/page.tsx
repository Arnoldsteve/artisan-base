// packages/dashboard/src/app/auth/signup/page.tsx
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
  Chip,
  FormControlLabel,
  Checkbox,
  LinearProgress
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email, 
  Lock,
  Person,
  Google,
  GitHub,
  Apple,
  CheckCircle,
  Cancel
} from '@mui/icons-material';

export default function SignupPage() {
  const [form, setForm] = useState({
    firstName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    if (form.password !== form.confirmPassword) {
      setMessage('❌ Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setMessage('❌ Please agree to the terms and conditions');
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Simulated signup:', form);
    setMessage('✅ Account created successfully! Welcome aboard!');
    setLoading(false);
  }

  const handleSocialSignup = (provider: string) => {
    console.log(`Social signup with ${provider}`);
    setMessage(`✅ Creating account with ${provider}...`);
  };

  // Password strength calculation
  const getPasswordStrength = () => {
    const password = form.password;
    if (!password) return 0;
    
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    
    return strength;
  };

  const getPasswordStrengthColor = () => {
    const strength = getPasswordStrength();
    if (strength < 50) return 'error';
    if (strength < 75) return 'warning';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    const strength = getPasswordStrength();
    if (strength < 25) return 'Very Weak';
    if (strength < 50) return 'Weak';
    if (strength < 75) return 'Good';
    return 'Strong';
  };

  return (
    <Box 
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2
      }}
    >
      <Paper 
        elevation={24}
        sx={{
          maxWidth: 480,
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
              background: 'linear-gradient(45deg, #f093fb, #f5576c)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}
          >
            Create Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Join us and start your journey today
          </Typography>
        </Box>

        {/* Social Signup Buttons */}
        <Box mb={3}>
          <Box display="flex" gap={1} mb={2}>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Google />}
              onClick={() => handleSocialSignup('Google')}
              sx={{ textTransform: 'none' }}
            >
              Google
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<GitHub />}
              onClick={() => handleSocialSignup('GitHub')}
              sx={{ textTransform: 'none' }}
            >
              GitHub
            </Button>
            <Button
              fullWidth
              variant="outlined"
              startIcon={<Apple />}
              onClick={() => handleSocialSignup('Apple')}
              sx={{ textTransform: 'none' }}
            >
              Apple
            </Button>
          </Box>
          
          <Divider>
            <Chip label="or create with email" size="small" />
          </Divider>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="firstName"
            label="First Name"
            margin="normal"
            value={form.firstName}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="action" />
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

          {/* Password Strength Indicator */}
          {form.password && (
            <Box mt={1} mb={1}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                <Typography variant="caption" color="text.secondary">
                  Password Strength
                </Typography>
                <Typography variant="caption" color={`${getPasswordStrengthColor()}.main`}>
                  {getPasswordStrengthText()}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={getPasswordStrength()} 
                color={getPasswordStrengthColor()}
                sx={{ borderRadius: 1 }}
              />
            </Box>
          )}

          <TextField
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            margin="normal"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            error={form.confirmPassword && form.password !== form.confirmPassword}
            helperText={
              form.confirmPassword && form.password !== form.confirmPassword 
                ? 'Passwords do not match' 
                : ''
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="action" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Box display="flex" alignItems="center" gap={1}>
                    {form.confirmPassword && (
                      form.password === form.confirmPassword ? 
                        <CheckCircle color="success" fontSize="small" /> :
                        <Cancel color="error" fontSize="small" />
                    )}
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </Box>
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
              }
            }}
          />

          <FormControlLabel
            control={
              <Checkbox
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                color="primary"
              />
            }
            label={
              <Typography variant="body2" color="text.secondary">
                I agree to the{' '}
                <Link href="#" sx={{ textDecoration: 'none' }}>
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" sx={{ textDecoration: 'none' }}>
                  Privacy Policy
                </Link>
              </Typography>
            }
            sx={{ mt: 2, mb: 1 }}
          />

          <Button
            fullWidth
            type="submit"
            variant="contained"
            size="large"
            disabled={loading || !agreedToTerms}
            sx={{
              mt: 2,
              py: 1.5,
              borderRadius: 2,
              background: 'linear-gradient(45deg, #f093fb, #f5576c)',
              textTransform: 'none',
              fontSize: '1.1rem',
              fontWeight: 600,
              '&:hover': {
                background: 'linear-gradient(45deg, #e086f7, #f04458)',
              }
            }}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </Button>
        </form>

        {message && (
          <Alert 
            severity={message.includes('✅') ? 'success' : 'error'} 
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
            Already have an account?{' '}
            <Link 
              href="/auth/login" 
              sx={{ 
                fontWeight: 600,
                textDecoration: 'none',
                '&:hover': { textDecoration: 'underline' }
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}