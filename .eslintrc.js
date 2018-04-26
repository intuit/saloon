module.exports = {
    "rules": {
        "linebreak-style": [
            2,
            "unix"
        ],
        "semi": [
            2,
            "always"
        ],
        "no-unused-vars": [
            "error",
            { "varsIgnorePattern": "proStyles" }
        ]
    },
    "env": {
        "es6": true,
        "browser": false,
        "node": true,
        "commonjs": true
    },
    "globals": {
        "__DEBUG__": false
    },
    "extends": ["eslint:recommended"],
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "module",
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true,
            "spread": true
        }
    }
};
