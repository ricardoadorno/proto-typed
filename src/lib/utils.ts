import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * @function cn
 * @description A utility function that merges Tailwind CSS classes with clsx.
 * It allows for conditional class names and resolves conflicting Tailwind classes.
 *
 * @param {...ClassValue[]} inputs - A list of class values to be merged.
 * These can be strings, objects, or arrays.
 * @returns {string} The merged and optimized class name string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
