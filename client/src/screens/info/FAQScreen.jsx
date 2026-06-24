import Breadcrumb from '../../components/Breadcrumb';

export default function FAQScreen() {
  const faqs = [
    { q: "How long does delivery take?", a: "Most orders are delivered within 3-5 business days across India." },
    { q: "Do you offer Cash on Delivery?", a: "Yes, we offer Cash on Delivery (COD) on all orders." },
    { q: "Can I cancel my order?", a: "Orders can be cancelled before they are shipped. Once shipped, they cannot be cancelled, but you can return them." },
    { q: "How do I return an item?", a: "You can initiate a return within 7 days from the 'My Orders' section in your account." },
    { q: "Are the colors exactly as shown?", a: "We try our best to represent colors accurately, but slight variations may occur due to screen settings and lighting." },
  ];

  return (
    <div className="container-max px-4 py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-3xl mx-auto">
        <Breadcrumb pageName="FAQ" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10 text-center">Frequently Asked Questions</h1>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="card p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-2">{faq.q}</h3>
              <p className="text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
