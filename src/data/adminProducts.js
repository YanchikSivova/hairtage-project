const priceMap = {
  cheap: 'LOW',
  medium: 'MEDIUM',
  Medium: 'MEDIUM',
  high: 'HIGH',
}

function imagePath(fileName) {
  return new URL(`../assets/images/${fileName}`, import.meta.url).href
}

const adminProducts = [
  {
    productId: 1,
    productName: 'LOREAL PROFESSIONNEL Shampoo Serie Expert Pro Longer',
    productTypeName: 'Шампуни',
    picUrl: imagePath('shampoo_1.png'),
    price: priceMap.medium,
    ingredients: ['Panthenol', 'Keratin'],
  },
  {
    productId: 2,
    productName: 'AUGUSTINUS BADER THE RICH',
    productTypeName: 'Шампуни',
    picUrl: imagePath('shampoo_2.png'),
    price: priceMap.high,
    ingredients: ['Panthenol', 'Keratin'],
  },
  {
    productId: 3,
    productName: 'HEDO Silver Shampoo',
    productTypeName: 'Шампуни',
    picUrl: imagePath('shampoo_3.png'),
    price: priceMap.cheap,
    ingredients: ['Panthenol', 'Keratin'],
  },
  {
    productId: 4,
    productName: 'MARIO FISSI 1937 Purificante',
    productTypeName: 'Шампуни',
    picUrl: imagePath('shampoo_4.png'),
    price: priceMap.medium,
    ingredients: ['Panthenol', 'Keratin'],
  },
  {
    productId: 5,
    productName:
      'Увлажняющая маска-водоросли для кудрявых волос Кудрявый метод №2',
    productTypeName: 'Маски',
    picUrl: imagePath('mask_1.png'),
    price: priceMap.Medium,
    ingredients: ['Shea Butter', 'Argan Oil'],
  },
  {
    productId: 6,
    productName: 'Name Skin CareBEAUTY HAIR Keratin and collagen',
    productTypeName: 'Маски',
    picUrl: imagePath('mask_2.png'),
    price: priceMap.cheap,
    ingredients: ['Shea Butter', 'Argan Oil'],
  },
  {
    productId: 7,
    productName: 'JOJO HaircosmeticsBerry',
    productTypeName: 'Маски',
    picUrl: imagePath('mask_3.png'),
    price: priceMap.high,
    ingredients: ['Shea Butter', 'Argan Oil'],
  },
  {
    productId: 8,
    productName: 'YadahDetangled Wash-Off',
    productTypeName: 'Бальзамы и кондиционеры',
    picUrl: imagePath('balm_1.png'),
    price: priceMap.medium,
    ingredients: ['Silk Protein'],
  },
  {
    productId: 9,
    productName: 'Tashe professionalStrength & Growth',
    productTypeName: 'Бальзамы и кондиционеры',
    picUrl: imagePath('balm_2.png'),
    price: priceMap.cheap,
    ingredients: ['Silk Protein'],
  },
  {
    productId: 10,
    productName: 'YAUGUSTINUS BADERTHE LEAVE-IN HAIR TREATMENT',
    productTypeName: 'Бальзамы и кондиционеры',
    picUrl: imagePath('balm_3.png'),
    price: priceMap.high,
    ingredients: ['Silk Protein'],
  },
  {
    productId: 11,
    productName: 'OKOLORebounce Curl RinseT',
    productTypeName: 'Бальзамы и кондиционеры',
    picUrl: imagePath('balm_4.png'),
    price: priceMap.medium,
    ingredients: ['Silk Protein'],
  },
  {
    productId: 12,
    productName: 'MD-1Miracle Recovery Conditioner',
    productTypeName: 'Бальзамы и кондиционеры',
    picUrl: imagePath('balm_5.png'),
    price: priceMap.cheap,
    ingredients: ['Silk Protein'],
  },
]

export default adminProducts