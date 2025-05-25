// Industry-specific FAQ data for structured data and display
export interface FAQ {
  question: string;
  answer: string;
}

export type IndustryFAQs = Record<string, FAQ[]>;

export const industryFaqs: IndustryFAQs = {
  'metal-fabrication': [
    {
      question: "How quickly can I get a metal fabrication quote?",
      answer: "With Gendra's AI-powered platform, you'll receive an instant quote for your metal fabrication project as soon as you submit specifications - no more waiting days for manual quotes."
    },
    {
      question: "What metal materials can I get quotes for?",
      answer: "Our platform supports quoting for aluminum, steel, stainless steel, and copper fabrication projects, with options for various finishing processes."
    },
    {
      question: "How accurate are the automated metal fabrication quotes?",
      answer: "Gendra's quotes are highly accurate, leveraging AI trained on thousands of real manufacturing projects with specific focus on metal fabrication processes and material costs."
    },
    {
      question: "Can I get quotes for complex metal fabrication projects?",
      answer: "Yes, our platform handles everything from simple sheet metal parts to complex fabricated assemblies with multiple processes and finishing requirements."
    },
    {
      question: "Do you support quoting for metal surface finishing and coating?",
      answer: "Absolutely. Our system accounts for various finishing options including powder coating, anodizing, plating, painting, and specialized surface treatments for metal fabrication projects."
    }
  ],
  'sheet-metal': [
    {
      question: "What sheet metal thicknesses does Gendra support for quoting?",
      answer: "We support the full range of standard sheet metal gauges from thin (0.5mm) to thick (10mm+) sheets, with precise cost calculations for each thickness."
    },
    {
      question: "Can I get quotes for bent sheet metal parts?",
      answer: "Yes, our platform automatically calculates costs for sheet metal parts with bends, accounting for bend allowances, tooling requirements, and setup costs."
    },
    {
      question: "Does Gendra support quotes for sheet metal assemblies?",
      answer: "Absolutely. You can get quotes for complete sheet metal assemblies including multiple parts, fasteners, and welding operations."
    },
    {
      question: "How does Gendra handle sheet metal coating and finishing in quotes?",
      answer: "Our platform includes precise calculations for various sheet metal finishes including powder coating, wet painting, plating, and specialty finishes with accurate pricing."
    }
  ],
  'cnc-machining': [
    {
      question: "What materials can I get CNC machining quotes for?",
      answer: "Our platform provides quotes for CNC machining of aluminum, steel, stainless steel, titanium, brass, and various plastic materials with accurate material cost factors."
    },
    {
      question: "How does Gendra calculate CNC machining costs?",
      answer: "We analyze part geometry, material, tolerance requirements, surface finishes, and quantity to calculate precise machining times, tool paths, and setup costs."
    },
    {
      question: "Can I get quotes for 5-axis CNC machining operations?",
      answer: "Yes, Gendra supports quoting for advanced 5-axis CNC machined parts with complex geometries and precise tolerances."
    },
    {
      question: "Does Gendra account for post-machining treatments and finishing?",
      answer: "Our platform includes costs for heat treatment, anodizing, plating, and specialized surface treatments for CNC machined parts."
    }
  ],
  'electronics-assembly': [
    {
      question: "Can I get quotes for PCB assembly with Gendra?",
      answer: "Yes, our platform provides instant quotes for PCB assembly including component sourcing, SMT, through-hole, and testing processes."
    },
    {
      question: "How does Gendra handle BOM costs for electronics assembly?",
      answer: "Our system accesses current component pricing and availability data to provide accurate BOM costing for electronics assembly projects."
    },
    {
      question: "Can I get quotes for different PCBA volumes?",
      answer: "Absolutely. Gendra calculates optimal pricing for electronics assembly from prototypes (10+ units) to high-volume production (10,000+ units)."
    },
    {
      question: "Does the platform account for electronics testing costs?",
      answer: "Yes, our quotes include functional testing, ICT, FCT, and other quality assurance processes specific to electronics manufacturing."
    }
  ],
  'injection-molding': [
    {
      question: "How does Gendra calculate injection molding tooling costs?",
      answer: "Our system analyzes part geometry, complexity, material, and production volume to generate accurate tooling cost estimates for injection molding."
    },
    {
      question: "What plastic materials can I get quotes for?",
      answer: "Gendra supports quoting for common injection molding resins including ABS, polypropylene, polyethylene, polycarbonate, nylon, and specialty materials."
    },
    {
      question: "Can I get quotes for large production volumes?",
      answer: "Yes, our platform optimizes injection molding quotes for high-volume production with appropriate quantity discounts and cycle time calculations."
    },
    {
      question: "Does Gendra account for insert molding or multi-component molding?",
      answer: "Our platform supports quoting for advanced injection molding processes including insert molding, overmolding, and multi-shot molding techniques."
    }
  ]
};

// Function to get focused FAQs when specific industries need to be highlighted
export function getPrioritizedFAQs(focusIndustries: string[] = []): IndustryFAQs {
  // If no focus industries specified, return all FAQs
  if (focusIndustries.length === 0) {
    return industryFaqs;
  }
  
  // Create a new object with just the focus industries
  const prioritized: IndustryFAQs = {};
  
  focusIndustries.forEach(industry => {
    if (industryFaqs[industry]) {
      prioritized[industry] = industryFaqs[industry];
    }
  });
  
  return prioritized;
} 