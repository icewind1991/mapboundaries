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
		}
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
			this.setState({background});
		};
		reader.readAsDataURL(file);
	};

	getDimensions(): { width: number, height: number } {
		const originalHeight = 1024 * this.state.scale; // 1024 is a magic number straight from cl_leveloverview code
		const originalWidth = originalHeight * (this.state.originalWidth / this.state.originalHeight);

		return {width: originalWidth, height: originalHeight};
	}

	render() {
		const {width, height} = this.getDimensions();
		const demoWidth = (this.state.world.boundaryMax.x - this.state.world.boundaryMin.x) / 10;
		const demoHeight = (this.state.world.boundaryMax.y - this.state.world.boundaryMin.y) / 10;
		const size = Math.max(demoWidth, demoHeight);
		console.log(demoWidth, demoHeight);

		return <div>
			<input onChange={this.onNumberInputChange.bind(this, 'scale')}
			       placeholder="scale"
			       value={this.state.scale}/>
			<input
				onChange={this.onNumberInputChange.bind(this, 'originalHeight')}
				placeholder="screen height"
				value={this.state.originalHeight}/>
			<input
				onChange={this.onNumberInputChange.bind(this, 'originalWidth')}
				placeholder="screen width"
				value={this.state.originalWidth}/>
			<input onChange={this.onSelectDemo} type="file"/>
			<MapContainer contentSize={{width: demoWidth, height: demoHeight}}>
				<DemoViewer className="viewer" height={demoHeight}
				            width={demoWidth}
				            demo={this.state.demo}/>
			</MapContainer>
			<input onChange={this.onSelectImage} type="file"/>
		</div>;
	}
}
