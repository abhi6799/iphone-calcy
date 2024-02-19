const canvas = document.getElementById("calculator");
const ctx = canvas.getContext("2d");

const buttonWidth = 100;
const buttonHeight = 100;
const buttonMargin = 1;
const displayBoxMargin = 0;

// Set new canvas size
canvas.width = 1200;
canvas.height = 1800;

// Calculate starting x and y positions
const xStart = (canvas.width - (buttonWidth + buttonMargin) * 5) / 2;
const yStart = (canvas.height - (buttonHeight + buttonMargin) * 5) / 2;

// Draw calculator border
ctx.strokeRect(
  xStart - buttonMargin,
  yStart + buttonMargin,
  buttonWidth * 5 + buttonMargin * 6,
  buttonHeight * 7 + buttonMargin * 6
);
ctx.fillStyle = "black";
ctx.fillRect(
  xStart - buttonMargin,
  yStart + buttonMargin,
  buttonWidth * 5 + buttonMargin * 6,
  buttonHeight * 7 + buttonMargin * 6
);

const box1 = {
  text: undefined,
  x: xStart,
  y: yStart + 2 * buttonMargin,
  width: 5 * buttonWidth + 4 * buttonMargin,
  height: buttonHeight,
  color: "lightblue",
};

const box2 = {
  text: undefined,
  x: xStart,
  y: yStart + buttonHeight,
  width: 5 * buttonWidth + 4 * buttonMargin,
  height: buttonHeight,
  color: "lightblue",
};

// draw boxes
function drawBox(box) {
  ctx.fillStyle = "gray";
  ctx.fillRect(box.x, box.y, box.width, box.height);
  if (box.text !== undefined) {
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    const textWidth = ctx.measureText(box.text).width;
    const margin = 10;
    ctx.fillText(
      box.text,
      box.x + box.width - margin - textWidth,
      box.y + box.height - margin
    );
  }
}

box1.text = "";
box2.text = "";

function updateDisplay(box1, box2) {
  drawBox(box1);
  drawBox(box2);
}

updateDisplay(box1, box2);

// creating a buttons array
const buttons = [];

// Draw numbers and operators on the calculator
for (let i = 0; i < 5; i++) {
  for (let j = 2; j < 7; j++) {
    const x = xStart + (buttonWidth + buttonMargin) * i;
    const y = yStart + (buttonHeight + buttonMargin) * j;

    if ((j - 2 == 0 || j - 2 == 4) && i == 1) {
      continue;
    }
    if ((j - 2 == 0 || j - 2 == 4) && i == 2) {
      continue;
    }

    if (getButtonText(i, j - 2) === "AC") {
      ctx.fillStyle = "gray";
      ctx.fillRect(
        x,
        y,
        (buttonWidth + buttonMargin) * 3 - buttonMargin,
        buttonHeight
      );
      ctx.strokeRect(
        x,
        y,
        (buttonWidth + buttonMargin) * 3 - buttonMargin,
        buttonHeight
      );
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.fillText(
        "AC",
        x + ((buttonWidth + buttonMargin) * 3 - buttonMargin) / 2,
        y + buttonHeight / 2
      );

      const button = {
        x: x,
        y: y,
        width: (buttonWidth + buttonMargin) * 3 - buttonMargin,
        height: buttonHeight,
        text: getButtonText(i, j - 2),
      };

      buttons.push(button);
    } else if (getButtonText(i, j - 2) === "0") {
      ctx.fillStyle = "gray";
      ctx.fillRect(
        x,
        y,
        (buttonWidth + buttonMargin) * 3 - buttonMargin,
        buttonHeight
      );
      ctx.strokeRect(
        x,
        y,
        (buttonWidth + buttonMargin) * 3 - buttonMargin,
        buttonHeight
      );
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      ctx.fillText(
        "0",
        x + ((buttonWidth + buttonMargin) * 3 - buttonMargin) / 2,
        y + buttonHeight / 2
      );

      const button = {
        x: x,
        y: y,
        width: (buttonWidth + buttonMargin) * 3 - buttonMargin,
        height: buttonHeight,
        text: getButtonText(i, j - 2),
      };

      buttons.push(button);
    } else {
      if (i == 4) {
        ctx.fillStyle = "orange";
        ctx.fillRect(x, y, buttonWidth, buttonHeight);
      } else {
        ctx.fillStyle = "gray";
        ctx.fillRect(x, y, buttonWidth, buttonHeight);
      }

      ctx.strokeRect(x, y, buttonWidth, buttonHeight);
      ctx.fillStyle = "white";
      ctx.font = "bold 20px Arial";
      const buttonText = getButtonText(i, j - 2);
      ctx.fillText(buttonText, x + buttonWidth / 2, y + buttonHeight / 2);

      const button = {
        x: x,
        y: y,
        width: buttonWidth,
        height: buttonHeight,
        text: getButtonText(i, j - 2),
      };

      buttons.push(button);
    }
  }
}

// Add a click event listener to the canvas element
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];

    if (
      mouseX >= button.x &&
      mouseX <= button.x + button.width &&
      mouseY >= button.y &&
      mouseY <= button.y + button.height
    ) {
      if (button.text === "AC") {
        box1.text = "";
        box2.text = "";
        updateDisplay(box1, box2);
        return;
      } else if (button.text === "BACK") {
        box2.text = box2.text.slice(0, -1);
        updateDisplay(box1, box2);
        return;
      } else if (button.text === "=") {
        box1.text = compute(box2.text);
        if (box1.text !== "") {
          box2.text = "";
        }
        updateDisplay(box1, box2);
        return;
      } else {
        box2.text += button.text;
        updateDisplay(box1, box2);
        return;
      }
    }
  }
});

// Special handling for the '0' button to prevent leading zeros
canvas.addEventListener("click", function (event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  // Check if the mouse position is inside the '0' button
  const zeroButton = buttons.find((button) => button.text === "0");
  if (
    mouseX >= zeroButton.x &&
    mouseX <= zeroButton.x + zeroButton.width &&
    mouseY >= zeroButton.y &&
    mouseY <= zeroButton.y + zeroButton.height
  ) {
    // Handle the '0' button press
    if (box2.text !== "0" || box2.text.includes(".") || box2.text === "") {
      box2.text += "0";
      updateDisplay(box1, box2);
    }
    return;
  }
});

function getButtonText(i, j) {
  if (j === 0) {
    switch (i) {
      case 0:
      case 1:
      case 2:
        return "AC";
      case 3:
        return "%";
      case 4:
        return "/";
    }
  } else if (j === 1) {
    switch (i) {
      case 0:
        return "(";
      case 1:
        return "7";
      case 2:
        return "8";
      case 3:
        return "9";
      case 4:
        return "x";
    }
  } else if (j === 2) {
    switch (i) {
      case 0:
        return ")";
      case 1:
        return "4";
      case 2:
        return "5";
      case 3:
        return "6";
      case 4:
        return "-";
    }
  } else if (j === 3) {
    switch (i) {
      case 0:
        return "BACK";
      case 1:
        return "1";
      case 2:
        return "2";
      case 3:
        return "3";
      case 4:
        return "+";
    }
  } else if (j === 4) {
    switch (i) {
      case 0:
      case 1:
      case 2:
        return "0";
      case 3:
        return ".";
      case 4:
        return "=";
    }
  }
}

function compute(str) {
  let num = 0;
  let decimalPlaces = 0;
  let stack = [];
  const operators = {
    "+": { precedence: 1, operation: (a, b) => a + b },
    "-": { precedence: 1, operation: (a, b) => a - b },
    x: { precedence: 2, operation: (a, b) => a * b },
    "/": { precedence: 2, operation: (a, b) => a / b },
    "%": { precedence: 2, operation: (a, b) => a * (b / 100) },
  };

  for (let i = 0; i < str.length; i++) {
    let char = str[i];

    if (!isNaN(char)) {
      if (decimalPlaces > 0) {
        num += parseInt(char) / Math.pow(10, decimalPlaces++);
      } else {
        num = num * 10 + parseInt(char);
      }
    } else if (char === ".") {
      decimalPlaces = 1;
    } else if (char === "(") {
      let j = i + 1;
      let openParens = 1;
      while (j < str.length && openParens > 0) {
        if (str[j] === "(") {
          openParens++;
        } else if (str[j] === ")") {
          openParens--;
        }
        j++;
      }
      if (openParens !== 0) {
        alert("Mismatched parentheses");
        return NaN;
      }
      num = compute(str.slice(i + 1, j - 1));
      i = j - 1;
    } else if (isNaN(char) && char !== " ") {
      let new_op = char;
      while (
        stack.length > 0 &&
        operators[new_op].precedence <=
          operators[stack[stack.length - 1]].precedence
      ) {
        let prev_op = stack.pop();
        let prev_num = stack.pop();
        if (prev_op === "/" && num === 0) {
          alert("Division by zero");
          return NaN;
        }
        if (prev_op === "x") {
          num *= prev_num;
        } else if (prev_op === "/") {
          num = prev_num / num;
        } else if (prev_op === "+") {
          num = prev_num + num;
        } else if (prev_op === "-") {
          num = prev_num - num;
        } else if (prev_op === "%") {
          num = prev_num * (num / 100);
        }
      }
      stack.push(num);
      stack.push(new_op);
      num = 0;
      decimalPlaces = 0;
    }
  }

  while (stack.length > 0) {
    let prev_op = stack.pop();
    let prev_num = stack.pop();
    if (prev_op === "/" && num === 0) {
      alert("Division by zero");
      return NaN;
    }
    if (prev_op === "x") {
      num *= prev_num;
    } else if (prev_op === "/") {
      num = prev_num / num;
    } else if (prev_op === "+") {
      num = prev_num + num;
    } else if (prev_op === "-") {
      num = prev_num - num;
    } else if (prev_op === "%") {
      num = prev_num * (num / 100);
    }
  }

  return num;
}

// Center the calculator on the screen
canvas.style.position = "absolute";
canvas.style.left = "50%";
canvas.style.top = "50%";
canvas.style.transform = "translate(-50%,-50%)";
// const canvas = document.getElementById('calculator');
// const ctx = canvas.getContext('2d');

// const buttonWidth = 100;
// const buttonHeight = 100;
// const buttonMargin = 1;
// const displayBoxMargin = 0;

// // Set new canvas size
// canvas.width = 1200;
// canvas.height = 1800;

// // Calculate starting x and y positions
// const xStart = (canvas.width - (buttonWidth + buttonMargin) * 5) / 2;
// const yStart = (canvas.height - (buttonHeight + buttonMargin) * 5) / 2;

// // Draw calculator border
// ctx.strokeRect(xStart - buttonMargin, yStart + buttonMargin, buttonWidth * 5 + buttonMargin * 6, buttonHeight * 7 + buttonMargin * 6);
// ctx.fillStyle = 'black';
// ctx.fillRect(xStart - buttonMargin, yStart + buttonMargin, buttonWidth * 5 + buttonMargin * 6, buttonHeight * 7 + buttonMargin * 6);

// const box1 = {
//   text: undefined,
//   x: xStart,
//   y: yStart + 2 * buttonMargin,
//   width: 5 * buttonWidth + 4 * buttonMargin,
//   height: buttonHeight,
//   color: 'lightblue',
// };

// const box2 = {
//   text: undefined,
//   x: xStart,
//   y: yStart + buttonHeight,
//   width: 5 * buttonWidth + 4 * buttonMargin,
//   height: buttonHeight,
//   color: 'lightblue',
// };

// // draw boxes
// function drawBox(box) {
//   ctx.fillStyle = 'gray';
//   ctx.fillRect(box.x, box.y, box.width, box.height);
//   if (box.text !== undefined) {
//     ctx.fillStyle = 'white';
//     ctx.font = '20px Arial';
//     const textWidth = ctx.measureText(box.text).width;
//     const margin = 10;
//     ctx.fillText(
//       box.text,
//       box.x + box.width - margin - textWidth,
//       box.y + box.height - margin
//     );
//   }
// }

// box1.text = '';
// box2.text = '';

// function updateDisplay(box1, box2) {
//   drawBox(box1);
//   drawBox(box2);
// }

// updateDisplay(box1, box2);

// // creating a buttons array
// const buttons = [];

// // Draw numbers and operators on the calculator
// for (let i = 0; i < 5; i++) {
//   for (let j = 2; j < 7; j++) {
//     const x = xStart + (buttonWidth + buttonMargin) * i;
//     const y = yStart + (buttonHeight + buttonMargin) * j;

//     if ((j - 2 == 0 || j - 2 == 4) && i == 1) {
//       continue;
//     }
//     if ((j - 2 == 0 || j - 2 == 4) && i == 2) {
//       continue;
//     }

//     if (getButtonText(i, j - 2) === 'AC') {
//       ctx.fillStyle = 'gray';
//       ctx.fillRect(x, y, (buttonWidth + buttonMargin) * 3 - buttonMargin, buttonHeight);
//       ctx.strokeRect(x, y, (buttonWidth + buttonMargin) * 3 - buttonMargin, buttonHeight);
//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 20px Arial';
//       ctx.fillText('AC', x + ((buttonWidth + buttonMargin) * 3 - buttonMargin) / 2, y + buttonHeight / 2);

//       const button = {
//         x: x,
//         y: y,
//         width: (buttonWidth + buttonMargin) * 3 - buttonMargin,
//         height: buttonHeight,
//         text: getButtonText(i, j - 2),
//       };

//       buttons.push(button);
//     } else if (getButtonText(i, j - 2) === '0') {
//       ctx.fillStyle = 'gray';
//       ctx.fillRect(x, y, (buttonWidth + buttonMargin) * 3 - buttonMargin, buttonHeight);
//       ctx.strokeRect(x, y, (buttonWidth + buttonMargin) * 3 - buttonMargin, buttonHeight);
//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 20px Arial';
//       ctx.fillText('0', x + ((buttonWidth + buttonMargin) * 3 - buttonMargin) / 2, y + buttonHeight / 2);

//       const button = {
//         x: x,
//         y: y,
//         width: (buttonWidth + buttonMargin) * 3 - buttonMargin,
//         height: buttonHeight,
//         text: getButtonText(i, j - 2),
//       };

//       buttons.push(button);
//     } else {
//       if (i == 4) {
//         ctx.fillStyle = 'orange';
//         ctx.fillRect(x, y, buttonWidth, buttonHeight);
//       } else {
//         ctx.fillStyle = 'gray';
//         ctx.fillRect(x, y, buttonWidth, buttonHeight);
//       }

//       ctx.strokeRect(x, y, buttonWidth, buttonHeight);
//       ctx.fillStyle = 'white';
//       ctx.font = 'bold 20px Arial';
//       const buttonText = getButtonText(i, j - 2);
//       ctx.fillText(buttonText, x + buttonWidth / 2, y + buttonHeight / 2);

//       const button = {
//         x: x,
//         y: y,
//         width: buttonWidth,
//         height: buttonHeight,
//         text: getButtonText(i, j - 2),
//       };

//       buttons.push(button);
//     }
//   }
// }

// // Add a click event listener to the canvas element
// canvas.addEventListener('click', function (event) {
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = event.clientX - rect.left;
//   const mouseY = event.clientY - rect.top;

//   for (let i = 0; i < buttons.length; i++) {
//     const button = buttons[i];

//     if (
//       mouseX >= button.x &&
//       mouseX <= button.x + button.width &&
//       mouseY >= button.y &&
//       mouseY <= button.y + button.height
//     ) {
//       if (button.text === 'AC') {
//         box1.text = '';
//         box2.text = '';
//         updateDisplay(box1, box2);
//         return;
//       } else if (button.text === 'BACK') {
//         box2.text = box2.text.slice(0, -1);
//         updateDisplay(box1, box2);
//         return;
//       } else if (button.text === '=') {
//         box1.text = compute(box2.text);
//         if (box1.text !== '') {
//           box2.text = '';
//         }
//         updateDisplay(box1, box2);
//         return;
//       } else {
//         box2.text += button.text;
//         updateDisplay(box1, box2);
//         return;
//       }
//     }
//   }
// });

// // Special handling for the '0' button to prevent leading zeros
// canvas.addEventListener('click', function (event) {
//   const rect = canvas.getBoundingClientRect();
//   const mouseX = event.clientX - rect.left;
//   const mouseY = event.clientY - rect.top;

//   const zeroButton = buttons.find((button) => button.text === '0');
//   if (
//     mouseX >= zeroButton.x &&
//     mouseX <= zeroButton.x + zeroButton.width &&
//     mouseY >= zeroButton.y &&
//     mouseY <= zeroButton.y + zeroButton.height
//   ) {
//     if (box2.text !== '0' || box2.text.includes('.') || box2.text === '') {
//       box2.text += '0';
//       updateDisplay(box1, box2);
//     }
//   }
// });

// function getButtonText(i, j) {
//   if (j === 0) {
//     switch (i) {
//       case 0:
//       case 1:
//       case 2:
//         return 'AC';
//       case 3:
//         return '%';
//       case 4:
//         return '/';
//     }
//   } else if (j === 1) {
//     switch (i) {
//       case 0:
//         return '(';
//       case 1:
//         return '7';
//       case 2:
//         return '8';
//       case 3:
//         return '9';
//       case 4:
//         return 'x';
//     }
//   } else if (j === 2) {
//     switch (i) {
//       case 0:
//         return ')';
//       case 1:
//         return '4';
//       case 2:
//         return '5';
//       case 3:
//         return '6';
//       case 4:
//         return '-';
//     }
//   } else if (j === 3) {
//     switch (i) {
//       case 0:
//         return 'BACK';
//       case 1:
//         return '1';
//       case 2:
//         return '2';
//       case 3:
//         return '3';
//       case 4:
//         return '+';
//     }
//   } else if (j === 4) {
//     switch (i) {
//       case 0:
//       case 1:
//       case 2:
//         return '0';
//       case 3:
//         return '.';
//       case 4:
//         return '=';
//     }
//   }
// }

// function compute(str) {
//   let num = 0;
//   let decimalPlaces = 0;
//   let stack = [];
//   const operators = {
//     '+': { precedence: 1, operation: (a, b) => a + b },
//     '-': { precedence: 1, operation: (a, b) => a - b },
//     'x': { precedence: 2, operation: (a, b) => a * b },
//     '/': { precedence: 2, operation: (a, b) => a / b },
//     '%': { precedence: 2, operation: (a, b) => a * (b / 100) },
//   };

//   for (let i = 0; i < str.length; i++) {
//     let char = str[i];

//     if (!isNaN(char)) {
//       if (decimalPlaces > 0) {
//         num += parseInt(char) / Math.pow(10, decimalPlaces++);
//       } else {
//         num = num * 10 + parseInt(char);
//       }
//     } else if (char === '.') {
//       decimalPlaces = 1;
//     } else if (char === '(') {
//       let j = i + 1;
//       let openParens = 1;
//       while (j < str.length && openParens > 0) {
//         if (str[j] === '(') {
//           openParens++;
//         } else if (str[j] === ')') {
//           openParens--;
//         }
//         j++;
//       }
//       if (openParens !== 0) {
//         alert('Mismatched parentheses');
//         return NaN;
//       }
//       num = compute(str.slice(i + 1, j - 1));
//       i = j - 1;
//     } else if (isNaN(char) && char !== ' ') {
//       let new_op = char;
//       while (stack.length > 0 && operators[new_op].precedence <= operators[stack[stack.length - 1]].precedence) {
//         let prev_op = stack.pop();
//         let prev_num = stack.pop();
//         if (prev_op === '/' && num === 0) {
//           alert('Division by zero');
//           return NaN;
//         }
//         if (prev_op === 'x') {
//           num *= prev_num;
//         } else if (prev_op === '/') {
//           num = prev_num / num;
//         } else if (prev_op === '+') {
//           num = prev_num + num;
//         } else if (prev_op === '-') {
//           num = prev_num - num;
//         } else if (prev_op === '%') {
//           num = prev_num * (num / 100);
//         }
//       }
//       stack.push(num);
//       stack.push(new_op);
//       num = 0;
//       decimalPlaces = 0;
//     }
//   }

//   while (stack.length > 0) {
//     let prev_op = stack.pop();
//     let prev_num = stack.pop();
//     if (prev_op === '/' && num === 0) {
//       alert('Division by zero');
//       return NaN;
//     }
//     if (prev_op === 'x') {
//       num *= prev_num;
//     } else if (prev_op === '/') {
//       num = prev_num / num;
//     } else if (prev_op === '+') {
//       num = prev_num + num;
//     } else if (prev_op === '-') {
//       num = prev_num - num;
//     } else if (prev_op === '%') {
//       num = prev_num * (num / 100);
//     }
//   }

//   return num;
// }

// // Center the calculator on the screen
// canvas.style.position = 'absolute';
// canvas.style.left = '50%';
// canvas.style.top = '50%';
// canvas.style.transform = 'translate(-50%, -50%)';