
# add new node module

```
yarn config set init-author-name "piaoger gong"
yarn config set init-author-email piaoger@gmail.com
yarn config set init-author-url http://twitter.com/piaoger
yarn config set init-version 0.0.1
yarn config set init-license MIT

yarn init --yes
```

## devDependencies

### babel

```
# https://github.com/babel/babel-preset-latest
# https://github.com/babel/babel-preset-env
yarn add babel-core babel-loader --dev
yarn add babel-preset-env babel-preset-latest --dev
yarn add babel-preset-stage-0 babel-preset-node5 babel-preset-es2015-node4 --dev

yarn add json-loader --dev

yarn add babel-plugin-transform-inline-imports-commonjs babel-plugin-transform-runtime --dev
```

### gulp

```
yarn add gulp gulp-util gulp-babel run-sequence --dev
yarn add gulp-if gulp-newer gulp-plumber gulp-sourcemaps gulp-util gulp-watch --dev
```

### webpack

```
yarn add webpack --dev
```

#
touch README.md

mkdir src
mkdir lib

echo "export default function hello() { console.log('hello');}" > ./src/index.js





