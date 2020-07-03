const M = {
	v: 'v',
	f() {
		console.log(this.v);
	},
};

const func_M = {
	value: 'functional Module',
	func: () => {
		// undefined...
		console.log(this.value);
	},
};

module.exports = {
	M,
	func_M,
};
