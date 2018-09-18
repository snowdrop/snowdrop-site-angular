import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { distinctUntilChanged } from 'rxjs/operators';

@Component({
	selector: 'body',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent {
	@HostBinding('class.cards-pf') private intro: boolean;

	constructor(private router: Router, private route: ActivatedRoute) {
		// router.events.subscribe((url: any) => {
		// 	this.intro = url.url !== '/' && url.url !== '/wizard';
		// 	window.scrollTo(0, 0);
		// });

		router.events.pipe(distinctUntilChanged(((previous: any, current: any) => {
			if (current instanceof NavigationEnd) {
				if (previous.url.replace(/(#.*)/, "") !== current.url.replace(/(#.*)/, "")) {
					window.scrollTo(0, 0);
				}
				return previous.url === current.url;
			}
			return true;
		}))).subscribe(() => {
			let snapshot = route.snapshot;
			let activated = route.firstChild;
			if (activated != null) {
				while (activated != null) {
					snapshot = activated.snapshot;
					activated = activated.firstChild;
				}
			}

			if (window['ga']) {
				console.log("Sending pageview to GA:", snapshot.url);
				window['ga']('set', 'page', snapshot.url);
				window['ga']('send', 'pageview');
			}
		});
	}

}
