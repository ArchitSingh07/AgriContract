import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import {
  ArrowLeft,
  Package,
  Plus,
  Calendar,
  Search
} from 'lucide-react';
import { Input } from './ui/input';





export function ProductsPage({ user, onNavigate }) {
  // Mock products data - set to empty array to show empty state
  const [products] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate('dashboard')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {user.userType === 'farmer' ? 'Your Products' : 'Available Products'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.userType === 'farmer'
                ? 'Manage your listed agricultural products'
                : 'Browse fresh produce from local farmers'
              }
            </p>
          </div>
          {user.userType === 'farmer' && (
            <Button
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => onNavigate('list-product')}
            >
              <Plus className="h-4 w-4 mr-2" />
              List New Product
            </Button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search and Filters */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-input-background border-border"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Products Grid */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Products ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>

            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {user.userType === 'farmer' ? 'No Products Listed' : 'No Products Available'}
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {user.userType === 'farmer'
                    ? 'You haven\'t listed any products yet. Start by adding your first product to connect with potential buyers.'
                    : 'No products are currently available. Check back later for fresh produce from local farmers.'
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="bg-input-background border-border hover:border-primary/50 transition-all cursor-pointer group"
                    onClick={() => onNavigate('product-details', product)}
                  >
                    <CardContent className="p-4">
                      <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                        <img
                          src={product.image}
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
                            {product.quantity} {product.unit} available
                          </span>
                          <span className="font-semibold text-accent">
                            ₹{product.price}/{product.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center text-muted-foreground">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(product.harvestDate).toLocaleDateString()}
                          </div>
                          <span className="text-muted-foreground">
                            by {product.farmerName}
                          </span>
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

