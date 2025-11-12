// Cart-specific Booking Modal Logic (isolated from product)
document.addEventListener('DOMContentLoaded', function(){
  const overlay = document.getElementById('bookingModalOverlay');
  const modal = document.getElementById('bookingModal');
  const modalClose = document.getElementById('bookingModalClose');

  const steps = Array.from(document.querySelectorAll('.booking-step'));
  const dateInput = document.getElementById('bookingDate');
  const timeOptions = Array.from(document.querySelectorAll('.time-option'));
  const langOptions = Array.from(document.querySelectorAll('.lang-option'));
  const optionCards = Array.from(document.querySelectorAll('.option-card'));
  const optionRadios = Array.from(document.querySelectorAll('.option-card .option-radio'));
  const totalEl = document.getElementById('bookingTotal');

  const counters = Array.from(document.querySelectorAll('.counter-row'));
  const addonItems = Array.from(document.querySelectorAll('.addons-list .addon-item'));

  const state = {
    date: null,
    time: null,
    language: 'English',
    option: 'basic',
    participants: { adults: 1, children: 0, infants: 0 },
    addons: [],
    prices: { adult: 17.5, child: 10, infant: 0, options: { basic: 0, entrance: 4.5, parasailing: 18.5 } }
  };

  function updateMinMaxDates(){
    if(!dateInput) return;
    const today = new Date();
    const max = new Date(today); max.setFullYear(today.getFullYear()+1);
    const fmt = d => d.toISOString().split('T')[0];
    dateInput.min = fmt(today); dateInput.max = fmt(max);
  }

  function setSummary(stepEl, text, opts = {}){
    const summary = stepEl?.querySelector('.selected-summary');
    if (summary) summary.textContent = text || '';
    const shouldCollapse = opts.collapse ?? false; // cart edit: keep steps open by default
    stepEl.classList.toggle('collapsed', shouldCollapse);
    stepEl.classList.toggle('active', !shouldCollapse);
  }

  function updateTotal(){
    const base = (state.participants.adults * state.prices.adult) + (state.participants.children * state.prices.child);
    const optionFee = state.prices.options[state.option] || 0;
    const addonsFee = state.addons.reduce((sum, a) => sum + ((a.price || 0) * (a.qty || 0)), 0);
    const total = base + optionFee + addonsFee;
    if (totalEl) totalEl.textContent = `€${total.toFixed(2)}`;
    // Removed bookingDetails rendering per request
  }

  // Expand/collapse on header click (keep open if already open)
  steps.forEach(step => {
    const header = step.querySelector('.step-header');
    header?.addEventListener('click', () => {
      const isCollapsed = step.classList.contains('collapsed');
      steps.forEach(s => s.classList.remove('active'));
      step.classList.toggle('collapsed', !isCollapsed);
      step.classList.toggle('active', isCollapsed);
    });
  });

  // Date selection (stay open)
  dateInput?.addEventListener('change', () => {
    state.date = dateInput.value;
    const stepEl = document.querySelector('.booking-step[data-step="date"]');
    setSummary(stepEl, state.date, { collapse: false });
    updateTotal();
  });

  // Time selection (stay open)
  timeOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      timeOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.time = btn.dataset.time;
      const stepEl = document.querySelector('.booking-step[data-step="time"]');
      setSummary(stepEl, state.time, { collapse: false });
      updateTotal();
    });
  });

  // Language selection
  langOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      langOptions.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.language = btn.dataset.lang;
      const stepEl = document.querySelector('.booking-step[data-step="language"]');
      setSummary(stepEl, state.language, { collapse: false });
      updateTotal();
    });
  });

  function selectOption(card){
    if(!card) return;
    const opt = card.dataset.option;
    state.option = opt;
    const t = card.querySelector('.title');
    const title = t ? t.textContent.trim() : opt;
    const stepEl = document.querySelector('.booking-step[data-step="options"]');
    setSummary(stepEl, title, { collapse: false });
    updateOptionSelectionUI();
    updateTotal();
  }
  function updateOptionSelectionUI(){
    document.querySelectorAll('.option-card').forEach(card => {
      const isSelected = (card.dataset.option === state.option);
      card.classList.toggle('selected', isSelected);
      const radio = card.querySelector('.option-radio');
      if(radio) radio.checked = isSelected;
    });
  }

  optionRadios.forEach(radio => {
    radio.addEventListener('change', () => {
      const card = radio.closest('.option-card');
      selectOption(card);
    });
  });
  optionCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if(e.target.closest('.details-toggle')) return;
      if(e.target.closest('.option-radio')) return;
      selectOption(card);
    });
  });
  const initialCard = document.querySelector('.option-card.selected') || optionCards[0];
  if (initialCard) {
    state.option = initialCard.dataset.option || state.option;
    const t = initialCard.querySelector('.title');
    const title = t ? t.textContent.trim() : state.option;
    const stepEl = document.querySelector('.booking-step[data-step="options"]');
    setSummary(stepEl, title, { collapse: false });
    updateOptionSelectionUI();
  }

  // Participants counters (always open)
  counters.forEach(row => {
    const type = row.dataset.type;
    const minus = row.querySelector('.minus');
    const plus = row.querySelector('.plus');
    const countEl = row.querySelector('.count');
    function setCount(n){
      countEl.textContent = String(n);
      state.participants[type === 'adult' ? 'adults' : type === 'child' ? 'children' : 'infants'] = n;
      const text = `Adults ${state.participants.adults} · Children ${state.participants.children} · Infants ${state.participants.infants}`;
      const stepEl = document.querySelector('.booking-step[data-step="participants"]');
      setSummary(stepEl, text, { collapse: false });
      updateTotal();
    }
    minus.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      const next = Math.max(0, current - 1);
      const finalVal = type === 'adult' ? Math.max(1, next) : next;
      setCount(finalVal);
    });
    plus.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setCount(current + 1);
    });
  });
  (function(){
    const stepEl = document.querySelector('.booking-step[data-step="participants"]');
    if(stepEl){
      const text = `Adults ${state.participants.adults} · Children ${state.participants.children} · Infants ${state.participants.infants}`;
      setSummary(stepEl, text, { collapse: false });
    }
  })();

  // Addons counters
  addonItems.forEach(item => {
    const minus = item.querySelector('.minus');
    const plus = item.querySelector('.plus');
    const countEl = item.querySelector('.qty-count');
    const name = (item.querySelector('.addon-name')?.textContent || item.dataset.addon || 'Addon').trim();
    const price = parseFloat(item.dataset.price || '0');
    function setQty(q){
      countEl.textContent = String(q);
      const existing = state.addons.find(a => a.name === name);
      if(existing){ existing.qty = q; existing.price = price; }
      else { state.addons.push({ name, qty: q, price }); }
      const chosen = state.addons.filter(a => (a.qty || 0) > 0);
      const text = chosen.length ? chosen.map(a => `${a.name} x${a.qty}`).join(', ') : 'No add-ons';
      const stepEl = document.querySelector('.booking-step[data-step="addons"]');
      setSummary(stepEl, text, { collapse: false });
      updateTotal();
    }
    minus?.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setQty(Math.max(0, current - 1));
    });
    plus?.addEventListener('click', () => {
      const current = parseInt(countEl.textContent || '0', 10);
      setQty(current + 1);
    });
  });

  // Details toggles
  Array.from(document.querySelectorAll('.option-card .details-toggle')).forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const card = btn.closest('.option-card');
      if(!card) return;
      const expanded = card.classList.toggle('expanded');
      btn.innerHTML = expanded ? '<i class="fas fa-chevron-down icon-toggle" style="transform: rotate(180deg);"></i> Hide Details' : '<i class="fas fa-chevron-down icon-toggle" style="transform: rotate(0deg);"></i> Show Details';
    });
  });

  // Modal close (click on X)
  modalClose?.addEventListener('click', () => {
    overlay?.classList.remove('show');
    document.body.style.overflow = '';
  });

  updateMinMaxDates();
  updateTotal();
});