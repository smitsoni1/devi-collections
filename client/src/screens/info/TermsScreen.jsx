export default function TermsScreen() {
  return (
    <div className="container-max px-4 py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Terms of Service</h1>
        <div className="prose prose-brand max-w-none text-gray-600 space-y-4">
          <p className="text-sm text-gray-500 mb-8">Last Updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Acceptance of Terms</h2>
          <p>By accessing and using Devi Collections, you accept and agree to be bound by the terms and provision of this agreement.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Products and Pricing</h2>
          <p>All products listed on the website are subject to availability. We reserve the right to modify prices or discontinue products at any time without notice.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Intellectual Property</h2>
          <p>The content, organization, graphics, and other matters related to the website are protected under applicable copyrights and trademarks.</p>
        </div>
      </div>
    </div>
  );
}
