function animation() {

  const targets = [ // контейнеры, за которыми нужно следить
    document.querySelector('.about-me__skills'), // контейнер с блоками в секции aboutme
    document.querySelector('.progress'), // контейнер с блоками с процентами
  ];

  const toolBlocks = document.querySelectorAll('.tool'); // блоки в секции tools
  toolBlocks.forEach((item, i) => {
    targets.push(item); // добавляет каждый элемент из nodelist в массив targets
    item.style.opacity = '0'; // сначала прозрачные
    item.style.transition = `all 0.6s linear ${i / 5}s`; // задержка анимации для каждого следующего элемента
  });

  const observer = new IntersectionObserver(callback, {
    rootMargin: '0px 0px -100px 0px', // поля как в CSS, меняют срабатывание события пересечения
  }); // создается объект observer. {} это разные опции

  targets.forEach((target) => {
    observer.observe(target); // метод observe запускает "слежку" за элементами в константе target
  });

  const skillBlocks = document.querySelectorAll('.skill'); // блоки в секции about-me, которые будут выезжать справа
  skillBlocks.forEach((item, i) => {
    item.style.transform = `translateX(100vw)`; // начальное смещение за границу блока
    item.style.transition = `all 0.6s linear ${i / 5}s`; // задержка анимации для каждого следующего элемента
  });

  function callback(entries) { // делаем что-либо для каждого отслеживаемого контейнера
    entries.forEach((entry) => { // entry это объект события

      if (entry.isIntersecting && entry.target.matches('.about-me__skills')) { // действие, когда элемент входит в область наблюдения (по умолчанию это видимая часть страницы)
        skillBlocks.forEach((item) => { // cмещает блоки skills справа на свое место
          item.style.transform = `translateX(0)`;
        });
        observer.unobserve(entry.target); // удаляет обработчик событий
      }

      if (entry.isIntersecting && entry.target.matches('.progress')) { // действие, когда элемент входит в область наблюдения (по умолчанию это видимая часть страницы)
        percentsAnimation(); // заполнение процентов
        observer.unobserve(entry.target); // удаляет обработчик событий
      }

      if (entry.isIntersecting && entry.target.matches('.tool')) { // действие, когда элемент входит в область наблюдения (по умолчанию это видимая часть страницы)
        entry.target.style.opacity = '1'; // блоки становятся непрозрачными
        observer.unobserve(entry.target); // удаляет обработчик событий
      }

    });
  }

  function percentsAnimation() { // заполнение процентов

    const progressFillBlocks = document.querySelectorAll('.progress__bar_fill'); // шкала с процентами
    const progressCounterBlocks = document.querySelectorAll('.progress__counter'); // цифры с процентами

    const value = [90, 90, 80, 75, 85, 5]; // значения, на которых остановится заполнение

    value.forEach((item, i) => {
      let p = 0;
      const id = setInterval(frame, 10); // тут можно поменять скорость заполнения
      function frame() {
        if (p === item) {
          clearInterval(id);
        } else {
          p++;
          progressFillBlocks[i].style.width = `${p}%`;
          progressCounterBlocks[i].textContent = `${p}%`;
        }
      }
    });
  }
}

export default animation;
