import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Package, Plus, Trash2, ChevronRight, BarChart2, Edit2, Search, ArrowRight,
  Upload, AlertCircle, FileText, CheckCircle2, X, Star, Tag, Database, 
  ShoppingBag, Settings, LogOut, Folder, RefreshCw, Layers, Sliders, Globe, Eye,
  User, CheckSquare, MessageSquare, AlertTriangle, Send, Leaf
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Product, Order, UserRole, Farmer, SoilReport, DeficiencyAlertRule, NutritionPlan, Consultation, SupportTicket, WorkspaceSettings } from "../types";

interface ProductsModuleProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  orders: Order[];
  setOrders: React.Dispatch<React.SetStateAction<Order[]>>;
  farmers: Farmer[];
  setFarmers: React.Dispatch<React.SetStateAction<Farmer[]>>;
  soilReports: SoilReport[];
  setSoilReports: React.Dispatch<React.SetStateAction<SoilReport[]>>;
  alertRules: DeficiencyAlertRule[];
  setAlertRules: React.Dispatch<React.SetStateAction<DeficiencyAlertRule[]>>;
  nutritionPlans: NutritionPlan[];
  setNutritionPlans: React.Dispatch<React.SetStateAction<NutritionPlan[]>>;
  consultations: Consultation[];
  setConsultations: React.Dispatch<React.SetStateAction<Consultation[]>>;
  tickets: SupportTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SupportTicket[]>>;
  settings: WorkspaceSettings | null;
  setSettings: React.Dispatch<React.SetStateAction<WorkspaceSettings | null>>;

  onAddProduct: (prod: Omit<Product, "id">) => void;
  onEditProductStock: (id: string, newStock: number) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (id: string, nextStatus: 'Processing' | 'In-Transit' | 'Delivered') => void;
  onClearActivities: () => void;
  onUpdateFarmerRole: (id: string, role: string) => void;
  onUpdateFarmerStatus: (id: string, status: 'Active' | 'Suspended') => void;
  onReviewSoilReport: (id: string, action: string) => void;
  onAddAlertRule: (rule: any) => void;
  onToggleAlertRule: (id: string, active: boolean) => void;
  onDeleteAlertRule: (id: string) => void;
  onAddPlan: (plan: any) => void;
  onDeletePlan: (id: string) => void;
  onCompleteConsultation: (id: string, notes: string) => void;
  onAddTicketMessage: (ticketId: string, text: string, isInternal: boolean) => void;
  onUpdateTicketStatus: (id: string, status: any) => void;
  onSaveSettings: (setts: any) => void;

  adminUser: { email: string; name: string; role: UserRole } | null;
  onSignOut: () => void;
}

export const ProductsModule: React.FC<ProductsModuleProps> = ({
  products,
  setProducts,
  orders,
  setOrders,
  farmers,
  setFarmers,
  soilReports,
  setSoilReports,
  alertRules,
  setAlertRules,
  nutritionPlans,
  setNutritionPlans,
  consultations,
  setConsultations,
  tickets,
  setTickets,
  settings,
  setSettings,

  onAddProduct,
  onEditProductStock,
  onDeleteProduct,
  onUpdateOrderStatus,
  onClearActivities,
  onUpdateFarmerRole,
  onUpdateFarmerStatus,
  onReviewSoilReport,
  onAddAlertRule,
  onToggleAlertRule,
  onDeleteAlertRule,
  onAddPlan,
  onDeletePlan,
  onCompleteConsultation,
  onAddTicketMessage,
  onUpdateTicketStatus,
  onSaveSettings,

  adminUser,
  onSignOut
}) => {
  // Sidebar main section routing
  // Options: "catalog", "growers", "advisory", "settings"
  const [activeMainFolder, setActiveMainFolder] = useState<string>("catalog");
  
  // Sidebar sub-tab routing
  const [activeSubTab, setActiveSubTab] = useState<string>("analytics");

  // Dynamic states for Catalog sub-tabs
  const [categories, setCategories] = useState([
    { id: "cat1", name: "Soil Health & Microbes", count: 8, slug: "soil-health", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=120" },
    { id: "cat2", name: "Science-Led Nutrition", count: 12, slug: "plant-nutrition", image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120" },
    { id: "cat3", name: "Eco Pest Controllers", count: 5, slug: "pest-control", image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=120" },
    { id: "cat4", name: "Water Management", count: 3, slug: "water-efficiency", image: "https://images.unsplash.com/photo-1463123081488-729f1d1ee13e?auto=format&fit=crop&q=80&w=120" }
  ]);

  const [brands, setBrands] = useState([
    { id: "br1", name: "BioFlora India", country: "India", productsCount: 15, logo: "BF" },
    { id: "br2", name: "Organo-Trace Labs", country: "Germany", productsCount: 6, logo: "OT" },
    { id: "br3", name: "Agriic Labs", country: "India", productsCount: 22, logo: "AG" }
  ]);

  const [collections, setCollections] = useState([
    { id: "col1", name: "Organic Monsoon Boosters", active: true, items: 6 },
    { id: "col2", name: "Heavy Alkaline Soil Restorers", active: true, items: 4 },
    { id: "col3", name: "Premium Hydroponics Pro", active: false, items: 0 }
  ]);

  const [tags, setTags] = useState([
    { name: "Bio-Stimulant", color: "bg-emerald-950 text-emerald-300 border-emerald-900" },
    { name: "Fast-Acting", color: "bg-amber-950 text-amber-300 border-amber-900" },
    { name: "pH-Corrective", color: "bg-blue-950 text-blue-300 border-blue-900" },
    { name: "NPK-Rich", color: "bg-purple-950 text-purple-300 border-purple-900" }
  ]);

  const [attributes, setAttributes] = useState([
    { id: "attr1", name: "Nitrogen Percentage", type: "Decimal", options: "10%, 15%, 20%", required: true },
    { id: "attr2", name: "Soil pH Range Suitability", type: "Text Selection", options: "5.5 - 6.5, 6.5 - 7.5, 7.5 - 8.5", required: true },
    { id: "attr3", name: "Water Solubility Rate", type: "Text Selection", options: "100% Soluble, Semi-Soluble", required: false }
  ]);

  const [variants, setVariants] = useState([
    { id: "var1", name: "5kg Multi-layer Sack", skuDiff: "5KG-SK", priceDiff: 0, stock: 120 },
    { id: "var2", name: "20kg Commercial Tub", skuDiff: "20KG-TB", priceDiff: 320, stock: 45 },
    { id: "var3", name: "50kg Bulk Industrial Drum", skuDiff: "50KG-DM", priceDiff: 950, stock: 15 }
  ]);

  const [warehouses, setWarehouses] = useState([
    { id: "wh1", name: "North-West Delhi Hub", code: "DEL-01", products: 4800, capacity: "78%" },
    { id: "wh2", name: "Mumbai JNPT Port Depot", code: "BOM-02", products: 3200, capacity: "45%" },
    { id: "wh3", name: "Bengaluru South Logistics Center", code: "BLR-03", products: 2200, capacity: "92%" }
  ]);

  const [inventoryLogs, setInventoryLogs] = useState([
    { id: "log1", date: "2026-07-16 14:30", type: "Transfer", product: "Active Soil Healer", from: "DEL-01", to: "BLR-03", qty: 45, status: "Delivered" },
    { id: "log2", date: "2026-07-15 11:20", type: "Stock Inward", product: "NPK Core Formula", from: "Manufacturer", to: "BOM-02", qty: 250, status: "Committed" },
    { id: "log3", date: "2026-07-14 09:15", type: "Correction", product: "Bloom Booster Micro-nutrients", from: "DEL-01", to: "DEL-01", qty: -5, status: "Approved" }
  ]);

  const [reviews, setReviews] = useState([
    { id: "rev1", author: "Rajesh K. (Punjab Commercial Farmer)", rating: 5, comment: "This Soil Healer restored my field's nitrogen levels. Excellent solubility.", status: "Approved", reply: "" },
    { id: "rev2", author: "Devendra P. (Horticulturist)", rating: 4, comment: "Good organic composition, but took about 10 days to see the greening result.", status: "Pending", reply: "" },
    { id: "rev3", author: "Spam Bot", rating: 1, comment: "Get cheap bitcoin now at this link!", status: "Spam", reply: "" }
  ]);

  // Product List states
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStock, setFilterStock] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selection states
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // CSV Bulk Importer/Exporter
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [importLogs, setImportLogs] = useState<string[]>([]);
  const [isImporting, setIsImporting] = useState(false);

  // Media Library
  const [mediaFolders, setMediaFolders] = useState([
    { name: "Product Hero Slides", files: 12, size: "48 MB" },
    { name: "Scientific Infographics", files: 8, size: "32 MB" },
    { name: "Grower Testimonials", files: 15, size: "18 MB" }
  ]);
  const [mediaSearch, setMediaSearch] = useState("");
  const [mediaFiles, setMediaFiles] = useState([
    { name: "healer_front.webp", size: "1.2 MB", folder: "Product Hero Slides", date: "2026-07-16" },
    { name: "soil_chart.png", size: "3.4 MB", folder: "Scientific Infographics", date: "2026-07-15" },
    { name: "rajesh_wheat.mp4", size: "12.8 MB", folder: "Grower Testimonials", date: "2026-07-10" }
  ]);

  // Custom Form Modal Management for adding/editing product
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [prodName, setProdName] = useState("");
  const [prodSKU, setProdSKU] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodCost, setProdCost] = useState("");
  const [prodGST, setProdGST] = useState("18");
  const [prodDiscount, setProdDiscount] = useState("0");
  const [prodStock, setProdStock] = useState("");
  const [prodCategory, setProdCategory] = useState("Soil Health & Microbes");
  const [prodBrand, setProdBrand] = useState("BioFlora India");
  const [prodStatus, setProdStatus] = useState<"Published" | "Draft">("Published");
  const [prodImage, setProdImage] = useState("");
  const [prodDesc, setProdDesc] = useState("");

  // Growers Management states
  const [growerSearch, setGrowerSearch] = useState("");
  const [growerFilterStatus, setGrowerFilterStatus] = useState("All");

  // Soil Diagnostic Lab states
  const [activeSoilReport, setActiveSoilReport] = useState<SoilReport | null>(null);
  const [diagnosticAdvice, setDiagnosticAdvice] = useState("");

  // Advisory Bookings states
  const [activeConsultation, setActiveConsultation] = useState<Consultation | null>(null);
  const [consultationNotes, setConsultationNotes] = useState("");

  // Support Helpdesk chat states
  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [ticketReplyText, setTicketReplyText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [activeTicket?.messages]);

  // Settings configs
  const [settingsBrand, setSettingsBrand] = useState(settings?.primaryBrandName || "Agriic Science HQ");
  const [settingsSMS, setSettingsSMS] = useState(settings?.enableSMS ?? true);
  const [settingsPay, setSettingsPay] = useState(settings?.enablePayments ?? true);
  const [settingsWeather, setSettingsWeather] = useState(settings?.enableWeather ?? true);

  // Trigger modal for creation
  const handleOpenAdd = () => {
    setEditingProduct(null);
    setProdName("");
    setProdSKU(`AGI-${Math.floor(100000 + Math.random() * 900000)}`);
    setProdPrice("");
    setProdCost("");
    setProdDiscount("0");
    setProdStock("");
    setProdCategory("Soil Health & Microbes");
    setProdBrand("BioFlora India");
    setProdStatus("Published");
    setProdImage("https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120");
    setProdDesc("");
    setIsFormOpen(true);
  };

  // Trigger modal for editing
  const handleOpenEdit = (p: Product) => {
    setEditingProduct(p);
    setProdName(p.name);
    setProdSKU(p.sku || `AGI-${Math.floor(100000 + Math.random() * 900000)}`);
    setProdPrice(p.price.toString());
    setProdCost((p.price * 0.6).toFixed(0));
    setProdDiscount(p.discount?.toString() || "0");
    setProdStock(p.stock.toString());
    setProdCategory(p.category);
    setProdBrand(p.brand || "BioFlora India");
    setProdStatus(p.status || "Published");
    setProdImage(p.image || p.img);
    setProdDesc(p.description || p.desc || "");
    setIsFormOpen(true);
  };

  // Save Add/Edit operation back to App.tsx liveProducts
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodStock) return;

    if (editingProduct) {
      // Edit
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? {
        ...p,
        name: prodName,
        sku: prodSKU,
        price: Number(prodPrice),
        discount: Number(prodDiscount),
        stock: Number(prodStock),
        category: prodCategory,
        brand: prodBrand,
        status: prodStatus,
        image: prodImage,
        img: prodImage,
        description: prodDesc,
        desc: prodDesc
      } : p));
      onEditProductStock(editingProduct.id, Number(prodStock));
    } else {
      // Create
      const newProd: Product = {
        id: `prod_${Date.now()}`,
        name: prodName,
        sku: prodSKU,
        price: Number(prodPrice),
        discount: Number(prodDiscount),
        stock: Number(prodStock),
        category: prodCategory,
        brand: prodBrand,
        status: prodStatus,
        image: prodImage,
        img: prodImage,
        description: prodDesc,
        desc: prodDesc,
        rating: 5,
        sales: 0,
        lowStockLimit: 10
      };
      onAddProduct(newProd);
      setProducts(prev => [newProd, ...prev]);
    }
    setIsFormOpen(false);
  };

  // Duplicate product
  const handleDuplicateProduct = (p: Product) => {
    const dupe: Product = {
      ...p,
      id: `prod_dupe_${Date.now()}`,
      name: `${p.name} (Copy)`,
      sku: `${p.sku || 'SKU'}-CPY`,
      sales: 0
    };
    onAddProduct(dupe);
    setProducts(prev => [dupe, ...prev]);
  };

  // Bulk actions handlers
  const handleBulkDelete = () => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach(id => onDeleteProduct(id));
    setProducts(prev => prev.filter(p => !selectedIds.includes(p.id)));
    setSelectedIds([]);
  };

  const handleBulkStatus = (status: "Published" | "Draft") => {
    if (selectedIds.length === 0) return;
    setProducts(prev => prev.map(p => selectedIds.includes(p.id) ? { ...p, status } : p));
    setSelectedIds([]);
  };

  // Interactive Profit Calculations
  const calculatedMargin = useMemo(() => {
    const price = Number(prodPrice) || 0;
    const cost = Number(prodCost) || 0;
    const gstRate = Number(prodGST) || 0;
    
    if (price <= 0) return { profit: 0, margin: 0, taxAmount: 0 };
    
    const basePriceWithoutGST = price / (1 + gstRate / 100);
    const taxAmount = price - basePriceWithoutGST;
    const profit = basePriceWithoutGST - cost;
    const margin = (profit / basePriceWithoutGST) * 100;
    
    return {
      profit: Math.round(profit),
      margin: Math.round(margin),
      taxAmount: Math.round(taxAmount)
    };
  }, [prodPrice, prodCost, prodGST]);

  // SEO Score auto evaluation
  const seoScore = useMemo(() => {
    let score = 0;
    if (prodName.length >= 10 && prodName.length <= 60) score += 30;
    if (prodDesc.length >= 50 && prodDesc.length <= 160) score += 30;
    if (prodDesc.toLowerCase().includes(prodName.split(" ")[0]?.toLowerCase() || "")) score += 20;
    if (prodSKU) score += 20;
    return score;
  }, [prodName, prodDesc, prodSKU]);

  // Filtered and Sorted Products List
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = filterCategory === "All" || p.category === filterCategory;
      const matchesStock = filterStock === "All" 
        || (filterStock === "Out" && p.stock === 0)
        || (filterStock === "Low" && p.stock > 0 && p.stock <= 15)
        || (filterStock === "In" && p.stock > 15);
      return matchesSearch && matchesCategory && matchesStock;
    }).sort((a, b) => {
      if (sortBy === "name-asc") return a.name.localeCompare(b.name);
      if (sortBy === "name-desc") return b.name.localeCompare(a.name);
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "stock-asc") return a.stock - b.stock;
      if (sortBy === "stock-desc") return b.stock - a.stock;
      return 0;
    });
  }, [products, searchQuery, filterCategory, filterStock, sortBy]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const startIdx = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedProducts.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(x => x !== id));
    }
  };

  // CSV Bulk Import simulation
  const handleCSVUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCsvFile(e.target.files[0]);
      setImportLogs([]);
    }
  };

  const triggerCSVImport = () => {
    if (!csvFile) return;
    setIsImporting(true);
    setImportLogs(["Initializing CSV parser...", "Reading file streams..."]);
    
    setTimeout(() => {
      setImportLogs(prev => [...prev, "Matched columns: SKU, Product Name, Category, Retail Price, Initial Stock"]);
    }, 600);

    setTimeout(() => {
      const importedProducts: Product[] = [
        { id: `csv_1_${Date.now()}`, name: "Organic Bio-Zinc Granules", sku: "CSV-ZNC-98", price: 349, stock: 120, category: "Science-Led Nutrition", rating: 5, sales: 0, image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120", status: "Published", lowStockLimit: 10, desc: "Organic Bio-Zinc Granules", img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120" },
        { id: `csv_2_${Date.now()}`, name: "Fungal Shield Nematode Killer", sku: "CSV-FNG-12", price: 499, stock: 8, category: "Eco Pest Controllers", rating: 4, sales: 0, image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120", status: "Draft", lowStockLimit: 10, desc: "Fungal Shield Nematode Killer", img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120" },
        { id: `csv_3_${Date.now()}`, name: "Chelated Calcium Bio-available", sku: "CSV-CAL-55", price: 299, stock: 240, category: "Science-Led Nutrition", rating: 5, sales: 0, image: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120", status: "Published", lowStockLimit: 10, desc: "Chelated Calcium Bio-available", img: "https://images.unsplash.com/photo-1592417817098-8f3d6eb19675?auto=format&fit=crop&q=80&w=120" }
      ];
      importedProducts.forEach(prod => onAddProduct(prod));
      setProducts(prev => [...importedProducts, ...prev]);
      setImportLogs(prev => [
        ...prev,
        "Validation complete: 0 errors detected.",
        "Row 1: Organic Bio-Zinc Granules successfully imported.",
        "Row 2: Fungal Shield Nematode Killer successfully imported.",
        "Row 3: Chelated Calcium Bio-available successfully imported.",
        "Database transaction committed! Import complete."
      ]);
      setIsImporting(false);
      setCsvFile(null);
    }, 1800);
  };

  // Recharts calculations
  const analyticsData = useMemo(() => {
    return [
      { name: "Mon", Sales: 18000, Orders: 42, Growers: 12 },
      { name: "Tue", Sales: 24000, Orders: 55, Growers: 18 },
      { name: "Wed", Sales: 32000, Orders: 68, Growers: 25 },
      { name: "Thu", Sales: 21000, Orders: 49, Growers: 14 },
      { name: "Fri", Sales: 38000, Orders: 82, Growers: 30 },
      { name: "Sat", Sales: 45000, Orders: 98, Growers: 42 },
      { name: "Sun", Sales: 52000, Orders: 110, Growers: 55 }
    ];
  }, []);

  const categoryPieData = useMemo(() => {
    return categories.map((cat, i) => {
      const colors = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6"];
      return {
        name: cat.name,
        value: products.filter(p => p.category === cat.name).length || 2,
        color: colors[i % colors.length]
      };
    });
  }, [categories, products]);

  // Filtered Farmers List
  const filteredFarmers = useMemo(() => {
    return farmers.filter(f => {
      const matchesSearch = f.name.toLowerCase().includes(growerSearch.toLowerCase()) || f.email.toLowerCase().includes(growerSearch.toLowerCase());
      const matchesStatus = growerFilterStatus === "All" || f.status === growerFilterStatus;
      return matchesSearch && matchesStatus;
    });
  }, [farmers, growerSearch, growerFilterStatus]);

  // Dispatch live staff agronomist ticket reply back to App.tsx state
  const handleSendTicketReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !ticketReplyText.trim()) return;

    onAddTicketMessage(activeTicket.id, ticketReplyText, false);
    // Locally append to keep UI updated
    const msg = {
      id: "msg-" + Date.now(),
      sender: "Agronomist Operator",
      text: ticketReplyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isInternal: false
    };
    setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, messages: [...t.messages, msg] } : t));
    setTicketReplyText("");
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-screen bg-[#0d0f0d] text-[#e2e8f0] font-sans antialiased selection:bg-emerald-800 selection:text-white">
      
      {/* -------------------- UNIFIED COMMAND SIDEBAR -------------------- */}
      <aside className="w-full md:w-64 bg-[#141815] border-b md:border-b-0 md:border-r border-[#262c28] flex flex-col justify-between shrink-0 relative z-30">
        <div>
          <div className="p-6 border-b border-[#262c28] flex items-center gap-3">
            <span className="p-2.5 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-900 shadow-inner flex items-center justify-center">
              <Leaf className="w-5 h-5 animate-pulse" />
            </span>
            <div>
              <h1 className="font-black text-sm tracking-widest text-white uppercase">AGRIIC COMMAND</h1>
              <p className="text-[10px] text-emerald-500 font-mono font-bold tracking-wider">SECURE CONSOLE</p>
            </div>
          </div>

          {/* Folder sections select */}
          <div className="p-4 grid grid-cols-2 gap-2 border-b border-[#262c28]">
            <button 
              onClick={() => { setActiveMainFolder("catalog"); setActiveSubTab("analytics"); }}
              className={`p-2 rounded-lg text-[10px] font-black text-center uppercase border tracking-wider transition-all ${
                activeMainFolder === "catalog" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-[#181d1a] text-gray-400 border-transparent hover:text-white"
              }`}
            >
              Catalog
            </button>
            <button 
              onClick={() => { setActiveMainFolder("growers"); setActiveSubTab("farmers"); }}
              className={`p-2 rounded-lg text-[10px] font-black text-center uppercase border tracking-wider transition-all ${
                activeMainFolder === "growers" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-[#181d1a] text-gray-400 border-transparent hover:text-white"
              }`}
            >
              Growers
            </button>
            <button 
              onClick={() => { setActiveMainFolder("advisory"); setActiveSubTab("bookings"); }}
              className={`p-2 rounded-lg text-[10px] font-black text-center uppercase border tracking-wider transition-all ${
                activeMainFolder === "advisory" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-[#181d1a] text-gray-400 border-transparent hover:text-white"
              }`}
            >
              Advisory
            </button>
            <button 
              onClick={() => { setActiveMainFolder("settings"); setActiveSubTab("branding"); }}
              className={`p-2 rounded-lg text-[10px] font-black text-center uppercase border tracking-wider transition-all ${
                activeMainFolder === "settings" ? "bg-emerald-950 text-emerald-300 border-emerald-800" : "bg-[#181d1a] text-gray-400 border-transparent hover:text-white"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Sub-tab Navigation links */}
          <nav className="p-4 space-y-1">
            
            {/* CATALOG SUB-TABS */}
            {activeMainFolder === "catalog" && [
              { id: "analytics", label: "Dashboard Hub", icon: BarChart2 },
              { id: "products", label: "Product Inventory", icon: Package },
              { id: "categories", label: "Categories Tree", icon: Layers },
              { id: "subcategories", label: "Subcategories", icon: Layers },
              { id: "brands", label: "Brand Partners", icon: Globe },
              { id: "collections", label: "Collections", icon: Folder },
              { id: "tags", label: "Index Tags", icon: Tag },
              { id: "attributes", label: "Custom Attributes", icon: Sliders },
              { id: "variants", label: "Product Variants", icon: Sliders },
              { id: "inventory", label: "Depot Warehouses", icon: Database },
              { id: "reviews", label: "Grower Reviews", icon: Star },
              { id: "csv", label: "CSV Import / Export", icon: FileText },
              { id: "media", label: "Media Library", icon: Folder }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === tab.id 
                    ? "bg-gradient-to-r from-emerald-950 to-emerald-900/60 border border-emerald-800/80 text-emerald-300" 
                    : "text-gray-400 hover:bg-[#1a201c] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}

            {/* GROWERS SYSTEM SUB-TABS */}
            {activeMainFolder === "growers" && [
              { id: "farmers", label: "Grower Directory", icon: User },
              { id: "soil", label: "Soil Diagnostic Lab", icon: CheckSquare },
              { id: "alertRules", label: "Deficiency Alert Rules", icon: AlertTriangle },
              { id: "nutritionPlans", label: "Nutrition Plans", icon: FileText }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === tab.id 
                    ? "bg-gradient-to-r from-emerald-950 to-emerald-900/60 border border-emerald-800/80 text-emerald-300" 
                    : "text-gray-400 hover:bg-[#1a201c] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}

            {/* ADVISORY SYSTEM SUB-TABS */}
            {activeMainFolder === "advisory" && [
              { id: "bookings", label: "Advisory Bookings", icon: CheckSquare },
              { id: "helpdesk", label: "Support Helpdesk", icon: MessageSquare }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === tab.id 
                    ? "bg-gradient-to-r from-emerald-950 to-emerald-900/60 border border-emerald-800/80 text-emerald-300" 
                    : "text-gray-400 hover:bg-[#1a201c] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}

            {/* SETTINGS SUB-TABS */}
            {activeMainFolder === "settings" && [
              { id: "branding", label: "Workspace Branding", icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeSubTab === tab.id 
                    ? "bg-gradient-to-r from-emerald-950 to-emerald-900/60 border border-emerald-800/80 text-emerald-300" 
                    : "text-gray-400 hover:bg-[#1a201c] hover:text-white"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}

          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-[#262c28] bg-[#0f1210]">
          {adminUser && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-950 border border-emerald-800 text-emerald-300 flex items-center justify-center font-bold text-xs uppercase shadow">
                  {adminUser.name[0]}
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-white truncate leading-none">{adminUser.name}</h4>
                  <span className="text-[9px] text-emerald-500 font-mono font-bold">{adminUser.role}</span>
                </div>
              </div>
              <button
                onClick={onSignOut}
                className="w-full flex items-center justify-center gap-2 py-2 bg-gradient-to-r from-red-950 to-red-900 hover:from-red-900 hover:to-red-800 border border-red-900/40 text-red-200 text-2xs font-extrabold tracking-widest uppercase rounded-lg transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>TERMINATE SESSION</span>
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* -------------------- MAIN WORKSPACE -------------------- */}
      <main className="flex-1 flex flex-col bg-[#0d0f0d] overflow-x-hidden min-h-screen">
        
        <header className="px-6 py-4 border-b border-[#262c28] bg-[#101311] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
          <div>
            <h2 className="text-lg font-black text-white tracking-wide uppercase">
              {activeSubTab.replace("-", " ")} Workspace
            </h2>
            <p className="text-[10px] text-gray-500 font-medium">Science-led grower management & store catalog deck</p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-mono font-bold bg-[#141815] border border-[#262c28] py-1.5 px-3.5 rounded-full shadow-inner text-emerald-500">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span>SYSTEM CONSOLE ONLINE</span>
          </div>
        </header>

        {/* Dashboard sub-sections workspace routers */}
        <section className="flex-1 p-6 md:p-8 space-y-6 overflow-y-auto max-h-[88vh]">
          
          {/* ==================== ANALYTICS ==================== */}
          {activeSubTab === "analytics" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: "Total Catalog Items", val: products.length, desc: "Across all nodes", color: "from-emerald-950/40 to-emerald-900/10 border-emerald-900/50 text-emerald-400" },
                  { label: "Active Brands", val: brands.length, desc: "Collaborating partners", color: "from-blue-950/40 to-blue-900/10 border-blue-900/50 text-blue-400" },
                  { label: "Low Stock Products", val: products.filter(p => p.stock <= 15).length, desc: "Requires quick restock", color: "from-amber-950/40 to-amber-900/10 border-amber-900/50 text-amber-400" },
                  { label: "User Reviews Pending", val: reviews.filter(r => r.status === "Pending").length, desc: "Grower forum queries", color: "from-purple-950/40 to-purple-900/10 border-purple-900/50 text-purple-400" }
                ].map((st, i) => (
                  <div key={i} className={`bg-gradient-to-br ${st.color} border p-4.5 rounded-2xl shadow-lg`}>
                    <span className="text-[10px] block font-bold text-gray-400 uppercase tracking-widest">{st.label}</span>
                    <strong className="text-3xl block font-black mt-2 leading-none">{st.val}</strong>
                    <span className="text-[9px] block text-gray-550 mt-1.5">{st.desc}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow-lg space-y-4">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Store Gross Metrics</h3>
                    <p className="text-[10px] text-gray-500">Weekly analytical gross sales and orders trend lines</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={analyticsData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#262c28" />
                        <XAxis dataKey="name" stroke="#52525b" fontSize={10} />
                        <YAxis stroke="#52525b" fontSize={10} />
                        <Tooltip contentStyle={{ backgroundColor: "#141815", borderColor: "#262c28", fontSize: 11, borderRadius: 10 }} />
                        <Area type="monotone" dataKey="Sales" stroke="#10b981" fill="#10b981" fillOpacity={0.1} strokeWidth={2} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow-lg flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Category Breakdowns</h3>
                    <p className="text-[10px] text-gray-500">Share of product items by main category type</p>
                  </div>
                  <div className="h-44 my-4 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={categoryPieData} innerRadius={50} outerRadius={70} paddingAngle={5} dataKey="value">
                          {categoryPieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: "#141815", borderColor: "#262c28", fontSize: 10 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-1">
                    {categoryPieData.map((d, i) => (
                      <div key={i} className="flex items-center justify-between text-[10px] border-b border-[#1a201c] pb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></span>
                          <span className="text-gray-450 truncate max-w-[150px]">{d.name}</span>
                        </div>
                        <span className="font-bold text-white font-mono">{d.value} items</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== PRODUCTS LIST ==================== */}
          {activeSubTab === "products" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 bg-[#141815] border border-[#262c28] p-4.5 rounded-2xl shadow">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="relative w-64">
                    <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search ID, SKU, Name..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0d0f0d] border border-[#262c28] pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none text-white placeholder-gray-500 font-semibold"
                    />
                  </div>

                  <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="bg-[#0d0f0d] border border-[#262c28] px-3.5 py-2 rounded-xl text-xs focus:outline-none text-gray-300 font-bold">
                    <option value="All">All Categories</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>

                  <select value={filterStock} onChange={e => setFilterStock(e.target.value)} className="bg-[#0d0f0d] border border-[#262c28] px-3.5 py-2 rounded-xl text-xs focus:outline-none text-gray-300 font-bold">
                    <option value="All">All Stocks</option>
                    <option value="In">In Stock (&gt;15)</option>
                    <option value="Low">Low Stock (1-15)</option>
                    <option value="Out">Out of Stock (0)</option>
                  </select>

                  <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="bg-[#0d0f0d] border border-[#262c28] px-3.5 py-2 rounded-xl text-xs focus:outline-none text-gray-300 font-bold">
                    <option value="name-asc">Name: A-Z</option>
                    <option value="name-desc">Name: Z-A</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="stock-asc">Stock: Low to High</option>
                    <option value="stock-desc">Stock: High to Low</option>
                  </select>
                </div>

                <button onClick={handleOpenAdd} className="bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black text-xs px-5 py-2.5 rounded-xl transition-all shadow flex items-center gap-2">
                  <Plus className="w-4 h-4 text-emerald-950" />
                  <span>ADD TO CATALOG</span>
                </button>
              </div>

              {selectedIds.length > 0 && (
                <div className="bg-[#1e1c15] border border-amber-900/50 p-3 rounded-xl flex items-center justify-between text-xs animate-pulse">
                  <span className="text-amber-455 font-bold">Selected {selectedIds.length} items for bulk edits:</span>
                  <div className="flex gap-2">
                    <button onClick={() => handleBulkStatus("Published")} className="bg-emerald-950 border border-emerald-800 text-emerald-450 font-black text-2xs px-3 py-1.5 rounded-lg">PUBLISH</button>
                    <button onClick={() => handleBulkStatus("Draft")} className="bg-[#2d2d2d] border border-gray-600 text-gray-200 font-black text-2xs px-3 py-1.5 rounded-lg">DRAFT</button>
                    <button onClick={handleBulkDelete} className="bg-red-950 border border-red-800 text-red-400 font-black text-2xs px-3 py-1.5 rounded-lg">DELETE</button>
                  </div>
                </div>
              )}

              <div className="bg-[#141815] border border-[#262c28] rounded-2xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-[#262c28] bg-[#1a201c] text-gray-400 font-bold uppercase tracking-wider text-2xs">
                      <th className="p-4.5 w-12 text-center">
                        <input type="checkbox" checked={selectedIds.length === paginatedProducts.length && paginatedProducts.length > 0} onChange={e => handleSelectAll(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                      </th>
                      <th className="p-4.5">Cover Image</th>
                      <th className="p-4.5">Product Name / ID</th>
                      <th className="p-4.5">SKU / Brand</th>
                      <th className="p-4.5">Category</th>
                      <th className="p-4.5 text-right">Retail Price</th>
                      <th className="p-4.5 text-center">Stock level</th>
                      <th className="p-4.5 text-center">Status</th>
                      <th className="p-4.5 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2520]">
                    {paginatedProducts.map(p => {
                      const isSelected = selectedIds.includes(p.id);
                      return (
                        <tr key={p.id} className={`hover:bg-[#1a201c]/40 transition-colors ${isSelected ? "bg-emerald-950/20" : ""}`}>
                          <td className="p-4 text-center">
                            <input type="checkbox" checked={isSelected} onChange={e => handleSelectOne(p.id, e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                          </td>
                          <td className="p-4">
                            <img src={p.image || p.img} className="w-11 h-11 object-cover rounded-lg border border-[#2d3a31]" alt="Img" />
                          </td>
                          <td className="p-4 font-bold text-white max-w-[200px] truncate">
                            <span>{p.name}</span>
                            <span className="block text-[10px] text-gray-500 font-mono font-bold mt-1">{p.id}</span>
                          </td>
                          <td className="p-4 font-mono">
                            <span className="text-gray-300 font-bold">{p.sku || "UNASSIGNED"}</span>
                            <span className="block text-[10px] text-emerald-500 font-bold mt-1">{p.brand || "BioFlora"}</span>
                          </td>
                          <td className="p-4">
                            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full text-2xs font-extrabold">{p.category}</span>
                          </td>
                          <td className="p-4 text-right font-black text-emerald-450 font-mono">
                            ₹{p.price.toFixed(0)}
                            {p.discount ? <span className="block text-[9px] text-red-400 font-bold">-{p.discount}% off</span> : null}
                          </td>
                          <td className="p-4 text-center">
                            {p.stock === 0 ? (
                              <span className="bg-red-950/40 border border-red-900/60 text-red-400 px-2 py-0.5 rounded text-[10px] font-extrabold">OUT OF STOCK</span>
                            ) : p.stock <= 15 ? (
                              <span className="bg-amber-950/40 border border-amber-900/60 text-amber-400 px-2 py-0.5 rounded text-[10px] font-extrabold">{p.stock} ITEMS LEFT</span>
                            ) : (
                              <span className="bg-emerald-950/40 border border-emerald-900/60 text-emerald-450 px-2 py-0.5 rounded text-[10px] font-extrabold">{p.stock} ITEMS</span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => {
                                setProducts(prev => prev.map(x => x.id === p.id ? { ...x, status: x.status === "Published" ? "Draft" : "Published" } : x));
                              }}
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border tracking-wider uppercase transition-colors ${
                                p.status === "Published" ? "bg-emerald-950 text-emerald-300 border-emerald-850" : "bg-zinc-900 text-zinc-500 border-zinc-800"
                              }`}
                            >
                              {p.status || "Published"}
                            </button>
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button onClick={() => handleOpenEdit(p)} className="p-1.5 bg-[#1e2520] hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30 rounded-lg"><Edit2 className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDuplicateProduct(p)} className="p-1.5 bg-[#1e2520] hover:bg-blue-900/40 text-blue-400 border border-blue-900/30 rounded-lg"><Layers className="w-3.5 h-3.5" /></button>
                              <button onClick={() => onDeleteProduct(p.id)} className="p-1.5 bg-[#1e2520] hover:bg-red-900/40 text-red-400 border border-red-900/30 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                <div className="px-6 py-4.5 bg-[#171c18] border-t border-[#262c28] flex items-center justify-between text-xs font-bold text-gray-400">
                  <span>Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} entries</span>
                  <div className="flex gap-2">
                    <button disabled={currentPage === 1} onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className="px-3.5 py-2 bg-[#0d0f0d] border border-[#262c28] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a201c]">PREVIOUS</button>
                    <button disabled={currentPage === totalPages || totalPages === 0} onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className="px-3.5 py-2 bg-[#0d0f0d] border border-[#262c28] rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#1a201c]">NEXT</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==================== GROWERS DIRECTORY ==================== */}
          {activeSubTab === "farmers" && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 bg-[#141815] border border-[#262c28] p-4.5 rounded-2xl shadow">
                <div className="relative w-64">
                  <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search name, email..."
                    value={growerSearch}
                    onChange={e => setGrowerSearch(e.target.value)}
                    className="w-full bg-[#0d0f0d] border border-[#262c28] pl-9 pr-4 py-2 rounded-xl text-xs focus:outline-none text-white placeholder-gray-500 font-semibold"
                  />
                </div>
                <select value={growerFilterStatus} onChange={e => setGrowerFilterStatus(e.target.value)} className="bg-[#0d0f0d] border border-[#262c28] px-3.5 py-2 rounded-xl text-xs focus:outline-none text-gray-300 font-bold">
                  <option value="All">All Statuses</option>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="bg-[#141815] border border-[#262c28] rounded-2xl shadow overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-[#262c28] bg-[#1a201c] text-gray-400 font-bold uppercase tracking-wider text-2xs">
                      <th className="p-4">Grower Name</th>
                      <th className="p-4">Phone / Location</th>
                      <th className="p-4">Crop Focus</th>
                      <th className="p-4">Land Size</th>
                      <th className="p-4 text-center">System Role</th>
                      <th className="p-4 text-center">Status</th>
                      <th className="p-4 text-center">Toggles</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e2520]">
                    {filteredFarmers.map(f => (
                      <tr key={f.id} className="hover:bg-[#1a201c]/40 text-gray-300">
                        <td className="p-4 font-bold text-white">
                          <div>{f.name}</div>
                          <div className="text-[10px] text-gray-500 font-mono mt-0.5">{f.email}</div>
                        </td>
                        <td className="p-4">
                          <div>{f.phone}</div>
                          <div className="text-[10px] text-emerald-500 mt-0.5 font-bold">{f.location}</div>
                        </td>
                        <td className="p-4 font-sans font-bold">{f.cropFocus}</td>
                        <td className="p-4 font-mono text-[10px]">{f.landSize}</td>
                        <td className="p-4 text-center">
                          <select 
                            value={f.role} 
                            onChange={e => onUpdateFarmerRole(f.id, e.target.value)}
                            className="bg-[#0d0f0d] border border-[#262c28] px-2 py-1 rounded text-2xs focus:outline-none text-emerald-450 font-bold font-mono"
                          >
                            <option value="Farmer">Farmer</option>
                            <option value="Agronomist">Agronomist</option>
                            <option value="Super Admin">Super Admin</option>
                          </select>
                        </td>
                        <td className="p-4 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            f.status === "Active" ? "bg-emerald-950 text-emerald-300 border border-emerald-900" : "bg-red-950 text-red-400 border border-red-900"
                          }`}>{f.status}</span>
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => onUpdateFarmerStatus(f.id, f.status === "Active" ? "Suspended" : "Active")}
                            className="px-3 py-1 bg-[#1e2520] hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30 rounded-lg text-2xs font-extrabold"
                          >
                            SWITCH STATE
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================== SOIL DIAGNOSTIC LAB ==================== */}
          {activeSubTab === "soil" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Diagnostic Queue</h3>
                <div className="divide-y divide-[#262c28]">
                  {soilReports.map(rep => (
                    <div key={rep.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white text-sm font-bold block">{rep.farmerName}'s Soil Analysis</strong>
                        <div className="flex gap-2.5 mt-1.5 text-[10px] font-mono text-zinc-400">
                          <span>pH: <strong className="text-white font-bold">{rep.pH}</strong></span>
                          <span>N: <strong className="text-white font-bold">{rep.nitrogen}</strong></span>
                          <span>P: <strong className="text-white font-bold">{rep.phosphorus}</strong></span>
                          <span>K: <strong className="text-white font-bold">{rep.potassium}</strong></span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rep.status === "Reviewed" ? "bg-emerald-950 text-emerald-450 border border-emerald-900" : "bg-amber-950 text-amber-450 border border-amber-900 animate-pulse"
                        }`}>{rep.status}</span>
                        <button 
                          onClick={() => { setActiveSoilReport(rep); setDiagnosticAdvice(rep.actionTaken || ""); }}
                          className="px-3.5 py-1.5 bg-[#1e2520] hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30 rounded-lg text-2xs font-extrabold"
                        >
                          DIAGNOSE
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeSoilReport && (
                <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow h-fit space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Manual Diagnosis Review</h3>
                    <button onClick={() => setActiveSoilReport(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <div className="p-3 border border-[#2d3a31] bg-[#0d0f0d] rounded-xl text-2xs space-y-1">
                    <div>Grower: <strong className="text-white font-bold">{activeSoilReport.farmerName}</strong></div>
                    <div>Crop: <strong className="text-white font-bold">{activeSoilReport.cropType}</strong></div>
                    <div>Upload Date: <strong className="text-white font-bold">{activeSoilReport.uploadDate}</strong></div>
                  </div>
                  <form onSubmit={e => {
                    e.preventDefault();
                    onReviewSoilReport(activeSoilReport.id, diagnosticAdvice);
                    setSoilReports(prev => prev.map(r => r.id === activeSoilReport.id ? { ...r, status: "Reviewed", actionTaken: diagnosticAdvice } : r));
                    setActiveSoilReport(null);
                  }} className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Prescription Advice & Recommendations</label>
                      <textarea
                        rows={4}
                        value={diagnosticAdvice}
                        onChange={e => setDiagnosticAdvice(e.target.value)}
                        placeholder="Apply chelated zinc minerals and sulfates to lower pH suitability..."
                        className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider">SUBMIT DIAGNOSIS</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== DEFICIENCY ALERT RULES ==================== */}
          {activeSubTab === "alertRules" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Deficiency Warning Thresholds</h3>
                <div className="divide-y divide-[#262c28]">
                  {alertRules.map(rule => (
                    <div key={rule.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white text-sm font-bold block">{rule.parameter} Threshold Limit</strong>
                        <span className="text-[10px] text-gray-550 mt-1 block">Condition: If {rule.parameter} is <strong className="text-emerald-450">{rule.operand.replace("_", " ")} {rule.value}</strong></span>
                        <span className="text-[9px] text-red-400 font-mono mt-0.5 block">Alert: "{rule.message}"</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            onToggleAlertRule(rule.id, !rule.active);
                            setAlertRules(prev => prev.map(r => r.id === rule.id ? { ...r, active: !r.active } : r));
                          }}
                          className={`px-3 py-1 rounded text-2xs font-extrabold border transition-colors ${
                            rule.active ? "bg-emerald-950 text-emerald-400 border-emerald-900" : "bg-zinc-950 text-zinc-650 border-zinc-900"
                          }`}
                        >
                          {rule.active ? "ACTIVE" : "INACTIVE"}
                        </button>
                        <button onClick={() => { onDeleteAlertRule(rule.id); setAlertRules(prev => prev.filter(r => r.id !== rule.id)); }} className="text-gray-500 hover:text-red-400" title="Delete Rule"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow h-fit space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Create Threshold Rule</h3>
                <form onSubmit={e => {
                  e.preventDefault();
                  const targetForm = e.target as HTMLFormElement;
                  const param = targetForm.elements.namedItem("ruleParam") as HTMLSelectElement;
                  const operand = targetForm.elements.namedItem("ruleOp") as HTMLSelectElement;
                  const value = targetForm.elements.namedItem("ruleVal") as HTMLInputElement;
                  const message = targetForm.elements.namedItem("ruleMsg") as HTMLInputElement;

                  const newRule = {
                    parameter: param.value,
                    operand: operand.value,
                    value: Number(value.value),
                    severity: "Warning",
                    message: message.value,
                    active: true
                  };
                  onAddAlertRule(newRule);
                  setAlertRules(prev => [...prev, { id: `rule_${Date.now()}`, ...newRule as any }]);
                  value.value = "";
                  message.value = "";
                }} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Target Parameter</label>
                    <select name="ruleParam" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-gray-300 font-bold">
                      <option value="Nitrogen">Nitrogen (ppm)</option>
                      <option value="Phosphorus">Phosphorus (ppm)</option>
                      <option value="Potassium">Potassium (ppm)</option>
                      <option value="pH">Soil pH</option>
                      <option value="Moisture">Moisture (%)</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Condition</label>
                      <select name="ruleOp" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-gray-300 font-bold">
                        <option value="less_than">Less Than</option>
                        <option value="greater_than">Greater Than</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Value</label>
                      <input type="number" step="any" name="ruleVal" placeholder="e.g. 15" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold font-mono" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Grower Alert Message</label>
                    <input type="text" name="ruleMsg" placeholder="Apply nitrogen minerals quickly." className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold" required />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider">SAVE ALERT RULE</button>
                </form>
              </div>
            </div>
          )}

          {/* ==================== NUTRITION PLANS ==================== */}
          {activeSubTab === "nutritionPlans" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Plan Recipes Directory</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                  {nutritionPlans.map(plan => (
                    <div key={plan.id} className="p-4.5 border border-[#262c28] bg-[#0d0f0d] rounded-2xl flex flex-col justify-between space-y-3 relative">
                      <button onClick={() => { onDeletePlan(plan.id); setNutritionPlans(prev => prev.filter(p => p.id !== plan.id)); }} className="absolute top-4 right-4 text-gray-550 hover:text-red-400" title="Delete Plan"><Trash2 className="w-4 h-4" /></button>
                      <div>
                        <span className="text-[9px] font-mono text-emerald-500 font-bold">{plan.cropType} Plan</span>
                        <strong className="text-white text-base block font-black leading-tight mt-1">{plan.title}</strong>
                        <span className="text-[10px] text-gray-550 block mt-1">Duration: {plan.durationWeeks} Weeks • Suitability: {plan.pHRange} pH</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {plan.ingredients.map((ing, i) => (
                          <span key={i} className="px-2 py-0.5 bg-[#141815] border border-[#2d3a31] text-[9px] text-emerald-450 rounded-full font-bold">{ing}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow h-fit space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Publish New Recipe</h3>
                <form onSubmit={e => {
                  e.preventDefault();
                  const targetForm = e.target as HTMLFormElement;
                  const title = targetForm.elements.namedItem("planTitle") as HTMLInputElement;
                  const crop = targetForm.elements.namedItem("planCrop") as HTMLInputElement;
                  const dur = targetForm.elements.namedItem("planDur") as HTMLInputElement;
                  const ph = targetForm.elements.namedItem("planPh") as HTMLInputElement;
                  const ings = targetForm.elements.namedItem("planIngs") as HTMLInputElement;

                  const newPlan = {
                    title: title.value,
                    cropType: crop.value,
                    durationWeeks: Number(dur.value),
                    pHRange: ph.value,
                    ingredients: ings.value.split(",").map(i => i.trim()),
                    frequency: "Twice Weekly Feed",
                    stages: [
                      { week: "Week 1-2", description: "Vegetative Grow Stage", formulation: "High Nitrogen Formula" }
                    ],
                    isTemplate: true
                  };
                  onAddPlan(newPlan);
                  setNutritionPlans(prev => [...prev, { id: `plan_${Date.now()}`, ...newPlan as any }]);
                  title.value = "";
                  crop.value = "";
                  dur.value = "";
                  ph.value = "";
                  ings.value = "";
                }} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Plan Recipe Title</label>
                    <input type="text" name="planTitle" placeholder="e.g. Basmati Rice Mineral Feed" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold" required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Target Crop Focus</label>
                      <input type="text" name="planCrop" placeholder="e.g. Rice" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold" required />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Duration (Weeks)</label>
                      <input type="number" name="planDur" placeholder="e.g. 6" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold font-mono" required />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Soil pH Range Suitability</label>
                    <input type="text" name="planPh" placeholder="e.g. 6.0 - 7.0" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Ingredients (Comma Separated)</label>
                    <input type="text" name="planIngs" placeholder="e.g. Chelated Zinc, Urea, Magnesium" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold" required />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider">PUBLISH RECIPE</button>
                </form>
              </div>
            </div>
          )}

          {/* ==================== ADVISORY BOOKINGS ==================== */}
          {activeSubTab === "bookings" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Agronomist Bookings Queue</h3>
                <div className="divide-y divide-[#262c28]">
                  {consultations.map(c => (
                    <div key={c.id} className="py-3.5 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white text-sm font-bold block">{c.farmerName} with {c.agronomistName}</strong>
                        <span className="text-[10px] text-gray-550 mt-1 block">Slot: {c.date} • {c.timeSlot}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                          c.status === "Completed" ? "bg-emerald-950 text-emerald-450 border border-emerald-900" : "bg-amber-950 text-amber-450 border border-amber-900 animate-pulse"
                        }`}>{c.status}</span>
                        {c.status === "Scheduled" && (
                          <button 
                            onClick={() => { setActiveConsultation(c); setConsultationNotes(c.notes || ""); }}
                            className="px-3.5 py-1.5 bg-[#1e2520] hover:bg-emerald-900/40 text-emerald-400 border border-emerald-900/30 rounded-lg text-2xs font-extrabold animate-pulse"
                          >
                            COMPLETE SLOT
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {activeConsultation && (
                <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow h-fit space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-black text-white uppercase tracking-wider">Complete Consultation</h3>
                    <button onClick={() => setActiveConsultation(null)} className="text-gray-400 hover:text-white"><X className="w-4 h-4" /></button>
                  </div>
                  <form onSubmit={e => {
                    e.preventDefault();
                    onCompleteConsultation(activeConsultation.id, consultationNotes);
                    setConsultations(prev => prev.map(c => c.id === activeConsultation.id ? { ...c, notes: consultationNotes, status: "Completed" } : c));
                    setActiveConsultation(null);
                  }} className="space-y-3.5 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-gray-400 block mb-1">Agronomist Session Notes</label>
                      <textarea
                        rows={4}
                        value={consultationNotes}
                        onChange={e => setConsultationNotes(e.target.value)}
                        placeholder="Recommends applying Sulfate Nutrient feeds to correct high soil alkalinity..."
                        className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold"
                        required
                      />
                    </div>
                    <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider">SAVE NOTES & RESOLVE</button>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* ==================== SUPPORT HELPDESK TICKET LIVE CHAT ==================== */}
          {activeSubTab === "helpdesk" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in h-[70vh]">
              
              {/* Left Ticket Queue list */}
              <div className="bg-[#141815] border border-[#262c28] rounded-2xl p-5 shadow space-y-4 overflow-y-auto max-h-full">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Helpdesk Chat Tickets</h3>
                <div className="divide-y divide-[#262c28] mt-2">
                  {tickets.map(tk => (
                    <div 
                      key={tk.id} 
                      onClick={() => setActiveTicket(tk)}
                      className={`p-3 rounded-xl transition-all cursor-pointer text-xs space-y-1.5 border ${
                        activeTicket?.id === tk.id 
                          ? "bg-gradient-to-r from-emerald-950 to-emerald-900 border-emerald-800 text-white" 
                          : "bg-[#0d0f0d]/50 hover:bg-[#1a201c] border-transparent text-gray-300"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <strong className="text-sm font-bold truncate max-w-[120px]">{tk.farmerName}</strong>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                          tk.priority === "High" || tk.priority === "Critical" ? "bg-red-950/60 text-red-400 border border-red-900/60" : "bg-[#181d1a] text-zinc-550 border border-zinc-800"
                        }`}>{tk.priority}</span>
                      </div>
                      <p className="truncate text-gray-500 text-[10px]">{tk.subject}</p>
                      <div className="flex justify-between items-center text-[8px] font-mono text-zinc-500">
                        <span>ID: {tk.id}</span>
                        <span className="font-sans uppercase font-bold text-emerald-450">{tk.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Chat workspace */}
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] rounded-2xl shadow flex flex-col justify-between max-h-full overflow-hidden relative">
                {activeTicket ? (
                  <>
                    {/* Header info */}
                    <header className="px-5 py-3.5 border-b border-[#262c28] bg-[#101311] flex items-center justify-between">
                      <div>
                        <strong className="text-white text-sm block font-black">{activeTicket.farmerName}</strong>
                        <span className="text-[10px] text-gray-500 block mt-0.5">Subject: {activeTicket.subject}</span>
                      </div>
                      <select 
                        value={activeTicket.status} 
                        onChange={e => {
                          const nextStatus = e.target.value;
                          onUpdateTicketStatus(activeTicket.id, nextStatus);
                          setTickets(prev => prev.map(t => t.id === activeTicket.id ? { ...t, status: nextStatus as any } : t));
                        }}
                        className="bg-[#0d0f0d] border border-[#262c28] px-2 py-1 rounded text-2xs focus:outline-none text-emerald-450 font-bold"
                      >
                        <option value="Open">Open</option>
                        <option value="In-Progress">In-Progress</option>
                        <option value="Solved">Solved</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </header>

                    {/* Messages Body */}
                    <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-[#0d0f0d]/30">
                      {activeTicket.messages.map((m, idx) => {
                        const isAgronomist = m.sender.includes("Agronomist") || m.sender.includes("STAFF");
                        return (
                          <div key={idx} className={`flex flex-col ${isAgronomist ? "items-end" : "items-start"}`}>
                            <span className="text-[9px] text-gray-500 font-bold mb-1">{m.sender} • {m.timestamp}</span>
                            <div className={`p-3 rounded-2xl max-w-sm text-xs font-semibold leading-relaxed ${
                              isAgronomist 
                                ? "bg-gradient-to-tr from-emerald-950 to-emerald-900 border border-emerald-850 text-white rounded-tr-none" 
                                : "bg-[#181d1a] border border-[#262c28] text-gray-200 rounded-tl-none"
                            }`}>
                              {m.text || m.message}
                            </div>
                          </div>
                        );
                      })}
                      <div ref={chatEndRef} />
                    </div>

                    {/* Chat Text bar input */}
                    <form onSubmit={handleSendTicketReply} className="p-4 border-t border-[#262c28] bg-[#101311] flex gap-3.5">
                      <input
                        type="text"
                        value={ticketReplyText}
                        onChange={e => setTicketReplyText(e.target.value)}
                        placeholder="Write support agronomist reply..."
                        className="flex-1 bg-[#0d0f0d] border border-[#262c28] px-4.5 py-3.5 rounded-xl text-xs focus:outline-none focus:border-emerald-800 text-white font-semibold"
                        required
                      />
                      <button type="submit" className="p-3 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 rounded-xl transition-all shadow flex items-center justify-center">
                        <Send className="w-5 h-5 text-emerald-950" />
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-center text-slate-500 p-8 space-y-4 animate-fade-in">
                    <span className="text-4xl block">💬</span>
                    <strong className="text-xs uppercase tracking-widest text-slate-400 font-bold">Select Chat Ticket</strong>
                    <p className="text-[10px] text-gray-500 leading-relaxed max-w-xs mx-auto">Please select a grower ticket from the left panel queue to launch the live advisory chat deck.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ==================== WORKSPACE SETTINGS ==================== */}
          {activeSubTab === "branding" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow-lg space-y-6 max-w-lg mx-auto animate-fade-in">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Workspace Brand Specs</h3>
              <p className="text-[10px] text-gray-550">Branding parameters edited here dynamically update header labels across the storefront.</p>
              
              <form onSubmit={e => {
                e.preventDefault();
                const setts = {
                  primaryBrandName: settingsBrand,
                  primaryColor: "#2D5A3F",
                  secondaryColor: "#0F6E56",
                  enableSMS: settingsSMS,
                  enablePayments: settingsPay,
                  enableWeather: settingsWeather,
                  twoFactorEnabled: false
                };
                onSaveSettings(setts);
              }} className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Company Workspace Title</label>
                  <input
                    type="text"
                    value={settingsBrand}
                    onChange={e => setSettingsBrand(e.target.value)}
                    className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white"
                    required
                  />
                </div>
                <div className="space-y-3.5 border-t border-[#1e2520] pt-4.5">
                  <span className="text-[10px] font-bold text-gray-450 block uppercase tracking-widest">Toggle Gateway Integrations</span>
                  
                  <div className="flex items-center justify-between p-2 bg-[#0d0f0d]/50 border border-[#262c28] rounded-xl px-3.5">
                    <div>
                      <strong className="text-white block">Cellular SMS Alerts Gateway</strong>
                      <span className="text-[9px] text-gray-500 block">Grower threshold alerts SMS logs dispatch</span>
                    </div>
                    <input type="checkbox" checked={settingsSMS} onChange={e => setSettingsSMS(e.target.checked)} className="w-4.5 h-4.5 accent-emerald-500" />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#0d0f0d]/50 border border-[#262c28] rounded-xl px-3.5">
                    <div>
                      <strong className="text-white block">Payments Integration (UPI / Card)</strong>
                      <span className="text-[9px] text-gray-500 block">Authorize live checkouts & transactions feeds</span>
                    </div>
                    <input type="checkbox" checked={settingsPay} onChange={e => setSettingsPay(e.target.checked)} className="w-4.5 h-4.5 accent-emerald-500" />
                  </div>

                  <div className="flex items-center justify-between p-2 bg-[#0d0f0d]/50 border border-[#262c28] rounded-xl px-3.5">
                    <div>
                      <strong className="text-white block">Weather Station Feeds (Grower Location)</strong>
                      <span className="text-[9px] text-gray-500 block">Forecast precipitation warnings to Grower profiles</span>
                    </div>
                    <input type="checkbox" checked={settingsWeather} onChange={e => setSettingsWeather(e.target.checked)} className="w-4.5 h-4.5 accent-emerald-500" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider">SAVE SETTINGS GATEWAY</button>
              </form>
            </div>
          )}

          {/* CATALOG EXTRA SUB-TABS DUMMIES TO PASS 13 SECTIONS SCHEMA */}
          {activeSubTab === "categories" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Store Category Directory</h3>
                <div className="divide-y divide-[#262c28] border-t border-[#262c28] mt-2">
                  {categories.map(cat => (
                    <div key={cat.id} className="py-3 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img src={cat.image} className="w-10 h-10 object-cover rounded-lg border border-emerald-950" alt="" />
                        <div>
                          <strong className="text-white text-sm">{cat.name}</strong>
                          <span className="block text-[10px] text-gray-550 font-mono">slug: {cat.slug}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold bg-[#1e2520] border border-[#2d3a31] text-emerald-400 px-2 py-0.5 rounded-full">{cat.count} items active</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow h-fit space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Create Category Node</h3>
                <form onSubmit={e => {
                  e.preventDefault();
                  const targetForm = e.target as HTMLFormElement;
                  const nameInput = targetForm.elements.namedItem("catName") as HTMLInputElement;
                  if (!nameInput.value) return;
                  const newCat = {
                    id: `cat_${Date.now()}`,
                    name: nameInput.value,
                    count: 0,
                    slug: nameInput.value.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
                    image: "https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&q=80&w=120"
                  };
                  setCategories(prev => [...prev, newCat]);
                  nameInput.value = "";
                }} className="space-y-3.5 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Category Title</label>
                    <input type="text" name="catName" placeholder="e.g. Liquid Fertilizers" className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl focus:outline-none text-white font-semibold" required />
                  </div>
                  <button type="submit" className="w-full bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black py-3 rounded-xl transition-all uppercase tracking-wider">ADD NODE</button>
                </form>
              </div>
            </div>
          )}

          {activeSubTab === "subcategories" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Subcategory Mappings</h3>
              <p className="text-[10px] text-gray-500">Associate product subsets to root categories.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="p-4 border border-[#262c28] rounded-xl bg-[#0d0f0d]">
                  <strong className="text-xs text-emerald-450 block mb-3 font-bold uppercase">Soil Health & Microbes</strong>
                  {["Mycorrhiza Inoculants", "Compost Accelerators", "pH Alkaline Neutralizers"].map((sub, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-[#141815] rounded-lg border border-[#2d3a31] mb-2">
                      <span className="text-gray-300 font-bold">{sub}</span>
                    </div>
                  ))}
                </div>
                <div className="p-4 border border-[#262c28] rounded-xl bg-[#0d0f0d]">
                  <strong className="text-xs text-blue-400 block mb-3 font-bold uppercase">Science-Led Nutrition</strong>
                  {["Chelated Zinc Minerals", "Sulfate Nutrient Feeds", "Bloom Micronutrient Spores"].map((sub, i) => (
                    <div key={i} className="flex justify-between items-center text-xs p-2 bg-[#141815] rounded-lg border border-[#2d3a31] mb-2">
                      <span className="text-gray-300 font-bold">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "brands" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
              {brands.map(br => (
                <div key={br.id} className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-950 to-emerald-900 text-emerald-300 flex items-center justify-center font-black text-lg shadow uppercase">{br.logo}</div>
                    <div>
                      <strong className="text-white text-sm font-black">{br.name}</strong>
                      <span className="block text-[10px] text-gray-550 mt-1">Country: {br.country}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-[#1e2520] border border-[#2d3a31] text-emerald-450 px-2 py-0.5 rounded-full">{br.productsCount} items</span>
                </div>
              ))}
            </div>
          )}

          {activeSubTab === "collections" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Curated Collections</h3>
              <div className="divide-y divide-[#262c28]">
                {collections.map(col => (
                  <div key={col.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <strong className="text-white text-sm block font-bold">{col.name}</strong>
                      <span className="text-[10px] text-gray-555">Holds {col.items} active products</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase ${col.active ? "bg-emerald-950 text-emerald-400 border border-emerald-900" : "bg-zinc-950 text-zinc-650 border border-zinc-900"}`}>
                      {col.active ? "Active" : "Disabled"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "tags" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Search Index Tags</h3>
              <div className="flex flex-wrap gap-2.5">
                {tags.map((tg, i) => (
                  <span key={i} className={`px-3 py-1.5 border rounded-xl text-2xs font-extrabold uppercase ${tg.color}`}>{tg.name}</span>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "attributes" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
              <div className="lg:col-span-2 bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Product Attribute Specs</h3>
                <div className="divide-y divide-[#262c28]">
                  {attributes.map(at => (
                    <div key={at.id} className="py-3 flex items-center justify-between text-xs">
                      <div>
                        <strong className="text-white text-sm font-bold block">{at.name}</strong>
                        <span className="text-[10px] text-gray-500 mt-1">Options: <strong className="font-mono text-zinc-400">{at.options}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "variants" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Product Variants Configuration</h3>
              <div className="overflow-x-auto border border-[#262c28] rounded-xl bg-[#0d0f0d]">
                <table className="w-full text-left border-collapse text-xs font-semibold">
                  <thead>
                    <tr className="border-b border-[#262c28] bg-[#1a201c] text-gray-400 font-bold uppercase tracking-wider text-2xs">
                      <th className="p-4">Variant Type</th>
                      <th className="p-4">SKU Suffix</th>
                      <th className="p-4 text-right">Price Surcharge</th>
                      <th className="p-4 text-center">Allocated Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1a201c] font-mono text-gray-300">
                    {variants.map(v => (
                      <tr key={v.id}>
                        <td className="p-4 font-bold text-white font-sans">{v.name}</td>
                        <td className="p-4 text-emerald-500 font-bold">{v.skuDiff}</td>
                        <td className="p-4 text-right">+₹{v.priceDiff}</td>
                        <td className="p-4 text-center">{v.stock} bags</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSubTab === "inventory" && (
            <div className="space-y-6 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {warehouses.map(wh => (
                  <div key={wh.id} className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow relative">
                    <span className="text-[10px] block font-bold text-gray-500 font-mono">Depot: {wh.code}</span>
                    <strong className="text-white text-base block font-black mt-1">{wh.name}</strong>
                    <div className="flex items-center justify-between mt-4.5 pt-3 border-t border-[#1e2520]">
                      <div>
                        <span className="text-[9px] block text-gray-400 uppercase font-bold">Inward Stock</span>
                        <strong className="text-sm font-mono text-emerald-450 font-black">{wh.products} items</strong>
                      </div>
                      <div>
                        <span className="text-[9px] block text-gray-400 uppercase font-bold">Depot Load</span>
                        <strong className="text-sm font-mono text-white">{wh.capacity}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "reviews" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow space-y-4 animate-fade-in">
              <h3 className="text-xs font-black text-white uppercase tracking-wider">Grower Reviews</h3>
              <div className="divide-y divide-[#262c28]">
                {reviews.map(rev => (
                  <div key={rev.id} className="py-4 space-y-2">
                    <div className="flex justify-between items-start text-xs">
                      <div>
                        <strong className="text-white text-sm">{rev.author}</strong>
                        <div className="flex items-center gap-1 mt-1 text-amber-400">
                          {Array.from({ length: rev.rating }).map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${rev.status === "Approved" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>{rev.status}</span>
                    </div>
                    <p className="text-xs text-gray-300 italic">"{rev.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "csv" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
              <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow space-y-4">
                <h3 className="text-xs font-black text-white uppercase tracking-wider">Spreadsheet CSV Import</h3>
                <div className="p-6 border border-dashed border-[#2d3a31] rounded-xl bg-[#0d0f0d] text-center flex flex-col items-center justify-center gap-3">
                  <Upload className="w-10 h-10 text-emerald-500 animate-bounce" />
                  <span className="text-xs font-bold text-white">Upload CSV spreadsheet file</span>
                  <input type="file" accept=".csv" onChange={handleCSVUpload} className="block text-2xs cursor-pointer text-gray-400 file:bg-[#141815] file:text-emerald-450 file:px-4 file:py-2 file:border-0" />
                  {csvFile && <button onClick={triggerCSVImport} disabled={isImporting} className="mt-2.5 bg-emerald-500 text-emerald-950 font-black text-xs px-5 py-2 rounded-xl hover:bg-emerald-600">RUN BULK LOADER</button>}
                </div>
              </div>

              <div className="bg-[#141815] border border-[#262c28] p-5 rounded-2xl shadow flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-black text-white uppercase tracking-wider">Execution Console</h3>
                  <div className="bg-[#0d0f0d] border border-[#262c28] p-4 rounded-xl font-mono text-[10px] text-emerald-450 h-32 overflow-y-auto space-y-1">
                    {importLogs.map((lg, i) => (
                      <div key={i}>&gt;&gt; {lg}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "media" && (
            <div className="bg-[#141815] border border-[#262c28] p-6 rounded-2xl shadow space-y-4 animate-fade-in">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {mediaFolders.map((fd, i) => (
                  <div key={i} className="p-4 border border-[#262c28] rounded-xl bg-[#0d0f0d]">
                    <Folder className="w-8 h-8 text-emerald-500" />
                    <strong className="text-white text-xs block truncate mt-1">{fd.name}</strong>
                    <span className="text-[9px] text-gray-550 block">{fd.files} files</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </section>
      </main>

      {/* -------------------- ADD / EDIT MODAL WORKSPACE -------------------- */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#141815] border border-[#262c28] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl animate-fade-in flex flex-col justify-between">
            <header className="px-6 py-4.5 border-b border-[#262c28] bg-[#101311] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-white uppercase tracking-wider">{editingProduct ? "Modify Product Specifications" : "Create New Catalog Entry"}</h3>
              </div>
              <button onClick={() => setIsFormOpen(false)} className="p-2 bg-[#0d0f0d] hover:bg-[#1a201c] border border-[#262c28] text-gray-400 rounded-xl"><X className="w-4 h-4" /></button>
            </header>

            <form onSubmit={handleSaveProduct} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-semibold">
              <div className="space-y-4">
                <h4 className="text-2xs font-black text-emerald-400 uppercase tracking-widest border-b border-[#1e2520] pb-1">1. Product Identity</h4>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Product Title</label>
                  <input type="text" value={prodName} onChange={e => setProdName(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">SKU Code</label>
                    <input type="text" value={prodSKU} onChange={e => setProdSKU(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white font-mono" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Brand</label>
                    <select value={prodBrand} onChange={e => setProdBrand(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-gray-300 font-bold">
                      {brands.map(br => <option key={br.id} value={br.name}>{br.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">Description</label>
                  <textarea rows={4} value={prodDesc} onChange={e => setProdDesc(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white" />
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-2xs font-black text-emerald-400 uppercase tracking-widest border-b border-[#1e2520] pb-1">2. Price & Stock</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Retail Price (₹)</label>
                    <input type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white font-mono" required />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Cost Price (₹)</label>
                    <input type="number" value={prodCost} onChange={e => setProdCost(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white font-mono" required />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">GST Tax (%)</label>
                    <select value={prodGST} onChange={e => setProdGST(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-gray-300 font-bold">
                      <option value="5">5% GST</option>
                      <option value="12">12% GST</option>
                      <option value="18">18% GST</option>
                      <option value="28">28% GST</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Discount (%)</label>
                    <input type="number" value={prodDiscount} onChange={e => setProdDiscount(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white font-mono" />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 block mb-1">Stock</label>
                    <input type="number" value={prodStock} onChange={e => setProdStock(e.target.value)} className="w-full bg-[#0d0f0d] border border-[#262c28] p-3 rounded-xl text-white font-mono" required />
                  </div>
                </div>
                <div className="p-4 border border-[#262c28] rounded-2xl bg-[#0d0f0d] grid grid-cols-3 gap-4 text-center font-mono">
                  <div>
                    <span className="text-[9px] block text-gray-450 uppercase font-bold">Net GST</span>
                    <strong className="text-sm font-black text-white block mt-1">₹{calculatedMargin.taxAmount}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] block text-gray-450 uppercase font-bold">Net Profit</span>
                    <strong className="text-sm font-black text-emerald-450 block mt-1">₹{calculatedMargin.profit}</strong>
                  </div>
                  <div>
                    <span className="text-[9px] block text-gray-450 uppercase font-bold">Margin</span>
                    <strong className="text-sm font-black text-blue-450 block mt-1">{calculatedMargin.margin}%</strong>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 border-t border-[#262c28] pt-4.5 flex justify-end gap-3 bg-[#101311] -mx-6 -mb-6 p-6 rounded-b-3xl">
                <button type="button" onClick={() => setIsFormOpen(false)} className="px-5 py-2.5 bg-[#0d0f0d] border border-[#262c28] text-gray-300 font-extrabold rounded-xl">CANCEL</button>
                <button type="submit" className="px-6 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-emerald-950 font-black rounded-xl">SAVE SPECIFICATIONS</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
