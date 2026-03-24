import { useQuery } from '@tanstack/react-query';
import { getProducts, getFeaturedProducts, getProductBySlug, getCategories, getProductReviews } from '../api/products';

export const useProducts = (params) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params).then((res) => res.data),
  });
};

export const useFeaturedProducts = () => {
  return useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => getFeaturedProducts().then((res) => res.data),
  });
};

export const useProductBySlug = (slug) => {
  return useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug).then((res) => res.data),
    enabled: !!slug,
  });
};

export const useProduct = useProductBySlug;

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories().then((res) => res.data),
  });
};

export const useProductReviews = (productId) => {
  return useQuery({
    queryKey: ['reviews', productId],
    queryFn: () => getProductReviews(productId).then((res) => res.data),
    enabled: !!productId,
  });
};

export default useProducts;
