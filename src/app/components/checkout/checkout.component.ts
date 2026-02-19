import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  checkoutData = {
    name: '',
    email: '',
    address: ''
  };
  paymentSuccess = false;
  isProcessing = false;
  totalAmount: number = 0;
  cartItems: any[] = [];

  constructor(
    private cartService: CartService,
    private paymentService: PaymentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.totalAmount = this.cartService.getTotalAmount();
    this.cartItems = this.cartService.getCartItems();
  }

  onSubmit() {
    if (this.checkoutData.name && this.checkoutData.email && this.checkoutData.address) {
      this.isProcessing = true;
      this.paymentService.processPayment(this.checkoutData).subscribe(
        (response: any) => {
          this.isProcessing = false;
          this.paymentSuccess = true;
          
          // Create order in payment service
          this.paymentService.createOrder(
            this.cartItems,
            this.checkoutData.address,
            'credit_card'
          ).subscribe(
            (order: any) => {
              alert('Payment successful! Order #' + order.id + ' created.');
              this.cartService.clearCart();
              
              // Redirect to orders page after 2 seconds
              setTimeout(() => {
                this.router.navigate(['/orders']);
              }, 2000);
            },
            (error: any) => {
              alert('Failed to create order. Please contact support.');
              this.isProcessing = false;
            }
          );
        },
        (error: any) => {
          this.isProcessing = false;
          alert('Payment failed. Please try again.');
        }
      );
    } else {
      alert('Please fill in all required fields.');
    }
  }
}