// ═══════════════════════════════════════════════════════════════════
// Простая передача UTM меток
// ═══════════════════════════════════════════════════════════════════

const urlParams = window.location.search;
const OFFER_URL = "https://veotrustkol.com/NMVTN7sQ" + urlParams;

// Обновляем все ссылки на офферный URL с UTM
function updateOfferLinks() {
  document.querySelectorAll('a[href*="veotrustkol.com"]').forEach(link => {
    link.href = OFFER_URL;
  });
}

// ═══════════════════════════════════════════════════════════════════
// City Detection
// ═══════════════════════════════════════════════════════════════════

const SUPPORTED_CITIES = ["Lagos", "Abuja", "Kano", "Port Harcourt", "Ibadan"];
let detectedCity = "Nigeria";

const names = {
  Lagos: ["Chidi", "Ngozi", "Adewale", "Folake", "Tunde", "Amaka"],
  Abuja: ["Ibrahim", "Aisha", "Emeka", "Zainab", "Usman"],
  Kano: ["Yusuf", "Fatima", "Hassan", "Maryam"],
  "Port Harcourt": ["David", "Blessing", "Samuel", "Peace", "Daniel"],
  Ibadan: ["Tayo", "Funke", "Segun", "Bukola", "Wale"],
  Nigeria: ["John", "Mary", "James", "Grace", "Michael"],
};

const baseCounts = {
  Lagos: 347,
  Abuja: 234,
  Kano: 189,
  "Port Harcourt": 156,
  Ibadan: 178,
  Nigeria: 500,
};

function updateCityElements(city) {
  // Обновить city badge
  const cityBadgeText = document.getElementById("city-badge-text");
  if (cityBadgeText) {
    cityBadgeText.textContent = `CONGRATULATIONS ${city.toUpperCase()}`;
  }

  // Обновить счётчик
  const counter = document.getElementById("counter");
  if (counter) {
    // Используем базовое значение для известных городов, иначе случайное значение
    const count = baseCounts[city] || Math.floor(Math.random() * 200) + 150;
    counter.textContent = `${count} from ${city} played today`;
    currentCount = count;
  }

  // Обновить победителей (используем ближайший поддерживаемый город или дефолт)
  const winnerCity = SUPPORTED_CITIES.includes(city)
    ? city
    : SUPPORTED_CITIES[0] || "Nigeria";
  updateWinners(winnerCity);

  // Сохранить текущий город для других функций
  detectedCity = city;
}

// ═══════════════════════════════════════════════════════════════════
// Winners Section
// ═══════════════════════════════════════════════════════════════════

// Фиксированные 3 победителя
const fixedWinners = [
  {
    name: "Chidi",
    city: "Lagos",
    prize: "₦10,000",
    time: "2 hours ago",
    image: "photo1.png",
  },
  {
    name: "Ngozi",
    city: "Lagos",
    prize: "₦5,000",
    time: "5 hours ago",
    image: "photo2.png",
  },
  {
    name: "Adewale",
    city: "Lagos",
    prize: "₦3,000",
    time: "8 hours ago",
    image: "photo3.png",
  },
];

function updateWinners(city) {
  const winnersGrid = document.getElementById("winners-grid");
  if (!winnersGrid) return;

  winnersGrid.innerHTML = "";

  fixedWinners.forEach((winner) => {
    const winnerCard = document.createElement("div");
    winnerCard.className = "winner-card";

    const initial = winner.name.charAt(0).toUpperCase();
    const lastNameInitial = String.fromCharCode(
      65 + Math.floor(Math.random() * 26)
    );

    winnerCard.innerHTML = `
            <div class="winner-avatar-wrapper">
                <img src="images/${winner.image}" alt="${winner.name}" class="winner-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="winner-avatar-fallback" style="display:none;">${initial}</div>
            </div>
            <div class="winner-info">
                <h3 class="winner-name">${winner.name} ${lastNameInitial}.</h3>
                <p class="winner-location">${winner.city}, Nigeria</p>
            </div>
            <div class="winner-prize">
                <span class="winner-amount">${winner.prize}</span>
                <span class="winner-time">${winner.time}</span>
            </div>
        `;

    winnersGrid.appendChild(winnerCard);
  });
}

// Определение города через IP геолокацию
function detectCity() {
  // Попытка 1: ipapi.co
  fetch("https://ipapi.co/json/")
    .then((res) => res.json())
    .then((data) => {
      const city = data.city;
      const country = data.country_name;

      // Если город найден и это Нигерия, используем город
      if (city && country === "Nigeria") {
        // Если город в списке поддерживаемых - используем его
        if (SUPPORTED_CITIES.includes(city)) {
          updateCityElements(city);
          return;
        }
        // Если город не в списке, но это Нигерия - используем реальный город
        updateCityElements(city);
        return;
      }

      // Если не Нигерия или город не найден, пробуем второй API
      tryIpApi();
    })
    .catch(() => {
      tryIpApi();
    });
}

function tryIpApi() {
  fetch("http://ip-api.com/json/")
    .then((res) => res.json())
    .then((data) => {
      const city = data.city;
      const country = data.country;

      // Если город найден и это Нигерия, используем город
      if (city && country === "Nigeria") {
        // Если город в списке поддерживаемых - используем его
        if (SUPPORTED_CITIES.includes(city)) {
          updateCityElements(city);
          return;
        }
        // Если город не в списке, но это Нигерия - используем реальный город
        updateCityElements(city);
        return;
      }

      // Если не Нигерия или город не найден - используем дефолт
      updateCityElements("Nigeria");
    })
    .catch(() => {
      updateCityElements("Nigeria");
    });
}

// ═══════════════════════════════════════════════════════════════════
// Countdown Timer
// ═══════════════════════════════════════════════════════════════════

let timeLeft = Math.floor(Math.random() * 120) + 180; // 3-5 минут

function updateTimer() {
  timeLeft--;
  if (timeLeft <= 0) {
    timeLeft = Math.floor(Math.random() * 120) + 180; // Сброс
  }

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerElement = document.getElementById("timer");
  if (timerElement) {
    timerElement.textContent = `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Player Counter
// ═══════════════════════════════════════════════════════════════════

let currentCount = baseCounts["Nigeria"];

function updateCounter() {
  currentCount += Math.floor(Math.random() * 3) + 1; // +1 до +3
  const counterElement = document.getElementById("counter");
  if (counterElement) {
    counterElement.textContent = `${currentCount} from ${detectedCity} played today`;
  }
}

// ═══════════════════════════════════════════════════════════════════
// Scratch Cards
// ═══════════════════════════════════════════════════════════════════

const prizes = [
  { amount: "₦5,000", class: "prize-5k" },
  { amount: "₦5,000", class: "prize-5k" },
  { amount: "₦10,000", class: "prize-10k" },
  { amount: "₦10,000", class: "prize-10k" },
  { amount: "₦50,000", class: "prize-50k" },
  { amount: "₦50,000", class: "prize-50k" },
];

// Перемешиваем призы для случайного распределения
function shuffleArray(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

let revealedPrize = null;

function createScratchCard(index, prize) {
  const container = document.createElement("div");
  container.className = "scratch-card-container";
  container.dataset.index = index;
  container.dataset.prize = prize.amount;

  // Приз под scratch
  const prizeElement = document.createElement("div");
  prizeElement.className = `scratch-card-prize ${prize.class}`;
  prizeElement.textContent = prize.amount;

  // Canvas для scratch
  const canvas = document.createElement("canvas");
  canvas.className = "scratch-card-canvas";

  container.appendChild(prizeElement);
  container.appendChild(canvas);

  // Scratch функциональность
  let isDrawing = false;
  let scratchedPixels = 0;
  let totalPixels = 1; // Будет обновлено после resize
  const threshold = 0.45; // 45% порог

  const ctx = canvas.getContext("2d");

  // Устанавливаем размеры canvas
  function resizeCanvas() {
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    totalPixels = canvas.width * canvas.height; // Обновляем после установки размера
    drawOverlay();
  }

  // Рисуем серебристый overlay
  function drawOverlay() {
    ctx.fillStyle = "#C0C0C0";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Добавляем текстуру
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#C0C0C0");
    gradient.addColorStop(0.5, "#E0E0E0");
    gradient.addColorStop(1, "#C0C0C0");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Добавляем noise
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < imageData.data.length; i += 4) {
      const noise = Math.random() * 30 - 15;
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noise));
      imageData.data[i + 1] = Math.max(
        0,
        Math.min(255, imageData.data[i + 1] + noise)
      );
      imageData.data[i + 2] = Math.max(
        0,
        Math.min(255, imageData.data[i + 2] + noise)
      );
    }
    ctx.putImageData(imageData, 0, 0);

    // Добавляем текст "SCRATCH HERE"
    ctx.fillStyle = "#333333";
    ctx.font = "bold 10px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SCRATCH HERE", canvas.width / 2, canvas.height / 2);
  }

  // Инициализируем canvas после добавления в DOM
  setTimeout(() => {
    resizeCanvas();
  }, 100);

  // Обновляем размеры при изменении размера окна
  window.addEventListener("resize", () => {
    resizeCanvas();
  });

  function getPixel(x, y) {
    const imageData = ctx.getImageData(Math.floor(x), Math.floor(y), 1, 1);
    return imageData.data;
  }

  function scratchAt(x, y) {
    const radius = 15;
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    // Подсчитываем стёртые пиксели (примерно)
    scratchedPixels += Math.PI * radius * radius;
  }

  function checkScratchProgress() {
    const percentage = scratchedPixels / totalPixels;
    if (percentage >= threshold && !container.classList.contains("scratched")) {
      container.classList.add("scratched");
      revealedPrize = prize.amount;
      setTimeout(() => {
        showModal(prize);
      }, 300);
    }
  }

  // Touch события
  function getEventPos(e) {
    const rect = canvas.getBoundingClientRect();

    // Если canvas еще не инициализирован, инициализируем его
    if (canvas.width === 0 || canvas.height === 0) {
      resizeCanvas();
    }

    const scaleX = canvas.width / rect.width || 1;
    const scaleY = canvas.height / rect.height || 1;

    if (e.touches && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY,
      };
    }
  }

  function startScratch(e) {
    e.preventDefault();
    isDrawing = true;
    const pos = getEventPos(e);
    scratchAt(pos.x, pos.y);
    checkScratchProgress();
  }

  function continueScratch(e) {
    e.preventDefault();
    if (isDrawing) {
      const pos = getEventPos(e);
      scratchAt(pos.x, pos.y);
      checkScratchProgress();
    }
  }

  function stopScratch(e) {
    e.preventDefault();
    isDrawing = false;
  }

  // Desktop
  canvas.addEventListener("mousedown", startScratch);
  canvas.addEventListener("mousemove", continueScratch);
  canvas.addEventListener("mouseup", stopScratch);
  canvas.addEventListener("mouseleave", stopScratch);

  // Mobile
  canvas.addEventListener("touchstart", startScratch, { passive: false });
  canvas.addEventListener("touchmove", continueScratch, { passive: false });
  canvas.addEventListener("touchend", stopScratch, { passive: false });
  canvas.addEventListener("touchcancel", stopScratch, { passive: false });

  return container;
}

function initScratchCards() {
  const grid = document.getElementById("scratch-grid");
  if (!grid) return;

  const shuffledPrizes = shuffleArray(prizes);
  grid.innerHTML = "";

  shuffledPrizes.forEach((prize, index) => {
    const card = createScratchCard(index, prize);
    grid.appendChild(card);
  });
}

// ═══════════════════════════════════════════════════════════════════
// Live Ticker
// ═══════════════════════════════════════════════════════════════════

const tickerActions = ["won", "scratched", "claimed", "playing now"];
const tickerPrizes = ["₦3,000", "₦5,000", "₦10,000"];

function generateTickerNotification() {
  // Используем имена из ближайшего поддерживаемого города или дефолт
  const cityForNames = SUPPORTED_CITIES.includes(detectedCity)
    ? detectedCity
    : SUPPORTED_CITIES[0] || "Nigeria";
  const cityNames = names[cityForNames] || names["Nigeria"];
  const name = cityNames[Math.floor(Math.random() * cityNames.length)];
  const action =
    tickerActions[Math.floor(Math.random() * tickerActions.length)];
  const prize = action.includes("won")
    ? tickerPrizes[Math.floor(Math.random() * tickerPrizes.length)]
    : "";
  const timeAgo =
    action === "playing now"
      ? "just now"
      : `${Math.floor(Math.random() * 10) + 1} min ago`;

  // Используем реальный обнаруженный город в тексте
  let text = `${name} from ${detectedCity} ${action}`;
  if (prize) {
    text += ` ${prize}`;
  }
  text += ` - ${timeAgo}`;

  return text;
}

function addTickerNotification(text) {
  const ticker = document.getElementById("ticker");
  if (!ticker) return;

  const item = document.createElement("div");
  item.className = "ticker-item";
  item.textContent = text;
  ticker.appendChild(item);

  // Удаляем старые элементы (оставляем последние 5)
  while (ticker.children.length > 5) {
    ticker.removeChild(ticker.firstChild);
  }
}

function initTicker() {
  // Добавляем начальные уведомления
  for (let i = 0; i < 3; i++) {
    addTickerNotification(generateTickerNotification());
  }

  // Добавляем новые каждые 8-12 секунд
  setInterval(() => {
    addTickerNotification(generateTickerNotification());
  }, Math.floor(Math.random() * 4000) + 8000);
}

// ═══════════════════════════════════════════════════════════════════
// Modal
// ═══════════════════════════════════════════════════════════════════

function showModal(prize) {
  const modal = document.getElementById("modal-overlay");
  const modalPrize = document.getElementById("modal-prize");

  if (modal && modalPrize) {
    modalPrize.textContent = `You revealed ${prize.amount}`;
    modal.classList.add("active");
    startConfetti();

    // Автоматический редирект через 3 секунды
    setTimeout(() => {
      window.location.href = OFFER_URL;
    }, 3000);
  }
}

function initModal() {
  const modal = document.getElementById("modal-overlay");
  if (!modal) return;

  // Закрытие при клике на overlay (опционально)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.classList.remove("active");
    }
  });
}

// ═══════════════════════════════════════════════════════════════════
// Confetti Animation
// ═══════════════════════════════════════════════════════════════════

function startConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ["#FFCC00", "#00C853", "#000000", "#FFD700", "#FF9800"];
  const particleCount = 100;

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 4,
      vy: Math.random() * 3 + 2,
      size: Math.random() * 6 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 10,
    });
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let activeParticles = 0;
    particles.forEach((particle) => {
      if (particle.y < canvas.height) {
        activeParticles++;
        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.rotation += particle.rotationSpeed;
        particle.vy += 0.1; // гравитация

        ctx.save();
        ctx.translate(particle.x, particle.y);
        ctx.rotate((particle.rotation * Math.PI) / 180);
        ctx.fillStyle = particle.color;
        ctx.fillRect(
          -particle.size / 2,
          -particle.size / 2,
          particle.size,
          particle.size
        );
        ctx.restore();
      }
    });

    if (activeParticles > 0) {
      requestAnimationFrame(animate);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

  animate();
}

// ═══════════════════════════════════════════════════════════════════
// Initialization
// ═══════════════════════════════════════════════════════════════════

document.addEventListener("DOMContentLoaded", () => {
  // Обновляем все ссылки с UTM метками
  updateOfferLinks();

  // Инициализация победителей с дефолтным городом
  updateWinners("Nigeria");

  // Определение города
  detectCity();

  // Таймер
  updateTimer();
  setInterval(updateTimer, 1000);

  // Счётчик игроков
  setTimeout(() => {
    setInterval(updateCounter, 30000); // Каждые 30 секунд
  }, 5000); // Начинаем через 5 секунд

  // Scratch cards
  initScratchCards();

  // Ticker
  initTicker();

  // Modal
  initModal();

  // Обновление размеров canvas при изменении размера окна
  window.addEventListener("resize", () => {
    const canvas = document.getElementById("confetti-canvas");
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });
});
