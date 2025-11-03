import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  Sprout,
  ShoppingCart,
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
  AlertCircle
} from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';

interface DashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Dashboard({ user, onNavigate, onLogout, theme, onToggleTheme }: DashboardProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch products on mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError('');
        
        let response;
        const userRole = user.role?.toLowerCase() || user.userType;
        
        if (userRole === 'farmer') {
          // Fetch only farmer's own products
          response = await productService.getProductsByFarmer(user._id || user.id);
        } else {
          // Fetch all products for buyers
          response = await productService.getAllProducts();
        }
        
        // Show only first 4 products on dashboard
        setProducts(response.products.slice(0, 4));
      } catch (err: any) {
        console.error('Failed to fetch products:', err);
        setError(err.response?.data?.message || 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [user._id, user.id, user.role, user.userType]);

  // Determine user role (support both role and userType properties)
  const userRole = (user.role?.toLowerCase() || user.userType) as 'farmer' | 'buyer';

  const stats = [
    {
      title: userRole === 'farmer' ? 'Products Listed' : 'Available Products',
      value: products.length.toString(),
      icon: Package,
      color: 'text-primary'
    },
    {
      title: userRole === 'farmer' ? 'Total Revenue' : 'Total Spent',
      value: '₹0', // This can be calculated from contracts later
      icon: DollarSign,
      color: 'text-accent'
    },
    {
      title: 'Pending Negotiations',
      value: '0', // This will come from contracts/negotiations
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      title: 'Completed Deals',
      value: '0', // This will come from contracts
      icon: Calendar,
      color: 'text-green-400'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AgriContract</h1>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-foreground hover:text-primary">
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('products')}
            >
              Products
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('contracts')}
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
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
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
          <h2 className="text-2xl font-bold text-foreground">
            Welcome back, {user.name}!
          </h2>
          <p className="text-muted-foreground">
            {userRole === 'farmer'
              ? 'Manage your crops and connect with buyers'
              : 'Discover fresh produce and connect with farmers'
            }
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {userRole === 'farmer' ? (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate('list-product')}
            >
              <Plus className="h-4 w-4 mr-2" />
              List New Product
            </Button>
          ) : (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate('products')}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Browse Products
            </Button>
          )}
          <Button
            variant="outline"
            className="border-border hover:bg-accent hover:text-accent-foreground"
            onClick={() => onNavigate('contracts')}
          >
            <FileText className="h-4 w-4 mr-2" />
            View Contracts
          </Button>
        </div>

        {/* Products Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>
                {userRole === 'farmer' ? 'Your Products' : 'Available Products'}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('products')}
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              {userRole === 'farmer'
                ? 'Manage your listed products'
                : 'Fresh produce available for contract'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {userRole === 'farmer' ? 'No Products Listed' : 'No Products Available'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {userRole === 'farmer'
                    ? 'Start by listing your first product to connect with buyers'
                    : 'Check back later for fresh products from local farmers'
                  }
                </p>
                {userRole === 'farmer' && (
                  <Button
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => onNavigate('list-product')}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    List Your First Product
                  </Button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <Card
                    key={product._id}
                    className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('product-details', product)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'}
                          alt={product.name}
                          className="w-full h-full object-cover"
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
      </main>
    </div>
  );
}