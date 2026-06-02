const config = {
  baseUrl: "https://mesto.nomoreparties.co/v1/web-magistracy-2",
  headers: {
    authorization: "4ba26102-aa45-4fce-b02a-4015c0a7cc74",
    "Content-Type": "application/json",
  },
};

const checkResponse = (res) => {
  if (res.ok) {
    return res.json();
  }

  return Promise.reject(`Ошибка: ${res.status}`);
};

export const getUserInfo = () =>
  fetch(`${config.baseUrl}/users/me`, {
    headers: config.headers,
  }).then(checkResponse);

export const getInitialCards = () =>
  fetch(`${config.baseUrl}/cards`, {
    headers: config.headers,
  }).then(checkResponse);

export const updateUserInfo = ({ name, about }) =>
  fetch(`${config.baseUrl}/users/me`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      name,
      about,
    }),
  }).then(checkResponse);

export const updateUserAvatar = (avatar) =>
  fetch(`${config.baseUrl}/users/me/avatar`, {
    method: "PATCH",
    headers: config.headers,
    body: JSON.stringify({
      avatar,
    }),
  }).then(checkResponse);

export const addCard = ({ name, link }) =>
  fetch(`${config.baseUrl}/cards`, {
    method: "POST",
    headers: config.headers,
    body: JSON.stringify({
      name,
      link,
    }),
  }).then(checkResponse);

export const deleteCardFromServer = (cardId) =>
  fetch(`${config.baseUrl}/cards/${cardId}`, {
    method: "DELETE",
    headers: config.headers,
  }).then(checkResponse);

export const changeLikeCardStatus = (cardId, isLiked) =>
  fetch(`${config.baseUrl}/cards/likes/${cardId}`, {
    method: isLiked ? "DELETE" : "PUT",
    headers: config.headers,
  }).then(checkResponse);
