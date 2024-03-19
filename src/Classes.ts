import { BallType } from "./Types";

export class Ball implements BallType {
    id: number;
    radius: number;
    color: string;
    x: number;
    y: number;
    xSpeed: number;
    ySpeed: number;
    ctx: CanvasRenderingContext2D;

    constructor(ctx: CanvasRenderingContext2D, id: number) {
      this.ctx = ctx;
      this.id = id;
      this.radius = Math.random() * 6 + 4;
      this.color = "black";
      this.x = Math.random() * 480 + this.radius;
      this.y = Math.random() * 230 + this.radius;
      this.xSpeed = 0;
      this.ySpeed = 0;
    }

    draw() {
      this.ctx.beginPath();
      this.ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      this.ctx.fillStyle = this.color;
      this.ctx.fill();
    }

    move() {
      this.x += this.xSpeed;
      this.y += this.ySpeed;
    }

    checkCollision() {
      if (this.x <= this.radius || this.x >= 500 - this.radius) {
        this.xSpeed = -(this.xSpeed * 0.8);
        this.ySpeed = this.ySpeed * 0.8;

        if (this.x <= this.radius) {
          this.x = this.radius + 0.01;
        }

        if (this.x >= 500 - this.radius) {
          this.x = 500 - this.radius - 0.01;
        }
      }

      if (this.y <= this.radius || this.y >= 250 - this.radius) {
        this.xSpeed = this.xSpeed * 0.8;
        this.ySpeed = -(this.ySpeed * 0.8);

        if (this.y <= this.radius) {
          this.y = this.radius + 0.01;
        }

        if (this.y >= 250 - this.radius) {
          this.y = 250 - this.radius - 0.01;
        }
      }
    }
  }