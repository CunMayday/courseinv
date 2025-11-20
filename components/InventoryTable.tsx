
import React, { useState, useMemo } from 'react';
import { Course, courses } from '../services/courseData';

type SortKey = keyof Course | 'status';

const InventoryTable: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('ALL');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' } | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesText = course.title.toLowerCase().includes(filter.toLowerCase()) || course.id.toLowerCase().includes(filter.toLowerCase());
      const matchesSubject = subjectFilter === 'ALL' || course.subject === subjectFilter;
      return matchesText && matchesSubject;
    });
  }, [filter, subjectFilter]);

  const sortedCourses = useMemo(() => {
    let sortableItems = [...filteredCourses];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        // Custom Sort Logic
        if (sortConfig.key === 'status') {
            const getStatusScore = (c: Course) => {
                if (c.usageCount === 0) return 1; // Orphan (Lowest)
                if (c.usageCount < 2 && c.role === 'Elective') return 2; // Rarely Used
                return 3; // Active (Highest)
            };
            aValue = getStatusScore(a);
            bValue = getStatusScore(b);
        } else if (sortConfig.key === 'relevanceScore') {
            const priority = { 'High': 3, 'Medium': 2, 'Low': 1 };
            aValue = priority[a.relevanceScore];
            bValue = priority[b.relevanceScore];
        } else if (sortConfig.key === 'programs') {
            aValue = a.programs.length; 
            bValue = b.programs.length;
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }

        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredCourses, sortConfig]);

  const requestSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderSortIcon = (key: SortKey) => {
      if (sortConfig?.key !== key) return <span className="text-slate-300 ml-1 opacity-0 group-hover:opacity-50">↕</span>;
      return <span className="text-slate-600 ml-1">{sortConfig.direction === 'asc' ? '▲' : '▼'}</span>;
  };

  const HeaderCell = ({ label, sortKey, center = false }: { label: string, sortKey: SortKey, center?: boolean }) => (
    <th 
        className={`px-6 py-3 text-xs font-medium text-slate-900 bg-white uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none group border-b border-slate-200 ${center ? 'text-center' : 'text-left'}`}
        onClick={() => requestSort(sortKey)}
    >
        <div className={`flex items-center ${center ? 'justify-center' : 'justify-start'}`}>
            {label}
            {renderSortIcon(sortKey)}
        </div>
    </th>
  );

  return (
    <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-slate-200 relative">
      <div className="p-4 border-b border-slate-200 bg-white flex gap-4 flex-wrap items-center justify-between">
        <div className="flex gap-4">
            <select 
            className="border border-slate-300 rounded px-3 py-2 text-sm bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CFB991] focus:border-transparent"
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            >
            <option value="ALL">All Subjects</option>
            <option value="AC">AC (Accounting)</option>
            <option value="BU">BU (Business General)</option>
            <option value="GB">GB (Grad Business)</option>
            <option value="GF">GF (Grad Finance)</option>
            <option value="HR">HR (Human Resources)</option>
            <option value="IN">IN (Info Systems)</option>
            <option value="IT">IT (Info Tech)</option>
            <option value="MT">MT (Management)</option>
            </select>
            <input 
            type="text" 
            placeholder="Search courses..." 
            className="border border-slate-300 rounded px-3 py-2 text-sm w-64 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#CFB991] focus:border-transparent"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            />
        </div>
        <div className="text-sm text-slate-500 font-medium">
            Total Courses: {courses.length} | Showing: {filteredCourses.length}
        </div>
      </div>
      <div className="overflow-x-auto max-h-[600px] overflow-y-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-white sticky top-0 z-10 shadow-sm">
            <tr>
              <HeaderCell label="Code" sortKey="id" />
              <HeaderCell label="Title" sortKey="title" />
              <HeaderCell label="Usage Count" sortKey="usageCount" center />
              <HeaderCell label="Programs" sortKey="programs" />
              <HeaderCell label="Relevance" sortKey="relevanceScore" />
              <HeaderCell label="Status" sortKey="status" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {sortedCourses.map((course) => (
              <tr key={course.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{course.id}</td>
                <td className="px-6 py-4 text-sm text-slate-700">{course.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700 text-center font-bold">{course.usageCount}</td>
                <td className="px-6 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-2">
                        <span className="truncate max-w-[150px]" title={course.programs.join(', ')}>
                            {course.programs.length > 0 ? course.programs.slice(0, 2).join(', ') + (course.programs.length > 2 ? '...' : '') : <span className="text-red-500 italic">None</span>}
                        </span>
                        <button 
                            onClick={() => setSelectedCourse(course)}
                            className="text-slate-400 hover:text-[#CFB991] transition-colors"
                            title="View Full Program List"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                            </svg>
                        </button>
                    </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        course.relevanceScore === 'High' ? 'bg-green-100 text-green-800' : 
                        course.relevanceScore === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {course.relevanceScore}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                    {course.usageCount === 0 ? (
                        <span className="text-red-600 font-bold">Orphan</span>
                    ) : course.usageCount < 2 && course.role === 'Elective' ? (
                        <span className="text-yellow-600">Rarely Used</span>
                    ) : (
                        <span className="text-slate-600">Active</span>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Details Modal */}
      {selectedCourse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                    <div>
                        <h3 className="text-lg font-bold text-slate-900">{selectedCourse.id}: {selectedCourse.title}</h3>
                        <p className="text-sm text-slate-500">{selectedCourse.school}</p>
                    </div>
                    <button 
                        onClick={() => setSelectedCourse(null)}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="p-6 space-y-4">
                    
                    <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Associated Programs</h4>
                        <div className="bg-slate-50 rounded border border-slate-200 p-3 max-h-48 overflow-y-auto">
                            <ul className="space-y-1">
                                {selectedCourse.programs.map((program, idx) => (
                                    <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                                        <span className="text-[#CFB991] mt-1">•</span>
                                        {program}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Course Lead</h4>
                             <p className="text-sm font-medium text-slate-900">{selectedCourse.courseLead || 'N/A'}</p>
                             <p className="text-xs text-slate-500">{selectedCourse.leadEmail || ''}</p>
                        </div>
                        <div>
                             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Department Chair</h4>
                             <p className="text-sm font-medium text-slate-900">{selectedCourse.deptChair || 'N/A'}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100">
                         <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-xs text-slate-500">Usage</div>
                            <div className="font-bold text-slate-900">{selectedCourse.usageCount}</div>
                         </div>
                         <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-xs text-slate-500">Role</div>
                            <div className="font-bold text-slate-900">{selectedCourse.role}</div>
                         </div>
                         <div className="text-center p-2 bg-slate-50 rounded">
                            <div className="text-xs text-slate-500">Level</div>
                            <div className="font-bold text-slate-900">{selectedCourse.level}</div>
                         </div>
                    </div>
                </div>
                <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
                    <button 
                        onClick={() => setSelectedCourse(null)}
                        className="px-4 py-2 bg-white border border-slate-300 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default InventoryTable;
