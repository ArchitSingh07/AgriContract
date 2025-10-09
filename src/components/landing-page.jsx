import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  Handshake, 
  Shield, 
  TrendingUp, 
  Users, 
  FileText, 
  MessageCircle, 
  DollarSign,
  CheckCircle,
  ArrowRight,
  Leaf,
  Globe,
  Star
} from 'lucide-react';



export function LandingPage({ onGetStarted, theme, onToggleTheme }) {
  const features = [
    {
      icon,
      title: 'Secure Contracts',
      description: 'Get tailored contract recommendations based on your farm profile, crop types, and market analysis. Upload your farm details for automatic contract matching with verified buyers.',
      color: 'text-blue-500'
    },
    {
      icon,
      title: 'Market Insights',
      description: 'See your market journey as an interactive timeline. Explore market trends, price forecasting, and discover new opportunities to optimize your farming income.',
      color: 'text-purple-500'
    },
    {
      icon,
      title: 'Risk Management',
      description: 'Identify exactly what risks you need to mitigate for your farming operation. Get specific recommendations for insurance, weather protection, and market volatility safeguards.',
      color: 'text-green-500'
    }
  ];

  const howItWorksSteps = [
    {
      step: '01',
      title: 'Create Your Profile',
      description: 'Sign up as a farmer or buyer and complete your profile with farm details, crop preferences, and business requirements.'
    },
    {
      step: '02',
      title: 'Browse & Connect',
      description: 'Farmers list their produce and buyers explore available crops. Our smart matching system connects compatible parties.'
    },
    {
      step: '03',
      title: 'Negotiate Terms',
      description: 'Use our built-in chat system to negotiate prices, quantities, delivery dates, and quality specifications.'
    },
    {
      step: '04',
      title: 'Secure Contract',
      description: 'Finalize agreements with digital contracts that protect both parties and ensure transparent terms.'
    },
    {
      step: '05',
      title: 'Execute & Pay',
      description: 'Track delivery progress and process secure payments upon successful contract completion.'
    }
  ];

  const stats = [
    { value: '10,000+', label: 'Active Farmers' },
    { value: '500+', label: 'Verified Buyers' },
    { value: '$50M+', label: 'Contract Value' },
    { value: '98%', label: 'Success Rate' }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="bg-card/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Leaf className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">CropContract</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                How It Works
              </a>
              <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
                About
              </a>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleTheme}
                className="text-muted-foreground hover:text-primary"
              >
                {theme === 'dark' ? 'â˜€ï¸' : 'ðŸŒ™'}
              </Button>
              <Button onClick={onGetStarted} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 mb-4">
              ðŸŒ¾ Revolutionizing Agriculture
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Secure your harvest,
              <br />
              <span className="text-primary">one contract at a time.</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Connect farmers with reliable buyers through transparent contract farming. 
              Ensure guaranteed market access, stable pricing, and secure payments for agricultural produce.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
            >
              Start Your Journey <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-border hover:bg-accent hover:text-accent-foreground px-8 py-3"
            >
              Watch Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose CropContract?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering farmers and buyers with tools for transparent, secure, and profitable agricultural contracts.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                
                  <div className={`w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4`}>
                    <feature.icon className={`h-6 w-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-foreground">{feature.title}</CardTitle>
                </CardHeader>
                
                  <CardDescription className="text-muted-foreground">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to connect farmers and buyers for successful contract farming agreements.
            </p>
          </div>
          
          <div className="space-y-8">
            {howItWorksSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xl font-bold">
                    {step.step}
                  </div>
                </div>
                <div className="flex-grow">
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
                {index < howItWorksSteps.length - 1 && (
                  <div className="hidden md:block">
                    <ArrowRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                Transforming Agriculture Through Technology
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our platform bridges the gap between farmers and buyers, creating a transparent 
                marketplace that benefits everyone in the agricultural supply chain.
              </p>
              
              <div className="space-y-4">
                {[
                  'Guaranteed market access for farmers',
                  'Transparent pricing and contract terms',
                  'Secure payment processing',
                  'Risk mitigation through contracts',
                  'Quality assurance mechanisms',
                  'Real-time communication tools'
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Card className="bg-card border-border">
                <CardHeader className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl text-foreground">For Farmers</CardTitle>
                </CardHeader>
                
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    â€¢ Stable income guarantee</li>
                    â€¢ Reduced market risks</li>
                    â€¢ Fair pricing</li>
                    â€¢ Technical support</li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card className="bg-card border-border">
                <CardHeader className="text-center">
                  <Globe className="h-8 w-8 text-primary mx-auto mb-2" />
                  <CardTitle className="text-2xl text-foreground">For Buyers</CardTitle>
                </CardHeader>
                
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    â€¢ Reliable supply chain</li>
                    â€¢ Quality assurance</li>
                    â€¢ Competitive pricing</li>
                    â€¢ Direct farmer access</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Transform Your Agricultural Business?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of farmers and buyers who are already benefiting from secure contract farming.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onGetStarted}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3"
            >
              Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-border hover:bg-accent hover:text-accent-foreground px-8 py-3"
            >
              Contact Sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Leaf className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">CropContract</span>
              </div>
              <p className="text-muted-foreground">
                Connecting farmers and buyers for transparent, secure contract farming.
              </p>
            </div>
            
            
              <h3 className="font-semibold text-foreground mb-4">Platform</h3>
              <ul className="space-y-2 text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Features</a></li>
                <a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <a href="#" className="hover:text-primary transition-colors">API</a></li>
                <a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
              </ul>
            </div>
            
            
              <h3 className="font-semibold text-foreground mb-4">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                <a href="#" className="hover:text-primary transition-colors">Community</a></li>
                <a href="#" className="hover:text-primary transition-colors">Status</a></li>
              </ul>
            </div>
            
            
              <h3 className="font-semibold text-foreground mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <a href="#" className="hover:text-primary transition-colors">About</a></li>
                <a href="#" className="hover:text-primary transition-colors">Blog</a></li>
                <a href="#" className="hover:text-primary transition-colors">Careers</a></li>
                <a href="#" className="hover:text-primary transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            &copy; 2025 CropContract. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

