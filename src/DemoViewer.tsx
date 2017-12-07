import * as React from 'react';
import {Demo} from 'tf2-demo/build/Demo';
import {DemoRender} from './DemoRender';

export interface DemoViewerProps {
	demo: Demo | null;
	width: number;
	height: number;
	className?: string;
}

export class DemoViewer extends React.Component<DemoViewerProps, {}> {
	canvas: HTMLCanvasElement;

	componentDidMount() {
		this.updateCanvas();
	}

	updateCanvas() {
		if (this.props.demo) {
			DemoRender.render(this.canvas, this.props.demo, this.props.width, this.props.height);
		}
	}

	componentWillReceiveProps(nextProps: DemoViewerProps) {
		if (nextProps.demo !== this.props.demo && nextProps.width === nextProps.width && nextProps.height === nextProps.height) {
			if (this.canvas) {
				DemoRender.clear(this.canvas);
			}
			requestAnimationFrame(() => {
				this.updateCanvas();
			});
		}
	}

	render() {
		return <canvas
			width={this.props.width}
			height={this.props.height}
			className={this.props.className}
			ref={(canvas) => {
				if (canvas) {
					this.canvas = canvas;
				}
			}}/>;
	}
}
