# 🌾 AgriContract - Contract Farming Platform

> **Connecting farmers and buyers for a sustainable agricultural future**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Visit_Website-green?style=for-the-badge)](https://agri-contract.vercel.app/)
[![Backend API](https://img.shields.io/badge/🔗_Backend_API-Live_Server-blue?style=for-the-badge)](https://agricontract-u71i.onrender.com/)
[![GitHub](https://img.shields.io/badge/📚_GitHub-Repository-black?style=for-the-badge)](https://github.com/ArchitSingh07/AgriContract)

---

## 🔗 **Quick Access**

- **🌐 Live Website**: [https://agri-contract.vercel.app/](https://agri-contract.vercel.app/)
- **🔧 Backend API**: [https://agricontract-u71i.onrender.com/](https://agricontract-u71i.onrender.com/)
- **📖 API Documentation**: [Backend API Endpoints](https://agricontract-u71i.onrender.com/)

---

## 🎯 **Project Overview**

A comprehensive digital platform that revolutionizes agricultural trade by facilitating secure contract farming agreements between farmers and buyers, providing market stability and reducing agricultural risks.

**Background**: Farmers often face uncertainties in market access, leading to fluctuating incomes and unpredictable market conditions. Contract farming provides stability by ensuring farmers have guaranteed buyers for their produce.

**Solution**: AgriContract is a full-stack MERN application that connects farmers with potential buyers through an intuitive online marketplace, offering comprehensive tools for contract management, transparent price negotiation, and secure payment processing, thereby enhancing income stability and reducing market risks.

---

## ✨ **Key Features**

### 🚀 **Platform Capabilities**
- **🔄 Real-time Communication** - Direct messaging and negotiation tools between farmers and buyers
- **📋 Digital Contract Management** - Secure, legally-binding digital contracts with automated enforcement
- **💰 Transparent Price Negotiation** - Fair and transparent pricing through built-in negotiation system
- **🔒 Secure Payment Processing** - Guaranteed timely payments with escrow services ensuring financial security
- **📊 Market Analytics** - Real-time market insights and pricing data
- **✅ User Verification** - Verified farmer and buyer profiles for trusted transactions

### 👨‍🌾 **For Farmers**
- ✅ List agricultural products with detailed specifications on the marketplace
- ✅ Connect with verified buyers directly without middlemen
- ✅ Negotiate contracts and pricing transparently with market insights
- ✅ Secure guaranteed payments through escrow system
- ✅ Manage contracts digitally with legal protection and tracking
- ✅ Reduce market risks with predictable income streams

### 🏢 **For Buyers**
- ✅ Browse fresh agricultural products from verified farmers
- ✅ Access quality produce directly from source with traceability
- ✅ Negotiate terms, quantities, and delivery schedules transparently
- ✅ Ensure product quality and freshness standards through verification
- ✅ Secure contract agreements with automated enforcement mechanisms
- ✅ Build long-term relationships with reliable suppliers

---

## 🛠️ **Technology Stack**

### **Frontend** 
- **⚛️ React 18.3.1** - Modern UI library with TypeScript
- **⚡ Vite 6.3.5** - Lightning-fast build tool and development server
- **🎨 Tailwind CSS** - Utility-first CSS framework with custom design system
- **🧩 Radix UI** - Accessible, unstyled UI primitives
- **🎯 Lucide React** - Beautiful and consistent icon library
- **📱 Responsive Design** - Mobile-first approach for all devices

### **Backend**
- **🟢 Node.js** - JavaScript runtime environment
- **🚀 Express.js** - Fast, unopinionated web framework
- **🍃 MongoDB** - NoSQL database with Mongoose ODM
- **🔐 JWT Authentication** - Secure token-based authentication
- **🛡️ bcrypt** - Password hashing and security
- **🌐 CORS** - Cross-origin resource sharing enabled

### **Deployment & DevOps**
- **🚀 Frontend**: Deployed on **Vercel** - [https://agri-contract.vercel.app/](https://agri-contract.vercel.app/)
- **⚙️ Backend**: Deployed on **Render** - [https://agricontract-u71i.onrender.com/](https://agricontract-u71i.onrender.com/)
- **💾 Database**: MongoDB Atlas (Cloud)
- **🔧 CI/CD**: Automated deployment from GitHub

---

## 🎨 **Design Features**

- **🌙 Dark/Light Theme**: Complete theme switching with proper contrast ratios
- **📱 Responsive Design**: Mobile-first approach optimized for all devices
- **♿ Accessibility**: Built with Radix UI for keyboard navigation and screen readers
- **🎯 Modern UI**: Clean, professional interface with smooth animations
- **🔧 Component Library**: Reusable UI components following design system principles
- **⚡ Performance**: Optimized loading and rendering for smooth user experience

---

## 🚀 **Getting Started**

### **Prerequisites**
- Node.js (v18 or higher)
- npm or yarn package manager
- Git for version control

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/ArchitSingh07/AgriContract.git
   cd AgriContract
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Setup Backend** 
   ```bash
   cd backend
   npm install
   
   # Create .env file with your MongoDB URI and JWT secret
   cp .env.example .env
   # Edit .env with your actual values
   
   npm start
   ```

4. **Access the Application**
   - **Frontend**: `http://localhost:3000`
   - **Backend**: `http://localhost:5000`
   - **Live Demo**: [https://agri-contract.vercel.app/](https://agri-contract.vercel.app/)

### **Available Scripts**

#### Frontend
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally

#### Backend  
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-restart

---

## 📁 **Project Structure**

```
AgriContract/
├── 📁 frontend/                 # React + TypeScript frontend
│   ├── 📁 src/
│   │   ├── 📁 components/       # Reusable UI components
│   │   │   ├── 📁 ui/          # Base UI components (Button, Card, etc.)
│   │   │   ├── 📄 farmer-dashboard.tsx
│   │   │   ├── 📄 buyer-dashboard.tsx
│   │   │   ├── 📄 product-details.tsx
│   │   │   ├── 📄 negotiation-chat.tsx
│   │   │   └── 📄 contract-finalization.tsx
│   │   ├── 📁 services/         # API service functions
│   │   ├── 📁 types/           # TypeScript type definitions
│   │   └── 📁 lib/             # Utility functions and API client
│   ├── 📄 package.json
│   └── 📄 vite.config.ts
├── 📁 backend/                  # Node.js + Express backend
│   ├── 📁 config/              # Database and app configuration
│   ├── 📁 models/              # MongoDB schemas and models
│   ├── 📁 routes/              # API route handlers
│   ├── 📁 middleware/          # Authentication and validation
│   ├── 📄 server.js            # Main server file
│   └── 📄 package.json
├── 📄 README.md                # Project documentation
└── 📄 DEPLOYMENT_GUIDE.md      # Deployment instructions
```

---

## 🔄 **How It Works**

### 1. **Connect** 🤝
Farmers list their crops with detailed specifications, while buyers browse available products on our secure marketplace with advanced filtering and search capabilities.

### 2. **Negotiate** 💬
Use our built-in negotiation tools to discuss prices, quantities, delivery terms, and quality standards transparently with real-time messaging and contract drafting.

### 3. **Secure & Deliver** ✅
Finalize contracts digitally with legal protection, track deliveries, and enjoy secure payments through our escrow system upon successful completion.

---

## 🌟 **Benefits**

- **📈 Market Stability** - Reduce market risks with guaranteed buyers and predictable income streams
- **🔍 Quality Assurance** - Connect with verified farmers and ensure product quality standards through our verification system  
- **💰 Enhanced Income** - Improve income stability through long-term contract agreements and fair pricing
- **🤝 Direct Trade** - Eliminate middlemen and build direct relationships between farmers and buyers
- **📊 Data Insights** - Access market analytics and pricing trends for informed decision-making
- **🔐 Secure Transactions** - Complete protection through verified users and escrow payment system

---

## 📱 **Features Implemented**

### ✅ **Current Features**
- 🔐 User authentication with role-based access (Farmer/Buyer)
- 📝 Product listing with detailed specifications and images
- 🔍 Advanced product search and filtering capabilities
- 💬 Real-time negotiation chat with contract drafting
- 📋 Digital contract creation and management
- 👤 Comprehensive profile management
- 💳 Payment processing interface with secure transactions
- 🌙 Dark/Light theme support with system preference detection
- 📱 Fully responsive design for mobile and desktop
- 📊 Dashboard analytics and statistics
- 🔔 Real-time notifications and updates

### 🔜 **Upcoming Features**
- 📱 Native mobile applications for iOS and Android
- 🔗 Blockchain integration for enhanced transparency
- 🤖 AI-powered farmer-buyer matching algorithms
- 📈 Advanced analytics dashboard with market insights
- 🌍 Multi-language support for different regions
- 🌤️ Weather data integration for better planning
- 📄 Document upload and verification system
- 📧 Email/SMS notification system
- 🏆 Rating and review system for users
- 💱 Multi-currency support

---

## 🤝 **Contributing**

We welcome contributions! Please feel free to submit a Pull Request.

1. **Fork the repository**
2. **Create your feature branch** (`git checkout -b feature/AmazingFeature`)
3. **Commit your changes** (`git commit -m 'Add some AmazingFeature'`)
4. **Push to the branch** (`git push origin feature/AmazingFeature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow TypeScript best practices
- Write clean, commented code
- Test your changes thoroughly
- Update documentation when needed
- Follow the existing code style

---

## 📝 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🔮 **Future Enhancements**

- **🤖 AI Integration** - Smart matching algorithms and predictive analytics
- **📱 Mobile Apps** - Native applications for iOS and Android
- **🔗 Blockchain** - Enhanced security and transparency through blockchain technology
- **🌍 Global Expansion** - Multi-language and multi-currency support
- **📊 Advanced Analytics** - Comprehensive market insights and business intelligence
- **🌤️ Weather Integration** - Weather data for better agricultural planning
- **🏆 Gamification** - Rewards and achievements for platform engagement
- **🎯 Machine Learning** - Personalized recommendations and price predictions

---

## 📞 **Support & Contact**

- **🌐 Website**: [https://agri-contract.vercel.app/](https://agri-contract.vercel.app/)
- **📧 Email**: support@agricontract.com
- **💬 GitHub Issues**: [Report a Bug](https://github.com/ArchitSingh07/AgriContract/issues)
- **📖 Documentation**: [API Docs](https://agricontract-u71i.onrender.com/)

---

## 🙏 **Acknowledgments**

- 🌾 Thanks to all farmers and buyers who inspired this platform
- 🎨 Radix UI for excellent accessibility-first components
- 🎯 Tailwind CSS for the utility-first CSS framework
- ✨ Lucide for beautiful and consistent icons
- 🎨 Original Figma design inspiration: [Contract Farming Platform](https://www.figma.com/design/9n0bIGAvVCuwb3ycHVn2Cb/Contract-Farming-Platform)

---

**Built with ❤️ for the agricultural community**

> "Empowering farmers, connecting markets, transforming agriculture"

[![Made with Love](https://img.shields.io/badge/Made_with-❤️-red.svg)](https://agri-contract.vercel.app/)
[![GitHub Stars](https://img.shields.io/github/stars/ArchitSingh07/AgriContract?style=social)](https://github.com/ArchitSingh07/AgriContract)
[![GitHub Forks](https://img.shields.io/github/forks/ArchitSingh07/AgriContract?style=social)](https://github.com/ArchitSingh07/AgriContract)