
const content = document.querySelector(".cards");
const gen1 = document.querySelector("#gen1");
const gen2 = document.querySelector("#gen2");
const gen3 = document.querySelector("#gen3");
const gen4 = document.querySelector("#gen4");
const gen5 = document.querySelector("#gen5");
const gen6 = document.querySelector("#gen6");
const gen7 = document.querySelector("#gen7");
const gen8 = document.querySelector("#gen8");
const gen9 = document.querySelector("#gen9");

const searchBar = document.querySelector("#search");
const pokemonNumber = document.querySelector(".pokemonNumber");

let pokeData = [];

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

  pokeCards(filteredQuery);
});
const fetchData = async (generation) => {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
  const data = await res.json();

  pokemonNumber.textContent = `Generation ${generation} has ${data.pokemon_species.length} Pokémons`;

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
    pokeData = res.sort(function (a, b) {
      return a.id - b.id;
    });
    console.log(pokeData);
    pokeCards(pokeData);
  });
};


const pokeCards = (pokeData) => {
  const cards = pokeData.map((pokemon) => {
      return `<div class="card">
   <img src="${pokemon.img}" />
   <p class="id">${pokemon.id}</p>
   <h2 class="poke-name">${pokemon.name}</h2>
 <div class="type">
    ${pokemon.types
      .map(
        (item) =>
          `<img class="type-img" src="Icons/${item.type.name}.svg" />`
      )
      .join("")}
      </div>  
    
   <div class="poke-size">
     <p class="height">${pokemon.height * 10} cm</p>
     <p class="weight">${pokemon.weight / 10} kg</p>
     </div>
     </div>`;
    })
    .join("");
  content.innerHTML = cards;
};

function genActivation() {
  searchBar.style.display = "inline-block";
  content.style.display = "grid";
  searchBar.value = "";
}

gens.forEach((gen, index) => {
  gen.addEventListener("click", () => {
    fetchData(index + 1);
    genActivation();
  });
});
/* gen1.addEventListener("click", function () {
  fetchData(1);
  genActivation();
});
gen2.addEventListener("click", function () {
  fetchData(2);
  genActivation();
});
gen3.addEventListener("click", function () {
  fetchData(3);
  genActivation();
});
gen4.addEventListener("click", function () {
  fetchData(4);
  genActivation();
});
gen5.addEventListener("click", function () {
  fetchData(5);
  genActivation();
});
gen6.addEventListener("click", function () {
  fetchData(6);
  genActivation();
});
gen7.addEventListener("click", function () {
  fetchData(7);
  genActivation();
});
gen8.addEventListener("click", function () {
  fetchData(8);
  genActivation();
});
gen9.addEventListener("click", function () {
  fetchData(9);
  genActivation();
}); */