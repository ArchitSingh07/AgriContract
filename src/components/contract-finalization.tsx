import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Checkbox } from './ui/checkbox';
import { 
  ArrowLeft, 
  FileText, 
  Calendar, 
  DollarSign, 
  Package, 
  Truck,
  Shield,
  CheckCircle
} from 'lucide-react';

interface ContractFinalizationProps {
  contractData: any;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ContractFinalization({ contractData, user, onNavigate }: ContractFinalizationProps) {
  const [contractTerms, setContractTerms] = useState({
    quantity: contractData.agreedTerms.quantity,
    pricePerUnit: contractData.agreedTerms.pricePerUnit,
    totalPrice: contractData.agreedTerms.totalPrice,
    deliveryDate: contractData.agreedTerms.deliveryDate,
    deliveryLocation: '',
    paymentTerms: '50% advance, 50% on delivery',
    qualityStandards: 'Grade A quality as per industry standards',
    penalties: 'Late delivery: 2% per day penalty',
    additionalTerms: ''
  });

  const [agreed, setAgreed] = useState(false);

  const handleGenerateContract = () => {
    const finalContract = {
      ...contractData,
      finalTerms: contractTerms,
      contractId: `CON-${Date.now()}`,
      createdDate: new Date().toISOString(),
      status: 'pending_signatures'
    };
    onNavigate('contract-view', finalContract);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-4xl mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('dashboard')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Contract Finalization</h1>
            <p className="text-sm text-muted-foreground">
              Review and finalize contract terms
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Agreement Summary */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-primary" />
              <span>Agreement Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Product</label>
                  <p className="text-lg font-semibold text-foreground">{contractData.productName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Buyer</label>
                  <p className="font-medium text-foreground">{contractData.buyerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Seller</label>
                  <p className="font-medium text-foreground">{contractData.sellerName}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-input-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2">
                    <Package className="h-5 w-5 text-primary" />
                    <span className="font-medium text-foreground">Quantity</span>
                  </div>
                  <span className="font-bold text-foreground">{contractData.agreedTerms.quantity} kg</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-input-background rounded-lg border border-border">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    <span className="font-medium text-foreground">Total Value</span>
                  </div>
                  <span className="font-bold text-accent">${contractData.agreedTerms.totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Terms */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Contract Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Terms */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quantity (kg)</label>
                <Input
                  type="number"
                  value={contractTerms.quantity}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    quantity: parseInt(e.target.value) || 0,
                    totalPrice: (parseInt(e.target.value) || 0) * contractTerms.pricePerUnit
                  })}
                  className="bg-input-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Price per kg ($)</label>
                <Input
                  type="number"
                  step="0.01"
                  value={contractTerms.pricePerUnit}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    pricePerUnit: parseFloat(e.target.value) || 0,
                    totalPrice: contractTerms.quantity * (parseFloat(e.target.value) || 0)
                  })}
                  className="bg-input-background border-border"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Delivery Date</label>
                <Input
                  type="date"
                  value={contractTerms.deliveryDate}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    deliveryDate: e.target.value
                  })}
                  className="bg-input-background border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Delivery Location</label>
                <Input
                  placeholder="Enter delivery address"
                  value={contractTerms.deliveryLocation}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    deliveryLocation: e.target.value
                  })}
                  className="bg-input-background border-border"
                />
              </div>
            </div>

            <Separator className="bg-border" />

            {/* Advanced Terms */}
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Payment Terms</label>
                <Input
                  value={contractTerms.paymentTerms}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    paymentTerms: e.target.value
                  })}
                  className="bg-input-background border-border"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Quality Standards</label>
                <Textarea
                  value={contractTerms.qualityStandards}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    qualityStandards: e.target.value
                  })}
                  className="bg-input-background border-border"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Penalties & Defaults</label>
                <Textarea
                  value={contractTerms.penalties}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    penalties: e.target.value
                  })}
                  className="bg-input-background border-border"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Additional Terms</label>
                <Textarea
                  placeholder="Any additional terms or conditions"
                  value={contractTerms.additionalTerms}
                  onChange={(e) => setContractTerms({
                    ...contractTerms,
                    additionalTerms: e.target.value
                  })}
                  className="bg-input-background border-border"
                  rows={4}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contract Summary */}
        <Card className="bg-input-background border-border">
          <CardHeader>
            <CardTitle className="text-accent">Contract Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Quantity</p>
                  <p className="text-xl font-bold text-foreground">{contractTerms.quantity} kg</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contract Value</p>
                  <p className="text-xl font-bold text-accent">${contractTerms.totalPrice.toLocaleString()}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Delivery Date</p>
                  <p className="text-xl font-bold text-foreground">
                    {new Date(contractTerms.deliveryDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Terms & Conditions */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <span>Terms & Conditions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>• Both parties agree to the terms specified in this contract</p>
              <p>• Quality inspection will be conducted upon delivery</p>
              <p>• Payment terms as agreed will be strictly followed</p>
              <p>• Any disputes will be resolved through arbitration</p>
              <p>• Force majeure events may extend delivery timelines</p>
            </div>
            
            <div className="flex items-center space-x-2 pt-4">
              <Checkbox 
                id="agreement" 
                checked={agreed}
                onCheckedChange={setAgreed}
              />
              <label htmlFor="agreement" className="text-sm font-medium text-foreground">
                I agree to all the terms and conditions mentioned above
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4 justify-end">
          <Button 
            variant="outline"
            onClick={() => onNavigate('negotiation', contractData)}
            className="border-border hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Negotiation
          </Button>
          <Button 
            onClick={handleGenerateContract}
            disabled={!agreed || !contractTerms.deliveryLocation}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Generate Contract
          </Button>
        </div>
      </main>
    </div>
  );
}