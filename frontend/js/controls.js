const canvas = document.querySelector('canvas');

export function addHeroControls(hero, createBullet) {
  subsribeToMove(hero);
  subscribeToShoot(createBullet);
}

function subscribeToShoot(createBullet) {
  canvas.addEventListener('mousemove', event => {
    createBullet(event.offsetX, event.offsetY);
  })
}

function subsribeToMove(hero) {
  const { dir } = hero;
  let previousKeyCode;
  document.addEventListener("keydown", event => {
    previousKeyCode = changeSpeedIfHeroChangedDirection(previousKeyCode, event.keyCode, hero);
    switch (event.keyCode) {
      case 38: {
        hero.updateSpriteDirection('top');
        dir.y = -1;
        dir.x = 0;
        break;
      }
      case 39: {
        hero.updateSpriteDirection('right');
        dir.y = 0;
        dir.x = 1;
        break;
      }
      case 40: {
        hero.updateSpriteDirection('bottom');
        dir.y = 1;
        dir.x = 0;
        break;
      }
      case 37: {
        hero.updateSpriteDirection('left');
        dir.x = -1;
        dir.y = 0;
        break;
      }
      case 17: {
        dir.x = 0;
        dir.y = 0;
        break;
      }
      default:
        break;
    }
  });
}

function changeSpeedIfHeroChangedDirection(previousKeyCode, newKeyCode, hero) {
  if (previousKeyCode !== newKeyCode) {
    hero.makeHeroSpeedParamsDefault();
    hero.setNewSpeedTimer();
    return newKeyCode;
  } else {
    return previousKeyCode;
  }
}

export function moveToAnotherSideIfGoBeyonceCanvas(ctx, unit) {
  let FIELD_WIDTH = ctx.canvas.clientWidth;
  let FIELD_HEIGHT = ctx.canvas.clientWidth;

  if (unit.x > FIELD_WIDTH) {
    unit.x = 0;
  } else if (unit.x < 0) {
    unit.x = FIELD_WIDTH;
  }
  if (unit.y > FIELD_HEIGHT) {
    unit.y = 0;
  } else if (unit.y < 0) {
    unit.y = FIELD_HEIGHT;
  }
}
