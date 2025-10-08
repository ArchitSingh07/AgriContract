import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft,
  Upload,
  Save,
  Package,
  IndianRupee
} from 'lucide-react';

interface ListProductProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ListProduct({ user, onNavigate }: ListProductProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    description: '',
    quantity: '',
    unit: 'kg',
    price: '',
    harvestDate: '',
    location: '',
    image: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const productTypes = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Cereals',
    'Pulses',
    'Spices',
    'Other'
  ];

  const units = [
    'kg',
    'quintal',
    'ton',
    'piece',
    'dozen',
    'liter'
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create new product object
    const newProduct = {
      id: Date.now().toString(),
      ...formData,
      quantity: parseInt(formData.quantity),
      price: parseFloat(formData.price),
      farmerId: user.id,
      farmerName: user.name,
      image: formData.image || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'
    };

    setIsSubmitting(false);
    
    // Navigate back to dashboard with success message
    onNavigate('dashboard', { 
      message: 'Product listed successfully!', 
      newProduct 
    });
  };

  const isFormValid = () => {
    return formData.name && 
           formData.type && 
           formData.description && 
           formData.quantity && 
           formData.price && 
           formData.harvestDate;
  };

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
            <h1 className="text-xl font-bold text-foreground">List New Product</h1>
            <p className="text-sm text-muted-foreground">
              Add your agricultural product to the marketplace
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Package className="h-5 w-5 text-primary" />
                  <span>Product Information</span>
                </CardTitle>
                <CardDescription>
                  Basic details about your product
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Product Name *</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Organic Tomatoes"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Product Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="" className="bg-card text-card-foreground">Select product type</option>
                    {productTypes.map(type => (
                      <option key={type} value={type} className="bg-card text-card-foreground">{type}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe your product quality, farming methods, etc."
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="bg-input-background border-border min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Punjab, India"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quantity and Pricing */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <IndianRupee className="h-5 w-5 text-accent" />
                  <span>Quantity & Pricing</span>
                </CardTitle>
                <CardDescription>
                  Set your quantity and pricing details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      placeholder="500"
                      value={formData.quantity}
                      onChange={(e) => handleInputChange('quantity', e.target.value)}
                      className="bg-input-background border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <select
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-md text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {units.map(unit => (
                        <option key={unit} value={unit} className="bg-card text-card-foreground">{unit}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price per {formData.unit} (₹) *</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="45.00"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                    className="bg-input-background border-border"
                  />
                </div>

                {formData.quantity && formData.price && (
                  <div className="p-4 bg-primary/10 border border-primary/20 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-foreground">Total Value:</span>
                      <span className="text-lg font-bold text-primary">
                        ₹{(parseFloat(formData.quantity) * parseFloat(formData.price)).toLocaleString()}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Image Upload */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Upload className="h-5 w-5 text-blue-500" />
                <span>Product Image</span>
              </CardTitle>
              <CardDescription>
                Add an image to showcase your product (optional)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className="bg-input-background border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Provide a URL to your product image, or leave empty for a default image
                  </p>
                </div>

                {formData.image && (
                  <div className="aspect-video max-w-sm bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={formData.image} 
                      alt="Product preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400';
                      }}
                    />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <Button 
              type="submit" 
              disabled={!isFormValid() || isSubmitting}
              className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Listing Product...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  List Product
                </>
              )}
            </Button>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => onNavigate('dashboard')}
              className="border-border hover:bg-accent hover:text-accent-foreground"
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}