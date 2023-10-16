'use client';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js'; // Added this import
import CheckoutPage from "../components/PaymentForm";

const stripePromise = loadStripe(
    "pk_test_51NC5BXDIUrkNaf9dHkIeQvMAnF2zUG3W4JKq6U8hutlpG7GS6Gz2IY0O7VNYHzNZIRHAI96ekynuzHBawJgk5QPb00rrsgaFQG"
);

const Page = () => {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const openCheckout = () => {
    setIsCheckoutOpen(true);
  };

  if (isCheckoutOpen) {
    return <CheckoutPage />;
  }

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-2xl font-bold">Monthly Subscription</h2>
        <p>Get access to our premium content with a monthly subscription. This include unlimited character generations!</p>
        <p>Only 3 USD per month.</p>
      </div>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={openCheckout}>Subscribe Now</button>
    </div>
  );
};

export default Page;
