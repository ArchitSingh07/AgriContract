import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  Upload,
  Save,
  Package,
  IndianRupee,
  Loader2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { productService } from '../services/productService';
import type { CreateProductData } from '../types';

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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Determine the appropriate dashboard based on user type
  const userRole = (user.role?.toLowerCase() || user.userType) as 'farmer' | 'buyer';
  const dashboardPage = userRole === 'farmer' ? 'farmer-dashboard' : 'dashboard';

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
    'bags',
    'crates',
    'boxes',
    'pieces'
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
    setError('');
    setSuccess('');

    try {
      // Prepare product data for API
      const productData: CreateProductData = {
        name: formData.name,
        type: formData.type,
        description: formData.description,
        location: formData.location || user?.location || '',
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        pricePerUnit: parseFloat(formData.price),
        harvestDate: formData.harvestDate,
        imageUrl: formData.image || undefined
      };

      // Call backend API
      const newProduct = await productService.createProduct(productData);

      setSuccess('Product listed successfully!');
      
      // Wait a moment to show success message
      setTimeout(() => {
        onNavigate(dashboardPage, {
          message: 'Product listed successfully!',
          newProduct
        });
      }, 1500);

    } catch (err: any) {
      console.error('Failed to create product:', err);
      setError(err.response?.data?.message || 'Failed to create product. Please try again.');
      setIsSubmitting(false);
    }
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
            onClick={() => onNavigate(dashboardPage)}
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
        {/* Error/Success Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-300">
              {success}
            </AlertDescription>
          </Alert>
        )}

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
                    className="bg-card border-border text-card-foreground"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type">Product Type *</Label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border rounded-md text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    required
                    disabled={isSubmitting}
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
                    className="bg-card border-border text-card-foreground min-h-[100px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Farm Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., Punjab, India"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="bg-card border-border text-card-foreground"
                    disabled={isSubmitting}
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
                      className="bg-card border-border text-card-foreground"
                      required
                      min="0"
                      step="0.01"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="unit">Unit *</Label>
                    <select
                      id="unit"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="w-full px-3 py-2 bg-card border border-border rounded-md text-card-foreground focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                      required
                      disabled={isSubmitting}
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
                    className="bg-card border-border text-card-foreground"
                    required
                    min="0"
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="harvestDate">Harvest Date *</Label>
                  <Input
                    id="harvestDate"
                    type="date"
                    value={formData.harvestDate}
                    onChange={(e) => handleInputChange('harvestDate', e.target.value)}
                    className="bg-card border-border text-card-foreground"
                    required
                    disabled={isSubmitting}
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
                    className="bg-card border-border text-card-foreground"
                    disabled={isSubmitting}
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
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
              onClick={() => onNavigate(dashboardPage)}
              className="border-border hover:bg-accent hover:text-accent-foreground"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}