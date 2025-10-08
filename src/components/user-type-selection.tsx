import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Sprout, User, ShoppingCart, Sun, Moon } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelectUserType: (userType: 'farmer' | 'buyer') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function UserTypeSelection({ onSelectUserType, theme, onToggleTheme }: UserTypeSelectionProps) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-lg space-y-6">
        {/* Header with Theme Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-foreground">AgriContract</h1>
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

        {/* Welcome Section */}
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Welcome to AgriContract</h2>
          <p className="text-muted-foreground">
            Choose your role to get started with assured contract farming
          </p>
        </div>

        {/* User Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Farmer Card */}
          <Card 
            className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => onSelectUserType('farmer')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center group-hover:bg-green-200 dark:group-hover:bg-green-800 transition-colors">
                <Sprout className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-xl">I'm a Farmer</CardTitle>
              <CardDescription>
                List your crops and connect with verified buyers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>List your agricultural products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Negotiate directly with buyers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Secure guaranteed payments</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  <span>Manage contracts digitally</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUserType('farmer');
                }}
              >
                <User className="h-4 w-4 mr-2" />
                Continue as Farmer
              </Button>
            </CardContent>
          </Card>

          {/* Buyer Card */}
          <Card 
            className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
            onClick={() => onSelectUserType('buyer')}
          >
            <CardHeader className="text-center pb-2">
              <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center group-hover:bg-blue-200 dark:group-hover:bg-blue-800 transition-colors">
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-xl">I'm a Buyer</CardTitle>
              <CardDescription>
                Source quality produce directly from farmers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Browse fresh agricultural products</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Connect directly with farmers</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Ensure quality and freshness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  <span>Secure contract agreements</span>
                </li>
              </ul>
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectUserType('buyer');
                }}
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Continue as Buyer
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Platform Description */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-xl font-bold text-card-foreground">Contract Farming Platform</h3>
              <p className="text-muted-foreground leading-relaxed">
                Our comprehensive platform facilitates assured contract farming agreements between farmers and buyers, 
                providing stability by ensuring farmers have guaranteed buyers for their produce while offering buyers 
                direct access to quality agricultural products.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Key Features Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-foreground">Platform Features</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Sprout className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Transparent Communication</h4>
                    <p className="text-sm text-muted-foreground">
                      Direct messaging and negotiation tools between farmers and buyers for clear, honest dealings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingCart className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Secure Contracts</h4>
                    <p className="text-sm text-muted-foreground">
                      Digital contract management with legal protection and automated enforcement mechanisms.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Price Negotiation</h4>
                    <p className="text-sm text-muted-foreground">
                      Fair and transparent pricing through our built-in negotiation system with market insights.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">Secure Payment Processing</h4>
                    <p className="text-sm text-muted-foreground">
                      Guaranteed timely payments with escrow services ensuring financial security for all parties.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Benefits Section */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <h3 className="font-semibold text-card-foreground">Why Choose AgriContract?</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary rounded-full"></div>
                  </div>
                  <p className="font-medium text-card-foreground">Market Stability</p>
                  <p className="text-muted-foreground">Reduce market risks with guaranteed buyers and predictable income</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-accent rounded-full"></div>
                  </div>
                  <p className="font-medium text-card-foreground">Quality Assurance</p>
                  <p className="text-muted-foreground">Connect with verified farmers and ensure product quality standards</p>
                </div>
                <div className="text-center space-y-2">
                  <div className="mx-auto w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  </div>
                  <p className="font-medium text-card-foreground">Enhanced Income</p>
                  <p className="text-muted-foreground">Improve income stability through long-term contract agreements</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How It Works Section */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-center text-foreground">How It Works</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card border-border text-center">
              <CardContent className="p-4 space-y-3">
                <div className="mx-auto w-12 h-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-green-600">1</span>
                </div>
                <h4 className="font-semibold text-foreground">Connect</h4>
                <p className="text-sm text-muted-foreground">
                  Farmers list their crops and buyers browse available products on our marketplace
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardContent className="p-4 space-y-3">
                <div className="mx-auto w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-blue-600">2</span>
                </div>
                <h4 className="font-semibold text-foreground">Negotiate</h4>
                <p className="text-sm text-muted-foreground">
                  Use our platform tools to negotiate prices, quantities, and delivery terms transparently
                </p>
              </CardContent>
            </Card>

            <Card className="bg-card border-border text-center">
              <CardContent className="p-4 space-y-3">
                <div className="mx-auto w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                  <span className="text-lg font-bold text-purple-600">3</span>
                </div>
                <h4 className="font-semibold text-foreground">Secure & Deliver</h4>
                <p className="text-sm text-muted-foreground">
                  Finalize contracts digitally and enjoy secure payments upon successful delivery
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}