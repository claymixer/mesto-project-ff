const cardTemplate = document.querySelector("#card-template").content;

export const createCard = (
  { name, link, likes = [], owner, _id },
  deleteCard,
  handleLike,
  handleImageClick,
  currentUserId
) => {
  const cardsElement = cardTemplate.querySelector(".card").cloneNode(true);
  const likeButton = cardsElement.querySelector(".card__like-button");
  const likeCount = cardsElement.querySelector(".card__like-count");
  const cardImage = cardsElement.querySelector(".card__image");
  const deleteButton = cardsElement.querySelector(".card__delete-button");

  cardsElement.querySelector(".card__title").textContent = name;
  likeCount.textContent = likes.length;
  cardImage.alt = name;
  cardImage.src = link;

  if (!owner || owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => deleteCard(cardsElement, _id));
  }

  if (likes.some((user) => user._id === currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  cardImage.addEventListener("click", () => handleImageClick(name, link));

  likeButton.addEventListener("click", () =>
    handleLike(_id, likeButton, likeCount)
  );

  return cardsElement;
};

export function deleteCard(cardsElement) {
  cardsElement.remove();
}
