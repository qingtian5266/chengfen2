import type { ProductDetail } from '../../apis/product'

export type FoodDetailMock = ProductDetail & {
  spec: string
  price: number
  image_url: string
}

export const MOCK_FOOD_DETAIL: FoodDetailMock = {
  id: 10001,
  name: '中粮梅林午餐肉罐头',
  brand: '梅林',
  barcode: '6901234567890',
  category: 'food',
  risk_level: 'medium',
  spec: '340g',
  price: 9.81,
  image_url:
    'https://images.unsplash.com/photo-1506619216599-9d16d0903dfd?auto=format&fit=crop&w=600&q=80',
  ingredients_text:
    '猪肉、水、淀粉、大豆蛋白、食用盐、白砂糖、香辛料、味精、卡拉胶、三聚磷酸钠、焦磷酸钠。',
  isCollected: false,
  components: [
    {
      id: 201,
      name: '亚硝酸钠',
      risk_level: 'high',
      description: '常见防腐剂，摄入过量存在健康风险，建议控制频率。',
    },
    {
      id: 202,
      name: '三聚磷酸钠',
      risk_level: 'medium',
      description: '常用水分保持剂，长期大量摄入需关注矿物质平衡。',
    },
    {
      id: 203,
      name: '焦磷酸钠',
      risk_level: 'medium',
      description: '常见食品添加剂，建议关注总摄入量。',
    },
    {
      id: 204,
      name: '味精',
      risk_level: 'low',
      description: '常见增鲜剂，日常摄入通常安全。',
    },
  ],
}
