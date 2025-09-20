let customers = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(customers);
  } else if (req.method === 'POST') {
    const { name } = req.body;
    const customer = { id: Date.now(), name };
    customers.push(customer);
    res.status(201).json(customer);
  } else {
    res.status(405).end();
  }
}
