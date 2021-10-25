'use strict'

module.exports = {

    file: ["./test/common.js"],
    timeout: 5000,
    recursive: true,
    require: '@babel/register',
    "spec": ['./test/**/*.spec.js']
    // "spec": [
    // './test/main.spec.js',
    // './test/api/main.spec.js',
    // './test/api/before.spec.js',
    //     // './test/api/after.spec.js',
    //     // './test/utils/*.spec.js',
    //     // './test/pattern-match/*.spec.js',
    //     // './test/configuration/*.spec.js',
    //     // './test/cache/*.spec.js',
    //     // './test/facade/*.spec.js',
    //     // './test/header/*.spec.js'
    // ]
}

