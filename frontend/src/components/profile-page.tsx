import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit,
  Save,
  Star,
  Award,
  TrendingUp,
  Calendar,
  DollarSign,
  Package
} from 'lucide-react';

interface ProfilePageProps {
  user: any;
  onNavigate: (page: string, data?: any) => void;
}

export function ProfilePage({ user, onNavigate }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    location: 'California, USA',
    bio: user.userType === 'farmer' ? 
      'Experienced organic farmer with 15+ years in sustainable agriculture.' :
      'Agricultural procurement specialist focused on quality produce sourcing.'
  });

  const handleSave = () => {
    // In a real app, this would update the user profile in the backend
    setIsEditing(false);
  };

  const stats = user.userType === 'farmer' ? [
    { label: 'Products Listed', value: '24', icon: Package, color: 'text-blue-500' },
    { label: 'Contracts Signed', value: '18', icon: Award, color: 'text-green-500' },
    { label: 'Total Revenue', value: '$45,200', icon: DollarSign, color: 'text-accent' },
    { label: 'Years Farming', value: '15', icon: Calendar, color: 'text-purple-500' }
  ] : [
    { label: 'Active Contracts', value: '12', icon: Package, color: 'text-blue-500' },
    { label: 'Completed Deals', value: '28', icon: Award, color: 'text-green-500' },
    { label: 'Total Spent', value: '$32,800', icon: DollarSign, color: 'text-accent' },
    { label: 'Years Buying', value: '8', icon: Calendar, color: 'text-purple-500' }
  ];

  const recentActivity = [
    {
      id: 1,
      type: 'contract',
      title: 'Contract signed for Organic Tomatoes',
      date: '2024-01-15',
      amount: '$2,500'
    },
    {
      id: 2,
      type: 'product',
      title: user.userType === 'farmer' ? 'Listed Premium Rice' : 'Purchased Premium Rice',
      date: '2024-01-12',
      amount: '$4,200'
    },
    {
      id: 3,
      type: 'payment',
      title: 'Payment received from buyer',
      date: '2024-01-10',
      amount: '$1,800'
    }
  ];

  const reviews = [
    {
      id: 1,
      reviewer: user.userType === 'farmer' ? 'Sarah Mitchell (Buyer)' : 'John Smith (Farmer)',
      rating: 5,
      comment: 'Excellent quality produce and timely delivery. Highly recommended!',
      date: '2024-01-10'
    },
    {
      id: 2,
      reviewer: user.userType === 'farmer' ? 'Mike Johnson (Buyer)' : 'Maria Garcia (Farmer)',
      rating: 4,
      comment: 'Great communication and professional service throughout the contract.',
      date: '2024-01-05'
    }
  ];

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
            <h1 className="text-xl font-bold text-foreground">Profile</h1>
            <p className="text-sm text-muted-foreground">
              Manage your account information
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-card border-border">
              <CardContent className="p-6 text-center">
                <div className="space-y-4">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
                    <Badge 
                      variant="secondary" 
                      className={`mt-2 ${user.userType === 'farmer' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'}`}
                    >
                      {user.userType === 'farmer' ? 'Verified Farmer' : 'Verified Buyer'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">(4.9)</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground">
                    {editedUser.bio}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-sm">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {stats.slice(0, 2).map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <stat.icon className={`h-4 w-4 ${stat.color}`} />
                      <span className="text-sm text-muted-foreground">{stat.label}</span>
                    </div>
                    <span className="font-semibold text-foreground">{stat.value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="activity">Activity</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
                {/* Performance Stats */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {stats.map((stat, index) => (
                        <div key={index} className="text-center space-y-2">
                          <div className="mx-auto w-12 h-12 bg-input-background rounded-lg flex items-center justify-center">
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                          </div>
                          <div>
                            <p className="text-lg font-bold text-foreground">{stat.value}</p>
                            <p className="text-xs text-muted-foreground">{stat.label}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-center justify-between p-3 bg-input-background rounded-lg border border-border">
                          <div>
                            <p className="font-medium text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-semibold text-accent">{activity.amount}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Profile Tab */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                      className="border-border hover:bg-accent hover:text-accent-foreground"
                    >
                      {isEditing ? (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </>
                      ) : (
                        <>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Full Name</Label>
                        {isEditing ? (
                          <Input
                            value={editedUser.name}
                            onChange={(e) => setEditedUser({...editedUser, name: e.target.value})}
                            className="bg-input-background border-border"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 bg-input-background rounded border border-border">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{editedUser.name}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Email</Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={editedUser.email}
                            onChange={(e) => setEditedUser({...editedUser, email: e.target.value})}
                            className="bg-input-background border-border"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 bg-input-background rounded border border-border">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{editedUser.email}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Phone</Label>
                        {isEditing ? (
                          <Input
                            type="tel"
                            value={editedUser.phone}
                            onChange={(e) => setEditedUser({...editedUser, phone: e.target.value})}
                            className="bg-input-background border-border"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 bg-input-background rounded border border-border">
                            <Phone className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{editedUser.phone}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-foreground">Location</Label>
                        {isEditing ? (
                          <Input
                            value={editedUser.location}
                            onChange={(e) => setEditedUser({...editedUser, location: e.target.value})}
                            className="bg-input-background border-border"
                          />
                        ) : (
                          <div className="flex items-center space-x-2 p-2 bg-input-background rounded border border-border">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="text-foreground">{editedUser.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-foreground">Bio</Label>
                      {isEditing ? (
                        <Textarea
                          value={editedUser.bio}
                          onChange={(e) => setEditedUser({...editedUser, bio: e.target.value})}
                          className="bg-input-background border-border"
                          rows={3}
                        />
                      ) : (
                        <div className="p-3 bg-input-background rounded border border-border">
                          <p className="text-foreground">{editedUser.bio}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Activity Tab */}
              <TabsContent value="activity" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Activity History</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.concat([
                        {
                          id: 4,
                          type: 'negotiation',
                          title: 'Started negotiation for Fresh Wheat',
                          date: '2024-01-08',
                          amount: '$3,200'
                        },
                        {
                          id: 5,
                          type: 'contract',
                          title: 'Contract completed for Organic Carrots',
                          date: '2024-01-05',
                          amount: '$1,650'
                        }
                      ]).map((activity) => (
                        <div key={activity.id} className="flex items-center space-x-4 p-4 bg-input-background rounded-lg border border-border">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{activity.title}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(activity.date).toLocaleDateString()}
                            </p>
                          </div>
                          <span className="font-semibold text-accent">{activity.amount}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle>Reviews & Ratings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4 p-4 bg-input-background rounded-lg border border-border">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-foreground">4.9</div>
                        <div className="flex items-center justify-center space-x-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Average Rating</p>
                      </div>
                      <Separator orientation="vertical" className="h-16 bg-border" />
                      <div>
                        <p className="text-lg font-semibold text-foreground">24 Reviews</p>
                        <p className="text-sm text-muted-foreground">From verified contracts</p>
                      </div>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <div key={review.id} className="p-4 bg-input-background rounded-lg border border-border">
                          <div className="flex items-center justify-between mb-2">
                            <p className="font-medium text-foreground">{review.reviewer}</p>
                            <div className="flex items-center space-x-1">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-3 w-3 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{review.comment}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(review.date).toLocaleDateString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
}