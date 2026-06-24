import { FiCheck } from 'react-icons/fi';

const steps = ['Shipping', 'Payment', 'Place Order'];

export default function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, index) => {
        const stepNum = index + 1;
        const isDone = stepNum < currentStep;
        const isActive = stepNum === currentStep;

        return (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm transition-all duration-300 ${
                  isDone
                    ? 'bg-emerald-500 text-white shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                    : isActive
                    ? 'bg-brand-gradient text-white shadow-brand'
                    : 'bg-white border border-gray-300 text-gray-400'
                }`}
              >
                {isDone ? <FiCheck className="w-4 h-4" /> : stepNum}
              </div>
              <span
                className={`text-xs mt-1.5 font-medium ${
                  isActive ? 'text-brand-700' : isDone ? 'text-emerald-600' : 'text-gray-500'
                }`}
              >
                {step}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-16 sm:w-24 mx-2 rounded transition-all duration-500 ${
                  isDone ? 'bg-emerald-500' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
