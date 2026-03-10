# Authentication & Authorization / Xác Thực & Ủy Quyền
## Security - Chapter 2 / Bảo Mật - Chương 2

[Back to Table of Contents](../00-table-of-contents.md)

---

## JWT Authentication

```typescript
import jwt from 'jsonwebtoken';

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: '7d'
  });
}

export function verifyToken(token: string): TokenPayload {
  return jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;
}

// Middleware
export function authMiddleware(req: Request) {
  const token = req.headers.get('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const payload = verifyToken(token);
    return payload;
  } catch (error) {
    throw new Error('Invalid token');
  }
}
```

## OAuth 2.0 Flow

```typescript
// OAuth configuration
const OAUTH_CONFIG = {
  clientId: process.env.OAUTH_CLIENT_ID!,
  clientSecret: process.env.OAUTH_CLIENT_SECRET!,
  redirectUri: 'http://localhost:3000/auth/callback',
  authorizationUrl: 'https://provider.com/oauth/authorize',
  tokenUrl: 'https://provider.com/oauth/token'
};

// Step 1: Redirect to authorization
export function getAuthorizationUrl(): string {
  const params = new URLSearchParams({
    client_id: OAUTH_CONFIG.clientId,
    redirect_uri: OAUTH_CONFIG.redirectUri,
    response_type: 'code',
    scope: 'read write'
  });
  
  return `${OAUTH_CONFIG.authorizationUrl}?${params}`;
}

// Step 2: Exchange code for token
export async function exchangeCodeForToken(code: string) {
  const response = await fetch(OAUTH_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      client_id: OAUTH_CONFIG.clientId,
      client_secret: OAUTH_CONFIG.clientSecret,
      redirect_uri: OAUTH_CONFIG.redirectUri
    })
  });
  
  return response.json();
}
```

## Password Hashing

```typescript
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 10;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Usage
async function registerUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  // Save to database / Lưu vào cơ sở dữ liệu
  await db.users.create({
    email,
    password: hashedPassword
  });
}

async function loginUser(email: string, password: string) {
  const user = await db.users.findOne({ email });
  
  if (!user) {
    throw new Error('User not found');
  }
  
  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    throw new Error('Invalid password');
  }
  
  return generateToken({
    userId: user.id,
    email: user.email,
    role: user.role
  });
}
```

---

[Back to Table of Contents](../00-table-of-contents.md)
