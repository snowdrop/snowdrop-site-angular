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


  private SDFALLBACK = JSON.parse(`{"templates":["crud","rest","simple"],"bomversions":[{"community":"1.5.15.RELEASE","snowdrop":"1.5.15.Final","default":true},{"community":"1.5.14.RELEASE","snowdrop":"1.5.14.Final","default":false},{"community":"1.5.13.RELEASE","snowdrop":"1.5.13.Final","default":false}],"modules":[{"name":"core","description":"Core dependencies of a Spring Boot application","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"web","description":"Web","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-web"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"websocket","description":"Websocket full-duplex communication and streaming of messages","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-websocket"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"jaxrs","description":"Apache CXF Starter implementing JAX-RS specification","guide_ref":"","dependencies":[{"groupid":"org.apache.cxf","artifactid":"cxf-spring-boot-starter-jaxrs"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"hibernate","description":"JPA \u0026 ORM with Hibernate","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-data-jpa"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-jdbc"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"monitoring","description":"Monitor and manage your application using Jolokia, Prometheus, ...","guide_ref":"","dependencies":[{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-actuator"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]},{"name":"integration","description":"Apache Camel Routing and Mediation framework","guide_ref":"","dependencies":[{"groupid":"org.apache.camel","artifactid":"camel-spring-boot-starter","version":"2.21.1"},{"groupid":"org.springframework.boot","artifactid":"spring-boot-starter-test","scope":"test"}]}]}`);
}

interface Config {
  templates: Template[];
  bomversions: BOM[];
  modules: Module[];
}

interface Template {
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
