import { useQuery } from '@tanstack/react-query';
import { getMyOrders, getOrderById } from '../api/orders';

export const useMyOrders = () => {
  return useQuery({
    queryKey: ['orders', 'my'],
    queryFn: () => getMyOrders().then((res) => res.data),
  });
};

export const useOrder = (id) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(id).then((res) => res.data),
    enabled: !!id,
  });
};

export default useMyOrders;
