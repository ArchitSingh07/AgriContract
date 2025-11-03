import { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  Send,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Package,
  DollarSign,
  FileText
} from 'lucide-react';
import { negotiationService } from '../services/negotiationService';
import { contractService } from '../services/contractService';
import type { Negotiation, Message, OfferDetails } from '../types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Label } from "./ui/label";

interface FarmerChatProps {
  negotiationId?: string;
  productId?: string;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function FarmerChat({ negotiationId, user, onNavigate }: FarmerChatProps) {
  const [negotiation, setNegotiation] = useState<Negotiation | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [showOfferDialog, setShowOfferDialog] = useState(false);
  const [showContractDialog, setShowContractDialog] = useState(false);
  const [creatingContract, setCreatingContract] = useState(false);
  
  const [offerForm, setOfferForm] = useState({
    price: 0,
    quantity: 0,
    deliveryDate: '',
    terms: ''
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [negotiation?.messages]);

  useEffect(() => {
    if (negotiationId) {
      fetchNegotiation();
      // Poll for new messages every 5 seconds
      const interval = setInterval(fetchNegotiation, 5000);
      return () => clearInterval(interval);
    }
  }, [negotiationId]);

  const fetchNegotiation = async () => {
    if (!negotiationId) return;
    
    try {
      setLoading(true);
      const response = await negotiationService.getNegotiationById(negotiationId);
      setNegotiation(response.negotiation);
      setError('');
    } catch (err: any) {
      console.error('Failed to fetch negotiation:', err);
      setError(err.response?.data?.message || 'Failed to load negotiation');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !negotiationId) return;

    try {
      setSending(true);
      await negotiationService.sendMessage({
        negotiationId,
        message: message.trim()
      });
      setMessage('');
      await fetchNegotiation();
    } catch (err: any) {
      console.error('Failed to send message:', err);
      setError(err.response?.data?.message || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleSendOffer = async () => {
    if (!negotiationId) return;

    try {
      setSending(true);
      const offerDetails: OfferDetails = {
        price: offerForm.price,
        quantity: offerForm.quantity,
        deliveryDate: offerForm.deliveryDate,
        terms: offerForm.terms
      };

      await negotiationService.sendMessage({
        negotiationId,
        message: `Counter offer: ₹${offerForm.price}/${listingUnit} for ${offerForm.quantity} units`,
        offerDetails
      });

      setShowOfferDialog(false);
      setOfferForm({ price: 0, quantity: 0, deliveryDate: '', terms: '' });
      await fetchNegotiation();
    } catch (err: any) {
      console.error('Failed to send offer:', err);
      setError(err.response?.data?.message || 'Failed to send offer');
    } finally {
      setSending(false);
    }
  };

  const handleCreateContract = async () => {
    if (!negotiation) return;

    // Get the last offer with details
    const lastOffer = [...negotiation.messages].reverse().find(m => m.offerDetails);
    if (!lastOffer?.offerDetails) {
      setError('No offer details found to create contract');
      return;
    }

    try {
      setCreatingContract(true);
      const farmerId = typeof negotiation.farmerId === 'object'
        ? (negotiation.farmerId as any)._id
        : negotiation.farmerId;
      const buyerId = typeof negotiation.buyerId === 'object'
        ? (negotiation.buyerId as any)._id
        : negotiation.buyerId;

      // Determine listing type and get IDs
      const listingType = negotiation.listingType || 'product';
      let productId, buyerListingId, cropName, deliveryLocation;

      if (listingType === 'product' && negotiation.productId) {
        productId = typeof negotiation.productId === 'object' 
          ? negotiation.productId._id 
          : negotiation.productId;
        cropName = typeof negotiation.productId === 'object'
          ? (negotiation.productId as any).name
          : 'Product';
      } else if (listingType === 'buyer-request' && negotiation.buyerListingId) {
        buyerListingId = typeof negotiation.buyerListingId === 'object'
          ? (negotiation.buyerListingId as any)._id
          : negotiation.buyerListingId;
        cropName = typeof negotiation.buyerListingId === 'object'
          ? (negotiation.buyerListingId as any).cropName
          : 'Crop';
        deliveryLocation = typeof negotiation.buyerListingId === 'object'
          ? (negotiation.buyerListingId as any).deliveryLocation
          : undefined;
      }

      await contractService.createContract({
        farmerId,
        buyerId,
        listingType,
        productId,
        buyerListingId,
        negotiationId: negotiation._id,
        cropName: cropName || 'Unknown',
        agreedPrice: lastOffer.offerDetails.price,
        quantity: lastOffer.offerDetails.quantity,
        deliveryDate: lastOffer.offerDetails.deliveryDate,
        deliveryLocation,
        terms: lastOffer.offerDetails.terms || '',
        paymentTerms: 'Upon delivery'
      });

      // Update negotiation status
      await negotiationService.updateNegotiationStatus(negotiation._id, 'finalized');

      setShowContractDialog(false);
      onNavigate('farmer-contracts', { success: 'Contract created successfully!' });
    } catch (err: any) {
      console.error('Failed to create contract:', err);
      setError(err.response?.data?.message || 'Failed to create contract');
    } finally {
      setCreatingContract(false);
    }
  };

  if (loading && !negotiation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!negotiation) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Negotiation not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const product = negotiation.listingType === 'product' && typeof negotiation.productId === 'object' 
    ? negotiation.productId 
    : null;
  const buyerListing = negotiation.listingType === 'buyer-request' && typeof negotiation.buyerListingId === 'object'
    ? negotiation.buyerListingId as any
    : null;
  const buyer = typeof negotiation.buyerId === 'object' ? negotiation.buyerId : null;
  const isFarmer = (user._id || user.id) === (typeof negotiation.farmerId === 'object' ? (negotiation.farmerId as any)._id : negotiation.farmerId);

  // Get listing info for display
  const listingName = product?.name || buyerListing?.cropName || 'Item';
  const listingDescription = product?.description || buyerListing?.description || '';
  const listingPrice = product?.pricePerUnit || buyerListing?.preferredPrice || 0;
  const listingUnit = product?.unit || buyerListing?.unit || 'unit';
  const listingQuantity = product?.quantity || buyerListing?.quantity || 0;
  const listingImage = product?.imageUrl || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=100';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('farmer-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarFallback className="bg-primary text-primary-foreground">
                  {buyer?.name?.charAt(0) || 'B'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-lg font-bold text-foreground">
                  {buyer?.name || 'Buyer'}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {product?.name || buyerListing?.cropName || 'Item'}
                </p>
              </div>
            </div>
          </div>
          <Badge 
            variant={negotiation.status === 'active' ? 'default' : 'secondary'}
            className="capitalize"
          >
            {negotiation.status}
          </Badge>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Product/Buyer Listing Summary */}
        {(product || buyerListing) && (
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-center space-x-4">
                <img
                  src={listingImage}
                  alt={listingName}
                  className="w-20 h-20 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-foreground">{listingName}</h3>
                    {negotiation.listingType === 'buyer-request' && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Buyer Request
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{listingDescription}</p>
                  <div className="flex items-center space-x-4 mt-2 text-sm">
                    <span className="text-accent font-semibold">
                      ₹{listingPrice}/{listingUnit}
                    </span>
                    <span className="text-muted-foreground">
                      {listingQuantity} {listingUnit} {product ? 'available' : 'required'}
                    </span>
                  </div>
                  {buyerListing?.deliveryLocation && (
                    <p className="text-xs text-muted-foreground mt-1">
                      📍 {buyerListing.deliveryLocation.city}, {buyerListing.deliveryLocation.state}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Messages */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Negotiation</span>
              {negotiation.status === 'active' && isFarmer && (
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowOfferDialog(true)}
                  >
                    <DollarSign className="h-4 w-4 mr-2" />
                    Send Offer
                  </Button>
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90"
                    onClick={() => setShowContractDialog(true)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Finalize Contract
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[400px] overflow-y-auto p-4 space-y-4">
              {negotiation.messages.map((msg: Message, index) => {
                const isOwnMessage = msg.senderType === 'farmer' && isFarmer;
                return (
                  <div
                    key={index}
                    className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
                      <div
                        className={`rounded-lg p-3 ${
                          isOwnMessage
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.message}</p>
                        {msg.offerDetails && (
                          <div className="mt-2 pt-2 border-t border-current/20 space-y-1 text-xs">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-3 w-3" />
                              <span>Price: ₹{msg.offerDetails.price}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Package className="h-3 w-3" />
                              <span>Quantity: {msg.offerDetails.quantity}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3 w-3" />
                              <span>
                                Delivery: {new Date(msg.offerDetails.deliveryDate).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                        <p className="text-xs mt-2 opacity-70">
                          {new Date(msg.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </CardContent>
        </Card>

        {/* Message Input */}
        {negotiation.status === 'active' && (
          <Card className="bg-card border-border">
            <CardContent className="p-4">
              <div className="flex items-end space-x-2">
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 min-h-[60px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={sending || !message.trim()}
                  className="bg-primary hover:bg-primary/90"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </main>

      {/* Send Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Counter Offer</DialogTitle>
            <DialogDescription>
              Propose your terms for this deal
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Price per unit (₹)</Label>
              <Input
                type="number"
                value={offerForm.price || ''}
                onChange={(e) => setOfferForm({ ...offerForm, price: Number(e.target.value) })}
                placeholder="Enter price"
              />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                value={offerForm.quantity || ''}
                onChange={(e) => setOfferForm({ ...offerForm, quantity: Number(e.target.value) })}
                placeholder="Enter quantity"
              />
            </div>
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Input
                type="date"
                value={offerForm.deliveryDate}
                onChange={(e) => setOfferForm({ ...offerForm, deliveryDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Terms (optional)</Label>
              <Textarea
                value={offerForm.terms}
                onChange={(e) => setOfferForm({ ...offerForm, terms: e.target.value })}
                placeholder="Additional terms and conditions"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendOffer} disabled={sending || !offerForm.price || !offerForm.quantity}>
              {sending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Send Offer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Contract Dialog */}
      <Dialog open={showContractDialog} onOpenChange={setShowContractDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Finalize Contract</DialogTitle>
            <DialogDescription>
              This will create a formal contract based on the agreed terms
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Both parties will need to sign the contract for it to become active
              </AlertDescription>
            </Alert>
            <p className="text-sm text-muted-foreground">
              Are you ready to proceed with creating the contract?
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContractDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleCreateContract} 
              disabled={creatingContract}
              className="bg-primary hover:bg-primary/90"
            >
              {creatingContract ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Creating...
                </>
              ) : (
                <>
                  <FileText className="h-4 w-4 mr-2" />
                  Create Contract
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
