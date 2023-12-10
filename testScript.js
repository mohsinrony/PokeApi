const genButtons = document.querySelectorAll('.generationButton');
const searchBar = document.querySelector('#search');
const pokemonNumber = document.querySelector('.pokemonNumber');
const cardsContainer = document.querySelector('.cards');


let currentGeneration = ""; 
let pokemonData = [];

// searching the pokemons by name *

searchBar.addEventListener("keyup", (e) => {
  const searchQuery = e.target.value.toLowerCase();

  const filteredQuery = pokeData.filter((item) => {
    return (
      item.types
        .map((item) => item.type.name)
        .join("")
        .includes(searchQuery) || item.name.toLowerCase().includes(searchQuery)
    );
  });

  showPokemonCards(filteredQuery);
});
//fetching data per generation *

const fetchData = async (generation) => {
   const res = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
    const data = await res.json();

    pokemonNumber.textContent = `${generation} has ${data.pokemon_species.length} Pokémons`;

  const fetches = data.pokemon_species.map(async function (item) {
  const res = await fetch(item.url);
  const data = await res.json();

  const res2 = await fetch(`https://pokeapi.co/api/v2/pokemon/${data.id}/`);
  const data2 = await res2.json();

  return {
    id: data2.id,
    name: data2.name,
    img: data2.sprites.other["official-artwork"].front_default,
    types: data2.types,
    height: data2.height,
    weight: data2.weight,
  };
});


      Promise.all(fetches).then((res) => {
        pokemonData = res.sort((a, b) => {
          return a.id - b.id;
        });

        showPokemonCards(pokemonData);
      });
    };



// end of fetching data per generation *
// filtering and displaying the pokemon data 
const showPokemonCards = (filterData = pokemonData) => {
  const cards = filterData.map(pokemon => {
     return`
     <div class="card">
       
      <div class="id">#${pokemon.id}</div>
       <img class="pokemon-img" src="${pokemon.img}" alt="${pokemon.name}" />
       
       <div class="poketext">
       <h2 class="pokemon-name">${pokemon.name}</h2>
       <p class="pokeWeight"> Weight: ${pokemon.weight / 10} kg Height: ${pokemon.weight} </p>
       
       <div class="types">
         ${pokemon.types.map(
           (item) => `<img class="type-img" src="Icons/${item.type.name}.svg" />`
         ).join("")}
       </div>
       </div>


       </div>`;
      }).join('');

 cardsContainer.innerHTML = cards;
};
// updating the Generation Information *

// fetching details of each pokemon

// searching the pokemons by name *

/*   const handleSearch = async () => {
  searchBar.addEventListener("keyup", async () =>{
    await fetchData(currentGeneration);
    const query = searchBar.value.toLowerCase();
    const searchedPokemons = pokemonData.filter(pokemon => {
      return (
        pokemon.name.toLowerCase().includes(query) && (pokemon.generation === currentGeneration)
      );
    });
    showPokemonCards(searchedPokemons);
  }) 
}
handleSearch(); */


// adding functionality to generation buttons
genButtons.forEach(button => {
  button.addEventListener('click', () => {
    searchBar.classList.add('visible');
    const generation = button.getAttribute('id');
    fetchData(generation);
    currentGeneration = generation;
  });
});

// handling the back to top button