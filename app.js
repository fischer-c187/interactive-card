const validation = {
  'owner-name': {
    errorMessage: 'Wrong format, text only',
    condition: /^[A-Za-z-\s]+$/,
    length: 1,
    eventOn: 'front-card__name',
    valid: false,
  },
  number: {
    errorMessage: 'Wrong format, numbers only',
    condition: /^\d{16}$/,
    eventOn: 'front-card__number',
    length: 16,
    valid: false,
  },
  'expiry-month': {
    errorMessage: 'Wrong format, numbers only',
    condition: /^([0-9]|1[0-2])$/,
    eventOn: 'month',
    length: 2,
    valid: false,
  },
  'expiry-year': {
    errorMessage: 'Wrong format, numbers only',
    condition: /^2[3-9]|[3-9][0-9]$/,
    eventOn: 'year',
    length: 2,
    valid: false,
  },
  cvc: {
    errorMessage: 'Wrong format, numbers only',
    condition: /^\d{3}$/,
    eventOn: 'back-card__cvc',
    length: 3,
    valid: false,
  },
};

const cardInformation = {
  'front-card__number': {
    defaultText: '0000 0000 0000 0000'
  },
  'front-card__name': {
    defaultText: 'Jane Appleseed'
  },
  month: {
    defaultText: '00'
  },
  year: {
    defaultText: '00'
  },
  'back-card__cvc': {
    defaultText: '000'
  }
};

function regexTest(regex, text) {
  return regex.test(text.replaceAll(' ', ''));
}

function spaceCardNumber() {
  this.value = this.value
    .replaceAll(' ', '')
    .split('')
    .map((element, key) => {
      if (!((key + 1) % 4)) {
        return element + ' ';
      }
      return element;
    })
    .join('')
    .trim();
}

function enableError (element, error) {
  element.parentElement.setAttribute('data-error-visible', 'true')
  element.parentElement.setAttribute('error-message', error)
  validation[element.name].valid = false
}

function disableError (element) {
  element.parentElement.setAttribute('data-error-visible', 'false')
  validation[element.name].valid = true

}

function inputValid() {
  const condition = validation[this.name].condition
  const value = this.value
  const name = this.name
  const length = validation[name].length

  if (regexTest(condition, value)) {
    disableError(this);
  }
  else if (value === ''){
    enableError(this, 'Can\'t be blank')
  }
  else if (value.replaceAll(' ', '').length < length) {
    enableError(this, 'not enough character')
  }
  else {
    enableError(this, validation[name].errorMessage)
  }
}

function launchEvent (elementClass, event) {
  const element = document.querySelector(`.${elementClass}`)
  element.dispatchEvent(event)
}

function createEvent (eventName, message) {
  return new CustomEvent(
    eventName,
    { bubbles: true, detail: { message: message } }
  )
}

function displayInfo (event) {
  const elementName = validation[event.target.name].eventOn

  launchEvent(elementName, createEvent('updateInfo', event.target.value))
}

function setInfo (event) {
  const name = event.target.className
  const element = event.target

  if(event.detail.message === '') {
    element.innerText = cardInformation[name].defaultText
  }
  else {
    element.innerText = event.detail.message
  }

}

function initializeCardDisplay () {
  let element
  for(let name of Object.keys(cardInformation)){
    element = document.querySelector(`.${name}`)
    element.addEventListener('updateInfo', setInfo)

  }
}

function initializeValidityEvent() {
  const elements = [];
  let element = '';
  // initialize all input event
  for (let name of Object.keys(validation)) {
    element = document.querySelector(`input[name=${name}]`);
    element.addEventListener('input', inputValid);
    element.addEventListener('input', displayInfo);
    element.addEventListener('blur', inputValid);
    if(name === 'number') {
      element.addEventListener('input', spaceCardNumber);
    }

    // put the element true or false if the input is good before refresh
    validation[name].valid = regexTest(
      validation[name].condition,
      element.value);

    // if value in cache/refresh we display it on card
    launchEvent(
      validation[element.name].eventOn,
      createEvent('updateInfo', element.value)
    )

    elements.push(element);
  }

  return elements
}

/**
 * Creates an HTML element.
 * 
 * @param {string} tag the tag for our element
 * @param {string} className the classes to add to our element
 * @param {string} value the element value
 * @returns {Element}
 */ 
function createElement(tag, className, value = '') {
  const element = document.createElement(tag);
  element.setAttribute('class', className);
  element.innerText = value;
  return element;
}

function displaySuccessMessage () {
  const form = document.querySelector('form')
  const img = createElement('img', 'successful__img')
  img.src = './images/icon-complete.svg'
  const title = createElement('p', 'successful__title', 'thank you!')
  const detail = createElement('p', 'successful__detail', 'We’ve added your card details')
  const continueBtn = createElement('button', 'btn successful__btn', 'Continue')

  form.innerHTML = ''
  form.append(img, title, detail, continueBtn)
}

function formValid (event) {
  event.preventDefault();

  let isValid = true;
  for (let key of Object.keys(validation)) {
    if (!validation[key].valid) {
      isValid = false;
      enableError(
        document.querySelector(`input[name=${key}]`),
        validation[key].errorMessage
      );
    }
  }
  if (isValid) {
    displaySuccessMessage();
  }
}




const btnSubmit = document.querySelector('.btn')
btnSubmit.addEventListener('click', formValid)
initializeCardDisplay()
const elements = initializeValidityEvent()

