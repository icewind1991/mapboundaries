import * as React from 'react';
import {Demo} from 'tf2-demo/build/Demo';
import {World} from 'tf2-demo/build/Data/World';
import {DemoViewer} from "./DemoViewer";


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
	imageHeight: number
}

import './App.css';
import {MapContainer} from "./MapContainer";

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
		imageWidth: 1000
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
			const parser = demo.getParser();
			parser.readHeader();
			const match = parser.match;

			while (match.world.boundaryMin.x === 0) {
				parser.tick();
			}
			this.setState({demo, world: match.world});
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

	getDimensions(): { width: number, height: number } {
		const originalHeight = 1024 * this.state.scale; // 1024 is a magic number straight from cl_leveloverview code
		const originalWidth = originalHeight * (this.state.originalWidth / this.state.originalHeight);

		const width = originalWidth / this.state.originalWidth * this.state.imageWidth;
		const height = originalHeight / this.state.originalHeight * this.state.imageHeight;

		return {width: width / 10, height: height / 10};
	}

	render() {
		const {width, height} = this.getDimensions();
		const demoWidth = (this.state.world.boundaryMax.x - this.state.world.boundaryMin.x) / 10;
		const demoHeight = (this.state.world.boundaryMax.y - this.state.world.boundaryMin.y) / 10;

		const offsetX = Math.floor((this.state.x - this.state.world.boundaryMin.x) / 10) - Math.floor(width / 2);
		const offsetY = Math.floor((this.state.y - this.state.world.boundaryMin.y) / 10) - Math.floor(height / 2);

		const topLeft = (this.state.x - this.state.world.boundaryMin.x);

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
				     width={width}
				     height={height}
				     style={{
					     top: offsetY + 'px',
					     left: offsetX + 'px',
				     }}/>
				<DemoViewer className="viewer" height={demoHeight}
				            width={demoWidth}
				            demo={this.state.demo}/>
			</MapContainer>
			<input onChange={this.onSelectImage} type="file"/>
			<input onChange={this.onNumberInputChange.bind(this, 'x')}
			       placeholder="x" type="number"
			       value={this.state.x}/>
			<input
				onChange={this.onNumberInputChange.bind(this, 'y')}
				placeholder="y" type="number"
				value={this.state.y}/>
		</div>;
	}
}
