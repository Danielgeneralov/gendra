'use client';

import { useState, useEffect } from 'react';
import { 
  getIndustryConfig, 
  IndustryConfig, 
  FormField, 
  FormFieldType,
  PricingMode 
} from './industryRegistry';

/**
 * Example component showing how to use the industry registry for dynamic form generation
 */
export default function DynamicIndustryForm({ industryId }: { industryId: string }) {
  const [config, setConfig] = useState<IndustryConfig | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load the industry configuration
  useEffect(() => {
    try {
      // For client-side usage, you can directly access the registry
      const industryConfig = getIndustryConfig(industryId);
      
      if (!industryConfig) {
        setError(`Industry '${industryId}' not found`);
        setLoading(false);
        return;
      }
      
      // Initialize form data with default values
      const initialData: Record<string, any> = {};
      industryConfig.formFields.forEach(field => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
      
      setConfig(industryConfig);
      setFormData(initialData);
      setLoading(false);
    } catch (err) {
      setError('Failed to load industry configuration');
      setLoading(false);
    }
  }, [industryId]);

  // Alternative: Fetch from API for SSR scenarios
  // useEffect(() => {
  //   async function fetchConfig() {
  //     try {
  //       const response = await fetch(`/api/v1/quote-config/${industryId}`);
  //       
  //       if (!response.ok) {
  //         throw new Error(`Failed to load industry: ${response.statusText}`);
  //       }
  //       
  //       const industryConfig = await response.json();
  //       
  //       // Initialize form data with default values
  //       const initialData: Record<string, any> = {};
  //       industryConfig.formFields.forEach(field => {
  //         if (field.defaultValue !== undefined) {
  //           initialData[field.id] = field.defaultValue;
  //         }
  //       });
  //       
  //       setConfig(industryConfig);
  //       setFormData(initialData);
  //     } catch (err) {
  //       setError(err.message || 'Failed to load industry configuration');
  //     } finally {
  //       setLoading(false);
  //     }
  //   }
  //   
  //   fetchConfig();
  // }, [industryId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    
    // Handle checkboxes
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
      return;
    }
    
    // Handle other input types
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Example of submitting to the quote calculation endpoint
    try {
      const response = await fetch('/api/v1/quote-calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          industryId,
          ...formData,
        }),
      });
      
      if (!response.ok) {
        throw new Error(`Quote calculation failed: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Quote result:', result);
      
      // Handle quote display logic here
    } catch (err) {
      console.error('Error calculating quote:', err);
      // Handle error display logic here
    }
  };

  // Render a form field based on its type
  const renderField = (field: FormField) => {
    switch (field.type) {
      case FormFieldType.TEXT:
        return (
          <input
            type="text"
            id={field.id}
            name={field.id}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            required={field.required}
            className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
          />
        );
        
      case FormFieldType.NUMBER:
        return (
          <input
            type="number"
            id={field.id}
            name={field.id}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            min={field.min}
            max={field.max}
            step={field.step}
            required={field.required}
            className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
          />
        );
        
      case FormFieldType.SELECT:
        return (
          <select
            id={field.id}
            name={field.id}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            required={field.required}
            multiple={field.multiple}
            className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
          >
            {field.options.map(option => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
        );
        
      case FormFieldType.CHECKBOX:
        return (
          <input
            type="checkbox"
            id={field.id}
            name={field.id}
            checked={formData[field.id] || false}
            onChange={handleInputChange}
            className="h-4 w-4 text-[#4A6FA6] focus:ring-[#4A6FA6] border-[#24334A] rounded"
          />
        );
        
      case FormFieldType.DATE:
        return (
          <input
            type="date"
            id={field.id}
            name={field.id}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            min={field.minDate}
            max={field.maxDate}
            required={field.required}
            className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
          />
        );
        
      case FormFieldType.TEXTAREA:
        return (
          <textarea
            id={field.id}
            name={field.id}
            value={formData[field.id] || ''}
            onChange={handleInputChange}
            rows={field.rows}
            cols={field.cols}
            required={field.required}
            placeholder={field.placeholder}
            className="w-full bg-[#141F30] border border-[#24334A] rounded-md py-2 px-3 text-[#E2E8F0] focus:outline-none focus:ring-2 focus:ring-[#4A6FA6] focus:border-transparent"
          />
        );
        
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4A6FA6]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 text-red-200 px-4 py-3 rounded-md">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    );
  }

  if (!config) {
    return (
      <div className="bg-yellow-900/30 border border-yellow-700 text-yellow-200 px-4 py-3 rounded-md">
        <p>Industry {industryId} not found</p>
      </div>
    );
  }

  return (
    <div className="bg-[#0A1828]/50 backdrop-blur-sm p-6 rounded-lg shadow-xl border border-[#050C1C] hover:border-[#4A6FA6]/50 transition-all duration-300 mb-8">
      <h2 className="text-xl font-semibold text-[#4A6FA6] mb-4">{config.name} Quote</h2>
      <p className="text-[#E2E8F0] mb-6">{config.description}</p>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {config.formFields.map(field => (
            <div key={field.id}>
              <label className="block text-[#E2E8F0] text-sm font-medium mb-2" htmlFor={field.id}>
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderField(field)}
              {field.description && (
                <p className="mt-1 text-xs text-[#94A3B8]">{field.description}</p>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <button
            type="submit"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Calculate Quote
          </button>
        </div>
      </form>
      
      {/* Pricing information */}
      <div className="mt-6 text-sm text-[#94A3B8]">
        <p>Base price: ${config.basePrice}</p>
        <p>Pricing mode: {config.pricingMode}</p>
      </div>
    </div>
  );
}

/**
 * Example: Generating a price visualization based on industry config
 */
export function PricingFactors({ industryId }: { industryId: string }) {
  const config = getIndustryConfig(industryId);
  
  if (!config) {
    return <p>Industry not found</p>;
  }
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Pricing Factors</h3>
      
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium">Materials</h4>
          <ul className="mt-2 space-y-1">
            {config.materials.map(material => (
              <li key={material.id} className="flex justify-between">
                <span>{material.name}</span>
                <span>×{material.rate}</span>
              </li>
            ))}
          </ul>
        </div>
        
        <div>
          <h4 className="text-sm font-medium">Complexity Levels</h4>
          <ul className="mt-2 space-y-1">
            {config.complexityLevels.map(level => (
              <li key={level.id} className="flex justify-between">
                <span>{level.name}</span>
                <span>×{level.factor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

/**
 * Example: Using the registry to check if an industry is supported
 */
export function IndustrySelector() {
  const industries = [
    'cnc-machining',
    'injection-molding',
    'sheet-metal',
    'metal-fabrication',
    'electronics-assembly',
    '3d-printing',
    'laser-cutting', // This might not exist yet
  ];
  
  return (
    <div>
      <h3 className="text-lg font-medium mb-3">Available Industries</h3>
      <ul className="space-y-2">
        {industries.map(industry => {
          const config = getIndustryConfig(industry);
          const isSupported = !!config;
          
          return (
            <li key={industry} className={`flex items-center ${isSupported ? 'text-green-500' : 'text-red-500'}`}>
              <span className="w-4 h-4 mr-2">
                {isSupported ? '✓' : '✗'}
              </span>
              <span>{industry}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
} 