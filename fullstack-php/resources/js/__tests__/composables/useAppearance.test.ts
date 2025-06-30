import { initializeTheme, updateTheme } from '@/composables/useAppearance';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock DOM elements
const mockDocumentElement = {
    classList: {
        toggle: vi.fn(),
    },
};

const mockMediaQueryList = {
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
};

// Mock window and document
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn(() => mockMediaQueryList),
});

Object.defineProperty(document, 'documentElement', {
    value: mockDocumentElement,
});

// Mock localStorage
const localStorageMock = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: localStorageMock,
});

describe('useAppearance', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        localStorageMock.getItem.mockReturnValue(null);
        mockMediaQueryList.matches = false;
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('updateTheme', () => {
        it('should apply light theme', () => {
            updateTheme('light');

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
        });

        it('should apply dark theme', () => {
            updateTheme('dark');

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
        });

        it('should apply system theme when system prefers light', () => {
            mockMediaQueryList.matches = false;
            updateTheme('system');

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
        });

        it('should apply system theme when system prefers dark', () => {
            mockMediaQueryList.matches = true;
            updateTheme('system');

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
        });

        it('should handle SSR environment gracefully', () => {
            const originalWindow = global.window;
            // @ts-ignore
            delete global.window;

            expect(() => updateTheme('light')).not.toThrow();

            global.window = originalWindow;
        });
    });

    describe('initializeTheme', () => {
        it('should initialize with saved light theme', () => {
            localStorageMock.getItem.mockReturnValue('light');

            initializeTheme();

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
            expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('should initialize with saved dark theme', () => {
            localStorageMock.getItem.mockReturnValue('dark');

            initializeTheme();

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
            expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('should initialize with system theme when no preference saved', () => {
            localStorageMock.getItem.mockReturnValue(null);
            mockMediaQueryList.matches = true;

            initializeTheme();

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
            expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('should initialize with system theme when saved preference is system', () => {
            localStorageMock.getItem.mockReturnValue('system');
            mockMediaQueryList.matches = false;

            initializeTheme();

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
            expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('should set up system theme change listener', () => {
            initializeTheme();

            expect(mockMediaQueryList.addEventListener).toHaveBeenCalledWith('change', expect.any(Function));
        });

        it('should handle SSR environment gracefully', () => {
            const originalWindow = global.window;
            // @ts-ignore
            delete global.window;

            expect(() => initializeTheme()).not.toThrow();

            global.window = originalWindow;
        });

        it('should handle media query not being available', () => {
            const originalMatchMedia = window.matchMedia;
            // @ts-ignore - Mocking to return null for testing
            window.matchMedia = vi.fn(() => null as any);

            expect(() => initializeTheme()).not.toThrow();

            window.matchMedia = originalMatchMedia;
        });
    });

    describe('System Theme Change Handler', () => {
        it('should update theme when system preference changes', () => {
            localStorageMock.getItem.mockReturnValue('system');
            initializeTheme();

            // Get the change handler that was registered
            const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

            // Simulate system theme change to dark
            mockMediaQueryList.matches = true;
            changeHandler();

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
        });

        it('should respect saved theme preference when system changes', () => {
            localStorageMock.getItem.mockReturnValue('light');
            initializeTheme();

            // Get the change handler that was registered
            const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

            // Simulate system theme change to dark
            mockMediaQueryList.matches = true;
            changeHandler();

            // Should still use light theme because that's what was saved
            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', false);
        });

        it('should fall back to system theme when no preference saved', () => {
            localStorageMock.getItem.mockReturnValue(null);
            initializeTheme();

            // Get the change handler that was registered
            const changeHandler = mockMediaQueryList.addEventListener.mock.calls[0][1];

            // Simulate system theme change to dark
            mockMediaQueryList.matches = true;
            changeHandler();

            expect(mockDocumentElement.classList.toggle).toHaveBeenCalledWith('dark', true);
        });
    });

    describe('Edge Cases', () => {
        it('should handle invalid localStorage values gracefully', () => {
            localStorageMock.getItem.mockReturnValue('invalid-theme');

            expect(() => initializeTheme()).not.toThrow();
        });

        it('should handle empty localStorage values gracefully', () => {
            localStorageMock.getItem.mockReturnValue('');

            expect(() => initializeTheme()).not.toThrow();
        });
    });
});
