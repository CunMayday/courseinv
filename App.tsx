
import React, { useState } from 'react';
import InventoryTable from './components/InventoryTable';
import RelevancyChart from './components/RelevancyChart';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-slate-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-[#CFB991] rounded-full flex items-center justify-center text-slate-900 font-bold">P</div>
                <h1 className="text-xl font-bold tracking-tight">Purdue Global <span className="text-[#CFB991] font-normal">Catalog Review</span></h1>
            </div>
            <div className="text-sm text-slate-400">School of Business & IT</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dashboard Content */}
        <div className="animate-fade-in space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Course Portfolio Health</h2>
            <RelevancyChart />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-800 mb-4">Course Inventory (GB, IT, MT)</h2>
            <InventoryTable />
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-slate-200 mt-12 py-8">
          <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
              Generated Analysis based on 2025-2026 Catalog Data. Internal Use Only.
          </div>
      </footer>
    </div>
  );
}

export default App;
