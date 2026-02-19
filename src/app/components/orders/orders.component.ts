import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

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

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders: Order[] = [];
  isLoading: boolean = true;
  selectedOrder: Order | null = null;
  errorMessage: string = '';

  constructor(
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.paymentService.getOrderHistory().subscribe(
      (data: Order[]) => {
        this.orders = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading orders:', error);
        this.errorMessage = 'Failed to load orders. Please try again.';
        this.isLoading = false;
        // Mock data for testing
        this.orders = this.getMockOrders();
      }
    );
  }

  selectOrder(order: Order): void {
    this.selectedOrder = this.selectedOrder?.id === order.id ? null : order;
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'pending':
        return 'badge-warning';
      case 'confirmed':
        return 'badge-info';
      case 'shipped':
        return 'badge-primary';
      case 'delivered':
        return 'badge-success';
      case 'cancelled':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  getTotalSpent(): number {
    return this.orders.reduce((sum, order) => sum + order.totalAmount, 0);
  }

  continueShopping(): void {
    this.router.navigate(['/products']);
  }

  cancelOrder(orderId: number): void {
    if (confirm('Are you sure you want to cancel this order?')) {
      this.paymentService.cancelOrder(orderId).subscribe(
        () => {
          alert('Order cancelled successfully');
          this.loadOrders();
          this.selectedOrder = null;
        },
        (error: any) => {
          alert('Failed to cancel order: ' + error.message);
        }
      );
    }
  }

  downloadInvoice(orderId: number): void {
    this.paymentService.downloadInvoice(orderId).subscribe(
      (data: Blob) => {
        const url = window.URL.createObjectURL(data);
        const link = document.createElement('a');
        link.href = url;
        link.download = `order-${orderId}-invoice.pdf`;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      (error: any) => {
        alert('Failed to download invoice');
      }
    );
  }

  // Mock data for demonstration
  private getMockOrders(): Order[] {
    return [
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
}
