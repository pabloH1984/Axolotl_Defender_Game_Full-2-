const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 800;
canvas.height = 400;

let heroX = 50;
let heroY = 300;
let velocityY = 0;
let gravity = 1;
let jumpPower = -15;
let isJumping = false;
let frame = 0;
let score = 0;
let gameWon = false;

// Cloud movement
let cloudX = 0;

const images = {};
const imageFiles = [
  "Axolotl defender 1.png",
  "Axolotl defender 2.png",
  "Axolotl defender 3.png",
  "Salamander 1.png",
  "Axolotl yellow1.png",
  "background.jpg",
  "clouds.png"
];

let loadedImages = 0;
imageFiles.forEach((src) => {
  const img = new Image();
  img.src = "images/" + src;
  img.onload = () => {
    loadedImages++;
    if (loadedImages === imageFiles.length) {
      startGame();
    }
  };
  images[src] = img;
});

const enemies = [
  { x: 400, y: 300, active: true },
  { x: 600, y: 300, active: true },
  { x: 750, y: 300, active: true },
];

const stars = [
  { x: 200, y: 250, collected: false },
  { x: 500, y: 250, collected: false },
  { x: 700, y: 250, collected: false },
];

const axolotl = { x: 1000, y: 300 };

function startGame() {
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && !isJumping) {
      velocityY = jumpPower;
      isJumping = true;
    }
  });

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background and clouds
    ctx.drawImage(images["background.jpg"], 0, 0, canvas.width, canvas.height);

    // Move clouds slowly from right to left
    cloudX -= 0.3;
    if (cloudX <= -canvas.width) cloudX = 0;

    ctx.drawImage(images["clouds.png"], cloudX, 30, canvas.width, 100);
    ctx.drawImage(images["clouds.png"], cloudX + canvas.width, 30, canvas.width, 100);

    frame++;
    velocityY += gravity;
    heroY += velocityY;

    if (heroY > 300) {
      heroY = 300;
      velocityY = 0;
      isJumping = false;
    }

    // Change sprite frame
    const sprite =
      frame % 30 < 10
        ? images["Axolotl defender 1.png"]
        : frame % 30 < 20
        ? images["Axolotl defender 2.png"]
        : images["Axolotl defender 3.png"];

    // Draw player
    ctx.drawImage(sprite, heroX, heroY, 50, 50);

    const scrollX = heroX - 50;

    // Draw stars
    stars.forEach((star) => {
      if (!star.collected) {
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(star.x - scrollX, star.y, 10, 0, Math.PI * 2);
        ctx.fill();

        if (
          heroX + 40 > star.x &&
          heroX < star.x + 20 &&
          heroY + 40 > star.y &&
          heroY < star.y + 20
        ) {
          star.collected = true;
          score += 10;
        }
      }
    });

    // Draw enemies
    enemies.forEach((enemy) => {
      if (enemy.active) {
        ctx.drawImage(images["Salamander 1.png"], enemy.x - scrollX, enemy.y, 50, 50);

        if (
          heroX + 40 > enemy.x &&
          heroX < enemy.x + 40 &&
          heroY + 50 >= enemy.y &&
          heroY + 50 <= enemy.y + 10 &&
          velocityY > 0
        ) {
          enemy.active = false;
          velocityY = jumpPower / 1.5;
          score += 20;
        }
      }
    });

    // Draw final axolotl
    if (!gameWon) {
      ctx.drawImage(images["Axolotl yellow1.png"], axolotl.x - scrollX, axolotl.y, 40, 40);

      if (
        heroX + 40 > axolotl.x &&
        heroX < axolotl.x + 40 &&
        heroY + 40 > axolotl.y
      ) {
        gameWon = true;
      }
    } else {
      ctx.fillStyle = "black";
      ctx.font = "48px Arial";
      ctx.fillText("SAVED!", canvas.width / 2 - 100, canvas.height / 2);
    }

    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 30);

    heroX += 2;

    requestAnimationFrame(draw);
  }

  draw();
}
