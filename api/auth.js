// In-memory data store for demo purposes
// In production, this would be a database
const users = [
  {
    id: 1,
    username: 'superadmin',
    password: 'admin123', // In production, this would be hashed
    role: 'super_admin',
    tenantId: null,
    tenantName: 'Super Admin'
  },
  {
    id: 2,
    username: 'admin',
    password: 'business123',
    role: 'business_admin',
    tenantId: 'demo',
    tenantName: 'Demo Business'
  }
];

const businesses = [
  {
    id: 'demo',
    name: 'Demo Business',
    domain: 'demo.example.com',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    const { action, username, password, tenantId } = req.body;

    if (action === 'login') {
      // Find user
      let user = users.find(u => u.username === username && u.password === password);

      if (!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }

      // For business users, check tenant ID
      if (user.role === 'business_admin') {
        if (!tenantId || user.tenantId !== tenantId) {
          return res.status(401).json({ error: 'Invalid business ID' });
        }
      }

      // Generate a simple token (in production, use JWT)
      const token = `token_${user.id}_${Date.now()}`;

      res.status(200).json({
        user: {
          id: user.id,
          username: user.username,
          role: user.role,
          tenantId: user.tenantId,
          tenantName: user.tenantName
        },
        token
      });
    } else {
      res.status(400).json({ error: 'Invalid action' });
    }
  } else if (req.method === 'GET') {
    // Get businesses (for super admin)
    res.status(200).json({ businesses });
  } else {
    res.status(405).end();
  }
}