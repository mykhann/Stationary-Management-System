import React from 'react';
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from '@stripe/react-stripe-js';

const CARD_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#1f2937',
      '::placeholder': { color: '#9ca3af' },
    },
    invalid: { color: '#ef4444' },
  },
};

const PaymentForm = () => {
  return (
    <>
      <div className="mb-4">
        <label className="text-sm font-medium text-gray-700 mb-1">Card Number</label>
        <div className="border p-2 rounded bg-white">
          <CardNumberElement options={CARD_OPTIONS} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">Expiry</label>
          <div className="border p-2 rounded bg-white">
            <CardExpiryElement options={CARD_OPTIONS} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-gray-700 mb-1">CVC</label>
          <div className="border p-2 rounded bg-white">
            <CardCvcElement options={CARD_OPTIONS} />
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentForm;
