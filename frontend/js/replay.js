import { initializeGame } from './main';
import { hideReplayButton, updateLevelLabel } from './utils/userUtils';
import { clearCanvas } from './utils/canvasUtils';
import { INTERVALS } from './constants';

export function addSnapshotToReplay(units, time, hero, dummyEnemies, smartEnemies, heroBullets, buffItem, lvl) {
  units.push(getReplaySnapshotObject(time, hero, dummyEnemies, smartEnemies, heroBullets, buffItem, lvl))
}

function getReplaySnapshotObject(time, hero, dummyEnemies, smartEnemies, heroBullets, buffItem, lvl) {
  return {
    time: time,
    hero: { unit: hero, posX: ~~hero.x, posY: ~~hero.y, spriteX: hero.sprite.x, spriteY: hero.sprite.y, speed: hero.speed },
    dummyEnemies: getReplayItemsArray(dummyEnemies),
    smartEnemies: getReplayItemsArray(smartEnemies),
    heroBullets: getReplayItemsArray(heroBullets),
    buffItem: buffItem,
    lvl: lvl
  }
}

function getReplayItemsArray(array) {
  return array.map(item =>
    ({ unit: item, posX: ~~item.x, posY: ~~item.y, width: ~~item.width, height: ~~item.height }))
}

export function showReplay(replay, ctx) {
  document.removeEventListener('keydown', initializeGame)
  let frame = 0;

  replay.spriteTimer = setInterval(() => {
    updateSpritesFromReplaySnapshot(replay.units[frame]);
  }, INTERVALS.updateSprites)

  replay.positionTimer = setInterval(() => {
    updateUnitsPositionFromReplaySnapshot(ctx, replay.units[frame], replay.landscape);
    frame++;
    if (frame === replay.units.length - 1) {
      clearInterval(replay.spriteTimer);
      clearInterval(replay.positionTimer);
      hideReplayButton();
      initializeGame();
    }
  }, INTERVALS.updateGameState);
}

function updateSpritesFromReplaySnapshot(snapshot) {
  const { hero, dummyEnemies, smartEnemies, lvl } = snapshot;
  const speedLabel = document.querySelector('.speed');
  speedLabel.innerHTML = ~~(hero.speed * 100) / 100;
  const units = [hero, ...dummyEnemies, ...smartEnemies];
  units.forEach(replayItem => replayItem.unit.setNextSprite());
  updateLevelLabel(lvl);
}

function updateUnitsPositionFromReplaySnapshot(ctx, snapshot, landscape) {
  const { hero, dummyEnemies, smartEnemies, heroBullets, buffItem } = snapshot;
  clearCanvas(ctx);
  landscape.draw(ctx);
  updateUnitPosition(hero);
  hero.unit.sprite.x = hero.spriteX;
  hero.unit.sprite.y = hero.spriteY;
  hero.unit.speed = hero.speed;
  hero.unit.newPos().update(ctx);
  updateReplayItemsArray(ctx, dummyEnemies);
  updateReplayItemsArray(ctx, smartEnemies, hero.unit);
  updateReplayItemsArray(ctx, heroBullets);
  buffItem && buffItem.draw(ctx)
}

function updateReplayItemsArray(ctx, array, hero) {
  array.forEach(replayItem => {
    updateUnitPosition(replayItem);
    replayItem.unit.width = replayItem.width;
    replayItem.unit.height = replayItem.height;
    replayItem.unit.newPos(hero).update(ctx)
  });
}

function updateUnitPosition(replayItem) {
  replayItem.unit.x = replayItem.posX;
  replayItem.unit.y = replayItem.posY;
}
