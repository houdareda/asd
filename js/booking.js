// Booking Bottom Sheet Modal Logic
document.addEventListener('DOMContentLoaded', function() {
  const bookBtns = document.querySelectorAll('.book-now-btn, .book-now-trigger');
  const overlay = document.getElementById('bookingModalOverlay');
  const modal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('bookingModalClose');

  if (!overlay || !modal) return;

  function isDesktop(){
    return window.matchMedia('(min-width: 992px)').matches;
  }

  const steps = Array.from(document.querySelectorAll('.booking-step'));
  const dateInput = document.getElementById('bookingDate');
  const timeOptions = Array.from(document.querySelectorAll('.time-option'));
  const langOptions = Array.from(document.querySelectorAll('.lang-option'));
  const optionCards = Array.from(document.querySelectorAll('.option-card'));
  const optionRadios = Array.from(document.querySelectorAll('.option-card .option-radio'));
  const totalEl = document.getElementById('bookingTotal');
  const detailsEl = document.getElementById('bookingDetails');
  const confirmBtn = document.querySelector('.confirm-booking-btn');
  const addToCartBtn = document.querySelector('.check-out');
  const btnsContainer = document.querySelector('.booking-summary .btns');

  const counters = Array.from(document.querySelectorAll('.counter-row'));
  const addonItems = Array.from(document.querySelectorAll('.addons-list .addon-item'));

  // Read per-tour participant restrictions (e.g., "child,infant") from HTML
  const participantsStep = document.querySelector('.booking-step[data-step="participants"]');
  const restrictedTypes = (participantsStep?.dataset.restrict || '')
    .split(',')
    .map(s => s.trim().toLowerCase())
    .filter(Boolean);

  const state = {
    date: null,
    time: null,
    language: 'English',
    option: 'basic',
    participants: { adults: 1, children: 0, infants: 0 },
    addons: [],
    prices: {
      adult: 17.5,
      child: 10,
      infant: 0,
      options: { basic: 0, entrance: 4.5, parasailing: 18.5 }
    }
  };

  // Build participants summary text based on restrictions
  function buildParticipantsSummary(){
    const parts = [];
    parts.push(`Adults ${state.participants.adults}`);
    if(!restrictedTypes.includes('child')) {
      parts.push(`Children ${state.participants.children}`);
    }
    if(!restrictedTypes.includes('infant')) {
      parts.push(`Infants ${state.participants.infants}`);
    }
    return parts.join(' · ');
  }

  function openModal() {
    overlay.classList.add('show');
    // Prevent background scroll on both mobile and desktop while modal is open
    document.body.style.overflow = 'hidden';
    // reset and open the Options step first so user can choose
    steps.forEach(s => { s.classList.remove('collapsed', 'active'); });
    const optionsFirst = document.querySelector('.booking-step[data-step="options"]');
    if (optionsFirst) optionsFirst.classList.add('active');
    updateMinMaxDates();
    updateTotal();
  }

  function closeModal() {
    overlay.classList.remove('show');
    // Restore scroll only for mobile bottom sheet
    document.body.style.overflow = '';
  }

  function updateMinMaxDates() {
    if (!dateInput) return;
    const today = new Date();
    const max = new Date(today);
    max.setFullYear(today.getFullYear() + 1);
    const fmt = d => d.toISOString().split('T')[0];
    dateInput.min = fmt(today);
    dateInput.max = fmt(max);
  }

  function setSummary(stepEl, text, opts = {}) {
    const summary = stepEl.querySelector('.selected-summary');
    if (summary) summary.textContent = text || '';
    const noAuto = stepEl.hasAttribute('data-noauto');
    const sticky = stepEl.hasAttribute('data-sticky');
    const shouldCollapse = opts.collapse ?? (!noAuto && !sticky);
    if (shouldCollapse) {
      stepEl.classList.add('collapsed');
      stepEl.classList.remove('active');
    } else {
      stepEl.classList.add('active');
      stepEl.classList.remove('collapsed');
    }
  }

  // Inline validation tip helpers
  function getStepEl(stepName){
    return document.querySelector(`.booking-step[data-step="${stepName}"]`);
  }
  function clearValidationTip(stepName){
    const stepEl = getStepEl(stepName);
    if(!stepEl) return;
    const tip = stepEl.querySelector('.validation-tip');
    if(tip) tip.remove();
  }
  function showValidationTip(stepName, message){
    const stepEl = getStepEl(stepName);
    if(!stepEl) return;
    // Ensure step is visible/open
    stepEl.classList.remove('collapsed');
    stepEl.classList.add('active');
    // Create or update tip next to the header title
    const header = stepEl.querySelector('.step-header .title-wrap') || stepEl.querySelector('.step-header');
    let tip = header.querySelector('.validation-tip');
    if(!tip){
      tip = document.createElement('span');
      tip.className = 'validation-tip';
      header.appendChild(tip);
    }
    tip.textContent = message;
    // Scroll the modal to the step container (no extra offset)
    if (typeof window.smoothOffsetScroll === 'function') {
      const off = (typeof window.VALIDATION_SCROLL_OFFSET_PX === 'number')
        ? window.VALIDATION_SCROLL_OFFSET_PX
        : (typeof window.SCROLL_OFFSET_PX === 'number' ? window.SCROLL_OFFSET_PX : 64);
      const dur = (typeof window.SCROLL_DURATION_MS === 'number') ? window.SCROLL_DURATION_MS : 900;
      window.smoothOffsetScroll(modal, stepEl, off, dur);
    } else {
      stepEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Global validation message above the confirm button
  function setGlobalValidationMessage(text){
    if(!btnsContainer) return;
    let msg = btnsContainer.querySelector('.global-validation');
    if(!msg){
      msg = document.createElement('div');
      msg.className = 'global-validation';
      btnsContainer.insertBefore(msg, btnsContainer.firstElementChild);
    }
    msg.textContent = text || '';
    if(text){
      msg.style.display = 'block';
    } else {
      msg.style.display = 'none';
    }
  }
  function clearGlobalValidationMessage(){
    if(!btnsContainer) return;
    const msg = btnsContainer.querySelector('.global-validation');
    if(msg) msg.remove();
  }
  function updateGlobalValidation(){
    const needsDate = !state.date;
    const needsTime = !state.time;
    if(needsDate && needsTime){
      setGlobalValidationMessage('Please select date and time');
    } else if(needsDate){
      setGlobalValidationMessage('Please select a date');
    } else if(needsTime){
      setGlobalValidationMessage('Please select a time');
    } else {
      clearGlobalValidationMessage();
    }
  }

  function goToStep(name) {
    const next = document.querySelector(`.booking-step[data-step="${name}"]`);
    if (next) {
      next.classList.remove('collapsed');
      next.classList.add('active');
      if (typeof window.smoothOffsetScroll === 'function') {
        const modal = document.getElementById('bookingModal');
        window.smoothOffsetScroll(modal, next);
      } else {
        next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }

  function updateTotal() {
    const base = (state.participants.adults * state.prices.adult) + (state.participants.children * state.prices.child);
    const optionFee = state.prices.options[state.option] || 0;
    const addonsFee = state.addons.reduce((sum, a) => sum + ((a.price || 0) * (a.qty || 0)), 0);
    const total = base + optionFee + addonsFee;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;

    // Build structured list for summary details
    const items = [];
    if (state.language) items.push(`Language: ${state.language}`);
    if (state.date) items.push(`Date: ${state.date}`);
    if (state.time) items.push(`Time: ${state.time}`);
    items.push(`Adults: ${state.participants.adults}, Children: ${state.participants.children}, Infants: ${state.participants.infants}`);
    items.push(`Option: ${state.option}`);
    const addonSummary = state.addons.filter(a => (a.qty || 0) > 0);
    if (addonSummary.length) items.push(`Add-ons: ${addonSummary.map(a => `${a.name} x${a.qty}`).join(', ')}`);
    if (detailsEl) {
      const listHTML = `<ul class="summary-list">${items.map(t => `<li>${t}</li>`).join('')}</ul>`;
      detailsEl.innerHTML = listHTML;
    }
  }

  // Header allows editing by expanding
  steps.forEach(step => {
    const header = step.querySelector('.step-header');
    if (header) {
      header.addEventListener('click', () => {
        const sticky = step.hasAttribute('data-sticky');
        const isCollapsed = step.classList.contains('collapsed');
        steps.forEach(s => s.classList.remove('active'));
        if (isCollapsed || sticky) {
          step.classList.remove('collapsed');
          step.classList.add('active');
        } else {
          step.classList.add('collapsed');
        }
      });
    }
  });

  // Date selection
  if (dateInput) {
    dateInput.addEventListener('change', () => {
      clearValidationTip('date');
      state.date = dateInput.value;
      const stepEl = document.querySelector('.booking-step[data-step="date"]');
      setSummary(stepEl, state.date);
      goToStep('time');
      updateTotal();
      updateGlobalValidation();
    });
  }

  // Time selection
  timeOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      clearValidationTip('time');
      timeOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.time = btn.dataset.time;
      const stepEl = document.querySelector('.booking-step[data-step="time"]');
      setSummary(stepEl, state.time);
      goToStep('language');
      updateTotal();
      updateGlobalValidation();
    });
  });

  // Language selection
  langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      langOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.language = btn.dataset.lang;
      const stepEl = document.querySelector('.booking-step[data-step="language"]');
      setSummary(stepEl, state.language);
      goToStep('options');
      updateTotal();
    });
  });

  function selectOption(card){
    if(!card) return;
    const opt = card.dataset.option;
    if(!opt) return;
    state.option = opt;
    const t = card.querySelector('.title');
    const title = t ? t.textContent.trim() : opt;
    const stepEl = document.querySelector('.booking-step[data-step="options"]');
    setSummary(stepEl, title);
    // Update heading to indicate a selection has been made
    const headingEl = stepEl?.querySelector('.title-wrap h4');
    if (headingEl) headingEl.textContent = 'Selected Option';
    // Collapse the options step once the user makes a selection
    if (stepEl) {
      stepEl.classList.add('collapsed');
      stepEl.classList.remove('active');
    }
    goToStep('participants');
    updateTotal();
    updateOptionSelectionUI();
  }
  function updateOptionSelectionUI(){
    document.querySelectorAll('.option-card').forEach(card => {
      const isSelected = (card.dataset.option === state.option);
      card.classList.toggle('selected', isSelected);
      const radio = card.querySelector('.option-radio');
      if(radio){
        radio.checked = isSelected;
      }
    });
  }

  // Radio behavior: choose the option card
  optionRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const card = radio.closest('.option-card');
      selectOption(card);
    });
  });
  // Clicking anywhere on the card (except details toggle) selects the option
  optionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.closest('.details-toggle')) return; // don't hijack details toggle
      if(e.target.closest('.option-radio')) return;   // radio already handles
      selectOption(card);
    });
  });

  // Initialize selected UI for the pre-checked option (first one)
  const initialCard = document.querySelector('.option-card.selected') || optionCards[0];
  if (initialCard) {
    state.option = initialCard.dataset.option || state.option;
    const t = initialCard.querySelector('.title');
    const title = t ? t.textContent.trim() : state.option;
    const stepEl = document.querySelector('.booking-step[data-step="options"]');
    setSummary(stepEl, title);
    const headingEl = stepEl?.querySelector('.title-wrap h4');
    if (headingEl) headingEl.textContent = 'Selected Option :';
    // Ensure Options step is open initially on desktop and mobile
    if (stepEl) {
      stepEl.classList.remove('collapsed');
      stepEl.classList.add('active');
    }
  }
  updateOptionSelectionUI();

  // Participants counters
  counters.forEach(row => {
    const type = row.dataset.type;
    const minus = row.querySelector('.minus');
    const plus = row.querySelector('.plus');
    const countEl = row.querySelector('.count');
    function setCount(n) {
      countEl.textContent = String(n);
      state.participants[type === 'adult' ? 'adults' : type === 'child' ? 'children' : 'infants'] = n;
      const summaryText = buildParticipantsSummary();
      const stepEl = document.querySelector('.booking-step[data-step="participants"]');
      // Keep participants open and DO NOT auto-scroll to next step
      setSummary(stepEl, summaryText, { collapse: false });
      updateTotal();
    }

    // If this participant type is restricted for the current tour, lock the row
    if (restrictedTypes.includes(type) && type !== 'adult') {
      // Hide the entire row when children/infants are not permitted
      row.remove();
      // Ensure state remains zero for this type (already default)
      return; // skip binding events entirely
    }
    minus.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      const nextVal = Math.max(0, current - 1);
      const finalVal = type === 'adult' ? Math.max(1, nextVal) : nextVal; // keep at least 1 adult
      setCount(finalVal);
    });
    plus.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setCount(current + 1);
    });
  });

  // After initializing counters, update summary to reflect current visibility/restrictions
  (function(){
    const stepEl = document.querySelector('.booking-step[data-step="participants"]');
    if(stepEl){
      setSummary(stepEl, buildParticipantsSummary(), { collapse: false });
    }
  })();

  // Inject a simple English notice above the counters when restrictions apply
  if (participantsStep && restrictedTypes.length) {
    const body = participantsStep.querySelector('.step-body.counters');
    if (body) {
      // English labels and message, dynamically based on restricted types
      const labelsMap = { child: 'Children', infant: 'Infants' };
      const humanList = restrictedTypes
        .filter(t => t !== 'adult')
        .map(t => labelsMap[t] || (t.charAt(0).toUpperCase() + t.slice(1)));
      const message = humanList.length === 1
        ? `${humanList[0]} are not permitted on this tour.`
        : `${humanList.join(' and ')} are not permitted on this tour.`;
      const note = document.createElement('div');
      note.className = 'restriction-note';
      note.textContent = message;
      body.prepend(note);
    }
  }

  // Addons quantity counters
  addonItems.forEach(item => {
    const minus = item.querySelector('.minus');
    const plus = item.querySelector('.plus');
    const countEl = item.querySelector('.qty-count');
    const name = (item.querySelector('.addon-name')?.textContent || item.dataset.addon || 'Addon').trim();
    const price = parseFloat(item.dataset.price || '0');

    function setQty(qty) {
      countEl.textContent = String(qty);
      const existing = state.addons.find(a => a.name === name);
      if (existing) {
        existing.qty = qty;
        existing.price = price; // keep price synced
      } else {
        state.addons.push({ name, price, qty });
      }
      const chosen = state.addons.filter(a => (a.qty || 0) > 0);
      const stepEl = document.querySelector('.booking-step[data-step="addons"]');
      const text = chosen.length ? chosen.map(a => `${a.name} x${a.qty}`).join(', ') : 'No add-ons';
      setSummary(stepEl, text, { collapse: false });
      updateTotal();
    }

    minus?.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      const next = Math.max(0, current - 1);
      setQty(next);
    });
    plus?.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setQty(current + 1);
    });
  });

  // Option details toggling and selected banner
  const detailToggles = Array.from(document.querySelectorAll('.option-card .details-toggle'));
  detailToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.option-card');
      if(!card) return;
      const expanded = card.classList.toggle('expanded');
      btn.innerHTML = expanded ? '<i class="fas fa-chevron-down icon-toggle" style="transform: rotate(180deg);"></i> Hide Details' : '<i class="fas fa-chevron-down icon-toggle" style="transform: rotate(0deg);"></i> Show Details';
    });
  });

  // Radios removed; selection managed by state.option and button clicks

  // Open/Close bindings
  if (bookBtns.length) {
    bookBtns.forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        openModal();
      });
    });
  }
  if (modalClose) modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function(e){ if (e.target === overlay) closeModal(); });

  // Confirm booking validation: require date and time
  if (confirmBtn) {
    confirmBtn.addEventListener('click', function(e){
      e.preventDefault();
      updateGlobalValidation();
      if(!state.date){
        showValidationTip('date', 'Please select a booking date.');
        return;
      }
      if(!state.time){
        showValidationTip('time', 'Please select a start time.');
        return;
      }
      // Passed validation: proceed (integration point)
      console.log('Booking ready to confirm', state);
      // Navigate to cart page
  window.location.href = 'cart/index.html';
    });
  }

  // Add to Cart: close booking modal sheet
  if (addToCartBtn) {
    addToCartBtn.addEventListener('click', function(e){
      e.preventDefault();
      closeModal();
    });
  }
});
// --- Enhanced slow, offset scrolling between steps (override) ---
// This redefines goToStep to scroll the modal more slowly and leave
// the next section slightly below the top edge for clearer context.
(function(){
  const modal = document.getElementById('bookingModal');
  if(!modal) return;

  // Control how far from the top the next step stops and how slow it scrolls
  const SCROLL_OFFSET_PX = (typeof window.SCROLL_OFFSET_PX === 'number') ? window.SCROLL_OFFSET_PX : 64;      // space above the next step
  const SCROLL_DURATION_MS = (typeof window.SCROLL_DURATION_MS === 'number') ? window.SCROLL_DURATION_MS : 900;  // slower scroll duration

  function smoothOffsetScroll(container, target, offset = SCROLL_OFFSET_PX, duration = SCROLL_DURATION_MS){
    try{
      const containerRect = container.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      const start = container.scrollTop;
      const distance = (targetRect.top - containerRect.top);
      // Where the target would land if aligned to the top
      const targetTopAlignedScroll = start + distance;
      // Desired end ensures a fixed gap above the target
      const desiredEnd = Math.max(0, targetTopAlignedScroll - offset);
      // Clamp to container bounds
      const maxScroll = container.scrollHeight - container.clientHeight;
      const end = Math.min(maxScroll, desiredEnd);
      const change = end - start;
      const startTime = performance.now();
      const easeInOut = (t)=> t<0.5 ? 2*t*t : -1+(4-2*t)*t;

      function step(now){
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        container.scrollTop = start + change * easeInOut(progress);
        if(progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }catch(e){
      // Fallback
      target.scrollIntoView({behavior:'smooth', block:'start'});
    }
  }

  // Keep a reference to the original goToStep if present
  const originalGoToStep = window.goToStep;
  // Expose smoother globally so earlier handlers can use it
  window.smoothOffsetScroll = smoothOffsetScroll;
  // Also expose current offset/duration so user tweaks apply consistently
  window.SCROLL_OFFSET_PX = SCROLL_OFFSET_PX;
  window.SCROLL_DURATION_MS = SCROLL_DURATION_MS;

  window.goToStep = function(currentStep){
    try{
      const steps = Array.from(document.querySelectorAll('.booking-step'));
      const currentIdx = steps.findIndex(s => s.dataset.step === currentStep);
      const next = steps[currentIdx + 1];
      if(next){
        next.classList.add('active');
        smoothOffsetScroll(modal, next, SCROLL_OFFSET_PX, SCROLL_DURATION_MS);
      } else {
        const summary = document.querySelector('.booking-summary');
        if(summary) smoothOffsetScroll(modal, summary, Math.max(24, SCROLL_OFFSET_PX - 8), SCROLL_DURATION_MS);
      }
    }catch(e){
      if(typeof originalGoToStep === 'function') originalGoToStep(currentStep);
    }
  };
})();