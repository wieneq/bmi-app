// Unit toggle
let unit = 'metric'; // 'metric' | 'imperial'

const btnMetric   = document.getElementById('btn-metric');
const btnImperial = document.getElementById('btn-imperial');
const metricFields    = document.getElementById('metric-fields');
const imperialFields  = document.getElementById('imperial-fields');

// Metric inputs
const heightCmInput = document.getElementById('height-cm');
const weightKgInput = document.getElementById('weight-kg');
const heightSlider  = document.getElementById('height-slider');
const weightSlider  = document.getElementById('weight-slider');

// Imperial inputs
const heightFtInput = document.getElementById('height-ft');
const heightInInput = document.getElementById('height-in');
const weightLbInput = document.getElementById('weight-lb');

btnMetric.addEventListener('click', () => setUnit('metric'));
btnImperial.addEventListener('click', () => setUnit('imperial'));

function setUnit(u) {
  unit = u;
  btnMetric.classList.toggle('active', u === 'metric');
  btnImperial.classList.toggle('active', u === 'imperial');
  metricFields.hidden   = u !== 'metric';
  imperialFields.hidden = u !== 'imperial';
}

// Sync slider <-> input (metric)
function updateSliderFill(slider) {
  const min = +slider.min, max = +slider.max, val = +slider.value;
  const pct = ((val - min) / (max - min)) * 100;
  slider.style.setProperty('--pct', pct + '%');
}

heightSlider.addEventListener('input', () => {
  heightCmInput.value = heightSlider.value;
  updateSliderFill(heightSlider);
});
weightSlider.addEventListener('input', () => {
  weightKgInput.value = weightSlider.value;
  updateSliderFill(weightSlider);
});
heightCmInput.addEventListener('input', () => {
  heightSlider.value = heightCmInput.value;
  updateSliderFill(heightSlider);
});
weightKgInput.addEventListener('input', () => {
  weightSlider.value = weightKgInput.value;
  updateSliderFill(weightSlider);
});

// Init slider fills
updateSliderFill(heightSlider);
updateSliderFill(weightSlider);

// BMI categories (WHO + Asian adjustment)
const CATEGORIES = [
  { max: 18.5, key: 'underweight', label: '體重過輕', advice: '您的體重偏輕，建議增加均衡飲食攝取，並諮詢營養師或醫師以制定健康的增重計劃。', cls: 'cat-underweight', bg: 'bg-underweight' },
  { max: 24.0, key: 'normal',      label: '體重正常', advice: '恭喜！您的體重在正常範圍內。維持均衡飲食與規律運動，繼續保持良好的生活習慣。', cls: 'cat-normal',      bg: 'bg-normal' },
  { max: 27.0, key: 'overweight',  label: '體重過重', advice: '您的體重稍微偏高，建議適度減少熱量攝取，增加日常運動量，如每天步行 30 分鐘。', cls: 'cat-overweight',  bg: 'bg-overweight' },
  { max: 30.0, key: 'obese1',      label: '輕度肥胖', advice: '屬於輕度肥胖，建議調整飲食結構，減少精緻糖與油脂，並搭配有氧運動改善身體狀況。', cls: 'cat-obese1',      bg: 'bg-obese1' },
  { max: 35.0, key: 'obese2',      label: '中度肥胖', advice: '屬於中度肥胖，可能增加慢性疾病風險。建議積極尋求醫療或專業協助，制定減重計劃。', cls: 'cat-obese2',      bg: 'bg-obese2' },
  { max: Infinity, key: 'obese3',  label: '重度肥胖', advice: '屬於重度肥胖，健康風險較高。強烈建議立即就醫，由專業醫師評估並提供治療建議。', cls: 'cat-obese3',      bg: 'bg-obese3' },
];

function getCategory(bmi) {
  return CATEGORIES.find((c) => bmi < c.max);
}

// Marker position: map BMI 10–40+ to 0–100%
function bmiToPercent(bmi) {
  const MIN = 10, MAX = 40;
  return Math.min(100, Math.max(0, ((bmi - MIN) / (MAX - MIN)) * 100));
}

// Calculate
document.getElementById('btn-calc').addEventListener('click', calculate);
document.addEventListener('keydown', (e) => { if (e.key === 'Enter') calculate(); });

function calculate() {
  let heightM, weightKg;

  if (unit === 'metric') {
    const cm = parseFloat(heightCmInput.value);
    const kg = parseFloat(weightKgInput.value);
    if (!cm || !kg || cm <= 0 || kg <= 0) return showError();
    heightM  = cm / 100;
    weightKg = kg;
  } else {
    const ft = parseFloat(heightFtInput.value) || 0;
    const inch = parseFloat(heightInInput.value) || 0;
    const lb   = parseFloat(weightLbInput.value);
    if ((!ft && !inch) || !lb || lb <= 0) return showError();
    heightM  = (ft * 12 + inch) * 0.0254;
    weightKg = lb * 0.453592;
  }

  const bmi = weightKg / (heightM * heightM);
  showResult(bmi);
}

function showError() {
  const inputs = document.querySelectorAll('.input-wrap input');
  inputs.forEach((inp) => {
    inp.style.borderColor = '#ef4444';
    setTimeout(() => (inp.style.borderColor = ''), 1000);
  });
}

function showResult(bmi) {
  const cat = getCategory(bmi);
  const resultEl = document.getElementById('result');

  document.getElementById('bmi-number').textContent = bmi.toFixed(1);
  document.getElementById('bmi-circle').className = 'bmi-circle ' + cat.cls;

  const badge = document.getElementById('category-badge');
  badge.textContent = cat.label;
  badge.className = 'category-badge ' + cat.bg;

  document.getElementById('advice-text').textContent = cat.advice;

  const pct = bmiToPercent(bmi);
  document.getElementById('scale-marker').style.left = pct + '%';

  resultEl.classList.add('visible');
  resultEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// PWA install prompt
let deferredPrompt = null;
const banner    = document.getElementById('install-banner');
const btnInstall  = document.getElementById('btn-install');
const btnDismiss  = document.getElementById('btn-dismiss');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  banner.classList.add('visible');
});

btnInstall.addEventListener('click', async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  deferredPrompt = null;
  if (outcome === 'accepted') banner.classList.remove('visible');
});

btnDismiss.addEventListener('click', () => {
  banner.classList.remove('visible');
});

window.addEventListener('appinstalled', () => {
  banner.classList.remove('visible');
  deferredPrompt = null;
});

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
