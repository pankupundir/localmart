import Image from 'next/image';
import Link from 'next/link';

export default function ShopCard({ shop }) {
  return (
    <Link href={`/shop/${shop.id}`} className="group bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      <div className="relative h-36 overflow-hidden bg-gray-100">
        <Image
          src={shop.image}
          alt={shop.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${shop.isOpen ? 'bg-primary-500 text-white' : 'bg-gray-500 text-white'}`}>
            {shop.isOpen ? 'Open' : 'Closed'}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 group-hover:text-primary-700 transition-colors">{shop.name}</h3>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          {shop.location}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-sm">★</span>
            <span className="text-sm font-medium text-gray-700">{shop.rating}</span>
            <span className="text-xs text-gray-400">({shop.totalReviews})</span>
          </div>
          <div className="flex gap-1 flex-wrap justify-end">
            {shop.tags?.slice(0, 2).map(tag => (
              <span key={tag} className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full">{tag}</span>
            ))}
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-1">{shop.openTime} – {shop.closeTime}</p>
      </div>
    </Link>
  );
}
