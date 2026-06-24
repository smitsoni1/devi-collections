import Breadcrumb from '../../components/Breadcrumb';

export default function ShippingPolicyScreen() {
  return (
    <div className="container-max px-4 py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <Breadcrumb pageName="Shipping Policy" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">Shipping Policy</h1>
        <div className="prose prose-brand max-w-none text-gray-600 space-y-4">
          <p className="text-lg font-medium text-gray-800">We strive to deliver your ethnic wear as quickly and safely as possible.</p>
          
          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">1. Delivery Timelines</h2>
          <p>Orders are typically processed within 24 hours. Delivery usually takes <strong>3-5 business days</strong> depending on your location in India.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">2. Shipping Charges</h2>
          <p>We offer <strong>Free Shipping</strong> on all orders above ₹999. For orders below ₹999, a nominal flat shipping fee of ₹50 is applied at checkout.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">3. Tracking Your Order</h2>
          <p>Once your order is shipped, you will receive an email and SMS with the tracking link. You can also track your order status directly from the "My Orders" section in your account.</p>

          <h2 className="text-xl font-bold text-gray-900 mt-8 mb-3">4. International Shipping</h2>
          <p>Currently, we only ship within India. We are working hard to bring Devi Collections to the rest of the world soon!</p>
        </div>
      </div>
    </div>
  );
}
