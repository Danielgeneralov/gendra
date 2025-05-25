"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

interface QuoteItem {
  id: number;
  name: string;
  basePrice: number;
  quantity: number;
  material: string;
  finalPrice: number;
  discount?: number;
}

const QuoteIntelligenceDemo = () => {
  const [material, setMaterial] = useState<string>("aluminum");
  const [quantity, setQuantity] = useState<number>(25);
  const [items, setItems] = useState<QuoteItem[]>([
    {
      id: 1,
      name: "Bracket Assembly",
      basePrice: 45.00,
      quantity: 25,
      material: "aluminum",
      finalPrice: 45.00 * 25,
    }
  ]);
  const [calculating, setCalculating] = useState<number | null>(null);
  const [ruleHovered, setRuleHovered] = useState<boolean>(false);
  const [activeRule, setActiveRule] = useState<boolean>(false);

  // Update quotes when material or quantity changes
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (material && quantity) {
      setCalculating(1);
      
      timeout = setTimeout(() => {
        const newItems = [...items];
        const item = newItems[0];
        
        // Apply "discount" rule if aluminum and qty > 50
        const applyDiscount = material === "aluminum" && quantity > 50;
        const discount = applyDiscount ? 0.12 : 0;
        
        item.material = material;
        item.quantity = quantity;
        item.discount = discount;
        
        // Calculate the final price with potential discount
        const baseTotal = item.basePrice * quantity;
        item.finalPrice = discount > 0 ? baseTotal * (1 - discount) : baseTotal;
        
        setActiveRule(applyDiscount);
        setItems(newItems);
        setCalculating(null);
      }, 800);
    }
    
    return () => clearTimeout(timeout);
  }, [material, quantity]);

  return (
    <div className="space-y-4">
      {/* Quote Logic Rule */}
      <motion.div 
        className={`p-3 rounded-md text-xs font-mono ${ruleHovered || activeRule ? "bg-blue-900/30 border border-blue-700/40" : "bg-slate-800/60 border border-slate-700"}`}
        whileHover={{ scale: 1.02 }}
        onHoverStart={() => setRuleHovered(true)}
        onHoverEnd={() => setRuleHovered(false)}
      >
        <code className="text-slate-300">
          if (material === <span className="text-green-400">&quot;aluminum&quot;</span> &amp;&amp; quantity &gt; <span className="text-amber-400">50</span>) {"{"}
          <br />
          {"  "}applyDiscount(<span className="text-purple-400">12%</span>);
          <br />
          {"}"}
        </code>
      </motion.div>
      
      {/* Material and Quantity Selectors */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-slate-400 text-xs mb-1">Material</label>
          <select 
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-300 text-sm"
            value={material}
            onChange={(e) => setMaterial(e.target.value)}
          >
            <option value="aluminum">Aluminum</option>
            <option value="steel">Steel</option>
            <option value="titanium">Titanium</option>
          </select>
        </div>
        <div>
          <label className="block text-slate-400 text-xs mb-1">Quantity</label>
          <input 
            type="number" 
            className="w-full bg-slate-800 border border-slate-700 rounded-md p-2 text-slate-300 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            min="1"
          />
        </div>
      </div>
      
      {/* Quote Table */}
      <div className="overflow-hidden rounded-md border border-slate-700">
        <table className="w-full text-sm">
          <thead className="bg-slate-800">
            <tr>
              <th className="text-left p-2 text-xs text-slate-400 font-medium">Item</th>
              <th className="text-right p-2 text-xs text-slate-400 font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-t border-slate-700">
                <td className="p-2 text-slate-300">
                  {item.name} ({item.material}) x {item.quantity}
                </td>
                <motion.td 
                  className={`p-2 text-right ${calculating === item.id ? "text-blue-400" : "text-white"}`}
                  animate={calculating === item.id ? { opacity: [1, 0.5, 1] } : {}}
                  transition={{ repeat: Infinity, duration: 0.5 }}
                >
                  ${item.finalPrice.toFixed(2)}
                  {item.discount && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-xs text-green-400"
                    >
                      12% discount applied
                    </motion.div>
                  )}
                </motion.td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-800/60 border-t border-slate-700">
            <tr>
              <td className="p-2 text-slate-300 font-medium">Total</td>
              <motion.td 
                className="p-2 text-right text-white font-medium"
                animate={calculating === 1 ? { opacity: [1, 0.5, 1] } : {}}
                transition={{ repeat: calculating ? Infinity : 0, duration: 0.5 }}
              >
                ${items.reduce((sum, item) => sum + item.finalPrice, 0).toFixed(2)}
              </motion.td>
            </tr>
          </tfoot>
        </table>
      </div>
      
      <div className="text-xs text-slate-400 mt-2">
        Try changing the quantity above 50 to see the discount rule applied
      </div>
    </div>
  );
};

export { QuoteIntelligenceDemo }; 