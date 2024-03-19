export interface BallType {
  id: number;
  radius: number;
  color: string;
  x: number;
  y: number;
  xSpeed: number;
  ySpeed: number;
  draw(): void;
  move(): void;
  checkCollision(): void;
}

export type Visible = "visible" | "hidden";

export type ColorsType = { [key: number]: string };
