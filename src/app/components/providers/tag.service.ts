import { Injectable, OnInit, OnDestroy } from "@angular/core";
import { ProjectDataService } from './project-data.service';

@Injectable()
export class TagService implements OnInit, OnDestroy {

	constructor(
		private projectService: ProjectDataService
	) {
	}

	ngOnDestroy() {
	}

	private _ready: Promise<void> = null;

	ngOnInit(): void {
		this.ready();
	}

	public ready() {
		if (!this._ready) {
			console.log("ProjectDataService starting up.");
			this._ready = this.projectService.ready();
		}
		return this._ready;
	}


	getBgColor(tag: string) {
		if (tag) {
			let project = this.projectService.getProjectByTag(tag);
			if (project) {
				return project.color;
			}
		}
		return null;
	}

	getColor(tag: string) {
		let color = this.getBgColor(tag);
		if (color) {
			return this.invert(color, true);
		}
		return null;
	}

	private BW_THRESHOLD = Math.sqrt(1.05 * 0.05) - 0.5;
	private RE_HEX = /^(?:[0-9a-f]{3}){1,2}$/i;
	private DEFAULT_BW_COLORS = {
		black: '#000000',
		white: '#ffffff'
	};

	private padz(str, len?) {
		len = len || 2;
		return (new Array(len).join('0') + str).slice(-len);
	}

	private toObj(c) {
		return { r: c[0], g: c[1], b: c[2] };
	}

	private hexToRGB(hex) {
		if (hex.slice(0, 1) === '#') hex = hex.slice(1);
		if (!this.RE_HEX.test(hex)) throw new Error(`Invalid HEX color: "${hex}"`);
		// normalize / convert 3-chars hex to 6-chars.
		if (hex.length === 3) {
			hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
		}
		return [
			parseInt(hex.slice(0, 2), 16), // r
			parseInt(hex.slice(2, 4), 16), // g
			parseInt(hex.slice(4, 6), 16)  // b
		];
	}

	// c = String (hex) | Array [r, g, b] | Object {r, g, b}
	private toRGB(c) {
		if (!c) {
			throw new Error('Invalid color value');
		}
		if (Array.isArray(c)) return c;
		return typeof c === 'string' ? this.hexToRGB(c) : [c.r, c.g, c.b];
	}

	// http://stackoverflow.com/a/3943023/112731
	private getLuminance(c) {
		let i, x;
		const a = []; // so we don't mutate
		for (i = 0; i < c.length; i++) {
			x = c[i] / 255;
			a[i] = x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4);
		}
		return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
	}

	private invertToBW(color, bw, asArr?) {
		const colors = (bw === true)
			? this.DEFAULT_BW_COLORS
			: (<any>Object).assign({}, this.DEFAULT_BW_COLORS, bw);
		return this.getLuminance(color) > this.BW_THRESHOLD
			? (asArr ? this.hexToRGB(colors.black) : colors.black)
			: (asArr ? this.hexToRGB(colors.white) : colors.white);
	}

	private invert(color, bw?) {
		color = this.toRGB(color);
		if (bw) return this.invertToBW(color, bw);
		return '#' + color.map(c => this.padz((255 - c).toString(16))).join('');
	}

	private invertAsRgbArray = (color, bw) => {
		color = this.toRGB(color);
		return bw ? this.invertToBW(color, bw, true) : color.map(c => 255 - c);
	};

	private invertAsRgbObject = (color, bw) => {
		color = this.toRGB(color);
		return this.toObj(bw ? this.invertToBW(color, bw, true) : color.map(c => 255 - c));
	};
}
