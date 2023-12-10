const content = document.querySelector(".cards");
const searchBar = document.querySelector("#search");
const pokemonNumber = document.querySelector(".pokemonNumber");
const gens = document.querySelectorAll(".generationButton");
const scrollToTopButton = document.getElementById("scrollToTopButton");

let pokeData = [];

searchBar.addEventListener("keyup", (e) => {
  const searchQuery = e.target.value.toLowerCase();
  const filteredQuery = pokeData.filter((item) => (
    item.types.map((type) => type.type.name).join("").includes(searchQuery) ||
    item.name.toLowerCase().includes(searchQuery)
  ));
  pokeCards(filteredQuery);
});

const fetchData = async (generation) => {
  const res = await fetch(`https://pokeapi.co/api/v2/generation/${generation}/`);
  const data = await res.json();
  pokemonNumber.textContent = `Generation ${generation} has ${data.pokemon_species.length} Pokémon`;

  const fetches = data.pokemon_species.map(async (item) => {
    const [_, pokemonDetailsRes] = await Promise.all([
      fetch(item.url),
      fetch(`https://pokeapi.co/api/v2/pokemon/${item.url.split('/').reverse()[1]}/`)
    ]);

    const pokemonDetails = await pokemonDetailsRes.json();
    return {
      id: pokemonDetails.id,
      name: pokemonDetails.name,
      img: pokemonDetails.sprites.other["official-artwork"].front_default,
      types: pokemonDetails.types,
      height: pokemonDetails.height,
      weight: pokemonDetails.weight,
    };
  });

  Promise.all(fetches).then((res) => {
    pokeData = res.sort((a, b) => a.id - b.id);
    pokeCards(pokeData);
  });
};

const pokeCards = (pokeData) => {
  const cards = pokeData.map((pokemon) => `
    <div class="card">
      <img class="poke-img" src="${pokemon.img}" />
      <p class="id">${pokemon.id}</p>
      <h2 class="poke-name">${pokemon.name}</h2>
      <div class="type">
        ${pokemon.types.map((type) => `<img class="type-img" src="Icons/${type.type.name}.svg" />`).join("")}
      </div>
      <div class="poke-size">
        <p class="height">${pokemon.height * 10} cm</p>
        <p class="weight">${pokemon.weight / 10} kg</p>
      </div>
    </div>
  `).join("");
  content.innerHTML = cards;
};

const showPokedexContent = () => {
  searchBar.style.display = "inline-block";
  content.style.display = "grid";
  searchBar.value = "";
};

gens.forEach((gen, index) => {
  gen.addEventListener("click", () => {
    fetchData(index + 1);
    showPokedexContent();
  });
});

// Show the button when the user scrolls down 40px from the top
window.onscroll = function () {
  if (document.body.scrollTop > 40 || document.documentElement.scrollTop > 40) {
    scrollToTopButton.style.display = "block";
  } else {
    scrollToTopButton.style.display = "none";
  }
};
scrollToTopButton.addEventListener("click", () => {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
});