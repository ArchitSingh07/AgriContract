import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { ArrowLeft, Sprout, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { productService } from '../services/productService';
import type { Product, UpdateProductData } from '../types';

interface EditProductProps {
  product: Product;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
}

export function EditProduct({ product, onNavigate, onLogout }: EditProductProps) {
  // Form state - initialize with existing product data
  const [formData, setFormData] = useState({
    name: product.name || '',
    type: product.type || '',
    description: product.description || '',
    location: product.location || '',
    quantity: product.quantity?.toString() || '',
    unit: product.unit || 'kg',
    pricePerUnit: product.pricePerUnit?.toString() || '',
    harvestDate: product.harvestDate ? new Date(product.harvestDate).toISOString().split('T')[0] : '',
    imageUrl: product.imageUrl || '',
  });

  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validate required fields
      if (!formData.name || !formData.type || !formData.description || 
          !formData.location || !formData.quantity || !formData.pricePerUnit || 
          !formData.harvestDate) {
        setError('Please fill in all required fields');
        setLoading(false);
        return;
      }

      // Validate numeric fields
      const quantity = parseFloat(formData.quantity);
      const pricePerUnit = parseFloat(formData.pricePerUnit);

      if (isNaN(quantity) || quantity <= 0) {
        setError('Quantity must be a positive number');
        setLoading(false);
        return;
      }

      if (isNaN(pricePerUnit) || pricePerUnit <= 0) {
        setError('Price must be a positive number');
        setLoading(false);
        return;
      }

      // Prepare update data
      const updateData: UpdateProductData = {
        name: formData.name.trim(),
        type: formData.type.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        quantity,
        unit: formData.unit,
        pricePerUnit,
        harvestDate: formData.harvestDate,
        imageUrl: formData.imageUrl.trim(),
      };

      // Call API to update product
      const response = await productService.updateProduct(product._id, updateData);

      if (response.success) {
        setSuccess('Product updated successfully!');
        
        // Navigate back to product details after a short delay
        setTimeout(() => {
          onNavigate('product-details', response.product);
        }, 1500);
      }
    } catch (err: any) {
      console.error('Update product error:', err);
      setError(
        err.response?.data?.message || 
        'Failed to update product. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('product-details', product)}
              className="text-muted-foreground hover:text-primary"
              disabled={loading}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-2">
              <Sprout className="h-6 w-6 text-primary" />
              <h1 className="text-xl font-bold text-foreground">Edit Product</h1>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={onLogout}
            className="border-border hover:bg-accent hover:text-accent-foreground"
            disabled={loading}
          >
            Logout
          </Button>
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

        {/* Edit Product Form */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Edit Product Details</CardTitle>
            <CardDescription>
              Update your product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-foreground">
                  Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., Organic Wheat"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="bg-card border-border text-card-foreground"
                  required
                  disabled={loading}
                />
              </div>

              {/* Product Type */}
              <div className="space-y-2">
                <Label htmlFor="type" className="text-foreground">
                  Product Type <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="type"
                  type="text"
                  placeholder="e.g., Grains, Vegetables, Fruits"
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className="bg-card border-border text-card-foreground"
                  required
                  disabled={loading}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-foreground">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product, quality, certifications, etc."
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  className="bg-card border-border text-card-foreground min-h-[100px]"
                  required
                  disabled={loading}
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-foreground">
                  Location <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="location"
                  type="text"
                  placeholder="e.g., Punjab, India"
                  value={formData.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="bg-card border-border text-card-foreground"
                  required
                  disabled={loading}
                />
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity" className="text-foreground">
                    Quantity Available <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 1000"
                    value={formData.quantity}
                    onChange={(e) => handleChange('quantity', e.target.value)}
                    className="bg-card border-border text-card-foreground"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="unit" className="text-foreground">
                    Unit <span className="text-destructive">*</span>
                  </Label>
                  <Select 
                    value={formData.unit} 
                    onValueChange={(value: string) => handleChange('unit', value)}
                    disabled={loading}
                  >
                    <SelectTrigger className="bg-card border-border text-card-foreground">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="quintal">Quintal</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="bags">Bags</SelectItem>
                      <SelectItem value="crates">Crates</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                      <SelectItem value="pieces">Pieces</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price Per Unit */}
              <div className="space-y-2">
                <Label htmlFor="pricePerUnit" className="text-foreground">
                  Price Per Unit (₹) <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="pricePerUnit"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="e.g., 25.50"
                  value={formData.pricePerUnit}
                  onChange={(e) => handleChange('pricePerUnit', e.target.value)}
                  className="bg-card border-border text-card-foreground"
                  required
                  disabled={loading}
                />
              </div>

              {/* Harvest Date */}
              <div className="space-y-2">
                <Label htmlFor="harvestDate" className="text-foreground">
                  Harvest Date <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="harvestDate"
                  type="date"
                  value={formData.harvestDate}
                  onChange={(e) => handleChange('harvestDate', e.target.value)}
                  className="bg-card border-border text-card-foreground"
                  required
                  disabled={loading}
                />
              </div>

              {/* Image URL (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-foreground">
                  Image URL (Optional)
                </Label>
                <Input
                  id="imageUrl"
                  type="url"
                  placeholder="https://example.com/image.jpg"
                  value={formData.imageUrl}
                  onChange={(e) => handleChange('imageUrl', e.target.value)}
                  className="bg-card border-border text-card-foreground"
                  disabled={loading}
                />
                <p className="text-xs text-muted-foreground">
                  Enter a direct link to your product image
                </p>
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating Product...
                    </>
                  ) : (
                    'Update Product'
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate('product-details', product)}
                  className="border-border hover:bg-accent hover:text-accent-foreground"
                  disabled={loading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
