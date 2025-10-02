/**
 * Form Mutation Manager
 * Handles form data collection and mutation operations to the Data Gateway
 */

import { globalDataGateway } from '../core/data-gateway';

/**
 * Form mutation handler class
 */
export class FormMutationManager {
  private static instance: FormMutationManager;

  constructor() {
    this.initializeEventListeners();
  }

  static getInstance(): FormMutationManager {
    if (!FormMutationManager.instance) {
      FormMutationManager.instance = new FormMutationManager();
    }
    return FormMutationManager.instance;
  }

  /**
   * Initialize event listeners for form mutations
   */
  private initializeEventListeners(): void {
    document.addEventListener('click', this.handleButtonClick.bind(this));
  }

  /**
   * Handle button clicks for mutation operations
   */
  private async handleButtonClick(event: Event): Promise<void> {
    const target = event.target as HTMLElement;
    
    // Check if this is a mutation button
    if (target.tagName === 'BUTTON' && target.hasAttribute('data-form-submit')) {
      const mutationType = target.getAttribute('data-mutation-type');
      const mutationKey = target.getAttribute('data-mutation-key');
      
      if (mutationType === 'session_storage' && mutationKey) {
        await this.handleSessionStorageMutation(mutationKey);
      }
    }
  }

  /**
   * Handle session storage mutation
   */
  private async handleSessionStorageMutation(key: string): Promise<void> {
    try {
      // Collect form data from all inputs with variable bindings
      const formData = this.collectFormData();
      
      if (Object.keys(formData).length === 0) {
        console.warn('FormMutationManager: No form data to submit');
        return;
      }

      // Initialize gateway if needed
      if (!globalDataGateway) {
        console.error('FormMutationManager: Data gateway not available');
        return;
      }

      await globalDataGateway.initialize();

      // Try to get existing data first
      const existingResult = await globalDataGateway.query.get(key);
      
      if (existingResult.success && existingResult.data) {
        // Update existing data (merge)
        const result = await globalDataGateway.mutation.update({
          key,
          data: formData,
          merge: true
        });
        
        if (result.success) {
          console.log(`FormMutationManager: Successfully updated ${key}`, result.data);
          this.showSuccessMessage('Data updated successfully!');
        } else {
          console.error(`FormMutationManager: Failed to update ${key}`, result.error);
          this.showErrorMessage('Failed to update data: ' + result.error);
        }
      } else {
        // Create new data
        const result = await globalDataGateway.mutation.create({
          key,
          data: formData
        });
        
        if (result.success) {
          console.log(`FormMutationManager: Successfully created ${key}`, result.data);
          this.showSuccessMessage('Data saved successfully!');
        } else {
          console.error(`FormMutationManager: Failed to create ${key}`, result.error);
          this.showErrorMessage('Failed to save data: ' + result.error);
        }
      }
    } catch (error) {
      console.error('FormMutationManager: Error during mutation', error);
      this.showErrorMessage('An unexpected error occurred');
    }
  }

  /**
   * Collect form data from inputs with variable bindings
   */
  private collectFormData(): Record<string, any> {
    const formData: Record<string, any> = {};
    
    // Find all form controls with variable bindings
    const formControls = document.querySelectorAll('[data-form-control="true"][data-variable-binding]');
    
    formControls.forEach(control => {
      const variableBinding = control.getAttribute('data-variable-binding');
      if (!variableBinding) return;
      
      // Remove the % prefix from variable name
      const variableName = variableBinding.replace(/^%/, '');
      
      if (control instanceof HTMLInputElement) {
        let value: any = control.value;
        
        // Handle different input types
        switch (control.type) {
          case 'checkbox':
            value = control.checked;
            break;
          case 'number':
            value = control.valueAsNumber;
            break;
          case 'date':
          case 'datetime-local':
            value = control.valueAsDate || control.value;
            break;
          default:
            value = control.value;
        }
        
        formData[variableName] = value;
      } else if (control instanceof HTMLSelectElement) {
        formData[variableName] = control.value;
      } else if (control instanceof HTMLTextAreaElement) {
        formData[variableName] = control.value;
      }
    });
    
    return formData;
  }

  /**
   * Show success message to user
   */
  private showSuccessMessage(message: string): void {
    this.showMessage(message, 'success');
  }

  /**
   * Show error message to user
   */
  private showErrorMessage(message: string): void {
    this.showMessage(message, 'error');
  }

  /**
   * Show message to user (simple implementation)
   */
  private showMessage(message: string, type: 'success' | 'error'): void {
    // Create a simple toast notification
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
      type === 'success' 
        ? 'bg-green-500 text-white' 
        : 'bg-red-500 text-white'
    }`;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    // Remove after 3 seconds
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 3000);
  }

  /**
   * Clear all form data
   */
  public clearFormData(): void {
    const formControls = document.querySelectorAll('[data-form-control="true"]');
    
    formControls.forEach(control => {
      if (control instanceof HTMLInputElement) {
        if (control.type === 'checkbox' || control.type === 'radio') {
          control.checked = false;
        } else {
          control.value = '';
        }
      } else if (control instanceof HTMLSelectElement) {
        control.selectedIndex = 0;
      } else if (control instanceof HTMLTextAreaElement) {
        control.value = '';
      }
    });
  }

  /**
   * Load data into form from storage
   */
  public async loadFormData(key: string): Promise<void> {
    try {
      await globalDataGateway.initialize();
      const result = await globalDataGateway.query.get(key);
      
      if (result.success && result.data) {
        this.populateFormData(result.data as Record<string, any>);
      }
    } catch (error) {
      console.error('FormMutationManager: Error loading form data', error);
    }
  }

  /**
   * Populate form with data
   */
  private populateFormData(data: Record<string, any>): void {
    const formControls = document.querySelectorAll('[data-form-control="true"][data-variable-binding]');
    
    formControls.forEach(control => {
      const variableBinding = control.getAttribute('data-variable-binding');
      if (!variableBinding) return;
      
      const variableName = variableBinding.replace(/^%/, '');
      const value = data[variableName];
      
      if (value !== undefined) {
        if (control instanceof HTMLInputElement) {
          if (control.type === 'checkbox') {
            control.checked = Boolean(value);
          } else {
            control.value = String(value);
          }
        } else if (control instanceof HTMLSelectElement) {
          control.value = String(value);
        } else if (control instanceof HTMLTextAreaElement) {
          control.value = String(value);
        }
      }
    });
  }
}

/**
 * Initialize the form mutation manager
 */
export function initializeFormMutationManager(): FormMutationManager {
  return FormMutationManager.getInstance();
}

/**
 * Global form mutation manager instance
 */
export const formMutationManager = FormMutationManager.getInstance();