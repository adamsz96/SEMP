import {Injectable} from '@angular/core';

@Injectable()
export class Globals {
  readonly backendUri: string = 'http://localhost:8080';
  readonly productImagesPath: string = 'assets/product_images/';
  readonly currency='HUF';
  readonly vatPercent=0.27;
}
