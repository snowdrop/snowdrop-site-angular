import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { TargetEnvironment, TargetEnvironmentService } from 'ngx-forge';

@Injectable()
export class AppLauncherTargetEnvironmentService implements TargetEnvironmentService {

	/**
	 * Returns target environments
	 *
	 * @returns {Observable<TargetEnvironment>} The target environments
	 */
	getTargetEnvironments(): Observable<TargetEnvironment[]> {
		const targetEnvironments = [
			{
				description: 'When you build and run locally, you will receive a .zip file ' +
					'containing the setup you have established for your application.',
				benefits: [
					'Scaffold a project based on your chosen runtime.',
					'Configure OpenShift to build and deploy your code on each push to your repository\'s master branch.',
					'Here is a benefit of using OpenShift as a project environment.'
				],
				footer: '.ZIP File',
				header: 'Build and Run Locally',

				icon: 'data:image/svg+xml;charset=UTF-8,%3Csvg%20version%3D%221.1%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22384%22%20height%3D%22448%22%20viewBox%3D%220%200%20384%20448%22%3E%0A%3Ctitle%3E%3C/title%3E%0A%3Cpath%20d%3D%22M160%2096v-32h-32v32h32zM192%20128v-32h-32v32h32zM160%20160v-32h-32v32h32zM192%20192v-32h-32v32h32zM367%2095c9.25%209.25%2017%2027.75%2017%2041v288c0%2013.25-10.75%2024-24%2024h-336c-13.25%200-24-10.75-24-24v-400c0-13.25%2010.75-24%2024-24h224c13.25%200%2031.75%207.75%2041%2017zM256%2034v94h94c-1.5-4.25-3.75-8.5-5.5-10.25l-78.25-78.25c-1.75-1.75-6-4-10.25-5.5zM352%20416v-256h-104c-13.25%200-24-10.75-24-24v-104h-32v32h-32v-32h-128v384h320zM195.25%20235.75c21.25%2071.75%2026.75%2087.25%2026.75%2087.25%201.25%204.25%202%208.5%202%2013%200%2027.75-27%2048-64%2048s-64-20.25-64-48c0-4.5%200.75-8.75%202-13%200%200%205.25-15.5%2030-99v-32h32v32h19.75c7.25%200%2013.5%204.75%2015.5%2011.75zM160%20352c17.75%200%2032-7.25%2032-16s-14.25-16-32-16-32%207.25-32%2016%2014.25%2016%2032%2016z%22%3E%3C/path%3E%0A%3C/svg%3E%0A',
				id: 'zip',
				styleClass: 'card-pf-footer--logo-zip'
				/* tslint:enable */
			}] as TargetEnvironment[];
		return Observable.from([targetEnvironments]);
	}
}
