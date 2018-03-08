import {Injectable, OnInit, OnDestroy, ViewChild} from "@angular/core";
import {Http} from '@angular/http';

@Injectable()
export class RegistryService {

    constructor(
      private http: Http,
    ) {
    }

    private _ready: Promise<void> = null;
    private registry: any;

    ngOnInit(): void {
      this.ready();
    }

    public ready() {
      if(!this._ready) {
        console.log("RegistryService starting up.");
        this._ready = this.http.get("/registry.json").toPromise().then((res)=>{
          console.log("RegistryService initialized.");
          this.registry = res.json();
        }).catch((err)=>{
          return this.http.get("/src/assets/registry.json").toPromise().then((res)=>{
            console.log("RegistryService initialized.");
            this.registry = res.json();
          })
        });
      }
      return this._ready;
    }

    public getRegistry() {
      return this.ready().then(()=>{
        return this.registry;
      });
    }
}
