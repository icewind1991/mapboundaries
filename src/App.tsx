import * as React from 'react';
import {Demo} from '@demostf/demo.js/build/Demo';
import {World} from '@demostf/demo.js/build/Data/World';
import {DemoViewer} from './DemoViewer';


export interface AppState {
	scale: number;
	originalHeight: number;
	originalWidth: number;
	demo: Demo | null;
	background: string | null;
	world: World;
	x: number;
	y: number,
	imageWidth: number,
	imageHeight: number,
	packets: IterableIterator<Packet> | null,
	match: Match | null
}

import './App.css';
import {MapContainer} from './MapContainer';
import {Match, Packet} from '@demostf/demo.js/build';

export class App extends React.Component<{}, AppState> {
	state: AppState = {
		scale: 8,
		originalWidth: 2560,
		originalHeight: 1440,
		demo: null,
		background: null,
		world: {
			boundaryMin: {x: 0, y: 0, z: 0},
			boundaryMax: {x: 1000, y: 1000, z: 1000},
		},
		x: 0,
		y: 0,
		imageHeight: 1000,
		imageWidth: 1000,
		packets: null,
		match: null
	};

	onNumberInputChange(key, event) {
		const value = parseInt(event.target.value, 10);
		const update = {};
		update[key] = value;
		this.setState(update);
	}

	onSelectDemo = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const fileData = reader.result as ArrayBuffer;
			const demo = new Demo(fileData);
			const analyser = demo.getAnalyser();
			const match = analyser.match;
			const packets = analyser.getPackets();

			while (match.world.boundaryMin.x === 0) {
				packets.next();
			}
			console.log(match.world);
			this.setState({demo, world: match.world, packets, match});
		};
		reader.readAsArrayBuffer(file);
	};

	onSelectImage = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = () => {
			const background = reader.result as string;
			const img = new Image();
			img.onload = () => {
				this.setState({
					background,
					imageWidth: img.width,
					imageHeight: img.height
				});
			};
			img.src = background;
		};
		reader.readAsDataURL(file);
	};

	getDimensions(): {width: number, height: number} {
		const originalHeight = 1024 * this.state.scale; // 1024 is a magic number straight from cl_leveloverview code
		const originalWidth = originalHeight * (this.state.originalWidth / this.state.originalHeight);

		const width = (originalWidth / this.state.originalWidth) * this.state.imageWidth;
		const height = (originalHeight / this.state.originalHeight) * this.state.imageHeight;

		return {width: width, height: height};
	}

	getCorners() {
		const originalHeight = 1024 * this.state.scale; // 1024 is a magic number straight from cl_leveloverview code
		const originalWidth = originalHeight * (this.state.originalWidth / this.state.originalHeight);

		const width = (originalWidth / this.state.originalWidth) * this.state.imageWidth;
		const height = (originalHeight / this.state.originalHeight) * this.state.imageHeight;

		return {
			boundary_min: {
				x: this.state.x - Math.floor(width / 2),
				y: this.state.y - Math.floor(height / 2)
			},
			boundary_max: {
				x: this.state.x + Math.floor(width / 2),
				y: this.state.y + Math.floor(height / 2)
			}
		};
	}

	render() {
		const {width, height} = this.getDimensions();
		const demoWidth = (this.state.world.boundaryMax.x - this.state.world.boundaryMin.x) / 10;
		const demoHeight = (this.state.world.boundaryMax.y - this.state.world.boundaryMin.y) / 10;

		const offsetX = Math.floor((this.state.x - this.state.world.boundaryMin.x - width / 2) / 10);
		const offsetY = Math.floor((this.state.world.boundaryMax.y - this.state.y - height / 2) / 10);

		return <div>
			<input onChange={this.onNumberInputChange.bind(this, 'scale')}
				   placeholder="scale" type="number"
				   value={this.state.scale}/>
			<input
				onChange={this.onNumberInputChange.bind(this, 'originalHeight')}
				placeholder="screen height" type="number"
				value={this.state.originalHeight}/>
			<input
				onChange={this.onNumberInputChange.bind(this, 'originalWidth')}
				placeholder="screen width" type="number"
				value={this.state.originalWidth}/>
			<input onChange={this.onSelectDemo} type="file"/>
			<MapContainer contentSize={{width: demoWidth, height: demoHeight}}>
				<img className="background" src={this.state.background || ''}
					 width={width / 10}
					 height={height / 10}
					 style={{
						 top: offsetY + 'px',
						 left: offsetX + 'px',
					 }}/>
				<DemoViewer className="viewer" height={demoHeight}
							width={demoWidth}
							demo={this.state.demo}
							world={this.state.world}
							packets={this.state.packets}
							match={this.state.match}
				/>
			</MapContainer>
			<input onChange={this.onSelectImage} type="file"/>
			<input onChange={this.onNumberInputChange.bind(this, 'x')}
				   placeholder="x" type="number"
				   value={this.state.x}/>
			<input
				onChange={this.onNumberInputChange.bind(this, 'y')}
				placeholder="y" type="number"
				value={this.state.y}/>
			<p>
				<pre>{JSON.stringify(this.getCorners(), null, 4)}</pre>
			</p>
		</div>;
	}
}
