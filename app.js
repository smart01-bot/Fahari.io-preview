/* Fahari.io light preview. UI and state are in-browser and synthetic; never contact an API. */
(() => {
  'use strict';
  const M = window.FahariModel;
  const root = document.getElementById('app');
  let state = M.initial();
  const $ = M.safeText;
  const NAV = [
    {id:'overview',label:'Overview',icon:'layout'},
    {id:'upload',label:'Upload Center',icon:'upload'},
    {id:'returns',label:'Tax Returns',icon:'receipt'},
    {id:'reports',label:'Reports',icon:'chart'},
  ];
  const UTIL = [
    {id:'notifications',label:'Notifications',icon:'bell'},
    {id:'settings',label:'Settings',icon:'settings'},
  ];
  const ICONS = {
    layout:'<rect x="3" y="3" width="7" height="7" rx="1.3"/><rect x="14" y="3" width="7" height="7" rx="1.3"/><rect x="3" y="14" width="7" height="7" rx="1.3"/><rect x="14" y="14" width="7" height="7" rx="1.3"/>',
    upload:'<path d="M12 16V3m0 0-4 4m4-4 4 4"/><path d="M4 16v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4"/>',
    receipt:'<path d="M5 3h14v18l-3-2-4 2-4-2-3 2z"/><path d="M9 8h6M9 12h6"/>',
    chart:'<path d="M4 19V5m0 14h16"/><path d="m7 15 4-4 3 2 5-7"/>',
    bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9z"/><path d="M10 21h4"/>',
    settings:'<circle cx="12" cy="12" r="3"/><path d="m10 2-.5 2.2-2 1-2.1-.8-2 3.4L5 9.5v3L3.4 14l2 3.4 2.1-.8 2 1L10 20h4l.5-2.4 2-1 2.1.8 2-3.4-1.6-1.5v-3L20.6 8l-2-3.4-2.1.8-2-1L14 2z"/>',
    chevron:'<path d="m7 10 5 5 5-5"/>',
    right:'<path d="M5 12h14m-6-6 6 6-6 6"/>',
    external:'<path d="M13 5h6v6m0-6-9 9"/><path d="M19 14v5H5V5h5"/>',
    arrowup:'<path d="m7 17 10-10M8 7h9v9"/>',
    plus:'<path d="M12 5v14M5 12h14"/>',
    file:'<path d="M5 3h9l5 5v13H5z"/><path d="M14 3v6h5M8 14h8M8 17h6"/>',
    check:'<path d="m4 12 5 5L20 6"/>',
    clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    search:'<circle cx="11" cy="11" r="7"/><path d="m16 16 5 5"/>',
    filter:'<path d="M4 6h16M7 12h10M10 18h4"/>',
    menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
    close:'<path d="M5 5 19 19M19 5 5 19"/>',
    refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M5.5 9A7 7 0 0 1 18 7l2 5M4 12l2 5a7 7 0 0 0 12-2"/>',
    download:'<path d="M12 3v13m-4-4 4 4 4-4M4 19v2h16v-2"/>',
    spark:'<path d="m4 18 6-6 4 3 6-9"/>',
    folder:'<path d="M3 6h7l2 2h9v12H3z"/>',
    users:'<circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2"/><path d="M17 6a3 3 0 0 1 0 6m1 4a5 5 0 0 1 3 4"/>',
    shield:'<path d="m12 2 8 4v6c0 5-3.3 8-8 10-4.7-2-8-5-8-10V6z"/><path d="m9 12 2 2 4-4"/>',
    dots:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
    info:'<circle cx="12" cy="12" r="9"/><path d="M12 10v6m0-9v.2"/>',
    lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 1 1 8 0v3"/>',
    calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 3v4M17 3v4M3 10h18"/>',
    alert:'<path d="m12 3 10 18H2z"/><path d="M12 9v5m0 3v.2"/>',
    logout:'<path d="M8 3H4v18h4M13 8l5 4-5 4m5-4H7"/>',
  };
  const icon = (name,size=18) => `<svg class="icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name]||ICONS.info}</svg>`;
  const linkButton = (text,page,kind='') => `<button type="button" class="btn ${kind}" data-page="${page}">${text}${icon('right',16)}</button>`;
  const status=(s)=>`<span class="status status-${$(s)}"><span class="status-dot"></span>${$(s==='submitted-demo'?'Submitted (demo)':s)}</span>`;
  const notice=(message,kind='info')=>`<div class="inline-notice ${kind}">${icon(kind==='warning'?'alert':'info',18)}<span>${message}</span></div>`;
  const formatDate = date=> date?.includes('Demo')?date: String(date||'').replaceAll('-','/');
  const labels={overview:'Overview',upload:'Upload Center',returns:'Tax Returns',reports:'Reports',notifications:'Notifications',settings:'Settings'};
  function sidebar() {
    const nav=(items,section)=>`<div class="nav-section"><p class="side-label">${section}</p>${items.map(item=>`<button data-page="${item.id}" class="nav-item ${state.page===item.id?'selected':''}" ${state.page===item.id?'aria-current="page"':''}>${icon(item.icon,18)}<span>${item.label}</span>${item.id==='notifications'&&M.unread(state.notifications)?`<span class="nav-count">${M.unread(state.notifications)}</span>`:''}</button>`).join('')}</div>`;
    return `<aside class="sidebar ${state.mobileMenu?'open':''}" aria-label="Preview navigation">
      <div class="brand"><div class="brand-logo">f<span class="brand-dot">.</span></div><div class="brand-text">fahari<span>.io</span><small>Business workspace</small></div><button class="mobile-close icon-btn" data-action="menu-close" aria-label="Close menu">${icon('close')}</button></div>
      <div class="workspace-switch"><div class="workspace-avatar">F</div><div class="workspace-name"><strong>${$(state.settings.business)}</strong><span>Demo organisation</span></div>${icon('chevron',15)}</div>
      <nav>${nav(NAV,'WORKSPACE')}${nav(UTIL,'PREFERENCES')}</nav>
      <div class="sidebar-bottom"><div class="side-helper"><div class="side-helper-icon">${icon('shield',17)}</div><strong>Explore safely</strong><p>All data and actions are local demonstrations.</p></div><div class="sidebar-foot"><span class="tiny-dot"></span> Preview environment <span class="foot-version">v1.0</span></div></div>
    </aside>`;
  }
  function topbar(){return `<header class="topbar"><div class="topbar-left"><button class="icon-btn mobile-menu" data-action="menu-open" aria-label="Open navigation">${icon('menu',21)}</button><span class="breadcrumbs">Workspace <span>/</span> <strong>${labels[state.page]}</strong></span></div><div class="topbar-actions"><span class="sample-pill"><span class="sample-pulse"></span> DEMO · 2024 SAMPLE DATA</span><button class="icon-btn notify-btn" title="Notifications" aria-label="Notifications" data-page="notifications">${icon('bell',19)}${M.unread(state.notifications)?'<b class="notify-dot"></b>':''}</button><button class="profile-chip" data-page="settings" aria-label="Open demo settings"><span class="profile-avatar">DA</span><span class="profile-text">Demo Admin<small>Preview account</small></span>${icon('chevron',15)}</button></div></header>`}
  function shell(){return `<div class="app-shell">${sidebar()}${state.mobileMenu?'<div class="menu-scrim" data-action="menu-close"></div>':''}<div class="app-main">${topbar()}<main class="content" id="main-content">${renderPage()}</main><footer class="main-footer"><span>Fahari.io · Independent interactive preview</span><span>Illustrative data only · No backend connected</span></footer></div></div>${state.toast?`<div class="toast" role="status">${icon('check',17)}<span>${$(state.toast)}</span><button aria-label="Dismiss notification" data-action="toast-close">${icon('close',14)}</button></div>`:''}${renderModal()}`;}
  function heading(kicker,title,subtitle,right=''){return `<div class="page-heading"><div><p class="eyebrow">${kicker}</p><h1>${title}</h1><p class="page-subtitle">${subtitle}</p></div>${right?`<div class="heading-actions">${right}</div>`:''}</div>`;}
  function metricTile(label,value,iconName,description,chart,color){return `<div class="metric-tile"><div class="metric-head"><span>${label}</span><span class="metric-icon">${icon(iconName,19)}</span></div><strong>${value}</strong><div class="metric-bottom"><span>${description}</span>${sparkline(chart,color)}</div></div>`;}
  function sparkline(nums,color='#28716e') {
    const min=Math.min(...nums),span=Math.max(...nums)-min||1;
    const path=nums.map((v,i)=>`${i?'L':'M'}${i*12+1} ${30-(v-min)/span*24}`).join(' ');
    return `<svg viewBox="0 0 63 32" class="sparkline" aria-hidden="true"><path d="${path}" stroke="${color}" stroke-width="2.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  function trendsChart(kind=state.metric) {
    const nums=kind==='revenue'?M.REVENUE:kind==='expenses'?M.EXPENSES:M.REVENUE.map((n,i)=>n-M.EXPENSES[i]);
    const max=Math.ceil(Math.max(...M.REVENUE)/5000000)*5000000;
    const W=700,H=248,l=50,r=20,t=15,b=34,w=W-l-r,h=H-t-b;
    const x=i=>l+i*w/5,y=v=>t+h-v/max*h;
    const pts=nums.map((v,i)=>[x(i),y(v)]);const stroke=kind==='expenses'?'#ca8a35':'#1b695e';
    const d=pts.map(([a,b],i)=>`${i?'L':'M'} ${a.toFixed(1)} ${b.toFixed(1)}`).join(' ');
    const fill=`${d} L ${x(5)} ${y(0)} L ${x(0)} ${y(0)} Z`;
    return `<svg class="trend-svg" viewBox="0 0 ${W} ${H}" role="img" aria-label="Illustrative ${kind} January to June 2024: ${nums.map(M.compact).join(', ')} TZS">
    <defs><linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${stroke}" stop-opacity=".16"/><stop offset="1" stop-color="${stroke}" stop-opacity="0"/></linearGradient></defs>
    ${[0,1,2,3,4].map(i=>{const v=i*max/4;return `<line x1="${l}" y1="${y(v)}" x2="${W-r}" y2="${y(v)}" stroke="#e7eceb" stroke-dasharray="4 6"/><text x="${l-12}" y="${y(v)+4}" text-anchor="end" class="chart-axis">${M.compact(v)}</text>`}).join('')}
    <path d="${fill}" fill="url(#chartFill)"/><path d="${d}" fill="none" stroke="${stroke}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    ${pts.map(([a,b],i)=>`<circle cx="${a}" cy="${b}" r="4.5" stroke="${stroke}" fill="white" stroke-width="2.7"><title>${M.MONTHS[i]} 2024: ${M.money(nums[i])}</title></circle>`).join('')}
    ${M.MONTHS.map((m,i)=>`<text x="${x(i)}" y="${H-9}" text-anchor="middle" class="chart-axis">${m}</text>`).join('')}
    </svg>`;
  }
  function overview(){
    const arr=M.REVENUE;const ex=M.EXPENSES;
    return `${heading('BUSINESS OVERVIEW','Your business, at a glance.','A clear view of the records, reports and compliance work in this sample workspace.',`<button class="btn secondary" data-action="reset-confirm">${icon('refresh',16)} Reset demo</button>${linkButton('View reports','reports','primary')}`)}
    ${notice('<strong>Demonstration workspace.</strong> The figures below reproduce illustrative prototype data (2024). They are not live financial or tax records.')}
    <section class="metrics" aria-label="Illustrative key figures">
      ${metricTile('Total portfolio','TZS 45.23M','chart','Illustrative loan portfolio',[26,31,29,35,40,45])}
      ${metricTile('Active loans','128','folder','Sample records',[57,65,78,90,112,128])}
      ${metricTile('Total clients','340','users','Sample directory',[230,248,277,292,321,340])}
      ${metricTile('Pending actions','3','clock','Example workflows',[2,4,1,4,2,3],'#b9873a')}
    </section>
    <section class="overview-layout">
      <div class="panel chart-panel"><div class="panel-head"><div><p class="eyebrow">FINANCIAL SNAPSHOT</p><h2>Performance overview</h2><p>Illustrative January–June 2024 figures</p></div><span class="panel-head-icon">${icon('chart',18)}</span></div><div class="chart-controls"><div class="control-tabs" role="group" aria-label="Chart metric">${[['revenue','Revenue'],['expenses','Expenses'],['profit','Difference']].map(([id,label])=>`<button class="tab ${state.metric===id?'active':''}" data-metric="${id}" aria-pressed="${state.metric===id}">${label}</button>`).join('')}</div><div class="period-tag">Jan – Jun 2024 ${icon('calendar',14)}</div></div>${trendsChart()}<div class="chart-summary"><span class="legend-dot ${state.metric}"></span><strong>${state.metric==='revenue'?'Revenue':state.metric==='expenses'?'Expenses':'Difference'}</strong><span class="legend-note">Sample series, TZS</span></div></div>
      <div class="panel calendar-panel"><div class="panel-head"><div><p class="eyebrow">WORK TO EXPLORE</p><h2>Compliance examples</h2><p>Archived sample periods · not live deadlines</p></div>${icon('calendar',20)}</div><div class="deadline-list">
      ${[{type:'VAT',period:'March 2024',desc:'Value added tax',tone:'sage'}, {type:'PAYE',period:'March 2024',desc:'Payroll tax return',tone:'amber'}, {type:'SDL',period:'Q1 2024',desc:'Skills development levy',tone:'blue'}].map(x=>`<button class="deadline-item" data-returntype="${x.type}"><span class="deadline-mark ${x.tone}">${icon('receipt',17)}</span><span><strong>${x.type}</strong><small>${x.desc}</small></span><span class="deadline-period">${x.period}</span>${icon('right',17)}</button>`).join('')}
      </div><button class="text-link" data-page="returns">Explore tax return examples ${icon('right',16)}</button></div>
    </section>
    <section class="overview-bottom"><div class="panel"><div class="panel-head"><div><p class="eyebrow">ACTIVITY</p><h2>Sample recent activity</h2><p>Illustrative prototype records</p></div><button class="small-action" data-page="upload">View documents ${icon('right',15)}</button></div><div class="activity-list">
      ${[{name:'payroll_feb_2024.xlsx',meta:'Example Excel document · Mar 2024',icon:'file',type:'Processed'}, {name:'Q2 2024 financial summary',meta:'Example report · Jul 2024',icon:'chart',type:'Report'}, {name:'VAT return · February 2024',meta:'Example tax return',icon:'receipt',type:'Submitted'}].map(x=>`<div class="activity-item"><span class="activity-symbol">${icon(x.icon,18)}</span><span class="activity-text"><strong>${x.name}</strong><small>${x.meta}</small></span><span class="activity-type">${x.type}</span></div>`).join('')}
    </div></div><div class="feature-panel"><span class="feature-index">QUICK START · 01</span><div class="feature-graphic">${icon('upload',36)}</div><h2>From documents to better decisions.</h2><p>Explore how a business can bring records together, review its position and prepare sample reporting workflows.</p><button class="feature-link" data-page="upload">Open Upload Center ${icon('right',18)}</button></div></section>`;
  }
  function upload(){
    const docs=state.documents.filter(d=>(state.documentFilter==='all'||d.kind.toLowerCase()===state.documentFilter)&&(!state.documentSearch||d.name.toLowerCase().includes(state.documentSearch.toLowerCase())));
    return `${heading('DOCUMENTS','Upload Center.','Bring together invoices, payroll sheets, and transaction documents in one place.',`<button class="btn secondary" data-page="overview">${icon('right',16)} Overview</button>`)}
    ${notice('This is a <strong>local file-selection simulation</strong>. File contents are never opened, read, uploaded or analysed. Nothing is sent to a server.')}
    <section class="upload-grid"><div class="panel upload-panel"><div class="panel-head"><div><p class="eyebrow">ADD DOCUMENTS</p><h2>Your document workspace</h2><p>Try selecting a file to see the sample workflow.</p></div></div>
    <div class="dropzone" id="dropzone" tabindex="0" role="button" aria-label="Choose a file for local demonstration" data-action="pick-file"><div class="drop-symbol">${icon('upload',29)}</div><h3>Drag & drop a file here</h3><p>Or choose a file from your device</p><span class="drop-button">Choose file ${icon('right',15)}</span><small>CSV, XLS, XLSX, PDF, JPG, PNG · Up to 10 MB</small></div>
    <input type="file" id="demo-file" aria-label="Choose a demo document" accept=".csv,.xlsx,.xls,.pdf,.png,.jpg,.jpeg" hidden>
    <div class="upload-explain">${icon('shield',18)}<span><strong>Privacy-first demo</strong><small>Only your selected file's name and size will appear. It is never sent, inspected or processed.</small></span></div></div>
    <div class="panel file-types"><div class="panel-head"><div><p class="eyebrow">SUPPORTED FORMATS</p><h2>Designed for everyday records</h2></div></div>${[['CSV & Excel','Spreadsheets and sales data','spreadsheet'],['PDF','Statements and invoices','pdf'],['Images','Receipt photographs','image']].map(([name,desc,cls])=>`<div class="file-type"><span class="file-type-symbol ${cls}">${icon('file',19)}</span><div><strong>${name}</strong><p>${desc}</p></div>${icon('check',17)}</div>`).join('')}<div class="helper-note">Fahari’s source app includes backend upload functions. This public preview intentionally disables them.</div></div></section>
    <section class="panel table-panel"><div class="panel-head"><div><p class="eyebrow">DOCUMENT LIBRARY</p><h2>Example files <span class="heading-count">${docs.length}</span></h2><p>Archival examples plus your in-browser selections</p></div><button class="small-action" data-action="demo-upload">${icon('plus',15)} Add sample</button></div><div class="table-tools"><label class="search-field">${icon('search',17)}<input placeholder="Search documents" aria-label="Search documents" id="document-search" value="${$(state.documentSearch)}"></label><label class="select-wrap">${icon('filter',16)}<select id="document-filter" aria-label="Filter document type"><option value="all" ${state.documentFilter==='all'?'selected':''}>All types</option>${[['csv','CSV'],['excel','Excel'],['pdf','PDF'],['image','Image']].map(([val,name])=>`<option value="${val}" ${val===state.documentFilter?'selected':''}>${name}</option>`).join('')}</select></label></div>
    <div class="table-scroll"><table><thead><tr><th>DOCUMENT</th><th>TYPE</th><th>FILE SIZE</th><th>PERIOD</th><th>STATUS</th></tr></thead><tbody>${docs.length?docs.map(d=>`<tr><td><span class="td-file">${icon('file',17)}<strong>${$(d.name)}</strong></span></td><td>${$(d.kind)}</td><td>${$(d.size)}</td><td>${$(d.period)}</td><td>${status(d.status)}</td></tr>`).join(''):`<tr><td colspan="5" class="empty-cell">No documents match your search.</td></tr>`}</tbody></table></div></section>`;
  }
  function returns(){const rows=M.byType(state.returns,state.returnType).filter(r=>r.period.toLowerCase().includes(state.returnSearch.toLowerCase())||r.id.toLowerCase().includes(state.returnSearch.toLowerCase()));const drafts=state.returns.filter(r=>r.status==='draft').length;
    return `${heading('TAX WORKSPACE','Tax Returns.','Review sample tax records and explore a local-only submission workflow.',`<button class="btn secondary" data-page="reports">${icon('chart',16)} Reports</button>`)}${notice('<strong>Historical demo only.</strong> These are 2023–2024 examples from the original UI, not current TRA filing obligations. “Submit” changes only a sample record in your browser.','warning')}
    <section class="small-metrics"><div><span>Total sample returns</span><strong>${state.returns.length}</strong></div><div><span>Local sample drafts</span><strong>${drafts}</strong></div><div><span>Tax categories</span><strong>${M.TYPES.length}</strong></div></section>
    <section class="panel table-panel"><div class="panel-head"><div><p class="eyebrow">RETURN LIBRARY</p><h2>Browse returns</h2><p>Select a category and review its example records.</p></div></div><div class="returns-tabs" role="group" aria-label="Return types">${M.TYPES.map(t=>`<button class="return-tab ${state.returnType===t?'active':''}" aria-pressed="${state.returnType===t}" data-returntype="${t}">${t}</button>`).join('')}</div>
    <div class="table-tools"><label class="search-field">${icon('search',17)}<input id="returns-search" placeholder="Search by period or reference" aria-label="Search tax returns" value="${$(state.returnSearch)}"></label><span class="footnote">${rows.length} entries · Example dataset</span></div>
    <div class="table-scroll"><table><thead><tr><th>RETURN PERIOD</th><th>REFERENCE</th><th>DEMO AMOUNT</th><th>ORIGINAL DUE DATE</th><th>STATE</th><th></th></tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td><strong>${$(r.period)}</strong></td><td class="reference">${$(r.id)}</td><td>${M.money(r.amount)}</td><td>${formatDate(r.due)}</td><td>${status(r.status)}</td><td class="table-action">${r.status==='draft'?`<button class="table-link" data-action="review-return" data-id="${r.id}">Review ${icon('right',15)}</button>`:`<button class="table-link quiet" data-action="view-return" data-id="${r.id}">Details ${icon('right',15)}</button>`}</td></tr>`).join(''):`<tr><td colspan="6" class="empty-cell">No sample returns match.</td></tr>`}</tbody></table></div>
    <div class="table-footer">${icon('lock',15)} No filings, approvals, acknowledgements, or payments are transmitted to TRA or any service.</div></section>
    <section class="info-grid"><article class="info-card">${icon('receipt',22)}<h3>VAT</h3><p>Review example value-added tax records and how drafts are organised.</p></article><article class="info-card">${icon('users',22)}<h3>PAYE & SDL</h3><p>Illustrate payroll-related return categories without implying compliance.</p></article><article class="info-card">${icon('shield',22)}<h3>Withholding tax</h3><p>Explore record states and a clear submission review step.</p></article></section>`;
  }
  function reportBars(){const k=['VAT','PAYE','SDL','Other'];const v=[4.5,3,1.5,1];return `<div class="taxbars">${k.map((x,i)=>`<div class="taxbar"><span>${x}</span><div class="bar-track"><div class="bar-fill color-${i}" style="width:${v[i]*20}%"></div></div><strong>${v[i].toFixed(1)}M</strong></div>`).join('')}</div>`;}
  function reports(){const rows=state.reports.filter(r=>state.reportType==='all'||r.type===state.reportType);return `${heading('ANALYTICS & EXPORTS','Reports.','Explore how Fahari brings financial figures and example documents into one reporting space.',`<button class="btn primary" data-action="open-report-generator">${icon('plus',16)} Create demo report</button>`)}${notice('All chart values and generated reports are <strong>illustrative 2024 samples</strong>. Downloadable previews, if used, are labelled DEMO and are not financial or tax evidence.')}
    <section class="report-grid"><div class="panel"><div class="panel-head"><div><p class="eyebrow">INCOME & EXPENSES</p><h2>Monthly financial trends</h2><p>Jan–Jun 2024 · TZS</p></div><button class="small-action" data-action="download-sample-csv">${icon('download',16)} Demo CSV</button></div><div class="chart-controls"><div class="control-tabs">${[['revenue','Revenue'],['expenses','Expenses'],['profit','Difference']].map(([id,label])=>`<button class="tab ${state.metric===id?'active':''}" data-metric="${id}">${label}</button>`).join('')}</div></div>${trendsChart()}</div><div class="panel"><div class="panel-head"><div><p class="eyebrow">EXAMPLE DISTRIBUTION</p><h2>Tax categories</h2><p>Sample breakdown in TZS millions</p></div></div>${reportBars()}<p class="chart-disclaimer">Sample numbers from the original prototype, not submitted returns or real tax balances.</p></div></section>
    <section class="panel table-panel"><div class="panel-head"><div><p class="eyebrow">GENERATED DOCUMENTS</p><h2>Report history</h2><p>Explore original mock reports or create a local demo record.</p></div></div><div class="table-tools"><label class="select-wrap">${icon('filter',16)}<select id="report-filter" aria-label="Filter reports"><option value="all" ${state.reportType==='all'?'selected':''}>All report types</option>${['Financial summary','Tax compliance','Cash flow'].map(x=>`<option ${state.reportType===x?'selected':''}>${x}</option>`).join('')}</select></label><span class="footnote">${rows.length} sample reports</span></div><div class="table-scroll"><table><thead><tr><th>REPORT</th><th>TYPE</th><th>PERIOD</th><th>CREATED</th><th></th></tr></thead><tbody>${rows.map(r=>`<tr><td><span class="td-file">${icon('file',17)}<strong>${$(r.name)}</strong></span></td><td>${$(r.type)}</td><td>${$(r.period)}</td><td>${$(r.date)}</td><td class="table-action"><button class="table-link" data-action="view-report" data-id="${r.id}">View ${icon('right',15)}</button></td></tr>`).join('')}</tbody></table></div></section>`;}
  function notifications(){const list=state.notifications.filter(n=>state.notificationsFilter==='all'||(state.notificationsFilter==='unread'?!n.read:n.category.toLowerCase()===state.notificationsFilter));return `${heading('WORKSPACE ALERTS','Notifications.','Review sample alerts and manage them without leaving this demonstration.',`<button class="btn secondary" data-action="mark-all-read">${icon('check',16)} Mark all read</button>`)}${notice('The examples below are historical interface fixtures, not real payment confirmations, regulations, or current deadlines.')}
    <section class="panel notification-panel"><div class="returns-tabs">${[['all','All'],['unread','Unread'],['tax','Tax'],['documents','Documents'],['reports','Reports']].map(([id,label])=>`<button class="return-tab ${state.notificationsFilter===id?'active':''}" data-notificationfilter="${id}">${label}</button>`).join('')}</div><div class="notification-list">${list.length?list.map(n=>`<article class="notification-item ${!n.read?'unread':''}"><div class="notification-mark ${n.type}">${icon(n.type==='warning'?'alert':n.type==='success'?'check':'info',20)}</div><div class="notification-body"><div class="notification-top"><h3>${$(n.title)}</h3>${!n.read?'<span class="unread-mark">New</span>':''}</div><p>${$(n.text)}</p><span>${$(n.category)} · ${$(n.age)}</span></div><button class="small-action" data-action="mark-notification" data-id="${n.id}">${n.read?'Mark unread':'Mark read'}</button></article>`).join(''):`<div class="empty-state">${icon('check',28)}<h3>All clear here</h3><p>No sample notifications match this filter.</p></div>`}</div></section>`;}
  function settings(){return `${heading('PREFERENCES','Workspace settings.','Personalise this local demonstration. These preferences are not saved to a server.',`<button class="btn secondary" data-action="reset-confirm">${icon('refresh',16)} Reset demo</button>`)}<section class="settings-grid"><div class="panel settings-panel"><div class="panel-head"><div><p class="eyebrow">ORGANISATION</p><h2>Profile details</h2><p>Change the sample workspace label shown in navigation.</p></div>${icon('users',20)}</div><form id="settings-form" class="settings-form"><label>Demo organisation name<input name="business" id="business-name" maxlength="50" required value="${$(state.settings.business)}" placeholder="Demo MFI"></label><label>Example email<input type="email" name="email" id="business-email" maxlength="100" value="${$(state.settings.email)}" required></label><div class="settings-note">This information remains within the current browser session and does not create a Fahari account.</div><button class="btn primary" type="submit">${icon('check',16)} Save local changes</button></form></div>
    <div class="panel settings-panel"><div class="panel-head"><div><p class="eyebrow">PREFERENCES</p><h2>Notifications & display</h2><p>Preview settings, without an external service.</p></div>${icon('settings',20)}</div><div class="settings-options">${[['alerts','Sample activity notifications','Show local example alerts'],['monthly','Monthly summaries','Enable the example report preference'],['reminders','Return reminders','Sample tax-period reminders only']].map(([key,name,desc])=>`<label class="toggle-row"><span><strong>${name}</strong><small>${desc}</small></span><input type="checkbox" data-setting="${key}" ${state.settings[key]?'checked':''}><span class="switch"></span></label>`).join('')}</div><div class="theme-row"><span><strong>Appearance</strong><small>Fahari portfolio demonstration</small></span><span class="theme-value">${icon('check',16)} Light mode</span></div><div class="settings-note">Public demo mode is deliberately always light, with no login and no access to the original backend.</div></div></section>`;}
  function renderPage(){switch(state.page){case 'upload':return upload();case 'returns':return returns();case 'reports':return reports();case 'notifications':return notifications();case 'settings':return settings();default:return overview();}}
  function renderModal(){if(!state.modal)return '';const m=state.modal;
    let title='',body='',actions='';
    if(m.type==='return'){
      const r=state.returns.find(x=>x.id===m.id);if(!r)return '';
      title='Sample '+r.type+' return';
      body=`<p class="modal-intro">Explore an illustrative return record from the 2024 demo set.</p><dl class="detail-list"><div><dt>Reference</dt><dd>${$(r.id)}</dd></div><div><dt>Period</dt><dd>${$(r.period)}</dd></div><div><dt>Example amount</dt><dd>${M.money(r.amount)}</dd></div><div><dt>Original example due date</dt><dd>${formatDate(r.due)}</dd></div><div><dt>Demo status</dt><dd>${status(r.status)}</dd></div></dl>${notice('No tax returns will be filed, accepted, paid or transmitted. This is only a visual state transition.')}`;
      actions=`<button class="btn secondary" data-action="modal-close">Close</button>${r.status==='draft'?`<button class="btn primary" data-action="submit-return" data-id="${r.id}">${icon('check',16)} Simulate submission</button>`:''}`;
    } else if(m.type==='report'){
      const r=state.reports.find(x=>x.id===m.id);if(!r)return '';
      title='Example report';body=`<p class="modal-intro">This is a simulated report history record, not a generated accounting statement.</p><dl class="detail-list"><div><dt>Report</dt><dd>${$(r.name)}</dd></div><div><dt>Type</dt><dd>${$(r.type)}</dd></div><div><dt>Period</dt><dd>${$(r.period)}</dd></div><div><dt>Created</dt><dd>${$(r.date)}</dd></div></dl>${notice('No real statement, tax return, or financial confirmation is available in this preview.')}`;actions='<button class="btn primary" data-action="modal-close">Close preview</button>';
    }else if(m.type==='generate'){
      title='Create a demo report';body=`<p class="modal-intro">Add a fictional report record to the sample history, without connecting to a service.</p><form id="generator-form" class="modal-form"><label>Report category<select id="generate-type" required><option value="financial">Financial summary</option><option value="tax">Tax compliance</option><option value="cash">Cash flow</option></select></label><label>Sample reporting period<select id="generate-period"><option>Q2 2024</option><option>Jun 2024</option><option>Q1 2024</option></select></label><button type="submit" class="btn primary" style="width:100%;justify-content:center">${icon('plus',17)} Generate demo entry</button></form>`;actions='<button class="btn secondary" data-action="modal-close">Cancel</button>';
    }else if(m.type==='reset'){
      title='Reset this demonstration?';body='<p class="modal-intro">Restore the original sample documents, tax return states, reports, notifications and settings. Changes in this browser session will be cleared.</p>';actions='<button class="btn secondary" data-action="modal-close">Cancel</button><button class="btn danger" data-action="reset-now">Reset demo</button>';
    }
    return `<div class="modal-backdrop" data-action="modal-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="modal-title" class="modal"><header class="modal-head"><span class="modal-symbol">${icon('file',19)}</span><button class="icon-btn" data-action="modal-close" aria-label="Close dialog">${icon('close',20)}</button></header><h2 id="modal-title">${title}</h2>${body}<div class="modal-actions">${actions}</div></section></div>`;
  }
  function showToast(message){state.toast=message; render();}
  function navigate(page){if(!['overview','upload','returns','reports','notifications','settings'].includes(page))return;state.page=page;state.mobileMenu=false;state.modal=null;state.toast='';history.replaceState(null,'',`#${page}`);render();window.scrollTo({top:0,behavior:'instant'});}
  function render(){root.innerHTML=shell();document.body.classList.toggle('modal-active',!!state.modal);}
  function handleAction(action,node){
    if(action==='menu-open'){state.mobileMenu=true;render();return;}
    if(action==='menu-close'){state.mobileMenu=false;render();return;}
    if(action==='modal-close'||action==='modal-backdrop'){if(action==='modal-backdrop'&&node.closest('.modal'))return;state.modal=null;render();return;}
    if(action==='toast-close'){state.toast='';render();return;}
    if(action==='reset-confirm'){state.modal={type:'reset'};render();return;}
    if(action==='reset-now'){state=M.initial();state.toast='Demo restored to its original state.';render();return;}
    if(action==='pick-file'){document.getElementById('demo-file')?.click();return;}
    if(action==='demo-upload'){const name='example_sample_'+(state.documents.length+1)+'.csv';const result=M.addDemoDocument(state,{name,size:12000});state=result.state;showToast('Added a fictional sample file.');return;}
    if(action==='review-return'||action==='view-return'){state.modal={type:'return',id:node.dataset.id};render();return;}
    if(action==='submit-return'){const r=M.submitReturn(state,node.dataset.id);state=r.state;state.modal=null;showToast(r.error||'Return marked “Submitted (demo)” locally. No filing occurred.');return;}
    if(action==='open-report-generator'){state.modal={type:'generate'};render();return;}
    if(action==='view-report'){state.modal={type:'report',id:node.dataset.id};render();return;}
    if(action==='mark-notification'){const id=node.dataset.id;state.notifications=state.notifications.map(n=>n.id===id?{...n,read:!n.read}:n);render();return;}
    if(action==='mark-all-read'){state.notifications=state.notifications.map(n=>({...n,read:true}));showToast('All demo notifications marked as read.');return;}
    if(action==='download-sample-csv'){const rows=[['Fahari.io DEMO ONLY — Jan-Jun 2024 illustrative figures'],['Month','Example revenue TZS','Example expenses TZS'],...M.MONTHS.map((m,i)=>[m+' 2024',M.REVENUE[i],M.EXPENSES[i]])];const csv=rows.map(r=>r.join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='fahari-DEMO-ONLY-2024.csv';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),500);showToast('Downloaded clearly labelled demo CSV.');return;}
  }
  root.addEventListener('click',(e)=>{
    const page=e.target.closest('[data-page]');if(page){navigate(page.dataset.page);return;}
    const metric=e.target.closest('[data-metric]');if(metric){state.metric=metric.dataset.metric;render();return;}
    const rt=e.target.closest('[data-returntype]');if(rt){state.returnType=rt.dataset.returntype;state.returnSearch='';navigate('returns');return;}
    const nt=e.target.closest('[data-notificationfilter]');if(nt){state.notificationsFilter=nt.dataset.notificationfilter;render();return;}
    const btn=e.target.closest('[data-action]');if(btn){handleAction(btn.dataset.action,btn);return;}
  });
  root.addEventListener('submit',(e)=>{
    e.preventDefault();
    if(e.target.id==='settings-form'){
      const name=root.querySelector('#business-name')?.value.trim();const email=root.querySelector('#business-email')?.value.trim();if(!name||!email)return;
      state.settings={...state.settings,business:name,email};showToast('Demo preferences updated locally.');
    }else if(e.target.id==='generator-form'){
      const type=root.querySelector('#generate-type')?.value, period=root.querySelector('#generate-period')?.value;
      const res=M.generateReport(state,type,period);state=res.state;state.modal=null;showToast(res.error||'A fictional report entry was added to your demo history.');
    }
  });
  root.addEventListener('change',(e)=>{
    const t=e.target;
    if(t.id==='demo-file'&&t.files?.length){const file=t.files[0];const result=M.addDemoDocument(state,{name:file.name,size:file.size,type:file.type});state=result.state;showToast(result.error||`Added ${file.name.slice(0,35)} to the local demo list (no upload).`);return;}
    if(t.id==='document-filter'){state.documentFilter=t.value;render();return;}
    if(t.id==='report-filter'){state.reportType=t.value;render();return;}
    if(t.dataset.setting){state.settings[t.dataset.setting]=t.checked;showToast('Local preference updated.');}
  });
  root.addEventListener('input',(e)=>{const t=e.target;
    if(t.id==='document-search'||t.id==='returns-search'){
      const key=t.id==='document-search'?'documentSearch':'returnSearch';state[key]=t.value;
      const start=t.selectionStart;const id=t.id;render();const target=document.getElementById(id);target?.focus();target?.setSelectionRange(start,start);
    }
  });
  root.addEventListener('dragover',e=>{const zone=e.target.closest('#dropzone');if(zone){e.preventDefault();zone.classList.add('dragging');}});
  root.addEventListener('dragleave',e=>{const zone=e.target.closest('#dropzone');if(zone)zone.classList.remove('dragging');});
  root.addEventListener('drop',e=>{const zone=e.target.closest('#dropzone');if(zone){e.preventDefault();const file=e.dataTransfer?.files?.[0];if(file){const res=M.addDemoDocument(state,{name:file.name,size:file.size,type:file.type});state=res.state;showToast(res.error||'Added a file name to the local demo. No bytes were uploaded.');}}});
  root.addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.id==='dropzone'){e.preventDefault();document.getElementById('demo-file')?.click();}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&(state.modal||state.mobileMenu)){state.modal=null;state.mobileMenu=false;render();}});
  window.addEventListener('hashchange',()=>{const page=location.hash.slice(1);if(page!==state.page&&['overview','upload','returns','reports','notifications','settings'].includes(page)){state.page=page;render();}});
  const starting=location.hash.slice(1);if(['overview','upload','returns','reports','notifications','settings'].includes(starting))state.page=starting;
  render();
})();
