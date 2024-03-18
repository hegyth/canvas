import { useEffect, useRef, useState } from "react";
import "./App.css";

interface BallType {
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

type Visible = "visible" | "hidden";

type ColorsType = { [key: number]: string };

function App() {
  const ref = useRef();
  const [visible, setVisible] = useState<Visible>("hidden");
  const [ballId, setBallId] = useState(0);
  const [colors, setColors] = useState<ColorsType>({});

  const changeColorHandle: React.FormEventHandler<HTMLFormElement> = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    const id = Number(event.currentTarget.ballId.defaultValue);
    const color = event.currentTarget.color.value;
    colors[id] = color;
    setColors(colors);
    setVisible("hidden");
  };

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas.getContext("2d");

    class Ball implements BallType {
      id: number;
      radius: number;
      color: string;
      x: number;
      y: number;
      xSpeed: number;
      ySpeed: number;

      constructor() {
        this.id = 0;
        this.radius = Math.random() * 6 + 4;
        this.color = "black";
        this.x = Math.random() * 480 + this.radius;
        this.y = Math.random() * 230 + this.radius;
        this.xSpeed = 0;
        this.ySpeed = 0;
      }

      draw() {
        circle(this.x, this.y, this.radius, true, this.color);
      }

      move() {
        this.x += this.xSpeed;
        this.y += this.ySpeed;
      }

      checkCollision() {
        // console.log(this.x, 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
        // console.log(this.y, 'yyyyyyyyyyyyyyyyyyyyyyyyyyyyyyy')
        // console.log(this.xSpeed, 'скорость x')
        // console.log(this.ySpeed, 'скорость y')
        if (this.x <= this.radius || this.x >= 500 - this.radius) {
          this.xSpeed = -(this.xSpeed - this.xSpeed * 0.2);
          this.ySpeed = this.ySpeed - this.ySpeed * 0.2;
        }
        if (this.y <= this.radius || this.y >= 250 - this.radius) {
          this.xSpeed = this.xSpeed - this.xSpeed * 0.2;
          this.ySpeed = -(this.ySpeed - this.ySpeed * 0.2);
        }
      }
    }

    const circle = function (
      x: number,
      y: number,
      radius: number,
      fillCircle: boolean,
      color: string
    ) {
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2, false);
      if (fillCircle) {
        ctx.fillStyle = color;
        ctx.fill();
      }
    };

    const ball: BallType[] = [];

    for (let i = 0; i < 10; i++) {
      ball[i] = new Ball();
      ball[i].id = i;
    }

    canvas.onclick = function (event: MouseEvent) {
      const x = event.offsetX;
      const y = event.offsetY;
      for (let i = 0; i < ball.length; i++) {
        if (
          Math.abs(ball[i].x - x) <= ball[i].radius &&
          Math.abs(ball[i].y - y) <= ball[i].radius
        ) {
          ball[i].xSpeed = 1;
          ball[i].ySpeed = 1;
        }
      }
    };

    canvas.oncontextmenu = function (event: MouseEvent) {
      const x = event.offsetX;
      const y = event.offsetY;
      for (let i = 0; i < ball.length; i++) {
        if (
          Math.abs(ball[i].x - x) <= ball[i].radius &&
          Math.abs(ball[i].y - y) <= ball[i].radius
        ) {
          setBallId(ball[i].id);
          setVisible("visible");
        }
      }
      return false;
    };

    const pifagor = function (a: number, b: number) {
      return Math.sqrt(a * a + b * b);
    };

    const tick = () => {
      ctx.clearRect(0, 0, 500, 250);
      
      for (let i = 0; i < 10; i++) {
        if (colors[i]) {
          ball[i].color = colors[i];
        }
        
        ball[i].draw();
        ball[i].move();
      }
      
      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (j > i) {
            if (
              pifagor(ball[i].x - ball[j].x, ball[i].y - ball[j].y) <=
              ball[i].radius + ball[j].radius
              ) {
                const sinA =
                (ball[i].x - ball[j].x) /
                pifagor(ball[i].x - ball[j].x, ball[i].y - ball[j].y);
                const cosA =
                (ball[i].y - ball[j].y) /
                pifagor(ball[i].x - ball[j].x, ball[i].y - ball[j].y);
                
                const vs1x = ball[i].xSpeed * cosA + ball[i].ySpeed * sinA;
                const vs1y = -ball[i].xSpeed * sinA + ball[i].ySpeed * cosA;
                
                const vs2x = ball[j].xSpeed * cosA + ball[j].ySpeed * sinA;
                const vs2y = -ball[j].xSpeed * sinA + ball[j].ySpeed * cosA;
                
                ball[i].xSpeed = vs1x * cosA - vs2y * sinA;
                ball[i].ySpeed = vs1x * sinA + vs2y * cosA;
                
                ball[j].xSpeed = vs2x * cosA - vs1y * sinA;
                ball[j].ySpeed = vs2x * sinA + vs1y * cosA;
              }
            }
          }
          ball[i].checkCollision();
        }
        requestAnimationFrame(tick);
      };
    requestAnimationFrame(tick);
  }, []);

  return (
    <>
      <canvas ref={ref} width="500" height="250" />
      <div style={{ visibility: visible }}>
        <form onSubmit={changeColorHandle}>
          <input
            type="text"
            name="ballId"
            style={{ display: "none" }}
            defaultValue={ballId}
          />
          <input type="text" name="color" placeholder="Введите цвет" />
          <button type="submit">Принять</button>
        </form>
      </div>
    </>
  );
}

export default App;

// спавн кривой
// кривые столкновения
// выбор стороны удара
