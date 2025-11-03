import React, { useState, useEffect } from 'react';
import { BuyerListing } from '../types';
import buyerListingService from '../services/buyerListingService';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  Loader2,
  Plus,
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
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
import { format } from 'date-fns';

interface MyBuyerListingsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export const MyBuyerListings: React.FC<MyBuyerListingsProps> = ({ user, onNavigate }) => {
  const [listings, setListings] = useState<BuyerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteListingId, setDeleteListingId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchMyListings();
  }, []);

  const fetchMyListings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await buyerListingService.getMyBuyerListings();
      setListings(data);
    } catch (err: any) {
      console.error('Error fetching my listings:', err);
      setError(err.response?.data?.message || 'Failed to fetch your listings');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteListingId) return;

    try {
      setDeleting(true);
      await buyerListingService.deleteBuyerListing(deleteListingId);
      setListings(listings.filter((l) => l._id !== deleteListingId));
      setDeleteListingId(null);
    } catch (err: any) {
      console.error('Error deleting listing:', err);
      setError(err.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      vegetables: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      fruits: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
      grains: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
      pulses: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
      spices: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
      other: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };
    return colors[category] || colors.other;
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
      'in-negotiation': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
      contracted: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
      fulfilled: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
      cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    };
    return colors[status] || colors.active;
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Please log in to view your listings.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                My Crop Requests
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Manage your crop purchase requests
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => onNavigate('buyer-dashboard')}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button onClick={() => onNavigate('create-buyer-listing')}>
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading your listings...
            </span>
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No listings yet
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Create your first crop request to start receiving offers from farmers
            </p>
            <Button onClick={() => onNavigate('create-buyer-listing')}>
              <Plus className="h-4 w-4 mr-2" />
              Create First Listing
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              {listings.length} listing{listings.length !== 1 && 's'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {listings.map((listing) => (
                <Card key={listing._id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <CardTitle className="text-xl">{listing.cropName}</CardTitle>
                      <Badge className={getCategoryColor(listing.category)}>
                        {listing.category}
                      </Badge>
                    </div>
                    <Badge className={getStatusColor(listing.status)}>
                      {listing.status.replace('-', ' ')}
                    </Badge>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    {/* Quantity */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Package className="h-4 w-4 mr-2" />
                      <span>
                        {listing.quantity} {listing.unit}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        ₹{listing.preferredPrice} {listing.preferredPriceUnit}
                      </span>
                    </div>

                    {/* Location */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>
                        {listing.deliveryLocation.city}, {listing.deliveryLocation.state}
                      </span>
                    </div>

                    {/* Delivery Date */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        By: {format(new Date(listing.preferredDeliveryDate), 'dd MMM yyyy')}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm pt-2 border-t">
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Eye className="h-3 w-3 mr-1" />
                        {listing.viewCount} views
                      </div>
                      <div className="flex items-center text-blue-600 dark:text-blue-400">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {listing.offerCount} offers
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onNavigate('buyer-listing-details', { listingId: String(listing._id) })}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => onNavigate('edit-buyer-listing', { listingId: String(listing._id) })}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setDeleteListingId(listing._id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteListingId} onOpenChange={() => setDeleteListingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this crop request. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
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
  );
};

export default MyBuyerListings;
