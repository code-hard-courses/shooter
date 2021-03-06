export function getCenterCoordinates(unit) {
  return [unit.x + 0.5 * unit.width, unit.y + 0.5 * unit.height];
}

export function getDistanceBetweenUnits(unit1, unit2) {
  const [x1, y1] = getCenterCoordinates(unit1);
  const [x2, y2] = getCenterCoordinates(unit2);
  return Math.pow(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2), 0.5);
}

const PIXEL_BORDER = 2

export function ifUnitsTouchEachOther(unit1, unit2, delta = 0) {
  const [x1, y1] = getCenterCoordinates(unit1);
  const [x2, y2] = getCenterCoordinates(unit2);
  return (
    Math.abs(x2 - x1) < (unit1.width + unit2.width - PIXEL_BORDER - delta) / 2
    && Math.abs(y2 - y1) < (unit1.height + unit2.height - PIXEL_BORDER - delta) / 2
  );
}

const SAFE_DISTANCE = 200;

export function isDistanceBetweenUnitsMoreThanSafe(unit1, unit2, dist = SAFE_DISTANCE) {
  return getDistanceBetweenUnits(unit1, unit2) > dist;
}

export function moveToAnotherSideIfGoBeyonceCanvas(ctx, unit) {
  let width = ctx.canvas.clientWidth;
  let height = ctx.canvas.clientHeight;

  if (unit.x > width) {
    unit.x = 0;
  } else if (unit.x < 0) {
    unit.x = width;
  }
  if (unit.y > height) {
    unit.y = 0;
  } else if (unit.y < 0) {
    unit.y = height;
  }
}

export function getElementsInsideCanvas(ctx, units) {
  const width = ctx.canvas.clientWidth;
  const height = ctx.canvas.clientHeight;

  let isInsideCanvas;
  return units.filter(unit => {
    isInsideCanvas = unit.x < width && unit.x > 0 && unit.y < height && unit.y > 0;
    if (isInsideCanvas) {
      unit.newPos().update(ctx);
    }
    return isInsideCanvas;
  });
}
