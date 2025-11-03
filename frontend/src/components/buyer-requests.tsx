import React, { useState, useEffect } from 'react';
import { BuyerListing } from '../types';
import buyerListingService from '../services/buyerListingService';
import { FilterBar, FilterOptions } from './FilterBar';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Loader2, MapPin, Calendar, Package, DollarSign, User, Star, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

interface BuyerRequestsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export const BuyerRequests: React.FC<BuyerRequestsProps> = ({ user, onNavigate }) => {
  const [filteredListings, setFilteredListings] = useState<BuyerListing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBuyerListings();
  }, []);

  const fetchBuyerListings = async (filters?: FilterOptions) => {
    try {
      setLoading(true);
      setError('');
      
      const apiFilters: any = {};
      
      if (filters?.searchTerm) {
        apiFilters.cropName = filters.searchTerm;
      }
      if (filters?.category) {
        apiFilters.category = filters.category;
      }
      if (filters?.location) {
        apiFilters.city = filters.location;
      }
      if (filters?.minPrice) {
        apiFilters.minPrice = filters.minPrice;
      }
      if (filters?.maxPrice) {
        apiFilters.maxPrice = filters.maxPrice;
      }
      if (filters?.minRating) {
        apiFilters.minRating = filters.minRating;
      }
      if (filters?.sortBy) {
        apiFilters.sortBy = filters.sortBy;
      }
      if (filters?.sortOrder) {
        apiFilters.sortOrder = filters.sortOrder;
      }

      const data = await buyerListingService.getAllBuyerListings(apiFilters);
      setFilteredListings(data);
    } catch (err: any) {
      console.error('Error fetching buyer listings:', err);
      setError(err.response?.data?.message || 'Failed to fetch buyer requests');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filters: FilterOptions) => {
    fetchBuyerListings(filters);
  };

  const handleViewDetails = (listingId: string) => {
    onNavigate('buyer-listing-details', { listingId: String(listingId) });
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
        <p>Please log in to view buyer requests.</p>
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
                Buyer Requests
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Browse crop requests from buyers and send your offers
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => onNavigate('farmer-dashboard')}
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <FilterBar onFilterChange={handleFilterChange} type="buyer-listing" />
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              Loading buyer requests...
            </span>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No buyer requests found
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Try adjusting your filters or check back later
            </p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
              Showing {filteredListings.length} buyer request{filteredListings.length !== 1 && 's'}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
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
                    {/* Buyer Info */}
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                      <User className="h-4 w-4 mr-2" />
                      <span className="font-medium">{listing.buyerId.name}</span>
                      {listing.buyerId.rating && (
                        <div className="ml-2 flex items-center">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                          <span className="text-xs">{listing.buyerId.rating.toFixed(1)}</span>
                        </div>
                      )}
                    </div>

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
                        Delivery by:{' '}
                        {format(new Date(listing.preferredDeliveryDate), 'dd MMM yyyy')}
                      </span>
                    </div>

                    {/* Offers Count */}
                    {listing.offerCount > 0 && (
                      <div className="flex items-center text-sm text-blue-600 dark:text-blue-400">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        <span>{listing.offerCount} offer{listing.offerCount !== 1 && 's'} received</span>
                      </div>
                    )}

                    {/* Description */}
                    {listing.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {listing.description}
                      </p>
                    )}
                  </CardContent>

                  <CardFooter>
                    <Button
                      className="w-full"
                      onClick={() => handleViewDetails(listing._id)}
                    >
                      View Details & Send Offer
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default BuyerRequests;
