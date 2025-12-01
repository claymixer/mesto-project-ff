const cardTemplate = document.querySelector("#card-template").content;

export const createCard = (
  { name, link },
  deleteCard,
  handleLike,
  handleImageClick
) => {
  const cardsElement = cardTemplate.querySelector(".card").cloneNode(true);
  const likeButton = cardsElement.querySelector(".card__like-button");
  const cardImage = cardsElement.querySelector(".card__image");
  const deleteButton = cardsElement.querySelector(".card__delete-button");

  cardsElement.querySelector(".card__title").textContent = name;
  cardsElement.querySelector(".card__image").alt = name;
  cardsElement.querySelector(".card__image").src = link;

  deleteButton.addEventListener("click", () => deleteCard(cardsElement));

  cardImage.addEventListener("click", () => handleImageClick(name, link));

  likeButton.addEventListener("click", handleLike);

  return cardsElement;
};

export function handleLike(evt) {
  if (evt.target.classList.contains("card__like-button"))
    evt.target.classList.toggle("card__like-button_is-active");
}

export function deleteCard(cardsElement) {
  cardsElement.remove();
}
