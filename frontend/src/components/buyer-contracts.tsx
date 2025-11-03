import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import {
  ArrowLeft,
  Loader2,
  AlertCircle,
  FileText,
  Calendar,
  Package,
  IndianRupee,
  Eye
} from 'lucide-react';
import { contractService } from '../services/contractService';
import type { Contract } from '../types';
import { format } from 'date-fns';

interface BuyerContractsProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function BuyerContracts({ user, onNavigate }: BuyerContractsProps) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [filteredContracts, setFilteredContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchContracts();
  }, [user._id, user.id]);

  useEffect(() => {
    if (filterStatus === 'all') {
      setFilteredContracts(contracts);
    } else {
      setFilteredContracts(contracts.filter(c => c.status === filterStatus));
    }
  }, [filterStatus, contracts]);

  const fetchContracts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await contractService.getContractsByBuyer(user._id || user.id);
      setContracts(response.contracts);
      setFilteredContracts(response.contracts);
    } catch (err: any) {
      console.error('Failed to fetch contracts:', err);
      setError(err.response?.data?.message || 'Failed to load contracts');
    } finally {
      setLoading(false);
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "outline" | "destructive" => {
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

  const stats = [
    {
      label: 'Total Contracts',
      value: contracts.length,
      color: 'text-blue-500'
    },
    {
      label: 'Active',
      value: contracts.filter(c => c.status === 'active').length,
      color: 'text-green-500'
    },
    {
      label: 'Pending',
      value: contracts.filter(c => c.status === 'pending').length,
      color: 'text-yellow-500'
    },
    {
      label: 'Completed',
      value: contracts.filter(c => c.status === 'completed').length,
      color: 'text-purple-500'
    }
  ];

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
              <h1 className="text-2xl font-bold text-foreground">My Contracts</h1>
              <p className="text-sm text-muted-foreground">
                View and manage your purchase contracts
              </p>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-card border-border">
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filter Tabs */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'active', 'completed', 'cancelled'].map((status) => (
                <Button
                  key={status}
                  variant={filterStatus === status ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(status)}
                  className="capitalize"
                >
                  {status}
                  {status !== 'all' && (
                    <Badge variant="secondary" className="ml-2">
                      {contracts.filter(c => c.status === status).length}
                    </Badge>
                  )}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Contracts List */}
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : filteredContracts.length === 0 ? (
          <div className="text-center py-24">
            <FileText className="h-20 w-20 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {filterStatus === 'all' ? 'No Contracts Yet' : `No ${filterStatus} Contracts`}
            </h3>
            <p className="text-muted-foreground mb-6">
              {filterStatus === 'all'
                ? 'Start negotiating with farmers to create contracts'
                : `You don't have any ${filterStatus} contracts`}
            </p>
            {filterStatus !== 'all' && (
              <Button variant="outline" onClick={() => setFilterStatus('all')}>
                View All Contracts
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredContracts.map((contract) => {
              const farmerInfo = contract.farmerId as any;
              const isSigned = contract.signedByBuyer && contract.signedByFarmer;

              return (
                <Card
                  key={contract._id}
                  className="bg-card border-border hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => onNavigate('contract-details', contract)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-lg font-bold text-foreground">
                                {contract.cropName || 'Agricultural Contract'}
                              </h3>
                              <Badge variant={getStatusVariant(contract.status)}>
                                {contract.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Contract ID: {contract._id.slice(-8)}
                            </p>
                          </div>
                        </div>

                        {/* Contract Details Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Farmer</p>
                            <p className="text-sm font-medium text-foreground">
                              {farmerInfo?.name || 'N/A'}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Package className="h-3 w-3" />
                              Quantity
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {contract.quantity} {contract.unit}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <IndianRupee className="h-3 w-3" />
                              Price
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              ₹{contract.agreedPrice}/{contract.unit}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Total Value</p>
                            <p className="text-sm font-bold text-green-600">
                              ₹{contract.totalValue.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>

                        {/* Additional Info */}
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-3 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              Delivery Date
                            </p>
                            <p className="text-sm font-medium text-foreground">
                              {format(new Date(contract.deliveryDate), 'MMM dd, yyyy')}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Delivery Location</p>
                            <p className="text-sm font-medium text-foreground">
                              {contract.deliveryLocation?.city || 'TBD'}
                              {contract.deliveryLocation?.state && `, ${contract.deliveryLocation.state}`}
                            </p>
                          </div>

                          <div>
                            <p className="text-xs text-muted-foreground mb-1">Signatures</p>
                            <div className="flex items-center gap-2">
                              {isSigned ? (
                                <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                                  Fully Signed
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                                  {contract.signedByBuyer ? 'Awaiting Farmer' : 'Action Required'}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Payment Terms */}
                        {contract.paymentTerms && (
                          <div className="pt-3 border-t border-border">
                            <p className="text-xs text-muted-foreground mb-1">Payment Terms</p>
                            <p className="text-sm text-foreground">{contract.paymentTerms}</p>
                          </div>
                        )}
                      </div>

                      {/* Action Button */}
                      <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
                          e.stopPropagation();
                          onNavigate('contract-details', contract);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
