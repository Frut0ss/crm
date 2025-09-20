export default function handler(req, res) {
  // Enable CORS for embedding
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/javascript');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    const { tenant } = req.query;
    const tenantId = tenant || 'default';

    // Generate the standalone widget JavaScript
    const widgetScript = `
(function() {
  // Prevent multiple widget loads
  if (window.CRMBookingWidget) return;
  
  window.CRMBookingWidget = {
    tenantId: '${tenantId}',
    apiBase: '${req.headers.host ? `https://${req.headers.host}` : 'https://crm-pi-eight.vercel.app'}',
    
    init: function(containerId) {
      const container = document.getElementById(containerId);
      if (!container) {
        console.error('CRM Booking Widget: Container element not found');
        return;
      }
      
      this.render(container);
    },
    
    render: function(container) {
      // Create widget HTML
      container.innerHTML = \`
        <div id="crm-booking-widget" style="
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
          border: 2px solid #e1e5e9;
          border-radius: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        ">
          <h2 style="
            color: #2c3e50;
            text-align: center;
            margin-bottom: 20px;
            font-size: 24px;
          ">📅 Book an Appointment</h2>
          
          <form id="crm-booking-form">
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Select Date:</label>
              <input type="date" id="crm-date" required style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Select Time:</label>
              <select id="crm-time" required style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
                <option value="">Choose a time...</option>
              </select>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Service:</label>
              <select id="crm-service" required style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
                <option value="">Select a service...</option>
                <option value="consultation">Consultation</option>
                <option value="meeting">Meeting</option>
                <option value="support">Support</option>
                <option value="demo">Demo</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Full Name:</label>
              <input type="text" id="crm-name" required style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Email:</label>
              <input type="email" id="crm-email" required style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
            </div>
            
            <div style="margin-bottom: 15px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Phone:</label>
              <input type="tel" id="crm-phone" required style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
              ">
            </div>
            
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 5px; font-weight: bold; color: #34495e;">Notes (Optional):</label>
              <textarea id="crm-notes" rows="3" placeholder="Any special requirements..." style="
                width: 100%;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 6px;
                font-size: 16px;
                box-sizing: border-box;
                resize: vertical;
              "></textarea>
            </div>
            
            <button type="submit" id="crm-submit-btn" style="
              width: 100%;
              padding: 12px;
              background: #3498db;
              color: white;
              border: none;
              border-radius: 6px;
              font-size: 16px;
              font-weight: bold;
              cursor: pointer;
              transition: background 0.3s;
            ">Book Appointment</button>
          </form>
          
          <div id="crm-success-message" style="display: none; text-align: center; color: #27ae60; margin-top: 20px;">
            <h3>✅ Booking Confirmed!</h3>
            <p>Thank you for your booking. We'll contact you shortly.</p>
          </div>
        </div>
      \`;
      
      this.setupEventListeners();
      this.populateTimeSlots();
      this.setMinDate();
    },
    
    setupEventListeners: function() {
      const form = document.getElementById('crm-booking-form');
      const submitBtn = document.getElementById('crm-submit-btn');
      
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        const formData = {
          date: document.getElementById('crm-date').value,
          time: document.getElementById('crm-time').value,
          customer: {
            name: document.getElementById('crm-name').value,
            email: document.getElementById('crm-email').value,
            phone: document.getElementById('crm-phone').value,
            service: document.getElementById('crm-service').value,
            notes: document.getElementById('crm-notes').value
          },
          description: \`Booking for \${document.getElementById('crm-name').value} - \${document.getElementById('crm-service').value}\`,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        try {
          const response = await fetch(\`\${this.apiBase}/api/bookings?tenant=\${this.tenantId}\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
          });
          
          if (response.ok) {
            document.getElementById('crm-booking-form').style.display = 'none';
            document.getElementById('crm-success-message').style.display = 'block';
          } else {
            alert('There was an error submitting your booking. Please try again.');
          }
        } catch (error) {
          console.error('Booking error:', error);
          alert('There was an error submitting your booking. Please try again.');
        } finally {
          submitBtn.textContent = 'Book Appointment';
          submitBtn.disabled = false;
        }
      });
      
      // Hover effect for submit button
      submitBtn.addEventListener('mouseenter', function() {
        this.style.background = '#2980b9';
      });
      
      submitBtn.addEventListener('mouseleave', function() {
        this.style.background = '#3498db';
      });
    },
    
    populateTimeSlots: function() {
      const timeSelect = document.getElementById('crm-time');
      const slots = [];
      
      // Generate time slots from 9 AM to 5 PM
      for (let hour = 9; hour <= 17; hour++) {
        slots.push(\`\${hour.toString().padStart(2, '0')}:00\`);
        if (hour < 17) {
          slots.push(\`\${hour.toString().padStart(2, '0')}:30\`);
        }
      }
      
      slots.forEach(slot => {
        const option = document.createElement('option');
        option.value = slot;
        option.textContent = slot;
        timeSelect.appendChild(option);
      });
    },
    
    setMinDate: function() {
      const dateInput = document.getElementById('crm-date');
      const today = new Date();
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      
      dateInput.min = today.toISOString().split('T')[0];
      dateInput.max = maxDate.toISOString().split('T')[0];
    }
  };
  
  // Auto-initialize if container exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      if (document.getElementById('crm-booking-widget-container')) {
        window.CRMBookingWidget.init('crm-booking-widget-container');
      }
    });
  } else {
    if (document.getElementById('crm-booking-widget-container')) {
      window.CRMBookingWidget.init('crm-booking-widget-container');
    }
  }
})();
`;

    res.status(200).send(widgetScript);
  } else {
    res.status(405).end();
  }
}