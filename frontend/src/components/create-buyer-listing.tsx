import React, { useState } from 'react';
import buyerListingService from '../services/buyerListingService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

interface CreateBuyerListingProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export const CreateBuyerListing: React.FC<CreateBuyerListingProps> = ({ user, onNavigate }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    cropName: '',
    category: '',
    quantity: 0,
    unit: 'kg',
    preferredPrice: 0,
    preferredPriceUnit: 'per kg',
    city: '',
    state: '',
    pincode: '',
    preferredDeliveryDate: '',
    description: '',
    qualityRequirements: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.cropName || !formData.category || !formData.quantity || !formData.preferredPrice) {
      setError('Please fill in all required fields');
      return;
    }

    if (!formData.city || !formData.state) {
      setError('Please provide delivery location');
      return;
    }

    if (!formData.preferredDeliveryDate) {
      setError('Please select a delivery date');
      return;
    }

    try {
      setLoading(true);

      await buyerListingService.createBuyerListing({
        cropName: formData.cropName,
        category: formData.category,
        quantity: formData.quantity,
        unit: formData.unit,
        preferredPrice: formData.preferredPrice,
        preferredPriceUnit: formData.preferredPriceUnit,
        deliveryLocation: {
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
        },
        preferredDeliveryDate: formData.preferredDeliveryDate,
        description: formData.description,
        qualityRequirements: formData.qualityRequirements,
      });

      setSuccess('Buyer listing created successfully!');
      setTimeout(() => {
        onNavigate('my-buyer-listings');
      }, 1500);
    } catch (err: any) {
      console.error('Error creating buyer listing:', err);
      setError(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Post a Crop Request
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Let farmers know what you're looking to buy
              </p>
            </div>
            <Button variant="outline" onClick={() => onNavigate('buyer-dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            <AlertDescription className="text-green-800 dark:text-green-200">
              {success}
            </AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <CardTitle>Listing Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Crop Name */}
              <div className="space-y-2">
                <Label htmlFor="cropName">
                  Crop Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="cropName"
                  value={formData.cropName}
                  onChange={(e) => handleChange('cropName', e.target.value)}
                  placeholder="e.g., Tomatoes, Wheat, Rice"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">
                  Category <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: string) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="vegetables">Vegetables</SelectItem>
                    <SelectItem value="fruits">Fruits</SelectItem>
                    <SelectItem value="grains">Grains</SelectItem>
                    <SelectItem value="pulses">Pulses</SelectItem>
                    <SelectItem value="spices">Spices</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Quantity and Unit */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">
                    Quantity <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="quantity"
                    type="number"
                    value={formData.quantity || ''}
                    onChange={(e) => handleChange('quantity', Number(e.target.value))}
                    placeholder="e.g., 100"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="unit">Unit</Label>
                  <Select
                    value={formData.unit}
                    onValueChange={(value: string) => handleChange('unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kg">Kilograms (kg)</SelectItem>
                      <SelectItem value="quintal">Quintal</SelectItem>
                      <SelectItem value="ton">Ton</SelectItem>
                      <SelectItem value="litre">Litre</SelectItem>
                      <SelectItem value="dozen">Dozen</SelectItem>
                      <SelectItem value="piece">Piece</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Price */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="preferredPrice">
                    Preferred Price (₹) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="preferredPrice"
                    type="number"
                    value={formData.preferredPrice || ''}
                    onChange={(e) => handleChange('preferredPrice', Number(e.target.value))}
                    placeholder="e.g., 50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="preferredPriceUnit">Price Unit</Label>
                  <Select
                    value={formData.preferredPriceUnit}
                    onValueChange={(value: string) => handleChange('preferredPriceUnit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="per kg">per kg</SelectItem>
                      <SelectItem value="per quintal">per quintal</SelectItem>
                      <SelectItem value="per ton">per ton</SelectItem>
                      <SelectItem value="per litre">per litre</SelectItem>
                      <SelectItem value="per dozen">per dozen</SelectItem>
                      <SelectItem value="per piece">per piece</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Delivery Location */}
              <div className="space-y-4">
                <Label>
                  Delivery Location <span className="text-red-500">*</span>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City"
                  />
                  <Input
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="State"
                  />
                </div>
                <Input
                  value={formData.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                  placeholder="Pincode (optional)"
                />
              </div>

              {/* Delivery Date */}
              <div className="space-y-2">
                <Label htmlFor="preferredDeliveryDate">
                  Preferred Delivery Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="preferredDeliveryDate"
                  type="date"
                  value={formData.preferredDeliveryDate}
                  onChange={(e) => handleChange('preferredDeliveryDate', e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Additional details about your requirements..."
                  rows={4}
                />
              </div>

              {/* Quality Requirements */}
              <div className="space-y-2">
                <Label htmlFor="qualityRequirements">Quality Requirements (Optional)</Label>
                <Textarea
                  id="qualityRequirements"
                  value={formData.qualityRequirements}
                  onChange={(e) => handleChange('qualityRequirements', e.target.value)}
                  placeholder="Specify quality standards, grade, organic certification, etc..."
                  rows={3}
                />
              </div>

              {/* Submit Button */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onNavigate('dashboard')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    'Create Listing'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  );
};

export default CreateBuyerListing;
