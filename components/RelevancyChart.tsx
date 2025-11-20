import React, { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { courses } from '../services/courseData';

const RelevancyChart: React.FC = () => {
  const [showDefinitions, setShowDefinitions] = useState(false);

  // Data Prep for Pie Chart
  const relevanceCounts = courses.reduce((acc, course) => {
    acc[course.relevanceScore] = (acc[course.relevanceScore] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pieData = [
    { name: 'High Relevance', value: relevanceCounts['High'] || 0, color: '#15803d' },
    { name: 'Medium Relevance', value: relevanceCounts['Medium'] || 0, color: '#a16207' },
    { name: 'Low Relevance', value: relevanceCounts['Low'] || 0, color: '#b91c1c' },
  ];

  // Data Prep for Bar Chart (Orphan vs Active)
  const usageStats = courses.reduce((acc, course) => {
    if (course.usageCount === 0) acc.orphan++;
    else if (course.usageCount <= 2 && course.role === 'Elective') acc.rare++;
    else acc.active++;
    return acc;
  }, { orphan: 0, rare: 0, active: 0 });

  const barData = [
    { name: 'Active Core', value: usageStats.active },
    { name: 'Rare/Elective', value: usageStats.rare },
    { name: 'Orphaned', value: usageStats.orphan },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow border border-slate-200 relative transition-all duration-300 ease-in-out">
        <div className="flex justify-between items-start mb-4">
            <h3 className="text-lg font-bold text-slate-800">Topical Relevance Distribution</h3>
            <button 
                onClick={() => setShowDefinitions(!showDefinitions)}
                className="text-xs flex items-center gap-1 px-2 py-1 rounded border border-slate-300 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors bg-slate-50"
                title="View relevancy criteria definitions"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                </svg>
                {showDefinitions ? 'Hide Definitions' : 'Definitions'}
            </button>
        </div>

        {showDefinitions && (
            <div className="mb-4 p-4 bg-slate-50 rounded text-sm text-slate-700 border border-slate-200">
                <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wide border-b border-slate-200 pb-2">Criteria Definitions</h4>
                <div className="space-y-3">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-green-700"></span>
                             <span className="font-bold text-green-800 text-xs">High Relevance</span>
                        </div>
                        <p className="text-xs leading-relaxed pl-4 text-slate-600">
                            Core degree requirements, high market demand skills (e.g., Cloud, Cyber, AI), strategic external partnerships (e.g., Google Certs), or essential regulatory/compliance topics.
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-yellow-700"></span>
                             <span className="font-bold text-yellow-800 text-xs">Medium Relevance</span>
                        </div>
                        <p className="text-xs leading-relaxed pl-4 text-slate-600">
                            Standard foundational curriculum, specific niche concentrations (e.g., Sports Mgmt, Construction), or courses needing modernization (valid topic, dated approach).
                        </p>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                             <span className="w-2 h-2 rounded-full bg-red-700"></span>
                             <span className="font-bold text-red-800 text-xs">Low Relevance</span>
                        </div>
                        <p className="text-xs leading-relaxed pl-4 text-slate-600">
                            Legacy technologies (e.g., MS Access), commodity skills (e.g., basic Office apps), or orphaned courses with no current degree path.
                        </p>
                    </div>
                </div>
            </div>
        )}

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({name, percent}) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow border border-slate-200">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Course Usage Status</h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#CFB991" name="Number of Courses" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default RelevancyChart;