export default function PrivacyScreen() {
  return (
    <div className="container-max px-4 py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Privacy Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-600 space-y-4">
          <p className="text-sm text-gray-500 mb-8">Last Updated: January 1, 2026</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Information We Collect</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact customer support. This includes your name, email, shipping address, and phone number.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. How We Use Your Information</h2>
          <p>We use the information to process your orders, send order confirmations, provide customer service, and communicate with you about products and offers.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Payment Security</h2>
          <p>All payment information is processed securely through our payment gateway partners (e.g., Razorpay). We do not store your credit card or full payment details on our servers.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Cookies</h2>
          <p>We use cookies to keep track of your cart and to improve your browsing experience. You can choose to disable cookies through your browser settings.</p>
        </div>
      </div>
    </div>
  );
}
