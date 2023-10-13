const content = document.querySelector(".cards");

let pokeData = [];

const fetchData = async () => {
  await fetch("https://pokeapi.co/api/v2/pokemon?limit=121&offset=0")
    .then((response) => response.json())
    .then((data) => {
      const fetches = data.results.map((item) => {
        return fetch(item.url)
          .then((response => response.json()))
          .then((data) => {
            return {
              id: data.id,
              name: data.name,
              img: data.sprites.other["official-artwork"].front_default,
              types: data.types,
            };
          });
        });
        Promise.all(fetches).then((response) => {
          pokeData = response;
          pokeCards();
          /*console.log(pokeData);*/
        });
    });
};

const pokeCards = () => {
  const cards = pokeData
    .map((pokemon) => {
      return `<div class="card">
    <img src="${pokemon.img}" alt="pokemon">
    <p class="id">${pokemon.id}</p>
          <h2>${pokemon.name}</h2>
    
          ${pokemon.types.map((type) => getTypeString(type)).join("") 
          }
       
    
        </div>`;
    })
    .join("");

  content.innerHTML = cards;
};
const getTypeString = (type) => {
  return `<p class="type">${type.type.name}</p>`;
  
}
fetchData();
