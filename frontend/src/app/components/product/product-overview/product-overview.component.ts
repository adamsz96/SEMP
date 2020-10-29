import { Component, OnInit } from '@angular/core';
import { Product } from "../../../dtos/product";
import {ProductService} from "../../../services/product.service";

@Component({
  selector: 'app-product-overview',
  templateUrl: './product-overview.component.html',
  styleUrls: ['./product-overview.component.scss']
})
export class ProductOverviewComponent implements OnInit {

  private searchWord: string;

  private products: Product[];
  private filteredProducts: Product [];
  private error: boolean;
  private errorMessage: string;

  constructor(public productService: ProductService) { }

  ngOnInit() {
    if (this.products == undefined) {
      this.loadProducts();
    }
  }

  loadProducts() {
    this.productService.getProducts().subscribe((products: Product[]) => {
      this.products = products;
      this.filteredProducts = products;
    },
    error => {
      this.defaultServiceErrorHandling(error);
    });
  }

  defaultServiceErrorHandling(error: any) {
    console.log(error);
    this.error = true;
    if (error.error.message !== 'No message available') {
      this.errorMessage = error.error.message;
    } else {
      this.errorMessage = error.error.error;
    }
  }

  clear(){
    this.searchWord = '';
    this.filteredProducts = this.products;
  }

  filter() {
    let searchWord = this.searchWord.trim().toLowerCase();

    this.filteredProducts = this.products.filter((product) => {
      if ((product.name + '').toLowerCase().includes(searchWord)){
        return true;
      } else {
        return false;
      }
    });
  }

}
