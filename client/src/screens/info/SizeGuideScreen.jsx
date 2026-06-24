import Breadcrumb from '../../components/Breadcrumb';

export default function SizeGuideScreen() {
  return (
    <div className="container-max px-4 py-12 md:py-20 min-h-[60vh]">
      <div className="max-w-4xl mx-auto">
        <Breadcrumb pageName="Size Guide" />
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 text-center">Size Guide</h1>
        <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">
          Find your perfect fit with our easy-to-use measurement guide. All measurements are in inches.
        </p>
        
        <div className="overflow-x-auto card">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="py-4 px-6 font-bold text-gray-900">Size</th>
                <th className="py-4 px-6 font-bold text-gray-900">Bust (in)</th>
                <th className="py-4 px-6 font-bold text-gray-900">Waist (in)</th>
                <th className="py-4 px-6 font-bold text-gray-900">Hips (in)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-brand-600">XS</td>
                <td className="py-4 px-6 text-gray-600">32"</td>
                <td className="py-4 px-6 text-gray-600">26"</td>
                <td className="py-4 px-6 text-gray-600">36"</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-brand-600">S</td>
                <td className="py-4 px-6 text-gray-600">34"</td>
                <td className="py-4 px-6 text-gray-600">28"</td>
                <td className="py-4 px-6 text-gray-600">38"</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-brand-600">M</td>
                <td className="py-4 px-6 text-gray-600">36"</td>
                <td className="py-4 px-6 text-gray-600">30"</td>
                <td className="py-4 px-6 text-gray-600">40"</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-brand-600">L</td>
                <td className="py-4 px-6 text-gray-600">38"</td>
                <td className="py-4 px-6 text-gray-600">32"</td>
                <td className="py-4 px-6 text-gray-600">42"</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-brand-600">XL</td>
                <td className="py-4 px-6 text-gray-600">40"</td>
                <td className="py-4 px-6 text-gray-600">34"</td>
                <td className="py-4 px-6 text-gray-600">44"</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-4 px-6 font-medium text-brand-600">XXL</td>
                <td className="py-4 px-6 text-gray-600">42"</td>
                <td className="py-4 px-6 text-gray-600">36"</td>
                <td className="py-4 px-6 text-gray-600">46"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
