export const ZONES = [
  {
    id: 'torre',
    label: 'Torre Central',
    pinLocal: { x: 0, y: 2.2, z: 0.1 },
    foto: 'fotos/torre.jpg',
    info: 'Mide 70 metros de altura — casi lo mismo que 23 jirafas una arriba de la otra. Desde su cima se puede ver el Río Paraná y toda la ciudad de Rosario.',
    pregunta: '¿Qué creen que hay en la cima de la torre?'
  },
  {
    id: 'propileo',
    label: 'Propileo',
    pinLocal: { x: -1.0, y: 0.6, z: 1.2 },
    foto: 'fotos/propileo.jpg',
    info: 'Son los arcos de entrada al monumento. La palabra "Propileo" viene del griego y significa "puerta de entrada". Tiene estatuas que representan la Patria y la Libertad.',
    pregunta: '¿Qué dos palabras representan esas estatuas enormes?'
  },
  {
    id: 'llama',
    label: 'Llama Votiva',
    pinLocal: { x: 0.6, y: 0.4, z: 0.9 },
    foto: 'fotos/llama.jpg',
    info: 'Esta llama nunca se apaga. Está encendida las 24 horas del día, los 365 días del año, en honor a todos los argentinos que lucharon por la patria.',
    pregunta: '¿Por qué creen que no dejan que se apague nunca?'
  },
  {
    id: 'patio',
    label: 'Patio de Honor',
    pinLocal: { x: -0.3, y: 0.2, z: 1.4 },
    foto: 'fotos/patio.jpg',
    info: 'Aquí se realizan los actos oficiales más importantes de la Argentina. El 20 de junio, Día de la Bandera, miles de personas de todo el país se reúnen en este lugar.',
    pregunta: '¿Qué celebramos el 20 de junio en Argentina?'
  }
];

export const INTERIOR_SCENES = [
  {
    id: 'cripta',
    label: 'Cripta de Belgrano',
    elements: [
      {
        id: 'sarcofago',
        label: 'Sarcófago de Manuel Belgrano',
        position: { x: 0, y: 0.6, z: -1.5 },
        info: 'Aquí descansan los restos de Manuel Belgrano, el creador de la Bandera Argentina. Nació en Buenos Aires en 1770 y murió en 1820, un año después de que Argentina fuera independiente.'
      },
      {
        id: 'placa',
        label: 'Placa histórica',
        position: { x: 1.8, y: 1.0, z: 0 },
        info: 'La placa recuerda la fecha en que Belgrano izó la bandera por primera vez: 27 de febrero de 1812, a orillas del Río Paraná en Rosario. Ese día nació la Bandera Argentina.'
      }
    ]
  },
  {
    id: 'galeria',
    label: 'Galería de las Banderas',
    elements: [
      {
        id: 'vitrina',
        label: 'Bandera Oficial de la Ceremonia',
        position: { x: 0, y: 1.5, z: -3 },
        info: 'Esta es la Bandera Oficial de la Ceremonia — la más importante del país. Es custodiada por soldados del Ejército Argentino las 24 horas del día.'
      },
      {
        id: 'provincias',
        label: 'Banderas de las Provincias',
        position: { x: -2.5, y: 1.2, z: 0 },
        info: 'Cada provincia de Argentina donó su bandera al monumento. Son 24 banderas, una por cada provincia. Juntas representan que todo el país honra a Manuel Belgrano.'
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
