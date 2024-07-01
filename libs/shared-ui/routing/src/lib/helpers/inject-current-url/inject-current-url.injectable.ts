import { Injector, inject, runInInjectionContext } from "@angular/core";
import { RoutingHelperService } from "../../service/routing-helper.service";

// TODO: DOCUMENT
// TODO: UNIT TESTING
export const injectCurrentUrl = (injector?: Injector) => {
	if (injector) {
		return runInInjectionContext(injector, () => inject(RoutingHelperService).selectCurrentUrl);
	}
	return inject(RoutingHelperService).selectCurrentUrl;
}