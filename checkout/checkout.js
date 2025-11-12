document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('guestForm');
  const paymentSection = document.querySelector('.payment-card');
  const paymentTitleEl = document.getElementById('paymentTitle');
  // Summary elements
  const summaryList = document.getElementById('summaryList');
  const summaryTotal = document.getElementById('summaryTotal');
  const promoInput = document.getElementById('promoInput');
  const promoApply = document.getElementById('promoApply');

  // Basic pricing (fallback values if no cart context)
  let serviceFee = 89;
  let subtotal = 0;
  let discount = 0;

  const formatCurrency = (n) => `$${Number(n).toLocaleString()}`;

  function buildSummary() {
    if (!summaryList || !summaryTotal) return;
    summaryList.innerHTML = '';

    // Try reading possible cart data from localStorage (if cart set it)
    try {
      const rawSubtotal = localStorage.getItem('cartSubtotal');
      if (rawSubtotal) subtotal = parseFloat(rawSubtotal) || 0;
    } catch (_) {}

    // Example single line item when no detailed cart items are available
    const li = document.createElement('li');
    const left = document.createElement('span');
    const right = document.createElement('span');
    left.textContent = 'Trip Subtotal';
    right.textContent = formatCurrency(subtotal);
    right.classList.add('price-amount');
    li.append(left, right);
    summaryList.appendChild(li);

    // Service fee
    const feeLi = document.createElement('li');
    feeLi.append(Object.assign(document.createElement('span'), { textContent: 'Service Fee' }), Object.assign(document.createElement('span'), { textContent: formatCurrency(serviceFee), className: 'price-amount' }));
    summaryList.appendChild(feeLi);

    // Discount line
    if (discount > 0) {
      const disLi = document.createElement('li');
      disLi.classList.add('discount');
      const l = document.createElement('span');
      const r = document.createElement('span');
      l.textContent = 'Promo Discount';
      r.textContent = `-$${Number(discount).toLocaleString()}`;
      r.classList.add('price-amount');
      disLi.append(l, r);
      summaryList.appendChild(disLi);
    }

    const total = Math.max(0, subtotal + serviceFee - discount);
    summaryTotal.textContent = formatCurrency(total);
  }
  const fields = {
    firstName: document.getElementById('firstName'),
    lastName: document.getElementById('lastName'),
    email: document.getElementById('email'),
    phone: document.getElementById('phone'),
    nationality: document.getElementById('nationality'),
    hotelName: document.getElementById('hotelName'),
    roomNumber: document.getElementById('roomNumber'),
    notes: document.getElementById('notes'),
    saveInfo: document.getElementById('saveInfo')
  };

  function setState(el, state) {
    const group = el.closest('.form-group');
    group.classList.remove('valid', 'invalid');
    if (state) group.classList.add(state);
  }

  function validateName(value) {
    return /^[A-Za-zأ-يءى\-\s]{2,}$/.test(value.trim());
  }

  function validateEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
  }

  function validatePhone(value) {
    const v = value.trim();
    if (!v) return true; // optional
    return /^\+?[0-9]{7,15}$/.test(v);
  }

  function validateNationality(value) {
    const v = value.trim();
    if (!v) return false; // optional but show valid only when selected
    return true;
  }

  function validateField(el) {
    const id = el.id;
    let valid = false;
    switch (id) {
      case 'firstName':
        valid = validateName(el.value);
        break;
      case 'lastName':
        valid = validateName(el.value);
        break;
      case 'email':
        valid = validateEmail(el.value);
        break;
      case 'phone':
        valid = validatePhone(el.value);
        // phone optional: only mark invalid if present and wrong
        if (!el.value.trim()) {
          setState(el, '');
          return true;
        }
        break;
      case 'hotelName':
        valid = validateHotel(el.value);
        break;
      case 'roomNumber':
        valid = validateRoom(el.value);
        if (!el.value.trim()) { setState(el, ''); return true; }
        break;
      case 'nationality':
        // nationality optional: mark valid when chosen, neutral if empty
        if (!el.value.trim()) {
          setState(el, '');
          return true;
        }
        valid = validateNationality(el.value);
        break;
      default:
        valid = true;
    }
    setState(el, valid ? 'valid' : 'invalid');
    return valid;
  }

  // Attach listeners
  Object.values(fields).forEach((el) => {
    if (!el) return;
    if (el.type === 'checkbox') return; // skip checkbox
    el.addEventListener('input', () => validateField(el));
    el.addEventListener('blur', () => validateField(el));
    if (el.tagName === 'SELECT') {
      el.addEventListener('change', () => validateField(el));
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // Validate required fields
    const firstOk = validateField(fields.firstName);
    const lastOk = validateField(fields.lastName);
    const emailOk = validateField(fields.email);
    const hotelOk = validateField(fields.hotelName);
    const phoneOk = validateField(fields.phone); // optional
    const natOk = validateField(fields.nationality); // optional
    const roomOk = validateField(fields.roomNumber); // optional

    if (firstOk && lastOk && emailOk && hotelOk && phoneOk && natOk && roomOk) {
      // Save info if requested
      if (fields.saveInfo && fields.saveInfo.checked) {
        const payload = {
          firstName: fields.firstName.value.trim(),
          lastName: fields.lastName.value.trim(),
          email: fields.email.value.trim(),
          phone: fields.phone.value.trim(),
          nationality: fields.nationality.value.trim(),
          hotelName: fields.hotelName.value.trim(),
          roomNumber: fields.roomNumber.value.trim(),
          notes: (fields.notes && fields.notes.value.trim()) || ''
        };
        try {
          localStorage.setItem('checkoutSaved', JSON.stringify(payload));
        } catch (_) {}
      }
      // Smooth-scroll to payment section and highlight it
      if (paymentSection) {
        paymentSection.classList.add('highlight');
        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Focus first payment radio to guide the user
        const firstRadio = paymentSection.querySelector('input[type="radio"]');
        firstRadio?.focus();
        setTimeout(() => paymentSection.classList.remove('highlight'), 1500);
      }
    } else {
      // Focus first invalid
      const invalid = document.querySelector('.form-group.invalid input, .form-group.invalid select');
      if (invalid) invalid.focus();
    }
  });

  // Prefill from saved info if exists
  try {
    const savedRaw = localStorage.getItem('checkoutSaved');
    if (savedRaw) {
      const saved = JSON.parse(savedRaw);
      ['firstName','lastName','email','phone','nationality','hotelName','roomNumber','notes'].forEach((k) => {
        if (fields[k] && typeof saved[k] === 'string') {
          fields[k].value = saved[k];
          if (fields[k].tagName !== 'TEXTAREA') validateField(fields[k]);
        }
      });
    }
  } catch (_) {}

  // Promo code handling
  if (promoApply && promoInput) {
    promoApply.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      // Simple demo rules
      if (code === 'EARLYBIRD' || code === 'EB200') {
        discount = 200;
      } else if (code === 'SAVE10') {
        // 10% off subtotal
        discount = Math.round(subtotal * 0.10);
      } else if (code === 'NONE' || code === '') {
        discount = 0;
      } else {
        discount = 0;
      }
      buildSummary();
    });
  }

  // Initial summary render
  buildSummary();

  // Payment method selection
  const paymentOptions = Array.from(document.querySelectorAll('.payment-option'));
  let selectedMethod = 'link';
  paymentOptions.forEach((label) => {
    const input = label.querySelector('input[type="radio"]');
    if (!input) return;
    input.addEventListener('change', () => {
      paymentOptions.forEach(l => l.classList.remove('active'));
      label.classList.add('active');
      selectedMethod = input.value;
      try { localStorage.setItem('paymentMethod', selectedMethod); } catch(_) {}
    });
    // make label clickable for full area
    label.addEventListener('click', () => {
      input.checked = true;
      input.dispatchEvent(new Event('change', { bubbles: true }));
    });
  });

  const confirmBtn = document.getElementById('confirmBooking');
  const THANKS_URL = '../est.html'; // placeholder; replace with your final thanks page
  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      // Optionally, ensure required forms are valid first
      const firstOk = validateField(fields.firstName);
      const lastOk = validateField(fields.lastName);
      const emailOk = validateField(fields.email);
      const hotelOk = validateField(fields.hotelName);
      if (!(firstOk && lastOk && emailOk && hotelOk)) {
        const invalid = document.querySelector('.form-group.invalid input, .form-group.invalid select');
        invalid?.focus();
        return;
      }
      // All good: go to placeholder thanks page
      window.location.href = THANKS_URL;
    });
  }
});
  function validateHotel(value) {
    return /^[A-Za-z0-9أ-يءى\-\s]{2,}$/.test(value.trim());
  }

  function validateRoom(value) {
    const v = value.trim();
    if (!v) return true; // optional
    return /^[A-Za-z0-9\-\s]{1,}$/.test(v);
  }