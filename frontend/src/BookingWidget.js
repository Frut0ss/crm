import React, { useState, useEffect } from 'react';

function BookingWidget() {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [tenantId, setTenantId] = useState('');
  const [customerData, setCustomerData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // Extract tenant ID from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const tenant = urlParams.get('tenant');
    setTenantId(tenant || 'default');
  }, []);

  // Generate available time slots
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour <= 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      if (hour < 17) {
        slots.push(`${hour.toString().padStart(2, '0')}:30`);
      }
    }
    return slots;
  };

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get date 30 days from now
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleCustomerDataChange = (e) => {
    const { name, value } = e.target;
    setCustomerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const bookingData = {
        date: selectedDate,
        time: selectedTime,
        customer: customerData,
        description: `Booking for ${customerData.name} - ${customerData.service}`,
        status: 'pending',
        createdAt: new Date().toISOString()
      };

      const response = await fetch(`/api/bookings?tenant=${tenantId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData)
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert('There was an error submitting your booking. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert('There was an error submitting your booking. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="booking-widget success">
        <h2>✅ Booking Confirmed!</h2>
        <p>Thank you for your booking request.</p>
        <div className="booking-summary">
          <h3>Booking Details:</h3>
          <p><strong>Date:</strong> {selectedDate}</p>
          <p><strong>Time:</strong> {selectedTime}</p>
          <p><strong>Service:</strong> {customerData.service}</p>
          <p><strong>Name:</strong> {customerData.name}</p>
        </div>
        <p>We'll contact you shortly to confirm your appointment.</p>
        <button 
          onClick={() => {
            setIsSubmitted(false);
            setSelectedDate('');
            setSelectedTime('');
            setCustomerData({
              name: '',
              email: '',
              phone: '',
              service: '',
              notes: ''
            });
          }}
          className="new-booking-btn"
        >
          Make Another Booking
        </button>
      </div>
    );
  }

  return (
    <div className="booking-widget">
      <h2>📅 Book an Appointment</h2>
      <form onSubmit={handleSubmit}>
        {/* Date Selection */}
        <div className="form-group">
          <label htmlFor="date">Select Date:</label>
          <input
            type="date"
            id="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={getTodayDate()}
            max={getMaxDate()}
            required
          />
        </div>

        {/* Time Selection */}
        <div className="form-group">
          <label htmlFor="time">Select Time:</label>
          <select
            id="time"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            required
          >
            <option value="">Choose a time...</option>
            {generateTimeSlots().map(slot => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
        </div>

        {/* Service Selection */}
        <div className="form-group">
          <label htmlFor="service">Service:</label>
          <select
            id="service"
            name="service"
            value={customerData.service}
            onChange={handleCustomerDataChange}
            required
          >
            <option value="">Select a service...</option>
            <option value="consultation">Consultation</option>
            <option value="meeting">Meeting</option>
            <option value="support">Support</option>
            <option value="demo">Demo</option>
            <option value="other">Other</option>
          </select>
        </div>

        {/* Customer Information */}
        <div className="form-group">
          <label htmlFor="name">Full Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerData.name}
            onChange={handleCustomerDataChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={customerData.email}
            onChange={handleCustomerDataChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={customerData.phone}
            onChange={handleCustomerDataChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="notes">Additional Notes (Optional):</label>
          <textarea
            id="notes"
            name="notes"
            value={customerData.notes}
            onChange={handleCustomerDataChange}
            rows="3"
            placeholder="Any special requirements or notes..."
          />
        </div>

        <button 
          type="submit" 
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Book Appointment'}
        </button>
      </form>
    </div>
  );
}

export default BookingWidget;