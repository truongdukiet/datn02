import React, { useEffect, useState } from "react";
import ProductItem from "../../../../components/ProductItem/ProductItem";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  return (
    <div className="site-section">
      <div className="container">
        <h2 className="text-center mb-5">Sản phẩm yêu thích</h2>
        <div className="row">
          {favorites.length === 0 ? (
            <p className="text-center w-100">Chưa có sản phẩm yêu thích.</p>
          ) : (
            favorites.map((product) => (
              <div key={product.ProductID} className="col-lg-3 col-md-6 mb-4">
                <ProductItem product={product} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
