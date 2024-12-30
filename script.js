const { min, max, floor, sin, abs, PI: π } = Math;
const random = (max = 1) => Math.random() * max;
const randomFrom = arr => arr[floor(random(arr.length))];
const maybeNegative = num => random() >= .5 ? num : -num;
const $ = document.querySelector.bind(document);
const DOM = document.documentElement;

const canvas = $('canvas');
const ctx = canvas.getContext('2d');
const framesUntilDaytimeChange = 640;
let frame = 200;
let drawing;
let canvasWidth = window.innerWidth / 2;
let canvasHeight = canvasWidth;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const getBaseColor = daytime => {
  const diffH = 5 * daytime;
  const diffS = 80 * daytime;
  const diffL = 9.8 * daytime;
  return `hsl(${60 - diffH}, ${80 - diffS}%, ${90.2 + diffL}%)`;
};

const getMeteorColors = meteor => {
  const approach = meteor.y / (canvasHeight / 4);
  const alpha = 1 - approach;
  return [
  `hsla(340, 59.8%, 64.9%, ${alpha})`,
  `hsla(350, 100%, 87.6%, ${alpha})`,
  `hsla(351, 100%, 85.7%, ${alpha})`,
  `hsla(348, 83.3%, 47.1%, ${alpha})`,
  `hsla(275, 100%, 25.5%, ${alpha})`,
  `hsla(33, 100%, 50%, ${alpha})`];

};

const getSkyColors = daytime => {
  const diffH = 25 * daytime;
  const diffS = 10 * daytime;
  const diffL = 46 * daytime;
  return [
  `hsl(${264 + diffH}, ${45 + diffS}%, ${30 - diffL}%)`,
  `hsl(${256 + diffH}, ${40 + diffS}%, ${40 - diffL}%)`,
  `hsl(${248 + diffH}, ${35 + diffS}%, ${50 - diffL}%)`,
  `hsl(${240 + diffH}, ${30 + diffS}%, ${60 - diffL}%)`];

};

const getGroundColors = daytime => {
  const diffH = 10 * daytime;
  const diffS = 15 * daytime;
  const diffL = 25 * daytime;
  return [
  `hsl(${30 + diffH}, ${25 + diffS}%, ${40 - diffL}%)`,
  `hsl(${25 + diffH}, ${25 + diffS}%, ${35 - diffL}%)`,
  `hsl(${20 + diffH}, ${30 + diffS}%, ${30 - diffL}%)`,
  `hsl(${15 + diffH}, ${35 + diffS}%, ${25 - diffL}%)`];

};

const getBushColors = daytime => {
  const diffH = 15 * daytime;
  const diffS = 5 * daytime;
  const diffL = 50 * daytime;
  return [
  `hsl(${90 - diffH}, ${40 + diffS}%, ${62 - diffL}%)`,
  `hsl(${95 - diffH}, ${45 + diffS}%, ${57 - diffL}%)`,
  `hsl(${100 - diffH}, ${40 + diffS}%, ${50 - diffL}%)`,
  `hsl(${70 - diffH}, ${40 + diffS}%, ${62 - diffL}%)`];

};

const getWeedColors = daytime => {
  const diffH = 5 * daytime;
  const diffS = 5 * daytime;
  const diffL = 50 * daytime;
  return [
  `hsl(${65 - diffH}, ${25 + diffS}%, ${75 - diffL}%)`,
  `hsl(${60 - diffH}, ${30 + diffS}%, ${70 - diffL}%)`,
  `hsl(${55 - diffH}, ${35 + diffS}%, ${65 - diffL}%)`];

};

const adjustSize = ({ initial }) => {
  const bodyPaddingRatio = 1.2;
  const aspectRatio = 1;
  const minWidth = 240;
  const maxWidth = 720;
  const bodySize = min(window.innerWidth, window.innerHeight);
  const width = bodySize / bodyPaddingRatio;
  const clampedWidth = max(min(width, maxWidth), minWidth);
  const clampedHeight = clampedWidth / aspectRatio;
  canvas.width = clampedWidth;
  canvas.height = clampedHeight;
  canvasWidth = clampedWidth;
  canvasHeight = clampedHeight;
  if (!initial && typeof drawing === 'undefined') {
    draw();
  }
};

const togglePlayState = () => {
  if (typeof drawing === 'undefined') {
    draw();
  } else {
    cancelAnimationFrame(drawing);
    drawing = undefined;
  }
};

const listenEvents = () => {
  window.addEventListener('resize', _.debounce(adjustSize, 100));
  canvas.addEventListener('click', togglePlayState);
};

const clear = daytime => {
  ctx.fillStyle = getBaseColor(daytime);
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);
};

const createMeteor = () => ({
  x: random(canvasWidth),
  y: random(canvasHeight / 20),
  dirX: canvasWidth / 30 + random(canvasWidth / 10),
  dirY: canvasHeight / 40 + random(canvasHeight / 20) });


const drawMeteor = meteor => {
  if (meteor.y > canvasHeight / 3) {
    return;
  }
  ctx.lineWidth = canvasWidth / (80 + random(240));
  ctx.strokeStyle = randomFrom(getMeteorColors(meteor));
  ctx.beginPath();
  ctx.moveTo(meteor.x, meteor.y);
  ctx.lineTo(meteor.x + meteor.dirX, meteor.y + meteor.dirY);
  ctx.closePath();
  ctx.stroke();
  meteor.x += meteor.dirX / 3;
  meteor.y += meteor.dirY / 3;
  requestAnimationFrame(() => drawMeteor(meteor));
};

const drawSky = daytime => {
  ctx.lineWidth = canvasWidth / 120;
  for (let i = 0; i < 2400; i++) {
    ctx.strokeStyle = randomFrom(getSkyColors(daytime));
    ctx.beginPath();
    const startX = random(canvasWidth);
    const startY = random(canvasHeight / 2);
    const diffX = maybeNegative(random(canvasWidth / 2));
    const diffY = maybeNegative(random(canvasHeight / 30));
    const endX = startX + diffX;
    const endY = startY + diffY;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
  }
  if (daytime > 0.6 && random() > 0.9) {
    const meteor = createMeteor();
    setTimeout(() => drawMeteor(meteor));
  }
  if (daytime > 0.7 && random() > 0.8) {
    const meteor = createMeteor();
    setTimeout(() => drawMeteor(meteor));
  }
};

const drawGround = daytime => {
  ctx.lineWidth = canvasWidth / 30;
  for (let i = 0; i < 800; i++) {
    ctx.strokeStyle = randomFrom(getGroundColors(daytime));
    ctx.beginPath();
    const startX = random(canvasWidth);
    const startY = canvasHeight / (2 - random());
    const diffX = maybeNegative(random(canvasWidth / 2));
    const diffY = maybeNegative(random(canvasHeight / 30));
    const endX = startX + diffX;
    const endY = startY + diffY;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
  }
};

const drawBushes = daytime => {
  const diffAngle = 0.125 + daytime / 5;
  ctx.lineWidth = canvasWidth / 65;
  for (let i = 0; i < 600; i++) {
    ctx.strokeStyle = randomFrom(getBushColors(daytime));
    ctx.beginPath();
    const startX = random(canvasWidth + canvasWidth / 3);
    const startY = canvasHeight / (1.8 + maybeNegative(random(0.38)));
    const lengthFix = canvasWidth / 1.3 * diffAngle;
    const radius = canvasWidth / 2 - random(canvasWidth / 4) - lengthFix;
    const startAngle = π;
    const endAngle = π * (1 + diffAngle);
    ctx.arc(startX, startY, radius, startAngle, endAngle);
    ctx.stroke();
  }
};

const drawWeeds = daytime => {
  ctx.lineWidth = canvasWidth / 300;
  for (let i = 0; i < 20; i++) {
    ctx.strokeStyle = randomFrom(getWeedColors(daytime));
    ctx.beginPath();
    const startX = random(canvasWidth);
    const startY = canvasHeight / (1.3 - random(0.3));
    const diffX = maybeNegative(random(canvasWidth / 80));
    const diffY = random(canvasHeight / 6.2) * -1;
    const endX = startX + diffX;
    const endY = startY + diffY;
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.closePath();
    ctx.stroke();
  }
};

const draw = () => {
  frame++;
  const daytime = abs(sin(frame / framesUntilDaytimeChange * π));
  DOM.style.setProperty('--daytime', daytime);
  clear(daytime);
  drawSky(daytime);
  drawGround(daytime);
  drawBushes(daytime);
  drawWeeds(daytime);
  drawing = requestAnimationFrame(draw);
};

const init = () => {
  draw();
  listenEvents();
  requestAnimationFrame(() => {
    adjustSize({ initial: true });
  });
};

init();