import 'dotenv/config'
import { initializeApp } from 'firebase/app'
import { getFirestore, collection, doc, setDoc } from 'firebase/firestore'

const demoCategories = [
  {
    name: 'Designer Lehenga',
    slug: 'designer-lehenga',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    description: 'Curated lehengas with couture embroidery and elevated occasion styling.',
  },
  {
    name: 'Sequence Lehenga',
    slug: 'sequence-lehenga',
    image: 'https://images.unsplash.com/photo-1610030469668-4c4fdd8b6457?auto=format&fit=crop&w=900&q=80',
    description: 'High-shimmer occasion wear designed for sangeet nights and celebrations.',
  },
  {
    name: 'Saree',
    slug: 'saree',
    image: 'https://images.unsplash.com/photo-1583391733956-6c77a021f6cf?auto=format&fit=crop&w=900&q=80',
    description: 'Statement sarees balancing heritage drape with a modern feminine finish.',
  },
  {
    name: 'Kurti',
    slug: 'kurti',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Everyday festive kurtis crafted for comfort, movement, and elegance.',
  },
]

const demoProducts = [
  {
    id: 'regal-zari-lehenga-1',
    name: 'Regal Zari Lehenga',
    category: 'designer-lehenga',
    mrp: 12999,
    salePrice: 8999,
    images: ['https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    fabric: 'Silk Blend',
    color: 'Wine',
    description: 'Designed with statement festive detailing, soft lining, and a flattering silhouette.',
    stock: 12,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'noor-mirror-lehenga-2',
    name: 'Noor Mirror Lehenga',
    category: 'designer-lehenga',
    mrp: 14999,
    salePrice: 10499,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    fabric: 'Georgette',
    color: 'Rose Pink',
    description: 'Mirror work lehenga crafted for reception and sangeet moments.',
    stock: 10,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sequin-aura-lehenga-3',
    name: 'Sequin Aura Lehenga',
    category: 'sequence-lehenga',
    mrp: 11999,
    salePrice: 7799,
    images: ['https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    fabric: 'Net',
    color: 'Magenta',
    description: 'Light-catching sequin work with a fluid drape.',
    stock: 18,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'starlit-flair-lehenga-4',
    name: 'Starlit Flair Lehenga',
    category: 'sequence-lehenga',
    mrp: 10999,
    salePrice: 7299,
    images: ['https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    fabric: 'Tulle',
    color: 'Champagne',
    description: 'Festive silhouette with subtle shimmer and easy movement.',
    stock: 15,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'banarasi-bloom-saree-5',
    name: 'Banarasi Bloom Saree',
    category: 'saree',
    mrp: 7999,
    salePrice: 5299,
    images: ['https://images.unsplash.com/photo-1583391733956-6c77a021f6cf?auto=format&fit=crop&w=900&q=80'],
    sizes: ['Free Size'],
    fabric: 'Banarasi Silk',
    color: 'Ruby',
    description: 'A rich weave inspired by classic festive dressing.',
    stock: 22,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'ivory-pearl-saree-6',
    name: 'Ivory Pearl Saree',
    category: 'saree',
    mrp: 8999,
    salePrice: 6299,
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80'],
    sizes: ['Free Size'],
    fabric: 'Organza',
    color: 'Ivory',
    description: 'Soft-toned saree with elegant texture and drape.',
    stock: 16,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'gulnaar-embroidered-kurti-7',
    name: 'Gulnaar Embroidered Kurti',
    category: 'kurti',
    mrp: 3499,
    salePrice: 2399,
    images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Cotton Silk',
    color: 'Rani Pink',
    description: 'Embroidered kurti balancing comfort with festive polish.',
    stock: 30,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mogra-a-line-kurti-8',
    name: 'Mogra A-Line Kurti',
    category: 'kurti',
    mrp: 2999,
    salePrice: 1999,
    images: ['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    fabric: 'Rayon',
    color: 'Off White',
    description: 'Everyday festive staple with soft fluid tailoring.',
    stock: 26,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'festive-drape-saree-9',
    name: 'Festive Drape Saree',
    category: 'saree',
    mrp: 6999,
    salePrice: 4599,
    images: ['https://images.unsplash.com/photo-1610030469668-4c4fdd8b6457?auto=format&fit=crop&w=900&q=80'],
    sizes: ['Free Size'],
    fabric: 'Chiffon',
    color: 'Deep Rose',
    description: 'Lightweight saree made for long festive evenings.',
    stock: 20,
    isFeatured: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'velvet-radiance-lehenga-10',
    name: 'Velvet Radiance Lehenga',
    category: 'designer-lehenga',
    mrp: 15999,
    salePrice: 11499,
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
    fabric: 'Velvet',
    color: 'Plum',
    description: 'Rich festive velvet with elevated handcrafted finish.',
    stock: 8,
    isFeatured: true,
    createdAt: new Date().toISOString(),
  },
]

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('Missing Firebase env values. Load them before running the seed script.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

for (const category of demoCategories) {
  await setDoc(doc(collection(db, 'categories'), category.slug), category)
}

for (const product of demoProducts) {
  await setDoc(doc(collection(db, 'products'), product.id), product)
}

console.log(`Seeded ${demoProducts.length} products and ${demoCategories.length} categories.`)
