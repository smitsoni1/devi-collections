export default function ReturnsScreen() {
  return (
    <div className="container-max px-4 py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Returns & Exchange Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-600 space-y-4">
          <p className="text-lg font-medium text-gray-800">We want you to love what you ordered! If something is not right, let us know.</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Return Window</h2>
          <p>You can return or exchange any unworn, unwashed, and undamaged items within <strong>7 days</strong> of delivery. All original tags must be attached.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Non-Returnable Items</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Customized or tailored garments</li>
            <li>Items marked as "Final Sale"</li>
          </ul>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. How to Initiate a Return</h2>
          <p>Log in to your account, go to "My Orders", and contact our support team with your Order ID. Our delivery partner will pick up the item within 2-3 business days.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. Refunds</h2>
          <p>Once we receive and inspect the returned item, a refund will be processed to your original payment method within 5-7 business days.</p>
        </div>
      </div>
    </div>
  );
}
