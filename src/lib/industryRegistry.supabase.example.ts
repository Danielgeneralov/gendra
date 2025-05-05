/**
 * Example schema and functions for migrating the industry registry to Supabase or another database.
 * This is a conceptual example showing how to structure tables and fetch data.
 */

// TypeScript definitions for database tables
export type DbIndustry = {
  id: string;
  name: string;
  description: string;
  pricing_mode: string;
  icon: string;
  base_price: number;
  pricing_model?: string;
  unit_label?: string;
  fallback_calc_function?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type DbFormField = {
  id: string;
  industry_id: string;
  field_id: string;
  label: string;
  type: string;
  required: boolean;
  default_value?: string | number | boolean;
  description?: string;
  placeholder?: string;
  backend_only: boolean;
  order: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  min_length?: number;
  max_length?: number;
  pattern?: string;
  multiple?: boolean;
  min_date?: string;
  max_date?: string;
  rows?: number;
  cols?: number;
  created_at: string;
  updated_at: string;
};

export type DbSelectOption = {
  id: string;
  form_field_id: string;
  option_id: string;
  label: string;
  value?: string | number;
  order: number;
  created_at: string;
  updated_at: string;
};

export type DbMaterial = {
  id: string;
  industry_id: string;
  material_id: string;
  name: string;
  rate: number;
  description?: string;
  created_at: string;
  updated_at: string;
};

export type DbComplexityLevel = {
  id: string;
  industry_id: string;
  level_id: string;
  name: string;
  factor: number;
  description?: string;
  created_at: string;
  updated_at: string;
};

// Schema definitions for Supabase
/**
 * Example SQL to create tables in Supabase:
 * 
 * -- Industries Table
 * CREATE TABLE industries (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   industry_id TEXT UNIQUE NOT NULL,
 *   name TEXT NOT NULL,
 *   description TEXT,
 *   pricing_mode TEXT NOT NULL,
 *   icon TEXT,
 *   base_price DECIMAL(10, 2) NOT NULL,
 *   pricing_model TEXT,
 *   unit_label TEXT,
 *   fallback_calc_function TEXT,
 *   is_active BOOLEAN DEFAULT true,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
 * );
 * 
 * -- Form Fields Table
 * CREATE TABLE form_fields (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
 *   field_id TEXT NOT NULL,
 *   label TEXT NOT NULL,
 *   type TEXT NOT NULL,
 *   required BOOLEAN DEFAULT false,
 *   default_value JSONB,
 *   description TEXT,
 *   placeholder TEXT,
 *   backend_only BOOLEAN DEFAULT false,
 *   order INTEGER NOT NULL,
 *   min DECIMAL(10, 2),
 *   max DECIMAL(10, 2),
 *   step DECIMAL(10, 2),
 *   unit TEXT,
 *   min_length INTEGER,
 *   max_length INTEGER,
 *   pattern TEXT,
 *   multiple BOOLEAN DEFAULT false,
 *   min_date TEXT,
 *   max_date TEXT,
 *   rows INTEGER,
 *   cols INTEGER,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(industry_id, field_id)
 * );
 * 
 * -- Select Options Table
 * CREATE TABLE select_options (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   form_field_id UUID REFERENCES form_fields(id) ON DELETE CASCADE,
 *   option_id TEXT NOT NULL,
 *   label TEXT NOT NULL,
 *   value JSONB,
 *   order INTEGER NOT NULL,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(form_field_id, option_id)
 * );
 * 
 * -- Materials Table
 * CREATE TABLE materials (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
 *   material_id TEXT NOT NULL,
 *   name TEXT NOT NULL,
 *   rate DECIMAL(10, 2) NOT NULL,
 *   description TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(industry_id, material_id)
 * );
 * 
 * -- Complexity Levels Table
 * CREATE TABLE complexity_levels (
 *   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
 *   industry_id UUID REFERENCES industries(id) ON DELETE CASCADE,
 *   level_id TEXT NOT NULL,
 *   name TEXT NOT NULL,
 *   factor DECIMAL(10, 2) NOT NULL,
 *   description TEXT,
 *   created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
 *   UNIQUE(industry_id, level_id)
 * );
 */

// Example function to fetch industry config from Supabase
// This would replace the static INDUSTRY_REGISTRY object
import { createClient } from '@supabase/supabase-js';
import { IndustryConfig, FormField, FormFieldType, SelectOption, Material, ComplexityLevel, PricingMode } from './industryRegistry';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Fetches an industry configuration from Supabase
 * 
 * @param industryId - The ID of the industry to fetch
 * @returns The industry configuration or null if not found
 */
export async function getIndustryConfigFromDb(industryId: string): Promise<IndustryConfig | null> {
  try {
    // Fetch the industry record
    const { data: industry, error: industryError } = await supabase
      .from('industries')
      .select('*')
      .eq('industry_id', industryId)
      .single();
    
    if (industryError || !industry) {
      console.error('Error fetching industry:', industryError);
      return null;
    }
    
    // Fetch form fields for this industry
    const { data: formFields, error: formFieldsError } = await supabase
      .from('form_fields')
      .select('*')
      .eq('industry_id', industry.id)
      .order('order');
    
    if (formFieldsError) {
      console.error('Error fetching form fields:', formFieldsError);
      return null;
    }
    
    // Fetch select options for all form fields
    const formFieldIds = formFields.map(field => field.id);
    const { data: selectOptions, error: selectOptionsError } = await supabase
      .from('select_options')
      .select('*')
      .in('form_field_id', formFieldIds)
      .order('order');
    
    if (selectOptionsError) {
      console.error('Error fetching select options:', selectOptionsError);
      return null;
    }
    
    // Fetch materials for this industry
    const { data: materials, error: materialsError } = await supabase
      .from('materials')
      .select('*')
      .eq('industry_id', industry.id);
    
    if (materialsError) {
      console.error('Error fetching materials:', materialsError);
      return null;
    }
    
    // Fetch complexity levels for this industry
    const { data: complexityLevels, error: complexityLevelsError } = await supabase
      .from('complexity_levels')
      .select('*')
      .eq('industry_id', industry.id);
    
    if (complexityLevelsError) {
      console.error('Error fetching complexity levels:', complexityLevelsError);
      return null;
    }
    
    // Transform DB records to our application models
    const transformedFormFields: FormField[] = formFields.map(field => {
      // Find all options for this field if it's a select field
      const fieldOptions = selectOptions
        .filter(option => option.form_field_id === field.id)
        .map(option => ({
          id: option.option_id,
          label: option.label,
          value: option.value
        }));
      
      // Base field properties
      const baseField = {
        id: field.field_id,
        label: field.label,
        type: field.type as FormFieldType,
        required: field.required,
        defaultValue: field.default_value,
        description: field.description,
        placeholder: field.placeholder,
        backendOnly: field.backend_only,
      };
      
      // Add type-specific properties based on field type
      switch (field.type) {
        case FormFieldType.NUMBER:
          return {
            ...baseField,
            min: field.min,
            max: field.max,
            step: field.step,
            unit: field.unit,
          } as FormField;
        case FormFieldType.TEXT:
          return {
            ...baseField,
            minLength: field.min_length,
            maxLength: field.max_length,
            pattern: field.pattern,
          } as FormField;
        case FormFieldType.SELECT:
          return {
            ...baseField,
            options: fieldOptions as SelectOption[],
            multiple: field.multiple,
          } as FormField;
        case FormFieldType.CHECKBOX:
          return baseField as FormField;
        case FormFieldType.DATE:
          return {
            ...baseField,
            minDate: field.min_date,
            maxDate: field.max_date,
          } as FormField;
        case FormFieldType.TEXTAREA:
          return {
            ...baseField,
            rows: field.rows,
            cols: field.cols,
          } as FormField;
        default:
          // This is a fallback to handle unknown field types
          // It will at least ensure the base properties are included
          return baseField as unknown as FormField;
      }
    });
    
    // Transform materials
    const transformedMaterials: Material[] = materials.map(material => ({
      id: material.material_id,
      name: material.name,
      rate: material.rate,
      description: material.description,
    }));
    
    // Transform complexity levels
    const transformedComplexityLevels: ComplexityLevel[] = complexityLevels.map(level => ({
      id: level.level_id,
      name: level.name,
      factor: level.factor,
      description: level.description,
    }));
    
    // Assemble the complete industry configuration
    const industryConfig: IndustryConfig = {
      id: industry.industry_id,
      name: industry.name,
      description: industry.description,
      pricingMode: industry.pricing_mode as PricingMode,
      icon: industry.icon,
      basePrice: industry.base_price,
      formFields: transformedFormFields,
      materials: transformedMaterials,
      complexityLevels: transformedComplexityLevels,
      pricingModel: industry.pricing_model,
      unitLabel: industry.unit_label,
      fallbackCalcFunction: industry.fallback_calc_function,
      isActive: industry.is_active,
    };
    
    return industryConfig;
  } catch (error) {
    console.error('Error fetching industry config from database:', error);
    return null;
  }
}

/**
 * Fetches all active industry configurations from Supabase
 * 
 * @returns Array of active industry configurations
 */
export async function getAllIndustriesFromDb(): Promise<IndustryConfig[]> {
  try {
    // Fetch all active industries
    const { data: industries, error } = await supabase
      .from('industries')
      .select('industry_id')
      .eq('is_active', true);
    
    if (error || !industries) {
      console.error('Error fetching industries:', error);
      return [];
    }
    
    // Fetch complete config for each industry
    const industryConfigs = await Promise.all(
      industries.map(industry => getIndustryConfigFromDb(industry.industry_id))
    );
    
    // Filter out any nulls (failed fetches)
    return industryConfigs.filter(Boolean) as IndustryConfig[];
  } catch (error) {
    console.error('Error fetching all industries from database:', error);
    return [];
  }
}

/**
 * ---------------------------------------------------------------------------
 * HOW TO ADD A NEW INDUSTRY WITH SUPABASE:
 * ---------------------------------------------------------------------------
 * 
 * 1. Insert a new record into the 'industries' table:
 *    ```sql
 *    INSERT INTO industries (
 *      industry_id, name, description, pricing_mode, icon, base_price, 
 *      pricing_model, is_active
 *    ) VALUES (
 *      'laser-cutting', 'Laser Cutting', 'Precision laser cutting services', 
 *      'hybrid', '[svg-path-here]', 40, 'laser_cut_predict', true
 *    );
 *    ```
 * 
 * 2. Get the UUID of the inserted industry:
 *    ```sql
 *    SELECT id FROM industries WHERE industry_id = 'laser-cutting';
 *    ```
 * 
 * 3. Insert form fields for the industry:
 *    ```sql
 *    INSERT INTO form_fields (
 *      industry_id, field_id, label, type, required, default_value, 
 *      order, min, unit
 *    ) VALUES (
 *      '[uuid-from-step-2]', 'thickness', 'Material Thickness', 
 *      'number', true, '1.0', 1, 0.1, 'mm'
 *    );
 *    ```
 * 
 * 4. For select fields, add options:
 *    ```sql
 *    -- First get the form field id:
 *    SELECT id FROM form_fields 
 *    WHERE industry_id = '[uuid-from-step-2]' AND field_id = 'material';
 *    
 *    -- Then insert options:
 *    INSERT INTO select_options (
 *      form_field_id, option_id, label, value, order
 *    ) VALUES (
 *      '[form-field-id]', 'acrylic', 'Acrylic', 2.5, 1
 *    );
 *    ```
 * 
 * 5. Add materials and complexity levels similarly
 * 
 * 6. Create the corresponding form component and page as in the static system
 * 
 * ---------------------------------------------------------------------------
 */ 