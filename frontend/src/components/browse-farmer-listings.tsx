import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  MapPin,
  Calendar,
  Package,
  Star,
  IndianRupee
} from 'lucide-react';
import { productService } from '../services/productService';
import { FilterBar } from './FilterBar';
import type { Product } from '../types';
import { format } from 'date-fns';

interface BrowseFarmerListingsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function BrowseFarmerListings({ onNavigate }: BrowseFarmerListingsProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilters, setActiveFilters] = useState<any>({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (filters?: any) => {
    try {
      setLoading(true);
      setError('');

      const response = await productService.getAllProducts(filters);
      setFilteredProducts(response.products);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    setActiveFilters(filters);
    fetchProducts(filters);
  };

  const handleClearFilters = () => {
    setActiveFilters({});
    fetchProducts();
  };

  const getActiveFilterCount = () => {
    return Object.values(activeFilters).filter(v => v !== undefined && v !== null && v !== '').length;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('buyer-dashboard')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Browse Farmer Products</h1>
              <p className="text-sm text-muted-foreground">
                Discover quality crops from verified farmers
              </p>
            </div>
          </div>

          <FilterBar
            type="product"
            onFilterChange={handleFilterChange}
          />
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Active Filters Badge */}
        {getActiveFilterCount() > 0 && (
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-sm">
              {getActiveFilterCount()} filter{getActiveFilterCount() > 1 ? 's' : ''} applied
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground hover:text-primary"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24">
            <Package className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No Products Found
            </h3>
            <p className="text-muted-foreground mb-6">
              {getActiveFilterCount() > 0
                ? 'Try adjusting your filters to see more results'
                : 'No farmer products are currently available'}
            </p>
            {getActiveFilterCount() > 0 && (
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Results Count */}
            <div className="text-sm text-muted-foreground">
              Showing <span className="font-semibold text-foreground">{filteredProducts.length}</span>{' '}
              product{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <Card
                  key={product._id}
                  className="bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group overflow-hidden"
                  onClick={() => onNavigate('farmer-listing-details', product)}
                >
                  {/* Product Image */}
                  {product.imageUrl && (
                    <div className="relative h-48 w-full overflow-hidden bg-muted">
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-primary text-primary-foreground">
                          {product.type}
                        </Badge>
                      </div>
                    </div>
                  )}

                  <CardContent className="p-4">
                    {/* Product Name */}
                    <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {product.name}
                    </h3>

                    {/* Description */}
                    {product.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {product.description}
                      </p>
                    )}

                    {/* Farmer Info */}
                    <div className="flex items-center gap-2 mb-3 pb-3 border-b border-border">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                          {product.farmerId.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {product.farmerId.name}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span>Verified Farmer</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-2">
                      {/* Price */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <div className="flex items-center gap-1">
                          <IndianRupee className="h-4 w-4 text-green-600" />
                          <span className="text-lg font-bold text-green-600">
                            {product.pricePerUnit.toLocaleString('en-IN')}
                          </span>
                          <span className="text-sm text-muted-foreground">/{product.unit}</span>
                        </div>
                      </div>

                      {/* Quantity */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Package className="h-4 w-4" />
                          Available
                        </span>
                        <span className="font-medium text-foreground">
                          {product.quantity} {product.unit}
                        </span>
                      </div>

                      {/* Location */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          Location
                        </span>
                        <span className="font-medium text-foreground truncate max-w-[150px]">
                          {product.location}
                        </span>
                      </div>

                      {/* Harvest Date */}
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Harvest
                        </span>
                        <span className="font-medium text-foreground">
                          {format(new Date(product.harvestDate), 'MMM dd, yyyy')}
                        </span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <Button
                      className="w-full mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
                      onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                        e.stopPropagation();
                        onNavigate('farmer-listing-details', product);
                      }}
                    >
                      View Details & Negotiate
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
