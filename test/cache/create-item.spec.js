/**
 * Specs for creating the cache item
 * Each item has:
 *
 * "key": create-key(uri)
 * "until": freshness([default, "cache-control", "expires"])
 * "headers" :
 * 		"X-Status-Code": 200
 * 		"Cache-Control":
 * 		"Expires":
 * 		"Content-Type": application-type
 * 		"Status": "200 from cache"
 * "responseText": string
 *
 * @copyright 2017 Martin Krause <github@mkrause.info> (http://martinkr.github.io)
 * @license MIT license: https://opensource.org/licenses/MIT
 *
 * @author Martin Krause <github@mkrause.info>
 */

 /* eslint-env mocha */

const thisModulePath = "cache/create-item";
const thisModule = require("./../../app/" + thisModulePath);
const createKey = require("./../../app/cache/create-key");

const uri = "protocol://path/to/my/resouce";
const responseString = "content";
const key = createKey(uri);
const headers = {
	"Content-Type": "text/plain"
}

const _resultBase = new Date().getTime();
const oneHour = 1000 * 60 * 60;

describe(`The module "${thisModulePath}"`, () => {

	afterEach((done) => {
		done();
	});

	beforeEach((done) => {
		done();
	});

	describe("should provide an unified API. It:", () => {

		it("should export a sync function ", () => {
			thisModule.should.be.a("function");
		});

		it("should throw an error if the first argument is not a string", () => {
			try {
				thisModule(true, responseString, headers);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		});

		it("should throw an error if the second argument is not a string", () => {
			try {
				thisModule(uri, true, headers);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		});

		it("should throw an error if the third argument is not an Object", () => {
			try {
				thisModule(uri, responseString, true);
			} catch (err) {
				err.should.be.an("error");
				return true;
			}
			throw new Error("Failed");
		});

		it("should not throw an error if the optional third argument is missing", () => {
			try {
				thisModule(uri, responseString);
			} catch (err) {
				throw new Error("Failed");
			}
			return true;
		});

	});

	describe("should create the cache item. It:", () => {

		it("should create an item from two arguments", () => {
			console.log(thisModule(uri, responseString))
			thisModule(uri, responseString).should.be.an("Object");
		});

		it("should create an item from three arguments", () => {
			thisModule(uri, responseString, headers).should.be.an("Object");
		});

		it("should create an item wich has a valid \"key\"", () => {
			thisModule(uri, responseString, headers)["key"].should.equal(key);
		});

		it("should create an item wich has a valid \"responseText\"", () => {
			thisModule(uri, responseString, headers)["responseText"].should.equal(responseString);
		});

		it("should create an item wich has a valid \"until\"", () => {
			thisModule(uri, responseString, headers)["until"].should.be.a("Number");
		});

		it("should create an item wich has a valid \"type\" from \"headers\"", () => {
			thisModule(uri, responseString, headers)["headers"]["Content-Type"].should.equal(headers["Content-Type"]);
		});

		it("should create an item wich has a valid \"headers.Content-Type\" from \"headers\"", () => {
			thisModule(uri, responseString, headers)["headers"]["Content-Type"].should.equal(headers["Content-Type"]);
		});

		it("should create an item wich has a valid \"headers.X-Status-Code\": \"200\"", () => {
			thisModule(uri, responseString, headers)["headers"]["X-Status-Code"].should.equal(200);
		});

		it("should create an item wich has a valid \"headers.Status\": \"200 from cache\"", () => {
			thisModule(uri, responseString, headers)["headers"]["Status"].should.equal("200 from cache");
		});

		it("should create an item wich has a valid \"headers.Expires\" from \"headers.Expires\" ", () => {
			headers["Expires"] = (new Date(new Date(new Date().getTime() + oneHour + oneHour).getTime()));
			thisModule(uri, responseString, headers)["headers"]["Expires"].should.equal(headers["Expires"]);
		});

		it("should create an item wich has a no \"headers.Expires\" if there's no \"headers.Expires\" ", () => {
			headers["Expires"] = null;
			thisModule(uri, responseString, headers)["headers"].should.not.have.property("Expires");
		});

		it("should create an item wich has a valid \"headers.Cache-Control\" from \"headers.Cache-Control\" ", () => {
			headers["Cache-Control"] = ("public, max-age=" + (Math.floor(Math.random() * 999999999999))) ;
			thisModule(uri, responseString, headers)["headers"]["Cache-Control"].should.equal(headers["Cache-Control"]);
		});

		it("should create an item wich has a no \"headers.Cache-Control\" if there's no \"headers.Cache-Control\" ", () => {
			headers["Cache-Control"] = null;
			thisModule(uri, responseString, headers)["headers"].should.not.have.property("Cache-Control");
		});

	});

	describe("should work with missing headers for \"Content-Type\". It:", () => {
		it("should use the default \"text/plain\" for \"type\"", () => {
			thisModule(uri, responseString).headers["Content-Type"].should.equal("text/plain");
		});

		it("should use the lowercase \"content-type\" for \"Content-Type\"", () => {
			thisModule(uri, responseString, {"content-type" : "x-custom"}).headers["Content-Type"].should.equal("x-custom");
		});
	});

	describe("should work with missing headers for \"Validity\". It:", () => {

		it("should use the \"Cache-Control\" for \"until\"", () => {
			const _seed = Math.floor(Math.random() * 999999999999);
			const _resultBase = new Date().getTime() + _seed;
			// Cache-Control header is two hours : the validity should be around two hours (+/- 60sec)
			thisModule(uri, responseString, {"Cache-Control" : ( "public, max-age=" + _seed )} )["until"].should.be.within(Number( _resultBase), Number(_resultBase + 100) );
		});

		it("should use the lowercase \"cache-control\" for \"until\"", () => {
			const _seed = Math.floor(Math.random() * 999999999999);
			const _resultBase = new Date().getTime() + _seed;
			// Cache-Control header is two hours : the validity should be around two hours (+/- 60sec)
			thisModule(uri, responseString, {"cache-control" : ( "public, max-age=" + _seed )} )["until"].should.be.within(Number( _resultBase), Number(_resultBase + 100) );
		});

		it("should use the \"Expires\" for \"until\"", () => {
			// Expires header is two hours : the validity should be around two hours (+/- 60sec)
			thisModule(uri, responseString, {"Expires" : ( new Date(new Date(new Date().getTime() + oneHour + oneHour).getTime()) )} )["until"].should.be.within(_resultBase + oneHour + oneHour - (1000 * 60), _resultBase + oneHour + oneHour + (1000 * 60));
		});

		it("should use the lowercase \"expires\" for \"until\"", () => {
			// Expires header is two hours : the validity should be around two hours (+/- 60sec)
			thisModule(uri, responseString, {"expires" : ( new Date(new Date(new Date().getTime() + oneHour + oneHour).getTime()) )} )["until"].should.be.within(_resultBase + oneHour + oneHour - (1000 * 60), _resultBase + oneHour + oneHour + (1000 * 60));
		});

		it("should use the default \"60 minutes\" for \"until\"", () => {
			// default is one hour : the validity should be around one hour (+/- 60sec)
			thisModule(uri, responseString)["until"].should.be.within(_resultBase + oneHour - (1000 * 60), _resultBase + oneHour + (1000 * 60));
		});

	});
});
