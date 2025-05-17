// filepath: d:\VSCODE\real time project\CinemaOne\frontend\src\pages\PaymentPage.js
import React, { useState } from 'react';

// Animated credit card SVG icon
const CardIcon = ({ animate = false }) => (
  <svg
    width="56"
    height="38"
    viewBox="0 0 56 38"
    fill="none"
    style={{
      filter: 'drop-shadow(0 4px 16px rgba(25,118,210,0.10))',
      transition: 'transform 0.5s cubic-bezier(.4,2,.6,1)',
      transform: animate ? 'rotateY(360deg) scale(1.08)' : 'none'
    }}
  >
    <defs>
      <linearGradient id="card-bg" x1="0" y1="0" x2="56" y2="38" gradientUnits="userSpaceOnUse">
        <stop stopColor="#1976d2" />
        <stop offset="1" stopColor="#42a5f5" />
      </linearGradient>
    </defs>
    <rect width="56" height="38" rx="8" fill="url(#card-bg)" />
    <rect y="10" width="56" height="5" fill="#1565c0" opacity="0.7" />
    <rect x="8" y="28" width="16" height="3" rx="1.5" fill="#fff" opacity="0.9" />
    <rect x="30" y="28" width="10" height="3" rx="1.5" fill="#fff" opacity="0.7" />
    <circle cx="46" cy="15" r="3" fill="#fff" opacity="0.7" />
    <circle cx="50" cy="15" r="3" fill="#fff" opacity="0.4" />
  </svg>
);

const FloatingLabelInput = ({
  label,
  type,
  name,
  value,
  onChange,
  disabled,
  autoComplete,
  icon,
  ...props
}) => (
  <div style={{
    position: 'relative',
    marginBottom: 20,
    width: '100%'
  }}>
    {icon && (
      <span style={{
        position: 'absolute',
        left: 14,
        top: 18,
        color: '#90caf9',
        fontSize: 18,
        pointerEvents: 'none'
      }}>{icon}</span>
    )}
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      autoComplete={autoComplete}
      style={{
        width: '100%',
        padding: icon ? '16px 12px 16px 40px' : '16px 12px',
        border: '1.5px solid #bdbdbd',
        borderRadius: 8,
        fontSize: 16,
        outline: 'none',
        background: '#f7fbff',
        transition: 'border 0.2s',
        boxSizing: 'border-box'
      }}
      {...props}
      required
    />
    <label
      htmlFor={name}
      style={{
        position: 'absolute',
        left: icon ? 40 : 14,
        top: value ? 4 : 18,
        fontSize: value ? 12 : 16,
        color: value ? '#1976d2' : '#888',
        background: value ? '#fff' : 'transparent',
        padding: value ? '0 4px' : '0',
        transition: 'all 0.2s',
        pointerEvents: 'none',
        fontWeight: value ? 600 : 400
      }}
    >
      {label}
    </label>
  </div>
);

const SuccessCheckmark = () => (
  <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
    <circle cx="36" cy="36" r="36" fill="#e8f5e9"/>
    <circle cx="36" cy="36" r="28" fill="#43a047"/>
    <path d="M24 37.5L33 46L48 30" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const shimmer = {
  background: 'linear-gradient(90deg, #e3f2fd 25%, #bbdefb 50%, #e3f2fd 75%)',
  backgroundSize: '200% 100%',
  animation: 'shimmer 1.5s infinite'
};

const PaymentPage = () => {
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    contact: '',
  });
  const [cardAnim, setCardAnim] = useState(false);

  const handleInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handlePayment = () => {
    setIsPaying(true);
    setPaymentError('');
    // Example Razorpay integration
    const options = {
      key: 'your_razorpay_key', // Replace with your Razorpay key
      amount: 1000, // Amount in paise (e.g., 1000 = ₹10)
      currency: 'INR',
      name: 'CinemaOne',
      description: 'Pay for your movie',
      handler: (response) => {
        setIsPaying(false);
        setPaymentSuccess(true);
        setCardAnim(true);
        setTimeout(() => setCardAnim(false), 1200);
      },
      prefill: {
        name: user.name,
        email: user.email,
        contact: user.contact,
      },
      modal: {
        ondismiss: () => setIsPaying(false),
      },
      theme: {
        color: "#1976d2"
      }
    };

    if (!user.name || !user.email || !user.contact) {
      setPaymentError('Please fill all the details.');
      setIsPaying(false);
      return;
    }

    if (!window.Razorpay) {
      setPaymentError('Payment gateway not loaded. Please try again later.');
      setIsPaying(false);
      return;
    }

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // For accessibility: focus on first input on mount
  React.useEffect(() => {
    if (!paymentSuccess) {
      const firstInput = document.querySelector('input[name="name"]');
      if (firstInput) firstInput.focus();
    }
  }, [paymentSuccess]);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'Segoe UI, Arial, sans-serif',
      position: 'relative'
    }}>
      {/* Decorative floating circles */}
      <div style={{
        position: 'absolute', top: 40, left: 60, width: 80, height: 80,
        background: 'radial-gradient(circle at 30% 30%, #90caf9 0%, #e3f2fd 100%)',
        borderRadius: '50%', opacity: 0.25, zIndex: 0
      }} />
      <div style={{
        position: 'absolute', bottom: 60, right: 80, width: 120, height: 120,
        background: 'radial-gradient(circle at 70% 70%, #1976d2 0%, #e3f2fd 100%)',
        borderRadius: '50%', opacity: 0.18, zIndex: 0
      }} />
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 8px 32px rgba(25, 118, 210, 0.14)',
        padding: 44,
        width: 400,
        maxWidth: '92vw',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        overflow: 'hidden'
      }}>
        <div style={{ marginBottom: 28, transition: 'all 0.5s' }}>
          {paymentSuccess
            ? <SuccessCheckmark />
            : <CardIcon animate={cardAnim} />
          }
        </div>
        <h1 style={{
          fontSize: 30,
          fontWeight: 800,
          color: '#1976d2',
          marginBottom: 10,
          letterSpacing: '-1px'
        }}>Payment</h1>
        <p style={{ color: '#555', marginBottom: 28, fontSize: 16 }}>
          Securely pay for your movie ticket.
        </p>
        {paymentSuccess ? (
          <div>
            <h2 style={{ color: '#43a047', fontWeight: 700, marginBottom: 8, fontSize: 24 }}>
              Payment Successful!
            </h2>
            <p style={{ color: '#555', fontSize: 16, marginBottom: 18 }}>
              Enjoy your movie at <span style={{ color: '#1976d2', fontWeight: 600 }}>CinemaOne</span>.
            </p>
            <button
              style={{
                marginTop: 10,
                padding: '12px 0',
                width: '100%',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 18,
                fontWeight: 700,
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
                transition: 'background 0.2s'
              }}
              onClick={() => window.location.reload()}
            >
              Book Another Ticket
            </button>
          </div>
        ) : (
          <>
            <form
              autoComplete="on"
              onSubmit={e => { e.preventDefault(); handlePayment(); }}
              style={{ marginBottom: 0 }}
            >
              <FloatingLabelInput
                label="Full Name"
                type="text"
                name="name"
                value={user.name}
                onChange={handleInputChange}
                disabled={isPaying}
                autoComplete="name"
                icon={<span role="img" aria-label="user">👤</span>}
              />
              <FloatingLabelInput
                label="Email Address"
                type="email"
                name="email"
                value={user.email}
                onChange={handleInputChange}
                disabled={isPaying}
                autoComplete="email"
                icon={<span role="img" aria-label="email">📧</span>}
              />
              <FloatingLabelInput
                label="Mobile Number"
                type="tel"
                name="contact"
                value={user.contact}
                onChange={handleInputChange}
                disabled={isPaying}
                autoComplete="tel"
                icon={<span role="img" aria-label="phone">📱</span>}
                pattern="[0-9]{10,}"
                maxLength={15}
              />
              <div style={{
                background: '#e3f2fd',
                borderRadius: 10,
                padding: '12px 0',
                marginBottom: 18,
                fontWeight: 700,
                color: '#1976d2',
                fontSize: 20,
                letterSpacing: 1,
                boxShadow: '0 1px 4px rgba(25,118,210,0.04)'
              }}>
                Amount: <span style={{ fontWeight: 800 }}>₹10.00</span>
              </div>
              {paymentError && (
                <div style={{
                  color: '#d32f2f',
                  marginBottom: 14,
                  fontSize: 15,
                  fontWeight: 600,
                  background: '#ffebee',
                  borderRadius: 6,
                  padding: '8px 0'
                }}>
                  {paymentError}
                </div>
              )}
              <button
                type="submit"
                disabled={isPaying}
                style={{
                  width: '100%',
                  padding: '14px 0',
                  background: isPaying ? '#90caf9' : 'linear-gradient(90deg,#1976d2 0%,#42a5f5 100%)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 19,
                  fontWeight: 800,
                  cursor: isPaying ? 'not-allowed' : 'pointer',
                  boxShadow: isPaying ? 'none' : '0 2px 8px rgba(25,118,210,0.10)',
                  transition: 'background 0.2s, box-shadow 0.2s',
                  ...(isPaying ? shimmer : {})
                }}
              >
                {isPaying ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
                    <span className="loader" style={{
                      width: 18, height: 18, border: '3px solid #fff',
                      borderTop: '3px solid #1976d2', borderRadius: '50%',
                      display: 'inline-block', animation: 'spin 1s linear infinite'
                    }} /> Processing...
                  </span>
                ) : 'Pay Now'}
              </button>
            </form>
            <div style={{ marginTop: 22, color: '#90caf9', fontSize: 14, fontWeight: 500 }}>
              <span role="img" aria-label="lock">🔒</span> Payments are 100% secure & encrypted.
            </div>
          </>
        )}
      </div>
      {/* Animations */}
      <style>
        {`
        @keyframes spin {
          0% { transform: rotate(0deg);}
          100% { transform: rotate(360deg);}
        }
        @keyframes shimmer {
          0% { background-position: -200% 0;}
          100% { background-position: 200% 0;}
        }
        `}
      </style>
    </div>
  );
};

export default PaymentPage;