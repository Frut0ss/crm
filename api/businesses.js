// In-memory data store for demo purposes
let businesses = [
  {
    id: 'demo',
    name: 'Demo Business',
    domain: 'demo.example.com',
    status: 'active',
    createdAt: new Date().toISOString()
  }
];

let users = [
  {
    id: 1,
    username: 'superadmin',
    password: 'admin123',
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

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    // Get all businesses
    res.status(200).json({ businesses });
  } 
  else if (req.method === 'POST') {
    // Add new business
    const { id, name, domain, adminUsername, adminPassword } = req.body;

    // Check if business ID already exists
    if (businesses.find(b => b.id === id)) {
      return res.status(400).json({ error: 'Business ID already exists' });
    }

    // Check if admin username already exists
    if (users.find(u => u.username === adminUsername)) {
      return res.status(400).json({ error: 'Admin username already exists' });
    }

    // Create new business
    const newBusiness = {
      id,
      name,
      domain: domain || '',
      status: 'active',
      createdAt: new Date().toISOString()
    };

    // Create admin user for the business
    const newUser = {
      id: users.length + 1,
      username: adminUsername,
      password: adminPassword, // In production, hash this
      role: 'business_admin',
      tenantId: id,
      tenantName: name
    };

    businesses.push(newBusiness);
    users.push(newUser);

    res.status(201).json({ business: newBusiness, user: newUser });
  }
  else if (req.method === 'DELETE') {
    // Delete business
    const { id } = req.query;

    const businessIndex = businesses.findIndex(b => b.id === id);
    if (businessIndex === -1) {
      return res.status(404).json({ error: 'Business not found' });
    }

    // Remove business
    businesses.splice(businessIndex, 1);

    // Remove associated users
    users = users.filter(u => u.tenantId !== id);

    res.status(200).json({ message: 'Business deleted successfully' });
  }
  else {
    res.status(405).end();
  }
}