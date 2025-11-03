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
import { format } from 'date-fns';

interface BuyerChatProps {
  negotiationId?: string;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function BuyerChat({ negotiationId, user, onNavigate }: BuyerChatProps) {
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

      const listing = negotiation?.productId || negotiation?.buyerListingId;
      const unit = (listing as any)?.unit || 'unit';

      await negotiationService.sendMessage({
        negotiationId,
        message: `Counter offer: ₹${offerForm.price}/${unit} for ${offerForm.quantity} units`,
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
      setError('');

      const listing = negotiation.productId || negotiation.buyerListingId;
      const isProduct = negotiation.listingType === 'product';
      const cropName = isProduct 
        ? (listing as any)?.name 
        : (listing as any)?.cropName;
      const unit = (listing as any)?.unit || 'unit';
      const deliveryLocation = isProduct
        ? { city: (listing as any)?.location || 'TBD', state: '' }
        : (listing as any)?.deliveryLocation;

      const contractData = {
        farmerId: (negotiation.farmerId as any)?._id || (negotiation.farmerId as string),
        buyerId: (negotiation.buyerId as any)?._id || (negotiation.buyerId as string),
        listingType: negotiation.listingType,
        productId: isProduct ? (listing as any)?._id : undefined,
        buyerListingId: !isProduct ? (listing as any)?._id : undefined,
        negotiationId: negotiation._id,
        cropName: cropName,
        agreedPrice: lastOffer.offerDetails.price,
        quantity: lastOffer.offerDetails.quantity,
        unit: unit,
        deliveryDate: lastOffer.offerDetails.deliveryDate,
        deliveryLocation: deliveryLocation,
        terms: lastOffer.offerDetails.terms || 'Standard terms apply',
        paymentTerms: '50% advance, 50% on delivery'
      };

      const response = await contractService.createContract(contractData);
      
      setShowContractDialog(false);
      setTimeout(() => {
        onNavigate('contract-details', response.contract);
      }, 500);
    } catch (err: any) {
      console.error('Failed to create contract:', err);
      setError(err.response?.data?.message || 'Failed to create contract');
    } finally {
      setCreatingContract(false);
    }
  };

  if (loading && !negotiation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-12 w-12 text-primary animate-spin" />
      </div>
    );
  }

  if (!negotiation) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Negotiation not found</AlertDescription>
        </Alert>
      </div>
    );
  }

  const listing = negotiation.productId || negotiation.buyerListingId;
  const isProduct = negotiation.listingType === 'product';
  const listingName = isProduct ? (listing as any)?.name : (listing as any)?.cropName;
  const listingPrice = isProduct ? (listing as any)?.pricePerUnit : (listing as any)?.preferredPrice;
  const listingQuantity = (listing as any)?.quantity;
  const listingUnit = (listing as any)?.unit || (listing as any)?.preferredPriceUnit || 'unit';
  const listingImage = (listing as any)?.imageUrl || (listing as any)?.images?.[0];
  const farmerInfo = negotiation.farmerId as any;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('buyer-dashboard')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Negotiation</h1>
              <p className="text-sm text-muted-foreground">{listingName}</p>
            </div>
          </div>
          <Badge
            variant={
              negotiation.status === 'active'
                ? 'default'
                : negotiation.status === 'accepted'
                ? 'secondary'
                : 'outline'
            }
          >
            {negotiation.status}
          </Badge>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Area */}
          <div className="lg:col-span-2 space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* Messages */}
            <Card className="h-[600px] flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {negotiation.messages.map((msg: Message) => {
                  const isCurrentUser = (msg.senderId as any)?._id === user._id || msg.senderId === user._id;
                  const sender = msg.senderId as any;

                  return (
                    <div
                      key={msg._id}
                      className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex gap-3 max-w-[80%] ${isCurrentUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarFallback className={isCurrentUser ? 'bg-primary text-primary-foreground' : 'bg-muted'}>
                            {(sender?.name || 'U').charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className={`space-y-1 ${isCurrentUser ? 'items-end' : 'items-start'} flex flex-col`}>
                          <div
                            className={`rounded-lg p-3 ${
                              isCurrentUser
                                ? 'bg-primary text-primary-foreground'
                                : 'bg-muted text-foreground'
                            }`}
                          >
                            <p className="text-sm">{msg.message}</p>
                            {msg.offerDetails && (
                              <div className="mt-2 pt-2 border-t border-current/20 space-y-1">
                                <p className="text-xs opacity-90">
                                  <strong>Price:</strong> ₹{msg.offerDetails.price}/{listingUnit}
                                </p>
                                <p className="text-xs opacity-90">
                                  <strong>Quantity:</strong> {msg.offerDetails.quantity} {listingUnit}
                                </p>
                                {msg.offerDetails.deliveryDate && (
                                  <p className="text-xs opacity-90">
                                    <strong>Delivery:</strong>{' '}
                                    {format(new Date(msg.offerDetails.deliveryDate), 'MMM dd, yyyy')}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(msg.timestamp), 'MMM dd, h:mm a')}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </CardContent>
              <div className="border-t border-border p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Type your message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    disabled={sending || negotiation.status !== 'active'}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={sending || !message.trim() || negotiation.status !== 'active'}
                    className="bg-primary hover:bg-primary/90"
                  >
                    {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <Button
                className="flex-1"
                variant="outline"
                onClick={() => {
                  setOfferForm({
                    price: listingPrice || 0,
                    quantity: listingQuantity || 0,
                    deliveryDate: '',
                    terms: ''
                  });
                  setShowOfferDialog(true);
                }}
                disabled={negotiation.status !== 'active'}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Send Counter Offer
              </Button>
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => setShowContractDialog(true)}
                disabled={negotiation.status !== 'active'}
              >
                <FileText className="h-4 w-4 mr-2" />
                Create Contract
              </Button>
            </div>
          </div>

          {/* Sidebar - Product/Listing Info */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {isProduct ? 'Product Details' : 'Buyer Request Details'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {listingImage && (
                  <img
                    src={listingImage}
                    alt={listingName}
                    className="w-full h-48 object-cover rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="font-semibold text-foreground text-lg">{listingName}</h3>
                  <div className="mt-3 space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Price</span>
                      <span className="font-medium">₹{listingPrice}/{listingUnit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Quantity</span>
                      <span className="font-medium">{listingQuantity} {listingUnit}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Farmer Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {farmerInfo?.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{farmerInfo?.name}</p>
                    <p className="text-sm text-muted-foreground">{farmerInfo?.email}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Send Offer Dialog */}
      <Dialog open={showOfferDialog} onOpenChange={setShowOfferDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Counter Offer</DialogTitle>
            <DialogDescription>
              Propose your price and terms to the farmer
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Price (₹/{listingUnit})</Label>
                <Input
                  type="number"
                  value={offerForm.price}
                  onChange={(e) => setOfferForm({ ...offerForm, price: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Quantity ({listingUnit})</Label>
                <Input
                  type="number"
                  value={offerForm.quantity}
                  onChange={(e) => setOfferForm({ ...offerForm, quantity: parseFloat(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Delivery Date</Label>
              <Input
                type="date"
                value={offerForm.deliveryDate}
                onChange={(e) => setOfferForm({ ...offerForm, deliveryDate: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div className="space-y-2">
              <Label>Additional Terms</Label>
              <Textarea
                value={offerForm.terms}
                onChange={(e) => setOfferForm({ ...offerForm, terms: e.target.value })}
                placeholder="Any specific requirements or conditions..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOfferDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendOffer} disabled={sending}>
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
            <DialogTitle>Create Contract</DialogTitle>
            <DialogDescription>
              Finalize this negotiation into a binding contract
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                This will create a contract based on the latest agreed terms. Both parties will need to sign.
              </AlertDescription>
            </Alert>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowContractDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateContract}
              disabled={creatingContract}
              className="bg-green-600 hover:bg-green-700"
            >
              {creatingContract ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              Create Contract
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
