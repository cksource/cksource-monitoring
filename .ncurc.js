'use strict';

const manifest = require('./package.json');

module.exports = {
	errorLevel: 2,
	loglevel: 'error',
	packageFile: './package.json',
	target: 'greatest',
	pre: false,
	dep: 'dev,prod',
	filter: [
		...Object.keys( manifest.dependencies || {} ),
		...Object.keys( manifest.devDependencies || {} ).filter( dependency => dependency.startsWith( '@cksource-cs' ) )
	]
};
