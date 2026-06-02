const setInputCustomValidity = (inputElement) => {
  inputElement.setCustomValidity("");

  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  }
};

const getErrorElement = (formElement, inputElement) =>
  formElement.querySelector(`#${inputElement.id}-error`);

const createErrorElement = (inputElement) => {
  const existingErrorElement = document.querySelector(
    `#${inputElement.id}-error`
  );

  if (existingErrorElement) {
    return existingErrorElement;
  }

  const errorElement = document.createElement("p");
  errorElement.classList.add("popup__input-error");
  errorElement.id = `${inputElement.id}-error`;
  inputElement.setAttribute("aria-describedby", errorElement.id);
  inputElement.after(errorElement);

  return errorElement;
};

const showInputError = (formElement, inputElement, validationConfig) => {
  const errorElement =
    getErrorElement(formElement, inputElement) ||
    createErrorElement(inputElement);
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.textContent = inputElement.validationMessage;
  errorElement.classList.add(validationConfig.errorClass);
};

const hideInputError = (formElement, inputElement, validationConfig) => {
  const errorElement = getErrorElement(formElement, inputElement);
  inputElement.classList.remove(validationConfig.inputErrorClass);
  inputElement.removeAttribute("aria-describedby");

  if (errorElement) {
    errorElement.textContent = "";
    errorElement.classList.remove(validationConfig.errorClass);
    errorElement.remove();
  }
};

const checkInputValidity = (formElement, inputElement, validationConfig) => {
  setInputCustomValidity(inputElement);

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, validationConfig);
  } else {
    hideInputError(formElement, inputElement, validationConfig);
  }
};

const hasInvalidInput = (inputList) =>
  inputList.some((inputElement) => !inputElement.validity.valid);

const toggleButtonState = (inputList, buttonElement, validationConfig) => {
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true;
    buttonElement.classList.add(validationConfig.inactiveButtonClass);
  } else {
    buttonElement.disabled = false;
    buttonElement.classList.remove(validationConfig.inactiveButtonClass);
  }
};

const setEventListeners = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  toggleButtonState(inputList, buttonElement, validationConfig);

  inputList.forEach((inputElement) => {
    inputElement.addEventListener("input", () => {
      checkInputValidity(formElement, inputElement, validationConfig);
      toggleButtonState(inputList, buttonElement, validationConfig);
    });
  });
};

export const enableValidation = (validationConfig) => {
  const formList = Array.from(
    document.querySelectorAll(validationConfig.formSelector)
  );

  formList.forEach((formElement) => {
    formElement.addEventListener("submit", (event) => {
      event.preventDefault();
    });

    setEventListeners(formElement, validationConfig);
  });
};

export const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );
  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  inputList.forEach((inputElement) => {
    inputElement.setCustomValidity("");
    hideInputError(formElement, inputElement, validationConfig);
  });

  toggleButtonState(inputList, buttonElement, validationConfig);
};
