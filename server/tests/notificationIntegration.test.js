/**
 * Integration Test: Full Notification Flow
 * Tests: WebSocket + Email + WhatsApp notifications
 */

// Step 1: Test Email Only
console.log('🧪 TEST 1: Email Notification');
const testEmail = async () => {
  const response = await fetch('http://localhost:5001/api/test/test-email', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'keerthistrange@gmail.com',
      subject: 'Test Email'
    })
  });
  const result = await response.json();
  console.log('Email Test Result:', result);
  return result.success;
};

// Step 2: Register User (Triggers OTP Email)
console.log('🧪 TEST 2: Registration with OTP');
const testRegistration = async () => {
  const response = await fetch('http://localhost:5001/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: 'Test User',
      email: 'test@example.com',
      phone: '919345737726',
      password: 'Test@123456',
      role: 'customer'
    })
  });
  const result = await response.json();
  console.log('Registration Result:', result);
  // Check your email for OTP
  return result.ok;
};

// Step 3: Place Order (Triggers Order Confirmation)
console.log('🧪 TEST 3: Order Placement');
const testOrderPlacement = async (token) => {
  const response = await fetch('http://localhost:5001/api/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      pharmacyId: 'pharmacy_id_here',
      items: [
        { medicine: 'medicine_id_here', quantity: 2, price: 500 }
      ],
      deliveryAddress: '123 Main St, City',
      paymentMethod: 'online'
    })
  });
  const result = await response.json();
  console.log('Order Result:', result);
  // Check your email for order confirmation
  return result.order;
};

// Step 4: Update Delivery Status
console.log('🧪 TEST 4: Delivery Status Update');
const testDeliveryUpdate = async (orderId, token) => {
  const response = await fetch(`http://localhost:5001/api/delivery/${orderId}/status`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      status: 'out_for_delivery'
    })
  });
  const result = await response.json();
  console.log('Delivery Status Update Result:', result);
  // Check your email for delivery notification
  return result;
};

/**
 * FULL FLOW EXECUTION:
 * 
 * 1. Run test email: testEmail()
 *    Expected: Email received immediately
 * 
 * 2. Register new user: testRegistration()
 *    Expected: Welcome email with OTP + WhatsApp with OTP
 * 
 * 3. Login & get token: Use email/phone OTP to verify
 * 
 * 4. Place order: testOrderPlacement(token)
 *    Expected: Order confirmation email + WebSocket notification + WhatsApp
 * 
 * 5. Accept delivery: As delivery partner, accept order
 * 
 * 6. Update status: testDeliveryUpdate(orderId, token)
 *    Expected: Delivery notification email + WebSocket update
 * 
 * 7. Mark delivered: testDeliveryUpdate(orderId, token) with status='delivered'
 *    Expected: Delivery confirmation email
 */

export { testEmail, testRegistration, testOrderPlacement, testDeliveryUpdate };
