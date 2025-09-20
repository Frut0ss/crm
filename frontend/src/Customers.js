import React, { useState, useEffect } from 'react';

function Customers() {
  const [customers, setCustomers] = useState([]);
  const [name, setName] = useState('');

  useEffect(() => {
    fetch('/api/customers')
      .then(res => res.json())
      .then(setCustomers);
  }, []);

  const addCustomer = async () => {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name })
    });
    const newCustomer = await res.json();
    setCustomers([...customers, newCustomer]);
    setName('');
  };

  return (
    <div>
      <h2>Customers</h2>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Customer name" />
      <button onClick={addCustomer}>Add Customer</button>
      <ul>
        {customers.map(c => <li key={c.id}>{c.name}</li>)}
      </ul>
    </div>
  );
}

export default Customers;