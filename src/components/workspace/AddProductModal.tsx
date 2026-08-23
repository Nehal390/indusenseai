import React, { useState } from 'react';
import { ProductItem, ProductCategory } from '../../types';
import { X, Plus, Sparkles, Check, PackagePlus, AlertCircle } from 'lucide-react';

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: ProductItem) => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
  isOpen,
  onClose,
  onAddProduct,
}) => {
  const [sku, setSku] = useState('');
  const [cleanName, setCleanName] = useState('');
  const [category, setCategory] = useState('Motors & Drives');
  const [manufacturer, setManufacturer] = useState('');
  const [supplier, setSupplier] = useState('');
  const [price, setPrice] = useState('1250');
  const [currency, setCurrency] = useState('USD');
  const [rawDescription, setRawDescription] = useState('');
  
  // Quick dynamic specs
  const [spec1Name, setSpec1Name] = useState('Power Output');
  const [spec1Val, setSpec1Val] = useState('4.0 kW');
  const [spec2Name, setSpec2Name] = useState('Operating Voltage');
  const [spec2Val, setSpec2Val] = useState('400 V AC');
  const [spec3Name, setSpec3Name] = useState('Nominal Speed');
  const [spec3Val, setSpec3Val] = useState('1450 RPM');

  if (!isOpen) return null;

  const categories = [
    'Motors & Drives',
    'Bearings & Bushings',
    'Pumps & Hydraulics',
    'Pneumatic Actuators',
    'Industrial Sensors',
    'Valves & Piping',
    'Power Transmission',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!sku.trim() || !cleanName.trim()) {
      return;
    }

    const priceNum = parseFloat(price) || 0;
    const specsMap: Record<string, string> = {};
    const normSpecs: any[] = [];

    if (spec1Name.trim() && spec1Val.trim()) {
      specsMap[spec1Name.trim()] = spec1Val.trim();
      normSpecs.push({
        name: spec1Name.trim(),
        value: spec1Val.trim(),
        unit: '',
        isAiInferred: false,
        confidence: 98,
      });
    }

    if (spec2Name.trim() && spec2Val.trim()) {
      specsMap[spec2Name.trim()] = spec2Val.trim();
      normSpecs.push({
        name: spec2Name.trim(),
        value: spec2Val.trim(),
        unit: '',
        isAiInferred: false,
        confidence: 98,
      });
    }

    if (spec3Name.trim() && spec3Val.trim()) {
      specsMap[spec3Name.trim()] = spec3Val.trim();
      normSpecs.push({
        name: spec3Name.trim(),
        value: spec3Val.trim(),
        unit: '',
        isAiInferred: false,
        confidence: 98,
      });
    }

    const newProduct: ProductItem = {
      id: `prod-${Date.now()}`,
      sku: sku.trim().toUpperCase(),
      rawName: cleanName.trim(),
      cleanName: cleanName.trim(),
      category: category as ProductCategory,
      manufacturer: manufacturer.trim() || 'Custom Enterprise OEM',
      supplier: supplier.trim() || 'Internal Direct Inventory',
      price: priceNum,
      currency,
      stockStatus: 'In Stock',
      rawDescription: rawDescription.trim() || `${cleanName.trim()} - Standard industrial component.`,
      aiDescription: `Normalized technical component: ${cleanName.trim()} with validated attributes and enterprise taxonomy mapping.`,
      specs: specsMap,
      normalizedSpecs: normSpecs,
      applications: ['Plant Engineering', 'Automation Line', 'OEM Assembly'],
      certifications: ['ISO 9001', 'CE Mark'],
      dataQualityScore: 98,
      completenessScore: 95,
      aiConfidence: 96,
      missingFields: [],
      potentialDuplicates: [],
      similarProducts: [],
      isVerified: true,
    };

    onAddProduct(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fade-in font-mono">
      <div className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
              <PackagePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-zinc-100">
                ADD CUSTOM INDUSTRIAL COMPONENT
              </h3>
              <p className="text-[11px] text-zinc-400">
                Insert a single SKU directly into your active catalog repository.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto py-3 space-y-3.5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-300">SKU / Part Number <span className="text-rose-400">*</span></label>
              <input
                type="text"
                required
                placeholder="e.g. MTR-IND-4KW-400V"
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none uppercase"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300">Category <span className="text-rose-400">*</span></label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 focus:border-cyan-400 focus:outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300">Standardized Component Name <span className="text-rose-400">*</span></label>
            <input
              type="text"
              required
              placeholder="e.g. Siemens SIMOTICS 4.0 kW 3-Phase Induction Motor"
              value={cleanName}
              onChange={(e) => setCleanName(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-zinc-300">Manufacturer</label>
              <input
                type="text"
                placeholder="e.g. Siemens AG"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300">Supplier / Distributor</label>
              <input
                type="text"
                placeholder="e.g. Grainger / Fastenal"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300">Unit Price ($)</label>
              <input
                type="number"
                placeholder="1250"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
              />
            </div>
          </div>

          {/* Technical Specifications */}
          <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 space-y-2.5">
            <div className="text-[11px] text-cyan-400 font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>KEY ENGINEERING SPECIFICATIONS:</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Spec 1 Name"
                value={spec1Name}
                onChange={(e) => setSpec1Name(e.target.value)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Spec 1 Value"
                value={spec1Val}
                onChange={(e) => setSpec1Val(e.target.value)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Spec 2 Name"
                value={spec2Name}
                onChange={(e) => setSpec2Name(e.target.value)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Spec 2 Value"
                value={spec2Val}
                onChange={(e) => setSpec2Val(e.target.value)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-cyan-400"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Spec 3 Name"
                value={spec3Name}
                onChange={(e) => setSpec3Name(e.target.value)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-cyan-400"
              />
              <input
                type="text"
                placeholder="Spec 3 Value"
                value={spec3Val}
                onChange={(e) => setSpec3Val(e.target.value)}
                className="p-1.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-200 placeholder-zinc-600 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-zinc-300">Component Description</label>
            <textarea
              rows={2}
              placeholder="e.g. Continuous S1 duty, cast iron enclosure, IP55 protection rating."
              value={rawDescription}
              onChange={(e) => setRawDescription(e.target.value)}
              className="w-full p-2 rounded-lg bg-zinc-950 border border-zinc-700 text-zinc-100 placeholder-zinc-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-bold text-xs transition flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save & Add to Catalog</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
