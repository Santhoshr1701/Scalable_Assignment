import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private products = [
    {
      id: 1,
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation and 30-hour battery life',
      price: 149.99,
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop',
      category: 'Electronics',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Smart Watch',
      description: 'Advanced fitness tracking and health monitoring on your wrist',
      price: 299.99,
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop',
      category: 'Wearables',
      rating: 4.7
    },
    {
      id: 3,
      name: '4K Webcam',
      description: 'Crystal clear 4K video for streaming and video calls',
      price: 199.99,
      imageUrl: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&h=500&fit=crop',
      category: 'Electronics',
      rating: 4.3
    },
    {
      id: 4,
      name: 'Portable SSD',
      description: '1TB portable solid-state drive with USB-C connectivity',
      price: 129.99,
      imageUrl: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=500&h=500&fit=crop',
      category: 'Storage',
      rating: 4.6
    },
    {
      id: 5,
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with multiple ports for connectivity',
      price: 79.99,
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop',
      category: 'Accessories',
      rating: 4.2
    },
    {
      id: 6,
      name: 'Wireless Mouse',
      description: 'Comfortable ergonomic wireless mouse with precision tracking',
      price: 49.99,
      imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=500&h=500&fit=crop',
      category: 'Peripherals',
      rating: 4.1
    }
  ];

  getProducts(): Observable<any> {
    return of(this.products);
  }

  getProductById(id: any): Observable<any> {
    const product = this.products.find(p => p.id === parseInt(id));
    return of(product);
  }
}