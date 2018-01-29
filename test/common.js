"use strict";

global.chai = require("chai");
global.chai.should();

global.expect = global.chai.expect;

global.sinon = require("sinon");
global.sinonChai = require("sinon-chai");
global.chai.use(global.sinonChai);

// global.chaiAsPromised = require("chai-as-promised");
// global.chai.use(global.chaiAsPromised);

global.ENV = "MOCHA";

if (!global.window) {
	global.window = {};
}

// mock localStorage
if (!global.window.localStorage) {

	global.window.localStorage = {
		_data: {},
		length() { return Object.keys(global.window.localStorage._data).length },
		inspect() {
			// todo
			// split items into lines
		},
		getItem(key) {
			if (global.window.localStorage._data.hasOwnProperty(key) === false) {
				return null;
			}
			return global.window.localStorage._data[key];
		},
		setItem(key, value) {
			return global.window.localStorage._data[key] = value;
		},
		removeItem(key) {
			delete global.window.localStorage._data[key];
		},
		clear() {
			global.window.localStorage._data = {};
		},
	};

}
