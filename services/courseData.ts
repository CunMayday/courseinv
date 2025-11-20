
export interface Course {
  id: string;
  title: string;
  school: 'Business' | 'Information Technology';
  subject: string;
  level: 'Undergraduate' | 'Graduate';
  programs: string[]; // Full list
  usageCount: number;
  role: 'Core' | 'Concentration' | 'Elective' | 'Micro-credential';
  relevanceScore: 'High' | 'Medium' | 'Low';
  courseLead?: string;
  leadEmail?: string;
  deptChair?: string;
  relevanceNotes?: string;
  topics?: string[];
}

// Program pools to generate realistic, varied program lists for each subject
const programPools: Record<string, string[]> = {
  'AC': [
    'BS Accounting', 'AAS Accounting', 'MS Accounting', 'MBA - Accounting Concentration',
    'Graduate Certificate in Accounting', 'ExcelTrack BS Accounting', 'ExcelTrack AAS Accounting',
    'Micro-credential in Tax Accounting', 'Micro-credential in Auditing', 'BS Finance - Accounting Minor'
  ],
  'GB': [
    'Master of Business Administration (MBA)', 'ExcelTrack MBA', 'MS Management and Leadership',
    'MBA - IT Management', 'MBA - Project Management', 'MBA - Finance', 'MBA - Marketing',
    'MBA - Human Resources', 'Dual Degree MBA/MSIT', 'Graduate Certificate in Project Management'
  ],
  'GF': [
    'MS Finance', 'MBA - Finance Concentration', 'Graduate Certificate in Financial Planning',
    'ExcelTrack MS Finance', 'MS Finance - Financial Analysis', 'MS Finance - Wealth Management'
  ],
  'HR': [
    'BS Business Administration - HR Concentration', 'BS Organizational Management - HR',
    'MS Management - HR Concentration', 'Human Resource Management Certificate',
    'SHRM Aligned Micro-credential', 'ExcelTrack BS Business - HR'
  ],
  'IN': [
    'BS Analytics', 'BS Cloud Computing', 'MS Data Analytics', 'Google Data Analytics Certificate',
    'ExcelTrack BS Analytics', 'BS IT - Data Management', 'MS IT - Business Intelligence',
    'Micro-credential in Data Governance'
  ],
  'IT': [
    'BS Information Technology', 'BS Cybersecurity', 'MS Information Technology', 'MS Cybersecurity Management',
    'AAS Information Technology', 'Google IT Support Certificate', 'ExcelTrack BS IT', 'ExcelTrack BS Cybersecurity',
    'Micro-credential in Network Administration', 'Micro-credential in Secure Coding', 'BS Cloud Computing',
    'Cisco CCNA Preparation Track'
  ],
  'MT': [
    'BS Business Administration', 'AAS Business Administration', 'BS Organizational Management',
    'Master of Business Administration', 'Supply Chain Management Certificate', 'ExcelTrack BS Business Admin',
    'ExcelTrack AAS Business Admin', 'BS Business - Management Concentration', 'Micro-credential in Team Leadership',
    'Micro-credential in Small Business Mgmt'
  ],
  'BU': [
     'BS Business Administration', 'AAS Business Administration', 'ExcelTrack BS Business'
  ]
};

// Helper to generate a deterministic but varied list of programs
const generateProgramsAndUsage = (id: string, subject: string): { programs: string[], count: number } => {
  const pool = programPools[subject] || ['General Elective'];
  
  // Create a pseudo-random selection based on the Course ID characters to be consistent across renders
  const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const count = (seed % pool.length) + 1; // Ensure at least 1 program
  
  // Shuffle pool deterministically based on seed
  const shuffled = [...pool].sort((a, b) => {
      const valA = a.charCodeAt(0) + seed;
      const valB = b.charCodeAt(0) + seed;
      return (valA % 3) - (valB % 3); 
  });

  const selectedPrograms = shuffled.slice(0, count);
  
  return {
    programs: selectedPrograms,
    count: selectedPrograms.length
  };
};

// Helper to determine role
const getRole = (id: string): 'Core' | 'Concentration' | 'Elective' | 'Micro-credential' => {
  const num = parseInt(id.replace(/\D/g, ''));
  if ([100, 104, 140, 219, 220, 500, 512].some(n => num === n)) return 'Core';
  if (num >= 300 && num < 500) return 'Concentration';
  return 'Elective';
};

// Raw data from CSV (Filtered to remove GM)
const rawCourses = [
  // Business - Accounting (AC)
  { id: 'AC112', title: 'Accounting Fundamentals for Management', school: 'Business', subject: 'AC', courseLead: 'Sharon Brown', leadEmail: 'SBrown3@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC114', title: 'ACCOUNTING I', school: 'Business', subject: 'AC', courseLead: 'Broderick Martinez', leadEmail: 'BMartinez@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC116', title: 'ACCOUNTING II', school: 'Business', subject: 'AC', courseLead: 'Broderick Martinez', leadEmail: 'BMartinez@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC122', title: 'Payroll Accounting', school: 'Business', subject: 'AC', courseLead: 'Sharon Brown', leadEmail: 'SBrown3@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC239', title: 'MANAGERIAL ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Broderick Martinez', leadEmail: 'BMartinez@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC256', title: 'FEDERAL TAX', school: 'Business', subject: 'AC', courseLead: 'Kristen Swisher', leadEmail: 'KSwisher@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC298', title: "Associate's Capstone in Accounting", school: 'Business', subject: 'AC', courseLead: 'Sharon Brown', leadEmail: 'SBrown3@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC300', title: 'INTERMEDIATE ACCOUNTING I', school: 'Business', subject: 'AC', courseLead: 'Jaclyn Felder-Strauss', leadEmail: 'JFelder-Strauss@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC301', title: 'INTERMEDIATE ACCOUNTING II', school: 'Business', subject: 'AC', courseLead: 'Jaclyn Felder-Strauss', leadEmail: 'JFelder-Strauss@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC302', title: 'INTERMEDIATE ACCOUNTING III', school: 'Business', subject: 'AC', courseLead: 'Jaclyn Felder-Strauss', leadEmail: 'JFelder-Strauss@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC330', title: 'Managerial Accounting for Business Professionals', school: 'Business', subject: 'AC', courseLead: 'Cynthia Waddell', leadEmail: 'CWaddell@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC410', title: 'AUDITING', school: 'Business', subject: 'AC', courseLead: 'Monica Hubler', leadEmail: 'MHubler@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC420', title: 'COST ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Cynthia Waddell', leadEmail: 'CWaddell@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC430', title: 'ADVANCED TAX—CORPORATE', school: 'Business', subject: 'AC', courseLead: 'Cynthia Waddell', leadEmail: 'CWaddell@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC450', title: 'ADVANCED ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Monica Hubler', leadEmail: 'MHubler@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC465', title: 'ADVANCED FORENSIC ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Cynthia Waddell', leadEmail: 'CWaddell@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC490', title: "Bachelor's Practicum in Accounting", school: 'Business', subject: 'AC', courseLead: 'Monica Hubler', leadEmail: 'MHubler@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC499', title: 'BACHELOR’S CAPSTONE IN ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Monica Hubler', leadEmail: 'MHubler@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC501', title: 'FINANCIAL ACCOUNTING AND REPORTING', school: 'Business', subject: 'AC', courseLead: 'Alfred Greenfield', leadEmail: 'agreenfield@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC502', title: 'Business Law for Accountants', school: 'Business', subject: 'AC', courseLead: 'Rachel Byers', leadEmail: 'RByers@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC503', title: 'ADVANCED AUDITING', school: 'Business', subject: 'AC', courseLead: 'Kimberly Riley', leadEmail: 'KRiley@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC504', title: 'ETHICAL ISSUES IN BUSINESS AND ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Rachel Byers', leadEmail: 'RByers@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC505', title: 'ADVANCED MANAGERIAL/COST ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Alfred Greenfield', leadEmail: 'agreenfield@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC507', title: 'Business Taxation and Strategies', school: 'Business', subject: 'AC', courseLead: 'Rachel Byers', leadEmail: 'RByers@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC550', title: 'Accounting Information Systems', school: 'Business', subject: 'AC', courseLead: 'Kristen Swisher', leadEmail: 'KSwisher@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC551', title: 'ACCOUNTING RESEARCH', school: 'Business', subject: 'AC', courseLead: 'Kristen Swisher', leadEmail: 'KSwisher@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC552', title: 'BUSINESS REORGANIZATIONS AND RESTRUCTURING', school: 'Business', subject: 'AC', courseLead: 'Kristen Swisher', leadEmail: 'KSwisher@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC556', title: 'GOVERNMENT AND NOT-FOR-PROFIT ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Alfred Greenfield', leadEmail: 'agreenfield@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC557', title: 'Internal Control Design, Development, and Evaluation', school: 'Business', subject: 'AC', courseLead: 'Stanley Self', leadEmail: 'SSelf@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC558', title: 'International Accounting Standards and Global Financial Reporting', school: 'Business', subject: 'AC', courseLead: 'Kristopher Blanchard', leadEmail: 'Kristopher.Blanchard@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC561', title: 'TAXATION OF ESTATES AND TRUSTS', school: 'Business', subject: 'AC', courseLead: 'Kristopher Blanchard', leadEmail: 'Kristopher.Blanchard@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC565', title: 'Fraud Examination and Enterprise Risk Management', school: 'Business', subject: 'AC', courseLead: 'Broderick Martinez', leadEmail: 'BMartinez@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC566', title: 'Tax Research and Intro to International Taxation', school: 'Business', subject: 'AC', courseLead: 'Rachel Byers', leadEmail: 'RByers@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC570', title: 'Data Analytics for Accountants', school: 'Business', subject: 'AC', courseLead: 'Sharon Brown', leadEmail: 'SBrown3@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'AC599', title: 'GRADUATE CAPSTONE IN ACCOUNTING', school: 'Business', subject: 'AC', courseLead: 'Alfred Greenfield', leadEmail: 'agreenfield@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  
  // Business - Grad Business (GB)
  { id: 'GB500', title: 'Business Perspectives', school: 'Business', subject: 'GB', courseLead: 'Nazly Nardi', leadEmail: 'NNardi@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB512', title: 'BUSINESS COMMUNICATIONS', school: 'Business', subject: 'GB', courseLead: 'Sylvia DeAngelo', leadEmail: 'SDeAngelo@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB513', title: 'BUSINESS ANALYTICS', school: 'Business', subject: 'GB', courseLead: 'Cuneyt Altinoz', leadEmail: 'CAltinoz@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB518', title: 'Financial Accounting Principles and Analysis', school: 'Business', subject: 'GB', courseLead: 'Stanley Self', leadEmail: 'SSelf@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'GB519', title: 'Measurement and Decision Making', school: 'Business', subject: 'GB', courseLead: 'Stanley Self', leadEmail: 'SSelf@purdueglobal.edu', deptChair: 'Caroline Hartmann' },
  { id: 'GB520', title: 'Strategic Human Resource Management', school: 'Business', subject: 'GB', courseLead: 'Jack T. McCann', leadEmail: 'JMcCann@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB525', title: 'Global Business Environment', school: 'Business', subject: 'GB', courseLead: 'Jose Siqueira', leadEmail: 'Jose.Siqueira@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB526', title: 'Global Management and Leadership', school: 'Business', subject: 'GB', courseLead: 'Jose Siqueira', leadEmail: 'Jose.Siqueira@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB527', title: 'Global Operations', school: 'Business', subject: 'GB', courseLead: 'Jose Siqueira', leadEmail: 'Jose.Siqueira@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB528', title: 'Global Strategy', school: 'Business', subject: 'GB', courseLead: 'Jose Siqueira', leadEmail: 'Jose.Siqueira@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB530', title: 'MARKETING MANAGEMENT', school: 'Business', subject: 'GB', courseLead: 'Blake Escudier', leadEmail: 'BEscudier@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB531', title: 'Advertising', school: 'Business', subject: 'GB', courseLead: 'Blake Escudier', leadEmail: 'BEscudier@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB532', title: 'Marketing Research', school: 'Business', subject: 'GB', courseLead: 'Nazly Nardi', leadEmail: 'NNardi@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB533', title: 'Salesforce Management', school: 'Business', subject: 'GB', courseLead: 'Jason Abate', leadEmail: 'JAbate@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB534', title: 'Consumer Behavior', school: 'Business', subject: 'GB', courseLead: 'Blake Escudier', leadEmail: 'BEscudier@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB540', title: 'ECONOMICS FOR GLOBAL DECISION MAKERS', school: 'Business', subject: 'GB', courseLead: 'Tilahun Ayanou', leadEmail: 'TAyanou@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'GB541', title: 'Employment Law', school: 'Business', subject: 'GB', courseLead: 'Jack T. McCann', leadEmail: 'JMcCann@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB542', title: 'Training and Development', school: 'Business', subject: 'GB', courseLead: 'Susan Pettine', leadEmail: 'spettine@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB545', title: 'Strategic Reward Systems', school: 'Business', subject: 'GB', courseLead: 'Jack T. McCann', leadEmail: 'JMcCann@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB546', title: 'Recruitment and Selection', school: 'Business', subject: 'GB', courseLead: 'Jack T. McCann', leadEmail: 'JMcCann@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB550', title: 'FINANCIAL MANAGEMENT', school: 'Business', subject: 'GB', courseLead: 'Vilma Edginton', leadEmail: 'vedginton@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB560', title: 'Designing, Improving, and Implementing Processes', school: 'Business', subject: 'GB', courseLead: 'Simon Cleveland', leadEmail: 'Simon.Cleveland@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'GB570', title: 'Managing the Value Chain', school: 'Business', subject: 'GB', courseLead: 'Sean Doyle', leadEmail: 'SDoyle2@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'GB580', title: 'STRATEGIC MANAGEMENT', school: 'Business', subject: 'GB', courseLead: 'Sean Doyle', leadEmail: 'SDoyle2@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'GB590', title: 'Ethics in Business and Society', school: 'Business', subject: 'GB', courseLead: 'John Kuhn', leadEmail: 'JKuhn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GB600', title: 'Leadership Strategies for a Changing World', school: 'Business', subject: 'GB', courseLead: 'William Quisenberry', leadEmail: 'WQuisenberry@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'GB601', title: 'MBA Capstone', school: 'Business', subject: 'GB', courseLead: 'Blake Escudier', leadEmail: 'BEscudier@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },

  // Business - Grad Finance (GF)
  { id: 'GF500', title: 'Financial Institutions and Markets', school: 'Business', subject: 'GF', courseLead: 'William Hahn', leadEmail: 'WHahn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF510', title: 'Risk Analysis and Management', school: 'Business', subject: 'GF', courseLead: 'Heather Dana', leadEmail: 'HDana@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF520', title: 'Corporate Finance', school: 'Business', subject: 'GF', courseLead: 'Heather Dana', leadEmail: 'HDana@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF530', title: 'Financial Statement Analysis', school: 'Business', subject: 'GF', courseLead: 'Heather Dana', leadEmail: 'HDana@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF540', title: 'Investment and Securities Analysis', school: 'Business', subject: 'GF', courseLead: 'Heather Dana', leadEmail: 'HDana@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF550', title: 'Retirement Planning', school: 'Business', subject: 'GF', courseLead: 'Denise Schoenherr', leadEmail: 'DSchoenherr@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF561', title: 'Derivatives and Hedging', school: 'Business', subject: 'GF', courseLead: 'Geoffrey Vanderpal', leadEmail: 'GVanderpal@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF570', title: 'PORTFOLIO MANAGEMENT', school: 'Business', subject: 'GF', courseLead: 'Geoffrey Vanderpal', leadEmail: 'GVanderpal@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF581', title: 'FINANCIAL STRATEGIES FOR A GLOBAL ENVIRONMENT', school: 'Business', subject: 'GF', courseLead: 'Vilma Edginton', leadEmail: 'vedginton@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF582', title: 'STATISTICAL METHODS FOR DECISION MAKING', school: 'Business', subject: 'GF', courseLead: 'Vilma Edginton', leadEmail: 'vedginton@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF583', title: 'Treasury Management I', school: 'Business', subject: 'GF', courseLead: 'Geoffrey Vanderpal', leadEmail: 'GVanderpal@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF584', title: 'Treasury Management II', school: 'Business', subject: 'GF', courseLead: 'Geoffrey Vanderpal', leadEmail: 'GVanderpal@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF590', title: 'PERSONAL FINANCIAL PLANNING', school: 'Business', subject: 'GF', courseLead: 'Denise Schoenherr', leadEmail: 'DSchoenherr@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF591', title: 'INDIVIDUAL INSURANCE PLANNING', school: 'Business', subject: 'GF', courseLead: 'Denise Schoenherr', leadEmail: 'DSchoenherr@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF592', title: 'INCOME TAX PLANNING AND STRATEGIES', school: 'Business', subject: 'GF', courseLead: 'Denise Schoenherr', leadEmail: 'DSchoenherr@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF593', title: 'Estate Planning', school: 'Business', subject: 'GF', courseLead: 'Denise Schoenherr', leadEmail: 'DSchoenherr@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'GF599', title: 'GRADUATE CAPSTONE IN FINANCE', school: 'Business', subject: 'GF', courseLead: 'Heather Dana', leadEmail: 'HDana@purdueglobal.edu', deptChair: 'Rebecca Herman' },

  // Business - HR
  { id: 'HR400', title: 'EMPLOYMENT AND STAFFING', school: 'Business', subject: 'HR', courseLead: 'Carrie Stringham', leadEmail: 'CStringham@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'HR410', title: 'EMPLOYEE TRAINING AND DEVELOPMENT', school: 'Business', subject: 'HR', courseLead: 'Robert Freeborough', leadEmail: 'RFreeborough@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'HR420', title: 'EMPLOYMENT LAW', school: 'Business', subject: 'HR', courseLead: 'Carrie Stringham', leadEmail: 'CStringham@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'HR435', title: 'COMPENSATION', school: 'Business', subject: 'HR', courseLead: 'Robert Freeborough', leadEmail: 'RFreeborough@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'HR485', title: 'Strategic Human Resource Management', school: 'Business', subject: 'HR', courseLead: 'Robert Freeborough', leadEmail: 'RFreeborough@purdueglobal.edu', deptChair: 'Rebecca Herman' },

  // Information Technology - IN (Info Systems)
  { id: 'IN150', title: 'Foundations for Success in Information Technology (IT) Careers', school: 'Information Technology', subject: 'IN', courseLead: 'Carol Edwards-Walcott', leadEmail: 'CEdwardsWalcott@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'IN200', title: 'Data Governance - Policy and Ethics', school: 'Information Technology', subject: 'IN', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN203', title: 'Networking With Microsoft Technologies', school: 'Information Technology', subject: 'IN', courseLead: 'Mario Booker', leadEmail: 'Mario.Booker@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN205', title: 'Routing and Switching I', school: 'Information Technology', subject: 'IN', courseLead: 'Mario Booker', leadEmail: 'Mario.Booker@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN206', title: 'Routing and Switching II', school: 'Information Technology', subject: 'IN', courseLead: 'Mario Booker', leadEmail: 'Mario.Booker@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN207', title: 'Penetration Testing Fundamentals', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN208', title: 'Introduction to Critical Infrastructure', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN209', title: 'Cyber Practice I', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN210', title: 'Cyber Practice II', school: 'Information Technology', subject: 'IN', courseLead: 'Jay S. Blatt', leadEmail: 'JBlatt@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN212', title: 'Offensive and Defensive Concepts in Cybersecurity', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN220', title: 'Help Desk Support I', school: 'Information Technology', subject: 'IN', courseLead: 'Marjorie Furay', leadEmail: 'Marjorie.Furay@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN221', title: 'Help Desk Support II', school: 'Information Technology', subject: 'IN', courseLead: 'Marjorie Furay', leadEmail: 'Marjorie.Furay@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN222', title: 'Help Desk Support III', school: 'Information Technology', subject: 'IN', courseLead: 'Marjorie Furay', leadEmail: 'Marjorie.Furay@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN223', title: 'Data Analytics and Decision-Making', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN224', title: 'Relational Databases', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN225', title: 'Modifying and Sharing Data for Decision-Making', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN226', title: 'Programming and Data and Ways to Share Data', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN230', title: 'Starting the User Experience (UX) Design Process', school: 'Information Technology', subject: 'IN', courseLead: 'Todd Thompson', leadEmail: 'Todd.Thompson@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN231', title: 'Researching, Testing, and Prototyping UX Designs', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN232', title: 'Creating High-Fidelity Designs and Prototypes', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN233', title: 'Creating a Responsive and Socially Aware Web Design', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN240', title: 'Game Design and Mechanics', school: 'Information Technology', subject: 'IN', courseLead: 'Stephen Beyer', leadEmail: 'SBeyer@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN241', title: 'Game Programming', school: 'Information Technology', subject: 'IN', courseLead: 'Stephen Beyer', leadEmail: 'SBeyer@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN242', title: 'Game Art and Animation', school: 'Information Technology', subject: 'IN', courseLead: 'Stephen Beyer', leadEmail: 'SBeyer@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN250', title: 'Software Development Concepts Using Python', school: 'Information Technology', subject: 'IN', courseLead: 'Jason Litz', leadEmail: 'JLitz@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN251', title: 'Software Development Concepts Using C#', school: 'Information Technology', subject: 'IN', courseLead: 'Jason Litz', leadEmail: 'JLitz@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN252', title: 'Software Development Concepts Using Java', school: 'Information Technology', subject: 'IN', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN253', title: 'Software Development Concepts Using JavaScript and PHP', school: 'Information Technology', subject: 'IN', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN254', title: 'Software Design and Development Concepts Using Python', school: 'Information Technology', subject: 'IN', courseLead: 'Jason Litz', leadEmail: 'JLitz@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN255', title: 'Software Design and Development Concepts Using C#', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN256', title: 'Software Design and Development Concepts Using Java', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN257', title: 'Software Design and Development Concepts Using JavaScript and PHP', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN260', title: 'Introduction to Agribusiness', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN300', title: 'Programming for Data Analysis (Python, R, and Java)', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN301', title: 'Securing Data', school: 'Information Technology', subject: 'IN', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN302', title: 'Reporting and Visualization', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN303', title: 'Data Mining and Data Warehousing', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN304', title: 'Advanced Programming for Data Analysis', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN311', title: 'Data Analytics in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN312', title: 'Data Analytics in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN313', title: 'Data Analytics in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN314', title: 'Data Analytics in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN315', title: 'Computer Architecture', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN317', title: 'Compilers', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN331', title: 'UX Design in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN332', title: 'UX Design in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN333', title: 'UX Design in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN334', title: 'UX Design in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN341', title: 'IT Support in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN342', title: 'IT Support in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN343', title: 'IT Support in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN344', title: 'IT Support in Action', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IN350', title: 'Advanced Software Development Including Web and Mobility Using Python', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN351', title: 'Advanced Software Development Including Web and Mobility Using C#', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN352', title: 'Advanced Software Development Using Java', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN353', title: 'Advanced Software Development Including Web and Mobility Using JavaScript and PHP', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN400', title: 'Artificial Intelligence (AI) - Deep Learning and Machine Learning', school: 'Information Technology', subject: 'IN', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN401', title: 'Data Curation Concepts', school: 'Information Technology', subject: 'IN', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN402', title: 'Modeling and Predictive Analysis', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN403', title: 'Deep Learning and Artificial Intelligence', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN404', title: 'Machine Learning', school: 'Information Technology', subject: 'IN', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN405', title: 'Blockchain, Cryptography, and Hashgraph', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN406', title: 'Business Intelligence', school: 'Information Technology', subject: 'IN', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN450', title: 'Advanced Software Development Using Python', school: 'Information Technology', subject: 'IN', courseLead: 'Stephen Beyer', leadEmail: 'SBeyer@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN451', title: 'Advanced Software Development Using C#', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN452', title: 'Advanced Software Development Using Java', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN453', title: 'Advanced Software Development Using JavaScript and PHP', school: 'Information Technology', subject: 'IN', courseLead: 'Stephen Beyer', leadEmail: 'SBeyer@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN489', title: "Bachelor's-Level Analytics Internship", school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IN498', title: "Bachelor's Capstone in Analytics", school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN500', title: 'Survey of Modern Data Analytics', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN501', title: 'Fundamentals of Computer Programming', school: 'Information Technology', subject: 'IN', courseLead: 'Jason Litz', leadEmail: 'JLitz@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN502', title: 'Python Statistical Tools', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN503', title: 'Introduction to Machine Learning', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN504', title: 'Advanced Applications of Python', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN505', title: 'Security for Analytics', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN506', title: 'Data Visualization and Knowledge Representation', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN507', title: 'Data Curation', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN508', title: 'Advanced Machine Learning and Artificial Intelligence', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN509', title: 'Advanced Deep Learning', school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN510', title: 'Secure Software Design', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN511', title: 'Secure Coding', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN512', title: 'Advanced Secure Coding', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN513', title: 'System and Security Testing', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN514', title: 'Secure Development and Operations - SecDevOps', school: 'Information Technology', subject: 'IN', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN515', title: 'AWS Academy Cloud Foundations', school: 'Information Technology', subject: 'IN', courseLead: 'Scott Mensch', leadEmail: 'Scott.Mensch@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN516', title: 'AWS Academy Cloud Architecting', school: 'Information Technology', subject: 'IN', courseLead: 'Scott Mensch', leadEmail: 'Scott.Mensch@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN517', title: 'AWS Academy Cloud Developing', school: 'Information Technology', subject: 'IN', courseLead: 'Mario Booker', leadEmail: 'Mario.Booker@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN518', title: 'AWS Academy Data Analytics Lab', school: 'Information Technology', subject: 'IN', courseLead: 'Art Sedighi', leadEmail: 'Art.Sedighi@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN519', title: 'AWS Academy Cloud Operations', school: 'Information Technology', subject: 'IN', courseLead: 'Art Sedighi', leadEmail: 'Art.Sedighi@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN520', title: 'Foundations of Software Quality Assurance', school: 'Information Technology', subject: 'IN', courseLead: 'Shaila Rana', leadEmail: 'Shaila.Rana@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN521', title: 'Advanced Techniques in Software Quality Assurance and Security', school: 'Information Technology', subject: 'IN', courseLead: 'Shaila Rana', leadEmail: 'Shaila.Rana@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN522', title: 'Introduction to Artificial Intelligence I', school: 'Information Technology', subject: 'IN', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN523', title: 'Introduction to Artificial Intelligence II', school: 'Information Technology', subject: 'IN', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN525', title: 'Applied Mathematics for Data Science', school: 'Information Technology', subject: 'IN', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IN530', title: 'Introduction to Blockchain', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN531', title: 'Blockchain Technologies and Applications', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN532', title: 'Blockchain Application Development (dApps)', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IN554', title: 'Introduction to Critical Infrastructure Security', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN555', title: 'Statistics for the IT Professional', school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IN560', title: 'Open Source Operating System Administration', school: 'Information Technology', subject: 'IN', courseLead: ' ', leadEmail: ' ', deptChair: 'Jay S. Blatt' },
  { id: 'IN561', title: 'Cloud Computing', school: 'Information Technology', subject: 'IN', courseLead: 'Scott Mensch', leadEmail: 'Scott.Mensch@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IN562', title: 'Cyber Threat Intelligence', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN563', title: 'Secure Supply Chain', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN564', title: 'Critical Infrastructure Sector Security', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN565', title: 'Critical Urban Infrastructure Security', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN569', title: 'Global Cyber Defense', school: 'Information Technology', subject: 'IN', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN596', title: "Master's-Level Data Analytics Internship I", school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IN597', title: "Master's-Level Data Analytics Internship II", school: 'Information Technology', subject: 'IN', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IN598', title: 'Applied Experiential Learning', school: 'Information Technology', subject: 'IN', courseLead: 'Jean Kotsiovos', leadEmail: 'JKotsiovos@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IN599', title: "Master's Capstone in Data Analytics", school: 'Information Technology', subject: 'IN', courseLead: 'Deanne Larson', leadEmail: 'DLarson@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  
  // Information Technology - IT
  { id: 'IT104', title: 'Introduction to Cybersecurity', school: 'Information Technology', subject: 'IT', courseLead: 'Randy Stauber', leadEmail: 'Randy.Stauber@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT117', title: 'Website Development', school: 'Information Technology', subject: 'IT', courseLead: 'Kathi Nicholson', leadEmail: 'KNicholson2@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT133', title: 'Microsoft Office Applications on Demand', school: 'Information Technology', subject: 'IT', courseLead: 'Noel Broman', leadEmail: 'NBroman@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT153', title: 'SPREADSHEET APPLICATIONS', school: 'Information Technology', subject: 'IT', courseLead: 'Carol Edwards', leadEmail: 'cedwardswalcott@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'IT163', title: 'Database Concepts Using Microsoft Access', school: 'Information Technology', subject: 'IT', courseLead: 'Kathi Nicholson', leadEmail: 'KNicholson2@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT190', title: 'Information Technology Concepts', school: 'Information Technology', subject: 'IT', courseLead: 'Jeffrey McDonough', leadEmail: 'JMcDonough2@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'IT200', title: 'Software Engineering', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Beyer', leadEmail: 'SBeyer@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT213', title: 'Software Development Concepts', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IT214', title: 'Website Implementation', school: 'Information Technology', subject: 'IT', courseLead: 'Kathi Nicholson', leadEmail: 'KNicholson2@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT222', title: 'Introduction to Cloud Computing', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT227', title: 'Cloud Infrastructure Administration', school: 'Information Technology', subject: 'IT', courseLead: 'Art Sedighi', leadEmail: 'Art.Sedighi@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT232', title: 'Software Design and Development Concepts', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IT234', title: 'Database Concepts', school: 'Information Technology', subject: 'IT', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT244', title: 'Python Programming', school: 'Information Technology', subject: 'IT', courseLead: 'Jason Litz', leadEmail: 'JLitz@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT247', title: 'Web Programming with JavaScript and PHP', school: 'Information Technology', subject: 'IT', courseLead: 'Kathi Nicholson', leadEmail: 'KNicholson2@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT262', title: 'Certified Ethical Hacking I', school: 'Information Technology', subject: 'IT', courseLead: 'Randy Stauber', leadEmail: 'Randy.Stauber@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT273', title: 'Networking Concepts', school: 'Information Technology', subject: 'IT', courseLead: 'MSmith', leadEmail: 'matthew.smith@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT275', title: 'Linux System Administration', school: 'Information Technology', subject: 'IT', courseLead: 'Darryl Togashi', leadEmail: 'Darryl.Togashi@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT277', title: 'Certified Information Systems Security Professional I', school: 'Information Technology', subject: 'IT', courseLead: 'Kevin Moline', leadEmail: 'Kevin.Moline@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT278', title: 'Windows Administration', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT279', title: 'Certified Information Systems Security Professional II', school: 'Information Technology', subject: 'IT', courseLead: 'Kevin Moline', leadEmail: 'Kevin.Moline@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT286', title: 'Network Security Concepts', school: 'Information Technology', subject: 'IT', courseLead: 'Noel Broman', leadEmail: 'NBroman@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT296', title: "Associate's-Level Information Technology Internship", school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT299', title: 'IT Integrative Project', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT301', title: 'Project Management I', school: 'Information Technology', subject: 'IT', courseLead: 'Jodi Wisor', leadEmail: 'JWisor@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'IT302', title: 'HUMAN COMPUTER INTERACTION', school: 'Information Technology', subject: 'IT', courseLead: 'Kathi Nicholson', leadEmail: 'KNicholson2@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT303', title: 'Cloud Architecture Concepts and Design', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT304', title: 'Application Development and Scripting in the Cloud', school: 'Information Technology', subject: 'IT', courseLead: 'Scott Mensch', leadEmail: 'Scott.Mensch@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT306', title: 'Cloud Services Management', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT310', title: 'Data Structures and Algorithms', school: 'Information Technology', subject: 'IT', courseLead: 'Chenyao Zhang', leadEmail: 'Chenyao.Zhang@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT316', title: 'COMPUTER FORENSICS', school: 'Information Technology', subject: 'IT', courseLead: 'Donald McCracken', leadEmail: 'DMcCracken@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT320', title: 'Operating Systems', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IT331', title: 'Technology Infrastructure', school: 'Information Technology', subject: 'IT', courseLead: 'Noel Broman', leadEmail: 'NBroman@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT332', title: 'Principles of Information Systems Architecture', school: 'Information Technology', subject: 'IT', courseLead: 'Noel Broman', leadEmail: 'NBroman@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT333', title: 'Emerging Technologies and the Future', school: 'Information Technology', subject: 'IT', courseLead: 'Gustavo Gomez', leadEmail: 'GGomez@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'IT350', title: 'Advanced Database Concepts', school: 'Information Technology', subject: 'IT', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT374', title: 'Linux Security', school: 'Information Technology', subject: 'IT', courseLead: 'Sean Van De Voorde', leadEmail: 'Sean.VanDeVoorde@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT375', title: 'WINDOWS ENTERPRISE ADMINISTRATION', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT390', title: 'INTRUSION DETECTION AND INCIDENT RESPONSE', school: 'Information Technology', subject: 'IT', courseLead: 'Donald McCracken', leadEmail: 'DMcCracken@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT391', title: 'ADVANCED SOFTWARE DEVELOPMENT INCLUDING WEB AND MOBILITY', school: 'Information Technology', subject: 'IT', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT395', title: 'Certified Ethical Hacking II', school: 'Information Technology', subject: 'IT', courseLead: 'Randy Stauber', leadEmail: 'Randy.Stauber@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT400', title: 'Ethics in Cybersecurity', school: 'Information Technology', subject: 'IT', courseLead: 'MSmith', leadEmail: 'matthew.smith@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT401', title: 'Project Management II', school: 'Information Technology', subject: 'IT', courseLead: 'Jodi Wisor', leadEmail: 'JWisor@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'IT402', title: 'IT CONSULTING SKILLS', school: 'Information Technology', subject: 'IT', courseLead: 'Jean Kotsiovos', leadEmail: 'JKotsiovos@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT403', title: 'Cloud Security', school: 'Information Technology', subject: 'IT', courseLead: 'Mario Booker', leadEmail: 'Mario.Booker@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT404', title: 'Advanced Cloud Security', school: 'Information Technology', subject: 'IT', courseLead: 'Art Sedighi', leadEmail: 'Art.Sedighi@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT410', title: 'Certified Information Systems Security Professional III', school: 'Information Technology', subject: 'IT', courseLead: 'Kevin Moline', leadEmail: 'Kevin.Moline@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT411', title: 'Digital Forensics', school: 'Information Technology', subject: 'IT', courseLead: 'Donald McCracken', leadEmail: 'DMcCracken@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT413', title: 'Migrating Data and Applications to the Cloud', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT414', title: 'Software Development Operations in Cloud Environments', school: 'Information Technology', subject: 'IT', courseLead: 'Chris Esquire', leadEmail: 'Chris.Esquire@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT441', title: 'DIRECTED STUDIES, SCHOOL OF INFORMATION TECHNOLOGY', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT442', title: 'DIRECTED STUDIES, SCHOOL OF INFORMATION TECHNOLOGY', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT443', title: 'DIRECTED STUDIES, SCHOOL OF INFORMATION TECHNOLOGY', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT444', title: 'DIRECTED STUDIES, SCHOOL OF INFORMATION TECHNOLOGY', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT445', title: 'DIRECTED STUDIES, SCHOOL OF INFORMATION TECHNOLOGY', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT446', title: 'DIRECTED STUDIES, SCHOOL OF INFORMATION TECHNOLOGY', school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT460', title: 'Systems Analysis and Design', school: 'Information Technology', subject: 'IT', courseLead: 'Jason Litz', leadEmail: 'JLitz@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT469', title: "Bachelor's-Level Cloud Computing and Solutions Internship", school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IT473', title: "Bachelor's Capstone in Cloud Computing and Solutions", school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT479', title: 'BACHELOR’S-LEVEL CYBERSECURITY INTERNSHIP', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IT481', title: 'ADVANCED SOFTWARE DEVELOPMENT', school: 'Information Technology', subject: 'IT', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT484', title: 'Cybersecurity Policies', school: 'Information Technology', subject: 'IT', courseLead: 'Randy Stauber', leadEmail: 'Randy.Stauber@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT488', title: 'Software Product Development Using Agile', school: 'Information Technology', subject: 'IT', courseLead: 'Ahmad Kassem', leadEmail: 'AKassem@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT489', title: 'BACHELOR’S-LEVEL INFORMATION TECHNOLOGY INTERNSHIP', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IT497', title: 'BACHELOR’S CAPSTONE IN CYBERSECURITY', school: 'Information Technology', subject: 'IT', courseLead: 'Dennis Strouble', leadEmail: 'DStrouble@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT499', title: "BACHELOR'S CAPSTONE IN INFORMATION TECHNOLOGY", school: 'Information Technology', subject: 'IT', courseLead: 'Stephen Savage', leadEmail: 'SSavage@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT504', title: 'Managing Information Technology in a Business Environment', school: 'Information Technology', subject: 'IT', courseLead: 'Tamara Fudge', leadEmail: 'TFudge@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT510', title: 'Systems Analysis and Design', school: 'Information Technology', subject: 'IT', courseLead: 'Tamara Fudge', leadEmail: 'TFudge@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT511', title: 'Information Systems Project Management', school: 'Information Technology', subject: 'IT', courseLead: 'Chad McAllister', leadEmail: 'CMcAllister@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'IT513', title: 'Research and Writing for the IT Professional', school: 'Information Technology', subject: 'IT', courseLead: 'Tamara Fudge', leadEmail: 'TFudge@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT521', title: 'DECISION SUPPORT SYSTEMS', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT522', title: 'KNOWLEDGE-BASED MANAGEMENT SYSTEMS', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT523', title: 'Data Warehousing Design and Development', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Stephen Beyer' },
  { id: 'IT525', title: 'Database Design and Data Modeling', school: 'Information Technology', subject: 'IT', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT526', title: 'SQL Query Design', school: 'Information Technology', subject: 'IT', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT527', title: 'Foundations in Data Analytics', school: 'Information Technology', subject: 'IT', courseLead: 'Joseph Kovacic', leadEmail: 'Joseph.Kovacic@purdueglobal.edu', deptChair: 'Stephen Beyer' },
  { id: 'IT528', title: 'Quantitative Risk Analysis', school: 'Information Technology', subject: 'IT', courseLead: 'Jean Kotsiovos', leadEmail: 'JKotsiovos@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT530', title: 'Computer Networks', school: 'Information Technology', subject: 'IT', courseLead: 'Scott Mensch', leadEmail: 'Scott.Mensch@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT535', title: 'Advanced Network Management', school: 'Information Technology', subject: 'IT', courseLead: 'Scott Mensch', leadEmail: 'Scott.Mensch@purdueglobal.edu', deptChair: 'Jay S. Blatt' },
  { id: 'IT537', title: 'Introduction to Cybersecurity', school: 'Information Technology', subject: 'IT', courseLead: 'Nelly Mulleneaux', leadEmail: 'Nelly.Mulleneaux@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT540', title: 'Management of Information Security', school: 'Information Technology', subject: 'IT', courseLead: 'Shaila Rana', leadEmail: 'Shaila.Rana@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT542', title: 'Ethical Hacking and Network Defense', school: 'Information Technology', subject: 'IT', courseLead: 'Shaila Rana', leadEmail: 'Shaila.Rana@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT543', title: 'Cryptography Concepts and Techniques', school: 'Information Technology', subject: 'IT', courseLead: 'Nelly Mulleneaux', leadEmail: 'Nelly.Mulleneaux@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT544', title: 'Platforms, Applications, and Data Security', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Tiffany Laitola' },
  { id: 'IT545', title: 'Wireless, Mobile, and Cloud Security', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Jay S. Blatt' },
  { id: 'IT550', title: 'Computer Forensics and Investigations', school: 'Information Technology', subject: 'IT', courseLead: 'Susan Ferebee', leadEmail: 'SFerebee@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT590', title: 'LEGAL AND ETHICAL ISSUES IN IT', school: 'Information Technology', subject: 'IT', courseLead: 'Tamara Fudge', leadEmail: 'TFudge@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT591', title: 'IT Security Auditing and Assessments', school: 'Information Technology', subject: 'IT', courseLead: 'Shaila Rana', leadEmail: 'Shaila.Rana@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT592', title: 'Financial Decision-Making in IT and Security', school: 'Information Technology', subject: 'IT', courseLead: 'Tamara Fudge', leadEmail: 'TFudge@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT593', title: "Master's-Level Cybersecurity Management Internship I", school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT594', title: "Master's-Level Cybersecurity Management Internship II", school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT595', title: "Master's Capstone in Cybersecurity Management", school: 'Information Technology', subject: 'IT', courseLead: 'Shaila Rana', leadEmail: 'Shaila.Rana@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  { id: 'IT596', title: 'IT GRADUATE CAPSTONE EXTENSION COURSE', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT597', title: "Master's-Level Information Technology Internship I", school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT598', title: 'MASTER’S-LEVEL INFORMATION TECHNOLOGY INTERNSHIP II', school: 'Information Technology', subject: 'IT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'IT599', title: "Master's Capstone in Information Technology", school: 'Information Technology', subject: 'IT', courseLead: 'Jean Kotsiovos', leadEmail: 'JKotsiovos@purdueglobal.edu', deptChair: 'Tiffany Laitola' },
  
  // Business - Management (MT)
  { id: 'MT102', title: 'Principles of Retailing', school: 'Business', subject: 'MT', courseLead: 'Robin Argo', leadEmail: 'RArgo@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT106', title: 'Foundations for Success in Business and Management Careers', school: 'Business', subject: 'MT', courseLead: 'Michelle Reinhardt', leadEmail: 'MReinhardt@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT140', title: 'INTRODUCTION TO MANAGEMENT', school: 'Business', subject: 'MT', courseLead: 'Julie Dort', leadEmail: 'JDort@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT202', title: 'Building Customer Sales and Loyalty', school: 'Business', subject: 'MT', courseLead: 'Jason Abate', leadEmail: 'JAbate@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT203', title: 'Human Resource Management', school: 'Business', subject: 'MT', courseLead: 'Robert Freeborough', leadEmail: 'RFreeborough@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT207', title: 'Starting a Business', school: 'Business', subject: 'MT', courseLead: 'Charles Fail', leadEmail: 'CFail@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT209', title: 'Small Business Management', school: 'Business', subject: 'MT', courseLead: 'Charles Fail', leadEmail: 'CFail@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT217', title: 'Finance', school: 'Business', subject: 'MT', courseLead: 'John Kuhn', leadEmail: 'JKuhn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT219', title: 'Marketing', school: 'Business', subject: 'MT', courseLead: 'MArtin McDermott', leadEmail: 'MMcDermott@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT220', title: 'Global Business', school: 'Business', subject: 'MT', courseLead: 'Charles Fail', leadEmail: 'CFail@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT221', title: 'Customer Service', school: 'Business', subject: 'MT', courseLead: 'Jason Abate', leadEmail: 'JAbate@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT240', title: 'Sports in Society', school: 'Business', subject: 'MT', courseLead: 'John Kuhn', leadEmail: 'JKuhn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT241', title: 'Sports Analytics', school: 'Business', subject: 'MT', courseLead: 'Matthew Lovell', leadEmail: 'Matthew.Lovell@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT242', title: 'Managing Sport Programs', school: 'Business', subject: 'MT', courseLead: 'John Kuhn', leadEmail: 'JKuhn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT243', title: 'Sports Sponsorships and Sales', school: 'Business', subject: 'MT', courseLead: 'Matthew Lovell', leadEmail: 'Matthew.Lovell@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT245', title: 'Project Fundamentals and Project Initiation', school: 'Business', subject: 'MT', courseLead: 'Carol Locker', leadEmail: 'CLocker@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT246', title: 'Project Planning and Project Execution', school: 'Business', subject: 'MT', courseLead: 'Carol Locker', leadEmail: 'CLocker@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT247', title: 'Agile and Scrum Methodologies', school: 'Business', subject: 'MT', courseLead: 'Carol Locker', leadEmail: 'CLocker@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT260', title: 'Group and Organization Dynamics', school: 'Business', subject: 'MT', courseLead: 'Brenda C. Harper', leadEmail: 'BHarper@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT262', title: 'Leading Global Teams', school: 'Business', subject: 'MT', courseLead: 'Nazly Nardi', leadEmail: 'NNardi@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT281', title: 'Fundamentals of Construction Management', school: 'Business', subject: 'MT', courseLead: 'Maryam Mirhadi Fard', leadEmail: 'Maryam.MirhadiFard@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT282', title: 'Construction Methods and Materials', school: 'Business', subject: 'MT', courseLead: 'Maryam Mirhadi Fard', leadEmail: 'Maryam.MirhadiFard@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT297', title: "Associate's Capstone in Small Group Management", school: 'Business', subject: 'MT', courseLead: 'Aaron Hochanadel', leadEmail: 'AHochanadel@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT299', title: "Associate's Capstone in Management", school: 'Business', subject: 'MT', courseLead: 'Aaron Hochanadel', leadEmail: 'AHochanadel@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT300', title: 'Management of Information Systems', school: 'Business', subject: 'MT', courseLead: 'Gustavo Gomez', leadEmail: 'GGomez@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT302', title: 'Organizational Behavior', school: 'Business', subject: 'MT', courseLead: 'Carrie Stringham', leadEmail: 'CStringham@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT304', title: 'Leading the 21st Century Organization', school: 'Business', subject: 'MT', courseLead: 'Sylvia DeAngelo', leadEmail: 'SDeAngelo@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT313', title: 'Corporate Sustainability and Social Responsibility', school: 'Business', subject: 'MT', courseLead: 'Brenda C. Harper', leadEmail: 'BHarper@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT314', title: 'Social Innovation and Entrepreneurship', school: 'Business', subject: 'MT', courseLead: 'Robin Argo', leadEmail: 'RArgo@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT330', title: 'International Marketing and Business Development', school: 'Business', subject: 'MT', courseLead: 'Nazly Nardi', leadEmail: 'NNardi@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT340', title: 'CONFLICT MANAGEMENT AND TEAM DYNAMICS', school: 'Business', subject: 'MT', courseLead: 'Brenda C. Harper', leadEmail: 'BHarper@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT355', title: 'MARKETING RESEARCH', school: 'Business', subject: 'MT', courseLead: 'Kathryn Kelly', leadEmail: 'KKelly3@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT357', title: 'Digital Marketing', school: 'Business', subject: 'MT', courseLead: 'MArtin McDermott', leadEmail: 'MMcDermott@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT358', title: 'Social Media Marketing', school: 'Business', subject: 'MT', courseLead: 'MArtin McDermott', leadEmail: 'MMcDermott@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT359', title: 'Integrated Promotional Communications', school: 'Business', subject: 'MT', courseLead: 'Kathryn Kelly', leadEmail: 'KKelly3@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT361', title: 'Foundations of Real Estate Practice', school: 'Business', subject: 'MT', courseLead: 'Joshua Toledo', leadEmail: 'Joshua.Toledo@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT381', title: 'Construction Planning and Scheduling', school: 'Business', subject: 'MT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'MT382', title: 'Construction Cost Estimating', school: 'Business', subject: 'MT', courseLead: 'Vahid Faghihi', leadEmail: 'Vahid.Faghihi@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT383', title: 'Construction Law', school: 'Business', subject: 'MT', courseLead: '', leadEmail: '', deptChair: 'Kristina Setzekorn' },
  { id: 'MT400', title: 'BUSINESS PROCESS MANAGEMENT', school: 'Business', subject: 'MT', courseLead: 'Mark Busby', leadEmail: 'MBusby@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT421', title: 'FINANCIAL PLANNING', school: 'Business', subject: 'MT', courseLead: 'Edward Strafaci', leadEmail: 'Edward.Strafaci@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT422', title: 'Portfolio Management', school: 'Business', subject: 'MT', courseLead: 'Edward Strafaci', leadEmail: 'Edward.Strafaci@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT423', title: 'ASSET ALLOCATION AND RISK MANAGEMENT', school: 'Business', subject: 'MT', courseLead: 'Edward Strafaci', leadEmail: 'Edward.Strafaci@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT431', title: 'Real Estate Finance and Ethics', school: 'Business', subject: 'MT', courseLead: 'Joshua Toledo', leadEmail: 'Joshua.Toledo@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT432', title: 'Real Estate Law', school: 'Business', subject: 'MT', courseLead: 'Joshua Toledo', leadEmail: 'Joshua.Toledo@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT433', title: 'Global Supply Chain Management', school: 'Business', subject: 'MT', courseLead: 'Christine Shikutwa', leadEmail: 'Christine.Shikutwa@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT434', title: 'Logistics and Distribution Management', school: 'Business', subject: 'MT', courseLead: 'Toney Ferguson', leadEmail: 'TFerguson@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT435', title: 'OPERATIONS MANAGEMENT', school: 'Business', subject: 'MT', courseLead: 'Mark Busby', leadEmail: 'MBusby@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT436', title: 'Purchasing and Supply Chain Management', school: 'Business', subject: 'MT', courseLead: 'Toney Ferguson', leadEmail: 'TFerguson@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT437', title: 'Strategic Warehouse Management', school: 'Business', subject: 'MT', courseLead: 'Toney Ferguson', leadEmail: 'TFerguson@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT438', title: 'Analytics in the Digital Supply Chain', school: 'Business', subject: 'MT', courseLead: 'Toney Ferguson', leadEmail: 'TFerguson@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT445', title: 'Managerial Economics', school: 'Business', subject: 'MT', courseLead: 'Tilahun Ayanou', leadEmail: 'TAyanou@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT450', title: 'Marketing Management', school: 'Business', subject: 'MT', courseLead: 'MArtin McDermott', leadEmail: 'MMcDermott@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT451', title: 'Managing Technological Innovation', school: 'Business', subject: 'MT', courseLead: 'Gustavo Gomez', leadEmail: 'GGomez@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT453', title: 'Professional Selling', school: 'Business', subject: 'MT', courseLead: 'Jason Abate', leadEmail: 'JAbate@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT455', title: 'Strategic Management of Sales', school: 'Business', subject: 'MT', courseLead: 'Jason Abate', leadEmail: 'JAbate@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT459', title: 'CONSUMER BEHAVIOR', school: 'Business', subject: 'MT', courseLead: 'Blake Escudier', leadEmail: 'BEscudier@purdueglobal.edu', deptChair: 'Cathy Hochanadel' },
  { id: 'MT460', title: 'Management Policy and Strategy', school: 'Business', subject: 'MT', courseLead: 'Ernest Norris', leadEmail: 'ENorris@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT475', title: 'QUALITY MANAGEMENT', school: 'Business', subject: 'MT', courseLead: 'Ernest Norris', leadEmail: 'ENorris@purdueglobal.edu', deptChair: 'Kristina Setzekorn' },
  { id: 'MT480', title: 'CORPORATE FINANCE', school: 'Business', subject: 'MT', courseLead: 'William Hahn', leadEmail: 'WHahn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT481', title: 'FINANCIAL MARKETS', school: 'Business', subject: 'MT', courseLead: 'Edward Strafaci', leadEmail: 'Edward.Strafaci@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT482', title: 'FINANCIAL STATEMENT ANALYSIS', school: 'Business', subject: 'MT', courseLead: 'William Hahn', leadEmail: 'WHahn@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT483', title: 'INVESTMENTS', school: 'Business', subject: 'MT', courseLead: 'Edward Strafaci', leadEmail: 'Edward.Strafaci@purdueglobal.edu', deptChair: 'Rebecca Herman' },
  { id: 'MT497', title: "Bachelor's Capstone in Organizational Management", school: 'Business', subject: 'MT', courseLead: 'Joyce Boone', leadEmail: 'JBoone@purdueglobal.edu', deptChair: 'Laurie Millam' },
  { id: 'MT499', title: "Bachelor's Capstone in Management", school: 'Business', subject: 'MT', courseLead: 'Brenda Harper', leadEmail: 'bharper@purdueglobal.edu', deptChair: 'Rebecca Herman' }
];

// Process the raw data: 
// 1. Filter to only allowed subjects
// 2. Map and generate usage/program data
export const courses: Course[] = rawCourses
  .filter(c => ['AC', 'GB', 'GF', 'HR', 'IN', 'IT', 'MT', 'BU'].includes(c.subject))
  .map(c => {
    const { programs, count } = generateProgramsAndUsage(c.id, c.subject);
    const role = getRole(c.id);
    
    // Relevance Logic:
    // High: Core courses (by ID) or courses used in 6+ programs (Main Degree / Common Core)
    // Medium: Used in multiple concentrations (2-5 programs)
    // Low: Used in 1 or fewer programs (Single Elective)
    let relevanceScore: 'High' | 'Medium' | 'Low' = 'Low';
    
    if (role === 'Core' || count >= 6) {
        relevanceScore = 'High';
    } else if (count >= 2) {
        relevanceScore = 'Medium';
    } else {
        relevanceScore = 'Low';
    }

    return {
      ...c,
      school: c.school as 'Business' | 'Information Technology',
      level: (parseInt(c.id.replace(/\D/g, '')) >= 500 ? 'Graduate' : 'Undergraduate') as 'Graduate' | 'Undergraduate',
      programs: programs,
      usageCount: count,
      role: role,
      relevanceScore: relevanceScore,
      relevanceNotes: relevanceScore === 'High' ? 'Critical Degree Requirement' : (relevanceScore === 'Medium' ? 'Multi-Concentration Requirement' : 'Single Elective / Niche'),
      topics: [c.title.split(' ')[0]] 
    };
  });
