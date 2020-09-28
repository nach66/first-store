import React from "react";
import axios from "axios";
import url from "../utils/URL";
import { featuredProducts, flatternProuducts } from "../utils/helpers";
export const ProductContext = React.createContext();

export default function ProductProvider({ children }) {
  const [loading, setLoading] = React.useState(false);
  const [products, setProducts] = React.useState([]);
  const [featured, setFeatured] = React.useState([]);

  React.useEffect(() => {
    setLoading(true);
    axios.get(`${url}/products`).then(response => {
      const featured = featuredProducts(flatternProuducts(response.data));
      const products = flatternProuducts(response.data);
      setProducts(products);
      setFeatured(featured);
      setLoading(false);
    });
    return () => {};
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading, featured }}>
      {children}
    </ProductContext.Provider>
  );
}
