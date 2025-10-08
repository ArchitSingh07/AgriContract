import { useState, useEffect } from "react";
import { LandingPage } from "./components/landing-page";
import { UserTypeSelection } from "./components/user-type-selection";
import { LoginPage } from "./components/login-page";
import { Dashboard } from "./components/dashboard";
import { ProductDetails } from "./components/product-details";
import { NegotiationChat } from "./components/negotiation-chat";
import { ContractFinalization } from "./components/contract-finalization";
import { ContractView } from "./components/contract-view";
import { PaymentPage } from "./components/payment-page";
import { ProfilePage } from "./components/profile-page";

export default function App() {
  const [currentPage, setCurrentPage] = useState(
    "landing",
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
    userType: "farmer" | "buyer",
    userData: any,
  ) => {
    setCurrentUser(userData);
    setCurrentPage("dashboard");
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
    case "product-details":
      return (
        <ProductDetails
          product={pageData}
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