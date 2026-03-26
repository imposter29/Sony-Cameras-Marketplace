import { useState } from 'react';

const ProductGallery = ({ images = [] }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-sony-light flex items-center justify-center">
        <p className="text-sony-mid">No images available</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="aspect-square overflow-hidden bg-sony-light/30">
        <img
          src={images[activeIndex]}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex space-x-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-16 h-16 overflow-hidden border-2 transition-colors ${
                index === activeIndex
                  ? 'border-sony-black'
                  : 'border-sony-light hover:border-sony-mid'
              }`}
            >
              <img
                src={img}
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
