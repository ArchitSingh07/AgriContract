import React, { useState, useEffect } from 'react';
import { BuyerListing } from '../types';
import buyerListingService from '../services/buyerListingService';
import { negotiationService } from '../services/negotiationService';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Alert, AlertDescription } from './ui/alert';
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Calendar,
  Package,
  DollarSign,
  User,
  Star,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { format } from 'date-fns';

interface BuyerListingDetailsProps {
  listingId: string;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export const BuyerListingDetails: React.FC<BuyerListingDetailsProps> = ({
  listingId,
  user,
  onNavigate,
}) => {
  const [listing, setListing] = useState<BuyerListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [sendingOffer, setSendingOffer] = useState(false);

  const [offerForm, setOfferForm] = useState({
    offeredPrice: 0,
    offeredQuantity: 0,
    proposedDate: '',
    message: '',
  });

  useEffect(() => {
    fetchListingDetails();
  }, [listingId]);

  const fetchListingDetails = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('BuyerListingDetails - Fetching listing with ID:', listingId);
      const data = await buyerListingService.getBuyerListingById(listingId);
      console.log('BuyerListingDetails - Received listing data:', data);
      setListing(data);
    } catch (err: any) {
      console.error('Error fetching listing details:', err);
      setError(err.response?.data?.message || 'Failed to fetch listing details');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async () => {
    if (!offerForm.offeredPrice || !offerForm.offeredQuantity) {
      setError('Please enter both price and quantity');
      return;
    }

    try {
      setSendingOffer(true);
      setError('');

      // Add offer to listing
      await buyerListingService.addOfferToBuyerListing(listingId, {
        offeredPrice: offerForm.offeredPrice,
        offeredQuantity: offerForm.offeredQuantity,
        proposedDate: offerForm.proposedDate,
        message: offerForm.message,
      });

      // Start negotiation
      await negotiationService.startNegotiation({
        buyerListingId: listingId,
        buyerId: listing?.buyerId._id,
        initialMessage: offerForm.message || `I'd like to offer ₹${offerForm.offeredPrice} for ${offerForm.offeredQuantity} ${listing?.unit}`,
        offerDetails: {
          price: offerForm.offeredPrice,
          quantity: offerForm.offeredQuantity,
          deliveryDate: offerForm.proposedDate || new Date().toISOString(),
        },
      });

      setShowOfferDialog(false);
      setOfferForm({
        offeredPrice: 0,
        offeredQuantity: 0,
        proposedDate: '',
        message: '',
      });

      // Show success message and refresh
      await fetchListingDetails();
      
      Alert({
        title: 'Offer sent successfully!',
        description: 'The buyer will be notified of your offer.',
      });
    } catch (err: any) {
      console.error('Error sending offer:', err);
      setError(err.response?.data?.message || 'Failed to send offer');
    } finally {
      setSendingOffer(false);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Buyer listing not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const isFarmer = user?.role?.toLowerCase() === 'farmer' || (user as any)?.userType === 'farmer';

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={() => onNavigate('buyer-requests')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Requests
            </Button>
            {isFarmer && listing.status === 'active' && (
              <Button onClick={() => setShowOfferDialog(true)} className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Send Offer
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Listing Info */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl mb-2">{listing.cropName}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getCategoryColor(listing.category)}>
                        {listing.category}
                      </Badge>
                      <Badge className={getStatusColor(listing.status)}>
                        {listing.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Description */}
                {listing.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600 dark:text-gray-400">{listing.description}</p>
                  </div>
                )}

                {/* Quality Requirements */}
                {listing.qualityRequirements && (
                  <div>
                    <h3 className="font-semibold mb-2">Quality Requirements</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      {listing.qualityRequirements}
                    </p>
                  </div>
                )}

                {/* Key Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Package className="h-5 w-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Quantity</p>
                      <p className="font-semibold">
                        {listing.quantity} {listing.unit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <DollarSign className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Preferred Price</p>
                      <p className="font-semibold text-green-600">
                        ₹{listing.preferredPrice} {listing.preferredPriceUnit}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Calendar className="h-5 w-5 text-purple-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Delivery Date</p>
                      <p className="font-semibold">
                        {format(new Date(listing.preferredDeliveryDate), 'dd MMM yyyy')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <MapPin className="h-5 w-5 text-red-600" />
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                      <p className="font-semibold">
                        {listing.deliveryLocation.city}, {listing.deliveryLocation.state}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Offers Section - Only visible to buyer (listing owner) */}
            {!isFarmer && listing.offers && listing.offers.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Received Offers ({listing.offers.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {listing.offers.map((offer) => (
                      <div
                        key={offer._id}
                        className="p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <User className="h-4 w-4 text-gray-500" />
                              <span className="font-semibold">{offer.farmerId.name}</span>
                              {offer.farmerId.rating && (
                                <div className="flex items-center">
                                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                                  <span className="text-sm">{offer.farmerId.rating.toFixed(1)}</span>
                                </div>
                              )}
                            </div>
                            <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                              <p>
                                <strong>Offered Price:</strong> ₹{offer.offeredPrice} per {listing.unit}
                              </p>
                              <p>
                                <strong>Quantity:</strong> {offer.offeredQuantity} {listing.unit}
                              </p>
                              {offer.proposedDate && (
                                <p>
                                  <strong>Proposed Date:</strong>{' '}
                                  {format(new Date(offer.proposedDate), 'dd MMM yyyy')}
                                </p>
                              )}
                              {offer.message && <p><strong>Message:</strong> {offer.message}</p>}
                            </div>
                          </div>
                          <Badge
                            className={
                              offer.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : offer.status === 'accepted'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }
                          >
                            {offer.status}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Buyer Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Buyer Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-semibold">{listing.buyerId.name}</p>
                    <p className="text-sm text-gray-500">{listing.buyerId.email}</p>
                  </div>
                </div>

                {listing.buyerId.rating && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Rating</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{listing.buyerId.rating.toFixed(1)}</span>
                      {listing.buyerId.reviewCount && (
                        <span className="text-sm text-gray-500">
                          ({listing.buyerId.reviewCount})
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {listing.buyerId.phoneNumber && (
                  <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Phone</span>
                    <span className="font-semibold">{listing.buyerId.phoneNumber}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Listing Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Views</span>
                  <span className="font-semibold">{listing.viewCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Offers</span>
                  <span className="font-semibold">{listing.offerCount}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Posted</span>
                  <span className="font-semibold">
                    {format(new Date(listing.createdAt), 'dd MMM yyyy')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Send Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Your Offer</DialogTitle>
            <DialogDescription>
              Make an offer for {listing.cropName} to {listing.buyerId.name}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Your Offered Price (₹ per {listing.unit})</Label>
              <Input
                type="number"
                value={offerForm.offeredPrice || ''}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, offeredPrice: Number(e.target.value) })
                }
                placeholder={`Buyer's preferred: ₹${listing.preferredPrice}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity ({listing.unit})</Label>
              <Input
                type="number"
                value={offerForm.offeredQuantity || ''}
                onChange={(e) =>
                  setOfferForm({ ...offerForm, offeredQuantity: Number(e.target.value) })
                }
                placeholder={`Required: ${listing.quantity}`}
              />
            </div>
            <div className="space-y-2">
              <Label>Proposed Delivery Date (Optional)</Label>
              <Input
                type="date"
                value={offerForm.proposedDate}
                onChange={(e) => setOfferForm({ ...offerForm, proposedDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Message (Optional)</Label>
              <Textarea
                value={offerForm.message}
                onChange={(e) => setOfferForm({ ...offerForm, message: e.target.value })}
                placeholder="Add any additional details or terms..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleSendOffer}
              disabled={sendingOffer || !offerForm.offeredPrice || !offerForm.offeredQuantity}
            >
              {sendingOffer ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Sending...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Send Offer
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BuyerListingDetails;
