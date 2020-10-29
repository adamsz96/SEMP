import {el} from "@angular/platform-browser/testing/src/browser_util";

export class Address {
  constructor(
    public street: String,
    public nr: number,
    public door: number,
    public city: String,
    public state: String,
    public zip: number
  ) {}

  includes(word: string){
    if(
      this.street.includes(word) ||
      this.nr.toString().includes(word) ||
      this.door.toString().includes(word) ||
      this.city.includes(word) ||
      this.state.includes(word) ||
      this.zip.toString().includes(word))
    {
      return true;
    } else {
      return false;
    }
  }
  }

