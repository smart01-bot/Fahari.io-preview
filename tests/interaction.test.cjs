/* Lightweight synthetic DOM smoke test: renders every route and runs delegated UI handlers. */
const assert = require('node:assert/strict');
const vm = require('node:vm');
const fs = require('node:fs');
const M=require('../model.js');
let html='',handlers={}, urlHash='',bodyClass={};
const root={get innerHTML(){return html},set innerHTML(v){html=v},addEventListener(name,fn){handlers[name]=fn},querySelector(){return null}};
const document={
  getElementById(id){return id==='app'?root:null},
  body:{classList:{toggle(n,v){bodyClass[n]=v}}},
  addEventListener(){},
};
const window={FahariModel:M,scrollTo(){},addEventListener(){}};
const history={replaceState(_,_2,p){urlHash=p}};
const location={hash:''};
vm.runInNewContext(fs.readFileSync(require.resolve('../app.js'),'utf8'),{window,document,history,location,URL,Blob,setTimeout,console});
assert.match(html,/Your business, at a glance\./);
assert.match(html,/DEMO · 2024 SAMPLE DATA/);
assert.ok(!/input[^>]*type=.?password/i.test(html));
const click=(match={})=>handlers.click({target:{closest(selector){const key=selector.slice(1,-1).split('=')[0]; if(selector==='[data-page]'&&match.page)return{dataset:{page:match.page}};if(selector==='[data-metric]'&&match.metric)return {dataset:{metric:match.metric}};if(selector==='[data-returntype]'&&match.returntype)return{dataset:{returntype:match.returntype}};if(selector==='[data-notificationfilter]'&&match.notificationfilter)return{dataset:{notificationfilter:match.notificationfilter}};if(selector==='[data-action]'&&match.action)return{dataset:{action:match.action,id:match.id},closest(){return null}};return null}}});
click({page:'returns'});assert.match(html,/Tax Returns\./);assert.match(urlHash,/#returns/);
click({returntype:'PAYE'});assert.match(html,/PAYE-2403/);assert.doesNotMatch(html,/VAT-2403/);
click({returntype:'VAT'});click({action:'review-return',id:'VAT-2403'});assert.match(html,/role="dialog"/);
click({action:'submit-return',id:'VAT-2403'});assert.match(html,/Submitted \(demo\)/);assert.doesNotMatch(html,/role="dialog"/);
click({page:'reports'});assert.match(html,/Reports\./);click({metric:'expenses'});assert.match(html,/Expenses/);
click({action:'open-report-generator'});assert.match(html,/generator-form/);
click({action:'modal-close'});assert.doesNotMatch(html,/role="dialog"/);
click({page:'upload'});assert.match(html,/Choose file/);click({action:'demo-upload'});assert.match(html,/example_sample_4\.csv/);
click({page:'notifications'});assert.match(html,/Notifications\./);click({action:'mark-all-read'});assert.doesNotMatch(html,/class="nav-count"/);
click({page:'settings'});assert.match(html,/Workspace settings\./);assert.match(html,/Light mode/);
click({action:'reset-confirm'});assert.match(html,/Reset this demonstration/);click({action:'reset-now'});assert.match(html,/Your business, at a glance/);
console.log('Fahari UI rendering and delegated interactions: 18 checks passed.');
