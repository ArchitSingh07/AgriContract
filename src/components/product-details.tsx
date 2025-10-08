import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Phone, 
  Mail, 
  MessageCircle,
  Star,
  Truck,
  Shield,
  Clock
} from 'lucide-react';

interface ProductDetailsProps {
  product: any;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ProductDetails({ product, user, onNavigate }: ProductDetailsProps) {
  const [quantity, setQuantity] = useState(100);

  const handleStartNegotiation = () => {
    const negotiationData = {
      productId: product.id,
      buyerId: user.id,
      sellerId: product.farmerId,
      productName: product.name,
      sellerName: product.farmerName,
      buyerName: user.name,
      initialOffer: {
        quantity,
        pricePerUnit: product.price,
        totalPrice: quantity * product.price,
        deliveryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      }
    };
    onNavigate('negotiation', negotiationData);
  };

  const features = [
    { icon: Shield, title: 'Quality Assured', description: 'Certified organic produce' },
    { icon: Truck, title: 'Flexible Delivery', description: 'Farm to your location' },
    { icon: Clock, title: 'Fresh Harvest', description: 'Recently harvested' },
  ];

  const isOwnProduct = user.userType === 'farmer' && user.id === product.farmerId;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('dashboard')}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square bg-muted rounded-lg overflow-hidden opacity-60">
                  <img 
                    src={product.image} 
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
                <span className="text-2xl font-bold text-accent">${product.price}</span>
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
            <Card className="bg-input-background border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {product.farmerName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-foreground">{product.farmerName}</p>
                    <p className="text-sm text-muted-foreground">Certified Farmer</p>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">California, USA</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{product.farmerName.toLowerCase().replace(' ', '.')}@farm.com</span>
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
            {!isOwnProduct && user.userType === 'buyer' && (
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
                
                <div className="p-4 bg-input-background border border-border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-muted-foreground">Estimated Total:</span>
                    <span className="text-xl font-bold text-accent">
                      ${(quantity * product.price).toLocaleString()}
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
                >
                  Edit Product
                </Button>
                <Button 
                  variant="outline"
                  className="w-full border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                >
                  Remove Listing
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}