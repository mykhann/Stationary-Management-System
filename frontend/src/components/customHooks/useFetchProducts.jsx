import axios from 'axios';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setProducts } from '../../reduxStore/productSlice';
import BASE_URL from '../../apiConfig.js';

const useFetchProducts = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${BASE_URL}/api/v1/item/get`, {
          withCredentials: true,
        });

        if (res.data.success) {
          dispatch(setProducts(res.data.items));
        } else {
          setError("Failed to fetch products");
        }
      } catch (err) {
        setError(err.message || "Unknown error");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return { loading, error };
};

export default useFetchProducts;
