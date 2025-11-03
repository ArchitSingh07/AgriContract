import { useState, useEffect } from "react";
import { UserTypeSelection } from "./components/user-type-selection";
import { LoginPage } from "./components/login-page";
import { Dashboard } from "./components/dashboard";
import { FarmerDashboard } from "./components/farmer-dashboard";
import { BuyerDashboard } from "./components/buyer-dashboard";
import { ProductDetails } from "./components/product-details";
import { NegotiationChat } from "./components/negotiation-chat";
import { FarmerChat } from "./components/farmer-chat";
import { BuyerChat } from "./components/buyer-chat";
import { ContractFinalization } from "./components/contract-finalization";
import { ContractView } from "./components/contract-view";
import { ContractDetails } from "./components/contract-details";
import { PaymentPage } from "./components/payment-page";
import { ProfilePage } from "./components/profile-page";
import { ListProduct } from "./components/list-product";
import { EditProduct } from "./components/edit-product";
import { MyProducts } from "./components/my-products";
import { ProductsPage } from "./components/products-page";
import { ContractsPage } from "./components/contracts-page";
import { FarmerContracts } from "./components/farmer-contracts";
import { BuyerContracts } from "./components/buyer-contracts";
import BuyerRequests from "./components/buyer-requests";
import BuyerListingDetails from "./components/buyer-listing-details";
import CreateBuyerListing from "./components/create-buyer-listing";
import MyBuyerListings from "./components/my-buyer-listings";
import { BrowseFarmerListings } from "./components/browse-farmer-listings";
import { FarmerListingDetails } from "./components/farmer-listing-details";

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    "user-type-selection",
  );
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedUserType, setSelectedUserType] = useState<
    "farmer" | "buyer" | null
  >(null);
  const [pageData, setPageData] = useState(null);
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Apply theme to document
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  const handleSelectUserType = (
    userType: "farmer" | "buyer",
  ) => {
    setSelectedUserType(userType);
    setCurrentPage("login");
  };

  const handleLogin = (
    _userType: "farmer" | "buyer",
    userData: any,
  ) => {
    setCurrentUser(userData);
    // Redirect to appropriate dashboard based on user type
    const userRole = userData.userType?.toLowerCase() || userData.role?.toLowerCase();
    if (userRole === 'farmer') {
      setCurrentPage("farmer-dashboard");
    } else {
      setCurrentPage("buyer-dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setSelectedUserType(null);
    setCurrentPage("user-type-selection");
    setPageData(null);
  };

  const handleBackToUserTypeSelection = () => {
    setCurrentPage("user-type-selection");
    setSelectedUserType(null);
  };

  const handleNavigate = (page: string, data?: any) => {
    setCurrentPage(page);
    setPageData(data);
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  if (currentPage === "user-type-selection") {
    return (
      <UserTypeSelection
        onSelectUserType={handleSelectUserType}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (currentPage === "login") {
    return (
      <LoginPage
        onLogin={handleLogin}
        userType={selectedUserType!}
        onBack={handleBackToUserTypeSelection}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  if (!currentUser) {
    return (
      <UserTypeSelection
        onSelectUserType={handleSelectUserType}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  switch (currentPage) {
    case "dashboard":
      return (
        <Dashboard
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    case "farmer-dashboard":
      return (
        <FarmerDashboard
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    case "buyer-dashboard":
      return (
        <BuyerDashboard
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
    case "list-product":
      return (
        <ListProduct
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "edit-product":
      return (
        <EditProduct
          product={pageData as any}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />
      );
    case "my-products":
      return (
        <MyProducts
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "products":
      return (
        <ProductsPage
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "contracts":
      return (
        <ContractsPage
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "farmer-contracts":
      return (
        <FarmerContracts
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "buyer-contracts":
      return (
        <BuyerContracts
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "buyer-requests":
      return (
        <BuyerRequests
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "buyer-listing-details":
      console.log('App.tsx - buyer-listing-details pageData:', pageData);
      console.log('App.tsx - Extracted listingId:', (pageData as any)?.listingId || (pageData as any));
      return (
        <BuyerListingDetails
          listingId={(pageData as any)?.listingId || (pageData as any)}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "create-buyer-listing":
      return (
        <CreateBuyerListing
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "my-buyer-listings":
      return (
        <MyBuyerListings
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "browse-farmer-listings":
      return (
        <BrowseFarmerListings
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "farmer-listing-details":
      return (
        <FarmerListingDetails
          product={pageData as any}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "product-details":
      return (
        <ProductDetails
          product={pageData as any}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "negotiation":
      return (
        <NegotiationChat
          negotiationData={pageData}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "farmer-chat":
      return (
        <FarmerChat
          negotiationId={(pageData as any)?.negotiationId}
          productId={(pageData as any)?.productId}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "buyer-chat":
      return (
        <BuyerChat
          negotiationId={(pageData as any)?.negotiationId || (pageData as any)}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "contract-finalization":
      return (
        <ContractFinalization
          contractData={pageData}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "contract-view":
      return (
        <ContractView
          contractData={pageData}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "contract-details":
      return (
        <ContractDetails
          contract={pageData as any}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "payment":
      return (
        <PaymentPage
          paymentData={pageData}
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "profile":
      return (
        <ProfilePage
          user={currentUser}
          onNavigate={handleNavigate}
        />
      );
    case "completion":
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <svg
                className="h-8 w-8 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Contract Completed!
              </h2>
              <p className="text-muted-foreground">
                Your contract has been successfully executed and
                payment processed. Both parties will receive
                email confirmations with all the details.
              </p>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => handleNavigate("dashboard")}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-2 px-4 rounded-lg font-medium"
              >
                Return to Dashboard
              </button>
              <button
                onClick={() => handleNavigate("profile")}
                className="w-full border border-border hover:bg-accent hover:text-accent-foreground py-2 px-4 rounded-lg font-medium text-foreground"
              >
                View Profile
              </button>
            </div>
          </div>
        </div>
      );
    default:
      return (
        <Dashboard
          user={currentUser}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
      );
  }
}