import { CreditCard } from 'lucide-react';
import StepIndicator from '../components/checkout/StepIndicator';

const Checkout = () => {
  return (
    <div className="sony-container py-10">
      <h1 className="text-3xl font-display font-semibold mb-8">Checkout</h1>
      <StepIndicator currentStep={0} />

      <div className="mt-10 border border-sony-light p-12 text-center">
        <CreditCard size={48} className="mx-auto text-sony-light mb-4" />
        <p className="text-sony-mid text-lg mb-2">Checkout Flow</p>
        <p className="text-sm text-sony-mid">
          Complete checkout with address selection, payment method, and order review.
          This page is ready for feature implementation.
        </p>
      </div>
    </div>
  );
};

export default Checkout;
