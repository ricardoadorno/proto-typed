import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Modal from '../../components/modal';

describe('Modal Component', () => {
    it('should render the button with provided text', () => {
        render(<Modal buttonText="Open Modal" />);

        const button = screen.getByText('Open Modal');
        expect(button).toBeInTheDocument();
    });

    it('should initially render the modal as closed', () => {
        render(
            <Modal
                buttonText="Open Modal"
                header={<h2>Modal Title</h2>}
                content={<p>Modal content</p>}
            />
        );

        // The modal should be closed (dialog element with open=false)
        const dialog = document.querySelector('dialog');
        expect(dialog).toBeInTheDocument();
        expect(dialog?.open).toBe(false);
    });

    it('should open the modal when the button is clicked', () => {
        render(
            <Modal
                buttonText="Open Modal"
                header={<h2>Modal Title</h2>}
                content={<p>Modal content</p>}
            />
        );

        // Click the button to open the modal
        const button = screen.getByText('Open Modal');
        fireEvent.click(button);

        // Now the modal content should be visible (dialog with open=true)
        const dialog = document.querySelector('dialog');
        expect(dialog?.open).toBe(true);
        expect(screen.getByText('Modal Title')).toBeInTheDocument();
        expect(screen.getByText('Modal content')).toBeInTheDocument();
    });

    it('should close the modal when the close button is clicked', () => {
        render(
            <Modal
                buttonText="Open Modal"
                header={<h2>Modal Title</h2>}
                content={<p>Modal content</p>}
            />
        );

        // Open the modal
        fireEvent.click(screen.getByText('Open Modal'));

        // The content should be visible
        expect(screen.getByText('Modal Title')).toBeInTheDocument();

        // Click the close button
        fireEvent.click(screen.getByText('Close'));

        // The modal should be closed (dialog with open=false)
        const dialog = document.querySelector('dialog');
        expect(dialog?.open).toBe(false);
    });

    it('should render custom actions', () => {
        render(
            <Modal
                buttonText="Open Modal"
                header={<h2>Modal Title</h2>}
                content={<p>Modal content</p>}
                actions={<button>Custom Action</button>}
            />
        );

        // Open the modal
        fireEvent.click(screen.getByText('Open Modal'));

        // The custom action should be rendered
        expect(screen.getByText('Custom Action')).toBeInTheDocument();
    });
});