import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Sprout, ArrowLeft, Sun, Moon, User, ShoppingCart } from 'lucide-react';

interface LoginPageProps {
  onLogin: (userType: 'farmer' | 'buyer', userData: any) => void;
  userType: 'farmer' | 'buyer';
  onBack: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function LoginPage({ onLogin, userType, onBack, theme, onToggleTheme }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleLogin = () => {
    // Mock login - in real app this would authenticate with backend
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: name || 'Demo User',
      email,
      phone: phone || '+1234567890',
      userType
    };
    onLogin(userType, userData);
  };

  const handleQuickLogin = (type: 'farmer' | 'buyer') => {
    const userData = {
      id: Math.random().toString(36).substr(2, 9),
      name: type === 'farmer' ? 'John Farmer' : 'Sarah Buyer',
      email: type === 'farmer' ? 'john@farm.com' : 'sarah@company.com',
      phone: '+1234567890',
      userType: type
    };
    onLogin(type, userData);
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
              onClick={() => handleQuickLogin(userType)} 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Quick Demo Login
            </Button>
          </CardContent>
        </Card>

        {/* Full Login Form */}
        <Card className="bg-card border-border">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-4 px-6 pb-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-input-background border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  className="bg-input-background border-border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleLogin} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Login
              </Button>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-4 px-6 pb-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  className="bg-input-background border-border"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="Enter your email"
                  className="bg-input-background border-border"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  className="bg-input-background border-border"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
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
                  placeholder="Create a password"
                  className="bg-input-background border-border"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleLogin} 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Sign Up
              </Button>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}