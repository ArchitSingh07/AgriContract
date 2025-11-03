import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  Package,
  Calendar,
  MapPin,
  Edit,
  Trash2,
  Loader2,
  AlertCircle,
  Plus,
  DollarSign
} from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface MyProductsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function MyProducts({ user, onNavigate }: MyProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [user._id, user.id]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await productService.getProductsByFarmer(user._id || user.id);
      setProducts(response.products);
    } catch (err: any) {
      console.error('Failed to fetch products:', err);
      setError(err.response?.data?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      setError('');
      
      console.log('Attempting to delete product:', deleteId);
      
      await productService.deleteProduct(deleteId);
      
      console.log('Product deleted successfully');
      
      // Remove from local state
      setProducts(products.filter(p => p._id !== deleteId));
      setDeleteId(null);
      
      // Show success message (optional)
      // You could add a success state here if needed
      
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Failed to delete product. Please try again.';
      setError(errorMessage);
      
      // Keep dialog open if there's an error
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('farmer-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Products</h1>
              <p className="text-muted-foreground">Manage all your product listings</p>
            </div>
          </div>
          <Button
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onNavigate('list-product')}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add New Product
          </Button>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading your products...</p>
          </div>
        ) : products.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12">
              <div className="text-center">
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
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Card
                key={product._id}
                className="bg-card border-border hover:shadow-lg transition-all group"
              >
                <CardContent className="p-0">
                  {/* Product Image */}
                  <div 
                    className="aspect-video bg-muted rounded-t-lg overflow-hidden cursor-pointer"
                    onClick={() => onNavigate('product-details', product)}
                  >
                    <img
                      src={product.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <div 
                        className="flex-1 cursor-pointer"
                        onClick={() => onNavigate('product-details', product)}
                      >
                        <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        <Badge variant="secondary" className="mt-1">
                          {product.type}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground flex items-center">
                          <Package className="h-4 w-4 mr-1" />
                          {product.quantity} {product.unit}
                        </span>
                        <span className="font-bold text-lg text-accent flex items-center">
                          <DollarSign className="h-4 w-4" />
                          {product.pricePerUnit}/{product.unit}
                        </span>
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        Harvest: {new Date(product.harvestDate).toLocaleDateString()}
                      </div>

                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-1" />
                        {product.location}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-2 pt-2">
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => onNavigate('edit-product', product)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        onClick={() => setDeleteId(product._id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={(open: boolean) => !open && setDeleteId(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your product listing.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={deleting}
                className="bg-destructive hover:bg-destructive/90"
              >
                {deleting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
