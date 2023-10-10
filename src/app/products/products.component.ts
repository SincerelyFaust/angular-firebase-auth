import { Component, OnInit } from '@angular/core';
import { ProductService } from '../shared/services/ProductService';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

type Products = Array<Product>;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: Products = [];

  constructor(private productService: ProductService) {}

  async ngOnInit(): Promise<void> {
    (await this.productService.fetchProducts()).subscribe({
      next: v => {
        this.products = v.sort((a, b) => a.id - b.id);
      },
      error: e => {
        console.error('Error fetching products:', e);
      },
    });
  }

  onAddProduct() {
    this.productService
      .addProduct({
        name: 'Product 3',
        id: 2,
        price: 3,
        description: 'Product 3 description',
      })
      .subscribe({
        next: v => {
          this.products.push({
            name: 'Product 3',
            id: 2,
            price: 3,
            description: 'Product 3 description',
          });
          console.log('Product added successfully:', v);
        },
        error: e => {
          console.error(e);
        },
      });
  }
}
