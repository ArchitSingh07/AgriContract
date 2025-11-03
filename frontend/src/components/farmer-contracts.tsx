import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import {
  ArrowLeft,
  FileText,
  Calendar,
  DollarSign,
  Package,
  User,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  AlertCircle,
  Eye
} from 'lucide-react';
import { contractService } from '../services/contractService';
import type { Contract } from '../types';

interface FarmerContractsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function FarmerContracts({ user, onNavigate }: FarmerContractsProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchContracts();
  }, [user._id, user.id]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contractService.getContractsByFarmer(user._id || user.id);
      setContracts(response.contracts);
    } catch (err: any) {
      console.error('Failed to fetch contracts:', err);
      setError(err.response?.data?.message || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const handleSignContract = async (contractId: string) => {
    try {
      await contractService.signContract(contractId);
      await fetchContracts();
    } catch (err: any) {
      console.error('Failed to sign contract:', err);
      setError(err.response?.data?.message || 'Failed to sign contract');
    }
  };

  const filterContracts = (status?: string) => {
    if (!status || status === 'all') return contracts;
    return contracts.filter(c => c.status === status);
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          icon: Clock,
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-500/10',
          badgeVariant: 'secondary' as const
        };
      case 'active':
        return {
          icon: CheckCircle,
          color: 'text-blue-500',
          bgColor: 'bg-blue-500/10',
          badgeVariant: 'default' as const
        };
      case 'completed':
        return {
          icon: CheckCircle,
          color: 'text-green-500',
          bgColor: 'bg-green-500/10',
          badgeVariant: 'default' as const
        };
      case 'cancelled':
        return {
          icon: XCircle,
          color: 'text-red-500',
          bgColor: 'bg-red-500/10',
          badgeVariant: 'destructive' as const
        };
      default:
        return {
          icon: FileText,
          color: 'text-gray-500',
          bgColor: 'bg-gray-500/10',
          badgeVariant: 'secondary' as const
        };
    }
  };

  const ContractCard = ({ contract }: { contract: Contract }) => {
    const statusConfig = getStatusConfig(contract.status);
    const StatusIcon = statusConfig.icon;
    const product = typeof contract.productId === 'object' ? contract.productId : null;
    const buyer = typeof contract.buyerId === 'object' ? contract.buyerId : null;

    return (
      <Card className="bg-card border-border hover:shadow-lg transition-all">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className={`p-2 rounded-full ${statusConfig.bgColor}`}>
                <StatusIcon className={`h-5 w-5 ${statusConfig.color}`} />
              </div>
              <div>
                <CardTitle className="text-lg">{product?.name || 'Product'}</CardTitle>
                <CardDescription className="flex items-center space-x-2 mt-1">
                  <User className="h-3 w-3" />
                  <span>Buyer: {buyer?.name || 'Unknown'}</span>
                </CardDescription>
              </div>
            </div>
            <Badge variant={statusConfig.badgeVariant} className="capitalize">
              {contract.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Contract Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Package className="h-4 w-4 mr-2" />
                Quantity
              </div>
              <p className="font-semibold text-foreground">
                {contract.quantity} {contract.unit}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                Price
              </div>
              <p className="font-semibold text-foreground">
                ₹{contract.agreedPrice}/{contract.unit}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 mr-2" />
                Delivery Date
              </div>
              <p className="font-semibold text-foreground">
                {new Date(contract.deliveryDate).toLocaleDateString()}
              </p>
            </div>
            <div className="space-y-1">
              <div className="flex items-center text-sm text-muted-foreground">
                <DollarSign className="h-4 w-4 mr-2" />
                Total Value
              </div>
              <p className="font-semibold text-accent">
                ₹{contract.totalValue.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Signing Status */}
          <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                {contract.signedByFarmer ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  Farmer {contract.signedByFarmer ? 'Signed' : 'Pending'}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {contract.signedByBuyer ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <Clock className="h-4 w-4 text-yellow-500" />
                )}
                <span className="text-sm text-muted-foreground">
                  Buyer {contract.signedByBuyer ? 'Signed' : 'Pending'}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onNavigate('contract-view', contract)}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Details
            </Button>
            {!contract.signedByFarmer && contract.status === 'pending' && (
              <Button
                className="flex-1 bg-primary hover:bg-primary/90"
                onClick={() => handleSignContract(contract._id)}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Sign Contract
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('farmer-dashboard')}
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Contracts</h1>
              <p className="text-muted-foreground">View and manage all your farming contracts</p>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Contracts</p>
                  <p className="text-2xl font-bold text-foreground">{contracts.length}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-foreground">
                    {contracts.filter(c => c.status === 'pending').length}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Active</p>
                  <p className="text-2xl font-bold text-foreground">
                    {contracts.filter(c => c.status === 'active').length}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                  <p className="text-2xl font-bold text-green-500">
                    ₹{contracts.reduce((sum, c) => sum + c.totalValue, 0).toLocaleString('en-IN')}
                  </p>
                </div>
                <DollarSign className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contracts List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading contracts...</p>
          </div>
        ) : contracts.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="py-12">
              <div className="text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Contracts Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Start negotiating with buyers to create your first contract
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => onNavigate('farmer-dashboard')}
                >
                  Go to Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterContracts('all').map(contract => (
                  <ContractCard key={contract._id} contract={contract} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="pending" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterContracts('pending').map(contract => (
                  <ContractCard key={contract._id} contract={contract} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="active" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterContracts('active').map(contract => (
                  <ContractCard key={contract._id} contract={contract} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="completed" className="space-y-4 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filterContracts('completed').map(contract => (
                  <ContractCard key={contract._id} contract={contract} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
