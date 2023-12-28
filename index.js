
// I wish you good luck and happy coding 🥰🤠🥳🥳💯💯
//get formatted time
function getFormattedTime(){
  const now = new Date().toLocaleTimeString('en-us',{
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
  const date = now.split(',')[0].split(' ');
  const time = now.split(',')[1];
  return `${date[1]} ${date[0]},${time}`;
  
}
//select form
document.querySelector('#ewallet-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    // console.log('Submitted!!');

    /* select input field for get user data */
    const type = document.querySelector('.add__type').value;
    const desc = document.querySelector('.add__description').value;
    const val = document.querySelector('.add__value').value;
    // console.log(type,desc,val);

    if(desc.length > 0 && val.length > 0){
        //add Items
        addItems(type,desc,val);
        //reset Form:
        resetForm();
    }
});

//add Items:
function addItems(type,desc,val){
  let time = getFormattedTime();
  const newHtml = `
        <div class="item">
          <div class="item-description-time">
            <div class="item-description">
              <p>${desc}</p>
            </div>
            <div class="item-time">
              <p>${time}</p>
            </div>
          </div>
          <div class="item-amount ${type === '+' ? 'income-amount':'expense-amount'} ">
            <p>${type}$${sep(val)}</p>
          </div>
        </div>   
    `
// console.log(newHtml);
const collection = document.querySelector('.collection');
collection.insertAdjacentHTML('afterbegin', newHtml);

//add items in Local Storage:
addItemsToLS(desc,time,type,val);

//calculate total income:
showTotalIncome();
//calculate total expense:
showTotalExpenses();
//caculate total balance:
showTotalBalance();


}
//reset Form:
function resetForm(){
  document.querySelector('.add__type').value = '+';
  document.querySelector('.add__description').value = '';
  document.querySelector('.add__value').value = '';
}
//************************************* */
//****************Local Storage**********
//************************************* */ 

//get items from local storage: check korte hove je, agay theke items array er vitore kono value ace kina;
function getItemsFromLS(){
  let items = localStorage.getItem('items');
  return (items)? JSON.parse(items):[];

  // if(items){
  //   items = JSON.parse(items);
  // }else{
  //   items = [];
  // }
  // return items;
}
//add items to lLocal Storage:
function addItemsToLS(desc,time,type,val){
  let items = getItemsFromLS();
  items.push({desc,time,type,val});

  localStorage.setItem('items', JSON.stringify(items));
}
//*************************** ************************/
//**********Show items in UI from Local Storage *****/
//************************************ ************ */
showItems();
function showItems(){
  let items = getItemsFromLS();
  for(let item of items){
    const newHtml = `
    <div class="item">
      <div class="item-description-time">
        <div class="item-description">
          <p>${item.desc}</p>
        </div>
        <div class="item-time">
          <p>${item.time}</p>
        </div>
      </div>
      <div class="item-amount ${item.type === '+' ? 'income-amount':'expense-amount'} ">
        <p>${item.type}$${sep(item.val)}</p>
      </div>
    </div>   
`
  const collection = document.querySelector('.collection');
  collection.insertAdjacentHTML('afterbegin', newHtml);
  }
}

//********************** *//
//***Calculate Total incomes and Expenses */
//************ ***************//


//income:
showTotalIncome();
function showTotalIncome(){
  let items = getItemsFromLS();

  // let totalIncome = 0;
  // for(let item of items){
  //   if(item.type === '+'){
  //     totalIncome += parseInt(item.val);
  //   }
  // }
  // console.log(totalIncome);

  let totalIncome = items.filter((item) => item.type === '+')
                          .reduce((income, item) => income + parseInt(item.val),0);

  document.querySelector('.income__amount p').innerText = `$${sep(totalIncome)}`;
}

//expenses:
showTotalExpenses();
function showTotalExpenses(){
  let items = getItemsFromLS();

  // let totalExpenses = 0;
  // for(let item of items){
  //   if(item.type === '-'){
  //     totalExpenses += parseInt(item.val);
  //   }
  // }
  // console.log(totalExpenses);
  let totalExpenses = items.filter((item)=> item.type === '-')
                            .reduce((expense, item)=> expense + parseInt(item.val),0);

  document.querySelector('.expense__amount p').innerText = `$${sep(totalExpenses)}`;
}

//show Total balance:
showTotalBalance();
function showTotalBalance(){
  const items = getItemsFromLS();
  let balance = 0;
  for(let item of items){
    if(item.type === '+'){
      balance += parseInt(item.val);
    }else{
      balance -= parseInt(item.val);
    }
  }
  document.querySelector('.balance__amount p').innerText = `$${sep(balance)}`;
  document.querySelector('header').className = (balance >= 0) ? 'green':'red';

  // if(balance >= 0){
  //   document.querySelector('header').className = 'green';
  // }else{
  //   document.querySelector('header').className = 'red';
  // }

}

//separator(,):
function sep(amount){
  amount = parseInt(amount);
  return amount.toLocaleString();
}
