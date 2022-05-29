const { Button } = require('button');
const { ADC } = require('adc');

const ledArray = [
  [11, 15, 20, 22, 28],
  [10, 18, 19, 21, 27],
  [9, 7, 5, 3, 1],
  [8, 6, 4, 2, 0],
];

const adcPin = 26;

function limit(v, min, max) {
  if (min <= max) {
    return Math.min(Math.max(v, min), max);
  }
  return v;
}

class TestBoard {
  constructor() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        pinMode(ledArray[i][j], OUTPUT);
      }
    }
    this.buttonTop = new Button(16);
    this.buttonLeft = new Button(17);
    this.buttonRight = new Button(14);
    this.buttonCenter = new Button(13);
    this.buttonBottom = new Button(12);
    this.adc = new ADC(26);
  }

  on(i, j) {
    i = limit(i, 0, 3);
    j = limit(j, 0, 4);
    const ledPin = ledArray[i][j];
    digitalWrite(ledPin, HIGH);
  }

  off(i, j) {
    i = limit(i, 0, 3);
    j = limit(j, 0, 4);
    const ledPin = ledArray[i][j];
    digitalWrite(ledPin, LOW);
  }

  set(i, j, value) {
    i = limit(i, 0, 3);
    j = limit(j, 0, 4);
    const ledPin = ledArray[i][j];
    digitalWrite(ledPin, value);
  }

  setProgress(value) {
    value = limit(value, 0, 20);
    let counter = 0;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 5; j++) {
        if (counter < value) {
          this.on(i, j);
        } else {
          this.off(i, j);
        }
        counter++;
      }
    }
  }

  setBinary(value, i) {
    if(i !== undefined){
      value = limit(value, 0, 31);
      const binaryString = (value >>> 0).toString(2).padStart(5, 0);
      for (let j = 0; j < 5; j++) {
        this.set(i, j, binaryString.charAt(j) === '1' ? HIGH : LOW);
      }
    } else {
      value = limit(value, 0, 1048575);
      const binaryString = (value >>> 0).toString(2).padStart(20, 0);
      let counter = 0;
      for(let i = 0; i < 4; i++){
        for (let j = 0; j < 5; j++) {
          this.set(i, j, binaryString.charAt(counter++) === '1' ? HIGH : LOW);
        }
      }
    }
  }

  setBinaryCol(value, minJ, maxJ) {
    if(minJ === undefined){
      minJ = 0;
      maxJ = 4;
    } else if (maxJ === undefined) {
      maxJ = minJ;
    }

    if( minJ <= maxJ && value >= 0 && value < (1 << ((maxJ-minJ+1)*4))){
      const binaryString = (value >>> 0).toString(2).padStart(((maxJ-minJ+1)*4), 0);
      let counter = 0;
      for (let j = minJ; j < maxJ+1; j++){
        for(let i = 0; i < 4; i++){
          this.set(i, j, binaryString.charAt(counter++) === '1' ? HIGH : LOW);
        }
      }
    }
  }
  

  getState(i, j) {
    i = limit(i, 0, 3);
    j = limit(j, 0, 4);
    const ledPin = ledArray[i][j];
    return digitalRead(ledPin);
  }

  toggle(i, j) {
    i = limit(i, 0, 3);
    j = limit(j, 0, 4);
    const ledPin = ledArray[i][j];
    digitalToggle(ledPin);
  }

  read() {
    return this.adc.read();
  }
}

exports.TestBoard = TestBoard;
