(() => {
  const base = new URL('.', document.currentScript.src);
  let dependencies;
  function loadScript(file, ready) {
    if (ready()) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      const timeout = setTimeout(() => finish(false), 15000);
      function finish(ok) {
        clearTimeout(timeout);
        script.onload = script.onerror = null;
        if (ok && ready()) resolve();
        else { script.remove(); reject(new Error('PDF dependency could not load.')); }
      }
      script.src = new URL(file, base).href;
      script.onload = () => finish(true);
      script.onerror = () => finish(false);
      document.head.append(script);
    });
  }
  async function loadDependencies() {
    if (!dependencies) dependencies = (async () => {
      await loadScript('assets/vendor/jspdf-4.2.1.umd.min.js', () => !!window.jspdf?.jsPDF);
      await loadScript('assets/vendor/noto-sans-regular.js', () => !!window.enquiryPdfFont);
    })().catch(error => { dependencies = undefined; throw error; });
    return dependencies;
  }
  function filename(name, date) {
    const safe = String(name).normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 70).replace(/-+$/g, '') || 'Customer';
    const stamp = `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
    return `Mohammed-Aaris-Project-Enquiry-${safe}-${stamp}.pdf`;
  }
  async function create(e, generatedAt = new Date()) {
    await loadDependencies();
    const doc = new window.jspdf.jsPDF({unit:'mm',format:'a4',compress:true,putOnlyUsedFonts:true});
    doc.addFileToVFS('NotoSans-Regular.ttf', window.enquiryPdfFont);
    doc.addFont('NotoSans-Regular.ttf', 'NotoSans', 'normal');
    doc.setFont('NotoSans','normal');
    const pdfFont = doc.getFont().metadata;
    doc.setProperties({title:'Project Enquiry Report',author:'Mohammed Aaris',subject:'Client Project Requirement Summary',creator:'Mohammed Aaris Portfolio'});
    const left = 18, right = 192, bottom = 274, lineHeight = 5.2;
    const navy = [16,25,35], teal = [0,122,115], muted = [85,99,112], ink = [37,48,59];
    let y = 72;
    const text = value => {
      const clean = String(value).replace(/\r\n?/g,'\n').replace(/\t/g,'    ');
      // Do not silently omit unsupported customer-entered glyphs from the document.
      if ([...clean].some(char=>char!=='\n'&&!pdfFont.characterToGlyph(char.codePointAt(0)))) {
        const error = new Error('PDF font cannot represent this text.');
        error.code = 'PDF_FONT_UNSUPPORTED';throw error;
      }
      return clean;
    };
    function font(size=10, bold=false, color=ink) {
      doc.setFont(bold?'helvetica':'NotoSans', bold?'bold':'normal');doc.setFontSize(size);doc.setTextColor(...color);
    }
    function nextPage() {
      doc.addPage();
      font(9,true,muted);doc.text('MOHAMMED AARIS / PROJECT ENQUIRY',left,14);
      doc.setDrawColor(208,220,224);doc.line(left,18,right,18);y=28;
    }
    function room(height) { if (y+height>bottom) nextPage(); }
    function lines(value, x=left, width=right-left) {
      font();
      const wrapped=doc.splitTextToSize(text(value),width);
      wrapped.forEach(line=>{room(lineHeight);font();doc.text(line,x,y);y+=lineHeight;});
    }
    function section(title) {
      room(30);y+=4;font(12,true,teal);doc.text(title,left,y);y+=3;
      doc.setDrawColor(220,229,232);doc.line(left,y,right,y);y+=8;
    }
    function row(label,value) {
      if (!value) return;
      room(12);font(9,true,muted);doc.text(label,left,y);
      lines(value,left+48,right-left-48);y+=3;
    }
    function note(label,value) {
      if (!value) return;
      room(15);font(9,true,muted);doc.text(label,left,y);y+=6;
      lines(value);y+=4;
    }
    function list(values) {
      if (!values.length) { lines('Not specified');y+=3;return; }
      values.forEach(value=>{
        room(lineHeight);doc.setDrawColor(...teal);doc.setLineWidth(.45);
        doc.line(left,y-1.5,left+1.2,y-.3);doc.line(left+1.2,y-.3,left+3.6,y-3);
        lines(value,left+6,right-left-6);y+=1.5;
      });
      y+=2;
    }
    doc.setFillColor(...navy);doc.rect(0,0,210,58,'F');
    doc.setFillColor(28,211,174);doc.roundedRect(left,12,15,15,2,2,'F');
    font(15,true,navy);doc.text('MA',left+2.8,22);
    font(14,true,[255,255,255]);doc.text('MOHAMMED AARIS',39,18);
    font(9,false,[202,217,225]);doc.text('Web Developer \u2022 WordPress Developer',39,25);
    font(20,true,[255,255,255]);doc.text('PROJECT ENQUIRY REPORT',left,39);
    font(10,false,[202,217,225]);doc.text('Client Project Requirement Summary',left,48);
    doc.setFillColor(28,211,174);doc.rect(0,58,210,1,'F');
    font(9,false,muted);
    doc.text('Generated: '+generatedAt.toLocaleString('en-IN',{year:'numeric',month:'short',day:'2-digit',hour:'2-digit',minute:'2-digit'}),left,66);
    section('01. CUSTOMER DETAILS');
    row('Full Name',e.customer.name);row('Email',e.customer.email);row('Phone / WhatsApp',e.customer.phone);
    row('Business / Company',e.customer.company);row('Location',e.customer.location);note('Customer Notes',e.customer.notes);
    section('02. PROJECT OVERVIEW');row('Project Type',e.projectType);row('Website Type',e.websiteType);
    note('Project Notes',e.projectNotes);note('Website Type Notes',e.websiteTypeNotes);
    section('03. DESIGN & THEME');row('Design Style',e.designStyle);row('Color / Theme',e.colorStyle);
    row('Reference Website',e.referenceUrl);note('Design Notes',e.designNotes);
    section('04. REQUIRED FEATURES');list(e.features);note('Feature Notes',e.featureNotes);
    section('05. PAGES / SECTIONS');list(e.pages);row('Approximate Page Count',e.pageCount);note('Page Notes',e.pageNotes);
    section('06. WEBSITE SETUP');row('Existing Website',e.existingWebsite);row('Existing Website URL',e.websiteUrl);
    row('Domain',e.domainStatus);row('Hosting',e.hostingStatus);row('Logo / Brand Assets',e.brandAssets);note('Setup Notes',e.setupNotes);
    section('07. CONSULTATION REQUEST');
    row('Preferred Date',new Date(e.appointment.date+'T12:00:00').toLocaleDateString('en-IN',{day:'2-digit',month:'long',year:'numeric'}));
    row('Day',e.appointment.day);row('Preferred Time',e.appointment.time);row('Consultation Mode',e.appointment.mode);note('Appointment Notes',e.appointment.notes);
    lines('This is a preferred consultation request. Availability will be confirmed separately.');y+=4;
    section('08. ADDITIONAL PROJECT NOTES');lines(e.finalNotes || 'No additional notes provided.');y+=4;
    section('PROJECT ESTIMATE');
    lines('The final project scope, pricing, delivery timeline, and commercial terms will be discussed during the consultation after reviewing the complete requirements.');
    const pageCount=doc.getNumberOfPages();
    for(let page=1;page<=pageCount;page++){
      doc.setPage(page);doc.setDrawColor(220,229,232);doc.setLineWidth(.2);doc.line(left,281,right,281);
      font(8,false,muted);doc.text('Mohammed Aaris \u2022 Project Enquiry',left,286);
      doc.text('Generated from Mohammed Aaris Portfolio',left,291);
      doc.text(`Page ${page} of ${pageCount}`,right,286,{align:'right'});
    }
    return {blob:doc.output('blob'),filename:filename(e.customer.name,generatedAt),pageCount};
  }
  window.EnquiryPdf = Object.freeze({create});
})();
