
import React from 'react';

const GapAnalysisView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Gap & Opportunity Analysis</h2>
        <p className="text-slate-700 mb-4">
          Analysis of the full degree plan CSV reveals a robust catalog with few topical gaps. Previous concerns regarding <strong>Data Analytics</strong> and <strong>Cloud Computing</strong> are fully addressed by the specific "Professional Focus" tracks and Micro-credentials found in the data. The primary challenge is now <strong>Portfolio Optimization</strong> rather than curriculum development.
        </p>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-900 mb-2">Closed Gap: Data Analytics</h3>
            <ul className="list-disc list-inside text-sm text-green-900 space-y-1">
              <li><strong>Evidence:</strong> Presence of <em>IN223-IN226</em> (aligned with Google Data Analytics Cert) and advanced courses like <em>IN400 AI/Deep Learning</em> and <em>AC570 Data Analytics for Accountants</em>.</li>
              <li><strong>Status:</strong> Competitive. The curriculum spans from introductory literacy (SS290) to advanced technical application (IN300).</li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded border border-green-200">
            <h3 className="font-bold text-green-900 mb-2">Closed Gap: Project Management</h3>
            <ul className="list-disc list-inside text-sm text-green-900 space-y-1">
              <li><strong>Evidence:</strong> A complete undergraduate track (<em>MT245, MT246, MT247</em>) aligned with the Google Project Management Certificate, plus a Graduate Certificate track (<em>GM591-594</em>).</li>
              <li><strong>Status:</strong> Market Leading. The integration of Agile/Scrum (MT247) is highly relevant.</li>
            </ul>
          </div>

           <div className="bg-amber-50 p-4 rounded border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">Optimization: ExcelTrack™ vs. Standard</h3>
            <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
              <li><strong>Observation:</strong> Core courses (e.g., <em>MT140</em>) have corresponding modular versions (<em>MT140M1-M5</em>).</li>
              <li><strong>Risk:</strong> Maintaining content parity between the 5-credit standard course and the 5x1-credit modules requires significant instructional design overhead.</li>
            </ul>
          </div>

           <div className="bg-amber-50 p-4 rounded border border-amber-200">
            <h3 className="font-bold text-amber-900 mb-2">Opportunity: Health Informatics Security</h3>
            <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
              <li><strong>Context:</strong> Strong Health Admin (HA) and IT Security (IT) tracks exist independently.</li>
              <li><strong>Gap:</strong> A specific bridge course or Micro-credential focusing on <strong>HIPAA Security Compliance</strong> and <strong>Telehealth Infrastructure</strong> would bridge the HA and IT portfolios effectively.</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Portfolio Optimization Priorities</h2>
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-slate-100 text-left">
              <th className="p-3">Category</th>
              <th className="p-3">Observation</th>
              <th className="p-3">Recommendation</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="p-3 font-medium">Micro-credential Overlap</td>
              <td className="p-3 text-slate-600">Many Micro-credentials (e.g., "Business Fundamentals") are simply subsets of the BS Core.</td>
              <td className="p-3 text-blue-700">Market these aggressively as "Milestone Credentials" to improve retention for students who may drop out before BS completion.</td>
            </tr>
            <tr className="border-b">
              <td className="p-3 font-medium">ManTech Partnership</td>
              <td className="p-3 text-slate-600">Specific "ManTech" custom bundles exist in the data.</td>
              <td className="p-3 text-blue-700">Evaluate if these custom bundles can be generalized into a "Government Contracting" or "Defense Industry" open-enrollment track.</td>
            </tr>
             <tr className="border-b">
              <td className="p-3 font-medium">Apprenticeship Scaling</td>
              <td className="p-3 text-slate-600">Lilly Apprenticeships use unique codes (e.g., <em>IN250</em>).</td>
              <td className="p-3 text-blue-700">Ensure these courses are available to general population students if the exclusive contract allows, to maximize ROI on course development.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GapAnalysisView;
