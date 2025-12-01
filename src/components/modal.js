export const openPopup = (popup) => {
  popup.classList.add("popup_is-opened");
  document.addEventListener("keyup", handleEscKeyUp);
};

export const closePopup = (popup) => {
  popup.classList.remove("popup_is-opened");
  document.removeEventListener("keyup", handleEscKeyUp);
};

export function handleEscKeyUp(evt) {
  if (evt.key === "Escape") {
    const popupOpened = document.querySelector(".popup_is-opened");
    closePopup(popupOpened);
  }
}
