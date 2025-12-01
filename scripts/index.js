// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard({name, link}, deleteCard) {    
    const cardsElement  = cardTemplate.querySelector('.card').cloneNode(true);

    cardsElement.querySelector('.card__title').textContent = name;
    cardsElement.querySelector('.card__image').alt = name;
    cardsElement.querySelector('.card__image').src = link;

    const deleteButton = cardsElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click',() => deleteCard(cardsElement));

    return cardsElement;
}
 
// @todo: Функция удаления карточки
function deleteCard(cardsElement) {
    cardsElement.remove(); 
}
// @todo: Вывести карточки на страницу
initialCards.map(cardsElement => createCard(cardsElement, deleteCard)).forEach((cardsElement) => placesList.append(cardsElement));
