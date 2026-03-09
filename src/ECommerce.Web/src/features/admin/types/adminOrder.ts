import type { OrderStatus } from '../../ordering/types/order';

export interface UpdateOrderStatusRequest {
    orderId: string;
    newStatus: OrderStatus;
}
