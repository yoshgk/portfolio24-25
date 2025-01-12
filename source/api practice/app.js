const listOne = document.getElementById("currencyFirst");
const listTwo = document.getElementById("currencySecond");
const amountInput = document.getElementById("currencyInput");
const amountOutput = document.getElementById("conversionOutput")

// const getPost = async () => {
//   const response = await fetch('https://api.currencylayer.com/live?access_key=649df0bdda214176fc6db49c4d4473f4');
//   const data = await response.json();
//   return data;
// };

const getCurrency = async () => {
  const response = await fetch('https://api.currencylayer.com/list?access_key=343a6b4a789f8750e24298c75cf8782e');
  const data = await response.json();
  const currencyCodes = Object.keys(data.currencies); 
  const currencyNames = Object.values(data.currencies); 

  return currencyCodes;
};

const getConversion = async () => {
  youareel = 'https://api.currencylayer.com/convert?access_key=343a6b4a789f8750e24298c75cf8782e&from=' +listOne.value + '&to=' + listTwo.value + '&amount=' + amountInput.value;
  const response = await fetch(youareel);
  const data = await response.json();
  return data.result;
};

const displayOption = async () => {
  const options = await getCurrency();
  options.forEach(option => {
    const opt1 = document.createElement("option");
    opt1.value = option;
    opt1.textContent = option;
    const opt2 = document.createElement("option");
    opt2.value = option;
    opt2.textContent = option;
    listOne.appendChild(opt1);
    listTwo.appendChild(opt2);
  });
  listOne.value = 'USD';
  listTwo.value = 'EUR';
  amountInput.value = 1.00.toFixed(2);

  convertAmount();
};

async function convertAmount() {
  if(amountInput.value == 0){
    alert("Amount needs to be higher than 0")
  }else if(amountInput.value == ''){
    alert("Amount cannot be empty")
  }else{
    const result = await getConversion();
    amountOutput.value = result.toFixed(2); + amountInput.value;
  }
}
amountInput.addEventListener("input", convertAmount); 
listOne.addEventListener("change", convertAmount);
listTwo.addEventListener("change", convertAmount);

displayOption();