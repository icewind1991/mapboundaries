import {Demo} from '@demostf/demo.js/build/Demo';
import {Match, Packet, World} from '@demostf/demo.js/build';

export class DemoRender {
	static render(
		canvas: HTMLCanvasElement,
		demo: Demo,
		width: number,
		height: number,
		packets: IterableIterator<Packet>,
		world: World,
		match: Match
	) {
		const ctx = <CanvasRenderingContext2D>canvas.getContext('2d');

		const scaleX = width / (match.world.boundaryMax.x - match.world.boundaryMin.x);
		const scaleY = height / (match.world.boundaryMax.y - match.world.boundaryMin.y);
		const scale = Math.max(scaleX, scaleY);

		const boundaryMin = world.boundaryMin;
		const boundaryMax = world.boundaryMax;

		const translatePosition = (position) => {
			return {
				x: Math.floor(position.x - boundaryMin.x) * scale,
				y: Math.floor(boundaryMax.y - position.y) * scale
			};
		};

		const drawScale = Math.max(width, height) / 1500;

		const drawTick = () => {
			for (const player of Array.from(match.playerEntityMap.values())) {
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
			let next = packets.next();
			for (let i = 0; i < 1000; i++) {
				if (next.value) {
					drawTick();
				} else {
					console.log(match.playerEntityMap);
					return;
				}
				next = packets.next();
			}
			if (!next.done) {
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

