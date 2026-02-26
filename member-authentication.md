# Member Authentication - Frontend Integration Guide

## Base API URL
All endpoints are relative to your Payload server URL (e.g., `https://your-domain.com`)

---

## 1. Authentication Endpoints

### Login
```
POST /api/members/login
Content-Type: application/json

{
  "email": "member@example.com",
  "password": "yourpassword"
}
```

**Response (Success 200):**
```json
{
  "message": "Auth Passed",
  "user": {
    "id": "uuid",
    "email": "member@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "status": "Active",
    "tenant": { "id": "...", "name": "...", "domain": "..." },
    "preferences": { "language": "en", ... },
    "lastLogin": "2026-02-26T...",
    "loginCount": 5,
    "createdAt": "...",
    "updatedAt": "..."
  },
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "exp": 1234567890
}
```

**Error Responses:**
- `401` - Invalid credentials
- `403` - Account suspended or pending verification
- `400` - No tenant assigned to member
- `429` - Account locked (after 5 failed attempts, locked for 10 minutes)

---

### Logout
```
POST /api/members/logout
Authorization: Bearer <token>
```
Or with cookies if using cookie-based auth.

---

### Get Current Member (Me)
```
GET /api/members/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "user": {
    "id": "...",
    "email": "...",
    "firstName": "...",
    "lastName": "...",
    "status": "Active",
    "tenant": { ... },
    "preferences": { ... }
  },
  "exp": 1234567890
}
```

---

### Forgot Password
```
POST /api/members/forgot-password
Content-Type: application/json

{
  "email": "member@example.com"
}
```

**Response:**
```json
{
  "message": "Success"
}
```
(Always returns success for security - doesn't confirm if email exists)

The reset link format sent via email:
```
{SERVER_URL}/admin/reset/{token}
```

---

### Reset Password
```
POST /api/members/reset-password
Content-Type: application/json

{
  "token": "reset-token-from-email",
  "password": "newpassword"
}
```

---

### Refresh Token
```
POST /api/members/refresh-token
Authorization: Bearer <token>
```

---

## 2. Member Registration/Signup

```
POST /api/members
Content-Type: application/json

{
  "email": "newmember@example.com",
  "password": "securepassword",
  "firstName": "John",
  "lastName": "Doe",
  "tenant": "tenant-id"
}
```

**Important Notes:**
- If `tenant` is not provided, it's resolved from the `Host` header (domain-based multi-tenancy)
- New members default to `status: "Pending"` (require verification)
- Tenant must be active

---

## 3. Member Data Model

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | UUID |
| `email` | string | Unique email (required) |
| `firstName` | string | Required |
| `lastName` | string | Required |
| `status` | enum | `"Active"`, `"Pending"`, `"Suspended"` |
| `tenant` | object/string | Related tenant (required for login) |
| `contact` | object/string | Linked CRM contact record |
| `preferences.language` | enum | `"en"`, `"es"`, `"fr"`, `"de"`, `"ar"` |
| `preferences.emailNotifications` | boolean | Default: `true` |
| `preferences.marketingEmails` | boolean | Default: `false` |
| `metadata` | object | Flexible key-value storage |
| `lastLogin` | date | Read-only |
| `loginCount` | number | Read-only |
| `createdAt` | date | Auto |
| `updatedAt` | date | Auto |

---

## 4. Authentication Rules & Restrictions

1. **Status Check on Login:**
   - `Active` → Login allowed
   - `Pending` → `403 "Account is pending verification"`
   - `Suspended` → `403 "Account is suspended"`

2. **Tenant Required:** Members must have a tenant assigned to login

3. **Brute Force Protection:**
   - Max 5 failed login attempts
   - Account locks for 10 minutes after 5 failures

4. **Session Management:** Uses JWT with session tracking (stored in `sessions` array)

---

## 5. Multi-Tenant Context

The system uses domain-based multi-tenancy:
- Members are scoped to a single tenant
- Tenant resolution happens via `Host` header during signup
- All member data is tenant-isolated

---

## 6. Update Member Profile

```
PATCH /api/members/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Updated",
  "preferences": {
    "language": "es",
    "emailNotifications": false
  }
}
```

---

## 7. Authentication Headers

**Option 1 - Bearer Token:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**Option 2 - Cookies:**
Payload sets `payload-token` cookie automatically on login.

---

## 8. TypeScript Types

```typescript
interface MemberLoginRequest {
  email: string;
  password: string;
}

interface MemberLoginResponse {
  message: string;
  user: Member;
  token: string;
  exp: number;
}

interface Member {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  status: 'Active' | 'Pending' | 'Suspended';
  tenant: string | Tenant;
  contact?: string | Contact | null;
  preferences?: {
    language?: 'en' | 'es' | 'fr' | 'de' | 'ar';
    emailNotifications?: boolean;
    marketingEmails?: boolean;
  };
  metadata?: Record<string, unknown>;
  lastLogin?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface Tenant {
  id: string;
  name: string;
  slug: string;
  status: 'pending' | 'active' | 'suspended';
  domain: string;
  branding?: {
    logo?: string | Media;
    primaryColor?: string;
    secondaryColor?: string;
    theme?: 'light' | 'dark' | 'auto';
  };
}
```

---

## 9. CORS Configuration

CORS origins are configured via `PAYLOAD_SECRETS_CORS_URLS` environment variable. Ensure your frontend domain is included.

---

## 10. Example Frontend Implementation (React/Next.js)

```typescript
// lib/auth.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/members/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
    credentials: 'include', // For cookie-based auth
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Login failed');
  }
  
  return res.json();
}

export async function logout() {
  await fetch(`${API_URL}/api/members/logout`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function getCurrentMember(token?: string) {
  const headers: HeadersInit = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const res = await fetch(`${API_URL}/api/members/me`, {
    headers,
    credentials: 'include',
  });
  
  if (!res.ok) return null;
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_URL}/api/members/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  
  return res.json();
}

export async function resetPassword(token: string, password: string) {
  const res = await fetch(`${API_URL}/api/members/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, password }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Password reset failed');
  }
  
  return res.json();
}

export async function register(data: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tenant?: string;
}) {
  const res = await fetch(`${API_URL}/api/members`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Registration failed');
  }
  
  return res.json();
}
```
