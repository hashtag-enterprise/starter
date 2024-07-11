import { TestBed } from '@angular/core/testing';
import { RoutingHelperService } from './routing-helper.service';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { of } from 'rxjs';
import { MockService } from "ng-mocks";

describe('RoutingHelperService', () => {
	let service: RoutingHelperService;
	let router: Router;
	let documentMock: any;

	beforeEach(() => {
		documentMock = {
			querySelector: jest.fn(),
			querySelectorAll: jest.fn(() => []),
			referrer: 'https://example.com',
			body: {
				appendChild: jest.fn(),
				removeChild: jest.fn(),
			},
			createElement: jest.fn(() => ({
				style: {},
				setAttribute: jest.fn(),
				appendChild: jest.fn(),
			})),
		};

		TestBed.configureTestingModule({
			providers: [
				RoutingHelperService,
				{
					provide: Router,
					useValue: {
						url: '/test',
						events: of(new NavigationEnd(1, '/test', '/test')),
					}
				},
				{ provide: DOCUMENT, useValue: documentMock }
			],
		});

		service = TestBed.inject(RoutingHelperService);
		router = TestBed.inject(Router);
	});

	afterEach(() => {
		TestBed.resetTestingModule();
	});

	it('should be created', () => {
		expect(service).toBeTruthy();
	});

	describe('selectCurrentUrl', () => {
		it('should emit the current URL', () => {
			expect(service.selectCurrentUrl()).toBe('/test');
		});

		it('should update when navigation ends', (done) => {
			router.events.subscribe((event) => {
				if (event instanceof NavigationEnd) {
					expect(service.selectCurrentUrl()).toBe('/test');
					done();
				}
			});
		});
	});

	describe('checkUrlPathSegment', () => {
		it('should return true if segment is in URL', () => {
			(router as any).url = '/test/segment/example';
			expect(service.checkUrlPathSegment('segment')).toBe(true);
		});

		it('should return false if segment is not in URL', () => {
			(router as any).url = '/test/other/example';
			expect(service.checkUrlPathSegment('segment')).toBe(false);
		});
	});

	describe('getReferer', () => {
		it('should return the document referrer', () => {
			expect(service.getReferer()).toBe('https://example.com');
		});
	});

	describe('getFullTreeParams (static method)', () => {
		it('should gather params from the entire route tree', () => {
			const mockRoute = (cb?: () => any) => MockService(ActivatedRoute, {
				snapshot: { params: { param1: 'value1' } },
				parent: MockService(ActivatedRoute, {
					snapshot: { params: { param2: 'value2' } },
					parent: null,
					children: [cb?.()],
				} as any),
				children: [
					MockService(ActivatedRoute, {
						snapshot: { params: { param3: 'value3' } },
						children: [],
					} as any),
				],
			} as any);

			const result = RoutingHelperService.getFullTreeParams(mockRoute(mockRoute));
			expect(result).toEqual({
				param1: 'value1',
				param2: 'value2',
				param3: 'value3',
			});
		});

		it('should handle routes without params', () => {
			const mockRoute = {
				snapshot: { params: {} },
				parent: null,
				children: [],
			};

			const result = RoutingHelperService.getFullTreeParams(mockRoute as any);
			expect(result).toEqual({});
		});
	});
});
