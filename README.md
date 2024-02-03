# jQuery Timed Dialog plugin

![CircleCI](https://img.shields.io/circleci/build/github/armino-dev/jquery-timed-dialog?style=flat-square) [![StyleCI](https://github.styleci.io/repos/223728463/shield?branch=master)](https://github.styleci.io/repos/223728463) [![codecov](https://codecov.io/gh/armino-dev/jquery-timed-dialog/branch/master/graph/badge.svg)](https://codecov.io/gh/armino-dev/jquery-timed-dialog) [![@armino-dev/jquery-timed-dialog](https://snyk.io/advisor/npm-package/@armino-dev/jquery-timed-dialog/badge.svg)](https://snyk.io/advisor/npm-package/@armino-dev/jquery-timed-dialog) [![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg)](CODE_OF_CONDUCT.md)

A jquery plugin for creating a timed modal dialog

* Under development

## Getting started

Install the jQuery and the jQuery timed dialog.

### Using npm

```bash
npm i jquery
npm i @armino-dev/jquery-timed-dialog
```

Import the components into your script.

```js
import $ from 'jquery';
import timedDialog from '@armino-dev/jquery-timed-dialog';
```

Import the css into your stylesheet.

```css
import '@armino-dev/jquery-timed-dialog/dist/timed-dialog.min.css';
```

### Directly into your html from node_modules

```html
<script src="node_modules/jquery/dist/jquery.min.js"></script>
<script src="node_modules/@armino-dev/jquery-timed-dialog/dist/timed-dialog.min.js"></script>
<link rel="stylesheet" href="node_modules/@armino-dev/jquery-timed-dialog/dist/timed-dialog.min.css" />
```

### Directly into your html from cdn
```html
<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>
<script src="[node_modules/@armino-dev/jquery-timed-dialog/dist/timed-dialog.min.js](https://esm.sh/@armino-dev/jquery-timed-dialog)"></script>
<link rel="stylesheet" href="https://esm.sh/@armino-dev/jquery-timed-dialog/dist/timed-dialog.min.css" />
```

## Use it

```js

const myCallback = () => {
  console.log('The callback was executed!');
}

const options = {
        type: 'confirmation',
        title: 'Confirm callback execution',
        body: '<p>Are you sure you want to execute myCallback?<br/><span style="font-size: 12px; padding:10px 0;">Check the console</span></p>',
        width: 400,
        height: 280,
        timeout: 10,
        closeOnTimer: true,
        btnConfirm: {
          text: 'Execute my callback',
          action: () => myCallback(),
        }
};

document.addEventListener("DOMContentLoaded", () => {
  // add a button to dom
  const button = document.createElement('button');
  button.textContent = 'Show dialog';
  
  // add a click event listener to the button
  button.addEventListener("click", () => {
    $().timedDialog(options);
  });
  
  // add the button to page
  document.body.appendChild(button);
});
```

### **Please take a look at [this working example on  CodePen](https://codepen.io/armino-dev/pen/zYbjdJw).**

## Demo

Demo can be viewed on [here](https://armino-dev.github.io/jquery-timed-dialog/demo/)


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update the specs(tests) as appropriate.

## License
[MIT](LICENSE)
