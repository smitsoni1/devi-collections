import { Link } from 'react-router-dom';

export default function PromoBanners() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-12">
      {/* Banner 1 */}
      <Link to="/?category=Sarees" className="group relative h-80 rounded-2xl overflow-hidden bg-gray-900 shadow-sm hover:shadow-xl transition-shadow">
        <img 
          src="https://picsum.photos/seed/promo1/800/800" 
          alt="Sarees Collection"
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <p className="text-brand-300 font-medium tracking-widest uppercase text-sm mb-2">New Arrivals</p>
          <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:-translate-y-1 transition-transform">Premium Sarees</h3>
          <p className="text-gray-300 text-sm group-hover:text-white transition-colors">Starting from ₹999</p>
        </div>
      </Link>

      {/* Banner 2 */}
      <Link to="/?category=Kurtis" className="group relative h-80 rounded-2xl overflow-hidden bg-gray-900 shadow-sm hover:shadow-xl transition-shadow">
        <img 
          src="https://picsum.photos/seed/promo2/800/800" 
          alt="Kurtis Collection"
          className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-8 w-full">
          <p className="text-brand-300 font-medium tracking-widest uppercase text-sm mb-2">Bestsellers</p>
          <h3 className="text-3xl font-display font-bold text-white mb-2 group-hover:-translate-y-1 transition-transform">Designer Kurtis</h3>
          <p className="text-gray-300 text-sm group-hover:text-white transition-colors">Up to 50% Off</p>
        </div>
      </Link>
    </div>
  );
}
