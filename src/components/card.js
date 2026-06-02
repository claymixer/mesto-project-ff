const cardTemplate = document.querySelector("#card-template").content;

const isCardLiked = (likes, currentUserId) =>
  likes.some((user) => user._id === currentUserId);

const getCardLikeStatus = (cardElement) => {
  const likeButton = cardElement.querySelector(".card__like-button");

  return likeButton.classList.contains("card__like-button_is-active");
};

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

  if (isCardLiked(likes, currentUserId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  cardImage.addEventListener("click", () => handleImageClick(name, link));

  likeButton.addEventListener("click", () => {
    handleLike(cardsElement, getCardLikeStatus(cardsElement), _id);
  });

  return cardsElement;
};

export function deleteCard(cardsElement) {
  cardsElement.remove();
}

export const updateCardLike = (cardElement, { likes = [] }) => {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCount = cardElement.querySelector(".card__like-count");

  likeButton.classList.toggle("card__like-button_is-active");
  likeCount.textContent = likes.length;
};
