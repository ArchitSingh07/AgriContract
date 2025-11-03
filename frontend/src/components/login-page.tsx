import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sprout, ArrowLeft, Sun, Moon, User, ShoppingCart, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from './ui/alert';
import { authService } from '../services/authService';
import type { LoginCredentials, RegisterData } from '../types';

interface LoginPageProps {
  onLogin: (userType: 'farmer' | 'buyer', userData: any) => void;
  userType: 'farmer' | 'buyer';
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LoginPage({ onLogin, userType, onBack, theme, onToggleTheme }: LoginPageProps) {
  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerLocation, setRegisterLocation] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const credentials: LoginCredentials = {
        email: loginEmail,
        password: loginPassword,
      };

      const response = await authService.login(credentials);

      if (response.success) {
        // Check if role matches the selected user type
        const userRole = response.user.role.toLowerCase() as 'farmer' | 'buyer';
        if (userRole !== userType) {
          setError(`This account is registered as a ${response.user.role}, not a ${userType}. Please select the correct user type.`);
          setLoading(false);
          return;
        }

        // Save token and user data
        authService.saveAuthData(response.token, response.user);
        
        // Success message
        setSuccess('Login successful! Redirecting...');
        
        // Call parent onLogin to update app state
        setTimeout(() => {
          onLogin(userRole, response.user);
        }, 500);
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to login. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate inputs
      if (!registerName || !registerEmail || !registerPassword) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (registerPassword.length < 6) {
        setError('Password must be at least 6 characters long');
        setLoading(false);
        return;
      }

      const registerData: RegisterData = {
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        role: userType === 'farmer' ? 'Farmer' : 'Buyer',
        location: registerLocation || '',
      };

      const response = await authService.register(registerData);

      if (response.success) {
        // Save token and user data
        authService.saveAuthData(response.token, response.user);
        
        // Success message
        setSuccess('Registration successful! Redirecting...');
        
        // Call parent onLogin to update app state
        const userRole = response.user.role.toLowerCase() as 'farmer' | 'buyer';
        setTimeout(() => {
          onLogin(userRole, response.user);
        }, 500);
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to register. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Use the same demo account for both - it's abcd@example.com which is a Farmer
      const demoCredentials: LoginCredentials = {
        email: 'abcd@example.com',
        password: 'password123',
      };

      const response = await authService.login(demoCredentials);
      
      if (response.success) {
        // Check if the demo account role matches selected user type
        const userRole = response.user.role.toLowerCase() as 'farmer' | 'buyer';
        if (userRole !== userType) {
          setError(`The demo account is registered as a ${response.user.role}. Please use the ${response.user.role.toLowerCase()} login option for quick demo.`);
          setLoading(false);
          return;
        }

        authService.saveAuthData(response.token, response.user);
        setSuccess('Quick demo login successful! Redirecting...');
        
        setTimeout(() => {
          onLogin(userRole, response.user);
        }, 500);
      }
    } catch (err: any) {
      console.error('Quick login error:', err);
      setError('Demo account not available. Please register or login with your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const userTypeIcon = userType === 'farmer' ? User : ShoppingCart;
  const userTypeColor = userType === 'farmer' ? 'text-green-600' : 'text-blue-600';
  const userTypeBg = userType === 'farmer' ? 'bg-green-100 dark:bg-green-900' : 'bg-blue-100 dark:bg-blue-900';

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-muted-foreground hover:text-primary"
            disabled={loading}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center space-x-2">
            <Sprout className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AgriContract</h1>
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={onToggleTheme}
            className="border-border hover:bg-accent hover:text-accent-foreground"
            disabled={loading}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4" />
            ) : (
              <Moon className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* User Type Indicator */}
        <div className="text-center space-y-3">
          <div className={`mx-auto w-16 h-16 ${userTypeBg} rounded-full flex items-center justify-center`}>
            {React.createElement(userTypeIcon, { className: `h-8 w-8 ${userTypeColor}` })}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {userType === 'farmer' ? 'Farmer Login' : 'Buyer Login'}
            </h2>
            <p className="text-muted-foreground">
              Enter your credentials to access your {userType} account
            </p>
          </div>
        </div>

        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <AlertDescription className="text-green-800 dark:text-green-300">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Quick Demo Access */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-center">Quick Demo Access</CardTitle>
            <CardDescription className="text-center">
              Try the platform instantly as a {userType}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleQuickLogin} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                'Quick Demo Login'
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Full Login Form */}
        <Card className="bg-card border-border">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" disabled={loading}>Login</TabsTrigger>
              <TabsTrigger value="signup" disabled={loading}>Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 px-6 pb-6">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-card border-border text-card-foreground"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter your password"
                    className="bg-card border-border text-card-foreground"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 px-6 pb-6">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className="bg-card border-border text-card-foreground"
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    className="bg-card border-border text-card-foreground"
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    type="text"
                    placeholder="Enter your location"
                    className="bg-card border-border text-card-foreground"
                    value={registerLocation}
                    onChange={(e) => setRegisterLocation(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="user-type">Account Type</Label>
                  <div className={`p-3 ${userTypeBg} rounded-lg border border-border`}>
                    <div className="flex items-center space-x-2">
                      {React.createElement(userTypeIcon, { className: `h-4 w-4 ${userTypeColor}` })}
                      <span className="font-medium text-foreground">
                        {userType === 'farmer' ? 'Farmer Account' : 'Buyer Account'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min 6 characters)"
                    className="bg-card border-border text-card-foreground"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required
                    minLength={6}
                    disabled={loading}
                  />
                </div>
                <Button 
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Sign Up'
                  )}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}