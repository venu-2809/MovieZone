// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Optional: Mock window.matchMedia for responsive components
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // Deprecated
        removeListener: jest.fn(), // Deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Optional: Silence console.error for specific warnings (customize as needed)
const originalError = console.error;
beforeAll(() => {
    jest.spyOn(console, 'error').mockImplementation((...args) => {
        if (/Warning.*not wrapped in act/.test(args[0])) {
            return;
        }
        originalError.call(console, ...args);
    });
});
afterAll(() => {
    console.error.mockRestore();
});
