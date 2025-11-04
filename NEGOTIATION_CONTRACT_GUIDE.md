# Negotiation & Contract System Guide

## Overview
The AgriContract platform now has a fully functional bidirectional negotiation and contract generation system that works for both farmers and buyers.

## How It Works

### For Farmers:

#### 1. **Receive Negotiations from Buyers**
- When a buyer is interested in your product, they can start a negotiation
- You'll see negotiations in your dashboard under "Active Negotiations"
- Navigate to: Dashboard → Browse Products → View Product → See Negotiations

#### 2. **Initiate Negotiations with Buyers**
- Browse buyer requests: Dashboard → Browse Buyer Requests
- Find a request you're interested in
- Click "View Details & Send Offer"
- Fill in your offer details (price, quantity, delivery date)
- Click "Send Offer" to start negotiation

#### 3. **Chat and Negotiate**
- Access your negotiations from farmer dashboard
- Send messages and counter-offers
- Include offer details (price, quantity, delivery date, terms)
- Real-time messaging with 5-second polling

#### 4. **Create Contract**
- Once you've reached an agreement in the chat
- Click "Create Contract" button in the negotiation chat
- Fill in the contract details:
  - Agreed price
  - Quantity
  - Delivery date and location
  - Terms and payment terms
- Submit to create the contract
- Contract is auto-signed by you

#### 5. **View & Manage Contracts**
- Dashboard → View Contracts
- See all your contracts (pending, active, completed)
- View contract details
- Mark contracts as completed

### For Buyers:

#### 1. **Browse Farmer Products**
- Dashboard → Browse Products
- Filter by category, location, price
- Find products you want to buy

#### 2. **Start Negotiation**
- Click on a product to view details
- Click "Start Negotiation"
- Send initial message with your offer
- Include offer details

#### 3. **Post Crop Requests**
- Dashboard → Post Crop Request
- Fill in what crop you need
- Specify quantity, preferred price, delivery location
- Farmers can see your request and send offers

#### 4. **Receive Offers from Farmers**
- Dashboard → My Requests
- View your buyer listings
- See offers from interested farmers
- Click "View" to see offers and start negotiation

#### 5. **Chat and Negotiate**
- Similar to farmer chat
- Send messages and counter-offers
- Negotiate price, quantity, delivery terms

#### 6. **Review and Sign Contracts**
- When farmer creates a contract, you'll see it
- Dashboard → View Contracts
- Review contract details
- Click "Sign Contract" to accept
- Once both parties sign, contract becomes active

#### 7. **Manage Contracts**
- View all your contracts
- Track delivery dates
- Mark contracts as completed
- View contract statistics

## API Endpoints

### Negotiations
- `POST /api/negotiations/start` - Start new negotiation
- `POST /api/negotiations/message` - Send message
- `GET /api/negotiations/my-negotiations` - Get all your negotiations
- `GET /api/negotiations/:id` - Get specific negotiation
- `GET /api/negotiations/product/:productId` - Get negotiations for a product
- `GET /api/negotiations/buyer-listing/:listingId` - Get negotiations for buyer listing
- `PUT /api/negotiations/:id/status` - Update negotiation status

### Contracts
- `POST /api/contracts/create` - Create new contract
- `GET /api/contracts/farmer/:id` - Get farmer's contracts
- `GET /api/contracts/buyer/:id` - Get buyer's contracts
- `GET /api/contracts/:id` - Get specific contract
- `PUT /api/contracts/:id/sign` - Sign a contract
- `PUT /api/contracts/:id/status` - Update contract status
- `GET /api/contracts/stats/:userId` - Get contract statistics

## Features

### Negotiation System
✅ Real-time chat with message history
✅ Offer details (price, quantity, delivery date, terms)
✅ Support for both product listings and buyer requests
✅ Auto-polling for new messages (5-second intervals)
✅ Status tracking (active, accepted, rejected, finalized)
✅ Both parties can initiate negotiations

### Contract System
✅ Auto-generation from negotiations
✅ Digital signatures (both parties must sign)
✅ Contract status tracking (pending, active, completed, cancelled)
✅ Total value calculation
✅ Delivery date and location management
✅ Payment terms specification
✅ Contract statistics and analytics
✅ Works for both farmer products and buyer requests

## Workflow Example

### Scenario 1: Buyer Initiates (Farmer Product)
1. Buyer browses farmer listings
2. Buyer clicks on a product → "Start Negotiation"
3. Buyer sends initial offer
4. Farmer receives notification → Opens chat
5. Both parties negotiate via chat
6. Agreement reached → Farmer clicks "Create Contract"
7. Contract created and auto-signed by farmer
8. Buyer reviews contract → Signs it
9. Contract becomes active
10. Both track delivery and completion

### Scenario 2: Farmer Initiates (Buyer Request)
1. Buyer posts crop request (I need 100kg wheat)
2. Farmer sees request → "View Details & Send Offer"
3. Farmer sends offer with price and terms
4. Negotiation starts
5. Both parties chat and negotiate
6. Agreement reached → Either party creates contract
7. Both sign the contract
8. Contract becomes active

## Database Models

### Negotiation
- listingType: 'product' | 'buyer-request'
- productId or buyerListingId
- farmerId, buyerId
- messages array (with sender, message, offerDetails)
- status
- lastActivity timestamp

### Contract
- listingType: 'product' | 'buyer-request'
- productId or buyerListingId
- farmerId, buyerId
- negotiationId (optional reference)
- cropName, agreedPrice, quantity, unit
- deliveryDate, deliveryLocation
- terms, paymentTerms
- signedByFarmer, signedByBuyer (boolean)
- farmerSignDate, buyerSignDate
- status, totalValue

## Testing the Features

1. **Create two users:**
   - One farmer account
   - One buyer account

2. **Test Flow 1 - Farmer Product:**
   - Farmer: Create a product listing
   - Buyer: Browse products → Start negotiation
   - Both: Chat and send offers
   - Farmer: Create contract
   - Buyer: Sign contract
   - Both: View in contracts page

3. **Test Flow 2 - Buyer Request:**
   - Buyer: Create crop request
   - Farmer: Browse requests → Send offer
   - Both: Negotiate
   - Either: Create contract
   - Both: Sign and track

## Troubleshooting

- **Negotiation not showing:** Check that backend server is running on port 5000
- **Messages not updating:** The chat polls every 5 seconds, wait a moment
- **Can't create contract:** Both users must have agreed on terms in chat
- **Contract not active:** Both parties must sign for it to become active
- **ID errors:** Make sure IDs are being converted to strings with `String(id)`

## Future Enhancements (Optional)
- WebSocket for real-time messaging
- Email notifications for new messages/contracts
- Contract templates
- Dispute resolution system
- Payment integration
- Document upload for contracts
- Contract renewal system
