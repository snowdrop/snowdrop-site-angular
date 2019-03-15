import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable()
export class GeneratorService {

  constructor(
    private http: HttpClient,
  ) {
  }

  private _ready: Promise<GeneratorService> = null;
  private serviceURL = "https://generator.snowdrop.me";

  ngOnInit(): void {
    this.ready();
  }

  public ready() {
    if (!this._ready) {
      console.log("Site configuration starting up.");
      this._ready = Promise.resolve(this);
    }
    return this._ready;
  }

  public getGeneratorConfig(): Observable<Config> {
    return this.http.get<Config>(this.serviceURL + "/config");
  }

  public getModulesFor(version: string): Observable<Module[]> {
    return this.http.get<Module[]>(this.serviceURL + "/modules/" + version)
  }

  public generate(opts: {
    template?: string
    dependencies?: any
  } = {}) {

    if (!opts.template) {
      opts.template = "simple";
    }

    if (opts.template && opts.template !== "simple") {
      opts.dependencies = undefined;
    }

    let query = "";
    let queryStarted = false;
    for (let key of Object.keys(opts)) {
      let value = opts[key];
      console.log("Key", key, "Value", value);
      if (value && (value.length > 0 || (value.trim && value.trim().length > 0))) {
        if (queryStarted) {
          query += "&";
        } else {
          query += "?";
        }
        if (Array.isArray(value)) {
          for (let i = 0; i < value.length; i++) {
            const v = value[i];
            query += `${key}=${v}`;
            if (i < value.length - 1) {
              query += "&";
            }
          }
        } else {
          query += `${key}=${value}`;
        }
        queryStarted = true;
      }
    }

    let finalURL = `${this.serviceURL}/app` + query;
    console.log("Generator URL", finalURL);
    window.open(finalURL, "_blank");

    // http://spring-boot-generator.195.201.87.126.nip.io/template/simple
    // ?artifactId=ocool
    // &bomVersion=1.5.15.Final
    // &dependencies=web
    // &groupId=org.acme.cool
    // &outDir=&packageName=me.snowdrop.cool
    // &springbootVersion=1.5.15.RELEASE
    // &version=1.0.0
  }
}

interface Config {
  templates: Template[];
  bomversions: BOM[];
  modules: Module[];
}

export interface Template {
  name: string;
  description: string;
}

interface Dependency {
  groupId: string;
  artifactId: string;
  scope: string;
  version: string;
  type: string;
}

export class Module {
  constructor(m: Module) {
    this.name = m.name;
    this.description = m.description;
    this.dependencies = m.dependencies;
    this.guide_ref = m.guide_ref;
    this.tags = m.tags;
  }

  name: string;
  description: string;
  guide_ref: string;
  dependencies: Dependency[];
  tags: string[];
}

interface BOM {
  community: string;
  snowdrop: string;
  supported: string;
  default: boolean;
}
