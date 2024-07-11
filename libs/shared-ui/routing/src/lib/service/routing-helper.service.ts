/**
 * @fileoverview This file contains the RoutingHelperService, which provides
 * utilities for working with Angular routing.
 */

import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map, startWith, } from 'rxjs';

/**
 * Service providing helper methods and observables for routing-related functionality.
 */
@Injectable({ providedIn: 'root' })
export class RoutingHelperService {

	/** Router instance */
	readonly #router = inject(Router);

	/** Document instance */
	readonly #document = inject(DOCUMENT);

	/**
	 * Signal that emits the current URL after each successful navigation
	 */
	readonly selectCurrentUrl = toSignal(this.#router.events.pipe(
		filter((event) => event instanceof NavigationEnd),
		map((event) => (event as NavigationEnd).urlAfterRedirects),
		startWith(this.#router.url),
		takeUntilDestroyed()
	), { initialValue: this.#router.url });

	/**
	 * Observable that emits the current URL after each successful navigation
	 */
	readonly selectCurrentUrl$ = toObservable(this.selectCurrentUrl);

	/**
	 * Checks if a given path segment is present in the current URL
	 * @param value - The path segment to check
	 * @returns True if the segment is present, false otherwise
	 */
	checkUrlPathSegment = (value: string) => this.#router.url.split('/').includes(value);

	/**
	 * Gets the referrer URL
	 * @returns The referrer URL
	 */
	getReferer = () => this.#document.referrer;

	/**
	 * Recursively gathers all route parameters from the entire route tree
	 * @param route - The route to start gathering parameters from
	 * @param params - Accumulated parameters object
	 * @param isTopLevel - Flag to indicate if this is the top-level call
	 * @returns An object containing all route parameters
	 */
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