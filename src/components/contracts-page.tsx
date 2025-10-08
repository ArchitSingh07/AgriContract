import { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft,
  FileText,
  Calendar,
  Search,
  ShoppingCart
} from 'lucide-react';
import { Input } from './ui/input';

interface Contract {
  id: string;
  productName: string;
  buyerName: string;
  farmerName: string;
  quantity: number;
  unit: string;
  totalPrice: number;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  createdDate: string;
  deliveryDate: string;
}

interface ContractsPageProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ContractsPage({ user, onNavigate }: ContractsPageProps) {
  // Mock contracts data - set to empty array to show empty state
  const [contracts] = useState<Contract[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredContracts = contracts.filter(contract =>
    contract.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (user.userType === 'farmer' ? contract.buyerName : contract.farmerName)
      .toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border p-4">
        <div className="max-w-6xl mx-auto flex items-center space-x-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => onNavigate('dashboard')}
            className="text-muted-foreground hover:text-primary"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-foreground">
              {user.userType === 'farmer' ? 'Your Contracts' : 'Your Contracts'}
            </h1>
            <p className="text-sm text-muted-foreground">
              {user.userType === 'farmer' 
                ? 'Manage contracts with your buyers' 
                : 'Track your contracts with farmers'
              }
            </p>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => onNavigate('products')}
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {user.userType === 'farmer' ? 'View Products' : 'Browse Products'}
          </Button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/* Search */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search contracts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-input-background border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Contracts List */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Contracts ({filteredContracts.length})</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Contracts Available
                </h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                  {user.userType === 'farmer' 
                    ? 'You don\'t have any contracts yet. Once buyers start negotiating for your products, contracts will appear here.' 
                    : 'You haven\'t made any contracts yet. Start by browsing products and initiating negotiations with farmers.'
                  }
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => onNavigate('products')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  {user.userType === 'farmer' ? 'View Your Products' : 'Browse Products'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredContracts.map((contract) => (
                  <Card 
                    key={contract.id} 
                    className="bg-input-background border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('contract-view', contract)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground mb-1">
                            {contract.productName}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {user.userType === 'farmer' 
                              ? `Contract with ${contract.buyerName}` 
                              : `Contract with ${contract.farmerName}`
                            }
                          </p>
                        </div>
                        <Badge className={getStatusColor(contract.status)}>
                          {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Quantity</p>
                          <p className="font-semibold text-foreground">
                            {contract.quantity} {contract.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total Value</p>
                          <p className="font-semibold text-accent">
                            ₹{contract.totalPrice.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Delivery Date</p>
                          <p className="font-semibold text-foreground flex items-center">
                            <Calendar className="h-3 w-3 mr-1" />
                            {new Date(contract.deliveryDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}