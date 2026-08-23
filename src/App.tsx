import React, { useState } from 'react';
import { Dataset, ProductItem, UserProfile } from './types';
import { INITIAL_DATASETS } from './data/sampleDatasets';
import { computeDataQualityReport } from './services/dataPipeline';

// Layout
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Common
import { CinematicLoader } from './components/common/CinematicLoader';
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Landing Page Components
import { HeroSection } from './components/landing/HeroSection';
import { TransformationStudio } from './components/landing/TransformationStudio';
import { ProblemVisualizer } from './components/landing/ProblemVisualizer';
import { IndustrialSpecsGallery } from './components/landing/IndustrialSpecsGallery';

// Workspace Components
import { ProductExplorer } from './components/workspace/ProductExplorer';
import { ProductDetailModal } from './components/workspace/ProductDetailModal';
import { SemanticSearchModal } from './components/workspace/SemanticSearchModal';
import { RecommendationEngine } from './components/workspace/RecommendationEngine';
import { DuplicateDetection } from './components/workspace/DuplicateDetection';
import { ProductComparison } from './components/workspace/ProductComparison';
import { DataQualityDashboard } from './components/workspace/DataQualityDashboard';
import { DatasetUploader } from './components/workspace/DatasetUploader';
import { ExportDialog } from './components/workspace/ExportDialog';
import { AuthModal } from './components/workspace/AuthModal';
import { AddProductModal } from './components/workspace/AddProductModal';

// Copilot
import { CopilotOrb } from './components/copilot/CopilotOrb';
import { CopilotDrawer } from './components/copilot/CopilotDrawer';

const createEmptyDataset = (companyName: string = 'Enterprise Workspace'): Dataset => ({
  id: `ds-user-${Date.now()}`,
  name: `${companyName} Catalog`,
  description: 'Private industrial catalog repository. Ingest CSV/XLSX supplier feeds or add individual SKUs to begin.',
  filename: 'custom_industrial_catalog.csv',
  fileSize: '0 KB',
  uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
  recordCount: 0,
  qualityReport: {
    overallScore: 100,
    completeness: 100,
    consistency: 100,
    duplicateRisk: 0,
    validity: 100,
    attributeCoverage: 100,
    totalRecords: 0,
    cleanRecords: 0,
    flaggedRecords: 0,
    duplicateGroupsCount: 0,
    categoryBreakdown: [],
    missingFieldStats: [],
    manufacturerStats: [],
  },
  products: [],
  duplicateGroups: [],
  status: 'ready',
});

export default function App() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('landing');
  
  // Datasets separation: Custom User Catalog vs Demo Trial Catalog
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [customDataset, setCustomDataset] = useState<Dataset>(createEmptyDataset('My Enterprise'));
  const [demoDataset, setDemoDataset] = useState<Dataset>(INITIAL_DATASETS[0]);
  
  const currentDataset = isDemoMode ? demoDataset : customDataset;
  
  // Modals & Drawers
  const [isUploaderOpen, setIsUploaderOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

  // Comparison State
  const [compareIds, setCompareIds] = useState<string[]>([]);

  // Clean unauthenticated default user state
  const [user, setUser] = useState<UserProfile>({
    id: '',
    name: '',
    email: '',
    role: 'Lead Mechanical Engineer',
    company: '',
    isAuthenticated: false,
    savedProductIds: [],
  });

  const comparedProducts = currentDataset.products.filter((p) => compareIds.includes(p.id));

  const navigateToWorkspace = (targetTab: string = 'explorer') => {
    if (!user.isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      setCurrentTab(targetTab);
    }
  };

  const handleOpenUpload = () => {
    if (!user.isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      setIsUploaderOpen(true);
    }
  };

  const handleOpenAddProduct = () => {
    if (!user.isAuthenticated) {
      setIsAuthOpen(true);
    } else {
      setIsAddProductOpen(true);
    }
  };

  // Switch to Demo Dataset
  const handleLoadDemoDataset = () => {
    setIsDemoMode(true);
    if (demoDataset.products.length >= 2 && compareIds.length === 0) {
      setCompareIds([demoDataset.products[0].id, demoDataset.products[3]?.id || demoDataset.products[1].id]);
    }
    setCurrentTab('explorer');
  };

  // Toggle between demo dataset and private catalog
  const handleToggleDemoDataset = () => {
    setIsDemoMode((prev) => !prev);
  };

  // Add Product Manually
  const handleAddProduct = (newProduct: ProductItem) => {
    const updatedProducts = [newProduct, ...customDataset.products];
    const newReport = computeDataQualityReport(updatedProducts, customDataset.duplicateGroups);

    setCustomDataset({
      ...customDataset,
      products: updatedProducts,
      recordCount: updatedProducts.length,
      qualityReport: newReport,
    });

    // Make sure we are viewing custom dataset
    setIsDemoMode(false);
  };

  // Toggle Compare
  const handleToggleCompare = (product: ProductItem) => {
    setCompareIds((prev) => {
      if (prev.includes(product.id)) {
        return prev.filter((id) => id !== product.id);
      }
      if (prev.length >= 4) {
        return [...prev.slice(1), product.id];
      }
      return [...prev, product.id];
    });
  };

  // Duplicate Resolution Handlers
  const handleMergeDuplicate = (groupId: string, masterId: string) => {
    const targetDataset = isDemoMode ? demoDataset : customDataset;
    const updatedGroups = targetDataset.duplicateGroups.map((g) => {
      if (g.id === groupId) {
        return { ...g, resolutionStatus: 'merged' as const };
      }
      return g;
    });

    const newReport = computeDataQualityReport(targetDataset.products, updatedGroups);

    if (isDemoMode) {
      setDemoDataset({
        ...demoDataset,
        duplicateGroups: updatedGroups,
        qualityReport: newReport,
      });
    } else {
      setCustomDataset({
        ...customDataset,
        duplicateGroups: updatedGroups,
        qualityReport: newReport,
      });
    }
  };

  const handleIgnoreDuplicate = (groupId: string) => {
    const targetDataset = isDemoMode ? demoDataset : customDataset;
    const updatedGroups = targetDataset.duplicateGroups.map((g) => {
      if (g.id === groupId) {
        return { ...g, resolutionStatus: 'ignored' as const };
      }
      return g;
    });

    if (isDemoMode) {
      setDemoDataset({
        ...demoDataset,
        duplicateGroups: updatedGroups,
      });
    } else {
      setCustomDataset({
        ...customDataset,
        duplicateGroups: updatedGroups,
      });
    }
  };

  // Bookmark Toggle
  const handleToggleBookmark = (productId: string) => {
    setUser((prev) => {
      const exists = prev.savedProductIds.includes(productId);
      return {
        ...prev,
        savedProductIds: exists
          ? prev.savedProductIds.filter((id) => id !== productId)
          : [...prev.savedProductIds, productId],
      };
    });
  };

  if (isLoading) {
    return <CinematicLoader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col selection:bg-cyan-500 selection:text-zinc-950 antialiased font-sans">
      
      {/* Top Floating Glass Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenUpload={handleOpenUpload}
        user={user}
        activeDataset={currentDataset}
        isDemoMode={isDemoMode}
        onToggleDemoDataset={handleToggleDemoDataset}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full">
        
        {/* PUBLIC TAB: STREAMLINED PRODUCT OVERVIEW & TRANSFORMATION */}
        {currentTab === 'landing' && (
          <div className="space-y-0">
            <HeroSection
              onExploreCatalog={() => navigateToWorkspace('explorer')}
              onOpenUpload={handleOpenUpload}
              onScrollToStory={() => {
                const el = document.getElementById('transformation');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

            <div id="transformation">
              <TransformationStudio
                onEnterWorkspace={() => navigateToWorkspace('explorer')}
                onOpenUpload={handleOpenUpload}
              />
            </div>

            <div id="audit">
              <ProblemVisualizer />
            </div>

            <div id="specs">
              <IndustrialSpecsGallery
                sampleProducts={demoDataset.products}
                onSelectProduct={(p) => setSelectedProduct(p)}
              />
            </div>

            {/* Bottom Enterprise CTA */}
            <section className="py-16 px-4 sm:px-6 bg-zinc-900/60 border-t border-zinc-800 text-center">
              <div className="max-w-2xl mx-auto space-y-5 font-mono">
                <span className="text-xs text-cyan-400 px-2.5 py-0.5 rounded-md bg-zinc-900 border border-zinc-800">
                  ENTERPRISE DATA ENGINE
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-zinc-100">
                  Ready to Standardize Your Industrial Catalogs?
                </h2>
                <p className="text-xs sm:text-sm text-zinc-400 font-sans leading-relaxed">
                  Ingest raw supplier feeds, eliminate duplicate procurement overhead, and deploy natural-language vector search.
                </p>
                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                  <button
                    onClick={() => navigateToWorkspace('explorer')}
                    className="px-5 py-2.5 rounded-lg text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-zinc-950 transition"
                  >
                    Open Live Catalog Explorer
                  </button>
                  <button
                    onClick={handleOpenUpload}
                    className="px-5 py-2.5 rounded-lg text-xs font-medium bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
                  >
                    Upload CSV / XLSX Dataset
                  </button>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* AUTHENTICATED WORKSPACE VIEWS */}
        {currentTab !== 'landing' && user.isAuthenticated && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
            
            {/* TAB 2: PRODUCT EXPLORER */}
            {currentTab === 'explorer' && (
              <ErrorBoundary fallbackTitle="Catalog Explorer View Issue">
                <ProductExplorer
                  products={currentDataset?.products || []}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  selectedCompareIds={compareIds}
                  onToggleCompare={handleToggleCompare}
                  onOpenCompareView={() => setCurrentTab('compare')}
                  onOpenExport={() => setIsExportOpen(true)}
                  onOpenUpload={handleOpenUpload}
                  onOpenAddProduct={handleOpenAddProduct}
                  onLoadDemoDataset={handleLoadDemoDataset}
                />
              </ErrorBoundary>
            )}

            {/* TAB 3: AI SEMANTIC SEARCH */}
            {currentTab === 'search' && (
              <ErrorBoundary fallbackTitle="Semantic Search View Issue">
                <SemanticSearchModal
                  products={currentDataset?.products || []}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenUpload={handleOpenUpload}
                  onLoadDemoDataset={handleLoadDemoDataset}
                />
              </ErrorBoundary>
            )}

            {/* TAB 4: COMPARE PRODUCTS MATRIX */}
            {currentTab === 'compare' && (
              <ErrorBoundary fallbackTitle="Product Comparison View Issue">
                <ProductComparison
                  products={comparedProducts}
                  allCatalogProducts={currentDataset?.products || []}
                  onRemoveProduct={(id) => setCompareIds((prev) => prev.filter((pid) => pid !== id))}
                  onAddProduct={(p) => handleToggleCompare(p)}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                />
              </ErrorBoundary>
            )}

            {/* TAB 5: DUPLICATE SHIELD */}
            {currentTab === 'duplicates' && (
              <ErrorBoundary fallbackTitle="Duplicate Shield View Issue">
                <DuplicateDetection
                  duplicateGroups={currentDataset?.duplicateGroups || []}
                  productsCount={currentDataset?.products?.length || 0}
                  onMergeGroup={handleMergeDuplicate}
                  onIgnoreGroup={handleIgnoreDuplicate}
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenUpload={handleOpenUpload}
                  onLoadDemoDataset={handleLoadDemoDataset}
                />
              </ErrorBoundary>
            )}

            {/* TAB 6: DATA QUALITY & ANALYTICS */}
            {currentTab === 'analytics' && (
              <ErrorBoundary fallbackTitle="Data Quality Dashboard Issue">
                <DataQualityDashboard
                  report={currentDataset.qualityReport}
                  onOpenExport={() => setIsExportOpen(true)}
                  onOpenUpload={handleOpenUpload}
                  onLoadDemoDataset={handleLoadDemoDataset}
                />
              </ErrorBoundary>
            )}

            {/* TAB 7: RECOMMENDATIONS & COPILOT FULL VIEW */}
            {currentTab === 'copilot' && (
              <ErrorBoundary fallbackTitle="Recommendation Engine Issue">
                <div className="space-y-6">
                  <RecommendationEngine
                    products={currentDataset?.products || []}
                    onSelectProduct={(p) => setSelectedProduct(p)}
                  />
                </div>
              </ErrorBoundary>
            )}

          </div>
        )}

      </main>

      {/* Persistent Copilot Floating Orb & Drawer */}
      <CopilotOrb
        isOpen={isCopilotOpen}
        onToggle={() => {
          if (!user.isAuthenticated) {
            setIsAuthOpen(true);
          } else {
            setIsCopilotOpen(true);
          }
        }}
        voiceState="idle"
      />

      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeDatasetName={currentDataset.name}
        products={currentDataset.products}
        selectedProduct={selectedProduct}
        comparedProducts={comparedProducts}
        onSelectProduct={(p) => setSelectedProduct(p)}
      />

      {/* Global Modals */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onToggleCompare={handleToggleCompare}
        isCompared={selectedProduct ? compareIds.includes(selectedProduct.id) : false}
        onBookmark={handleToggleBookmark}
        isBookmarked={selectedProduct ? user.savedProductIds.includes(selectedProduct.id) : false}
      />

      <DatasetUploader
        isOpen={isUploaderOpen}
        onClose={() => setIsUploaderOpen(false)}
        onDatasetLoaded={(ds) => {
          setCustomDataset(ds);
          setIsDemoMode(false);
          setCurrentTab('explorer');
        }}
      />

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAddProduct={handleAddProduct}
      />

      <ExportDialog
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        products={currentDataset.products}
        datasetName={currentDataset.name}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        user={user}
        onLogin={(updatedUser, isDemoAccount) => {
          setUser(updatedUser);
          if (isDemoAccount) {
            setIsDemoMode(true);
            if (demoDataset.products.length >= 2) {
              setCompareIds([demoDataset.products[0].id, demoDataset.products[3]?.id || demoDataset.products[1].id]);
            }
          } else {
            setIsDemoMode(false);
            if (customDataset.products.length === 0) {
              setCustomDataset(createEmptyDataset(updatedUser.company || 'My Enterprise'));
            }
          }
          setCurrentTab('explorer');
        }}
        onLogout={() => {
          setUser({
            id: '',
            name: '',
            email: '',
            role: 'Lead Mechanical Engineer',
            company: '',
            isAuthenticated: false,
            savedProductIds: [],
          });
          setIsDemoMode(false);
          setCurrentTab('landing');
        }}
      />

      {/* Industrial Footer */}
      <Footer
        onOpenUpload={handleOpenUpload}
        onNavigate={(tab) => {
          if (tab === 'landing') {
            setCurrentTab('landing');
          } else {
            navigateToWorkspace(tab);
          }
        }}
      />

    </div>
  );
}
