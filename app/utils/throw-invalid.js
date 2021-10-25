
/**
 * @module utils/throw-invalid
 * @exports a sync function
 *
 * @description
 * A small utility function that throws an error if the value evalutes to false
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

/**
 * A small utility function that throws an error if the value evalutes to false
 * @memberof  * @module utils/throw-invalid
 * @sync
 * @param {Any} value the value to check
 * @return {Any|Error} throws an error if the value evalutes to false
 */
const main = (value) => {
	if (!value && value !== 0 || value instanceof Error) {
		throw new Error();
	}
}


export default main;