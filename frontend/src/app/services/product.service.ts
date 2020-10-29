import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../global/globals';
import {Product} from "../dtos/product";
import {Task} from "../dtos/task";
import {ProductConfiguration} from "../dtos/productConfiguration";
import {SimpleTask} from "../dtos/simpletask";

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productBaseUrl: string = this.globals.backendUri + '/product';

  constructor(private httpClient: HttpClient, private globals: Globals) {
  }

  getProducts(): Observable<Product[]> {
    console.log('Get all products')
    return this.httpClient.get<Product[]>(this.productBaseUrl);
  }

  getProduct(id: number): Observable<Product> {
    console.log('Load product details for ' + id);
    return this.httpClient.get<Product>(this.productBaseUrl + '/' + id);
  }

  saveProduct(product: Product): Observable<Product> {
    console.log('Save product with id '+product.id);
    return this.httpClient.put<Product>(this.productBaseUrl, product);
  }

  createProduct(product: Product): Observable<Product> {
    console.log('Create product');
    return this.httpClient.post<Product>(this.productBaseUrl, product);
  }

  addImage(id: number, file: File): Observable<string> {
    console.log("Add image for product with id "+id);
    const formData = new FormData();
    formData.append('file', file, file.name);
    return this.httpClient.post<string>(this.productBaseUrl + '/' + id + '/image', formData);
  }

  removeImage(id: number, path: string): Observable<any> {
    console.log("Remove image "+ path +" for product with id " + id);
    return this.httpClient.delete<any>(this.productBaseUrl + '/' + id + '/image?path=' + path);
  }

  addSimpleTaskForProduct(task: SimpleTask, product: Product): Observable<SimpleTask> {
    console.log("Add task for product with id "+product.id);
    return this.httpClient.post<SimpleTask>(this.productBaseUrl + '/' + product.id + '/task', task);
  }

  updateSimpleTaskForProduct(task: SimpleTask, product: Product): Observable<SimpleTask> {
    console.log("Update task with id "+task.id+" for product with id "+product.id);
    return this.httpClient.put<SimpleTask>(this.productBaseUrl + '/' + product.id + '/task', task);
  }

  copyProduct(id: number): Observable<Product> {
    console.log("Copy product with id "+id);
    return this.httpClient.post<Product>(this.productBaseUrl + '/copy' + '/' + id, {});
  }

  getProductConfiguration(id: number): Observable<ProductConfiguration> {
    console.log('Load productConfiguration details for ' + id);
    return this.httpClient.get<ProductConfiguration>(this.productBaseUrl + '/configurations/' + id);
  }

  saveProductConfiguration(productConfiguration: ProductConfiguration): Observable<ProductConfiguration> {
    console.log('Save productConfiguration with id '+ productConfiguration.id);
    return this.httpClient.post<ProductConfiguration>(this.productBaseUrl + '/configurations', productConfiguration);
  }

  updateProductConfiguration(productConfiguration: ProductConfiguration): Observable<ProductConfiguration> {
    console.log("Update productConfiguration with id " + productConfiguration.id);
    return this.httpClient.put<ProductConfiguration>(this.productBaseUrl + '/configurations', productConfiguration);
  }
}
