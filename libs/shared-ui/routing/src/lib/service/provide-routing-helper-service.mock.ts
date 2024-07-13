import { RoutingHelperMockService } from "./routing-helper-mock.service";
import { RoutingHelperService } from "./routing-helper.service";

export const provideRoutingHelperServiceMock = (...config: Parameters<typeof RoutingHelperMockService.configure>) => ({
	provide: RoutingHelperService,
	useValue: RoutingHelperMockService.configure(...config)
});
