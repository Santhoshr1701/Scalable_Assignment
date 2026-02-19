import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface OrderItem {
  productName: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: number;
  orderDate: Date;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  items: OrderItem[];
  deliveryAddress: string;
  deliveryDate?: Date;
  trackingNumber?: string;
}

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private orders: Order[] = [];
  private orderCounter: number = 1001;

  constructor() {
    this.initializeMockOrders();
  }

  /**
   * Process payment for order
   */
  processPayment(paymentData: any): Observable<any> {
    // Simulate payment processing
    const response = {
      success: true,
      message: 'Payment processed successfully',
      orderId: this.orderCounter++
    };
    return of(response).pipe(delay(1500));
  }

  /**
   * Get order history for current user
   */
  getOrderHistory(): Observable<Order[]> {
    return of(this.orders).pipe(delay(800));
  }

  /**
   * Get single order details
   */
  getOrderDetails(orderId: number): Observable<Order | undefined> {
    const order = this.orders.find(o => o.id === orderId);
    return of(order).pipe(delay(500));
  }

  /**
   * Cancel an order
   */
  cancelOrder(orderId: number): Observable<any> {
    const order = this.orders.find(o => o.id === orderId);
    if (order && order.status !== 'delivered' && order.status !== 'cancelled') {
      order.status = 'cancelled';
      return of({ success: true, message: 'Order cancelled successfully' }).pipe(delay(1000));
    }
    return of({ success: false, message: 'Cannot cancel this order' }).pipe(delay(1000));
  }

  /**
   * Download invoice for an order
   */
  downloadInvoice(orderId: number): Observable<Blob> {
    // Mock invoice generation
    const invoiceContent = this.generateInvoiceContent(orderId);
    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    return of(blob).pipe(delay(1000));
  }

  /**
   * Track order
   */
  trackOrder(orderId: number): Observable<any> {
    const order = this.orders.find(o => o.id === orderId);
    if (order) {
      return of({
        orderId: order.id,
        status: order.status,
        trackingNumber: order.trackingNumber,
        currentLocation: this.getLocationByStatus(order.status),
        estimatedDelivery: order.deliveryDate
      }).pipe(delay(500));
    }
    return of(null).pipe(delay(500));
  }

  /**
   * Create a new order from cart
   */
  createOrder(cartItems: any, deliveryAddress: string, paymentMethod: string): Observable<Order> {
    const newOrder: Order = {
      id: this.orderCounter++,
      orderDate: new Date(),
      totalAmount: cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0),
      status: 'confirmed',
      items: cartItems.map((item: any) => ({
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.price * item.quantity
      })),
      deliveryAddress: deliveryAddress,
      deliveryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
      trackingNumber: this.generateTrackingNumber()
    };

    this.orders.push(newOrder);
    return of(newOrder).pipe(delay(1000));
  }

  /**
   * Initialize mock orders for demonstration
   */
  private initializeMockOrders(): void {
    this.orders = [
      {
        id: 1001,
        orderDate: new Date('2024-02-10'),
        totalAmount: 299.98,
        status: 'delivered',
        items: [
          { productName: 'Wireless Headphones', quantity: 1, price: 149.99, total: 149.99 },
          { productName: 'Portable SSD', quantity: 1, price: 129.99, total: 129.99 }
        ],
        deliveryAddress: '123 Main Street, Boston, MA 02101',
        deliveryDate: new Date('2024-02-12'),
        trackingNumber: 'TRK123456789'
      },
      {
        id: 1002,
        orderDate: new Date('2024-02-08'),
        totalAmount: 179.99,
        status: 'shipped',
        items: [
          { productName: 'Mechanical Keyboard', quantity: 1, price: 179.99, total: 179.99 }
        ],
        deliveryAddress: '123 Main Street, Boston, MA 02101',
        deliveryDate: new Date('2024-02-15'),
        trackingNumber: 'TRK987654321'
      },
      {
        id: 1003,
        orderDate: new Date('2024-02-05'),
        totalAmount: 599.97,
        status: 'delivered',
        items: [
          { productName: 'Smart Watch', quantity: 1, price: 299.99, total: 299.99 },
          { productName: '4K Webcam', quantity: 1, price: 199.99, total: 199.99 }
        ],
        deliveryAddress: '123 Main Street, Boston, MA 02101',
        deliveryDate: new Date('2024-02-08'),
        trackingNumber: 'TRK555666777'
      }
    ];
  }

  /**
   * Generate tracking number
   */
  private generateTrackingNumber(): string {
    return 'TRK' + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  /**
   * Generate invoice content
   */
  private generateInvoiceContent(orderId: number): string {
    const order = this.orders.find(o => o.id === orderId);
    if (!order) return 'Order not found';

    let content = `INVOICE\n`;
    content += `=====================================\n`;
    content += `Order ID: ${order.id}\n`;
    content += `Date: ${order.orderDate.toLocaleDateString()}\n`;
    content += `Status: ${order.status}\n`;
    content += `\nITEMS:\n`;
    content += `-------------------------------------\n`;

    order.items.forEach(item => {
      content += `${item.productName}\n`;
      content += `  Qty: ${item.quantity} x $${item.price.toFixed(2)} = $${item.total.toFixed(2)}\n`;
    });

    content += `-------------------------------------\n`;
    content += `Total: $${order.totalAmount.toFixed(2)}\n`;
    content += `\nDelivery Address:\n`;
    content += `${order.deliveryAddress}\n`;

    return content;
  }

  /**
   * Get location based on order status
   */
  private getLocationByStatus(status: string): string {
    const locations: { [key: string]: string } = {
      'pending': 'Processing Center, NY',
      'confirmed': 'Distribution Center, NJ',
      'shipped': 'In Transit - Chicago, IL',
      'delivered': 'Delivered',
      'cancelled': 'Order Cancelled'
    };
    return locations[status] || 'Unknown';
  }
}