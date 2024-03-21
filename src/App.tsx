import { useEffect, useRef, useState } from "react";
import { BallType, ColorsType, Visible } from "./Types.ts";
import { Ball } from "./Classes.ts";

function App() {
  const ref = useRef<HTMLCanvasElement>(null);
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
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx) {
      return;
    }

    canvas.onmousedown = (event: MouseEvent) => {
      const startX = event.offsetX;
      const startY = event.offsetY;
      canvas.onmouseup = (event: MouseEvent) => {
        const lastX = event.offsetX;
        const lastY = event.offsetY;
        for (let i = 0; i < balls.length; i++) {
          if (
            Math.abs(balls[i].x - startX) <= balls[i].radius &&
            Math.abs(balls[i].y - startY) <= balls[i].radius
          ) {
            balls[i].xSpeed = (startX - lastX) * 0.1;
            balls[i].ySpeed = (startY - lastY) * 0.1;
          }
        }
      };
    };

    canvas.oncontextmenu = (event: MouseEvent) => {
      const x = event.offsetX;
      const y = event.offsetY;
      for (let i = 0; i < balls.length; i++) {
        if (
          Math.abs(balls[i].x - x) <= balls[i].radius &&
          Math.abs(balls[i].y - y) <= balls[i].radius
        ) {
          setBallId(balls[i].id);
          setVisible("visible");
        }
      }
      return false;
    };

    const balls: BallType[] = [];

    for (let i = 0; i < 10; i++) {
      balls[i] = new Ball(ctx, i);
    }

    const hypotenuse = (a: number, b: number) => {
      return Math.sqrt(a * a + b * b);
    };

    const tick = () => {
      ctx.clearRect(0, 0, 500, 250);

      for (let i = 0; i < 10; i++) {
        if (colors[i]) {
          balls[i].color = colors[i];
        }
        balls[i].draw();
        balls[i].move();
      }

      for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
          if (j > i) {
            const deltaX = balls[i].x - balls[j].x;
            const deltaY = balls[i].y - balls[j].y;

            const distance = hypotenuse(deltaX, deltaY);

            if (distance <= balls[i].radius + balls[j].radius + 1) {
              const sinA = deltaX / distance;
              const cosA = deltaY / distance;

              const vs1x = balls[i].xSpeed * cosA + balls[i].ySpeed * sinA;
              const vs1y = -balls[i].xSpeed * sinA + balls[i].ySpeed * cosA;

              const vs2x = balls[j].xSpeed * cosA + balls[j].ySpeed * sinA;
              const vs2y = -balls[j].xSpeed * sinA + balls[j].ySpeed * cosA;

              balls[i].xSpeed = vs1x * cosA - vs2y * sinA;
              balls[i].ySpeed = vs1x * sinA + vs2y * cosA;

              balls[j].xSpeed = vs2x * cosA - vs1y * sinA;
              balls[j].ySpeed = vs2x * sinA + vs1y * cosA;
            }
          }
        }
        balls[i].checkCollision();
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
