import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-product',
  template: `
    <div
      class="w-screen h-screen flex justify-center items-center px-4 md:px-8">
      <div
        class="flex flex-col items-start gap-5 justify-start rounded-lg border border-gray-100 p-4 sm:p-6 lg:p-8">
        <h2 class="text-lg font-bold text-gray-900 sm:text-xl">
          {{ product.name }}
        </h2>
        <p>€{{ product.price }}</p>
        <h3
          class="max-w-[40ch] max-h-[0ch] overflow-y-auto text-sm text-gray-500">
          {{ product.description }}
        </h3>
        <div class="w-full flex">
          <button
            class="py-2 flex-1 px-3 font-medium text-indigo-600 hover:text-indigo-500 duration-150 hover:bg-gray-50 rounded-lg">
            Edit
          </button>
          <button
            class="py-2 flex-1 leading-none px-3 font-medium text-red-600 hover:text-red-500 duration-150 hover:bg-gray-50 rounded-lg">
            Delete
          </button>
        </div>
      </div>
    </div>
  `,
})
export class ProductComponent implements OnInit {
  product: Product = {
    id: -1,
    name: '',
    price: -1,
    description: '',
  };

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      (await this.productService.fetchProducts()).subscribe({
        next: (productsData: Array<Product>) => {
          this.product = productsData.find(item => item.id === +id) as Product;
        },
      });
    }
  }
}
