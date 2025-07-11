// Cargar el footer
fetch('components/Footer.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('footer').innerHTML = data;
    });

// Funciones para LocalStorage
function getUnlockedPokemonFromStorage() {
    const data = localStorage.getItem('unlockedPokemon');
    return data ? JSON.parse(data) : [];
}
function setUnlockedPokemonToStorage(ids) {
    localStorage.setItem('unlockedPokemon', JSON.stringify(ids));
}
function updateUnlockedPokemon(newUnlockedIds) {
    setUnlockedPokemonToStorage(newUnlockedIds);
}
function unlockPokemon(pokemonId) {
    let unlocked = getUnlockedPokemonFromStorage();
    if (!unlocked.includes(pokemonId)) {
        unlocked.push(pokemonId);
        updateUnlockedPokemon(unlocked);
        return true;
    }
    return false;
}


// array de IDs válidos (1-150)
const VALID_POKEMON_IDS = Array.from({length: 150}, (_, i) => i + 1);

// Función para obtener 6 IDs aleatorios (pueden ser repetidos)
function getRandomPackIds() {
    const pack = [];
    for (let i = 0; i < 6; i++) {
        const idx = Math.floor(Math.random() * VALID_POKEMON_IDS.length);
        pack.push(VALID_POKEMON_IDS[idx]);
    }
    return pack;
}

// Mostrar cartas boca abajo y manejar el flip
// Modificar la función showPackCards
function showPackCards(ids) {
    const row = document.getElementById('cards-row');
    row.innerHTML = '';
    ids.forEach(id => {
        const card = document.createElement('div');
        card.className = 'poke-card';
        card.innerHTML = `<span class="card-back">🃏</span>`;
        
        card.addEventListener('click', async function handleFlip() {
            if (card.classList.contains('flipped')) return;
            
            card.classList.add('flipped');
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const poke = await res.json();
            
            card.innerHTML = `
                <img class="poke-img" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" alt="${poke.name}">
                <div class="poke-name">${poke.name}</div>
            `;
        });
        
        row.appendChild(card);
    });
}

function updateStats() {
    const unlocked = getUnlockedPokemonFromStorage();
    const uniqueCount = [...new Set(unlocked)].length;
    const completion = Math.round((uniqueCount / 150) * 100);
    
    document.getElementById('unlocked-count').textContent = unlocked.length;
    document.getElementById('completion').textContent = `${completion}%`;
    
    console.log(`Estadísticas: ${unlocked.length} cartas desbloqueadas, ${completion}% completado`);
}

// Evento para abrir el sobre
document.addEventListener('DOMContentLoaded', function() {    
    updateStats(); // Actualizar estadísticas apenas se ingresa en la pagina
    const openBtn = document.getElementById('open-pack-btn');
    openBtn.addEventListener('click', function() {
        const packIds = getRandomPackIds();
        if (packIds.length === 0) {
            document.getElementById('cards-row').innerHTML = '<div style="color:#8c52ff;font-weight:bold;">¡Ya tienes todos los Pokémon desbloqueados!</div>';
            return;
        }
        
        const unlocked = getUnlockedPokemonFromStorage();
        const nuevos = [...unlocked, ...packIds];
        updateUnlockedPokemon([...new Set(nuevos)]);
        
        showPackCards(packIds);
        updateStats(); // Actualizar estadísticas después de abrir
        
    });
});
