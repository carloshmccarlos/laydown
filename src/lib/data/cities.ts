import { CityCostProfile, ExpenseBreakdown } from "@/lib/types";

type CitySeed = Omit<CityCostProfile, "expenseBreakdown">;

const CATEGORY_WEIGHTS: ExpenseBreakdown = {
  rentOrMortgage: 0.34,
  food: 0.22,
  transport: 0.08,
  communication: 0.035,
  clothing: 0.055,
  medical: 0.055,
  insurance: 0.035,
  entertainmentEducation: 0.1,
  familySupport: 0.04,
  other: 0.04,
};

const CITY_SEEDS: CitySeed[] = [
  { cityCode: "beijing", cityName: "北京", province: "北京", tier: "一线", baseMonthlyCost: 15000, rentIndex: 1.5, foodIndex: 1.2, transportIndex: 1.1, entertainmentIndex: 1.3 },
  { cityCode: "shanghai", cityName: "上海", province: "上海", tier: "一线", baseMonthlyCost: 14500, rentIndex: 1.45, foodIndex: 1.2, transportIndex: 1.1, entertainmentIndex: 1.3 },
  { cityCode: "shenzhen", cityName: "深圳", province: "广东", tier: "一线", baseMonthlyCost: 14000, rentIndex: 1.4, foodIndex: 1.15, transportIndex: 1.05, entertainmentIndex: 1.2 },
  { cityCode: "guangzhou", cityName: "广州", province: "广东", tier: "一线", baseMonthlyCost: 12000, rentIndex: 1.2, foodIndex: 1.15, transportIndex: 1, entertainmentIndex: 1.2 },
  { cityCode: "chengdu", cityName: "成都", province: "四川", tier: "新一线", baseMonthlyCost: 8500, rentIndex: 1, foodIndex: 1.1, transportIndex: 0.9, entertainmentIndex: 1.1 },
  { cityCode: "hangzhou", cityName: "杭州", province: "浙江", tier: "新一线", baseMonthlyCost: 11000, rentIndex: 1.3, foodIndex: 1.1, transportIndex: 1, entertainmentIndex: 1.2 },
  { cityCode: "wuhan", cityName: "武汉", province: "湖北", tier: "新一线", baseMonthlyCost: 8000, rentIndex: 0.9, foodIndex: 1, transportIndex: 0.9, entertainmentIndex: 1 },
  { cityCode: "xian", cityName: "西安", province: "陕西", tier: "新一线", baseMonthlyCost: 7500, rentIndex: 0.85, foodIndex: 1, transportIndex: 0.85, entertainmentIndex: 0.9 },
  { cityCode: "nanjing", cityName: "南京", province: "江苏", tier: "新一线", baseMonthlyCost: 10000, rentIndex: 1.15, foodIndex: 1.05, transportIndex: 0.95, entertainmentIndex: 1.1 },
  { cityCode: "chongqing", cityName: "重庆", province: "重庆", tier: "新一线", baseMonthlyCost: 8000, rentIndex: 0.9, foodIndex: 1.1, transportIndex: 0.9, entertainmentIndex: 1 },
  { cityCode: "tianjin", cityName: "天津", province: "天津", tier: "新一线", baseMonthlyCost: 9000, rentIndex: 1, foodIndex: 1, transportIndex: 0.9, entertainmentIndex: 1 },
  { cityCode: "suzhou", cityName: "苏州", province: "江苏", tier: "新一线", baseMonthlyCost: 9500, rentIndex: 1.05, foodIndex: 1, transportIndex: 0.9, entertainmentIndex: 1 },
  { cityCode: "qingdao", cityName: "青岛", province: "山东", tier: "新一线", baseMonthlyCost: 8500, rentIndex: 0.95, foodIndex: 1.05, transportIndex: 0.85, entertainmentIndex: 1 },
  { cityCode: "changsha", cityName: "长沙", province: "湖南", tier: "新一线", baseMonthlyCost: 7500, rentIndex: 0.8, foodIndex: 1.05, transportIndex: 0.85, entertainmentIndex: 1 },
  { cityCode: "zhengzhou", cityName: "郑州", province: "河南", tier: "新一线", baseMonthlyCost: 7000, rentIndex: 0.75, foodIndex: 0.95, transportIndex: 0.8, entertainmentIndex: 0.9 },
  { cityCode: "ningbo", cityName: "宁波", province: "浙江", tier: "新一线", baseMonthlyCost: 9000, rentIndex: 1, foodIndex: 1.05, transportIndex: 0.9, entertainmentIndex: 1 },
  { cityCode: "wuxi", cityName: "无锡", province: "江苏", tier: "二线", baseMonthlyCost: 8000, rentIndex: 0.9, foodIndex: 1, transportIndex: 0.85, entertainmentIndex: 0.9 },
  { cityCode: "foshan", cityName: "佛山", province: "广东", tier: "二线", baseMonthlyCost: 7500, rentIndex: 0.8, foodIndex: 1, transportIndex: 0.85, entertainmentIndex: 0.9 },
  { cityCode: "hefei", cityName: "合肥", province: "安徽", tier: "二线", baseMonthlyCost: 7000, rentIndex: 0.75, foodIndex: 0.95, transportIndex: 0.8, entertainmentIndex: 0.9 },
  { cityCode: "dalian", cityName: "大连", province: "辽宁", tier: "二线", baseMonthlyCost: 8000, rentIndex: 0.85, foodIndex: 1.05, transportIndex: 0.85, entertainmentIndex: 0.9 },
  { cityCode: "xiamen", cityName: "厦门", province: "福建", tier: "二线", baseMonthlyCost: 9000, rentIndex: 1.05, foodIndex: 1, transportIndex: 0.85, entertainmentIndex: 1 },
  { cityCode: "kunming", cityName: "昆明", province: "云南", tier: "二线", baseMonthlyCost: 6500, rentIndex: 0.7, foodIndex: 0.95, transportIndex: 0.75, entertainmentIndex: 0.9 },
  { cityCode: "jinan", cityName: "济南", province: "山东", tier: "二线", baseMonthlyCost: 7500, rentIndex: 0.8, foodIndex: 0.95, transportIndex: 0.8, entertainmentIndex: 0.9 },
  { cityCode: "harbin", cityName: "哈尔滨", province: "黑龙江", tier: "二线", baseMonthlyCost: 6000, rentIndex: 0.65, foodIndex: 0.9, transportIndex: 0.75, entertainmentIndex: 0.85 },
  { cityCode: "shenyang", cityName: "沈阳", province: "辽宁", tier: "二线", baseMonthlyCost: 6500, rentIndex: 0.7, foodIndex: 0.9, transportIndex: 0.75, entertainmentIndex: 0.85 },
  { cityCode: "dongguan", cityName: "东莞", province: "广东", tier: "二线", baseMonthlyCost: 7500, rentIndex: 0.8, foodIndex: 1, transportIndex: 0.85, entertainmentIndex: 0.9 },
  { cityCode: "changchun", cityName: "长春", province: "吉林", tier: "二线", baseMonthlyCost: 6000, rentIndex: 0.65, foodIndex: 0.9, transportIndex: 0.7, entertainmentIndex: 0.85 },
  { cityCode: "shijiazhuang", cityName: "石家庄", province: "河北", tier: "二线", baseMonthlyCost: 6000, rentIndex: 0.65, foodIndex: 0.9, transportIndex: 0.75, entertainmentIndex: 0.85 },
  { cityCode: "nanchang", cityName: "南昌", province: "江西", tier: "二线", baseMonthlyCost: 6500, rentIndex: 0.7, foodIndex: 0.95, transportIndex: 0.75, entertainmentIndex: 0.85 },
  { cityCode: "guiyang", cityName: "贵阳", province: "贵州", tier: "二线", baseMonthlyCost: 6000, rentIndex: 0.65, foodIndex: 0.9, transportIndex: 0.7, entertainmentIndex: 0.85 },
  { cityCode: "taiyuan", cityName: "太原", province: "山西", tier: "二线", baseMonthlyCost: 6000, rentIndex: 0.65, foodIndex: 0.9, transportIndex: 0.7, entertainmentIndex: 0.85 },
  { cityCode: "lanzhou", cityName: "兰州", province: "甘肃", tier: "三线", baseMonthlyCost: 5500, rentIndex: 0.6, foodIndex: 0.85, transportIndex: 0.65, entertainmentIndex: 0.8 },
  { cityCode: "yantai", cityName: "烟台", province: "山东", tier: "三线", baseMonthlyCost: 5500, rentIndex: 0.6, foodIndex: 0.9, transportIndex: 0.65, entertainmentIndex: 0.8 },
  { cityCode: "weihai", cityName: "威海", province: "山东", tier: "三线", baseMonthlyCost: 5000, rentIndex: 0.55, foodIndex: 0.85, transportIndex: 0.6, entertainmentIndex: 0.8 },
  { cityCode: "liuzhou", cityName: "柳州", province: "广西", tier: "三线", baseMonthlyCost: 5000, rentIndex: 0.55, foodIndex: 0.85, transportIndex: 0.6, entertainmentIndex: 0.8 },
  { cityCode: "yinchuan", cityName: "银川", province: "宁夏", tier: "三线", baseMonthlyCost: 5000, rentIndex: 0.55, foodIndex: 0.85, transportIndex: 0.6, entertainmentIndex: 0.8 },
  { cityCode: "xining", cityName: "西宁", province: "青海", tier: "三线", baseMonthlyCost: 4500, rentIndex: 0.5, foodIndex: 0.8, transportIndex: 0.55, entertainmentIndex: 0.75 },
  { cityCode: "huizhou", cityName: "惠州", province: "广东", tier: "三线", baseMonthlyCost: 5500, rentIndex: 0.6, foodIndex: 0.9, transportIndex: 0.65, entertainmentIndex: 0.8 },
  { cityCode: "langfang", cityName: "廊坊", province: "河北", tier: "三线", baseMonthlyCost: 5500, rentIndex: 0.6, foodIndex: 0.85, transportIndex: 0.65, entertainmentIndex: 0.8 },
  { cityCode: "custom", cityName: "自定义", province: "", tier: "四线及以下", baseMonthlyCost: 4000, rentIndex: 1, foodIndex: 1, transportIndex: 1, entertainmentIndex: 1 },
];

export const CITIES: CityCostProfile[] = CITY_SEEDS.map((seed) => ({
  ...seed,
  expenseBreakdown: buildExpenseBreakdown(seed),
}));

export function buildExpenseBreakdown(city: Pick<CityCostProfile, "baseMonthlyCost" | "rentIndex" | "foodIndex" | "transportIndex" | "entertainmentIndex">): ExpenseBreakdown {
  const adjusted = {
    rentOrMortgage: CATEGORY_WEIGHTS.rentOrMortgage * city.rentIndex,
    food: CATEGORY_WEIGHTS.food * city.foodIndex,
    transport: CATEGORY_WEIGHTS.transport * city.transportIndex,
    communication: CATEGORY_WEIGHTS.communication,
    clothing: CATEGORY_WEIGHTS.clothing,
    medical: CATEGORY_WEIGHTS.medical,
    insurance: CATEGORY_WEIGHTS.insurance,
    entertainmentEducation: CATEGORY_WEIGHTS.entertainmentEducation * city.entertainmentIndex,
    familySupport: CATEGORY_WEIGHTS.familySupport,
    other: CATEGORY_WEIGHTS.other,
  };
  const totalWeight = Object.values(adjusted).reduce((sum, value) => sum + value, 0);
  const entries = Object.entries(adjusted).map(([key, weight]) => [
    key,
    Math.round((city.baseMonthlyCost * weight) / totalWeight / 10) * 10,
  ]);
  const result = Object.fromEntries(entries) as ExpenseBreakdown;
  const diff = city.baseMonthlyCost - sumExpenseBreakdown(result);
  result.other += diff;
  return result;
}

export function sumExpenseBreakdown(breakdown: ExpenseBreakdown): number {
  return Object.values(breakdown).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0);
}

export function getCityByCode(code: string): CityCostProfile | undefined {
  return CITIES.find((c) => c.cityCode === code);
}

export function getCityOptions() {
  return CITIES.map((c) => ({ value: c.cityCode, label: `${c.cityName} (${c.tier})` }));
}
