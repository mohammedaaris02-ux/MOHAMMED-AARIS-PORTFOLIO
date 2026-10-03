(() => {
  const form = document.querySelector('#enquiryForm');
  if (!form) return;
  const root = document.querySelector('#projectEnquiry');
  const review = document.querySelector('#enquiryReview');
  const summary = document.querySelector('#enquirySummary');
  const status = document.querySelector('#enquiryStatus');
  const estimate = 'Project scope, pricing, and delivery terms will be discussed during the consultation.';
  let enquiry;
  let finalMessage = '';
  let pdfBusy = false;
  let currentStep = 0;
  let reviewing = false;
  const stepNames = ['Customer Details','Project Type','Website Type','Design / Theme','Features','Pages & Website Setup','Preferred Consultation','Final Notes & Review'];
  const stepSections = [[0],[1],[2],[3],[4],[5,6],[7]];
  const stepKeys = [];
  const stepPanels = [];
  const storageKey = 'hma.projectEnquiry.v1';
  const node = (tag, text, className) => {
    const element = document.createElement(tag);
    if (text) element.textContent = text;
    if (className) element.className = className;
    return element;
  };
  const select = (key, label, options, required = false) => ({key, label, options, required, type: 'select'});
  const input = (key, label, type = 'text', required = false, autocomplete = '') => ({key, label, type, required, autocomplete});
  const notes = (key, label, placeholder) => ({key, label, placeholder, type: 'textarea'});
  const sections = [
    ['Customer Details', [input('name', 'Full Name', 'text', true, 'name'), input('email', 'Email Address', 'email', true, 'email'), input('phone', 'Phone / WhatsApp Number', 'tel', true, 'tel'), input('company', 'Business / Company Name', 'text', false, 'organization'), input('location', 'Location / City', 'text', false, 'address-level2'), notes('customerNotes', 'Customer Notes', 'Preferred contact method or any additional details')]],
    ['Project Type', [select('projectType', 'What would you like to build?', ['Business Website','WordPress Website','E-commerce Website','Portfolio Website','Landing Page','Restaurant Website','Service Website','Web Application','Redesign Existing Website','Custom Project','Not Sure Yet'], true), notes('projectNotes','Project Notes','Tell me more about the project you have in mind')]],
    ['Website Type', [select('websiteType','Choose the website type',['Static Website','Dynamic Website','WordPress / CMS Website','E-commerce Website','Web Application','Landing Page','Not Sure - Help Me Choose'],true), notes('websiteTypeNotes','Website Type Notes','Describe how you want the website to work')]],
    ['Design / Theme', [select('designStyle','Preferred Design Style',['Premium','Modern','Minimal','Corporate','Creative','Dark Theme','Light Theme','Luxury','Clean & Professional','Custom Design','Not Sure']),select('colorStyle','Preferred Color Style',['Dark + Green','Dark + Blue','White + Blue','Black + Gold','Neutral / Minimal','Brand Colors','Custom Colors','Not Sure']),input('referenceUrl','Reference Website URL','url'),notes('designNotes','Design Notes','Describe your preferred design, theme, colors, or reference style')]],
    ['Features', [{key:'features',label:'Required Features',type:'multi',options:['Contact Form','WhatsApp Integration','Email Enquiry','Google Maps','Social Media Links','SEO Setup','Blog','Gallery','Product Catalogue','Shopping Cart','Payment Gateway','Login / Signup','Admin Dashboard','Booking System','Appointment System','Search','Filters','Newsletter','Live Chat','CMS Content Management','Other','Not Sure']},notes('featureNotes','Feature Notes','Tell me any special feature requirements')]],
    ['Pages / Sections', [{key:'pages',label:'Pages / Sections',type:'multi',options:['Home','About','Services','Products','Projects','Portfolio','Gallery','Blog','Contact','FAQ','Booking','Testimonials','Team','Careers','Privacy Policy','Terms & Conditions','Custom Pages']},select('pageCount','Approximate Number of Pages',['1-3','4-6','7-10','10+','Not Sure']),notes('pageNotes','Page Notes','Tell me any custom page or section you need')]],
    ['Website Setup', [select('existingWebsite','Do you already have a website?',['Yes','No','Under Development']),input('websiteUrl','Website URL','url'),select('domainStatus','Do you have a domain?',['Yes','No','Need Help Choosing One']),select('hostingStatus','Do you have hosting?',['Yes','No','Need Hosting Support','Not Sure']),select('brandAssets','Do you have logo / brand assets?',['Yes','No','Need Help With Branding']),notes('setupNotes','Setup Notes','Tell me about your current website, domain, hosting, or branding setup')]],
    ['Preferred Consultation', [input('date','Preferred Consultation Date','date',true),select('time','Preferred Time',['09:00 AM','10:00 AM','11:00 AM','12:00 PM','01:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM'],true),select('mode','Consultation Mode',['Phone Call','WhatsApp Call','Google Meet','Offline Discussion','Any']),notes('appointmentNotes','Appointment Notes','Alternative timing or consultation preference')]]
  ];
  const controls = new Map();
  function field(config) {
    const wrap = node('div', '', 'enquiry-field');
    if (config.type === 'textarea' || config.type === 'multi') wrap.classList.add('enquiry-field-wide');
    const label = node('label', config.label + (config.required ? ' *' : ''));
    const id = 'enquiry-' + config.key;
    label.htmlFor = id;
    wrap.append(label);
    if (config.type === 'multi') {
      const details = node('details', '', 'enquiry-multi');
      const toggle = node('summary', 'Select options');
      toggle.id = id;
      toggle.setAttribute('aria-label', config.label);
      const options = node('div', '', 'enquiry-options');
      config.options.forEach(option => {
        const item = node('label');
        const check = node('input');
        check.type = 'checkbox'; check.name = config.key; check.value = option;
        item.append(check, node('span', option)); options.append(item);
      });
      details.append(toggle, options);
      details.addEventListener('change', () => {
        const count = details.querySelectorAll(':checked').length;
        toggle.textContent = count ? `${count} selected` : 'Select options';
      });
      details.addEventListener('keydown', event => { if (event.key === 'Escape' && details.open) { event.preventDefault(); event.stopPropagation(); details.open = false; toggle.focus(); } });
      wrap.append(details);
      return wrap;
    }
    const control = node(config.type === 'select' ? 'select' : config.type === 'textarea' ? 'textarea' : 'input');
    control.id = id; control.name = config.key; control.required = !!config.required;
    if (config.type === 'select') {
      const empty = node('option', 'Select an option'); empty.value = ''; control.append(empty);
      config.options.forEach(value => { const option = node('option',value); option.value = value; control.append(option); });
    } else if (config.type === 'textarea') {
      control.rows = config.key === 'finalNotes' ? 5 : 3; control.maxLength = 1500;
      control.placeholder = config.placeholder;
    } else {
      control.type = config.type; control.maxLength = 200;
      if (config.autocomplete) control.autocomplete = config.autocomplete;
      if (config.type === 'url') control.placeholder = 'https://example.com';
    }
    const error = node('small', '', 'enquiry-error'); error.id = id + '-error';
    control.setAttribute('aria-describedby', error.id);
    wrap.append(control, error);
    controls.set(config.key, {control, error, wrap, config});
    control.addEventListener('input', () => { if (control.getAttribute('aria-invalid') === 'true') validateField(config.key); });
    return wrap;
  }
  const fieldsRoot = document.querySelector('#enquiryFields');
  stepSections.forEach(indices => {
    const panel = node('div', '', 'enquiry-step');
    const keys = [];
    indices.forEach(index => {
      const [title, fields] = sections[index];
      const group = node('fieldset', '', 'enquiry-group');
      group.append(node('legend', title));
      fields.forEach(config => { group.append(field(config)); if (config.type !== 'multi') keys.push(config.key); });
      if (index === 7) group.append(node('p', 'Preferred Consultation Date & Time. This is a request, not a confirmed appointment.', 'enquiry-hint'));
      panel.append(group);
    });
    stepPanels.push(panel); stepKeys.push(keys); fieldsRoot.append(panel);
  });
  document.querySelector('#enquiryFinalNotes').append(field(notes('finalNotes','Final Project Notes','Share any extra requirements, references, deadlines, questions, or other details')));
  stepPanels.push(document.querySelector('#enquiryFinalNotes'));
  stepKeys.push(['finalNotes']);
  const dayOutput = node('p', '', 'enquiry-hint'); dayOutput.setAttribute('aria-live','polite');
  controls.get('date').wrap.append(dayOutput);
  function tomorrow() {
    const date = new Date(); date.setDate(date.getDate() + 1);
    return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
  }
  const dateValue = value => new Date(value + 'T12:00:00');
  function updateDate() {
    const control = controls.get('date').control; control.min = tomorrow();
    dayOutput.textContent = control.value && Number.isFinite(dateValue(control.value).getTime()) ? dateValue(control.value).toLocaleDateString('en-IN',{weekday:'long'}) : '';
  }
  controls.get('date').control.addEventListener('input', updateDate);
  controls.get('date').control.addEventListener('focus', updateDate);
  updateDate();
  const toggleUrl = () => {
    const {control,wrap,error} = controls.get('websiteUrl');
    const visible = controls.get('existingWebsite').control.value === 'Yes';
    wrap.hidden = !visible; control.disabled = !visible;
    if (!visible) { error.textContent = ''; control.removeAttribute('aria-invalid'); }
  };
  controls.get('existingWebsite').control.addEventListener('change',toggleUrl); toggleUrl();
  function validateField(key) {
    const {control,error,config} = controls.get(key);
    const value = control.value.trim(); let message = '';
    if (!control.disabled) {
      if (config.required && !value) message = `Please ${config.type === 'select' || config.type === 'date' ? 'choose' : 'enter'} ${config.label.toLowerCase()}.`;
      else if (key === 'email' && value && (control.validity.typeMismatch || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))) message = 'Please enter a valid email address.';
      else if (key === 'phone' && value && (!/^[+\d\s().-]+$/.test(value) || value.replace(/\D/g,'').length < 7 || value.replace(/\D/g,'').length > 15)) message = 'Please enter a valid phone number with 7 to 15 digits.';
      else if (config.type === 'url' && value) {
        try { if (!['https:','http:'].includes(new URL(value).protocol)) throw new Error(); } catch { message = 'Please enter a complete http:// or https:// website URL.'; }
      } else if (key === 'date' && value && (!Number.isFinite(dateValue(value).getTime()) || value < tomorrow())) message = 'Please choose a future consultation date.';
      if (!message && control.validity.tooLong) message = 'Please shorten this entry.';
    }
    error.textContent = message; control.setAttribute('aria-invalid', String(!!message));
    return !message;
  }
  function validate(keys = [...controls.keys()]) {
    updateDate(); let firstKey;
    keys.forEach(key => { if (!validateField(key) && !firstKey) firstKey = key; });
    if (firstKey) {
      const step = stepKeys.findIndex(keys => keys.includes(firstKey));
      if (step !== currentStep) showStep(step, false);
      controls.get(firstKey).control.focus(); return false;
    }
    return true;
  }
  function readEnquiry() {
    const data = new FormData(form), value = key => String(data.get(key) || '').trim();
    return {
      customer:{name:value('name'),email:value('email'),phone:value('phone'),company:value('company'),location:value('location'),notes:value('customerNotes')},
      projectType:value('projectType'),projectNotes:value('projectNotes'),websiteType:value('websiteType'),websiteTypeNotes:value('websiteTypeNotes'),
      designStyle:value('designStyle'),colorStyle:value('colorStyle'),referenceUrl:value('referenceUrl'),designNotes:value('designNotes'),
      features:data.getAll('features'),featureNotes:value('featureNotes'),pages:data.getAll('pages'),pageCount:value('pageCount'),pageNotes:value('pageNotes'),
      existingWebsite:value('existingWebsite'),websiteUrl:value('websiteUrl'),domainStatus:value('domainStatus'),hostingStatus:value('hostingStatus'),brandAssets:value('brandAssets'),setupNotes:value('setupNotes'),
      appointment:{date:value('date'),day:dateValue(value('date')).toLocaleDateString('en-IN',{weekday:'long'}),time:value('time'),mode:value('mode'),notes:value('appointmentNotes')},
      finalNotes:value('finalNotes')
    };
  }
  function buildGroups(e) {
    const line = (label,value) => value ? `${label}: ${value}` : '';
    const note = (label,value) => value ? `${label}:\n${value}` : '';
    const list = values => values.length ? values.map(value=>'- '+value).join('\n') : 'Not specified';
    return [
      ['CUSTOMER DETAILS',[line('Name',e.customer.name),line('Email',e.customer.email),line('Phone',e.customer.phone),line('Business',e.customer.company),line('Location',e.customer.location),note('Customer Notes',e.customer.notes)]],
      ['PROJECT TYPE',[e.projectType,note('Project Notes',e.projectNotes)]],
      ['WEBSITE TYPE',[e.websiteType,note('Website Type Notes',e.websiteTypeNotes)]],
      ['DESIGN / THEME',[line('Design',e.designStyle),line('Colors',e.colorStyle),line('Reference Website',e.referenceUrl),note('Design Notes',e.designNotes)]],
      ['REQUIRED FEATURES',[list(e.features),note('Feature Notes',e.featureNotes)]],
      ['PAGES',[list(e.pages),line('Approximate Pages',e.pageCount),note('Page Notes',e.pageNotes)]],
      ['WEBSITE SETUP',[line('Existing Website',e.existingWebsite),line('Website URL',e.websiteUrl),line('Domain',e.domainStatus),line('Hosting',e.hostingStatus),line('Brand Assets',e.brandAssets),note('Setup Notes',e.setupNotes)]],
      ['CONSULTATION REQUEST',[line('Date',dateValue(e.appointment.date).toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'})),line('Day',e.appointment.day),line('Time',e.appointment.time),line('Mode',e.appointment.mode),note('Appointment Notes',e.appointment.notes)]],
      ...(e.finalNotes ? [['FINAL PROJECT NOTES',[e.finalNotes]]] : []),
      ['PROJECT ESTIMATE',[estimate]]
    ].map(([title,lines])=>({title,lines:lines.filter(Boolean)}));
  }
  function renderReview() {
    const next = readEnquiry();
    if (JSON.stringify(next) !== JSON.stringify(enquiry)) { enquiry = next; }
    const groups = buildGroups(enquiry);
    finalMessage = 'NEW WEBSITE PROJECT ENQUIRY\n\n' + groups.map(group=>group.title+'\n'+(group.lines.join('\n') || 'Not specified')).join('\n\n') + '\n\nSent from Mohammed Aaris Portfolio';
    summary.replaceChildren();
    groups.forEach(group=>{const block=node('section','','enquiry-summary-group');block.append(node('h4',group.title),node('p',group.lines.join('\n') || 'Not specified'));summary.append(block);});
    setStatus('Please review your details. Your consultation is a request, not a confirmed appointment.');
  }
  function showStep(step, focus = true) {
    currentStep = Math.max(0, Math.min(7, step));
    reviewing = currentStep === 7 && reviewing;
    stepPanels.forEach((panel,index) => { panel.hidden = index !== currentStep; });
    form.hidden = reviewing; review.hidden = !reviewing;
    document.querySelector('#enquiryStepActions').hidden = reviewing;
    document.querySelector('#enquiryReviewActions').hidden = !reviewing;
    document.querySelector('#enquiryProgress').textContent = `Step ${currentStep + 1} of 8 - ${stepNames[currentStep]}`;
    document.querySelector('#enquiryProgressBar').value = currentStep + 1;
    document.querySelector('#enquiryBack').textContent = currentStep ? 'Back' : 'Cancel';
    document.querySelector('#enquiryContinue').textContent = currentStep === 7 ? 'Review Enquiry' : 'Continue';
    document.querySelector('.enquiry-modal-body').scrollTop = 0;
    if (focus && root.open) document.querySelector('#enquiryProgress').focus({preventScroll:true});
    saveDraft();
  }
  form.addEventListener('submit',event=>{
    event.preventDefault();
    if (!validate(stepKeys[currentStep] || [])) return;
    if (currentStep === 7) {
      if (!validate()) return;
      renderReview();
      reviewing = true;
    }
    showStep(currentStep + 1);
  });
  document.querySelector('#enquiryEdit').addEventListener('click',()=>{ reviewing = false; showStep(7); });
  const sendButton = document.querySelector('#enquirySend');
  const pdfButton = document.querySelector('#enquiryPdf');
  const pdfActions = ['enquiryPdf','enquirySend','enquiryEdit','enquiryReset'].map(id=>document.getElementById(id));
  let statusTimer;
  function setStatus(message, temporary = false) {
    clearTimeout(statusTimer);
    status.textContent = message;
    if (temporary) statusTimer = setTimeout(()=>{ status.textContent = ''; },5000);
  }
  function setBusy(busy) {
    pdfBusy = busy;
    pdfActions.forEach(button=>{ button.disabled = busy; });
    document.querySelector('#enquiryReviewActions').setAttribute('aria-busy',String(busy));
  }
  sendButton.addEventListener('click',async()=>{
    if (pdfBusy || !validate()) return;
    renderReview();
    setBusy(true);
    sendButton.textContent = 'Sending...';
    setStatus('Sending your enquiry...');
    try {
      const result = await window.EnquiryPdf.create(enquiry);
      if (result.blob.type !== 'application/pdf' || result.blob.size > 2 * 1024 * 1024) throw new Error('Invalid PDF');
      const bytes = new Uint8Array(await result.blob.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i,i + 8192));
      const response = await fetch('/api/send-enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enquiry, pdf: { base64: btoa(binary), contentType: 'application/pdf', filename: result.filename } }),
        signal: AbortSignal.timeout(25000)
      });
      const delivery = await response.json().catch(()=>({}));
      if (!response.ok || delivery.ok !== true) throw new Error('Email failed');
      setStatus('Your requirements were sent successfully. We\u2019ll contact you shortly.',true);
    } catch {
      setStatus('We couldn\u2019t send your enquiry. Please try again.');
    } finally {
      sendButton.textContent = 'Send Enquiry';
      setBusy(false);
    }
  });
  pdfButton.addEventListener('click',async()=>{
    if (pdfBusy || !validate()) return;
    renderReview();
    setBusy(true);
    pdfButton.textContent = 'Preparing PDF...';
    setStatus('Preparing your enquiry PDF...');
    try {
      const result = await window.EnquiryPdf.create(enquiry);
      const url = URL.createObjectURL(result.blob);
      const download = node('a');
      download.href = url; download.download = result.filename; download.hidden = true;
      root.append(download); download.click(); download.remove();
      setTimeout(()=>URL.revokeObjectURL(url),60000);
      setStatus('Project Enquiry PDF Ready. The download has started.');
    } catch {
      setStatus("We couldn't generate the PDF. Your enquiry details are safe. Please try again.");
    } finally {
      pdfButton.textContent = 'Download PDF';
      setBusy(false);
    }
  });

  function saveDraft() {
    const values = {};
    controls.forEach(({control},key) => { values[key] = control.value; });
    ['features','pages'].forEach(key => { values[key] = [...form.querySelectorAll(`input[name="${key}"]:checked`)].map(input=>input.value); });
    try {
      if (!Object.values(values).some(value=>Array.isArray(value)?value.length:value.trim())) { sessionStorage.removeItem(storageKey); return; }
      sessionStorage.setItem(storageKey,JSON.stringify({version:2,step:currentStep,values}));
    } catch { /* In-memory edits still survive closing the modal. */ }
  }
  function restoreDraft() {
    try {
      const draft = JSON.parse(sessionStorage.getItem(storageKey));
      if (!draft || ![1,2].includes(draft.version) || !draft.values || typeof draft.values !== 'object') return;
      controls.forEach(({control},key) => {
        if (typeof draft.values[key] === 'string') control.value = draft.values[key].slice(0,control.maxLength > 0 ? control.maxLength : 200);
      });
      ['features','pages'].forEach(key => {
        const selected = Array.isArray(draft.values[key]) ? draft.values[key] : [];
        form.querySelectorAll(`input[name="${key}"]`).forEach(input => { input.checked = selected.includes(input.value); });
      });
      form.querySelectorAll('.enquiry-multi').forEach(details => details.dispatchEvent(new Event('change')));
      currentStep = draft.version === 2 && Number.isInteger(draft.step) ? Math.max(0,Math.min(7,draft.step)) : 0;
    } catch { /* Ignore unavailable or malformed session storage. */ }
    toggleUrl(); updateDate();
  }
  restoreDraft();
  form.addEventListener('input', saveDraft);
  form.addEventListener('change', saveDraft);
  showStep(currentStep, false);

  const resetConfirmation = document.querySelector('#enquiryResetConfirmation');
  const resetButton = document.querySelector('#enquiryReset');
  function resetEnquiry() {
    form.reset();
    controls.forEach(({control,error})=>{ error.textContent=''; control.removeAttribute('aria-invalid'); });
    form.querySelectorAll('.enquiry-multi').forEach(details=>{ details.open=false; details.dispatchEvent(new Event('change')); });
    enquiry = undefined; finalMessage = ''; reviewing = false;
    pdfButton.textContent = 'Download PDF';
    summary.replaceChildren(); setStatus(''); resetConfirmation.hidden=true;
    toggleUrl(); updateDate(); showStep(0);
    try { sessionStorage.removeItem(storageKey); } catch { /* Storage may be unavailable. */ }
  }
  resetButton.addEventListener('click',()=>{
    const hasData = [...controls.values()].some(({control})=>control.value.trim()) || form.querySelector('input:checked');
    if (!hasData) { resetEnquiry(); return; }
    resetConfirmation.hidden=false;
    document.querySelector('.enquiry-modal-body').scrollTop=0;
    document.querySelector('#enquiryResetCancel').focus();
  });
  document.querySelector('#enquiryResetCancel').addEventListener('click',()=>{resetConfirmation.hidden=true;resetButton.focus();});
  document.querySelector('#enquiryResetConfirm').addEventListener('click',resetEnquiry);

  const opener = document.querySelector('#enquiryOpen');
  let previousFocus, scrollPosition = 0, oldOverflow = '', oldPadding = '', closeTimer;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  opener?.addEventListener('click',()=>{
    if (root.open) return;
    previousFocus = document.activeElement; scrollPosition = window.scrollY;
    oldOverflow = document.body.style.overflow; oldPadding = document.body.style.paddingRight;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    if (scrollbar) document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    document.body.style.overflow = 'hidden';
    root.classList.remove('is-closing'); root.showModal(); showStep(currentStep);
  });
  function closeModal() {
    if (!root.open || root.classList.contains('is-closing')) return;
    saveDraft(); resetConfirmation.hidden=true; root.classList.add('is-closing');
    closeTimer = setTimeout(()=>root.close(),reducedMotion.matches ? 0 : 220);
  }
  root.addEventListener('close',()=>{
    clearTimeout(closeTimer); root.classList.remove('is-closing');
    document.body.style.overflow = oldOverflow; document.body.style.paddingRight = oldPadding;
    window.scrollTo({top:scrollPosition,behavior:'instant'});
    (previousFocus?.isConnected ? previousFocus : opener).focus({preventScroll:true});
  });
  root.addEventListener('cancel',event=>{event.preventDefault();closeModal();});
  document.querySelector('#enquiryClose').addEventListener('click',closeModal);
  document.querySelector('#enquiryBack').addEventListener('click',()=>{if(currentStep)showStep(currentStep-1);else closeModal();});
  const outside = event => {const rect=root.getBoundingClientRect();return event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom;};
  let backdropDown = false;
  root.addEventListener('pointerdown',event=>{backdropDown=event.target===root&&outside(event);});
  root.addEventListener('click',event=>{if(backdropDown&&event.target===root&&outside(event))closeModal();backdropDown=false;});
  root.addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;
    const focusable=[...root.querySelectorAll('button,input,select,textarea,summary,[tabindex="0"]')].filter(element=>!element.disabled&&element.getClientRects().length);
    const first=focusable[0],last=focusable[focusable.length-1];
    if(event.shiftKey&&(document.activeElement===first||!focusable.includes(document.activeElement))){event.preventDefault();last?.focus();}
    else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
  });
})();
