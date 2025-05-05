/**
 * Industry Registry System
 * 
 * A centralized registry for all manufacturing industries supported by Gendra.
 * This registry maps industry IDs to their respective configurations, providing
 * a single source of truth for both frontend and backend services.
 */

/**
 * Form field types supported in industry configurations
 */
export enum FormFieldType {
  TEXT = 'text',
  NUMBER = 'number',
  SELECT = 'select',
  CHECKBOX = 'checkbox',
  DATE = 'date',
  TEXTAREA = 'textarea',
}

/**
 * Option for select form fields
 */
export type SelectOption = {
  readonly id: string;
  readonly label: string;
  readonly value?: number | string; // Optional value for calculations
};

/**
 * Base form field properties
 */
interface BaseFormField {
  readonly id: string;
  readonly label: string;
  readonly type: FormFieldType;
  readonly required?: boolean;
  readonly defaultValue?: any;
  readonly description?: string;
  readonly placeholder?: string;
  readonly backendOnly?: boolean; // Fields only used in backend calculations
}

/**
 * Text input field
 */
interface TextField extends BaseFormField {
  readonly type: FormFieldType.TEXT;
  readonly minLength?: number;
  readonly maxLength?: number;
  readonly pattern?: string;
}

/**
 * Number input field
 */
interface NumberField extends BaseFormField {
  readonly type: FormFieldType.NUMBER;
  readonly min?: number;
  readonly max?: number;
  readonly step?: number;
  readonly unit?: string; // e.g., "mm", "kg", etc.
}

/**
 * Select/dropdown field
 */
interface SelectField extends BaseFormField {
  readonly type: FormFieldType.SELECT;
  readonly options: readonly SelectOption[];
  readonly multiple?: boolean;
}

/**
 * Checkbox field
 */
interface CheckboxField extends BaseFormField {
  readonly type: FormFieldType.CHECKBOX;
}

/**
 * Date field
 */
interface DateField extends BaseFormField {
  readonly type: FormFieldType.DATE;
  readonly minDate?: string;
  readonly maxDate?: string;
}

/**
 * Textarea field
 */
interface TextareaField extends BaseFormField {
  readonly type: FormFieldType.TEXTAREA;
  readonly rows?: number;
  readonly cols?: number;
}

/**
 * Union type for all form field types
 */
export type FormField = TextField | NumberField | SelectField | CheckboxField | DateField | TextareaField;

/**
 * Pricing calculation modes
 */
export enum PricingMode {
  STATIC = 'static',  // Use static formulas in the frontend
  PYTHON = 'python',  // Use Python backend for calculations
  HYBRID = 'hybrid',  // Use static for initial estimates, Python for final
  ML = 'ml',          // Use machine learning models
}

/**
 * Material configuration
 */
export type Material = {
  readonly id: string;
  readonly name: string;
  readonly rate: number;
  readonly description?: string;
};

/**
 * Complexity level configuration
 */
export type ComplexityLevel = {
  readonly id: string;
  readonly name: string;
  readonly factor: number;
  readonly description?: string;
};

/**
 * Full industry configuration interface
 */
export interface IndustryConfig {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly pricingMode: PricingMode;
  readonly icon: string;
  readonly formFields: readonly FormField[];
  readonly materials: readonly Material[];
  readonly complexityLevels: readonly ComplexityLevel[];
  readonly basePrice: number;
  readonly pricingModel?: string; // Name of Python model to use if applicable
  readonly unitLabel?: string; // Label for units (e.g., "parts", "assemblies")
  readonly fallbackCalcFunction?: string; // Function name to use for fallback calculations
  readonly validationRules?: Record<string, string>; // Field validation rules
  readonly isActive?: boolean; // Whether this industry is active for users
}

/**
 * Standard complexity levels used across industries
 */
export const STANDARD_COMPLEXITY_LEVELS = [
  { id: 'low', name: 'Low', factor: 1.0, description: 'Simple geometry, few features' },
  { id: 'medium', name: 'Medium', factor: 1.5, description: 'Multiple features, moderate complexity' },
  { id: 'high', name: 'High', factor: 2.0, description: 'Complex features, difficult manufacturing' },
] as const;

/**
 * Industry registry mapping industry IDs to their configurations
 */
export const INDUSTRY_REGISTRY: Record<string, IndustryConfig> = {
  // CNC Machining Industry
  'cnc-machining': {
    id: 'cnc-machining',
    name: 'CNC Machining',
    description: 'Computer-controlled precision machining',
    pricingMode: PricingMode.HYBRID,
    icon: 'M3 1a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v7h1V6h1V1a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12h1V1zm9 10H2v4h10v-4zM9 8H5v1h4V8z',
    basePrice: 50,
    formFields: [
      {
        id: 'material',
        label: 'Material',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'aluminum',
        options: [
          { id: 'aluminum', label: 'Aluminum' },
          { id: 'steel', label: 'Steel' },
          { id: 'stainless-steel', label: 'Stainless Steel' },
          { id: 'titanium', label: 'Titanium' },
          { id: 'brass', label: 'Brass' },
        ],
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: FormFieldType.NUMBER,
        required: true,
        defaultValue: 1,
        min: 1,
      },
      {
        id: 'length',
        label: 'Length (mm)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 0,
        step: 0.1,
        unit: 'mm',
      },
      {
        id: 'width',
        label: 'Width (mm)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 0,
        step: 0.1,
        unit: 'mm',
      },
      {
        id: 'height',
        label: 'Height (mm)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 0,
        step: 0.1,
        unit: 'mm',
      },
      {
        id: 'tolerance',
        label: 'Tolerance',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'standard',
        options: [
          { id: 'standard', label: 'Standard (±0.2mm)' },
          { id: 'tight', label: 'Tight (±0.1mm)' },
          { id: 'precision', label: 'Precision (±0.05mm)' },
        ],
      },
      {
        id: 'surfaceFinish',
        label: 'Surface Finish',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'standard',
        options: [
          { id: 'standard', label: 'Standard Machined' },
          { id: 'polished', label: 'Polished' },
          { id: 'anodized', label: 'Anodized (Aluminum Only)' },
        ],
      },
      {
        id: 'complexity',
        label: 'Complexity',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'low',
        options: [
          { id: 'low', label: 'Low - Simple geometry, few features' },
          { id: 'medium', label: 'Medium - Multiple features, moderate complexity' },
          { id: 'high', label: 'High - Complex geometry, many features' },
        ],
      },
      {
        id: 'deadline',
        label: 'Deadline',
        type: FormFieldType.DATE,
        required: false,
      },
    ],
    materials: [
      { id: 'aluminum', name: 'Aluminum', rate: 3.2 },
      { id: 'steel', name: 'Steel', rate: 2.5 },
      { id: 'stainless-steel', name: 'Stainless Steel', rate: 5.5 },
      { id: 'titanium', name: 'Titanium', rate: 15.0 },
      { id: 'brass', name: 'Brass', rate: 6.0 },
    ],
    complexityLevels: STANDARD_COMPLEXITY_LEVELS,
    pricingModel: 'cnc_predict',
    fallbackCalcFunction: 'calculateCNCQuote',
  },

  // Injection Molding Industry
  'injection-molding': {
    id: 'injection-molding',
    name: 'Injection Molding',
    description: 'High-precision plastic parts and components',
    pricingMode: PricingMode.HYBRID,
    icon: 'M8 1a7 7 0 0 0-7 7 .5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5 7 7 0 0 0-7-7zm0 9.5a.5.5 0 0 0-.5.5v3a.5.5 0 0 0 1 0v-3a.5.5 0 0 0-.5-.5z',
    basePrice: 5000, // Base cost for mold creation
    formFields: [
      {
        id: 'material',
        label: 'Material',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'abs',
        options: [
          { id: 'abs', label: 'ABS' },
          { id: 'polypropylene', label: 'Polypropylene (PP)' },
          { id: 'polyethylene', label: 'Polyethylene (PE)' },
          { id: 'polycarbonate', label: 'Polycarbonate (PC)' },
          { id: 'nylon', label: 'Nylon (PA)' },
          { id: 'pom', label: 'POM (Acetal)' },
        ],
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: FormFieldType.NUMBER,
        required: true,
        defaultValue: 1000,
        min: 500,
        step: 100,
      },
      {
        id: 'volume',
        label: 'Part Volume (cm³)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 0,
        step: 0.1,
        unit: 'cm³',
      },
      {
        id: 'partWeight',
        label: 'Part Weight (g)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 0,
        step: 0.1,
        unit: 'g',
      },
      {
        id: 'complexity',
        label: 'Complexity',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'low',
        options: [
          { id: 'low', label: 'Low - Simple geometry, few features' },
          { id: 'medium', label: 'Medium - Multiple features, moderate complexity' },
          { id: 'high', label: 'High - Complex features, undercuts, thin walls' },
        ],
      },
      {
        id: 'surfaceFinish',
        label: 'Surface Finish',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'standard',
        options: [
          { id: 'standard', label: 'Standard' },
          { id: 'textured', label: 'Textured' },
          { id: 'high-gloss', label: 'High Gloss' },
          { id: 'matte', label: 'Matte' },
        ],
      },
      {
        id: 'colorMatching',
        label: 'Custom Color Matching Required',
        type: FormFieldType.CHECKBOX,
        defaultValue: false,
      },
      {
        id: 'deadline',
        label: 'Deadline',
        type: FormFieldType.DATE,
        required: false,
      },
    ],
    materials: [
      { id: 'abs', name: 'ABS', rate: 1.0 },
      { id: 'polypropylene', name: 'Polypropylene (PP)', rate: 0.9 },
      { id: 'polyethylene', name: 'Polyethylene (PE)', rate: 0.85 },
      { id: 'polycarbonate', name: 'Polycarbonate (PC)', rate: 1.4 },
      { id: 'nylon', name: 'Nylon (PA)', rate: 1.5 },
      { id: 'pom', name: 'POM (Acetal)', rate: 1.3 },
    ],
    complexityLevels: STANDARD_COMPLEXITY_LEVELS,
    pricingModel: 'injection_molding_predict',
    fallbackCalcFunction: 'calculateInjectionMoldingQuote',
  },

  // Sheet Metal Industry
  'sheet-metal': {
    id: 'sheet-metal',
    name: 'Sheet Metal',
    description: 'Custom sheet metal parts for various applications',
    pricingMode: PricingMode.HYBRID,
    icon: 'M0 3.5A1.5 1.5 0 0 1 1.5 2h13A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 0 12.5v-9zM1.5 3a.5.5 0 0 0-.5.5v9a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-13z',
    basePrice: 20,
    formFields: [
      {
        id: 'material',
        label: 'Material',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'steel',
        options: [
          { id: 'steel', label: 'Steel' },
          { id: 'stainless-steel', label: 'Stainless Steel' },
          { id: 'aluminum', label: 'Aluminum' },
          { id: 'copper', label: 'Copper' },
          { id: 'brass', label: 'Brass' },
        ],
      },
      {
        id: 'thickness',
        label: 'Thickness (mm)',
        type: FormFieldType.NUMBER,
        required: true,
        defaultValue: 1.0,
        min: 0.1,
        step: 0.1,
        unit: 'mm',
      },
      {
        id: 'length',
        label: 'Length (mm)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 1,
        unit: 'mm',
      },
      {
        id: 'width',
        label: 'Width (mm)',
        type: FormFieldType.NUMBER,
        required: true,
        min: 1,
        unit: 'mm',
      },
      {
        id: 'quantity',
        label: 'Quantity',
        type: FormFieldType.NUMBER,
        required: true,
        defaultValue: 1,
        min: 1,
      },
      {
        id: 'bends',
        label: 'Number of Bends',
        type: FormFieldType.NUMBER,
        required: true,
        defaultValue: 0,
        min: 0,
      },
      {
        id: 'holes',
        label: 'Number of Holes',
        type: FormFieldType.NUMBER,
        required: true,
        defaultValue: 0,
        min: 0,
      },
      {
        id: 'finish',
        label: 'Surface Finish',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'none',
        options: [
          { id: 'none', label: 'None' },
          { id: 'painted', label: 'Painted' },
          { id: 'powder-coated', label: 'Powder Coated' },
          { id: 'plated', label: 'Plated' },
          { id: 'brushed', label: 'Brushed' },
        ],
      },
      {
        id: 'complexity',
        label: 'Complexity',
        type: FormFieldType.SELECT,
        required: true,
        defaultValue: 'low',
        options: [
          { id: 'low', label: 'Low - Simple bends, few holes' },
          { id: 'medium', label: 'Medium - Multiple bends, several holes' },
          { id: 'high', label: 'High - Complex shapes, many features' },
        ],
      },
      {
        id: 'deadline',
        label: 'Deadline',
        type: FormFieldType.DATE,
        required: false,
      },
    ],
    materials: [
      { id: 'steel', name: 'Steel', rate: 1.0 },
      { id: 'stainless-steel', name: 'Stainless Steel', rate: 1.7 },
      { id: 'aluminum', name: 'Aluminum', rate: 1.2 },
      { id: 'copper', name: 'Copper', rate: 2.5 },
      { id: 'brass', name: 'Brass', rate: 2.2 },
    ],
    complexityLevels: STANDARD_COMPLEXITY_LEVELS,
    pricingModel: 'sheet_metal_predict',
    fallbackCalcFunction: 'calculateSheetMetalQuote',
  },
};

/**
 * Gets the configuration for a specific industry
 * 
 * @param industryId - The ID of the industry to retrieve
 * @param throwIfNotFound - Whether to throw an error if the industry is not found
 * @returns The industry configuration or null if not found
 */
export function getIndustryConfig(industryId: string, throwIfNotFound: boolean = false): IndustryConfig | null {
  const config = INDUSTRY_REGISTRY[industryId] || null;
  
  if (!config && throwIfNotFound) {
    throw new Error(`Industry configuration not found for ID: ${industryId}`);
  }
  
  return config;
}

/**
 * Gets a list of all active industries
 * 
 * @returns Array of active industry configurations
 */
export function getAllIndustries(): IndustryConfig[] {
  return Object.values(INDUSTRY_REGISTRY).filter(config => config.isActive !== false);
}

/**
 * Helper function to check if an industry is supported
 * 
 * @param industryId - The ID of the industry to check
 * @returns boolean indicating if the industry is supported
 */
export function isIndustrySupported(industryId: string): boolean {
  return !!INDUSTRY_REGISTRY[industryId];
}

/**
 * Extracts and returns frontend-only fields from an industry configuration
 * 
 * @param config - The industry configuration to filter
 * @returns A new configuration with only frontend-visible fields
 */
export function getFrontendConfig(config: IndustryConfig): Omit<IndustryConfig, 'formFields'> & { formFields: FormField[] } {
  return {
    ...config,
    formFields: config.formFields.filter(field => !field.backendOnly),
  };
}

/**
 * ---------------------------------------------------------------------------
 * HOW TO ADD A NEW INDUSTRY:
 * ---------------------------------------------------------------------------
 * 
 * 1. Add a new entry to the INDUSTRY_REGISTRY with the industry's:
 *    - id: Unique identifier, kebab-case (e.g., 'laser-cutting')
 *    - name: Display name
 *    - description: Short description
 *    - pricingMode: How pricing is calculated (static, python, hybrid, ml)
 *    - icon: SVG path for the icon
 *    - basePrice: Starting price point
 *    - formFields: Array of form field definitions
 *    - materials: Array of supported materials
 *    - complexityLevels: Typically use STANDARD_COMPLEXITY_LEVELS
 *    - pricingModel: Name of Python model if applicable
 *    - fallbackCalcFunction: Function name for fallback calculations
 * 
 * 2. Create corresponding form component in src/components/quotes/
 * 
 * 3. Export the form component in src/components/quotes/index.ts
 * 
 * 4. Add the page component in src/app/quote/[your-industry]/page.tsx
 * 
 * ---------------------------------------------------------------------------
 * Note: This registry is designed to be easily migrated to a database like
 * Supabase in the future. The structure uses plain objects with consistent
 * typing that can be serialized to/from JSON.
 * ---------------------------------------------------------------------------
 */ 