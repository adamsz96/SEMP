import {Component, Input, OnInit} from '@angular/core';
import {Product} from "../../../dtos/product";
import {Globals} from "../../../global/globals";

@Component({
  selector: 'app-product-overview-item',
  templateUrl: './product-overview-item.component.html',
  styleUrls: ['./product-overview-item.component.scss']
})
export class ProductOverviewItemComponent implements OnInit {

  @Input()
  public product: Product;

  constructor(public globals: Globals) { }

  ngOnInit() {
  }

  getProductThumbnail(): string {
    var image = "placeholder.jpg";
    if (this.product.images.length > 0) {
      image = this.product.images[0];
    }
    return this.globals.productImagesPath+image;
  }

}
