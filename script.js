document.addEventListener('DOMContentLoaded', () => {
    // Obtiene los elementos del DOM
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const resultsDiv = document.getElementById('results');

    // Declara una variable para almacenar los datos de los jubilados
    let jubilados = [];

    // Función para parsear el CSV
    const parseCSV = (csvText) => {
        const lines = csvText.trim().split('\n');
        // Asume que la primera línea son los encabezados
        const headers = lines[0].split(',').map(header => header.trim().toLowerCase());
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',');
            if (values.length === headers.length) {
                const obj = {};
                for (let j = 0; j < headers.length; j++) {
                    obj[headers[j]] = values[j].trim();
                }
                data.push(obj);
            }
        }
        return data;
    };

    // Carga los datos desde el archivo CSV
    fetch('jubilados.csv')
        .then(response => {
            // Verifica si la respuesta es exitosa
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo de datos.');
            }
            return response.text();
        })
        .then(csvText => {
            // Parsea el texto del CSV a un arreglo de objetos
            jubilados = parseCSV(csvText);
            console.log('Datos cargados y parseados exitosamente:', jubilados);
        })
        .catch(error => {
            // Muestra un mensaje de error si la carga falla
            resultsDiv.innerHTML = `<p class="not-found">Error al cargar los datos: ${error.message}</p>`;
            console.error('Error:', error);
        });

    // Función principal para buscar en la lista
    const buscarJubilado = () => {
        const query = searchInput.value.toLowerCase().trim();
        resultsDiv.innerHTML = ''; // Limpia los resultados anteriores

        // Muestra un mensaje si la búsqueda es demasiado corta
        if (query.length < 3) {
            resultsDiv.innerHTML = '<p class="not-found">Por favor, ingresa al menos 3 caracteres.</p>';
            return;
        }

        // Filtra los datos según la consulta del usuario
        const resultados = jubilados.filter(jubilado =>
            jubilado.nombre && jubilado.nombre.toLowerCase().includes(query) ||
            jubilado.cedula && jubilado.cedula.toLowerCase().includes(query) ||
            jubilado.estado && jubilado.estado.toLowerCase().includes(query)
        );

        // Muestra los resultados o un mensaje de no encontrado
        if (resultados.length > 0) {
            resultados.forEach(jubilado => {
                const item = document.createElement('div');
                item.className = 'result-item';
                item.innerHTML = `
                    <strong>Nombre:</strong> ${jubilado.nombre}<br>
                    <strong>Cédula:</strong> ${jubilado.cedula}<br>
                    <strong>Estado:</strong> ${jubilado.estado}
                `;
                resultsDiv.appendChild(item);
            });
        } else {
            resultsDiv.innerHTML = '<p class="not-found">No se encontraron resultados para su búsqueda.</p>';
        }
    };

    // Asocia la función de búsqueda al botón
    searchButton.addEventListener('click', buscarJubilado);

    // Asocia la función de búsqueda a la tecla "Enter"
    searchInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            buscarJubilado();
        }
    });
});
