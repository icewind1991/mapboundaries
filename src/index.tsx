'use strict';

import * as React from 'react';
import {render} from 'react-dom';
import {App} from './App';
import {AppContainer} from 'react-hot-loader';

declare function require(path: string): any;
declare const module: {
	hot: {
		accept: (path: string, cb: Function) => null
	}
};

const root = document.createElement('div');
document.body.appendChild(root);

render((
	<App/>
), root);

if (module.hot) {
	module.hot.accept('./App', () => {
		const RootContainer = require('./App').App;
		render(
			<AppContainer>
				<RootContainer />
			</AppContainer>,
			root
		);
	});
}
