function modal(modalBlockSelector, modalOpenSelector, modalCloseSelector, arrowSelector) {
  // блок с модальным окном
  // блок при клике на который открывается окно
  // [блоки внутри окна, при клике на которые закрывается окно]
  // блок со стрелкой на первом экране

  const modalBlock = document.querySelector(modalBlockSelector);
  const modalLink = document.querySelector(modalOpenSelector);
  const arrow = document.querySelector(arrowSelector);

  modalLink.addEventListener('click', function() { // открывает окно при нажатии на элемент
    modalOpen();
  });

  modalBlock.addEventListener('click', (event) => { // закрывает окно при нажатии на modalCloseSelector
    modalCloseSelector.forEach((item) => {
      if (event.target.closest(item) && modalBlock.contains(event.target.closest(item))) {
        modalClose();
      }
    });
  });

  document.addEventListener('keydown', (event) => { // Закрывает окно при нажатии Esc
    if (event.code === 'Escape' && modalBlock.classList.contains('active')) {
      modalClose();
    }
  });

  function modalClose() {
    modalBlock.classList.remove('active'); // закрывает окно
    document.body.style.overflow = ''; // Возвращает прокрутку страницы
    if (arrow && document.documentElement.scrollTop === 0) { // если страница не прокручена
      arrow.style.display = 'block'; // показывает стрелку вниз
    }
  }
  
  function modalOpen() {
    modalBlock.classList.add('active'); // показывает окно
    document.body.style.overflow = 'hidden'; // Предотвращает прокрутку страницы, когда открыто меню
    if (arrow) {
      arrow.style.display = 'none'; // скрывает стрелку вниз
    }
  }

}

export default modal;

