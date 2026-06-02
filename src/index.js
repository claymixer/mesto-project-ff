import "/src/pages/index.css";
import { createCard, deleteCard, updateCardLike } from "./components/card.js";
import { openPopup, closePopup } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  getUserInfo,
  getInitialCards,
  updateUserInfo,
  updateUserAvatar,
  addCard,
  deleteCardFromServer,
  changeLikeCardStatus,
} from "./components/api.js";

const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};

const placesList = document.querySelector(".places__list");
let currentUserId;

const setSubmitButtonText = (formElement, text) => {
  const submitButton = formElement.querySelector(
    validationConfig.submitButtonSelector
  );
  submitButton.textContent = text;
};

const openEditProfilePopupButton = document.querySelector(".profile__edit-button"); // кнопка для открытия попапа
const closePopupButtons = document.querySelectorAll(".popup__close"); //крестики для закрытия попапа
const profileAddButton = document.querySelector(".profile__add-button"); // кнопка для открытия попапа через +
const popupProfoleEdit = document.querySelector(".popup_type_edit"); // окно попапа корректировки карточки
const popupAddCard = document.querySelector(".popup_type_new-card"); // окно попапа добавления карточки
const popupDeleteCard = document.querySelector(".popup_type_delete-card");
const popupAvatar = document.querySelector(".popup_type_avatar");
const popupImage = document.querySelector(".popup_type_image"); // окно попапа img
const popupImageContent = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");
const popups = document.querySelectorAll(".popup"); //фон попап окна

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileImage = document.querySelector(".profile__image");

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
const deleteCardForm = document.querySelector('.popup__form[name="delete-card"]');
const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');
const nameInput = formElementEdit.querySelector(".popup__input_type_name"); // Воспользуйтесь инструментом .querySelector()
const jobInput = formElementEdit.querySelector(
  ".popup__input_type_description"
); // Воспользуйтесь инструментом .querySelector()
const avatarInput = avatarForm.querySelector(".popup__input_type_avatar");
let cardPendingDelete;

const handleCardDeleteClick = (cardElement, cardId) => {
  cardPendingDelete = {
    element: cardElement,
    id: cardId,
  };
  openPopup(popupDeleteCard);
};

const handleCardLike = (cardElement, isLiked, cardId) => {
  changeLikeCardStatus(cardId, isLiked)
    .then((card) => {
      updateCardLike(cardElement, card);
    })
    .catch((err) => {
      console.log(err);
    });
};

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileImage.style.backgroundImage = `url(${userData.avatar})`;

    cards
      .map((card) =>
        createCard(
          card,
          handleCardDeleteClick,
          handleCardLike,
          handleImageClick,
          currentUserId
        )
      )
      .forEach((cardElement) => placesList.append(cardElement));
  })
  .catch((err) => {
    console.log(err);
  });

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

openEditProfilePopupButton.addEventListener("click", (popup) => {
  nameInput.value = profileTitle.textContent;
  jobInput.value = profileDescription.textContent;
  clearValidation(formElementEdit, validationConfig);

  openPopup(popupProfoleEdit);
});

profileAddButton.addEventListener("click", () => {
  newCardForm.reset();
  clearValidation(newCardForm, validationConfig);
  openPopup(popupAddCard);
});

profileImage.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openPopup(popupAvatar);
});

closePopupButtons.forEach((button) => {
  const popup = button.closest(".popup");

  button.addEventListener("click", () => {
    closePopup(popup);
  });
});

// Обработчик «отправки» формы, хотя пока // она никуда отправляться не будет
function profileEditHandleFormSubmit(evt) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы.
  // Так мы можем определить свою логику отправки.
  // О том, как это делать, расскажем позже.

  const nameValue = nameInput.value;
  const jobValue = jobInput.value;

  setSubmitButtonText(formElementEdit, "Сохранение...");
  updateUserInfo({
    name: nameValue,
    about: jobValue,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closePopup(popupProfoleEdit);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonText(formElementEdit, "Сохранить");
    });
}
// Прикрепляем обработчик к форме:// он будет следить за событием “submit” - «отправка»
enableValidation(validationConfig);
formElementEdit.addEventListener("submit", profileEditHandleFormSubmit);

newCardForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Предотвращаем стандартное поведение формы

  const name = inputNameFormAddNewCard.value;
  const link = inputLinkFormAddNewCard.value;

  setSubmitButtonText(newCardForm, "Сохранение...");
  addCard({ name, link })
    .then((card) => {
      const newCard = createCard(
        card,
        handleCardDeleteClick,
        handleCardLike,
        handleImageClick,
        currentUserId
      );

      placesList.prepend(newCard);
      closePopup(popupNewCard);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonText(newCardForm, "Сохранить");
    });
});

deleteCardForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cardPendingDelete) {
    return;
  }

  deleteCardFromServer(cardPendingDelete.id)
    .then(() => {
      deleteCard(cardPendingDelete.element);
      closePopup(popupDeleteCard);
      cardPendingDelete = null;
    })
    .catch((err) => {
      console.log(err);
    });
});

avatarForm.addEventListener("submit", (event) => {
  event.preventDefault();

  setSubmitButtonText(avatarForm, "Сохранение...");
  updateUserAvatar(avatarInput.value)
    .then((userData) => {
      profileImage.style.backgroundImage = `url(${userData.avatar})`;
      closePopup(popupAvatar);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      setSubmitButtonText(avatarForm, "Сохранить");
    });
});
