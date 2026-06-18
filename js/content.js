// Escenas del tour fotográfico
// pins: { left, top } = porcentaje desde esquina superior izquierda de la foto
export const SCENES = [
  {
    id: 'exterior',
    titulo: '🏛️ Monumento a la Bandera — Exterior',
    foto: 'fotos/torre.jpg',
    pins: [
      {
        id: 'torre',
        label: 'Torre Central',
        left: 72, top: 18,
        info: 'Mide 70 metros de altura — casi lo mismo que 23 jirafas una arriba de la otra. Desde su cima se puede ver el Río Paraná y toda la ciudad de Rosario.',
        fotoCard: 'fotos/torre.jpg',
        pregunta: '¿Qué creen que hay en la cima de la torre?'
      },
      {
        id: 'propileo',
        label: 'Propileo',
        left: 48, top: 58,
        info: 'Son los arcos de entrada al monumento. La palabra "Propileo" viene del griego y significa "puerta de entrada". Tiene estatuas que representan la Patria y la Libertad.',
        fotoCard: 'fotos/propileo.jpg',
        pregunta: '¿Qué dos palabras representan esas estatuas enormes?'
      }
    ]
  },
  {
    id: 'llama',
    titulo: '🔥 Llama Votiva',
    foto: 'fotos/llama.jpg',
    pins: [
      {
        id: 'llama',
        label: 'Llama Votiva',
        left: 76, top: 52,
        info: 'Esta llama nunca se apaga. Está encendida las 24 horas del día, los 365 días del año, en honor a todos los argentinos que lucharon por la patria.',
        fotoCard: 'fotos/llama.jpg',
        pregunta: '¿Por qué creen que no dejan que se apague nunca?'
      }
    ]
  },
  {
    id: 'patio',
    titulo: '🌿 Patio de Honor',
    foto: 'fotos/patio.jpg',
    pins: [
      {
        id: 'patio',
        label: 'Patio de Honor',
        left: 42, top: 55,
        info: 'Aquí se realizan los actos oficiales más importantes de la Argentina. El 20 de junio, Día de la Bandera, miles de personas de todo el país se reúnen en este lugar.',
        fotoCard: 'fotos/patio.jpg',
        pregunta: '¿Qué celebramos el 20 de junio en Argentina?'
      }
    ]
  },
  {
    id: 'galeria',
    titulo: '🏳️ Galería de las Banderas',
    foto: 'fotos/galeria.jpg',
    pins: [
      {
        id: 'bandera',
        label: 'Bandera Oficial de Ceremonia',
        left: 50, top: 42,
        info: 'Esta es la Bandera Oficial de la Ceremonia — la más importante del país. Es custodiada por soldados del Ejército Argentino las 24 horas del día.',
        fotoCard: 'fotos/galeria.jpg',
        pregunta: '¿Qué diferencia hay entre esta bandera y la que usamos en el colegio?'
      },
      {
        id: 'belgrano-cripta',
        label: 'Cripta de Belgrano',
        left: 25, top: 65,
        info: 'Debajo del monumento descansa Manuel Belgrano, el creador de la Bandera Argentina. Nació en Buenos Aires en 1770 y murió el 20 de junio de 1820 — por eso ese día es feriado nacional.',
        fotoCard: 'fotos/torre.jpg',
        pregunta: '¿Sabías que Belgrano creó la bandera hace más de 200 años?'
      }
    ]
  }
];

export const QUIZ = [
  {
    pregunta: '¿Cuántos metros mide la Torre Central del Monumento?',
    opciones: ['50 metros', '70 metros', '100 metros'],
    correcta: 1
  },
  {
    pregunta: '¿Quién creó la Bandera Argentina?',
    opciones: ['José de San Martín', 'Manuel Belgrano', 'Bernardino Rivadavia'],
    correcta: 1
  },
  {
    pregunta: '¿En qué ciudad está el Monumento a la Bandera?',
    opciones: ['Buenos Aires', 'Córdoba', 'Rosario'],
    correcta: 2
  },
  {
    pregunta: '¿Cuándo se celebra el Día de la Bandera?',
    opciones: ['25 de mayo', '9 de julio', '20 de junio'],
    correcta: 2
  },
  {
    pregunta: '¿Qué nunca se apaga en el Monumento?',
    opciones: ['Las luces del salón', 'La Llama Votiva', 'Los reflectores externos'],
    correcta: 1
  }
];
