import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import {
  ArrowLeft,
  Download,
  FileText,
  PenTool,
  CheckCircle,
  Calendar,
  DollarSign,
  Package,
  MapPin,
  User,
  Shield,
  CreditCard
} from 'lucide-react';



export function ContractView({ contractData, user, onNavigate }) {
  const [buyerSigned, setBuyerSigned] = useState(false);
  const [sellerSigned, setSellerSigned] = useState(false);

  const canSign = user.userType === 'buyer' ? !buyerSigned : !sellerSigned;
  const bothSigned = buyerSigned && sellerSigned;

  const handleSign = () => {
    if (user.userType === 'buyer') {
      setBuyerSigned(true);
    } else {
      setSellerSigned(true);
    }

    // Simulate other party signing after a delay
    setTimeout(() => {
      if (user.userType === 'buyer') {
        setSellerSigned(true);
      } else {
        setBuyerSigned(true);
      }
    }, 2000);
  };

  const handleProceedToPayment = () => {
    const paymentData = {
      ...contractData,
      paymentAmount: contractData.finalTerms.totalPrice * 0.5, // 50% advance
      contractId: contractData.contractId
    };
    onNavigate('payment', paymentData);
  };

  const downloadContract = () => {
    // In a real app, this would generate and download a PDF
    alert('Contract PDF downloaded successfully!');
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
              onClick={() => onNavigate('dashboard')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-foreground">Contract Agreement</h1>
              <p className="text-sm text-muted-foreground">
                Contract ID: {contractData.contractId}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Badge
              variant={bothSigned ? "default" : "secondary"}
              className={bothSigned ? "bg-green-500 text-white" : "bg-yellow-500 text-white"}
            >
              {bothSigned ? "Fully Executed" : "Awaiting Signatures"}
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Contract Status */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Contract Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${buyerSigned ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {buyerSigned ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <PenTool className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Buyer Signature</p>
                    <p className="text-sm text-muted-foreground">
                      {buyerSigned ? `Signed by ${contractData.buyerName}` : 'Pending signature'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${sellerSigned ? 'bg-green-100 dark:bg-green-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                    {sellerSigned ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <PenTool className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Seller Signature</p>
                    <p className="text-sm text-muted-foreground">
                      {sellerSigned ? `Signed by ${contractData.sellerName}` : 'Pending signature'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-foreground">
                    {bothSigned ? '100%' : `${(buyerSigned + sellerSigned) * 50}%`}
                  </div>
                  <p className="text-sm text-muted-foreground">Complete</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Details */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Contract Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Parties */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Buyer</span>
                </h3>
                <div className="pl-6 space-y-1">
                  <p className="font-medium text-foreground">{contractData.buyerName}</p>
                  <p className="text-sm text-muted-foreground">buyer@company.com</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>Seller</span>
                </h3>
                <div className="pl-6 space-y-1">
                  <p className="font-medium text-foreground">{contractData.sellerName}</p>
                  <p className="text-sm text-muted-foreground">farmer@farm.com</p>
                  <p className="text-sm text-muted-foreground">+1 (555) 987-6543</p>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Product & Terms */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product & Terms</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-input-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium text-foreground">Product</span>
                  </div>
                  <p className="font-semibold text-foreground">{contractData.productName}</p>
                  <p className="text-sm text-muted-foreground">{contractData.finalTerms.quantity} kg</p>
                </div>

                <div className="p-4 bg-input-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <DollarSign className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-foreground">Total Value</span>
                  </div>
                  <p className="font-semibold text-accent">${contractData.finalTerms.totalPrice.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">${contractData.finalTerms.pricePerUnit}/kg</p>
                </div>

                <div className="p-4 bg-input-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-4 w-4 text-blue-500" />
                    <span className="text-sm font-medium text-foreground">Delivery</span>
                  </div>
                  <p className="font-semibold text-foreground">
                    {new Date(contractData.finalTerms.deliveryDate).toLocaleDateString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                </div>

                <div className="p-4 bg-input-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2 mb-2">
                    <MapPin className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-foreground">Location</span>
                  </div>
                  <p className="font-semibold text-foreground">Specified Address</p>
                  <p className="text-sm text-muted-foreground">Delivery Location</p>
                </div>
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Detailed Terms */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Contract Terms</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-foreground mb-2">Payment Terms</h4>
                  <p className="text-muted-foreground pl-4">{contractData.finalTerms.paymentTerms}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Quality Standards</h4>
                  <p className="text-muted-foreground pl-4">{contractData.finalTerms.qualityStandards}</p>
                </div>

                <div>
                  <h4 className="font-medium text-foreground mb-2">Penalties & Defaults</h4>
                  <p className="text-muted-foreground pl-4">{contractData.finalTerms.penalties}</p>
                </div>

                {contractData.finalTerms.additionalTerms && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Additional Terms</h4>
                    <p className="text-muted-foreground pl-4">{contractData.finalTerms.additionalTerms}</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Legal Notice */}
        <Card className="bg-input-background border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-muted-foreground">
              <Shield className="h-5 w-5" />
              <span>Legal Notice</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This contract is legally binding once signed by both parties. By signing this agreement,
              both parties acknowledge they have read, understood, and agree to be bound by all terms
              and conditions outlined above. Any modifications to this contract must be agreed upon
              by both parties in writing.
            </p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={downloadContract}
              className="border-border hover:bg-accent hover:text-accent-foreground"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF
            </Button>
          </div>

          <div className="flex gap-2">
            {canSign && (
              <Button
                onClick={handleSign}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <PenTool className="h-4 w-4 mr-2" />
                Sign Contract
              </Button>
            )}

            {bothSigned && user.userType === 'buyer' && (
              <Button
                onClick={handleProceedToPayment}
                className="bg-accent hover:bg-accent/90 text-accent-foreground"
              >
                <CreditCard className="h-4 w-4 mr-2" />
                Proceed to Payment
              </Button>
            )}
          </div>
        </div>

        {bothSigned && (
          <Card className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="font-medium text-green-800 dark:text-green-200">
                  Contract fully executed! Both parties have signed the agreement.
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}

