import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Alert, AlertDescription } from './ui/alert';
import {
  Sprout,
  FileText,
  User,
  LogOut,
  Plus,
  DollarSign,
  ShoppingCart,
  Sun,
  Moon,
  Loader2,
  AlertCircle,
  MessageSquare,
  CheckCircle,
  Clock,
  Search
} from 'lucide-react';
import { contractService } from '../services/contractService';
import { buyerListingService } from '../services/buyerListingService';
import { negotiationService } from '../services/negotiationService';
import type { BuyerListing, Contract } from '../types';
import { format } from 'date-fns';

interface BuyerDashboardProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
  onLogout: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export function BuyerDashboard({ user, onNavigate, onLogout, theme, onToggleTheme }: BuyerDashboardProps) {
  const [buyerListings, setBuyerListings] = useState<BuyerListing[]>([]);
  const [recentContracts, setRecentContracts] = useState<Contract[]>([]);
  const [activeNegotiations, setActiveNegotiations] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [activeContracts, setActiveContracts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError('');

        // Fetch buyer's listings
        const listingsResponse = await buyerListingService.getMyBuyerListings();
        setBuyerListings(Array.isArray(listingsResponse) ? listingsResponse.slice(0, 3) : []);

        // Fetch buyer's contracts
        const contractsResponse = await contractService.getContractsByBuyer(user._id || user.id);
        const contracts = contractsResponse.contracts;
        setRecentContracts(contracts.slice(0, 3));

        // Calculate total spent from completed contracts
        const spent = contracts
          .filter((c: Contract) => c.status === 'completed')
          .reduce((sum: number, c: Contract) => sum + c.totalValue, 0);
        setTotalSpent(spent);

        // Count active contracts
        const active = contracts.filter((c: Contract) => c.status === 'active').length;
        setActiveContracts(active);

        // Fetch active negotiations - using farmer endpoint temporarily
        // TODO: Add getNegotiationsByBuyer to negotiationService
        const negotiationsResponse = await negotiationService.getNegotiationsByFarmer(user._id || user.id);
        const activeNegs = negotiationsResponse.negotiations.filter((n: any) => n.status === 'active').length;
        setActiveNegotiations(activeNegs);

      } catch (err: any) {
        console.error('Failed to fetch dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user._id, user.id]);

  const dashboardStats = [
    {
      title: 'My Crop Requests',
      value: buyerListings.length.toString(),
      icon: ShoppingCart,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10'
    },
    {
      title: 'Active Contracts',
      value: activeContracts.toString(),
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10'
    },
    {
      title: 'Active Negotiations',
      value: activeNegotiations.toString(),
      icon: MessageSquare,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500/10'
    },
    {
      title: 'Total Spent',
      value: `₹${totalSpent.toLocaleString('en-IN')}`,
      icon: DollarSign,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="bg-card border-b border-border p-4 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sprout className="h-8 w-8 text-primary" />
            <h1 className="text-xl font-bold text-foreground">AgriContract</h1>
            <Badge variant="outline" className="ml-2">Buyer</Badge>
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            <Button variant="ghost" className="text-primary font-semibold">
              Dashboard
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('browse-farmer-listings')}
            >
              Browse Products
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('my-buyer-listings')}
            >
              My Requests
            </Button>
            <Button
              variant="ghost"
              className="text-muted-foreground hover:text-primary"
              onClick={() => onNavigate('buyer-contracts')}
            >
              Contracts
            </Button>
          </nav>

          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleTheme}
              className="text-muted-foreground hover:text-primary"
            >
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onNavigate('profile')}
              className="text-muted-foreground hover:text-primary"
            >
              <User className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="text-muted-foreground hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Welcome Section */}
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-foreground">
            Welcome back, {user.name}! 🌾
          </h2>
          <p className="text-muted-foreground">
            Discover quality crops, manage your requests, and track your purchases
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {dashboardStats.map((stat, index) => (
              <Card key={index} className="bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.bgColor}`}>
                      <stat.icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
          <CardHeader>
            <CardTitle className="text-foreground">Quick Actions</CardTitle>
            <CardDescription>Get started with these common tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button
                className="bg-primary hover:bg-primary/90 text-primary-foreground h-auto py-4"
                onClick={() => onNavigate('browse-farmer-listings')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Search className="h-6 w-6" />
                  <span className="font-semibold">Browse Products</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground h-auto py-4"
                onClick={() => onNavigate('create-buyer-listing')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <Plus className="h-6 w-6" />
                  <span className="font-semibold">Post Crop Request</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground h-auto py-4"
                onClick={() => onNavigate('my-buyer-listings')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <ShoppingCart className="h-6 w-6" />
                  <span className="font-semibold">My Requests</span>
                </div>
              </Button>
              <Button
                variant="outline"
                className="border-border hover:bg-accent hover:text-accent-foreground h-auto py-4"
                onClick={() => onNavigate('buyer-contracts')}
              >
                <div className="flex flex-col items-center space-y-2">
                  <FileText className="h-6 w-6" />
                  <span className="font-semibold">View Contracts</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Crop Requests */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Your Recent Crop Requests</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('my-buyer-listings')}
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Manage your crop purchase requests and received offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            {buyerListings.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Crop Requests Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Post your first crop request to receive offers from farmers
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => onNavigate('create-buyer-listing')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Your First Request
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {buyerListings.map((listing) => (
                  <Card
                    key={listing._id}
                    className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('buyer-listing-details', listing)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {listing.cropName}
                            </h3>
                            <Badge
                              variant={
                                listing.status === 'active'
                                  ? 'default'
                                  : listing.status === 'in-negotiation'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {listing.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">Quantity:</span> {listing.quantity} {listing.unit}
                            </p>
                            <p>
                              <span className="font-medium">Budget:</span> ₹
                              {listing.preferredPrice.toLocaleString('en-IN')}/{listing.preferredPriceUnit}
                            </p>
                            <p>
                              <span className="font-medium">Location:</span> {listing.deliveryLocation.city},{' '}
                              {listing.deliveryLocation.state}
                            </p>
                            <p>
                              <span className="font-medium">Delivery Date:</span>{' '}
                              {format(new Date(listing.preferredDeliveryDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MessageSquare className="h-4 w-4" />
                            <span>{listing.offers?.length || 0} offers</span>
                          </div>
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                            {listing.category}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Contracts */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Contracts</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onNavigate('buyer-contracts')}
                className="border-border hover:bg-accent hover:text-accent-foreground"
              >
                View All
              </Button>
            </CardTitle>
            <CardDescription>
              Track your active and completed purchase contracts
            </CardDescription>
          </CardHeader>
          <CardContent>
            {recentContracts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  No Contracts Yet
                </h3>
                <p className="text-muted-foreground mb-4">
                  Browse products and start negotiations to create contracts
                </p>
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => onNavigate('browse-farmer-listings')}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Browse Products
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentContracts.map((contract) => (
                  <Card
                    key={contract._id}
                    className="bg-card border-border hover:border-primary/50 transition-all cursor-pointer"
                    onClick={() => onNavigate('contract-details', contract)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold text-foreground text-lg">
                              {contract.cropName || 'Contract'}
                            </h3>
                            <Badge
                              variant={
                                contract.status === 'active'
                                  ? 'default'
                                  : contract.status === 'completed'
                                  ? 'secondary'
                                  : 'outline'
                              }
                            >
                              {contract.status}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <p>
                              <span className="font-medium">Quantity:</span> {contract.quantity}{' '}
                              {contract.unit}
                            </p>
                            <p>
                              <span className="font-medium">Total Price:</span> ₹
                              {contract.totalValue.toLocaleString('en-IN')}
                            </p>
                            <p>
                              <span className="font-medium">Delivery:</span>{' '}
                              {format(new Date(contract.deliveryDate), 'MMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 text-sm">
                            {contract.status === 'active' ? (
                              <Clock className="h-4 w-4 text-yellow-500" />
                            ) : (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            )}
                          </div>
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
