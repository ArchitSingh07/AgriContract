import { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  ArrowLeft, 
  Send, 
  Package, 
  Calendar, 
  DollarSign,
  CheckCircle,
  Clock,
  User
} from 'lucide-react';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
  type: 'message' | 'offer';
  offer?: {
    quantity: number;
    pricePerUnit: number;
    totalPrice: number;
    deliveryDate: string;
  };
}

interface NegotiationChatProps {
  negotiationData: any;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function NegotiationChat({ negotiationData, user, onNavigate }: NegotiationChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      senderId: negotiationData.buyerId,
      senderName: negotiationData.buyerName,
      content: `Hi ${negotiationData.sellerName}, I'm interested in your ${negotiationData.productName}. Here's my initial offer:`,
      timestamp: new Date().toISOString(),
      type: 'message'
    },
    {
      id: '2',
      senderId: negotiationData.buyerId,
      senderName: negotiationData.buyerName,
      content: 'Initial offer',
      timestamp: new Date().toISOString(),
      type: 'offer',
      offer: negotiationData.initialOffer
    }
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [newOffer, setNewOffer] = useState({
    quantity: negotiationData.initialOffer.quantity,
    pricePerUnit: negotiationData.initialOffer.pricePerUnit,
    totalPrice: negotiationData.initialOffer.totalPrice,
    deliveryDate: negotiationData.initialOffer.deliveryDate
  });
  const [showOfferForm, setShowOfferForm] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        senderId: user.id,
        senderName: user.name,
        content: newMessage,
        timestamp: new Date().toISOString(),
        type: 'message'
      };
      setMessages([...messages, message]);
      setNewMessage('');

      // Simulate response from other party
      setTimeout(() => {
        const responses = [
          "Thanks for your interest! Let me review your offer.",
          "That's a good starting point. Can we discuss the delivery timeline?",
          "I appreciate the offer. The quantity works well for me.",
          "Let me check my inventory and get back to you."
        ];
        const response: Message = {
          id: (Date.now() + 1).toString(),
          senderId: user.userType === 'buyer' ? negotiationData.sellerId : negotiationData.buyerId,
          senderName: user.userType === 'buyer' ? negotiationData.sellerName : negotiationData.buyerName,
          content: responses[Math.floor(Math.random() * responses.length)],
          timestamp: new Date().toISOString(),
          type: 'message'
        };
        setMessages(prev => [...prev, response]);
      }, 2000);
    }
  };

  const sendOffer = () => {
    const offer: Message = {
      id: Date.now().toString(),
      senderId: user.id,
      senderName: user.name,
      content: 'Counter offer',
      timestamp: new Date().toISOString(),
      type: 'offer',
      offer: { ...newOffer, totalPrice: newOffer.quantity * newOffer.pricePerUnit }
    };
    setMessages([...messages, offer]);
    setShowOfferForm(false);
  };

  const acceptOffer = (offer: any) => {
    const contractData = {
      productId: negotiationData.productId,
      productName: negotiationData.productName,
      buyerId: negotiationData.buyerId,
      sellerId: negotiationData.sellerId,
      buyerName: negotiationData.buyerName,
      sellerName: negotiationData.sellerName,
      agreedTerms: offer,
      status: 'pending_signature'
    };
    onNavigate('contract-finalization', contractData);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border p-4 flex-shrink-0">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => onNavigate('dashboard')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Negotiation</h1>
              <p className="text-sm text-muted-foreground">{negotiationData.productName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                {(user.userType === 'buyer' ? negotiationData.sellerName : negotiationData.buyerName).charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {user.userType === 'buyer' ? negotiationData.sellerName : negotiationData.buyerName}
            </span>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
              Online
            </Badge>
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-4xl mx-auto w-full flex">
        {/* Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.senderId === user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-md ${message.senderId === user.id ? 'order-2' : 'order-1'}`}>
                    {message.type === 'message' ? (
                      <div
                        className={`p-3 rounded-lg ${
                          message.senderId === user.id
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-card border border-border text-foreground'
                        }`}
                      >
                        <p>{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          message.senderId === user.id ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        }`}>
                          {new Date(message.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ) : (
                      <Card className="bg-card border-border">
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm flex items-center space-x-2">
                            <Package className="h-4 w-4" />
                            <span>Offer Details</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center space-x-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Quantity:</span>
                              <span className="font-medium text-foreground">{message.offer?.quantity} kg</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Price:</span>
                              <span className="font-medium text-foreground">${message.offer?.pricePerUnit}/kg</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4 text-muted-foreground" />
                              <span className="text-muted-foreground">Delivery:</span>
                              <span className="font-medium text-foreground">
                                {message.offer?.deliveryDate ? new Date(message.offer.deliveryDate).toLocaleDateString() : 'TBD'}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="h-4 w-4 text-accent" />
                              <span className="text-muted-foreground">Total:</span>
                              <span className="font-bold text-accent">${message.offer?.totalPrice?.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          {message.senderId !== user.id && (
                            <div className="flex space-x-2 pt-2">
                              <Button 
                                size="sm" 
                                onClick={() => acceptOffer(message.offer)}
                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                              >
                                <CheckCircle className="h-3 w-3 mr-1" />
                                Accept
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setShowOfferForm(true)}
                                className="border-border hover:bg-accent hover:text-accent-foreground"
                              >
                                Counter
                              </Button>
                            </div>
                          )}
                          
                          <p className="text-xs text-muted-foreground">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
                  
                  <Avatar className={`h-8 w-8 ${message.senderId === user.id ? 'order-1 ml-2' : 'order-2 mr-2'}`}>
                    <AvatarFallback className="bg-secondary text-secondary-foreground text-sm">
                      {message.senderName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Offer Form */}
          {showOfferForm && (
            <div className="p-6 border-t border-border bg-card">
              <Card className="bg-input-background border-border">
                <CardHeader>
                  <CardTitle className="text-sm">Make Counter Offer</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground">Quantity (kg)</label>
                      <Input
                        type="number"
                        value={newOffer.quantity}
                        onChange={(e) => setNewOffer({
                          ...newOffer,
                          quantity: parseInt(e.target.value) || 0
                        })}
                        className="bg-input-background border-border"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground">Price per kg ($)</label>
                      <Input
                        type="number"
                        value={newOffer.pricePerUnit}
                        onChange={(e) => setNewOffer({
                          ...newOffer,
                          pricePerUnit: parseFloat(e.target.value) || 0
                        })}
                        className="bg-input-background border-border"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground">Delivery Date</label>
                    <Input
                      type="date"
                      value={newOffer.deliveryDate}
                      onChange={(e) => setNewOffer({
                        ...newOffer,
                        deliveryDate: e.target.value
                      })}
                      className="bg-input-background border-border"
                    />
                  </div>
                  <div className="flex items-center justify-between p-3 bg-background rounded border border-border">
                    <span className="text-sm text-muted-foreground">Total Price:</span>
                    <span className="font-bold text-accent">
                      ${(newOffer.quantity * newOffer.pricePerUnit).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={sendOffer} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                      Send Offer
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => setShowOfferForm(false)}
                      className="border-border hover:bg-accent hover:text-accent-foreground"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Message Input */}
          <div className="p-6 border-t border-border bg-card">
            <div className="flex space-x-2">
              <Input
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                className="bg-input-background border-border"
              />
              <Button 
                onClick={() => setShowOfferForm(!showOfferForm)}
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                Offer
              </Button>
              <Button 
                onClick={sendMessage}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 border-l border-border bg-card p-4 space-y-4">
          <Card className="bg-input-background border-border">
            <CardHeader>
              <CardTitle className="text-sm">Negotiation Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <span className="text-sm text-muted-foreground">Product:</span>
                <p className="font-medium text-foreground">{negotiationData.productName}</p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">
                  {user.userType === 'buyer' ? 'Seller:' : 'Buyer:'}
                </span>
                <p className="font-medium text-foreground">
                  {user.userType === 'buyer' ? negotiationData.sellerName : negotiationData.buyerName}
                </p>
              </div>
              <div>
                <span className="text-sm text-muted-foreground">Status:</span>
                <div className="flex items-center space-x-2 mt-1">
                  <Clock className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-foreground">In Progress</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-input-background border-border">
            <CardHeader>
              <CardTitle className="text-sm">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-border hover:bg-accent hover:text-accent-foreground"
                onClick={() => setShowOfferForm(true)}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Make Offer
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-border hover:bg-accent hover:text-accent-foreground"
              >
                <User className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start border-border hover:bg-accent hover:text-accent-foreground"
              >
                <Package className="h-4 w-4 mr-2" />
                Product Details
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}