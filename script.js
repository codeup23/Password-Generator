const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");  
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-Button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 0;

// set circle color to gray
setIndicator("#ccc");
// The functions we need 
/* 
copyContent() - to copy the password
handle-slider - to move slider and change value
generatePassword() - to generate the password
setIndicator() - color changing of indicator
getRandomInteger(), getRandomUppercase(), getRandomLowercase() , getRandomSymbol() - min and max value to generate random length of password in different ways
calcStrength() - to check if the password generated is strong enough
*/
handleSlider();
// sets the length of the password 
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = [passwordLength];
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

//sets color and shadow of the indicator
function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 10px 1px ${color}`;
}

function getRandomInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
    // + min so that the result comes between min to max and not 0 to max 
}

function getRandomNumber(){
    return getRandomInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRandomInteger(97,123));
}

function generateUpperCase() {
    return String.fromCharCode(getRandomInteger(65,91)); 
}

function generateSymbol() {
    const ran = getRandomInteger(0, symbols.length);
    return symbols.charAt(ran); 
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied!";
    } catch (error) {
        copyMsg.innerText = "failed";
    }
    copyMsg.classList.add("active");
    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1800);
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    //special case
    if(passwordLength< checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

function shufflePassword(array){
//using the famous Fisher Yates method
for (let i = array.length - 1; i > 0; i--) {
    //random J, find out using random function
    const j = Math.floor(Math.random() * (i + 1));
    //swap number at i index and j index
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
let str = "";
array.forEach((el) => (str += el));
return str;
}

allCheckBox.forEach(checkbox => {
    checkbox.addEventListener('change', handleCheckBoxChange);
});

inputSlider.addEventListener('input', (e)=>{
    passwordLength = e.target.value;
    // to change the length of the password to the current value of slider
    handleSlider();
    // once the value is changed, it should also reflect in the screen value, so handleSlider() is called
});

copyBtn.addEventListener('click', ()=>{
    if(passwordDisplay.value) //this will use truthy and falsy values
    // also we can check that if the password.length > 0 then only copy
    {
        copyContent();
    }
});

generateBtn.addEventListener('click',()=>{
    //none of checkbox ticked
    if(checkCount == 0){
        return;
    }
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // finding new password
    console.log("Starting the Journey");
    // first remove old password which was on screen
    password="";

    //let's check according to checkboxes
    // if(uppercaseCheck.checked){
    //     password += generateUpperCase();
    // }
    // if(lowercaseCheck.checked){
    //     password += generateLowerCase();
    // }
    // if(numbersCheck.checked){
    //     password += getRandomNumber();
    // }
    // if(symbolsCheck.checked){
    //     password += generateSymbol();
    // }
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funcArr.push(getRandomNumber);
    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    // compulsory addition - for the checkboxes which are ticked
    for(let i=0;i<funcArr.length;i++){
        password += funcArr[i]();
    }
    console.log("COmpulsory adddition done");
    //remaining addition -  done after the compulsory letters are added
    for(let i=0;i<passwordLength-funcArr.length;i++){
        let randomIndex = getRandomInteger(0, funcArr.length);
        password += funcArr[randomIndex](); 
    }
    console.log("Remaining adddition done");
    //shuffle the password
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show password in the input
    passwordDisplay.value = password;
    console.log("UI adddition done");
    calcStrength();
});