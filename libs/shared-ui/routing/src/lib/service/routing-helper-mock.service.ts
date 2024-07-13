import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { NavigationEnd } from '@angular/router';
import { RoutingHelperService } from './routing-helper.service';
import { signal } from '@angular/core';

export class RoutingHelperMockService {
	#referrer: string;
	#routerEventsSubject = new Subject<unknown>();
	#selectCurrentUrl$ = new BehaviorSubject('');

	constructor(currentUrl: string, referrer: string) {
		this.selectCurrentUrl.set(currentUrl);
		this.#selectCurrentUrl$.next(currentUrl);

		this.#referrer = referrer;
		// Emit initial NavigationEnd event with currentUrl
		this.#routerEventsSubject.next(new NavigationEnd(0, this.selectCurrentUrl(), this.selectCurrentUrl()));
	}

	// Mock signal for the current URL
	selectCurrentUrl = signal('');

	// Mock observable for the current URL
	selectCurrentUrl$: Observable<string> = this.#selectCurrentUrl$.asObservable();

	// Method to check if a path segment is present in the current URL
	checkUrlPathSegment(value: string): boolean {
		return this.selectCurrentUrl().split('/').includes(value);
	}

	// Method to get the referrer URL
	getReferer(): string {
		return this.#referrer;
	}

	// Static method to gather all route parameters from the route tree
	static getFullTreeParams = RoutingHelperService.getFullTreeParams;

	// Method to simulate router events for testing
	emitRouterEvent(event: unknown) {
		this.#routerEventsSubject.next(event);
	}

	// Static configure method to return a configured instance of the mock class
	static configure(config: { currentUrl?: string, referrer?: string } = {}): RoutingHelperMockService {
		return new RoutingHelperMockService(
			config.currentUrl || '/',
			config.referrer || document.referrer
		);
	}
}
