import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import { Progress } from './ui/progress';
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  CheckCircle, 
  DollarSign,
  Calendar,
  Lock,
  Smartphone,
  Building
} from 'lucide-react';

interface PaymentPageProps {
  paymentData: any;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function PaymentPage({ paymentData, user, onNavigate }: PaymentPageProps) {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [progress, setProgress] = useState(0);
  
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const handlePayment = async () => {
    setProcessing(true);
    setProgress(0);

    // Simulate payment processing
    const steps = [
      { message: 'Validating payment details...', progress: 25 },
      { message: 'Processing payment...', progress: 50 },
      { message: 'Confirming transaction...', progress: 75 },
      { message: 'Payment completed successfully!', progress: 100 }
    ];

    for (const step of steps) {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setProgress(step.progress);
    }

    setProcessing(false);
    setCompleted(true);
  };

  const handleCompletedAction = () => {
    const completionData = {
      ...paymentData,
      paymentStatus: 'completed',
      paymentDate: new Date().toISOString(),
      transactionId: `TXN-${Date.now()}`
    };
    onNavigate('completion', completionData);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-card border-border">
          <CardContent className="p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground">
                Your payment of ${paymentData.paymentAmount.toLocaleString()} has been processed successfully.
              </p>
            </div>
            <div className="p-4 bg-input-background rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-1">Transaction ID</p>
              <p className="font-mono text-sm font-medium text-foreground">TXN-{Date.now()}</p>
            </div>
            <Button 
              onClick={handleCompletedAction}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Continue
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('contract-view', paymentData)}
            className="text-muted-foreground hover:text-primary"
            disabled={processing}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Secure Payment</h1>
            <p className="text-sm text-muted-foreground">
              Contract: {paymentData.contractId}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Payment Processing */}
            {processing && (
              <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <span className="font-medium text-blue-800 dark:text-blue-200">Processing Payment...</span>
                    </div>
                    <Progress value={progress} className="w-full" />
                    <p className="text-sm text-blue-600 dark:text-blue-300">
                      Please do not close this window or navigate away.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Payment Method Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5 text-primary" />
                  <span>Payment Method</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} disabled={processing}>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex items-center space-x-2 cursor-pointer">
                        <CreditCard className="h-4 w-4" />
                        <span>Credit/Debit Card</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 opacity-50">
                      <RadioGroupItem value="bank" id="bank" disabled />
                      <Label htmlFor="bank" className="flex items-center space-x-2 cursor-pointer">
                        <Building className="h-4 w-4" />
                        <span>Bank Transfer (Coming Soon)</span>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 p-3 border border-border rounded-lg hover:bg-accent/50 opacity-50">
                      <RadioGroupItem value="digital" id="digital" disabled />
                      <Label htmlFor="digital" className="flex items-center space-x-2 cursor-pointer">
                        <Smartphone className="h-4 w-4" />
                        <span>Digital Wallet (Coming Soon)</span>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details */}
            {paymentMethod === 'card' && (
              <Card className="bg-card border-border">
                <CardHeader>
                  <CardTitle>Card Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="John Doe"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({...cardDetails, name: e.target.value})}
                      className="bg-input-background border-border"
                      disabled={processing}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({...cardDetails, number: e.target.value})}
                      className="bg-input-background border-border"
                      disabled={processing}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Expiry Date</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/YY"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({...cardDetails, expiry: e.target.value})}
                        className="bg-input-background border-border"
                        disabled={processing}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardDetails.cvv}
                        onChange={(e) => setCardDetails({...cardDetails, cvv: e.target.value})}
                        className="bg-input-background border-border"
                        disabled={processing}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Security Info */}
            <Card className="bg-input-background border-border">
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <Shield className="h-5 w-5 text-green-500 mt-0.5" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">Secure Payment</p>
                    <p className="text-xs text-muted-foreground">
                      Your payment information is encrypted and secure. We never store your card details.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">{paymentData.productName}</h3>
                  <p className="text-sm text-muted-foreground">Contract: {paymentData.contractId}</p>
                </div>
                
                <Separator className="bg-border" />
                
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Contract Value:</span>
                    <span className="text-foreground">${paymentData.finalTerms?.totalPrice?.toLocaleString() || 'N/A'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Payment Type:</span>
                    <span className="text-foreground">Advance Payment (50%)</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee:</span>
                    <span className="text-foreground">$5.00</span>
                  </div>
                  
                  <Separator className="bg-border" />
                  
                  <div className="flex justify-between font-semibold">
                    <span className="text-foreground">Total Due:</span>
                    <span className="text-accent">${(paymentData.paymentAmount + 5).toLocaleString()}</span>
                  </div>
                </div>
                
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                  <p className="text-xs text-yellow-800 dark:text-yellow-200">
                    Remaining 50% will be due upon delivery completion.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">Contract Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Buyer:</span>
                  <span className="text-foreground">{paymentData.buyerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Seller:</span>
                  <span className="text-foreground">{paymentData.sellerName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span className="text-foreground">
                    {paymentData.finalTerms?.deliveryDate ? 
                      new Date(paymentData.finalTerms.deliveryDate).toLocaleDateString() : 
                      'TBD'
                    }
                  </span>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handlePayment}
              disabled={processing || !cardDetails.name || !cardDetails.number}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Lock className="h-4 w-4 mr-2" />
              {processing ? 'Processing...' : `Pay $${(paymentData.paymentAmount + 5).toLocaleString()}`}
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}