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

// ========================================
// Feature 1: Camera Photo Capture
// ========================================
const btnCamera = document.getElementById('btn-camera');
const cameraModal = document.getElementById('camera-modal');
const cameraVideo = document.getElementById('camera-video');
const captureBtn = document.getElementById('capture-btn');
const photoGrid = document.getElementById('photo-grid');
const photoCount = document.getElementById('photo-count');

let cameraStream = null;
let photos = [];
const MAX_PHOTOS = 4;

btnCamera.addEventListener('click', openCamera);
captureBtn.addEventListener('click', capturePhoto);

async function openCamera() {
  cameraModal.classList.add('active');
  try {
    cameraStream = await navigator.mediaDevices.getUserMedia({ 
      video: { facingMode: 'environment' },
      audio: false 
    });
    cameraVideo.srcObject = cameraStream;
    loadPhotosFromStorage();
  } catch (error) {
    alert('無法開啟相機：' + error.message);
    cameraModal.classList.remove('active');
  }
}

function capturePhoto() {
  if (photos.length >= MAX_PHOTOS) {
    alert(`最多只能拍攝 ${MAX_PHOTOS} 張照片！`);
    return;
  }

  const canvas = document.createElement('canvas');
  canvas.width = cameraVideo.videoWidth;
  canvas.height = cameraVideo.videoHeight;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(cameraVideo, 0, 0);
  
  const timestamp = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  const photoData = {
    id: Date.now(),
    dataUrl: canvas.toDataURL('image/jpeg', 0.8),
    timestamp: timestamp
  };
  
  photos.push(photoData);
  savePhotosToStorage();
  renderPhotos();
}

function renderPhotos() {
  photoGrid.innerHTML = '';
  photoCount.textContent = photos.length;
  
  photos.forEach((photo, index) => {
    const photoCard = document.createElement('div');
    photoCard.className = 'photo-card';
    photoCard.innerHTML = `
      <img src="${photo.dataUrl}" alt="照片 ${index + 1}" />
      <div class="photo-info">${photo.timestamp}</div>
      <button class="photo-delete" onclick="deletePhoto(${photo.id})">🗑️</button>
    `;
    photoGrid.appendChild(photoCard);
  });
}

function deletePhoto(photoId) {
  photos = photos.filter(p => p.id !== photoId);
  savePhotosToStorage();
  renderPhotos();
}

function savePhotosToStorage() {
  localStorage.setItem('bmi-photos', JSON.stringify(photos));
}

function loadPhotosFromStorage() {
  const saved = localStorage.getItem('bmi-photos');
  if (saved) {
    photos = JSON.parse(saved);
    renderPhotos();
  }
}

// Make deletePhoto available globally
window.deletePhoto = deletePhoto;

// ========================================
// Feature 2: QR/Barcode Scanner + Signature
// ========================================
const btnScanner = document.getElementById('btn-scanner');
const scannerModal = document.getElementById('scanner-modal');
const scanResults = document.getElementById('scan-results');
const signatureCanvas = document.getElementById('signature-canvas');
const clearSignatureBtn = document.getElementById('clear-signature');
const saveSignatureBtn = document.getElementById('save-signature');

let html5QrcodeScanner = null;
let scannedCodes = [];
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let signatureCtx = null;

btnScanner.addEventListener('click', openScanner);
clearSignatureBtn.addEventListener('click', clearSignature);
saveSignatureBtn.addEventListener('click', saveSignature);

function initSignatureCanvas() {
  // Set canvas size to match its display size
  const rect = signatureCanvas.getBoundingClientRect();
  signatureCanvas.width = rect.width;
  signatureCanvas.height = 200;
  
  // Initialize context
  signatureCtx = signatureCanvas.getContext('2d');
  signatureCtx.strokeStyle = '#000';
  signatureCtx.lineWidth = 2;
  signatureCtx.lineCap = 'round';
  signatureCtx.lineJoin = 'round';
}

// Mouse events
signatureCanvas.addEventListener('mousedown', startDrawing);
signatureCanvas.addEventListener('mousemove', draw);
signatureCanvas.addEventListener('mouseup', stopDrawing);
signatureCanvas.addEventListener('mouseout', stopDrawing);

// Touch events
signatureCanvas.addEventListener('touchstart', handleTouchStart);
signatureCanvas.addEventListener('touchmove', handleTouchMove);
signatureCanvas.addEventListener('touchend', stopDrawing);

function startDrawing(e) {
  if (!signatureCtx) initSignatureCanvas();
  isDrawing = true;
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function draw(e) {
  if (!isDrawing || !signatureCtx) return;
  signatureCtx.beginPath();
  signatureCtx.moveTo(lastX, lastY);
  signatureCtx.lineTo(e.offsetX, e.offsetY);
  signatureCtx.stroke();
  [lastX, lastY] = [e.offsetX, e.offsetY];
}

function stopDrawing() {
  isDrawing = false;
}

function handleTouchStart(e) {
  e.preventDefault();
  if (!signatureCtx) initSignatureCanvas();
  const touch = e.touches[0];
  const rect = signatureCanvas.getBoundingClientRect();
  isDrawing = true;
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
}

function handleTouchMove(e) {
  if (!isDrawing || !signatureCtx) return;
  e.preventDefault();
  const touch = e.touches[0];
  const rect = signatureCanvas.getBoundingClientRect();
  const x = touch.clientX - rect.left;
  const y = touch.clientY - rect.top;
  
  signatureCtx.beginPath();
  signatureCtx.moveTo(lastX, lastY);
  signatureCtx.lineTo(x, y);
  signatureCtx.stroke();
  [lastX, lastY] = [x, y];
}

function clearSignature() {
  if (!signatureCtx) initSignatureCanvas();
  signatureCtx.clearRect(0, 0, signatureCanvas.width, signatureCanvas.height);
}

function openScanner() {
  scannerModal.classList.add('active');
  
  // Initialize signature canvas when modal opens
  setTimeout(() => {
    initSignatureCanvas();
  }, 100);
  
  loadScannedCodes();
  
  if (!html5QrcodeScanner) {
    html5QrcodeScanner = new Html5Qrcode("qr-reader");
  }
  
  html5QrcodeScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: { width: 250, height: 250 } },
    onScanSuccess,
    onScanError
  ).catch(err => {
    console.error('Scanner error:', err);
  });
}

function onScanSuccess(decodedText, decodedResult) {
  const timestamp = new Date().toLocaleString('zh-TW');
  const codeData = {
    id: Date.now(),
    text: decodedText,
    format: decodedResult.result.format?.formatName || 'Unknown',
    timestamp: timestamp
  };
  
  scannedCodes.push(codeData);
  renderScannedCodes();
  
  // Vibrate if supported
  if (navigator.vibrate) {
    navigator.vibrate(200);
  }
}

function onScanError(error) {
  // Ignore continuous scanning errors
}

function renderScannedCodes() {
  scanResults.innerHTML = '<h4>掃描結果</h4>';
  scannedCodes.forEach((code, index) => {
    const codeItem = document.createElement('div');
    codeItem.className = 'scan-item';
    codeItem.innerHTML = `
      <div class="scan-header">
        <span class="scan-format">${code.format}</span>
        <button class="scan-delete" onclick="deleteScanCode(${code.id})">🗑️</button>
      </div>
      <div class="scan-text">${code.text}</div>
      <div class="scan-time">${code.timestamp}</div>
    `;
    scanResults.appendChild(codeItem);
  });
}

function deleteScanCode(codeId) {
  scannedCodes = scannedCodes.filter(c => c.id !== codeId);
  saveScannedCodes();
  renderScannedCodes();
}

function saveSignature() {
  if (scannedCodes.length === 0) {
    alert('請先掃描至少一個條碼！');
    return;
  }
  
  const signatureData = signatureCanvas.toDataURL('image/png');
  const timestamp = new Date().toLocaleString('zh-TW');
  
  const record = {
    id: Date.now(),
    codes: [...scannedCodes],
    signature: signatureData,
    timestamp: timestamp
  };
  
  // Save to localStorage
  const records = JSON.parse(localStorage.getItem('scan-records') || '[]');
  records.push(record);
  localStorage.setItem('scan-records', JSON.stringify(records));
  
  alert('✅ 掃描記錄與簽名已儲存！');
  
  // Clear current session
  scannedCodes = [];
  clearSignature();
  renderScannedCodes();
  saveScannedCodes();
}

function saveScannedCodes() {
  localStorage.setItem('scanned-codes', JSON.stringify(scannedCodes));
}

function loadScannedCodes() {
  const saved = localStorage.getItem('scanned-codes');
  if (saved) {
    scannedCodes = JSON.parse(saved);
    renderScannedCodes();
  }
}

window.deleteScanCode = deleteScanCode;

// ========================================
// Feature 3: Google Navigation
// ========================================
const btnNavigation = document.getElementById('btn-navigation');
const navigationModal = document.getElementById('navigation-modal');
const navAddress = document.getElementById('nav-address');
const startNavigationBtn = document.getElementById('start-navigation');
const navFrameContainer = document.getElementById('nav-frame-container');

btnNavigation.addEventListener('click', () => {
  navigationModal.classList.add('active');
});

startNavigationBtn.addEventListener('click', startNavigation);
navAddress.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') startNavigation();
});

function startNavigation() {
  const address = navAddress.value.trim();
  if (!address) {
    alert('請輸入目的地地址！');
    return;
  }
  
  const encodedAddress = encodeURIComponent(address);
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodedAddress}&travelmode=driving`;
  
  // Open in same window/tab
  window.location.href = googleMapsUrl;
}

// ========================================
// Modal Controls
// ========================================
const modalCloseButtons = document.querySelectorAll('.modal-close');
const modals = document.querySelectorAll('.modal');

modalCloseButtons.forEach(btn => {
  btn.addEventListener('click', (e) => {
    const modalId = e.target.getAttribute('data-modal');
    closeModal(modalId);
  });
});

modals.forEach(modal => {
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal(modal.id);
    }
  });
});

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  modal.classList.remove('active');
  
  // Stop camera if closing camera modal
  if (modalId === 'camera-modal' && cameraStream) {
    cameraStream.getTracks().forEach(track => track.stop());
    cameraStream = null;
  }
  
  // Stop scanner if closing scanner modal
  if (modalId === 'scanner-modal' && html5QrcodeScanner) {
    html5QrcodeScanner.stop().catch(() => {});
  }
}
