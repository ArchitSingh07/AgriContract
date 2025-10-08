import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
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
  Moon
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  type: string;
  quantity: number;
  unit: string;
  price: number;
  harvestDate: string;
  farmerId: string;
  farmerName: string;
  description: string;
  image: string;
}

interface DashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function Dashboard({ user, onNavigate, onLogout, theme, onToggleTheme }: DashboardProps) {
  // Mock product data
  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'Organic Tomatoes',
      type: 'Vegetables',
      quantity: 500,
      unit: 'kg',
      price: 45,
      harvestDate: '2024-01-15',
      farmerId: 'farmer1',
      farmerName: 'John Smith',
      description: 'Fresh organic tomatoes grown without pesticides',
      image: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400'
    },
    {
      id: '2',
      name: 'Premium Rice',
      type: 'Grains',
      quantity: 1000,
      unit: 'kg',
      price: 120,
      harvestDate: '2024-01-20',
      farmerId: 'farmer2',
      farmerName: 'Maria Garcia',
      description: 'High-quality basmati rice, aged to perfection',
      image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400'
    },
    {
      id: '3',
      name: 'Fresh Wheat',
      type: 'Grains',
      quantity: 2000,
      unit: 'kg',
      price: 35,
      harvestDate: '2024-01-25',
      farmerId: 'farmer3',
      farmerName: 'David Johnson',
      description: 'Premium wheat suitable for flour production',
      image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400'
    },
    {
      id: '4',
      name: 'Organic Carrots',
      type: 'Vegetables',
      quantity: 300,
      unit: 'kg',
      price: 55,
      harvestDate: '2024-01-18',
      farmerId: 'farmer1',
      farmerName: 'John Smith',
      description: 'Sweet and crunchy organic carrots',
      image: 'https://images.unsplash.com/photo-1582515073490-39981397c445?w=400'
    }
  ];

  const [products] = useState<Product[]>(mockProducts);
  const [showEmptyProducts, setShowEmptyProducts] = useState(false); // Toggle this to test empty state

  // Use empty array when testing empty state, otherwise use mockProducts
  const displayProducts = showEmptyProducts ? [] : products;

  const stats = [
    {
      title: user.userType === 'farmer' ? 'Products Listed' : 'Active Contracts',
      value: user.userType === 'farmer' ? '12' : '8',
      icon: Package,
      color: 'text-primary'
    },
    {
      title: user.userType === 'farmer' ? 'Total Revenue' : 'Total Spent',
      value: '₹2,45,000',
      icon: DollarSign,
      color: 'text-accent'
    },
    {
      title: 'Pending Negotiations',
      value: '5',
      icon: FileText,
      color: 'text-blue-400'
    },
    {
      title: 'Completed Deals',
      value: '23',
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
            {user.userType === 'farmer' 
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

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4">
          {user.userType === 'farmer' ? (
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
                {user.userType === 'farmer' ? 'Your Products' : 'Available Products'}
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
              {user.userType === 'farmer' 
                ? 'Manage your listed products' 
                : 'Fresh produce available for contract'
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            {displayProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {user.userType === 'farmer' ? 'No Products Listed' : 'No Products Available'}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {user.userType === 'farmer' 
                    ? 'Start by listing your first product to connect with buyers' 
                    : 'Check back later for fresh products from local farmers'
                  }
                </p>
                {user.userType === 'farmer' && (
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
                {displayProducts.slice(0, 6).map((product) => (
                  <Card 
                    key={product.id} 
                    className="bg-input-background border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('product-details', product)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        <img 
                          src={product.image} 
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
                            ₹{product.price}/{product.unit}
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