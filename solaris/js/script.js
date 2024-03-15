document.addEventListener('DOMContentLoaded', async () => {
    const elements = {
        planetsContainer: document.getElementById('planets-container'),
        overlay: document.getElementById('overlay'),
        planetName: document.getElementById('planet-name'),
        planetInfo: document.getElementById('planet-info')
    };

    async function getBodies() {
        try {
            const resp = await fetch("https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies", {
                method: "GET",
                headers: { "x-zocom": "solaris-1Cqgm3S6nlMechWO" },
            });
            const data = await resp.json();
            console.log('data', data.bodies)
            return data.bodies; // Assuming the structure {bodies: Array}
        } catch (error) {
            console.error('Error fetching bodies information:', error);
            throw error;
        }
    }

    const bodiesData = await getBodies(); // Fetch all bodies data at once

    function displayPlanetInfo(planet) {
        console.log(planet)
        elements.planetName.textContent = planet.name;
        elements.planetInfo.innerHTML = generatePlanetInfoHTML(planet);
    }

    function generatePlanetInfoHTML(planet) {
        let html = `<p>Name: ${planet.name}</p>
                    <p>Latin Name: ${planet.latinName}</p>
                    <p>Description: ${planet.desc}</p>
                    <p>Circumference: ${planet.circumference} km</p>
                    <p>Distance from Sun: ${planet.distance} km</p>
                    <p>Orbital Period: ${planet.orbitalPeriod} days</p>
                    <p>Rotation Period: ${planet.rotation} hours</p>
                    <p>Day Temperature: ${planet.temp.day}°C, Night Temperature: ${planet.temp.night}°C</p>
                    <p>Type: ${planet.type}</p>`;

        // Handling moons if the array is not empty
        if (planet.moons && planet.moons.length > 0) {
            html += `<p>Moons:</p><ul>`;
            planet.moons.forEach(moon => {
                html += `<li>${moon}</li>`;
            });
            html += `</ul>`;
        } else {
            html += `<p>Moons: None</p>`;
        }

        return html;
    }


    function createPlanetElement(planetId) {
        const planet = bodiesData.find(p => p.id === planetId); // Find planet by ID
        if (!planet) return; // Skip if planet not found

        const planetElement = document.createElement('div');
        planetElement.className = 'planet';
        planetElement.id = planet.name.toLowerCase(); // Using name for ID here for simplicity
        planetElement.addEventListener('click', () => {
            displayOverlay();
            displayPlanetInfo(planet);
        });
        elements.planetsContainer.appendChild(planetElement);
    }

    function displayOverlay() {
        elements.overlay.style.display = 'block';
    }

    function closeOverlay() {
        elements.overlay.style.display = 'none';
    }

    // Iterate over the planets array to create an element for each
    const planets = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    planets.forEach(createPlanetElement);

    window.closeOverlay = closeOverlay;
});