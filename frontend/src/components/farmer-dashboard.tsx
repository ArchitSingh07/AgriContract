import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  Sprout,
  FileText,
  User,
  LogOut,
  Plus,
  Calendar,
  DollarSign,
  Package,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  Clock
} from 'lucide-react';
import { productService } from '../services/productService';
import { contractService } from '../services/contractService';
import { negotiationService } from '../services/negotiationService';
import type { Product, ContractStats } from '../types';

interface FarmerDashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function FarmerDashboard({ user, onNavigate, onLogout, theme, onToggleTheme }: FarmerDashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<ContractStats | null>(null);
  const [activeNegotiations, setActiveNegotiations] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch farmer's products
        const productsResponse = await productService.getProductsByFarmer(user._id || user.id);
        setProducts(productsResponse.products.slice(0, 6));

        // Fetch contract statistics
        const statsResponse = await contractService.getContractStats(user._id || user.id);
        setStats(statsResponse.stats);

        // Fetch active negotiations
        const negotiationsResponse = await negotiationService.getNegotiationsByFarmer(user._id || user.id);
        const active = negotiationsResponse.negotiations.filter(n => n.status === 'active').length;
        setActiveNegotiations(active);

      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id, user.id]);

  const dashboardStats = [
    {
      title: 'Active Listings',
      value: products.length.toString(),
      icon: Package,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Pending Contracts',
      value: stats?.pendingContracts.toString() || '0',
      icon: Clock,
      color: 'text-yellow-500',
      bgColor: 'bg-yellow-500/10'
    },
    {
      title: 'Active Negotiations',
      value: activeNegotiations.toString(),
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total Revenue',
      value: `₹${stats?.totalValue.toLocaleString('en-IN') || '0'}`,
      icon: DollarSign,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AgriContract</h1>
            <Badge variant="outline" className="ml-2">Farmer</Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-primary font-semibold">
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('my-products')}
            >
              My Products
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('farmer-contracts')}
            >
              Contracts
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('profile')}
              className="text-muted-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name}! 🌾
          </h2>
          <p className="text-muted-foreground">
            Manage your crops, track negotiations, and grow your farming business
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Common tasks to get you started</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-4"
                onClick={() => onNavigate('list-product')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span className="font-semibold">List New Product</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground h-auto py-4"
                onClick={() => onNavigate('buyer-requests')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <MessageSquare className="h-6 w-6" />
                  <span className="font-semibold">Browse Buyer Requests</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground h-auto py-4"
                onClick={() => onNavigate('my-products')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Package className="h-6 w-6" />
                  <span className="font-semibold">View My Products</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground h-auto py-4"
                onClick={() => onNavigate('farmer-contracts')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-semibold">View Contracts</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Products */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Recent Listings</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('my-products')}
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Manage and track your product listings
            </CardDescription>
          </CardHeader>
          <CardContent>
            {products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Products Listed Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start by listing your first product to connect with buyers
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => onNavigate('list-product')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  List Your First Product
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card
                    key={product._id}
                    className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => onNavigate('product-details', product)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-foreground">{product.name}</h3>
                          <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                            {product.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            {product.quantity} {product.unit}
                          </span>
                          <span className="font-semibold text-accent">
                            ₹{product.pricePerUnit}/{product.unit}
                          </span>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3 mr-1" />
                          Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Contract Overview */}
        {stats && (stats.totalContracts > 0) && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Contract Overview</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onNavigate('farmer-contracts')}
                  className="border-border hover:bg-accent"
                >
                  View All Contracts
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
                  <div className="p-2 bg-green-500/10 rounded-full">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="text-xl font-bold text-foreground">{stats.completedContracts}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
                  <div className="p-2 bg-blue-500/10 rounded-full">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active</p>
                    <p className="text-xl font-bold text-foreground">{stats.activeContracts}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-accent/10 rounded-lg">
                  <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Clock className="h-5 w-5 text-yellow-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Pending</p>
                    <p className="text-xl font-bold text-foreground">{stats.pendingContracts}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
