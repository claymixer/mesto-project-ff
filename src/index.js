import "/src/pages/index.css";
import { initialCards } from "./components/cards.js";
import { createCard, deleteCard, handleLike } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";

const placesList = document.querySelector(".places__list");

initialCards
  .map((cardsElement) =>
    createCard(cardsElement, deleteCard, handleLike, handleImageClick)
  )
  .forEach((cardsElement) => placesList.append(cardsElement));

const openPopupButton = document.querySelector(".profile__edit-button"); // кнопка для открытия попапа
const closePopupButtons = document.querySelectorAll(".popup__close"); //крестики для закрытия попапа
const profileAddButton = document.querySelector(".profile__add-button"); // кнопка для открытия попапа через +
const popupProfoleEdit = document.querySelector(".popup_type_edit"); // окно попапа корректировки карточки
const popupAddCard = document.querySelector(".popup_type_new-card"); // окно попапа добавления карточки
const popupImage = document.querySelector(".popup_type_image"); // окно попапа img
const popupImageContent = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const popups = document.querySelectorAll(".popup"); //фон попап окна

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

export const newCardForm = document.querySelector('form[name="new-place"]');
const popupNewCard = document.querySelector(".popup_type_new-card");

const inputNameFormAddNewCard = newCardForm.querySelector(
  ".popup__input_type_card-name"
);
const inputLinkFormAddNewCard = newCardForm.querySelector(
  ".popup__input_type_url"
);

const formElementEdit = document.querySelector(
  '.popup__form[name="edit-profile"]'
); // Воспользуйтесь методом querySelector()
const nameInput = formElementEdit.querySelector(".popup__input_type_name"); // Воспользуйтесь инструментом .querySelector()
const jobInput = formElementEdit.querySelector(
  ".popup__input_type_description"
); // Воспользуйтесь инструментом .querySelector()

//функцию обработки клика по изображению карточки
export function handleImageClick(name, link) {
  popupImageContent.src = link;
  popupImageContent.alt = name;
  popupImageCaption.textContent = name;
  openPopup(popupImage);
}

popups.forEach((popup) => {
  popup.addEventListener("click", (event) => {
    if (event.target === popup) {
      closePopup(popup);
    }
  });
});

openPopupButton.addEventListener("click", (popup) => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;

  openPopup(popupProfoleEdit);
});

profileAddButton.addEventListener("click", () => {
  openPopup(popupAddCard);
});

closePopupButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const popupOpened = document.querySelector(".popup_is-opened");
    closePopup(popupOpened);
  });
});

// Обработчик «отправки» формы, хотя пока // она никуда отправляться не будет
function profileEditHandleFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  // Так мы можем определить свою логику отправки.
  // О том, как это делать, расскажем позже.

  // Получите значение полей jobInput и nameInput из свойства value
  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  // Вставьте новые значения с помощью textContent
  profileTitle.textContent = nameValue;
  profileDescription.textContent = jobValue;

  closePopup(popupProfoleEdit);
}
// Прикрепляем обработчик к форме:// он будет следить за событием “submit” - «отправка»
formElementEdit.addEventListener("submit", profileEditHandleFormSubmit);

newCardForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение формы
  const name = inputNameFormAddNewCard.value;
  const link = inputLinkFormAddNewCard.value;

  // Создаем новую карточку
  const newCard = createCard(
    { name, link },
    deleteCard,
    handleLike,
    handleImageClick
  );

  // Добавляем новую карточку в начало списка
  placesList.prepend(newCard);
  // Очищаем форму
  newCardForm.reset();
  // Закрываем попап
  closePopup(popupNewCard);
});
