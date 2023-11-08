const documentWidth = document.body.clientWidth;
const documentHeight = document.body.clientHeight;
const persent = documentWidth / documentHeight;

const beginBtn = document.querySelector(".begin-game");
const againBtn = document.querySelector(".begin-again");
const gameOverMessage = document.querySelector(".result");
const topMessage = document.querySelector(".message");
const container = document.querySelector(".container");

let blockWidth, blockHeight, flag, interval;

if (documentHeight > documentWidth) {
  blockHeight = 1.5;
  blockWidth = 1.5 / persent;
} else {
  blockWidth = 1.5;
  blockHeight = 1.5 * persent;
}

function run() {
  againBtn.classList.add("hidden");
  gameOverMessage.classList.add("hidden");

  document.addEventListener("mousemove", getArrow);

  document.addEventListener("mousedown", setFlag);

  document.addEventListener("mouseup", stopMove);

  beginBtn.addEventListener("click", beginGame);

  againBtn.addEventListener("click", () => location.reload());
}

function getArrow(event) {
  if (!flag) {
    coords = container.getBoundingClientRect();
    container.style.cursor = isBorder(event.clientX, event.clientY);
  } else {
    moveBorder(event);
  }
}

function setFlag() {
  if (container.style.cursor !== "pointer") flag = true;
}

function moveBorder(event) {
  const cursorStyle = container.style.cursor;

  switch (cursorStyle) {
    case "w-resize": {
      borderMove("left", "width", event.clientX);
      break;
    }
    case "e-resize": {
      borderMove("right", "width", event.clientX);
      break;
    }
    case "n-resize": {
      borderMove("top", "height", event.clientY);
      break;
    }
    case "s-resize": {
      borderMove("bottom", "height", event.clientY);
      break;
    }
  }
}

function isBorder(x, y) {
  if (
    x > Math.round(coords.left) - 3 &&
    x < Math.round(coords.left) + 3 &&
    y > coords.top &&
    y < coords.bottom
  )
    return "w-resize";
  if (
    x > Math.round(coords.right) - 3 &&
    x < Math.round(coords.right) + 3 &&
    y > coords.top &&
    y < coords.bottom
  )
    return "e-resize";
  if (
    y > Math.round(coords.top) - 3 &&
    y < Math.round(coords.top) + 3 &&
    x > coords.left &&
    x < coords.right
  )
    return "n-resize";
  if (
    y > Math.round(coords.bottom) - 3 &&
    y < Math.round(coords.bottom) + 3 &&
    x > coords.left &&
    x < coords.right
  )
    return "s-resize";

  return "pointer";
}

function borderMove(direction, wh, newCoord) {
  const startPoint = coords[direction];
  const offset = startPoint - newCoord;
  flag = true;

  if (direction === "left" || direction === "top") {
    container.style[wh] = `${coords[wh] + offset}px`;
  } else {
    container.style[wh] = `${coords[wh] - offset}px`;
  }
}

function stopMove() {
  if (flag) {
    flag = false;
  }
}

function createContainer() {
  const containerWidth = container.clientWidth;
  const containerHeight = container.clientHeight;
  const containerHeightVh = (containerHeight / documentHeight) * 100;
  const containerWidthVh = (containerWidth / documentWidth) * 100;

  const blockX = Math.round(containerWidthVh / (blockWidth + 0.3)) + 1;
  const blockY = Math.round(containerHeightVh / (blockHeight + 0.3) + 1);
  console.log(blockY, blockX);
  for (let i = 1; i <= blockY; i++) {
    const newLine = document.createElement("div");
    newLine.style.display = "flex";
    for (let j = 1; j <= blockX; j++) {
      const newBlock = document.createElement("div");
      newBlock.setAttribute("class", "block");
      newBlock.setAttribute("id", `${i}-${j}`);
      newBlock.setAttribute("length", "1");
      newBlock.style.width = `${blockWidth}vw`;
      newBlock.style.height = `${blockHeight}vh`;
      newLine.append(newBlock);
    }
    container.append(newLine);
  }
  // return [blockY, blockX];
}

function blockOver(event) {
  const color = `RGB(${Math.random() * 255},${Math.random() * 255},${
    Math.random() * 255
  })`;
  event.target.style.backgroundColor = color;
}

function blockLeave(event) {
  event.target.style.backgroundColor = "rgb(24, 21, 21)";
}

function getRandomId(arr = []) {
  const [x, y] = getCoord(
    container.lastElementChild.lastElementChild.getAttribute("id")
  );
  let randomId = "";
  do {
    randomId = `${Math.ceil(Math.random() * y)}-${Math.ceil(
      Math.random() * x
    )}`;
  } while (arr.includes(randomId));

  return randomId;
}

function getId([x, y]) {
  return `${y}-${x}`;
}

function getCoord(id) {
  const y = +id.match(/\d+/)[0];
  const x = +id.match(/\d+$/)[0];
  return [x, y];
}

function moveSnake(snakeArray, direction, targetId, keydownArray) {
  if (direction === "Space" || checkKeyDown(keydownArray)) {
    gameOver(snakeArray.length);
  }

  let [x, y] = getCoord(snakeArray[0]);

  switch (direction) {
    case "ArrowUp": {
      snakeArray.unshift(getId([x, --y]));
      if (outBorder(x, y) || crashSnake(snakeArray))
        gameOver(snakeArray.length);
      if (snakeArray[0] !== targetId) {
        const deleteBlockId = snakeArray.pop();
        document.getElementById(deleteBlockId).style.backgroundColor =
          "rgb(24, 21, 21)";
      } else {
        topMessage.innerText = `Длина змейки ${snakeArray.length}`;
        targetId = getRandomId(snakeArray);
      }
      showSnake(snakeArray);
      break;
    }
    case "ArrowRight": {
      snakeArray.unshift(getId([++x, y]));
      if (outBorder(x, y) || crashSnake(snakeArray))
        gameOver(snakeArray.length);
      if (snakeArray[0] !== targetId) {
        const deleteBlockId = snakeArray.pop();
        document.getElementById(deleteBlockId).style.backgroundColor =
          "rgb(24, 21, 21)";
      } else {
        topMessage.innerText = `Длина змейки ${snakeArray.length}`;
        targetId = getRandomId(snakeArray);
      }
      showSnake(snakeArray);
      break;
    }
    case "ArrowDown": {
      snakeArray.unshift(getId([x, ++y]));
      if (outBorder(x, y) || crashSnake(snakeArray))
        gameOver(snakeArray.length);
      if (snakeArray[0] !== targetId) {
        const deleteBlockId = snakeArray.pop();
        document.getElementById(deleteBlockId).style.backgroundColor =
          "rgb(24, 21, 21)";
      } else {
        topMessage.innerText = `Длина змейки ${snakeArray.length}`;
        targetId = getRandomId(snakeArray);
      }
      showSnake(snakeArray);
      break;
    }
    case "ArrowLeft": {
      snakeArray.unshift(getId([--x, y]));
      if (outBorder(x, y) || crashSnake(snakeArray))
        gameOver(snakeArray.length);
      if (snakeArray[0] !== targetId) {
        const deleteBlockId = snakeArray.pop();
        document.getElementById(deleteBlockId).style.backgroundColor =
          "rgb(24, 21, 21)";
      } else {
        topMessage.innerText = `Длина змейки ${snakeArray.length}`;
        targetId = getRandomId(snakeArray);
      }
      showSnake(snakeArray);
      break;
    }
  }

  return {
    newArr: snakeArray,
    newTarget: targetId,
  };
}

function showSnake(blocks) {
  blocks.forEach((blockId) => {
    document.getElementById(blockId).style.backgroundColor = "blue";
  });
}

function crashSnake(arr) {
  const uniqieArr = new Set(arr);
  if (arr.length === uniqieArr.size) return false;
  else {
    gameOverMessage.lastElementChild.innerText = "Врезаться в себя нельзя!";
    return true;
  }
}

function outBorder(x, y) {
  const [lastX, lastY] = getCoord(
    container.lastElementChild.lastElementChild.getAttribute("id")
  );
  if (x < 1 || x > lastX || y < 1 || y > lastY) {
    gameOverMessage.lastElementChild.innerText = "Выход за границы!";
    return true;
  }
  return false;
}

function checkKeyDown(arr) {
  if (arr.length > 1) {
    const last = arr[arr.length - 1];
    const prevLast = arr[arr.length - 2];
    if (
      (last === "ArrowUp" && prevLast === "ArrowDown") ||
      (last === "ArrowRight" && prevLast === "ArrowLeft") ||
      (last === "ArrowDown" && prevLast === "ArrowUp") ||
      (last === "ArrowLeft" && prevLast === "ArrowRight")
    ) {
      gameOverMessage.lastElementChild.innerText = "Заднего хода нет!";
      return true;
    }
  }
  return false;
}

function gameOver(point) {
  clearInterval(interval);
  const [x, y] = getCoord(
    container.lastElementChild.lastElementChild.getAttribute("id")
  );
  gameOverMessage.firstElementChild.innerText = (
    (point * 100) /
    (x * y)
  ).toFixed(2);

  gameOverMessage.classList.remove("hidden");
}
/////////////////////////////////////  BEGIN     ////////////////////////////////////////////

function beginGame() {
  document.removeEventListener("mousemove", getArrow);
  document.removeEventListener("mousedown", setFlag);
  document.removeEventListener("mouseup", stopMove);

  console.log(container.clientWidth, container.clientHeight);
  topMessage.innerText = "Вы играете синим кубиком!";
  beginBtn.classList.add("hidden");
  againBtn.classList.remove("hidden");

  container.style.border = "none";

  createContainer();

  let snake = [getRandomId()];
  let target = getRandomId();
  console.log(snake, target);

  document.getElementById(snake[0]).style.backgroundColor = "blue";
  document.getElementById(target).style.backgroundColor = "white";

  const keydownArray = [];
  document.addEventListener("keydown", (e) => {
    keydownArray.push(e.code);
    if (interval) clearInterval(interval);
    interval = setInterval(() => {
      const data = moveSnake(snake, e.code, target, keydownArray);
      snake = data.newArr;
      target = data.newTarget;
      document.getElementById(target).style.backgroundColor = "white";
    }, 300);
  });

  beginBtn.removeEventListener("click", beginGame);
}

run();
