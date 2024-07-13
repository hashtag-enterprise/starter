import { TestBed } from '@angular/core/testing';
import { Injector, runInInjectionContext } from '@angular/core';
import { RoutingHelperService, provideRoutingHelperServiceMock } from '../../service';
import { injectCurrentUrl } from './inject-current-url.injectable';

describe('injectCurrentUrl', () => {
	let injector: Injector;

	beforeEach(() => {

		TestBed.configureTestingModule({
			providers: [
				provideRoutingHelperServiceMock({ currentUrl: '/test-url' })
			]
		});

		injector = TestBed.inject(Injector);
	});

	it('should throw error when called without injector outside of an injection context', () => {
		expect(() => injectCurrentUrl()).toThrow();
	});

	it('should return when called without injector inside of an injection context', () => {
		const result = runInInjectionContext(injector, () => injectCurrentUrl())
		expect(result()).toBe('/test-url');
	});

	it('should return selectCurrentUrl when called with injector', () => {
		const result = injectCurrentUrl(injector);
		const mockRoutingHelperService = TestBed.inject(RoutingHelperService);
		expect(result).toBe(mockRoutingHelperService.selectCurrentUrl);
	});

	it('should emit the correct URL', () => {
		const result = injectCurrentUrl(injector);
		expect(result()).toBe('/test-url');
	});
});
