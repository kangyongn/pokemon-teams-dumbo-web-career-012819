const BASE_URL = "http://localhost:3000"
const TRAINERS_URL = `${BASE_URL}/trainers`
const POKEMONS_URL = `${BASE_URL}/pokemons`

// helper method.

function pkmnList(json) {
  for(const trainer of json) {
    let ulTag = document.getElementById(`${trainer.id}`);
    for(const pkmn of trainer.pokemons) {
      ulTag.innerHTML += `
        <li>${pkmn.nickname} (${pkmn.species}) <button class="release" data-pokemon-id="${pkmn.id}">Release</button></li>
      `
    }
  }
}

function trainerCard(json) {
  const mainTag = document.querySelector('main');
  for(const trainer of json) {
    mainTag.innerHTML += `
    <div id="${trainer.id}" class="card" data-id="${trainer.id}"><p>${trainer.name}</p>
      <button data-trainer-id="${trainer.id}">Add Pokemon</button>
      <ul>
      </ul>
    </div>
    `
  }
}
fetch (TRAINERS_URL)
  .then(resp => resp.json())
  .then(parsedJSON => {trainerCard(parsedJSON), pkmnList(parsedJSON)})

const mainTag = document.querySelector('main');

mainTag.addEventListener('click', function(event) {
  if(event.target.className === 'release') {
    removePkmn(event.target);
    fetch(`http://localhost:3000/pokemons/${event.target.dataset.pokemonId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
  }

  if(event.target.textContent === "Add Pokemon") {
    fetch("http://localhost:3000/pokemons", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
          trainer_id: parseInt(event.target.dataset.trainerId)
      })
    })
    .then(resp => resp.json())
    .then(addPkmnLi)
  }
})

function addPkmnLi(obj){
  let ulTag = document.getElementById(obj.trainer_id);
  ulTag.innerHTML += `
    <li>${obj.nickname} (${obj.species}) <button class="release" data-pokemon-id="${obj.id}">Release</button></li>
  `
}

function removePkmn(button) {
  let buttonTag = document.querySelector(`[data-pokemon-id="${button.dataset.pokemonId}"]`);
  buttonTag.parentElement.remove();
}
