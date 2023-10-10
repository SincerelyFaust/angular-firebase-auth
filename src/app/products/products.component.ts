import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild,
} from '@angular/core';
import { ProductService } from '../shared/services/ProductService';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

type Products = Array<Product>;

interface PriceValidationError {
  invalidPrice: boolean;
}

type PriceValidatorFn = (
  control: AbstractControl
) => PriceValidationError | null;

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
})
export class ProductsComponent implements OnInit {
  products: Products = [];
  isModalOpen = false;
  productForm: FormGroup;
  hasFormError = false;

  @ViewChild('modal')
  modal!: ElementRef;
  @ViewChild('toggleButton')
  toggleButton!: ElementRef;

  constructor(
    private productService: ProductService,
    private fb: FormBuilder,
    private renderer: Renderer2
  ) {
    this.productForm = this.fb.group({
      productName: ['', [Validators.required, Validators.maxLength(32)]],
      productPrice: ['', [Validators.required, this.priceValidator()]],
      productDesc: ['', [Validators.required, Validators.maxLength(160)]],
    });

    this.renderer.listen('window', 'click', (e: Event) => {
      if (
        e.target !== this.toggleButton.nativeElement &&
        e.target !== this.modal.nativeElement &&
        !this.modal.nativeElement.contains(e.target)
      ) {
        this.isModalOpen = false;
      }
    });
  }

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
    this.productForm.markAllAsTouched();

    if (this.productForm.valid) {
      const productData = {
        name: this.productForm.get('productName')?.value,
        price: this.productForm.get('productPrice')?.value,
        description: this.productForm.get('productDesc')?.value,
        id: this.highestId(),
      };

      this.productService.addProduct(productData).subscribe({
        next: v => {
          this.products.push(productData);
          console.log('Product added successfully:', v);
          this.toggleModal();
        },
        error: e => {
          this.hasFormError = true;
          console.error(e);
        },
      });
    }
  }

  highestId(): number {
    let highestId = 0;
    for (const product of this.products) {
      if (product.id > highestId) {
        highestId = product.id;
      }
    }
    return highestId + 1;
  }

  get nameControl(): AbstractControl | null {
    return this.productForm.get('productName');
  }

  get priceControl(): AbstractControl | null {
    return this.productForm.get('productPrice');
  }

  get descriptionControl(): AbstractControl | null {
    return this.productForm.get('productDesc');
  }

  priceValidator(): PriceValidatorFn {
    return (control: AbstractControl): PriceValidationError | null => {
      const price = control.value;

      if (price === null || price === undefined) {
        return null;
      }

      const numberIsNotZero = price > 0;

      if (numberIsNotZero) {
        return null;
      }

      return { invalidPrice: true };
    };
  }

  toggleModal() {
    this.productForm.reset();
    this.isModalOpen = !this.isModalOpen;
  }
}
