const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room });

// Users & room
socket.on('usersRoom', ({ room, users }) => {
  outputUsers(users);
  outputRoom(room);
});

// Message from server
socket.on('message', (message) => {
  console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Emit message to server
  socket.emit('chatMessage', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">
    ${message.text}
  </p>`;

  document.querySelector('.chat-messages').appendChild(div);
}

// Show users to DOM
function outputUsers(users) {
  const usersContainer = document.querySelector('#users');
  let usersList = '';

  users.forEach((el) => {
    usersList = usersList + `<li>${el.username}</li>`;
  });

  usersContainer.innerHTML = usersList;
}

// Show room to DOM
function outputRoom(room) {
  const roomContainer = document.querySelector('#room-name');

  roomContainer.innerHTML = room;
}
