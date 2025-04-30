import { NextResponse } from 'next/server';

// Sample industry data
const industries = [
  {
    id: "metal_fabrication",
    name: "Metal Fabrication",
    description: "Get instant quotes for sheet metal, machined parts, and metal components. Our advanced algorithms calculate costs based on material, complexity, and quantity.",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3 21V19.5M3 21H21M3 21L6.5 17.5M21 21V19.5M21 21L17.5 17.5M3 19.5V10.5L6.5 7M3 19.5H6.5M21 19.5V10.5L17.5 7M21 19.5H17.5M6.5 7V17.5M6.5 7H17.5M6.5 17.5H17.5M17.5 7V17.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>'
  },
  {
    id: "injection_molding",
    name: "Injection Molding",
    description: "Plastic part quoting made simple. Input your specifications and receive accurate quotes for injection molded parts based on material, cavity count, and cycle time.",
    icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.5 21H9.51M9.5 14H9.51M9.5 7H9.51M9.5 3H9.51M14.5 21H14.51M14.5 17H14.51M14.5 10H14.51M14.5 3H14.51M19.5 21H19.51M19.5 14H19.51M19.5 7H19.51M19.5 3H19.51M4.5 21H4.51M4.5 17H4.51M4.5 10H4.51M4.5 3H4.51" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  }
];

export async function GET() {
  return NextResponse.json({ industries });
} 