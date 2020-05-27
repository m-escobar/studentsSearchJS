//Applcation state control

let tabUsers = null;
let tabStatistics = null;

let allUsers = [];
let selectedUsers = [];

let usersHeader = null;
let statisticsHeader = null;

let countUsers = 0;

let countMale = null;
let countFemale = null;
let sumAges = null;
let avgAge = null;

let numberFormat = null;

window.addEventListener('load', () => {
  tabUsers = document.querySelector('.tabUsers');
  tabStatistics = document.querySelector('.tabStatistics');

  usersHeader = document.querySelector('#usersHeader');
  statisticsHeader = document.querySelector('#statisticsHeader');
  
  countMale = document.querySelector('#male');
  countFemale = document.querySelector('#female');
  sumAges = document.querySelector('#sumAges');
  avgAge = document.querySelector('#avgAge');

  numberFormat = Intl.NumberFormat('pt-BR');

  fetchUsers();
})

async function fetchUsers() {
  const res = await fetch('https://randomuser.me/api/?seed=javascript&results=10&nat=BR&noinfo');
  const json = await res.json();
  allUsers = json.results.map(users => {
    const { name, picture, dob, gender } = users;

    return {
      fullName: `${name.first} ${name.last}`,
      image: picture.thumbnail,
      gender,
      age: dob.age
    }
  })
  
  selectedUsers = allUsers;
  countUsers = selectedUsers.length;
  render();
}

function render() {
  renderUsers();
  renderStatistics();
  handleEvents();
}

function handleEvents() {
  let searchButton = document.querySelector('.btn');

  searchButton.addEventListener('click', () => searchUsers());
  
}

function searchUsers() {
  let toSearch = document.querySelector('#search').value;
  const regexp = new RegExp(toSearch, 'i');

  selectedUsers = allUsers.filter(users => regexp.test(users.fullName));

  render();
}

function renderUsers() {
  let usersHTML = '<div>';

  selectedUsers.forEach(users => {
    const {fullName, image, age } = users;
    const userHTML = `
    <div class="users">
      <div>
        <img src="${image}" alt="${fullName}">
      </div>
      <div>
        ${fullName}, ${age} anos
      </div>
    </div>
    `;

    usersHTML += userHTML;
  });
  
  tabUsers.innerHTML = usersHTML;

  countUsers = selectedUsers.length;
  usersHeader.textContent = `${countUsers} Usuários`;
}

function renderStatistics() {  
  const male = selectedUsers.filter(users => users.gender === 'male').length;
  const female = selectedUsers.filter(users => users.gender === 'female').length;

  countMale.textContent = male;
  countFemale.textContent = female;

  const sumOfAges = selectedUsers.reduce((accumulator, current) => {
    return accumulator + current.age;
  }, 0);

  sumAges.textContent = sumOfAges

  const avgUsersAge = selectedUsers.reduce((accumulator, current) => {
      return accumulator + current.age;
  }, 0)/selectedUsers.length;

  avgAge.textContent = formatNumber(avgUsersAge);
  
}

function formatNumber(number) {
  return numberFormat.format(number);
}




function addToFavorites(id) {
  const countryToAdd = allCountries.find(country => country.id === id);
  
  favoriteCountries = [...favoriteCountries, countryToAdd];

  favoriteCountries.sort((a, b) => {
    return a.name.localeCompare(b.name)
  })

  allCountries = allCountries.filter(country => country.id !== id);

  render();
}
