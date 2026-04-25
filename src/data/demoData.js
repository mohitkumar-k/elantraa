import { slugify } from '../utils/format'

const categorySeed = [
  {
    name: 'Designer Lehenga',
    slug: 'designer-lehenga',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=900&q=80',
    description: 'Curated lehengas with couture embroidery and elevated occasion styling.',
  },
  {
    name: 'Sequence Lehenga',
    slug: 'sequence-lehenga',
    image:
      'https://images.unsplash.com/photo-1610030469668-4c4fdd8b6457?auto=format&fit=crop&w=900&q=80',
    description: 'High-shimmer occasion wear designed for sangeet nights and celebrations.',
  },
  {
    name: 'Saree',
    slug: 'saree',
    image:
      'https://images.unsplash.com/photo-1583391733956-6c77a021f6cf?auto=format&fit=crop&w=900&q=80',
    description: 'Statement sarees balancing heritage drape with a modern feminine finish.',
  },
  {
    name: 'Kurti',
    slug: 'kurti',
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=900&q=80',
    description: 'Everyday festive kurtis crafted for comfort, movement, and elegance.',
  },
]

const productSeed = [
  ['Regal Zari Lehenga', 'designer-lehenga', 12999, 8999, 'Wine', 'Silk Blend', true],
  ['Noor Mirror Lehenga', 'designer-lehenga', 14999, 10499, 'Rose Pink', 'Georgette', false],
  ['Sequin Aura Lehenga', 'sequence-lehenga', 11999, 7799, 'Magenta', 'Net', true],
  ['Starlit Flair Lehenga', 'sequence-lehenga', 10999, 7299, 'Champagne', 'Tulle', false],
  ['Banarasi Bloom Saree', 'saree', 7999, 5299, 'Ruby', 'Banarasi Silk', true],
  ['Ivory Pearl Saree', 'saree', 8999, 6299, 'Ivory', 'Organza', false],
  ['Gulnaar Embroidered Kurti', 'kurti', 3499, 2399, 'Rani Pink', 'Cotton Silk', true],
  ['Mogra A-Line Kurti', 'kurti', 2999, 1999, 'Off White', 'Rayon', false],
  ['Festive Drape Saree', 'saree', 6999, 4599, 'Deep Rose', 'Chiffon', false],
  ['Velvet Radiance Lehenga', 'designer-lehenga', 15999, 11499, 'Plum', 'Velvet', true],
]

export const demoCategories = categorySeed

export const demoHomeContent = {
  hero: {
    eyebrow: 'Premium Indian Fashion',
    title: 'Occasion wear with couture grace.',
    description:
      'Discover signature lehengas, luminous sarees, and elevated festive pieces designed to feel timeless.',
    ctaLabel: 'Shop Now',
    ctaLink: '/category/designer-lehenga',
    image:
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1400&q=80',
    imageAlt: 'ELANTRAA hero',
  },
}

export const demoProducts = productSeed.map(
  ([name, category, mrp, salePrice, color, fabric, isFeatured], index) => {
    const id = slugify(`${name}-${index + 1}`)
    return {
      id,
      name,
      category,
      mrp,
      salePrice,
      coverImage: `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80&sig=${index + 1}`,
      images: [
        `https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80&sig=${index + 1}`,
        `https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80&sig=${index + 11}`,
        `https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80&sig=${index + 21}`,
        `https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=80&sig=${index + 31}`,
      ],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', 'Free Size'],
      fabric,
      color,
      description:
        'Designed with statement festive detailing, soft lining, and a flattering silhouette for wedding and celebration dressing.',
      stock: 12 + index,
      isFeatured,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
    }
  },
)
