import {Demo} from 'tf2-demo/build/Demo';

export class DemoRender {
	static render(canvas: HTMLCanvasElement, demo: Demo, width: number, height: number) {
		const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

		const parser = demo.getParser();
		const match = parser.match;

		const scaleX = width / (match.world.boundaryMax.x - match.world.boundaryMin.x);
		const scaleY = height / (match.world.boundaryMax.y - match.world.boundaryMin.y);
		const scale = Math.max(scaleX, scaleY);

		const boundaryMin = match.world.boundaryMin;
		const boundaryMax = match.world.boundaryMax;
		console.log(boundaryMin, boundaryMax, width, height);

		const translatePosition = (position) => {
			return {
				x: Math.floor(position.x - boundaryMin.x) * scale,
				y: Math.floor(boundaryMax.y - position.y) * scale
			}
		};

		const drawScale = Math.max(width, height) / 1500;

		const drawTick = () => {
			for (const player of match.players) {
				if (!player.user.team) {
					continue;// spec
				}
				if (player.team === 2) {
					ctx.fillStyle = 'red';
				} else {
					ctx.fillStyle = 'blue';
				}
				const pos = translatePosition(player.position);
				ctx.fillRect(
					pos.x,
					pos.y,
					drawScale,
					drawScale
				);
			}
		};

		const drawNext = () => {
			let tick;
			for (let i = 0; i < 1000; i++) {
				tick = parser.tick();
				if (tick) {
					drawTick();
				} else {
					return;
				}
			}
			if (tick) {
				// queue up the next batch of ticks
				requestAnimationFrame(drawNext);
			}
		};

		requestAnimationFrame(drawNext);
	}

	static clear(canvas: HTMLCanvasElement) {
		const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
		ctx.clearRect(0, 0, canvas.width, canvas.height);
	}
}

