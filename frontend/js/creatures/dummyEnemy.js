import { Unit } from "./unit";

const SPEED = 2;
const COLOR = "red";

export const BASE_DUMMY_SIZE = 25;
const img = document.querySelector('.dummy-enemy-sprite');
const SPRITE_LAYER = {
  top: 3,
  left: 1,
  right: 0,
  bottom: 2
}

export class DummyEnemy extends Unit {
  constructor(ctx, width, height, x, y, alfaX, alfaY, speed = SPEED, color = COLOR) {
    super(ctx, width, height, color, x, y, alfaX, alfaY, speed);
    this.sprite = {
      baseX: 0,
      baseY: 0,
      x: 0,
      y: this.getSpriteLayer(this.dir.x, this.dir.y) * 16,
      width: 16,
      height: 16,
      deltaX: 16,
      deltaY: 16
    }

    setInterval(() => {
      if (this.sprite.x < 16) {
        this.sprite.x += this.sprite.deltaX;
      } else {
        this.sprite.x = this.sprite.baseX;
      }
    }, 200)
  }

  update(ctx) {
    const { sprite, x, y, width, height } = this
    ctx.drawImage(img, sprite.x, sprite.y, sprite.width, sprite.height, x, y, width, height)
    return this;
  }

  getSpriteLayer(x, y) {
    if (Math.abs(x) > Math.abs(y)) {
      return x > 0 ? SPRITE_LAYER.right : SPRITE_LAYER.left;
    } else {
      return y > 0 ? SPRITE_LAYER.bottom : SPRITE_LAYER.top;
    }
  }
}

