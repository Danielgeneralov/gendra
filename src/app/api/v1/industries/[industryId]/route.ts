import { NextResponse } from 'next/server';

// Set to 'force-dynamic' to bypass caching issues
export const dynamic = 'force-dynamic';

// Complete industry configurations with formFields
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
        id: "quantity",
        label: "Quantity",
        type: "number",
        min: 100,
        max: 100000,
        required: true
      },
      {
        id: "complexity",
        label: "Part Complexity",
        type: "select",
        options: [
          { value: "low", label: "Low - Simple geometry" },
          { value: "medium", label: "Medium - Some features" },
          { value: "high", label: "High - Complex features" }
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

// Route handler for GET requests using typed context from App Router
export async function GET(
  _req: Request,
  context: { params: { industryId: string } }
) {
  const { industryId } = context.params;

  if (!industryConfigs[industryId as keyof typeof industryConfigs]) {
    return NextResponse.json({ error: `Industry not found` }, { status: 404 });
  }

  return NextResponse.json(industryConfigs[industryId as keyof typeof industryConfigs]);
}
