import React, { useState } from 'react';
import { CreditCard, Smartphone, Building, Globe, Check, ArrowLeft, Shield, Lock } from 'lucide-react';
import { useRecoilValue } from 'recoil';
import { guestAtom, totalPriceAtom } from '../store/atoms/Booking';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL;



const BookingConfirm = async () => {
  const data = localStorage.getItem('bookingData');
  const bookingData = JSON.parse(data);
  const yourToken = localStorage.getItem('token')
  const response = await axios.post(`${backendUrl}/bookings/`, {
    userId: bookingData.userId,
    listingId: bookingData.propertyId,
    checkIn: bookingData.checkIn,
    checkOut: bookingData.checkOut,
    guest: bookingData.guests,
    totalPrice: bookingData.finalTotal,
    status: "confirmed"
  }, {
    headers: {
      Authorization: `${yourToken}`,
    }
  });

  console.log(response);



}
// Payment Method Component
const PaymentMethod = ({ icon, title, description, isSelected, onClick, disabled = false }) => (
  <div
    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${isSelected
        ? 'border-blue-500 bg-blue-50 shadow-md'
        : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    onClick={!disabled ? onClick : undefined}
  >
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${isSelected ? 'bg-blue-100' : 'bg-gray-100'}`}>
        {icon}
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <div className={`w-4 h-4 rounded-full border-2 ${isSelected ? 'border-blue-500 bg-blue-500' : 'border-gray-300'
        }`}>
        {isSelected && <Check className="w-2 h-2 text-white m-0.5" />}
      </div>
    </div>
  </div>
);

// UPI Payment Component
const UPIPayment = ({ totalPrice, onSuccess }) => {
  const [upiId, setUpiId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUPIPayment = async () => {
    if (!upiId) return;
    setIsProcessing(true);
    // Simulate UPI payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('UPI');
    }, 2000);
    BookingConfirm();

  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
        <input
          type="text"
          placeholder="yourname@upi"
          value={upiId}
          onChange={(e) => setUpiId(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="bg-blue-50 p-3 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>totalPrice to pay:</strong> ₹{totalPrice}
        </p>
      </div>
      <button
        onClick={handleUPIPayment}
        disabled={!upiId || isProcessing}
        className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay with UPI'}
      </button>
    </div>
  );
};

// Credit Card Component
const CreditCardPayment = ({ totalPrice, onSuccess }) => {
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const handleCardPayment = async () => {
    setIsProcessing(true);
    // Simulate card payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('Credit Card');
    }, 3000);
    BookingConfirm();

  };

  const isFormValid = cardData.number && cardData.expiry && cardData.cvv && cardData.name;

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Card Number</label>
        <input
          type="text"
          placeholder="1234 5678 9012 3456"
          value={cardData.number}
          onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
          <input
            type="text"
            placeholder="MM/YY"
            value={cardData.expiry}
            onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">CVV</label>
          <input
            type="text"
            placeholder="123"
            value={cardData.cvv}
            onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cardholder Name</label>
        <input
          type="text"
          placeholder="John Doe"
          value={cardData.name}
          onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div className="bg-green-50 p-3 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>totalPrice to pay:</strong> ₹{totalPrice}
        </p>
      </div>
      <button
        onClick={handleCardPayment}
        disabled={!isFormValid || isProcessing}
        className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Processing...' : 'Pay with Card'}
      </button>
    </div>
  );
};

// Net Banking Component
const NetBankingPayment = ({ totalPrice, onSuccess }) => {
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);


  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank',
    'Kotak Mahindra Bank', 'Punjab National Bank', 'Bank of Baroda', 'Canara Bank'
  ];

  const handleNetBankingPayment = async () => {
    if (!selectedBank) return;
    setIsProcessing(true);
    // Simulate net banking payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('Net Banking');
    }, 2500);
    BookingConfirm();

  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Select Your Bank</label>
        <select
          value={selectedBank}
          onChange={(e) => setSelectedBank(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="">Choose your bank</option>
          {banks.map(bank => (
            <option key={bank} value={bank}>{bank}</option>
          ))}
        </select>
      </div>
      <div className="bg-purple-50 p-3 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>totalPrice to pay:</strong> ₹{totalPrice}
        </p>
        <p className="text-xs text-purple-600 mt-1">
          You will be redirected to your bank's secure login page
        </p>
      </div>
      <button
        onClick={handleNetBankingPayment}
        disabled={!selectedBank || isProcessing}
        className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isProcessing ? 'Redirecting...' : 'Pay with Net Banking'}
      </button>
    </div>
  );
};

// Stripe Payment Component
const StripePayment = ({ totalPrice, onSuccess }) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleStripePayment = async () => {
    setIsProcessing(true);
    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess('Stripe');
    }, 2000);
    BookingConfirm();

  };

  return (
    <div className="space-y-4">
      <div className="bg-indigo-50 p-4 rounded-lg">
        <div className="flex items-center space-x-2 mb-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <span className="font-semibold text-indigo-900">Stripe Payment</span>
        </div>
        <p className="text-sm text-indigo-700">
          Secure international payment processing
        </p>
        <p className="text-sm text-indigo-800 mt-2">
          <strong>totalPrice to pay:</strong> ₹{totalPrice}
        </p>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-4">
          Click below to proceed with Stripe's secure checkout
        </p>
        <button
          onClick={handleStripePayment}
          disabled={isProcessing}
          className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Pay with Stripe'}
        </button>
      </div>
    </div>
  );
};

// Success Component
const PaymentSuccess = ({ method, totalPrice, transactionId }) => {
  const navigate = useNavigate();


  return (

    <div className="text-center space-y-6">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <Check className="w-10 h-10 text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h2>
        <p className="text-gray-600">Your payment has been processed successfully</p>
      </div>
      <div className="bg-gray-50 p-4 rounded-lg space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-semibold">{method}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">totalPrice Paid:</span>
          <span className="font-semibold">₹{totalPrice}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-semibold font-mono text-sm">{transactionId}</span>
        </div>
      </div>
      <button onClick={() => {
        navigate('/home')
      }} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
        Continue Booking
      </button>
    </div>
  )
};

// Main Payment Page Component
const Payment = () => {
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isCompleted, setIsCompleted] = useState(false);
  const [paymentResult, setPaymentResult] = useState(null);
  const totalPrice = useRecoilValue(totalPriceAtom);


  console.log(totalPrice);

  const orderDetails = {
    orderId: 'ORD-2024-001',
    items: ['Complete Charges for Property', 'Setup Fee'],
    total: totalPrice
  };

  const paymentMethods = [
    {
      id: 'upi',
      icon: <Smartphone className="w-5 h-5 text-blue-600" />,
      title: 'UPI Payment',
      description: 'Pay using any UPI app like GPay, PhonePe, Paytm'
    },
    {
      id: 'card',
      icon: <CreditCard className="w-5 h-5 text-green-600" />,
      title: 'Credit/Debit Card',
      description: 'Visa, Mastercard, RuPay cards accepted'
    },
    {
      id: 'netbanking',
      icon: <Building className="w-5 h-5 text-purple-600" />,
      title: 'Net Banking',
      description: 'Pay directly from your bank account'
    },
    {
      id: 'stripe',
      icon: <Globe className="w-5 h-5 text-indigo-600" />,
      title: 'Stripe',
      description: 'International payment gateway'
    }
  ];

  const handlePaymentSuccess = (method) => {
    const transactionId = `TXN${Date.now()}`;
    setPaymentResult({ method, totalPrice, transactionId });
    setIsCompleted(true);
  };

  const renderPaymentForm = () => {
    switch (selectedMethod) {
      case 'upi':
        return <UPIPayment totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />;
      case 'card':
        return <CreditCardPayment totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />;
      case 'netbanking':
        return <NetBankingPayment totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />;
      case 'stripe':
        return <StripePayment totalPrice={totalPrice} onSuccess={handlePaymentSuccess} />;
      default:
        return null;
    }
  };

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-6">
          <PaymentSuccess {...paymentResult} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center space-x-4 mb-4">
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Complete Payment</h1>
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>Order ID:</span>
                <span className="font-mono">{orderDetails.orderId}</span>
              </div>
              {orderDetails.items.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <span>{item}</span>
                  <span>₹{index === 0 ? totalPrice - 299 : 299}</span>
                </div>
              ))}
              <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                <span>Total totalPrice:</span>
                <span className="text-lg">₹{totalPrice}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Payment Method</h2>
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <PaymentMethod
                  key={method.id}
                  icon={method.icon}
                  title={method.title}
                  description={method.description}
                  isSelected={selectedMethod === method.id}
                  onClick={() => setSelectedMethod(method.id)}
                />
              ))}
            </div>

            {/* Security Note */}
            <div className="mt-6 p-3 bg-green-50 rounded-lg">
              <div className="flex items-center space-x-2 text-green-800">
                <Shield className="w-4 h-4" />
                <Lock className="w-4 h-4" />
                <span className="text-sm font-medium">Secure Payment</span>
              </div>
              <p className="text-xs text-green-700 mt-1">
                Your payment information is encrypted and secure
              </p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
            {selectedMethod ? (
              renderPaymentForm()
            ) : (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Select a payment method to continue</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;