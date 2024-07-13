import { Injector, inject, runInInjectionContext } from "@angular/core";
import { RoutingHelperService } from "../../service/routing-helper.service";

/**
 * Injects the current URL selector from the RoutingHelperService.
 * 
 * This function is designed to work both inside and outside of the Angular dependency injection context.
 * It returns a signal for the current URL, which can be used in components or services.
 *
 * @param [injector] - Optional Angular Injector. If provided, the function will run in the injection context.
 * @returns  A Signal that contains the current URL.
 */
export const injectCurrentUrl = (injector?: Injector) => {
	if (injector) {
		return runInInjectionContext(injector, () => inject(RoutingHelperService).selectCurrentUrl);
	}
	return inject(RoutingHelperService).selectCurrentUrl;
}