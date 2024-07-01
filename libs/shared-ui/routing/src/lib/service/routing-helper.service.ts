import { Injectable, inject } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { distinctUntilChanged, interval, map, } from 'rxjs';

// TODO: DOCUMENT
// TODO: UNIT TESTING
@Injectable({ providedIn: 'root' })
export class RoutingHelperService {

	readonly #router = inject(Router);

	readonly selectCurrentUrl = toSignal(interval(100).pipe(
		takeUntilDestroyed(),
		map(() => this.#router.url),
		distinctUntilChanged()
	), { initialValue: this.#router.url });

	readonly selectCurrentUrl$ = toObservable(this.selectCurrentUrl);

}