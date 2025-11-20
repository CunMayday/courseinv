
import React from 'react';

const ExecutiveSummaryView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 text-white p-6 rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-2">Executive Summary</h2>
        <p className="text-slate-300 mb-2">
          This report analyzes the School of Business & IT curriculum based on the comprehensive CSV dataset. The portfolio reveals a mature <strong>"Stackable Credential"</strong> strategy, where specific Micro-credentials (e.g., <em>Google Data Analytics</em>, <em>AWS Cloud</em>, <em>ManTech Cybersecurity</em>) serve as building blocks for broader Bachelor's degrees.
        </p>
        <p className="text-xs text-slate-400 italic mt-2 border-t border-slate-700 pt-2">
          <strong>Scope:</strong> Analysis of Micro-credentials, Associate's, Bachelor's, and Master's degree plans across Business, IT, and Cybersecurity.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-sm">
          <h3 className="font-bold text-green-800">Strategic Asset</h3>
          <p className="text-sm text-green-900 mt-1">
            <strong>Corporate Integration:</strong> The curriculum features explicit partnerships (Google, Lilly, ManTech) integrated into credit-bearing coursework (e.g., <em>MT245-MT247</em> for Google PM), reducing the gap between academic theory and industry certification.
          </p>
        </div>
        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded shadow-sm">
          <h3 className="font-bold text-yellow-800">Complexity Risk</h3>
          <p className="text-sm text-yellow-900 mt-1">
            <strong>Version Proliferation:</strong> The existence of standard, "ExcelTrack", and "Professional Focus" versions of the same degree creates a massive inventory of Course SKUs (e.g., <em>AC114</em> vs <em>AC114M1-M5</em>), increasing administrative overhead.
          </p>
        </div>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded shadow-sm">
          <h3 className="font-bold text-blue-800">Growth Area</h3>
          <p className="text-sm text-blue-900 mt-1">
            <strong>Apprenticeship Models:</strong> The <em>Lilly Data Science</em> and <em>Cloud Development</em> Apprenticeship tracks offer a highly differentiated value proposition that combines work-integrated learning with a degree path.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="font-bold text-lg mb-4">Detailed Findings</h3>
        
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-slate-800">1. The "Professional Focus" Degree Structure</h4>
            <p className="text-slate-600 text-sm">
              The data shows a repeated pattern: <em>BS in [Major] + [Certificate Name]</em>. For example, "BS in Business Administration - Google Project Management". This structure uses specific course sequences (e.g., <em>MT245/MT246/MT247</em>) to fulfill degree requirements while preparing for external credentials. This is a best-in-class retention and marketing strategy.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-800">2. High-Usage Core Courses</h4>
            <p className="text-slate-600 text-sm">
              Courses like <em>MT140 Introduction to Management</em> and <em>CM107 College Composition I</em> act as "Super Cores," appearing in nearly every undergraduate program (Usage Count > 80). Any changes to these courses will have cascading effects across the entire university.
            </p>
          </div>

           <div>
            <h4 className="font-semibold text-slate-800">3. Specialized Verticals</h4>
            <p className="text-slate-600 text-sm">
              Beyond general business, the catalog supports deep vertical specializations including <strong>Applied Manufacturing (BI)</strong>, <strong>Hospitality (TH/HA)</strong>, and <strong>Construction Management (MT281/282)</strong>, indicating a strategy to capture trade-adjacent professional markets.
            </p>
          </div>

           <div className="p-3 bg-gray-50 border border-gray-200 rounded">
            <h4 className="font-semibold text-gray-800">4. Graduate Program Overlap</h4>
            <p className="text-slate-600 text-sm">
              The <strong>MBA</strong> (GB prefix) and <strong>MS in Management & Leadership</strong> (GM prefix) run parallel tracks with similar outcomes. While the MBA focuses slightly more on quant/finance (GB540, GB550), the MSML focuses on theory (GM500). There is opportunity to share more electives between these graduate populations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExecutiveSummaryView;
