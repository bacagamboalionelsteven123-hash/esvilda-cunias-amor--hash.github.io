const rows = 5, cols = 5;
const board = document.getElementById('board');
const ctx = board.getContext('2d');
let pieceSize = board.width / cols;
const piecesContainer = document.getElementById('piecesContainer');

let image = new Image();
image.src = 'image.jpg';

let placed = 0;
let selected = null;

image.onload = () => {
  drawGrid();
  createPieces();
};

function drawGrid() {
  ctx.clearRect(0, 0, board.width, board.height);
  ctx.strokeStyle = '#d63384';
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      ctx.strokeRect(x * pieceSize, y * pieceSize, pieceSize, pieceSize);
    }
  }
}

function createPieces() {
  piecesContainer.innerHTML = '';
  pieceSize = board.width / cols;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const piece = document.createElement('div');
      piece.classList.add('piece');
      piece.draggable = true;
      piece.style.backgroundPosition = `-${x * pieceSize}px -${y * pieceSize}px`;
      piece.dataset.x = x;
      piece.dataset.y = y;
      piecesContainer.appendChild(piece);
    }
  }

  // Mezclar piezas
  [...piecesContainer.children].sort(() => Math.random() - 0.5).forEach(p => {
    piecesContainer.appendChild(p);
  });

  document.querySelectorAll('.piece').forEach(p => {
    p.addEventListener('dragstart', dragStart);
    p.addEventListener('touchstart', touchStart);
  });

  board.addEventListener('dragover', dragOver);
  board.addEventListener('drop', dropPiece);
  board.addEventListener('touchmove', touchMove);
  board.addEventListener('touchend', touchEnd);
}

function dragStart(e) {
  selected = e.target;
}
function dragOver(e) { e.preventDefault(); }

function dropPiece(e) {
  const rect = board.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / pieceSize);
  const y = Math.floor((e.clientY - rect.top) / pieceSize);
  placePiece(x, y);
}

// 🖐 soporte táctil
function touchStart(e) { selected = e.target; }
function touchMove(e) { e.preventDefault(); }
function touchEnd(e) {
  const rect = board.getBoundingClientRect();
  const touch = e.changedTouches[0];
  const x = Math.floor((touch.clientX - rect.left) / pieceSize);
  const y = Math.floor((touch.clientY - rect.top) / pieceSize);
  placePiece(x, y);
}

function placePiece(x, y) {
  if (!selected) return;

  // Encaje magnético
  const targetX = parseInt(selected.dataset.x);
  const targetY = parseInt(selected.dataset.y);

  if (x === targetX && y === targetY) {
    ctx.drawImage(image, x * pieceSize, y * pieceSize, pieceSize, pieceSize, x * pieceSize, y * pieceSize, pieceSize, pieceSize);
    selected.remove();
    placed++;
    bounceHeart();
    if (placed === rows * cols) showFinalMessage();
  }
}

function bounceHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");
  heart.textContent = "💗";
  heart.style.left = Math.random() * 90 + "vw";
  heart.style.animationDuration = 2 + Math.random() * 2 + "s";
  document.getElementById("hearts").appendChild(heart);
  setTimeout(() => heart.remove(), 4000);
}

function showFinalMessage() {
  const mensaje = `Yo siempre estaré para ti mi pechocha ❣\nNunca te dejaré sola, yo siempre estaré para ti 🥺\nSabes que eres la mejor novia mi niña 💐\nTú eres el motivo por el cuál sigo estudiando 🥹\nPorque quiero ser alguien mejor para ti\nY poder apoyarte en lo que pueda ❤️`;
  const mensajeDiv = document.getElementById("mensajeFinal");
  mensajeDiv.classList.remove("oculto");
  mensajeDiv.textContent = "";

  let i = 0;
  function escribir() {
    if (i < mensaje.length) {
      mensajeDiv.textContent += mensaje[i];
      i++;
      setTimeout(escribir, 40);
    }
  }
  escribir();

  for (let j = 0; j < 40; j++) bounceHeart();
}

document.getElementById("playAudio").addEventListener("click", () => {
  document.getElementById("bgAudio").play();
});
document.getElementById("pauseAudio").addEventListener("click", () => {
  document.getElementById("bgAudio").pause();
});
document.getElementById("shuffleBtn").addEventListener("click", createPieces);
document.getElementById("resetBtn").addEventListener("click", () => {
  placed = 0;
  ctx.clearRect(0, 0, board.width, board.height);
  drawGrid();
  createPieces();
});
document.getElementById("showBtn").addEventListener("click", () => {
  ctx.drawImage(image, 0, 0, board.width, board.height);
});
