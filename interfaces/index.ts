// Interface para el cliente
export interface Customer {
  id: string;
  idType: string;
  name: string;
  address: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
  salespersonId: string | null;
}

// Interface para el vendedor
export interface Salesperson {
  id: string;
  name: string;
}

// Interface para productos en la orden
export interface OrderProduct {
  orderId: number;
  productId: number;
  quantity: number;
  priceAtOrder: number;
  product: Product;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  storageCondition: string;
  manufacturedId: string;
  createdAt: string;
  updatedAt: string;
}
// Interface para entrega
interface Delivery {
  id: number;
  estimatedDeliveryDate: string;
  actualDeliveryDate: string | null;
  status: string;
  trackingNumber: string | null;
  notes: string | null;
  address: string;
  createdAt: string;
  updatedAt: string;
  orderId: number;
  order: Order;
}

// Enum para el estado de la orden
export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  IN_PROGRESS = "in_progress",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

// Interface principal para la orden
export interface Order {
  id: number;
  status: OrderStatus | string;
  total: number;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  salespersonId: string | null;
  customer: Customer;
  salesperson: Salesperson | null;
  orderProducts: OrderProduct[];
  delivery: Delivery | null;
}

// Interface opcional para crear una nueva orden (sin campos auto-generados)
export interface CreateOrderRequest {
  customerId: string;
  products: {
    productId: number;
    quantity: number;
  }[];
}

// Interface para la respuesta de la API al crear/obtener órdenes
export interface OrderResponse {
  data: Order | Order[];
  error?: {
    message: string;
    code?: string;
  };
}
