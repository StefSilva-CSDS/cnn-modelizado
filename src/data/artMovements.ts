import { ArtMovementInfo, SampleArtwork } from '../types';

export const ART_MOVEMENTS: Record<string, ArtMovementInfo> = {
  Art_Nouveau_Modern: {
    id: 'Art_Nouveau_Modern',
    name: 'Art Nouveau / Modernismo',
    label: 'Art Nouveau / Modern',
    era: 'Fin de Siècle (c. 1890 - 1914)',
    periodYears: '1890 – 1914',
    keyArtists: ['Gustav Klimt', 'Alphonse Mucha', 'Antoni Gaudí', 'Aubrey Beardsley', 'Henri de Toulouse-Lautrec'],
    characteristics: [
      'Líneas orgánicas ondulantes y motivos fitomorfos (tallos, zarcillos, pétalos)',
      'Estilización sensual de figuras humanas y cabelleras flotantes',
      'Uso decorativo de pan de oro y patrones geométricos simétricos',
      'Disolución de fronteras entre artes mayores y artes aplicadas'
    ],
    techniques: [
      'Trazo gráfico fluido tipo latigazo ("coup de fouet")',
      'Contornos planos rellenos de tintas planas ornamentadas',
      'Composición asimétrica inspirada en el Japonismo (Ukiyo-e)'
    ],
    description: 'Movimiento que celebró la belleza de la naturaleza viva frente a la industrialización, caracterizado por siluetas sinuosas, ornamentación intrincada y una búsqueda de integración estética total.',
    paletteColors: ['#C5A059', '#3D5A45', '#8C3B52', '#EAD7BA', '#2E3D34']
  },
  Cubism: {
    id: 'Cubism',
    name: 'Cubismo',
    label: 'Cubismo',
    era: 'Vanguardias Históricas (c. 1907 - 1920)',
    periodYears: '1907 – 1920',
    keyArtists: ['Pablo Picasso', 'Georges Braque', 'Juan Gris', 'Fernand Léger', 'Robert Delaunay'],
    characteristics: [
      'Descomposición geométrica de formas tridimensionales en planos bidimensionales',
      'Simultaneidad de perspectivas en un único plano pictórico',
      'Rechazo de la perspectiva renacentista lineal y del claroscuro tradicional',
      'Paleta sobria monocromática en su fase analítica, collage en fase sintética'
    ],
    techniques: [
      'Facetado y fragmentación prismática de volúmenes',
      'Paso tonal continuo ("passage") entre planos adyacentes',
      'Integración de letras tipográficas y texturas táctiles'
    ],
    description: 'Revolución radical que deconstruyó el espacio clásico para representar objetos no como los percibe el ojo desde un ángulo estático, sino como los concibe la mente desde múltiples puntos de vista simultáneos.',
    paletteColors: ['#6B5B4D', '#A89F91', '#4A4E4D', '#D1C7B7', '#2B2B28']
  },
 /*  Expressionism: {
    id: 'Expressionism',
    name: 'Expresionismo',
    label: 'Expresionismo',
    era: 'Vanguardias de Entreguerras (c. 1905 - 1930)',
    periodYears: '1905 – 1930',
    keyArtists: ['Ernst Ludwig Kirchner', 'Edvard Munch', 'Franz Marc', 'Egon Schiele', 'Wassily Kandinsky', 'Emil Nolde'],
    characteristics: [
      'Colores antinaturales, estridentes y saturados con valor psicológico',
      'Pincelada violenta, matérica y deliberadamente áspera',
      'Deformación emocional de figuras, rostros y paisajes',
      'Temáticas de angustia existencial, éxtasis espiritual, aislamiento y tensión'
    ],
    techniques: [
      'Empaste denso ("impasto") aplicado con espátula y pincel grueso',
      'Contornos angulosos y quebrados que desafían la anatomía estricta',
      'Contraste cromático disonante (naranjas incandescentes frente a azules nocturnos)'
    ],
    description: 'Corriente primordialmente germánica que primó la expresión visceral de los estados emocionales subjetivos sobre la reproducción fidedigna de la realidad exterior.',
    paletteColors: ['#B83A1B', '#1E355B', '#E07A28', '#2C5E3B', '#141414']
  }, */
  Impressionism: {
    id: 'Impressionism',
    name: 'Impresionismo',
    label: 'Impresionismo',
    era: 'Modernidad Temprana (c. 1874 - 1886)',
    periodYears: '1874 – 1886',
    keyArtists: ['Claude Monet', 'Pierre-Auguste Renoir', 'Camille Pissarro', 'Edgar Degas', 'Berthe Morisot', 'Alfred Sisley'],
    characteristics: [
      'Captación del instante fugaz y los efectos cambiantes de la luz natural',
      'Pintura al aire libre ("en plein air") observando fenómenos ópticos',
      'Sombras cromáticas y coloreadas (eliminación del negro absoluto)',
      'Escenas de la vida cotidiana, paisajes fluviales y bulevares parisinos'
    ],
    techniques: [
      'Pincelada yuxtapuesta y corta ("taches") con mezcla óptica en el ojo',
      'Capas húmedo sobre húmedo con rápida ejecución gestual',
      'Composiciones abiertas y encuadres fotográficos descentrados'
    ],
    description: 'Movimiento seminal que disolvió la rigidez académica para plasmar la vibración luminosa del mundo real mediante pinceladas rápidas y mezclas puras en la retina del observador.',
    paletteColors: ['#5C82A6', '#D9A752', '#8EA66F', '#E8D2A0', '#4A6B82']
  }
};

export const SAMPLE_ARTWORKS: SampleArtwork[] = [
  {
    id: 'kirchner-munch-marc-angst',
    title: 'Paisaje con Caballos (Angst and Ecstasy)',
    artists: 'Ernst Ludwig Kirchner, Edvard Munch, Franz Marc',
    year: 'c. 1915',
    movementId: 'Expressionism',
    movementLabel: 'Expresionismo',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=1000&auto=format&fit=crop',
    description: 'Obra arquetípica del expresionismo con pinceladas en remolino, contrastes ardientes de bermellón y cerúleo, y figuras zoomórficas imbuidas de tensión psicológica.',
    institution: 'Colección de Referencia'
  },
  {
    id: 'picasso-braque-cubism',
    title: 'Naturaleza Muerta con Frutero y Violín',
    artists: 'Inspirado en Georges Braque & Pablo Picasso',
    year: 'c. 1911',
    movementId: 'Cubism',
    movementLabel: 'Cubismo',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=1000&auto=format&fit=crop',
    description: 'Fragmentación facetada de instrumentos musicales y partituras en tonos ocres y bistre, integrando múltiples perspectivas simultáneas.',
    institution: 'Colección de Referencia'
  },
  {
    id: 'monet-water-impressionism',
    title: 'Estanque de Nenúfares con Reflejos de Sauce',
    artists: 'Estilo Claude Monet',
    year: 'c. 1899',
    movementId: 'Impressionism',
    movementLabel: 'Impresionismo',
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?q=80&w=1000&auto=format&fit=crop',
    description: 'Vibración de luz diurna sobre el agua con pinceladas cortas yuxtapuestas en tonos celestes, verde veronés y reflejos solares dorados.',
    institution: 'Colección de Referencia'
  },
  {
    id: 'klimt-mucha-artnouveau',
    title: 'Danza de la Flor Dorada (Ornamentación)',
    artists: 'Estilo Gustav Klimt & Alphonse Mucha',
    year: 'c. 1902',
    movementId: 'Art_Nouveau_Modern',
    movementLabel: 'Art Nouveau / Modern',
    imageUrl: 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1000&auto=format&fit=crop',
    description: 'Curvaturas sinuosas con motivos vegetales entrelazados, espirales doradas y delicada estilización biomórfica de la figura humana.',
    institution: 'Colección de Referencia'
  }
];
