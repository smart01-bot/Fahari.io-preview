/* Synthetic, deliberately local-only Fahari demonstration state. */
(function (scope) {
  'use strict';
  const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  const REVENUE = [15000000, 18000000, 22000000, 20000000, 25000000, 28000000];
  const EXPENSES = [8000000, 9000000, 11000000, 10000000, 12000000, 14000000];
  const TYPES = ['VAT', 'PAYE', 'SDL', 'WHT'];
  const REF = [
    {id:'VAT-2403',type:'VAT',period:'March 2024',amount:2850000,status:'draft',due:'2024-03-20'},
    {id:'VAT-2402',type:'VAT',period:'February 2024',amount:3200000,status:'submitted',due:'2024-02-20'},
    {id:'VAT-2401',type:'VAT',period:'January 2024',amount:2800000,status:'approved',due:'2024-01-20'},
    {id:'PAYE-2403',type:'PAYE',period:'March 2024',amount:1280000,status:'draft',due:'2024-03-15'},
    {id:'PAYE-2402',type:'PAYE',period:'February 2024',amount:1350000,status:'submitted',due:'2024-02-15'},
    {id:'SDL-24Q1',type:'SDL',period:'Q1 2024',amount:890000,status:'draft',due:'2024-03-25'},
    {id:'SDL-23Q4',type:'SDL',period:'Q4 2023',amount:820000,status:'approved',due:'2023-12-25'},
    {id:'WHT-2403',type:'WHT',period:'March 2024',amount:680000,status:'draft',due:'2024-03-12'},
    {id:'WHT-2402',type:'WHT',period:'February 2024',amount:750000,status:'submitted',due:'2024-02-12'},
  ];
  const DOCUMENTS = [
    {id:'doc-1',name:'payroll_feb_2024.xlsx',kind:'Excel',size:'2.3 MB',status:'processed',period:'Mar 2024'},
    {id:'doc-2',name:'invoices_q1.csv',kind:'CSV',size:'1.8 MB',status:'processed',period:'Mar 2024'},
    {id:'doc-3',name:'receipts_march.pdf',kind:'PDF',size:'4.1 MB',status:'processed',period:'Mar 2024'},
  ];
  const REPORTS = [
    {id:'RPT-001',name:'Q2 2024 Financial Summary',type:'Financial summary',period:'Q2 2024',date:'2024-07-01'},
    {id:'RPT-002',name:'June 2024 Tax Compliance',type:'Tax compliance',period:'Jun 2024',date:'2024-06-30'},
    {id:'RPT-003',name:'Q2 2024 Cash Flow',type:'Cash flow',period:'Q2 2024',date:'2024-06-28'},
  ];
  const NOTICES = [
    {id:'n1',title:'Example VAT return reminder',text:'Illustrative March 2024 compliance reminder. Not a current filing deadline.',type:'warning',category:'Tax',age:'Sample • 2024',read:false},
    {id:'n2',title:'Document processed',text:'The example invoices_q1.csv document completed sample processing.',type:'success',category:'Documents',age:'Sample • 2024',read:false},
    {id:'n3',title:'Monthly summary ready',text:'Your demonstration Q2 2024 financial summary is ready to review.',type:'info',category:'Reports',age:'Sample • 2024',read:true},
  ];
  const initial = () => ({
    page:'overview', range:'6m', metric:'revenue', returnType:'VAT', returnSearch:'', reportType:'all',
    documentFilter:'all', documentSearch:'', notificationsFilter:'all',
    returns:REF.map(x=>({...x})), documents:DOCUMENTS.map(x=>({...x})), reports:REPORTS.map(x=>({...x})),
    notifications:NOTICES.map(x=>({...x})),
    settings:{business:'Demo MFI',email:'demo@example.com',alerts:true,monthly:true,reminders:true},
    mobileMenu:false, toast:'', modal:null, uploadName:'', uploadType:'', draftId:0,
  });
  const money = (n) => 'TZS ' + Number(n||0).toLocaleString('en-US');
  const compact = (n) => n >= 1e6 ? (n/1e6).toFixed(n%1e6?1:0)+'M' : (n>=1e3?(n/1e3).toFixed(0)+'K':String(n));
  const byType = (returns,type) => returns.filter(r=>r.type===type);
  const unread = n => n.filter(x=>!x.read).length;
  function validateDemoFile({name,size=0,type=''}) {
    const ext = (name.split('.').pop()||'').toLowerCase();
    if(!['csv','xlsx','xls','pdf','png','jpg','jpeg'].includes(ext)) return 'Use CSV, Excel, PDF or image files.';
    if(size>10*1024*1024) return 'Files must be 10 MB or smaller.';
    return null;
  }
  function addDemoDocument(state,{name,size=0,type=''}) {
    const err=validateDemoFile({name,size,type});if(err) return {error:err,state};
    const kind=({csv:'CSV',xlsx:'Excel',xls:'Excel',pdf:'PDF',png:'Image',jpg:'Image',jpeg:'Image'})[name.split('.').pop().toLowerCase()];
    const next={...state,documents:[{id:'demo-'+(state.documents.length+1),name:name.slice(0,120),kind,size:size? (size/1024/1024).toFixed(1)+' MB':'Sample',status:'processed',period:'Demo • local'},...state.documents]};
    return {state:next,error:null};
  }
  function submitReturn(state,id) {
    const item=state.returns.find(x=>x.id===id);
    if(!item || item.status!=='draft') return {state,error:'Only sample drafts can be changed.'};
    return {state:{...state,returns:state.returns.map(r=>r.id===id?{...r,status:'submitted-demo'}:r)},error:null};
  }
  function generateReport(state,type,period) {
    const label=({'financial':'Financial summary','tax':'Tax compliance','cash':'Cash flow'})[type];
    if(!label) return {state,error:'Choose a report type.'};
    const seq=state.reports.length+1;
    const newReport={id:'DEMO-'+String(seq).padStart(3,'0'),name:label+' — '+period+' (demo)',type:label,period,date:'Demo • local'};
    return {state:{...state,reports:[newReport,...state.reports]},report:newReport,error:null};
  }
  const safeText = str => String(str??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const api={MONTHS,REVENUE,EXPENSES,TYPES,initial,money,compact,byType,unread,validateDemoFile,addDemoDocument,submitReturn,generateReport,safeText};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  scope.FahariModel=api;
})(typeof window!=='undefined'?window:globalThis);
