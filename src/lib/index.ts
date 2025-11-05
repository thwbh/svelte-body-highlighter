// Main library export
export { default as Body } from './Body.svelte';

// Type exports
export type {
  Slug,
  BodyPart,
  ExtendedBodyPart,
  BodyProps
} from './types';

// CSS export (for documentation and optional import)
// Users can import this to get default styling and CSS custom property definitions
import './body-highlighter.css';
