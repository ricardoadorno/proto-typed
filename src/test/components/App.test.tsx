import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../App';

// Mock AceEditor since it can be problematic in test environment
vi.mock('react-ace', () => {
    return {
        default: ({ onChange, value }: { onChange: (val: string) => void, value: string }) => {
            return (
                <textarea
                    data-testid="mock-ace-editor"
                    onChange={(e) => onChange(e.target.value)}
                    value={value}
                />
            );
        }
    };
});

describe('App Component', () => {
    test('renders the UI DSL Parser title', () => {
        render(<App />);
        expect(screen.getByText('UI DSL Parser')).toBeInTheDocument();
    });

    test('has a button to export HTML', () => {
        render(<App />);
        expect(screen.getByText('Export as HTML')).toBeInTheDocument();
    });

    test('has example buttons', () => {
        render(<App />);
        expect(screen.getByText('Login Example')).toBeInTheDocument();
        expect(screen.getByText('Dashboard Example')).toBeInTheDocument();
    });

    test('has a display style selector', () => {
        render(<App />);
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).toHaveValue('iphone-x');
    });

    test('changes UI style when selector changes', () => {
        render(<App />);
        const select = screen.getByRole('combobox');

        // Change style to browser
        fireEvent.change(select, { target: { value: 'browser-mockup with-url' } });
        expect(select).toHaveValue('browser-mockup with-url');

        // Should affect the container element class
        const container = document.querySelector('.browser-mockup.with-url');
        expect(container).toBeInTheDocument();
    });

    test('renders the parsed content', () => {
        render(<App />);

        // The default example should be rendered with some content
        const screenElement = document.querySelector('.screen');
        expect(screenElement).toBeInTheDocument();

        // Should have at least a heading in the rendered output
        const heading = document.querySelector('.screen h1');
        expect(heading).toBeInTheDocument();
    });
});