import { NextResponse } from 'next/server';

// Industry configurations
const industryConfigs = {
  metal_fabrication: {
    id: "metal_fabrication",
    name: "Metal Fabrication",
    formFields: [
      {
        id: "material",
        label: "Material",
        type: "select",
        options: [
          { value: "aluminum", label: "Aluminum" },
          { value: "steel", label: "Steel" },
          { value: "stainless_steel", label: "Stainless Steel" },
          { value: "brass", label: "Brass" },
          { value: "copper", label: "Copper" }
        ],
        required: true
      },
      {
        id: "thickness",
        label: "Thickness (mm)",
        type: "number",
        min: 0.5,
        max: 50,
        required: true
      },
      {
        id: "width",
        label: "Width (mm)",
        type: "number",
        min: 10,
        max: 2000,
        required: true
      },
      {
        id: "height",
        label: "Height (mm)",
        type: "number",
        min: 10,
        max: 2000,
        required: true
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        min: 1,
        max: 10000,
        required: true
      },
      {
        id: "complexity",
        label: "Part Complexity",
        type: "select",
        options: [
          { value: "low", label: "Low - Simple cuts and bends" },
          { value: "medium", label: "Medium - Multiple features" },
          { value: "high", label: "High - Complex geometry and features" }
        ],
        required: true
      },
      {
        id: "surface_finish",
        label: "Surface Finish",
        type: "select",
        options: [
          { value: "none", label: "None - As fabricated" },
          { value: "powder_coat", label: "Powder Coating" },
          { value: "anodized", label: "Anodized (Aluminum only)" },
          { value: "brushed", label: "Brushed" },
          { value: "polished", label: "Polished" }
        ],
        required: true
      },
      {
        id: "lead_time",
        label: "Desired Lead Time",
        type: "select",
        options: [
          { value: "standard", label: "Standard (10-15 business days)" },
          { value: "expedited", label: "Expedited (5-7 business days)" },
          { value: "rush", label: "Rush (2-4 business days)" }
        ],
        required: true
      }
    ],
    complexityLevels: [
      { value: "low", label: "Low", factor: 1.0 },
      { value: "medium", label: "Medium", factor: 1.5 },
      { value: "high", label: "High", factor: 2.5 }
    ],
    materials: [
      { value: "aluminum", label: "Aluminum", basePrice: 2.5 },
      { value: "steel", label: "Steel", basePrice: 1.8 },
      { value: "stainless_steel", label: "Stainless Steel", basePrice: 4.2 },
      { value: "brass", label: "Brass", basePrice: 5.0 },
      { value: "copper", label: "Copper", basePrice: 6.0 }
    ]
  },
  injection_molding: {
    id: "injection_molding",
    name: "Injection Molding",
    formFields: [
      {
        id: "material",
        label: "Material",
        type: "select",
        options: [
          { value: "abs", label: "ABS" },
          { value: "polypropylene", label: "Polypropylene (PP)" },
          { value: "polyethylene", label: "Polyethylene (PE)" },
          { value: "nylon", label: "Nylon (PA)" },
          { value: "polycarbonate", label: "Polycarbonate (PC)" }
        ],
        required: true
      },
      {
        id: "part_volume",
        label: "Part Volume (cm³)",
        type: "number",
        min: 1,
        max: 1000,
        required: true
      },
      {
        id: "wall_thickness",
        label: "Wall Thickness (mm)",
        type: "number",
        min: 0.5,
        max: 10,
        required: true
      },
      {
        id: "quantity",
        label: "Quantity",
        type: "number",
        min: 100,
        max: 100000,
        required: true
      },
      {
        id: "cavity_count",
        label: "Cavity Count",
        type: "select",
        options: [
          { value: "1", label: "Single Cavity" },
          { value: "2", label: "2 Cavities" },
          { value: "4", label: "4 Cavities" },
          { value: "8", label: "8 Cavities" }
        ],
        required: true
      },
      {
        id: "surface_finish",
        label: "Surface Finish",
        type: "select",
        options: [
          { value: "standard", label: "Standard (SPI-C1)" },
          { value: "smooth", label: "Smooth (SPI-A2)" },
          { value: "textured", label: "Textured" },
          { value: "high_gloss", label: "High Gloss" }
        ],
        required: true
      },
      {
        id: "color",
        label: "Color",
        type: "select",
        options: [
          { value: "natural", label: "Natural (No colorant)" },
          { value: "black", label: "Black" },
          { value: "white", label: "White" },
          { value: "custom", label: "Custom Color" }
        ],
        required: true
      },
      {
        id: "lead_time",
        label: "Desired Lead Time",
        type: "select",
        options: [
          { value: "standard", label: "Standard (3-4 weeks)" },
          { value: "expedited", label: "Expedited (2 weeks)" },
          { value: "rush", label: "Rush (1 week)" }
        ],
        required: true
      }
    ],
    materials: [
      { value: "abs", label: "ABS", basePrice: 2.1 },
      { value: "polypropylene", label: "Polypropylene (PP)", basePrice: 1.8 },
      { value: "polyethylene", label: "Polyethylene (PE)", basePrice: 1.5 },
      { value: "nylon", label: "Nylon (PA)", basePrice: 3.2 },
      { value: "polycarbonate", label: "Polycarbonate (PC)", basePrice: 3.8 }
    ]
  }
};

export async function GET(
  request: Request,
  context: { params: { industryId: string } }
) {
  // Wait for params to be resolved
  const { industryId } = await Promise.resolve(context.params);

  // Check if the requested industry exists
  if (!industryConfigs[industryId as keyof typeof industryConfigs]) {
    return NextResponse.json(
      { error: `Industry '${industryId}' not found` },
      { status: 404 }
    );
  }

  // Return the industry config
  return NextResponse.json(industryConfigs[industryId as keyof typeof industryConfigs]);
} 