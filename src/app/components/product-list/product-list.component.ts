import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];
  categories: string[] = [];
  
  // Search and filter properties
  searchQuery: string = '';
  selectedCategory: string = '';
  priceRange: number = 1000;
  sortBy: string = 'name';
  
  // UI State
  isLoading: boolean = false;
  showFilters: boolean = false;
  itemsPerPage: number = 9;
  currentPage: number = 1;

  constructor(
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  /**
   * Load all products from service
   */
  loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts().subscribe(
      (data: any[]) => {
        this.products = data;
        this.extractCategories();
        this.applyFilters();
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      }
    );
  }

  /**
   * Extract unique categories from products
   */
  private extractCategories(): void {
    const categorySet = new Set(this.products.map(p => p.category));
    this.categories = Array.from(categorySet).sort();
  }

  /**
   * Apply all filters and search
   */
  applyFilters(): void {
    let filtered = [...this.products];

    // Apply search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (this.selectedCategory) {
      filtered = filtered.filter(product => product.category === this.selectedCategory);
    }

    // Apply price range filter
    filtered = filtered.filter(product => product.price <= this.priceRange);

    // Apply sorting
    filtered = this.sortProducts(filtered);

    this.filteredProducts = filtered;
    this.currentPage = 1; // Reset to first page
  }

  /**
   * Sort products based on selected sort option
   */
  private sortProducts(products: any[]): any[] {
    const sorted = [...products];

    switch (this.sortBy) {
      case 'name':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price_low':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price_high':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        sorted.reverse();
        break;
      default:
        return sorted;
    }

    return sorted;
  }

  /**
   * Search products by query
   */
  onSearch(query: string): void {
    this.searchQuery = query;
    this.applyFilters();
  }

  /**
   * Filter by category
   */
  onCategoryChange(category: string): void {
    this.selectedCategory = category === this.selectedCategory ? '' : category;
    this.applyFilters();
  }

  /**
   * Update price range filter
   */
  onPriceChange(price: number): void {
    this.priceRange = price;
    this.applyFilters();
  }

  /**
   * Change sort order
   */
  onSortChange(sortOption: string): void {
    this.sortBy = sortOption;
    this.applyFilters();
  }

  /**
   * Clear all filters
   */
  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.priceRange = 1000;
    this.sortBy = 'name';
    this.applyFilters();
  }

  /**
   * Toggle filters visibility
   */
  toggleFilters(): void {
    this.showFilters = !this.showFilters;
  }

  /**
   * Get paginated products
   */
  getPaginatedProducts(): any[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredProducts.slice(startIndex, startIndex + this.itemsPerPage);
  }

  /**
   * Get total pages
   */
  getTotalPages(): number {
    return Math.ceil(this.filteredProducts.length / this.itemsPerPage);
  }

  /**
   * Go to next page
   */
  nextPage(): void {
    if (this.currentPage < this.getTotalPages()) {
      this.currentPage++;
      window.scrollTo(0, 0);
    }
  }

  /**
   * Go to previous page
   */
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      window.scrollTo(0, 0);
    }
  }

  /**
   * Add product to cart
   */
  addToCart(product: any): void {
    this.cartService.addToCart(product);
    alert(`${product.name} added to cart!`);
  }
}