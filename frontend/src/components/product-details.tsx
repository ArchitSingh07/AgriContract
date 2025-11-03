import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { Alert, AlertDescription } from './ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';
import {
  ArrowLeft,
  MapPin,
  Phone,
  Mail,
  MessageCircle,
  Star,
  Truck,
  Shield,
  Clock,
  Loader2,
  AlertCircle,
  Trash2,
  Edit
} from 'lucide-react';
import { productService } from '../services/productService';
import type { Product } from '../types';

interface ProductDetailsProps {
  product: Product;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ProductDetails({ product, user, onNavigate }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(100);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState('');

  const handleStartNegotiation = () => {
    const negotiationData = {
      productId: product._id,
      buyerId: user._id || user.id,
      sellerId: typeof product.farmerId === 'object' ? product.farmerId._id : product.farmerId,
      productName: product.name,
      sellerName: typeof product.farmerId === 'object' ? product.farmerId.name : 'Farmer',
      buyerName: user.name,
      initialOffer: {
        quantity,
        pricePerUnit: product.pricePerUnit,
        totalPrice: quantity * product.pricePerUnit,
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };
    onNavigate('negotiation', negotiationData);
  };

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      setError('');
      
      console.log('Attempting to delete product:', product._id);
      
      await productService.deleteProduct(product._id);
      
      console.log('Product deleted successfully, navigating to dashboard');
      
      // Navigate back to appropriate dashboard based on user type
      const userRole = (user.role?.toLowerCase() || user.userType) as 'farmer' | 'buyer';
      const dashboardPage = userRole === 'farmer' ? 'farmer-dashboard' : 'dashboard';
      
      onNavigate(dashboardPage, {
        message: 'Product deleted successfully!'
      });
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      console.error('Error response:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || 'Failed to delete product. Please try again.';
      setError(errorMessage);
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const features = [
    { icon: Shield, title: 'Quality Assured', description: 'Certified organic produce' },
    { icon: Truck, title: 'Flexible Delivery', description: 'Farm to your location' },
    { icon: Clock, title: 'Fresh Harvest', description: 'Recently harvested' },
  ];

  const farmerId = typeof product.farmerId === 'object' ? product.farmerId._id : product.farmerId;
  const farmerName = typeof product.farmerId === 'object' ? product.farmerId.name : 'Farmer';
  const userRole = (user.role?.toLowerCase() || user.userType) as 'farmer' | 'buyer';
  const userId = user._id || user.id;
  const isOwnProduct = userRole === 'farmer' && userId === farmerId;
  
  // Determine the appropriate dashboard to navigate back to
  const dashboardPage = userRole === 'farmer' ? 'farmer-dashboard' : 'dashboard';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onNavigate(dashboardPage)}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Product Details</h1>
            <p className="text-sm text-muted-foreground">
              {isOwnProduct ? 'Your product listing' : 'Available for contract farming'}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden opacity-60">
                  <img
                    src={product.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-3xl font-bold text-foreground">{product.name}</h2>
                <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                  {product.type}
                </Badge>
              </div>
              <p className="text-lg text-muted-foreground mb-4">{product.description}</p>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center text-yellow-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="h-4 w-4 fill-current" />
                  ))}
                  <span className="ml-2 text-sm text-muted-foreground">(4.8)</span>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Pricing */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-lg text-muted-foreground">Price per {product.unit}:</span>
                <span className="text-2xl font-bold text-accent">₹{product.pricePerUnit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Available Quantity:</span>
                <span className="font-semibold text-foreground">{product.quantity} {product.unit}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Harvest Date:</span>
                <span className="font-semibold text-foreground">
                  {new Date(product.harvestDate).toLocaleDateString()}
                </span>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Farmer Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {farmerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground">{farmerName}</p>
                    <p className="text-sm text-muted-foreground">Certified Farmer</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">{product.location || 'Location not specified'}</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">Contact via platform</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{farmerName.toLowerCase().replace(' ', '.')}@farm.com</span>
                </div>
              </CardContent>
            </Card>

            {/* Features */}
            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <feature.icon className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">{feature.title}</p>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            {!isOwnProduct && userRole === 'buyer' && (
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-medium text-foreground">Quantity needed:</label>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(50, quantity - 50))}
                      className="border-border hover:bg-accent hover:text-accent-foreground"
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 bg-card border border-border rounded text-center min-w-[80px] text-card-foreground font-medium">
                      {quantity} {product.unit}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.min(product.quantity, quantity + 50))}
                      className="border-border hover:bg-accent hover:text-accent-foreground"
                    >
                      +
                    </Button>
                  </div>
                </div>

                <div className="p-4 bg-card border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Estimated Total:</span>
                    <span className="text-xl font-bold text-accent">
                      ₹{(quantity * product.pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Final price subject to negotiation
                  </p>
                </div>

                <div className="flex space-x-3">
                  <Button
                    onClick={handleStartNegotiation}
                    className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Start Negotiation
                  </Button>
                  <Button
                    variant="outline"
                    className="border-border hover:bg-accent hover:text-accent-foreground"
                  >
                    Add to Watchlist
                  </Button>
                </div>
              </div>
            )}

            {isOwnProduct && (
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full border-border hover:bg-accent hover:text-accent-foreground"
                  onClick={() => onNavigate('edit-product', product)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Product
                </Button>
                <Button
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove Listing
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your product listing for "{product.name}". 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                disabled={isDeleting}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                {isDeleting ? (
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
      </main>
    </div>
  );
}