import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  IndianRupee,
  Star,
  MessageSquare,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import type { Product } from '../types';
import { format } from 'date-fns';
import { negotiationService } from '../services/negotiationService';

interface FarmerListingDetailsProps {
  product: Product;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function FarmerListingDetails({ product, user, onNavigate }: FarmerListingDetailsProps) {
  const [showNegotiationDialog, setShowNegotiationDialog] = useState(false);
  const [negotiationMessage, setNegotiationMessage] = useState('');
  const [offerPrice, setOfferPrice] = useState(product.pricePerUnit.toString());
  const [offerQuantity, setOfferQuantity] = useState(product.quantity.toString());
  const [deliveryDate, setDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStartNegotiation = async () => {
    console.log('handleStartNegotiation called');
    console.log('User:', user);
    console.log('Product:', product);
    
    if (!negotiationMessage.trim()) {
      setError('Please enter a message');
      return;
    }

    try {
      setLoading(true);
      setError('');

      const offerDetails = offerPrice || offerQuantity || deliveryDate
        ? {
            price: offerPrice ? parseFloat(offerPrice) : product.pricePerUnit,
            quantity: offerQuantity ? parseFloat(offerQuantity) : product.quantity,
            deliveryDate: deliveryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          }
        : undefined;

      // Extract farmerId as string
      const farmerIdString = typeof product.farmerId === 'object' && product.farmerId._id 
        ? product.farmerId._id 
        : String(product.farmerId);

      const negotiationData = {
        productId: String(product._id),
        farmerId: farmerIdString,
        buyerId: String(user._id || user.id),
        initialMessage: negotiationMessage,
        offerDetails,
      };

      console.log('Starting negotiation with data:', negotiationData);

      const response = await negotiationService.startNegotiation(negotiationData);
      
      console.log('Negotiation started successfully:', response);

      setSuccess('Negotiation started successfully!');
      setTimeout(() => {
        onNavigate('buyer-chat', { negotiationId: response.negotiation._id });
      }, 1500);
    } catch (err: any) {
      console.error('Failed to start negotiation - Full error:', err);
      console.error('Error response:', err.response);
      console.error('Error data:', err.response?.data);
      setError(err.response?.data?.message || err.message || 'Failed to start negotiation');
    } finally {
      setLoading(false);
    }
  };

  const handleResetDialog = () => {
    setNegotiationMessage('');
    setOfferPrice(product.pricePerUnit.toString());
    setOfferQuantity(product.quantity.toString());
    setDeliveryDate('');
    setError('');
    setSuccess('');
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
              onClick={() => onNavigate('browse-farmer-listings')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">{product.name}</h1>
              <p className="text-sm text-muted-foreground">Product Details</p>
            </div>
          </div>
          <Badge className="bg-primary text-primary-foreground">
            {product.type}
          </Badge>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product Image */}
            {product.imageUrl && (
              <Card className="overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-96 object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </Card>
            )}

            {/* Product Information */}
            <Card>
              <CardHeader>
                <CardTitle>Product Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{product.name}</h3>
                  {product.description && (
                    <p className="text-muted-foreground">{product.description}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price per Unit</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <span className="text-2xl font-bold text-green-600">
                        {product.pricePerUnit.toLocaleString('en-IN')}
                      </span>
                      <span className="text-muted-foreground">/{product.unit}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Available Quantity</p>
                    <div className="flex items-center gap-2">
                      <Package className="h-5 w-5 text-primary" />
                      <span className="text-2xl font-bold text-foreground">
                        {product.quantity}
                      </span>
                      <span className="text-muted-foreground">{product.unit}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Location</p>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-primary" />
                      <span className="text-foreground font-medium">{product.location}</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Harvest Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      <span className="text-foreground font-medium">
                        {format(new Date(product.harvestDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total Value</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="h-6 w-6 text-primary" />
                    <span className="text-3xl font-bold text-primary">
                      {(product.pricePerUnit * product.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Farmer Info & Actions */}
          <div className="space-y-6">
            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle>Farmer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {product.farmerId.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {product.farmerId.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{product.farmerId.email}</p>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Location</span>
                    <span className="text-sm font-medium text-foreground">
                      {product.farmerId.location}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                      <span className="text-sm font-medium text-foreground">Verified</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
              <CardContent className="p-6 space-y-4">
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
                  onClick={() => {
                    console.log('Start Negotiation button clicked!');
                    console.log('Current user:', user);
                    handleResetDialog();
                    setShowNegotiationDialog(true);
                    console.log('Dialog should open now, showNegotiationDialog set to true');
                  }}
                >
                  <MessageSquare className="h-5 w-5 mr-2" />
                  Start Negotiation
                </Button>

                <div className="space-y-2 text-center pt-4 border-t border-primary/20">
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Secure transactions</span>
                  </div>
                  <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Quality guaranteed</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Product Stats */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Product ID</span>
                  <span className="font-mono text-foreground">{product._id.slice(-8)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Listed On</span>
                  <span className="text-foreground">
                    {format(new Date(product.createdAt), 'MMM dd, yyyy')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Updated</span>
                  <span className="text-foreground">
                    {format(new Date(product.updatedAt), 'MMM dd, yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Start Negotiation Dialog */}
      {showNegotiationDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowNegotiationDialog(false)}>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[500px] w-full mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold text-foreground">Start Negotiation</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Send your initial offer and message to the farmer. You can negotiate further in the chat.
                </p>
              </div>

              <div className="space-y-4">{error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  {success}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and express your interest..."
                value={negotiationMessage}
                onChange={(e) => setNegotiationMessage(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="offerPrice">Your Offer Price (₹/{product.unit})</Label>
                <Input
                  id="offerPrice"
                  type="number"
                  placeholder={product.pricePerUnit.toString()}
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="offerQuantity">Quantity ({product.unit})</Label>
                <Input
                  id="offerQuantity"
                  type="number"
                  placeholder={product.quantity.toString()}
                  value={offerQuantity}
                  onChange={(e) => setOfferQuantity(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Preferred Delivery Date</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={deliveryDate}
                onChange={(e) => setDeliveryDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            {offerPrice && offerQuantity && (
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-1">Total Offer Value</p>
                <div className="flex items-center gap-1">
                  <IndianRupee className="h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold text-primary">
                    {(parseFloat(offerPrice || '0') * parseFloat(offerQuantity || '0')).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-6">
            <Button
              variant="outline"
              onClick={() => {
                setShowNegotiationDialog(false);
                handleResetDialog();
              }}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleStartNegotiation}
              disabled={loading || !negotiationMessage.trim()}
              className="bg-primary hover:bg-primary/90 flex-1"
            >
              {loading ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Starting...
                </>
              ) : (
                <>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Start Negotiation
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
      )}
    </div>
  );
}
