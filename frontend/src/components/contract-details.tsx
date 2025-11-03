import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  FileText,
  Calendar,
  Package,
  IndianRupee,
  MapPin,
  User as UserIcon,
  Mail,
  Phone,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileSignature
} from 'lucide-react';
import { contractService } from '../services/contractService';
import type { Contract } from '../types';
import { format } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface ContractDetailsProps {
  contract: Contract;
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ContractDetails({ contract: initialContract, user, onNavigate }: ContractDetailsProps) {
  const [contract, setContract] = useState<Contract>(initialContract);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSignDialog, setShowSignDialog] = useState(false);

  const userRole = (user.role?.toLowerCase() || user.userType) as 'farmer' | 'buyer';
  const isUserSigned = userRole === 'farmer' ? contract.signedByFarmer : contract.signedByBuyer;
  const otherPartySigned = userRole === 'farmer' ? contract.signedByBuyer : contract.signedByFarmer;
  const fullySigned = contract.signedByFarmer && contract.signedByBuyer;

  const farmerInfo = contract.farmerId as any;
  const buyerInfo = contract.buyerId as any;

  const handleSign = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await contractService.signContract(contract._id);
      setContract(response.contract);
      setSuccess('Contract signed successfully!');
      setShowSignDialog(false);
    } catch (err: any) {
      console.error('Failed to sign contract:', err);
      setError(err.response?.data?.message || 'Failed to sign contract');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
    switch (status) {
      case 'active':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'pending':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate(userRole === 'farmer' ? 'farmer-contracts' : 'buyer-contracts')}
              className="text-muted-foreground hover:text-primary"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Contract Details</h1>
              <p className="text-sm text-muted-foreground">
                Contract ID: {contract._id.slice(-12)}
              </p>
            </div>
          </div>
          <Badge variant={getStatusBadgeVariant(contract.status)}>
            {contract.status}
          </Badge>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Status Alerts */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-600">
              {success}
            </AlertDescription>
          </Alert>
        )}

        {/* Signature Status Banner */}
        {!fullySigned && (
          <Alert>
            <FileSignature className="h-4 w-4" />
            <AlertDescription>
              {!isUserSigned ? (
                <span className="font-medium">Action Required: Please sign this contract to proceed.</span>
              ) : !otherPartySigned ? (
                <span>Waiting for {userRole === 'farmer' ? 'buyer' : 'farmer'} to sign the contract.</span>
              ) : null}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Contract Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Product/Crop Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Product Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    {contract.cropName || 'Agricultural Product'}
                  </h3>
                  <Badge className="bg-primary/10 text-primary">
                    {contract.listingType === 'product' ? 'Product Purchase' : 'Buyer Request Fulfilled'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-6 pt-4 border-t border-border">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Quantity</p>
                    <p className="text-xl font-bold text-foreground">
                      {contract.quantity} {contract.unit}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Price per Unit</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-5 w-5 text-green-600" />
                      <p className="text-xl font-bold text-green-600">
                        {contract.agreedPrice.toLocaleString('en-IN')}
                      </p>
                      <span className="text-muted-foreground">/{contract.unit}</span>
                    </div>
                  </div>

                  <div className="col-span-2">
                    <p className="text-sm text-muted-foreground mb-1">Total Contract Value</p>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="h-7 w-7 text-primary" />
                      <p className="text-3xl font-bold text-primary">
                        {contract.totalValue.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Delivery Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Delivery Date</p>
                    <p className="text-lg font-semibold text-foreground">
                      {format(new Date(contract.deliveryDate), 'MMMM dd, yyyy')}
                    </p>
                  </div>

                  {contract.deliveryLocation && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        Delivery Location
                      </p>
                      <p className="text-lg font-semibold text-foreground">
                        {contract.deliveryLocation.city}
                        {contract.deliveryLocation.state && `, ${contract.deliveryLocation.state}`}
                      </p>
                      {contract.deliveryLocation.pincode && (
                        <p className="text-sm text-muted-foreground">
                          PIN: {contract.deliveryLocation.pincode}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Contract Terms</p>
                  <p className="text-foreground whitespace-pre-wrap">
                    {contract.terms || 'Standard agricultural contract terms apply.'}
                  </p>
                </div>

                {contract.paymentTerms && (
                  <div className="pt-4 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Payment Terms</p>
                    <p className="text-foreground">{contract.paymentTerms}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Contract Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Contract Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">Contract Created</p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(contract.createdAt), 'MMMM dd, yyyy · h:mm a')}
                      </p>
                    </div>
                  </div>

                  {contract.farmerSignDate && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Signed by Farmer</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(contract.farmerSignDate), 'MMMM dd, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                  )}

                  {contract.buyerSignDate && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-green-500" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Signed by Buyer</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(contract.buyerSignDate), 'MMMM dd, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                  )}

                  {contract.completionDate && (
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-purple-500" />
                      <div className="flex-1">
                        <p className="font-medium text-foreground">Contract Completed</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(contract.completionDate), 'MMMM dd, yyyy · h:mm a')}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar - Party Information */}
          <div className="space-y-6">
            {/* Farmer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Farmer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-lg">
                    {farmerInfo?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{farmerInfo?.name}</p>
                    <Badge variant={contract.signedByFarmer ? 'secondary' : 'outline'} className="mt-1">
                      {contract.signedByFarmer ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Signed</>
                      ) : (
                        'Pending Signature'
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border text-sm">
                  {farmerInfo?.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{farmerInfo.email}</span>
                    </div>
                  )}
                  {farmerInfo?.phoneNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{farmerInfo.phoneNumber}</span>
                    </div>
                  )}
                  {farmerInfo?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{farmerInfo.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Buyer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5" />
                  Buyer Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-lg">
                    {buyerInfo?.name?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{buyerInfo?.name}</p>
                    <Badge variant={contract.signedByBuyer ? 'secondary' : 'outline'} className="mt-1">
                      {contract.signedByBuyer ? (
                        <><CheckCircle className="h-3 w-3 mr-1" /> Signed</>
                      ) : (
                        'Pending Signature'
                      )}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-border text-sm">
                  {buyerInfo?.email && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span>{buyerInfo.email}</span>
                    </div>
                  )}
                  {buyerInfo?.phoneNumber && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{buyerInfo.phoneNumber}</span>
                    </div>
                  )}
                  {buyerInfo?.location && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{buyerInfo.location}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Action Button */}
            {!isUserSigned && contract.status === 'pending' && (
              <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-6">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-lg font-semibold"
                    onClick={() => setShowSignDialog(true)}
                    disabled={loading}
                  >
                    {loading ? (
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    ) : (
                      <FileSignature className="h-5 w-5 mr-2" />
                    )}
                    Sign Contract
                  </Button>
                  <p className="text-xs text-center text-muted-foreground mt-3">
                    By signing, you agree to the terms and conditions outlined above
                  </p>
                </CardContent>
              </Card>
            )}

            {fullySigned && (
              <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                <CardContent className="p-6 text-center">
                  <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                  <p className="font-semibold text-green-600 mb-1">Contract Fully Signed</p>
                  <p className="text-sm text-muted-foreground">
                    This contract is legally binding for both parties
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>

      {/* Sign Confirmation Dialog */}
      <AlertDialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Sign Contract</AlertDialogTitle>
            <AlertDialogDescription>
              By signing this contract, you confirm that you have read and agree to all the terms and
              conditions. This action is legally binding and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSign}
              disabled={loading}
              className="bg-primary hover:bg-primary/90"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Signing...
                </>
              ) : (
                <>
                  <FileSignature className="h-4 w-4 mr-2" />
                  Confirm & Sign
                </>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
