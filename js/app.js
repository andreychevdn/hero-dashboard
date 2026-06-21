// 1. НАША ОФИЦИАЛЬНАЯ БАЗА ДАННЫХ ПЕРСОНАЖЕЙ
const heroes = [
  { name: "Громмаш Брутал", faction: "орки", level: 85, skill: "Яростный вихрь", bg: "#e67e22", icon: "🪓" },
  { name: "Гаррок Зубастый", faction: "орки", level: 42, skill: "Каменный щит", bg: "#d35400", icon: "🛡️" },
  { name: "Тралл Мудрый", faction: "орки", level: 90, skill: "Цепная молния", bg: "#ba4a00", icon: "⚡" },

  { name: "Леголас Профи", faction: "эльфы", level: 99, skill: "Стрела молнии", bg: "#2ecc71", icon: "🏹" },
  { name: "Иллидан Ночной", faction: "эльфы", level: 77, skill: "Танец клинков", bg: "#27ae60", icon: "⚔️" },
  { name: "Малфурион Лесной", faction: "эльфы", level: 88, skill: "Гнев природы", bg: "#1e8449", icon: "🍃" },

  { name: "Блицкранк 3000", faction: "роботы", level: 65, skill: "Реактивный хук", bg: "#3498db", icon: "🤖" },
  { name: "Орианна Стальная", faction: "роботы", level: 81, skill: "Ударная волна", bg: "#2980b9", icon: "⚙️" }
];

// Находим элементы в HTML-документе
const container = document.getElementById("heroesContainer");
const searchInput = document.getElementById("searchInput");
const levelSort = document.getElementById("levelSort");
const buttons = document.querySelectorAll(".filter-btn");

// ЕДИНЫЙ ИСТОЧНИК ПРАВДЫ (Глобальное состояние нашей программы)
// Эти переменные всегда хранят актуальные настройки, которые выбрал пользователь
// let currentSearch = "";
// let currentFaction = "все";
// let currentSort = "default";

// Проверяем localStorage. Если там пусто, используем значения по умолчанию.
let currentSearch = localStorage.getItem("dash_search") || "";
let currentFaction = localStorage.getItem("dash_faction") || "все";
let currentSort = localStorage.getItem("dash_sort") || "default";

// Подтягиваем сохраненные значения визуально в интерфейс при загрузке страницы:
searchInput.value = currentSearch;
levelSort.value = currentSort;

// Полный сброс классов active у ВСЕХ кнопок (удаляем дефолт из HTML)
buttons.forEach(function(btn) { 
  btn.classList.remove("active"); 
});

// Включаем подсветку только для той кнопки, которая реально активна в памяти
buttons.forEach(function(button) {
  if (button.textContent.toLowerCase().trim() === currentFaction) {
    button.classList.add("active");
  }
});


// СТАБИЛЬНАЯ ФУНКЦИЯ РЕНДЕРИНГА (Сквозная система фильтрации и сортировки)
function renderHeroes() {
  container.innerHTML = ""; // Стираем старые карточки перед новой отрисовкой
  
  // 📜 МЕТОД .slice() — БЕЗОПАСНОЕ КОПИРОВАНИЕ
  // Метод .slice() без аргументов создает точную поверхностную копию массива heroes.
  // Мы делаем это для того, чтобы оригинальный массив со всеми персонажами оставался нетронутым,
  // а сортировка происходила внутри временного массива sortedHeroes.
  let sortedHeroes = heroes.slice(); 
  
  // 1. СТРУКТУРА СОРТИРОВКИ
  if (currentSort === "asc") {
    sortedHeroes.sort(function(a, b) { return a.level - b.level; });
  } else if (currentSort === "desc") {
    sortedHeroes.sort(function(a, b) { return b.level - a.level; });
  }

  // 2. СКВОЗНАЯ ФИЛЬТРАЦИЯ (Пробегаем по скопированному массиву)
  sortedHeroes.forEach(function(hero) {
    
    // Переводим имя героя и поисковый запрос в нижний регистр для независимого поиска
    const heroNameLower = hero.name.toLowerCase();
    const searchLower = currentSearch.toLowerCase();
    
    // Проверка 1: Ищем совпадение букв в имени. 
    // Если в поиске пусто "", метод .includes("") вернет true для абсолютно каждого героя!
    const isNameMatch = heroNameLower.includes(searchLower);
    
    // Проверка 2: Проверяем фракцию героя.
    // Если активна кнопка "все", то левая часть (true) сразу одобряет героя, кем бы он ни был.
    const isFactionMatch = (currentFaction === "все" || hero.faction === currentFaction);
    
    // Рисуем карточку на экране, только если герой прошел ОБА фильтра одновременно (Логическое И)
    if (isNameMatch && isFactionMatch) {
      const card = document.createElement("div");
      card.classList.add("hero-card");
      
      card.innerHTML = 
        '<div class="hero-avatar" style="background-color: ' + hero.bg + '">' + hero.icon + '</div>' +
        '<h3 class="hero-name">' + hero.name + '</h3>' +
        '<p class="hero-info">Фракция: <span class="badge ' + hero.faction + '">' + hero.faction + '</span></p>' +
        '<p class="hero-info">Уровень: <strong>' + hero.level + '</strong></p>' +
        '<p class="hero-info">Навык: <em>' + hero.skill + '</em></p>';
      
      container.appendChild(card);
    }
  });
}

// ОБРАБОТЧИК 1: Живой поиск (Срабатывает при вводе/удалении букв)
searchInput.addEventListener("input", function() {
  currentSearch = searchInput.value; // Запоминаем точный текст из инпута в Единый источник правды
  localStorage.setItem("dash_search", currentSearch); // Сохраняем поиск
  renderHeroes(); // Перерисовываем экран с учетом новых данных
});

// ОБРАБОТЧИК 2: Кнопки фракций (Переключение активного класса и фильтра)
buttons.forEach(function(button) {
  button.addEventListener("click", function() {
    // Снимаем класс активности со всех кнопок и вешаем на ту, по которой кликнули
    buttons.forEach(function(btn) { btn.classList.remove("active"); });
    button.classList.add("active");
    
    currentFaction = button.textContent.toLowerCase(); // Сохраняем имя фракции (в нижнем регистре) в Источник правды
    localStorage.setItem("dash_faction", currentFaction); // Сохраняем фракцию
    renderHeroes(); // Перерисовываем экран
  });
});

// ОБРАБОТЧИК 3: Выпадающий список сортировки уровней
levelSort.addEventListener("change", function() {
  currentSort = levelSort.value; // Запоминаем режим сортировки ("default", "asc" или "desc")
  localStorage.setItem("dash_sort", currentSort); // Сохраняем сортировку
  renderHeroes(); // Перерисовываем экран
});

// ПЕРВИЧНЫЙ ЗАПУСК
// Генерируем карточки первый раз при загрузке страницы, используя дефолтные настройки
renderHeroes();