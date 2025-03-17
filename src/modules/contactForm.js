function contactForm() {
  const form = document.querySelector('.contacts__form');
  const formWrapper = document.querySelector('.contacts__form-wrapper');
  const formSent = document.querySelector('.contacts__form-sent');
  const resultMsg = document.querySelector('.contacts__result');
  const btn = document.querySelector('.contacts__btn');
  const backBtn = document.querySelector('.contacts__back-btn');
  const emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const BASE_URL = import.meta.env.DEV ? '/backend/api.php' : '/api.php';  // При `npm run dev` идет через Vite Proxy / После сборки (на реальном хостинге) без прокси

  const name = new Input('#name', '#name-err', { required: true, min: 3 });
  const email = new Input('#email', '#email-err', { required: true, reg: emailRegExp });
  const text = new Input('#text', '#text-err', { required: true, min: 5 });

  [name, email, text].forEach((input) => {
    input.elem.addEventListener('focus', () => {
      input.clearErr();
    });
    input.elem.addEventListener('blur', () => {
      input.check();
    });
  });

  function Input(elem, elemErr, checks = {}) {
    this.elem = document.querySelector(elem);
    this.elemErr = document.querySelector(elemErr);
    this.checks = checks;

    this.check = function () {
      // валидация
      if (this.checks.required && !this.elem.value) {
        this.showErr('Заполните поле');
      } else if (this.checks.min && this.elem.value.length < this.checks.min) {
        this.showErr(`Введите не менее ${this.checks.min} символов`);
      } else if (this.checks.reg && !this.checks.reg.test(this.elem.value)) {
        this.showErr('Недопустимый формат');
      } else {
        this.clearErr();
      }
    };

    this.showErr = function (message) {
      this.elemErr.textContent = message;
      this.elemErr.style.display = 'block';
      this.elem.style.borderColor = 'red';
    };

    this.clearErr = function () {
      this.elemErr.style.display = 'none';
      this.elemErr.textContent = '';
      this.elem.style.borderColor = 'unset';
    };
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    name.check();
    email.check();
    text.check();

    if (!name.elemErr.textContent && !email.elemErr.textContent && !text.elemErr.textContent) {
      btn.setAttribute('disabled', ''); // блокирует кнопку, пока не пришел ответ

      const formData = {
        name: name.elem.value,
        email: email.elem.value,
        text: text.elem.value,
      };
      const response = await postData(BASE_URL, formData); // await cюда и async в начале, чтобы результат был после обработки запроса

      btn.removeAttribute('disabled', '');

      if (response.success) {
        // форма успешно отправлена
        resetForm();
        showResult(true, 'Спасибо! Я свяжусь с вами как можно скорее');
      } else {
        // ошибки валидации формы на сервере подсвечиваются прямо в форме
        if (response.error.nameErr) name.showErr(response.error.nameErr);
        if (response.error.emailErr) email.showErr(response.error.emailErr);
        if (response.error.textErr) text.showErr(response.error.textErr);
        if (!response.error.nameErr && !response.error.emailErr && !response.error.textErr) {
          showResult(false, `Ошибка: ${response.error}`); // другие ошибки
        }
      }
    }
  });

  function resetForm() {
    name.elem.value = '';
    email.elem.value = '';
    text.elem.value = '';
  }

  async function postData(url, data) {
    try {
      const response = await fetch(url, {
        method: 'POST', // POST это отправка, GET получение
        headers: {
          'Content-Type': 'application/json', // Указываем, что отправляемые данные в формате JSON
        },
        body: JSON.stringify(data), // Тело запроса в формате JSON, если запрос GET, то не нужно
      });

      const json = await response.json().catch((error) => {
        throw new Error(error);
      }); // здесь тоже обязательно await, потому что text() и json() это промисы, (await это то же самое, что .then) catch(() => {}) - защита от ошибки парсинга json при 404

      return json;

    } catch (error) {
      return { error: error.message };
    }
  }

  function showResult(isSuccess, message) {
    // Выводит сообщение об отправке
    resultMsg.textContent = message;
    resultMsg.style.color = isSuccess ? 'black' : 'red';
    formWrapper.style.display = 'none';
    formSent.style.display = 'flex';
    backBtn.addEventListener('click', () => {
      formWrapper.style.display = 'flex';
      formSent.style.display = 'none';
    });
  }
}

export default contactForm;
