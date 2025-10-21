# JouleAI Backend API Documentation

## Overview
This is the backend API for JouleAI, an AI-powered e-commerce store builder platform. The backend is built with Node.js, Express, and MongoDB (Mongoose).

---

## Table of Contents
1. [Data Models](#data-models)
2. [API Routes](#api-routes)
3. [Middleware](#middleware)
4. [Architecture Overview](#architecture-overview)

---

## Data Models

### 1. User Model (`models/User.js`)

**Purpose:** Manages user authentication and account information.

**Schema Structure:**
```javascript
{
  name: String,              // Required, max 50 chars
  email: String,             // Required, unique, validated email format
  passwordHash: String,      // Required, auto-hashed with bcrypt (salt rounds: 12)
  timestamps: true           // createdAt, updatedAt
}
```

**Key Features:**
- Password hashing with bcrypt (pre-save hook)
- Email validation with regex
- Password comparison method: `comparePassword(candidatePassword)`
- Automatic removal of `passwordHash` from JSON responses

**Indexes:**
- `email`: unique index

---

### 2. Store Model (`models/Store.js`)

**Purpose:** Represents an e-commerce store created by a user.

**Schema Structure:**
```javascript
{
  ownerId: ObjectId,           // Required, ref: 'User'
  storeName: String,           // Required, max 100 chars
  domain: String,              // Required, unique, lowercase, validated format
  description: String,         // Optional, max 500 chars
  isActive: Boolean,           // Default: true
  theme: Object,               // Store theme configuration
  layout: Object,              // Store layout structure
  currency: String,            // Default: 'USD'
  locale: String,              // Default: 'en-US'
  
  // AI-generated layout
  jsonLayout: Object,          // JSON structure for publishing
  
  // Publishing & Deployment
  publishedUrl: String,        // Vercel deployment URL
  vercelDeploymentId: String,  // Vercel deployment ID
  vercelProjectName: String,   // Vercel project name
  vercelAlias: String,         // Custom domain alias
  lastPublished: Date,         // Last publish timestamp
  
  // Approval & Theme
  approved: Boolean,           // Default: false
  chosenThemeId: String,       // Selected theme ID
  
  timestamps: true             // createdAt, updatedAt
}
```

**Key Features:**
- Domain format validation (lowercase, alphanumeric with hyphens/dots)
- Theme and layout stored as flexible objects
- Vercel integration for deployment tracking
- Support for both `layout` and `jsonLayout` (for backward compatibility)

**Indexes:**
- `ownerId`: indexed for fast user queries
- `domain`: unique, indexed for lookups

---

### 3. Product Model (`models/Product.js`)

**Purpose:** Represents products within a store.

**Schema Structure:**
```javascript
{
  storeId: ObjectId,           // Required, ref: 'Store'
  name: String,                // Required, max 150 chars
  description: String,         // Optional
  price: Number,               // Required, min: 0
  stock: Number,               // Required, min: 0, default: 0
  
  // Images (supports old and new formats)
  images: Mixed[],             // Array of strings OR objects {url, publicId}
  
  // Publishing status
  status: String,              // Enum: ['draft', 'published'], default: 'draft'
  publishedAt: Date,           // Timestamp when published
  
  timestamps: true             // createdAt, updatedAt
}
```

**Key Features:**
- Flexible image storage (backward compatible)
  - Old format: Array of URL strings
  - New format: Array of objects `{url, publicId, ...}`
- Product status lifecycle (draft → published)
- Custom validator for images array

**Indexes:**
- `storeId`: indexed for store queries
- `name`: indexed for search

---

### 4. Team Model (`models/Team.js`)

**Purpose:** Manages team/organization structures for collaboration.

**Schema Structure:**
```javascript
{
  name: String,              // Required, max 100 chars
  slug: String,              // Required, unique, lowercase, hyphenated
  ownerId: ObjectId,         // Required, ref: 'User'
  settings: Object,          // Team configuration settings
  timestamps: true           // createdAt, updatedAt
}
```

**Key Features:**
- URL-friendly slug validation (lowercase, hyphens only)
- Flexible settings object for team preferences
- Team ownership tracked via `ownerId`

**Indexes:**
- `slug`: unique index
- `ownerId`: indexed for owner queries

---

### 5. TeamMembership Model (`models/TeamMembership.js`)

**Purpose:** Links users to teams with specific roles.

**Schema Structure:**
```javascript
{
  teamId: ObjectId,          // Required, ref: 'Team'
  userId: ObjectId,          // Required, ref: 'User'
  role: String,              // Enum: ['owner', 'admin', 'member'], default: 'member'
  mfaEnabled: Boolean,       // Default: false
  invitedBy: ObjectId,       // Optional, ref: 'User'
  timestamps: true           // createdAt, updatedAt
}
```

**Key Features:**
- Role-based access control (owner > admin > member)
- MFA setting per membership
- Tracks who invited the member

**Indexes:**
- `{teamId, userId}`: compound unique index (prevents duplicate memberships)
- `{teamId, role}`: compound index for role-based queries

---

### 6. TeamInvite Model (`models/TeamInvite.js`)

**Purpose:** Manages pending team invitations.

**Schema Structure:**
```javascript
{
  teamId: ObjectId,          // Required, ref: 'Team'
  email: String,             // Required, lowercase, validated
  role: String,              // Enum: ['admin', 'member'], default: 'member'
  token: String,             // Required, unique, random hex (48 chars)
  invitedBy: ObjectId,       // Required, ref: 'User'
  expiresAt: Date,           // Default: 7 days from creation
  acceptedAt: Date,          // Null until accepted
  timestamps: true           // createdAt, updatedAt
}
```

**Key Features:**
- Secure token generation: `generateToken()` static method
- Automatic expiration (7 days)
- TTL index for auto-cleanup of expired invites
- Tracks acceptance status

**Indexes:**
- `{teamId, email}`: compound index for invite lookups
- `token`: unique index
- `expiresAt`: TTL index with partial filter (only unaccepted invites)

**Static Methods:**
- `TeamInvite.generateToken()`: Generates a secure random token

---

## API Routes

### Authentication Routes (`routes/auth.js`)
**Base Path:** `/api/auth`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/register` | Public | Register a new user |
| POST | `/login` | Public | Login and receive JWT token |
| GET | `/me` | Private | Get current user info |

**Request/Response Examples:**

**POST /api/auth/register**
```javascript
// Request
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepass123"
}

// Response (201)
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "jwt_token_here"
  }
}
```

**POST /api/auth/login**
```javascript
// Request
{
  "email": "john@example.com",
  "password": "securepass123"
}

// Response (200)
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" },
    "token": "jwt_token_here"
  }
}
```

**GET /api/auth/me**
```javascript
// Headers: Authorization: Bearer <token>

// Response (200)
{
  "success": true,
  "data": {
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com" }
  }
}
```

---

### Store Routes (`routes/store.js`)
**Base Path:** `/api/store`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create a new store |
| GET | `/` | Private | Get all stores for authenticated user |
| GET | `/:id` | Public | Get store by ID |
| PUT | `/:id` | Private (Owner) | Update store details |
| DELETE | `/:id` | Private (Owner) | Delete store |

**Models Used:** `Store`

**Key Features:**
- Domain uniqueness validation
- Owner-only modification/deletion
- Population of owner information

---

### Product Routes (`routes/product.js`)
**Base Path:** `/api/product`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private (Owner) | Create a new product |
| GET | `/:storeId` | Public | Get products for a store (with pagination, search, filters) |
| GET | `/item/:id` | Public | Get single product by ID |
| PUT | `/:id` | Private (Owner) | Update product |
| DELETE | `/:id` | Private (Owner) | Delete product (with image cleanup) |
| POST | `/bulk` | Private (Owner) | Bulk actions (delete, publish, unpublish) |

**Models Used:** `Product`, `Store`

**Key Features:**
- Advanced querying: pagination, search, sorting, status filtering
- Automatic Cloudinary image cleanup on deletion
- Bulk operations for efficiency
- Owner validation via `ownerCheckMiddleware`

**Query Parameters for GET /:storeId:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 12, max: 100)
- `search`: Search term (name, description)
- `sortBy`: Field to sort by (name, price, stock, createdAt, updatedAt)
- `sortDir`: Sort direction (asc, desc)
- `status`: Filter by status (draft, published)

---

### Store AI Routes (`routes/storeAI.js`)
**Base Path:** `/api/store`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/test-ai` | Public | Test AI service availability |
| POST | `/:storeId/ai-prompt` | Private (Owner) | Generate store design with AI |
| POST | `/:storeId/generate-component` | Private (Owner) | Generate individual React component |
| GET | `/:storeId/react-website` | Private (Owner) | Get React website data |
| GET | `/:storeId/preview` | Private (Owner) | Generate HTML preview of store |

**Models Used:** `Store`

**Key Features:**
- OpenAI integration for AI-powered store generation
- Industry-specific design templates (ecommerce, SaaS, portfolio, restaurant, etc.)
- React component generation with fallback templates
- Dynamic content generation based on user prompts
- Live HTML preview generation
- Support for multiple design archetypes and style presets

**AI Prompt Example:**
```javascript
// POST /:storeId/ai-prompt
{
  "prompt": "Create a modern coffee shop website with warm colors",
  "mode": "create",
  "industry": "ecommerce"
}

// Response includes generated React components, theme, and layout
```

---

### Store Approval & Editor Routes (`routes/storeApproval.js`)
**Base Path:** `/api/store`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| PUT | `/:storeId/approve` | Private (Owner) | Approve store for publishing |
| GET | `/:storeId/editor` | Private (Owner) | Get editor data (layout, products) |
| POST | `/:storeId/editor-update` | Private (Owner) | Update store from editor |
| POST | `/themes/choose` | Private | Choose a theme for store |

**Models Used:** `Store`, `Product`

**Key Features:**
- Editor data payload includes full layout and products
- Batch product operations (create, update, delete)
- Theme selection management
- Syncs both `layout` and `jsonLayout` fields

---

### Store Publishing Routes (`routes/storePublish.js`)
**Base Path:** `/api/store`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/:storeId/publish` | Private (Owner) | Publish store to Vercel |
| GET | `/:storeId/publish/status` | Private (Owner) | Get publishing status |
| PUT | `/:storeId/layout` | Private (Owner) | Update store layout |
| DELETE | `/:storeId/unpublish` | Private (Owner) | Unpublish store |
| GET | `/:storeId/debug-layout` | Private (Owner) | Debug layout data |

**Models Used:** `Store`

**Key Features:**
- Vite + React project generation
- Vercel deployment integration
- Automatic build directory cleanup
- Project name and alias management
- Deployment status tracking

---

### Team Routes (`routes/team.js`)
**Base Path:** `/api/teams`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/` | Private | Create a new team |
| GET | `/my` | Private | Get all teams for user |
| GET | `/:teamId` | Private (Member) | Get team by ID |
| PUT | `/:teamId` | Private (Owner/Admin) | Update team details |
| GET | `/:teamId/members` | Private (Member) | List team members |
| POST | `/:teamId/invites` | Private (Owner/Admin) | Invite member to team |
| POST | `/invites/accept` | Private | Accept team invitation |
| PUT | `/:teamId/members/:userId` | Private (Owner/Admin) | Update member role/MFA |
| DELETE | `/:teamId/members/:userId` | Private (Owner/Admin or Self) | Remove member or leave team |

**Models Used:** `Team`, `TeamMembership`, `TeamInvite`, `User`

**Key Features:**
- Automatic slug generation from team name
- Role-based access control (owner, admin, member)
- Invite system with token generation
- Email-based invitations
- MFA settings per membership
- Protection against removing last owner
- Self-service leaving teams

---

### Upload Routes (`routes/upload.js`)
**Base Path:** `/api/upload`

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/images` | Private | Upload multiple images (max 10) |
| POST | `/single-image` | Private | Upload single image |
| DELETE | `/images` | Private | Delete images from Cloudinary |
| GET | `/health` | Public | Check upload service health |

**Key Features:**
- Cloudinary integration for image storage
- File size limit: 10MB per file
- Supported formats: jpg, jpeg, png, webp, gif
- Automatic public ID tracking
- Bulk delete support
- Health check endpoint

---

## Middleware

### 1. Authentication Middleware (`middleware/authMiddleware.js`)
**Purpose:** Validates JWT tokens and attaches user to request.

**Usage:**
```javascript
router.get('/protected', authMiddleware, (req, res) => {
  // req.user contains authenticated user
});
```

### 2. Owner Check Middleware (`middleware/ownerCheckMiddleware.js`)
**Purpose:** Validates that the authenticated user owns a resource (store, product, etc.).

**Usage:**
```javascript
router.put('/:storeId', authMiddleware, 
  ownerCheckMiddleware((req) => req.params.storeId), 
  async (req, res) => {
    // req.store contains the validated store
  }
);
```

**Features:**
- Flexible resource ID extraction via function parameter
- Automatic store lookup and validation
- Attaches `req.store` for use in route handler

---

## Architecture Overview

### Model Relationships

```
User (1) ──────────> (N) Store
                         │
                         └──> (N) Product

User (1) ──────────> (N) Team (as owner)
     │                    │
     │                    └──> (N) TeamMembership
     │                         
     └──────────> (N) TeamMembership (as member)

Team (1) ──────────> (N) TeamInvite
     │
     └──────────> (N) TeamMembership

User (1) ──────────> (N) TeamInvite (as inviter)
```

### Key Relationships:
1. **User → Store**: One user can own multiple stores (`ownerId`)
2. **Store → Product**: One store can have multiple products (`storeId`)
3. **Team → User**: Many-to-many via `TeamMembership`
4. **Team → TeamInvite**: One team can have multiple pending invites
5. **User → TeamInvite**: One user can send multiple invites

### Data Flow Examples

#### Creating and Publishing a Store:
```
1. User registers/logs in → receives JWT
2. User creates Store → store.ownerId = user._id
3. User adds Products → product.storeId = store._id
4. User generates AI design → store.layout, store.jsonLayout updated
5. User approves store → store.approved = true
6. User publishes store → Vercel deployment
   → store.publishedUrl, store.vercelDeploymentId updated
```

#### Team Collaboration:
```
1. User creates Team → team.ownerId = user._id
2. TeamMembership auto-created → role: 'owner'
3. Owner invites member → TeamInvite created with token
4. Invitee accepts → TeamMembership created, invite.acceptedAt updated
5. Owner/admin can manage roles → Update TeamMembership.role
```

---

## Environment Variables

Required environment variables:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/JouleAI

# JWT
JWT_SECRET=your_jwt_secret_here

# OpenAI (for AI features)
OPENAI_API_KEY=sk-...
OPENAI_PROJECT_ID=optional
OPENAI_ORG_ID=optional
OPENAI_MODEL=gpt-4o-mini

# Cloudinary (for image uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Vercel (for deployment)
VERCEL_TOKEN=your_vercel_token

# Server
PORT=5000
NODE_ENV=development
```

---

## API Response Format

All API responses follow a consistent format:

**Success Response:**
```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data here
  }
}
```

**Error Response:**
```javascript
{
  "success": false,
  "message": "Error message here",
  "error": "Detailed error (dev mode only)"
}
```

---

## Error Handling

### Common HTTP Status Codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (insufficient permissions)
- `404`: Not Found
- `500`: Server Error
- `503`: Service Unavailable (external service issues)

### Validation Errors:
Mongoose validation errors are caught and formatted:
```javascript
{
  "success": false,
  "message": "Email is required" // First validation error
}
```

---

## Security Features

1. **Password Hashing**: Bcrypt with 12 salt rounds
2. **JWT Authentication**: 7-day token expiration
3. **Owner Validation**: Middleware ensures resource ownership
4. **Email Validation**: Regex validation on email fields
5. **Input Sanitization**: Trim and lowercase where appropriate
6. **Rate Limiting**: (Recommended to implement)
7. **CORS**: Configure for production
8. **Environment Variables**: Sensitive data in .env

---

## Testing Endpoints

### Quick Test Flow:

1. **Register User:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

2. **Create Store:**
```bash
curl -X POST http://localhost:5000/api/store \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"storeName":"My Store","domain":"mystore"}'
```

3. **Add Product:**
```bash
curl -X POST http://localhost:5000/api/product \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"storeId":"STORE_ID","name":"Product 1","price":99.99,"stock":10}'
```

---

## Future Improvements

1. **Add rate limiting** for public endpoints
2. **Implement caching** (Redis) for frequently accessed data
3. **Add search indexing** (Elasticsearch/Algolia) for products
4. **Webhook system** for Vercel deployment notifications
5. **Email service** integration for team invites
6. **Admin dashboard** endpoints
7. **Analytics** endpoints for store owners
8. **Payment integration** (Stripe/PayPal)
9. **Order management** system
10. **Customer management** and CRM features

---

## Support

For questions or issues, please refer to the main project README or contact the development team.

**Last Updated:** October 2025

