// ─── ORDER.JS — The Progress Restaurant ───────────────────────────────────────

(function () {

  // ── Grab all interactive elements ──────────────────────────────────────────
  const checkboxes   = document.querySelectorAll('#orderTable input[type="checkbox"]');
  const subtotalEl   = document.getElementById('subtotal');
  const taxEl        = document.getElementById('tax');
  const totalEl      = document.getElementById('total');
  const summaryBox   = document.getElementById('orderSummary');
  const selectedList = document.getElementById('selectedList');
  const submitBtn    = document.getElementById('submitBtn');
  const clearBtn     = document.getElementById('clearBtn');
  const successMsg   = document.getElementById('successMsg');
  const successText  = document.getElementById('successText');

  const TAX_RATE = 0.13; // Ontario HST

  // ── Recalculate totals whenever a checkbox changes ──────────────────────────
  function updateTotals() {
    let subtotal = 0;
    const selected = [];

    checkboxes.forEach(function (cb) {
      const row = cb.closest('tr');
      if (cb.checked) {
        subtotal += parseFloat(cb.dataset.price);
        selected.push({ name: cb.dataset.name, price: parseFloat(cb.dataset.price) });
        row.classList.add('selected');
      } else {
        row.classList.remove('selected');
      }
    });

    const tax   = subtotal * TAX_RATE;
    const total = subtotal + tax;

    subtotalEl.textContent = '$' + subtotal.toFixed(2);
    taxEl.textContent      = '$' + tax.toFixed(2);
    totalEl.textContent    = '$' + total.toFixed(2);

    // Show / hide order summary panel
    if (selected.length > 0) {
      selectedList.innerHTML = selected.map(function (item) {
        return '<li>✔ ' + item.name + ' <span style="float:right; color:var(--saffron); font-weight:700;">$' + item.price.toFixed(2) + '</span></li>';
      }).join('');
      summaryBox.style.display = 'block';
    } else {
      summaryBox.style.display = 'none';
    }

    // Hide any previous success message when selection changes
    successMsg.style.display = 'none';
  }

  // ── Attach change listeners to every checkbox ───────────────────────────────
  checkboxes.forEach(function (cb) {
    cb.addEventListener('change', updateTotals);
  });

  // ── Submit order ────────────────────────────────────────────────────────────
  submitBtn.addEventListener('click', function () {
    const selected = [];
    let subtotal = 0;

    checkboxes.forEach(function (cb) {
      if (cb.checked) {
        selected.push(cb.dataset.name);
        subtotal += parseFloat(cb.dataset.price);
      }
    });

    if (selected.length === 0) {
      alert('Please select at least one item before submitting your order.');
      return;
    }

    const tax   = subtotal * TAX_RATE;
    const total = subtotal + tax;

    // Show success message
    successText.innerHTML =
      'Thank you! Your order of <strong>' + selected.join(', ') + '</strong> has been placed.<br>' +
      'Order total: <strong>$' + total.toFixed(2) + '</strong> (incl. HST).<br>' +
      'We\'ll have your food ready shortly — please present this confirmation at the counter.';

    successMsg.style.display = 'block';
    successMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    // Reset all checkboxes and totals after submission
    checkboxes.forEach(function (cb) {
      cb.checked = false;
      cb.closest('tr').classList.remove('selected');
    });

    subtotalEl.textContent = '$0.00';
    taxEl.textContent      = '$0.00';
    totalEl.textContent    = '$0.00';
    summaryBox.style.display = 'none';
  });

  // ── Clear all selections ────────────────────────────────────────────────────
  clearBtn.addEventListener('click', function () {
    checkboxes.forEach(function (cb) {
      cb.checked = false;
      cb.closest('tr').classList.remove('selected');
    });
    updateTotals();
    successMsg.style.display = 'none';
  });

})();
