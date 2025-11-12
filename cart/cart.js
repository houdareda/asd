document.addEventListener('DOMContentLoaded', () => {
  const serviceFee = 89;
  let discount = 200; // default early bird discount
  let editingCard = null;

  const overlay = document.getElementById('bookingModalOverlay');
  const modal = document.getElementById('bookingModal');
  const bookingDate = document.getElementById('bookingDate');

  const openEditModal = (card) => {
    editingCard = card;
    if (overlay) {
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    // Prefill basic fields from card
    try {
      prefillFromCard(card);
    } catch (e) {
      console.warn('Prefill failed', e);
    }
  };
  const closeEditModal = () => {
    if (overlay) {
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
    editingCard = null;
  };

  const toCartDateText = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    if (isNaN(d.getTime())) return '';
    return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };
  const parseCartDateToISO = (text) => {
    if (!text) return '';
    // remove leading weekday like "Tue, "
    const cleaned = text.replace(/^[A-Za-z]{3},\s*/, '');
    const d = new Date(cleaned);
    if (isNaN(d.getTime())) return '';
    return d.toISOString().slice(0, 10);
  };
  const to12h = (hhmm) => {
    if (!hhmm) return '';
    const [hStr, mStr] = hhmm.split(':');
    let h = parseInt(hStr, 10);
    const suffix = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${mStr} ${suffix}`;
  };

  const prefillFromCard = (card) => {
    if (!card) return;
    // Date
    const dateLi = card.querySelector('.info-list .date');
    const dateText = dateLi ? (dateLi.textContent || '').replace(/^[^\w]*/, '').trim() : '';
    const iso = parseCartDateToISO(dateText);
    if (bookingDate && iso) {
      bookingDate.value = iso;
      bookingDate.dispatchEvent(new Event('change', { bubbles: true }));
    }
    // Language
    const langLi = card.querySelector('.info-list li i.fa-language')?.parentElement;
    const langText = langLi ? (langLi.textContent || '').replace(/^[^A-Za-z]*/, '').trim() : '';
    const langBtn = Array.from(document.querySelectorAll('.lang-option')).find(b => (b.dataset.lang || '').toLowerCase() === langText.toLowerCase());
    if (langBtn) langBtn.click();
    // Time (best-effort: try to match 09/12/15)
    const timeLi = card.querySelector('.info-list .time');
    const timeText = timeLi ? (timeLi.textContent || '').trim() : '';
    const simpleMatch = ['09:00','12:00','15:00'].find(t => timeText.includes(t.slice(0,2)));
    const timeBtn = simpleMatch ? Array.from(document.querySelectorAll('.time-option')).find(b => b.dataset.time === simpleMatch) : null;
    if (timeBtn) timeBtn.click();
    // Participants (read from participants-line if exists)
    const pLine = card.querySelector('.info-list .participants-line');
    const pText = pLine ? (pLine.textContent || '') : '';
    const adultMatch = pText.match(/(\d+)\s*Adult/);
    const childMatch = pText.match(/(\d+)\s*Child/);
    const infantMatch = pText.match(/(\d+)\s*Infant/);
    const adultCount = adultMatch ? parseInt(adultMatch[1], 10) : 1;
    const childCount = childMatch ? parseInt(childMatch[1], 10) : 0;
    const infantCount = infantMatch ? parseInt(infantMatch[1], 10) : 0;
    const adultRow = document.querySelector('.counter-row[data-type="adult"]');
    const adultCountEl = adultRow?.querySelector('.count');
    if (adultRow && adultCountEl) {
      // reset to 1 then click plus to reach desired
      adultCountEl.textContent = '1';
      for (let i = 1; i < adultCount; i++) adultRow.querySelector('.plus')?.click();
    }
    const childRow = document.querySelector('.counter-row[data-type="child"]');
    const childCountEl = childRow?.querySelector('.count');
    if (childRow && childCountEl) {
      childCountEl.textContent = '0';
      for (let i = 0; i < childCount; i++) childRow.querySelector('.plus')?.click();
    }
    const infantRow = document.querySelector('.counter-row[data-type="infant"]');
    const infantCountEl = infantRow?.querySelector('.count');
    if (infantRow && infantCountEl) {
      infantCountEl.textContent = '0';
      for (let i = 0; i < infantCount; i++) infantRow.querySelector('.plus')?.click();
    }
  };

  const saveEdits = () => {
    if (!editingCard) return;
    // Read values from modal
    const dateISO = bookingDate?.value || '';
    const timeBtn = document.querySelector('.time-option.active');
    const time24 = timeBtn?.dataset.time || '';
    const timeText = time24 ? to12h(time24) : '';
    const langBtn = document.querySelector('.lang-option.active');
    const language = langBtn?.dataset.lang || '';
    const adultCount = parseInt(document.querySelector('.counter-row[data-type="adult"] .count')?.textContent || '1', 10);
    const childCount = parseInt(document.querySelector('.counter-row[data-type="child"] .count')?.textContent || '0', 10);
    const infantCount = parseInt(document.querySelector('.counter-row[data-type="infant"] .count')?.textContent || '0', 10);
    const selectedOptionTitle = document.querySelector('.option-card.selected .title')?.textContent?.trim() || '';
    // Add-ons summary from modal
    const chosenAddons = Array.from(document.querySelectorAll('.addons-list .addon-item')).map(item => {
      const qty = parseInt(item.querySelector('.qty-count')?.textContent || '0', 10);
      const name = (item.querySelector('.addon-name')?.textContent || item.dataset.addon || 'Addon').trim();
      return { name, qty };
    }).filter(a => a.qty > 0);

    // Update card UI
    const dateLi = editingCard.querySelector('.info-list .date');
    if (dateLi && dateISO) {
      dateLi.innerHTML = '<i class="fa-regular fa-calendar-days"></i> ' + toCartDateText(dateISO);
    }
    const timeLi = editingCard.querySelector('.info-list .time');
    if (timeLi && timeText) {
      timeLi.innerHTML = '<i class="fa-regular fa-clock"></i> ' + timeText;
    }
    const langLi = editingCard.querySelector('.info-list li i.fa-language')?.parentElement;
    if (langLi && language) {
      langLi.innerHTML = '<i class="fa-solid fa-language"></i> ' + language;
    }
    // Participants line: single line combining all
    const participantsLine = editingCard.querySelector('.info-list .participants-line');
    if (participantsLine) {
      const parts = [];
      parts.push(`${adultCount} ${adultCount > 1 ? 'Adults' : 'Adult'}`);
      if (childCount > 0) parts.push(`${childCount} ${childCount > 1 ? 'Children' : 'Child'}`);
      if (infantCount > 0) parts.push(`${infantCount} ${infantCount > 1 ? 'Infants' : 'Infant'}`);
      participantsLine.innerHTML = '<i class="fa-solid fa-user"></i> ' + parts.join(', ');
    }
    // Remove any previous separate child/infant lines
    editingCard.querySelector('.info-list li.child-count')?.remove();
    editingCard.querySelector('.info-list li.infant-count')?.remove();
    // Option
    const optionValueSpan = Array.from(editingCard.querySelectorAll('.info-list li')).find(li => li.querySelector('.label'))?.querySelector('span:last-child');
    if (optionValueSpan && selectedOptionTitle) {
      optionValueSpan.textContent = selectedOptionTitle;
    }
    // Add-ons line
    const addonsContainer = editingCard.querySelector('.info-list');
    let addonsLine = editingCard.querySelector('.info-list li.addons-line');
    if (chosenAddons.length) {
      const summary = chosenAddons.map(a => `${a.name} x${a.qty}`).join(', ');
      if (!addonsLine) {
        addonsLine = document.createElement('li');
        addonsLine.className = 'addons-line';
        const last = Array.from(addonsContainer.children).pop();
        addonsContainer.appendChild(addonsLine);
      }
      addonsLine.innerHTML = '<span class="label">Add-ons:</span> <span>' + summary + '</span>';
    } else {
      addonsLine?.remove();
    }

    // Update travelers count for summary
    const totalTravelers = adultCount + childCount + infantCount;
    editingCard.dataset.travelers = String(Math.max(1, totalTravelers));

    // Rebuild summary and close modal
    buildSummary();
    closeEditModal();
  };

  const formatCurrency = (n) => `$${Number(n).toLocaleString()}`;

  const buildSummary = () => {
    const list = document.getElementById('summaryList');
    const totalEl = document.getElementById('summaryTotal');
    list.innerHTML = '';

    let subtotal = 0;
    document.querySelectorAll('.cart-card').forEach((card) => {
      const title = card.dataset.title || 'Tour';
      const price = parseFloat(card.dataset.price || '0');
      const travelers = parseInt(card.dataset.travelers || '1', 10);
      const lineTotal = price * travelers;
      subtotal += lineTotal;

      const li = document.createElement('li');
      const left = document.createElement('span');
      const right = document.createElement('span');
      left.textContent = `${title} (${travelers} traveler${travelers > 1 ? 's' : ''})`;
      right.textContent = formatCurrency(lineTotal);
      right.classList.add('price-amount');
      li.append(left, right);
      list.appendChild(li);
    });

    // Service Fee
    const feeLi = document.createElement('li');
    const feeLeft = document.createElement('span');
    const feeRight = document.createElement('span');
    feeLeft.textContent = 'Service Fee';
    feeRight.textContent = formatCurrency(serviceFee);
    feeRight.classList.add('price-amount');
    feeLi.append(feeLeft, feeRight);
    list.appendChild(feeLi);

    // Discount
    if (discount > 0) {
      const disLi = document.createElement('li');
      disLi.classList.add('discount');
      const disLeft = document.createElement('span');
      const disRight = document.createElement('span');
      disLeft.textContent = 'Early Bird Discount';
      disRight.textContent = `-$${Number(discount).toLocaleString()}`;
      disRight.classList.add('price-amount');
      disLi.append(disLeft, disRight);
      list.appendChild(disLi);
    }

    const total = subtotal + serviceFee - discount;
    totalEl.textContent = formatCurrency(total);
  };

  // Delete actions
  document.querySelectorAll('.cart-card .btn-icon.delete').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.cart-card');
      if (card) card.remove();
      buildSummary();
    });
  });

  // Edit actions (placeholder)
  document.querySelectorAll('.cart-card .btn-icon.edit').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const card = e.currentTarget.closest('.cart-card');
      if (card) openEditModal(card);
    });
  });

  // Save edits button inside booking modal
  const saveBtn = document.querySelector('.save-edits-btn');
  if (saveBtn) {
    saveBtn.addEventListener('click', saveEdits);
  }

  // Bind close button and overlay click for modal
  const modalClose = document.getElementById('bookingModalClose');
  modalClose?.addEventListener('click', closeEditModal);
  overlay?.addEventListener('click', (e) => { if (e.target === overlay) closeEditModal(); });

  // Promo code
  const promoApply = document.getElementById('promoApply');
  const promoInput = document.getElementById('promoInput');
  if (promoApply && promoInput) {
    promoApply.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (code === 'EARLYBIRD' || code === 'EB200') {
        discount = 200;
      } else if (code === 'NONE' || code === '') {
        discount = 0;
      } else {
        // simple demo: unknown code removes discount
        discount = 0;
      }
      buildSummary();
    });
  }

  buildSummary();
});