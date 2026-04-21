import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET not set in environment variables');
}

export async function verifyToken(req, res, next) {
  // Support both Cookies and Authorization Header (Bearer Token)
  let token = req.cookies?.accessToken;
  const authHeader = req.headers.authorization;

  if (!token && authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) return res.status(401).json({ error: 'Unauthorized: Security token missing' });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Achieving real-time authorization: Validating actual DB state
    const user = await User.findById(decoded.id).select('isActive verified role').lean();
    
    if (!user || !user.isActive) {
      return res.status(401).json({ error: 'Your session has ended. Please log in again.' });
    }
    
    // Ensure role matches current database record
    if (user.role !== decoded.role) {
      req.user = { ...decoded, role: user.role };
    } else {
      req.user = decoded;
    }
    
    next();
  } catch (e) {
    console.error('Real-time Token Sync Failure:', e);
    return res.status(401).json({ error: 'Your session has expired. Please log in again.' });
  }
}

export function authorizeRoles(roles = []) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied: You do not have permission to view this page.' });
    }
    next();
  };
}
