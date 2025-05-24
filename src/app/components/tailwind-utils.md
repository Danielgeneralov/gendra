# Gendra Tailwind Utility Classes

## Layout & Containers
```
/* Section layouts */
.section-container = "py-36 px-8 bg-gradient-to-b from-[#0f0f1a] to-[#1c1b2a] text-white"
.section-border = "border-t border-slate-700"
.section-content = "max-w-6xl mx-auto"

/* Card layouts */
.card-container = "bg-slate-800/70 border border-slate-700 rounded-xl p-8 shadow-lg h-full"
.card-container-inner-glow = "shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
.card-inner = "bg-slate-900/80 border border-slate-700 rounded-lg p-6"
```

## Typography
```
/* Headings */
.heading-xl = "text-4xl md:text-5xl font-bold tracking-tight text-white"
.heading-lg = "text-3xl font-bold text-white"
.heading-md = "text-2xl font-bold text-white"
.heading-sm = "text-xl font-bold text-white"

/* Body text */
.text-body-lg = "text-xl text-slate-100"
.text-body = "text-base text-slate-100"
.text-body-sm = "text-sm text-slate-400"
.text-caption = "text-xs text-slate-400"
```

## Interactive Elements
```
/* Buttons */
.btn-primary = "bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-300 ease-in-out"
.btn-secondary = "bg-slate-800 text-slate-300 border border-slate-700 rounded-md hover:bg-slate-700 transition-all duration-300 ease-in-out"

/* Input fields */
.input-field = "w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"
.select-field = "w-full bg-slate-900 border border-slate-700 rounded-md p-2.5 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all duration-300 ease-in-out"

/* Tabs */
.tab-container = "inline-flex p-1 rounded-full bg-slate-800 border border-slate-700 shadow-inner"
.tab-active = "relative px-5 py-2 rounded-full text-sm font-medium text-white transition-all duration-300 ease-in-out"
.tab-inactive = "relative px-5 py-2 rounded-full text-sm font-medium text-slate-400 hover:text-slate-200 transition-all duration-300 ease-in-out"
```

## Decorative Elements
```
/* Accent icons */
.icon-container = "w-10 h-10 rounded-lg bg-blue-900/30 flex items-center justify-center mr-4"
.icon = "w-5 h-5 text-blue-400"

/* Callouts */
.callout = "bg-blue-900/20 border border-blue-800/30 p-4 rounded-lg text-slate-400 text-sm"

/* Logo items */
.logo-item = "grayscale opacity-70 hover:opacity-100 transition-opacity duration-300"
```

## Animation & Transitions
```
/* Ensure consistent transitions */
.transition-standard = "transition-all duration-300 ease-in-out"

/* Hover effects */
.hover-scale = "hover:scale-105 transition-all duration-300 ease-in-out"
.hover-glow = "hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] transition-all duration-300 ease-in-out"
```

## Framer Motion Animation Variants
```javascript
// Use these animation variants consistently across components

// Fade up animation for content blocks
const fadeUpVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.4 }
  }
};

// Card hover effects
const cardHoverVariants = {
  hover: { 
    y: -5,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.2)",
    transition: { duration: 0.3, ease: "easeInOut" }
  }
};

// Tab highlight animation
const tabHighlightVariants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { duration: 0.3, type: "spring", stiffness: 500, damping: 30 }
  }
};
```

## Usage Guidelines

1. **Keep the Visual Hierarchy Consistent**
   - Main backgrounds: from-[#0f0f1a] to-[#1c1b2a]
   - Cards: bg-slate-800/70
   - Inner elements: bg-slate-900/80

2. **Text Color Usage**
   - Headings and important text: text-white
   - Body text: text-slate-100
   - Secondary text: text-slate-400
   - Never use text-black

3. **Interaction Guidelines**
   - Every interactive element should have a hover state
   - Use transition-all duration-300 ease-in-out consistently
   - Apply Framer Motion for primary interactions only where it adds clarity

4. **Spacing System**
   - Main sections: py-36
   - Cards internal spacing: p-8
   - Content elements: gap-6 or mb-6
``` 