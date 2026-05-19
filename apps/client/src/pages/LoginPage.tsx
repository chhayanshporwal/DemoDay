// ==========================================
// LoginPage — Supabase auth (email + GitHub OAuth)
// Split layout: gradient branding left, form right
// ==========================================

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import GitHubIcon from '@mui/icons-material/GitHub';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import supabase from '../lib/supabase';
import { useStore } from '../store/useStore';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, accessToken, isLoading } = useStore();
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    if (!isLoading && accessToken) {
      if (user) {
        navigate('/', { replace: true });
      } else {
        navigate('/onboarding', { replace: true });
      }
    }
  }, [user, accessToken, isLoading, navigate]);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isSignUp) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: fullName } },
        });
        if (signUpError) throw signUpError;
        navigate('/onboarding');
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInError) throw signInError;
        navigate('/');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGitHubAuth = async () => {
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/onboarding` },
    });
    if (oauthError) setError(oauthError.message);
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Left panel — Branding */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          flex: 1,
          background: 'linear-gradient(135deg, #0B0F1A 0%, #1E1B4B 40%, #312E81 70%, #4F46E5 100%)',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          p: 6,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <Box sx={{
          position: 'absolute', top: -100, right: -100, width: 400, height: 400,
          borderRadius: '50%', background: 'rgba(79, 70, 229, 0.15)', filter: 'blur(80px)',
        }} />
        <Box sx={{
          position: 'absolute', bottom: -80, left: -80, width: 300, height: 300,
          borderRadius: '50%', background: 'rgba(13, 148, 136, 0.15)', filter: 'blur(60px)',
        }} />

        <Box sx={{ position: 'relative', zIndex: 1, textAlign: 'center', maxWidth: 480 }}>
          <Box sx={{
            width: 72, height: 72, borderRadius: '18px', mx: 'auto', mb: 4,
            background: 'linear-gradient(135deg, #818CF8, #2DD4BF)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '2rem', fontWeight: 900, color: '#0B0F1A',
            boxShadow: '0 20px 60px rgba(79, 70, 229, 0.4)',
          }}>
            D
          </Box>
          <Typography variant="h2" sx={{ color: '#F1F5F9', mb: 2, fontWeight: 800 }}>
            Show what you build.
          </Typography>
          <Typography sx={{ color: '#94A3B8', fontSize: '1.1rem', lineHeight: 1.7 }}>
            DemoDay replaces the text-heavy resume with interactive video portfolios.
            Get discovered by elite recruiters through your deployed projects.
          </Typography>

          {/* Feature pills */}
          <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'center', mt: 4, flexWrap: 'wrap' }}>
            {['60s Project Reels', 'Verified Credentials', 'Direct Recruiter DMs'].map((f) => (
              <Box
                key={f}
                sx={{
                  px: 2, py: 0.75, borderRadius: 3, fontSize: '0.8rem', fontWeight: 600,
                  border: '1px solid rgba(255,255,255,0.15)', color: '#CBD5E1',
                  backdropFilter: 'blur(4px)', bgcolor: 'rgba(255,255,255,0.05)',
                }}
              >
                {f}
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Right panel — Auth form */}
      <Box
        sx={{
          flex: { xs: 1, md: '0 0 480px' },
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          p: { xs: 3, sm: 6 },
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ maxWidth: 380, width: '100%', mx: 'auto' }}>
          {/* Mobile logo */}
          <Box sx={{ display: { md: 'none' }, mb: 4, textAlign: 'center' }}>
            <Box sx={{
              width: 48, height: 48, borderRadius: '12px', mx: 'auto', mb: 2,
              background: 'linear-gradient(135deg, #4F46E5, #0D9488)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.5rem', fontWeight: 900, color: '#fff',
            }}>
              D
            </Box>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
            {isSignUp ? 'Create your account' : 'Welcome back'}
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            {isSignUp ? 'Start building your visual portfolio' : 'Sign in to continue to DemoDay'}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {/* GitHub OAuth */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GitHubIcon />}
            onClick={handleGitHubAuth}
            sx={{
              py: 1.25, mb: 2.5, borderColor: 'divider', color: 'text.primary',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'text.secondary' },
            }}
          >
            Continue with GitHub
          </Button>

          <Divider sx={{ mb: 2.5 }}>
            <Typography variant="caption" color="text.secondary">or</Typography>
          </Divider>

          {/* Email form */}
          <Box component="form" onSubmit={handleEmailAuth}>
            {isSignUp && (
              <TextField
                fullWidth
                label="Full Name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                sx={{ mb: 2 }}
              />
            )}
            <TextField
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              sx={{ mb: 3 }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ py: 1.25, fontSize: '0.95rem' }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : isSignUp ? 'Create Account' : 'Sign In'}
            </Button>
          </Box>

          <Typography sx={{ mt: 3, textAlign: 'center' }} variant="body2" color="text.secondary">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
            <Box
              component="span"
              onClick={() => { setIsSignUp(!isSignUp); setError(null); }}
              sx={{
                color: 'primary.main', fontWeight: 600, cursor: 'pointer',
                '&:hover': { textDecoration: 'underline' },
              }}
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </Box>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
