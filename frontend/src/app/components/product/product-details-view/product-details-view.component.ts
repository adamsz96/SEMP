import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {Product} from "../../../dtos/product";
import {ProductService} from "../../../services/product.service";
import { ActivatedRoute } from '@angular/router';
import {Globals} from "../../../global/globals";
import {Location} from "@angular/common";
import * as $ from "jquery";
import {ToastrService} from "ngx-toastr";

@Component({
  selector: 'app-product-details-view',
  templateUrl: './product-details-view.component.html',
  styleUrls: ['./product-details-view.component.scss']
})
export class ProductDetailsViewComponent implements OnInit {

  @Input()
  public product: Product;

  public isNew: boolean;
  public editMode: boolean;

  private imageToDelete: string;

  constructor(private productService: ProductService,
              private route: ActivatedRoute,
              private location: Location,
              public globals: Globals,
              public toastr: ToastrService) { }

  ngOnInit() {
    this.getProduct();
  }

  isValid(): boolean {
    if (this.product.name.length == 0) {
      this.toastr.error("Product name has to be set");
      return false;
    }

    if (this.product.pricePerUnit <= 0 || this.product.pricePerUnit > 320928000) {
      this.toastr.error("Product price has to be between 0 (exclusive) and 320 928 000 (inclusive)");
      return false;
    }
    return true;
  }

  getProduct() {
    this.isNew = +this.route.toString().indexOf("new") != -1;

    if (this.isNew) {
      this.product = new Product(undefined, "", "", false, false, false, false, 1, [], null);
      this.editMode = true;
    } else {
      this.editMode = false;
      const id = +this.route.snapshot.paramMap.get('id');
      this.productService.getProduct(id).subscribe((product: Product) => {
        this.product = product;
      }, _ => {
        this.toastr.error("Error while getting product details");
      });
    }
  }

  copy() {
    this.productService.copyProduct(this.product.id).subscribe((product: Product) => {
      this.location.go("/product/"+product.id);
      this.product = product;
      this.editMode = true;
    }, _ => {
      this.toastr.error("Error while copying product");
    });
  }

  save() {
    if (!this.isValid()) {
      return;
    }

    if (this.product.id == undefined) {
      this.productService.createProduct(this.product).subscribe( (product: Product) => {
        this.product = product;
        this.editMode = false;
        this.isNew = false;
        this.location.go("/product/"+product.id);
      }, _ => {
        this.toastr.error("Error while creating product");
      });
    } else {
      this.productService.saveProduct(this.product).subscribe((product: Product) => {
        this.product = product;
        this.editMode = false;
      }, _ => {
        this.toastr.error("Error while saving product");
      });
    }
  }

  addImages(event) {
    const files = event.target.files;
    for (let file of files) {
      if (file.type.startsWith("image")) {
        this.addImage(file);
      }
    }
  }

  addImage(file: File) {
    this.productService.addImage(this.product.id, file).subscribe( (path: string) => {
      this.product.images = this.product.images.concat(path);
    }, _ => {
      //Why is there always an error?
      //this.toastr.error("Error while adding image");
    });
  }

  showImageDialog(image: string) {
    this.imageToDelete = image;
    $("#image_delete_dialog").show();
  }

  deleteImageDialog() {
    this.deleteImage(this.imageToDelete);
    this.closeDialog();
  }

  closeDialog() {
    $("#image_delete_dialog").hide();
  }

  private deleteImage(image: string) {
    this.productService.removeImage(this.product.id, image).subscribe( () => {
      this.product.images = this.product.images.filter(i => i != image);
    }, _ => {
      this.toastr.error("Error while deleting image");
    });
  }
}
