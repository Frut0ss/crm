// In-memory data store for demo purposes (tenant-specific)
let customers = {};

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { tenant } = req.query;
  const tenantId = tenant || 'default';

  // Initialize tenant data if it doesn't exist
  if (!customers[tenantId]) {
    customers[tenantId] = [];
  }

  if (req.method === 'GET') {
    res.status(200).json(customers[tenantId]);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    const customer = { 
      id: Date.now(), 
      name,
      tenantId,
      createdAt: new Date().toISOString()
    };
    customers[tenantId].push(customer);
    res.status(201).json(customer);
  } else {
    res.status(405).end();
  }
}
