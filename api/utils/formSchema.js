// File: formgpt-backend/api/utils/formSchema.js
import { z } from 'zod';

// --- 1. Core Building Blocks ---

/**
 * Defines the schema for a single option in a select, multiselect, or radio group.
 * Based on your advanced example.
 */
const optionSchema = z.object({
  id: z.string().min(1, "Option 'id' is required."), // A unique ID for this option
  value: z.string(), // The form value (e.g., "yes", "role_dev")
  label: z.string().optional(), // An optional display label (e.g., "Yes, I agree")
  color: z.string().optional(), // Metadata
  score: z.number().optional(), // Metadata
  critical: z.boolean().optional(), // Metadata
});

/**
 * Defines the conditional logic for a node.
 * "Show this node if 'question' 'operator' 'value'"
 */
const conditionSchema = z.object({
  question: z.string().min(1, "'question' (node name) is required."),
  operator: z.enum([
    'equal',
    'notEqual',
    'greaterThan',
    'lessThan',
    'contains',
  ]),
  value: z.string().min(1, "Conditional 'value' (option id) is required."),
});

// --- 2. The Recursive Node Definition ---

// We must define a 'base' type for recursion to work.
// We use z.lazy() to define 'children' because 'formNodeSchema'
// hasn't been fully defined yet. This breaks the circular dependency.
const baseNodeSchema = z.object({
  name: z.string().min(1, "'name' is required and must be unique."),
  label: z.string(),
  sublabel: z.string().optional(),
  required: z.boolean().optional(),
  expanded: z.boolean().optional(), // For frontend UI
  isChildAllowed: z.boolean().optional(), // For frontend UI
  condition: conditionSchema.optional(),
  children: z.lazy(() => z.array(formNodeSchema)).optional(),
});

// --- 3. The Discriminated Union (All Element Types) ---

// This is the 'formNodeSchema' that 'baseNodeSchema' refers to.
// z.discriminatedUnion tells Zod that based on the 'type' field,
// the object must match one of the following schemas.

export const formNodeSchema = z.discriminatedUnion('type', [
  // --- Input Types ---
  baseNodeSchema.extend({
    type: z.literal('text'),
    placeholder: z.string().optional(),
    defaultValue: z.string().optional(),
  }),
  baseNodeSchema.extend({
    type: z.literal('number'),
    min: z.number().optional(),
    max: z.number().optional(),
    defaultValue: z.number().optional(),
  }),
  baseNodeSchema.extend({
    type: z.literal('textarea'),
    placeholder: z.string().optional(),
    rows: z.number().optional(),
  }),
  baseNodeSchema.extend({ type: z.literal('password') }),
  baseNodeSchema.extend({
    type: z.literal('select'),
    options: z.array(optionSchema).min(1, 'Select must have options.'),
  }),
  baseNodeSchema.extend({
    type: z.literal('multiselect'),
    options: z.array(optionSchema).min(1, 'Multiselect must have options.'),
  }),
  baseNodeSchema.extend({
    type: z.literal('radio'),
    options: z.array(optionSchema).min(1, 'Radio group must have options.'),
  }),
  baseNodeSchema.extend({ type: z.literal('date') }),
  baseNodeSchema.extend({ type: z.literal('time') }),
  baseNodeSchema.extend({ type: z.literal('datetime') }),
  baseNodeSchema.extend({
    type: z.literal('file'),
    allow_multiple: z.boolean().optional(),
    accepted_formats: z.array(z.string()).optional(),
  }),
  baseNodeSchema.extend({ type: z.literal('camera') }),
  baseNodeSchema.extend({ type: z.literal('signature') }),
  baseNodeSchema.extend({ type: z.literal('location') }),
  baseNodeSchema.extend({ type: z.literal('rating') }),
  baseNodeSchema.extend({ type: z.literal('toggle') }),
  baseNodeSchema.extend({ type: z.literal('barcode') }),

  // --- Structural Types ---
  baseNodeSchema.extend({ type: z.literal('group') }),
  baseNodeSchema.extend({ type: z.literal('repeater') }),

  // --- Static Types ---
  baseNodeSchema.extend({
    type: z.literal('hidden'),
    value: z.string().optional(),
  }),
  baseNodeSchema.extend({
    type: z.literal('info'),
    content: z.string().optional(), // e.g., "Please fill out all fields below."
  }),
]);

// --- 4. The Final Schema ---

/**
 * The complete form is an array of nodes.
 * This is what we will validate the AI's final output against.
 */
export const formSchema = z.array(formNodeSchema);