
// // Находим элементы в HTML-документе 
// const container = document.getElementById("heroesContainer"); 
// const searchInput = document.getElementById("searchInput"); 
// const levelSort = document.getElementById("levelSort"); 
// const buttons = document.querySelectorAll(".filter-btn"); 

// // Единый источник правды: теперь при старте массив героев ПУСТОЙ!
// let heroes = []; 

// // СИНХРОНИЗАЦИЯ ПРИ СТАРТЕ 
// let currentSearch = "";  
// let currentFaction = localStorage.getItem("dash_faction") || "все"; 
// let currentSort = localStorage.getItem("dash_sort") || "default"; 
 
// // Функция загрузки героев из сети
// async function loadHeroes() {
//   container.innerHTML = "<p class='loading'>Загрузка героев из сети...</p>";

//   // 1. fetch-запрос: браузер отправляет запрос, а интерпретатор ставит функцию на паузу
//   const response = await fetch('https://6a5fab39b1933e9d25fc947f.mockapi.io/heroes'); // Твой URL с MockAPI
  
//   // 2. Вторая пауза: ждем, пока докачаются все пакеты текста, и парсим их в JS-массив
//   heroes = await response.json();

//   // Шаг 2: Принудительно передаем сохраненные значения в элементы интерфейса 
//   searchInput.value = currentSearch; 
//   levelSort.value = currentSort; 
   
//   // Шаг 3: Лечим баг подсветки — полностью сбрасываем класс active у ВСЕХ кнопок 
//   buttons.forEach(function(btn) {  
//     btn.classList.remove("active");  
//   }); 
   
//   // Шаг 4: Навешиваем класс active только на ту кнопку, которая реально сохранена в памяти 
//   buttons.forEach(function(button) { 
//     if (button.textContent.toLowerCase().trim() === currentFaction) { 
//       button.classList.add("active"); 
//     } 
//   }); 
   
//   // Шаг 5: Первичный запуск отрисовки (экран построится, когда данные из сети прилетели!) 
//   renderHeroes(); 
// }

// // ЗАПУСК АСИНХРОННОЙ ЗАГРУЗКИ ГЕРОЕВ
// loadHeroes();

// // СТАБИЛЬНАЯ ФУНКЦИЯ РЕНДЕРИНГА 
// function renderHeroes() { 
//   container.innerHTML = ""; // Очищаем контейнер перед новой отрисовкой 
    
//   // Копируем массив чтобы не испортить исходную базу данных heroes 
//   let sortedHeroes = [...heroes];
    
//   // 1. Сортировка по уровню 
//   if (currentSort === "asc") { 
//     sortedHeroes.sort(function(a, b) { return a.level - b.level; }); 
//   } else if (currentSort === "desc") { 
//     sortedHeroes.sort(function(a, b) { return b.level - a.level; }); 
//   } 
 
//   // 2. Сквозная фильтрация 
//   const filteredHeroes = sortedHeroes.filter(function(hero) { 
//     const isNameMatch = hero.name.toLowerCase().includes(currentSearch.toLowerCase()); 
//     const isFactionMatch = (currentFaction === "все" || hero.faction === currentFaction); 
    
//     return isNameMatch && isFactionMatch; 
//   }); 

//   // Чистый вывод на экран через .forEach()
//   filteredHeroes.forEach(function(hero) { 
//     const card = document.createElement("div"); 
//     card.classList.add("hero-card"); 
       
//     card.innerHTML = `
//       <div class="hero-avatar" style="background-color: ${hero.bg}">${hero.icon}</div>
//       <h3 class="hero-name">${hero.name}</h3>
//       <p class="hero-info">Фракция: <span class="badge ${hero.faction}">${hero.faction}</span></p>
//       <p class="hero-info">Уровень: <strong>${hero.level}</strong></p>
//       <p class="hero-info">Навык: <em>${hero.skill}</em></p>
//     `;

//     container.appendChild(card); 
//   });
// } 
 
// // ОБРАБОТЧИКИ СОБЫТИЙ (СЛУШАТЕЛИ) 
// searchInput.addEventListener("input", function() { 
//   currentSearch = searchInput.value; 
//   renderHeroes(); 
// }); 
 
// buttons.forEach(function(button) { 
//   button.addEventListener("click", function() { 
//     buttons.forEach(function(btn) { btn.classList.remove("active"); }); 
//     button.classList.add("active"); 
       
//     currentFaction = button.textContent.toLowerCase().trim(); 
//     localStorage.setItem("dash_faction", currentFaction); 
//     renderHeroes(); 
//   }); 
// }); 

// levelSort.addEventListener("change", function() { 
//   currentSort = levelSort.value; 
//   localStorage.setItem("dash_sort", currentSort); 
//   renderHeroes(); 
// });


// Находим элементы в HTML-документе 
const container = document.getElementById("heroesContainer"); 
const searchInput = document.getElementById("searchInput"); 
const levelSort = document.getElementById("levelSort"); 
const buttons = document.querySelectorAll(".filter-btn"); 

// Новый элемент — форма добавления героя
const addHeroForm = document.getElementById("addHeroForm");

// Единый URL нашего API (вынесли в постоянную константу)
const API_URL = 'https://6a5fab39b1933e9d25fc947f.mockapi.io/heroes';

// Единый источник правды: при старте массив героев ПУСТОЙ!
let heroes = []; 

// СИНХРОНИЗАЦИЯ ПРИ СТАРТЕ 
let currentSearch = "";  
let currentFaction = localStorage.getItem("dash_faction") || "все"; 
let currentSort = localStorage.getItem("dash_sort") || "default"; 
 
// 1. ФУНКЦИЯ ЗАГРУЗКИ ГЕРОЕВ ИЗ СЕТИ (GET)
async function loadHeroes() {
  container.innerHTML = "<p class='loading'>Загрузка героев из сети...</p>";

  const response = await fetch(API_URL);
  heroes = await response.json();

  // Принудительно передаем сохраненные значения в элементы интерфейса 
  searchInput.value = currentSearch; 
  levelSort.value = currentSort; 
    
  // Лечим баг подсветки — сбрасываем класс active у ВСЕХ кнопок 
  buttons.forEach(function(btn) { 
    btn.classList.remove("active"); 
  }); 
    
  // Навешиваем класс active на сохраненную фракцию 
  buttons.forEach(function(button) { 
    if (button.textContent.toLowerCase().trim() === currentFaction) { 
      button.classList.add("active"); 
    } 
  }); 
    
  // Первичный запуск отрисовки
  renderHeroes(); 
}

// ЗАПУСК АСИНХРОННОЙ ЗАГРУЗКИ ГЕРОЕВ
loadHeroes();

// 2. ФУНКЦИЯ РЕНДЕРИНГА
function renderHeroes() { 
  container.innerHTML = ""; // Очищаем контейнер 
    
  let sortedHeroes = [...heroes];
    
  // Сортировка по уровню 
  if (currentSort === "asc") { 
    sortedHeroes.sort(function(a, b) { return a.level - b.level; }); 
  } else if (currentSort === "desc") { 
    sortedHeroes.sort(function(a, b) { return b.level - a.level; }); 
  } 
 
  // Сквозная фильтрация 
  const filteredHeroes = sortedHeroes.filter(function(hero) { 
    const isNameMatch = hero.name.toLowerCase().includes(currentSearch.toLowerCase()); 
    const isFactionMatch = (currentFaction === "все" || hero.faction === currentFaction); 
    
    return isNameMatch && isFactionMatch; 
  }); 

  // Чистый вывод на экран через .forEach()
  filteredHeroes.forEach(function(hero) { 
    const card = document.createElement("div"); 
    card.classList.add("hero-card"); 
        
    card.innerHTML = `
      <div class="hero-avatar" style="background-color: ${hero.bg || '#3d3d5c'}">${hero.icon || '⚔️'}</div>
      <h3 class="hero-name">${hero.name}</h3>
      <p class="hero-info">Фракция: <span class="badge ${hero.faction}">${hero.faction}</span></p>
      <p class="hero-info">Уровень: <strong>${hero.level}</strong></p>
      <p class="hero-info">Навык: <em>${hero.skill}</em></p>
      <button class="delete-btn" data-id="${hero.id}">🗑️ Удалить</button>
    `;

    container.appendChild(card); 
  });

  // Навешиваем слушатели на созданные кнопки «Удалить»
  const deleteButtons = document.querySelectorAll(".delete-btn");
  deleteButtons.forEach(function(btn) {
    btn.addEventListener("click", function() {
      const heroId = btn.getAttribute("data-id");
      deleteHero(heroId);
    });
  });
} 

// 3. ФУНКЦИЯ УДАЛЕНИЯ ГЕРОЯ (DELETE)
async function deleteHero(id) {
  // Отправляем DELETE-запрос на адрес конкретного героя по его id
  await fetch(`${API_URL}/${id}`, {
    method: 'DELETE'
  });

  // Обновляем локальный массив (оставляем только тех, чей id не совпал с удаленным)
  heroes = heroes.filter(function(hero) {
    return hero.id !== id;
  });

  // Перерисовываем UI
  renderHeroes();
}

// 4. ОБРАБОТЧИК ФОРМЫ СОЗДАНИЯ ГЕРОЯ (POST)
addHeroForm.addEventListener("submit", async function(e) {
  e.preventDefault(); // Отменяем перезагрузку страницы

  // Собираем данные из полей ввода
  const newHero = {
    name: document.getElementById("heroName").value,
    level: Number(document.getElementById("heroLevel").value),
    faction: document.getElementById("heroFaction").value,
    skill: document.getElementById("heroSkill").value,
    icon: "⚔️", // Иконка по умолчанию
    bg: "#3d3d5c" // Фон по умолчанию
  };

  // Отправляем POST-запрос на MockAPI
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(newHero)
  });

  // Сервер возвращает созданный объект (с уже присвоенным серверным id)
  const createdHero = await response.json();

  // Добавляем его в наш массив и перерисовываем экран
  heroes.push(createdHero);
  renderHeroes();

  // Очищаем форму для следующего ввода
  addHeroForm.reset();
});

// ОБРАБОТЧИКИ СОБЫТИЙ СОРТИРОВКИ И ФИЛЬТРАЦИИ 
searchInput.addEventListener("input", function() { 
  currentSearch = searchInput.value; 
  renderHeroes(); 
}); 
 
buttons.forEach(function(button) { 
  button.addEventListener("click", function() { 
    buttons.forEach(function(btn) { btn.classList.remove("active"); }); 
    button.classList.add("active"); 
        
    currentFaction = button.textContent.toLowerCase().trim(); 
    localStorage.setItem("dash_faction", currentFaction); 
    renderHeroes(); 
  }); 
}); 

levelSort.addEventListener("change", function() { 
  currentSort = levelSort.value; 
  localStorage.setItem("dash_sort", currentSort); 
  renderHeroes(); 
});