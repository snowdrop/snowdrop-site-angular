import { Injectable } from "@angular/core";
import { AsciidocIndex } from "../wizard/components/asciidoc/asciidoc.index";

let adocIndex = require('../../assets/adoc.index');

@Injectable()
export class LaunchAdocIndex extends AsciidocIndex {

	constructor() {
		super();
		let index = new Map<string, string>();
		Object.keys(adocIndex).forEach(key => {
			index.set(key, adocIndex[key]);
		});
		super.set(index);
	}
}
