import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, } from 'rxjs';

// TODO: DOCUMENT
// TODO: UNIT TESTING
@Injectable({ providedIn: 'root' })
export class RoutingHelperService {

	// PRIVATE DI
	readonly #router = inject(Router);
	readonly #document = inject(DOCUMENT);

	readonly selectCurrentUrl = toSignal(this.#router.events.pipe(
		filter((event) => event instanceof NavigationEnd),
		map((event) => (event as NavigationEnd).urlAfterRedirects),
		startWith(this.#router.url),
		takeUntilDestroyed()
	), { initialValue: this.#router.url });

	readonly selectCurrentUrl$ = toObservable(this.selectCurrentUrl);

	checkUrlPathSegment = (value: string) => this.#router.url.split('/').includes(value);

	getReferer = () => this.#document.referrer;


	// STATIC METHOD

	static getFullTreeParams(
		route: ActivatedRoute,
		params: Record<string, string> = {},
		isTopLevel = false,
	): { [key: string]: string; } {
		if (route.parent && !isTopLevel)
			return RoutingHelperService.getFullTreeParams(route.parent);
		else {
			if (route) {
				params = { ...params, ...route?.snapshot?.params };
				route.children.forEach(
					(c) => (params = RoutingHelperService.getFullTreeParams(c, params, true)),
				);
				return params;
			}
			return params;
		}
	}
}