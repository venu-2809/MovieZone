// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\pages\PaymentPage.js
import React from 'react';

const PaymentPage = () => {
  const handlePayment = () => {
    // Example Razorpay integration
    const options = {
      key: 'your_razorpay_key', // Replace with your Razorpay key
      amount: 1000, // Amount in paise (e.g., 1000 = ₹10)
      currency: 'INR',
      name: 'CinemaOne',
      description: 'Pay for your movie',
      handler: (response) => {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
      },
      prefill: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        contact: '9999999999',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <h1>Payment Page</h1>
      <button onClick={handlePayment}>Pay Now</button>
    </div>
  );
};

export default PaymentPage;