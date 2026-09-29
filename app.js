const money = value => new Intl.NumberFormat('en-US', {style:'currency',currency:'USD'}).format(value);
let balance = 75;
const balanceEl = document.querySelector('#balance');
function updateWallet(title, detail) { balanceEl.textContent = money(balance); document.querySelector('#activity').textContent = title; document.querySelector('#activity-detail').textContent = detail; document.querySelector('#wallet-status').textContent = title + '. Balance ' + money(balance); }
document.querySelector('#add').addEventListener('click', () => { balance += 25; updateWallet('Demo top-up added: $25', 'Sample family contribution · No charge made'); });
document.querySelector('#swipe').addEventListener('click', () => { if(balance < 20) { updateWallet('Time for a top-up', 'Add $25 to try another sample fill-up.'); return; } balance -= 20; updateWallet('Demo fill-up complete: $20', 'Paid from sample wallet · No fuel purchased'); });
document.querySelector('#reset').addEventListener('click', () => { balance = 75; updateWallet('A little help from home', 'Family top-ups. More peace of mind.'); });
document.querySelector('#gallons').addEventListener('input', event => { const gallons = Number(event.target.value); document.querySelector('#gallons-value').textContent = gallons + ' gal'; document.querySelector('#monthly').textContent = money(gallons * .1); document.querySelector('#yearly').textContent = money(gallons * .1 * 12); });
document.querySelector('#interest').addEventListener('submit', event => { event.preventDefault(); const campus = document.querySelector('#campus').value.trim(); const status = document.querySelector('#form-status'); if(!campus) { status.textContent = 'Please enter your college or university.'; return; } try { localStorage.setItem('campuspitstop-interest', JSON.stringify({campus,role:document.querySelector('#role').value})); status.textContent = 'Interest in ' + campus + ' saved on this device. This preview does not submit a signup.'; } catch { status.textContent = 'This browser could not save your interest. No signup was submitted.'; } });

// Local estimates only: no payment, identity, or pricing service is contacted.
const readNumber = id => Number(document.getElementById(id).value);
function semesterEstimate(miles, mpg, weeks, price, familyPercent, cushionPercent) {
  const gallons = miles / mpg * weeks;
  const total = gallons * price * (1 + cushionPercent / 100);
  const family = total * familyPercent / 100;
  return { gallons, total, family, student: total - family, weekly: family / weeks };
}
document.querySelector('#budget-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const weeks = readNumber('weeks'), cushion = readNumber('buffer');
  const estimate = semesterEstimate(readNumber('weekly-miles'), readNumber('mpg'), weeks, readNumber('fuel-price'), readNumber('family-share'), cushion);
  document.querySelector('#budget-total').textContent = money(estimate.total);
  document.querySelector('#budget-summary').textContent = `${estimate.gallons.toLocaleString('en-US', {maximumFractionDigits:1})} gallons over ${weeks} weeks, including a ${cushion}% budget cushion.`;
  document.querySelector('#family-total').textContent = money(estimate.family);
  document.querySelector('#student-total').textContent = money(estimate.student);
  document.querySelector('#family-weekly').textContent = money(estimate.weekly);
});
document.querySelector('#compare-form').addEventListener('submit', event => {
  event.preventDefault();
  if (!event.currentTarget.reportValidity()) return;
  const gallons = readNumber('fill-gallons');
  const ours = Math.round(readNumber('our-price') * gallons * 100);
  const other = Math.round(readNumber('other-price') * gallons * 100);
  const difference = ours - other;
  const comparison = difference === 0 ? 'Both cost the same for this fill-up.' : `${difference < 0 ? 'CampusPitstop' : 'The other station'} is ${money(Math.abs(difference) / 100)} less for this fill-up.`;
  document.querySelector('#comparison-result').textContent = `CampusPitstop: ${money(ours / 100)} · Other station: ${money(other / 100)}. ${comparison}`;
});
