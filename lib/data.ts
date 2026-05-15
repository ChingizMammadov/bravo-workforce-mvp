// Simulated operational dataset for Bravo Workforce Intelligence MVP.
// All numbers are static / deterministic so demos are reproducible.

export type DepartmentCategory =
  | "Meat"
  | "Fish"
  | "Bakery"
  | "Dairy"
  | "Vegetables"
  | "Shelf"
  | "Inventory";

export type Priority = "high" | "medium" | "low" | "completed";

export interface Branch {
  id: string;
  name: string;
  type: "Supermarket" | "Hypermarket";
  city: string;
  employees: number;
}

export interface Department {
  id: string;
  branchId: string;
  category: DepartmentCategory;
  productivity: number;   // 0-100
  fifo: number;           // 0-100
  wasteRate: number;      // %
  turnover: number;       // 0-100
  taskEfficiency: number; // 0-100
  salesGrowth: number;    // %
  trend: number[];        // last 7 days productivity
}

export interface Employee {
  id: string;
  name: string;
  branchId: string;
  departmentCategory: DepartmentCategory;
  performance: number;   // 0-100
  completedMissions: number;
  rewardStatus: "Gold" | "Silver" | "Bronze" | "Pending";
}

export interface InventoryItem {
  id: string;
  name: string;
  branchId: string;
  departmentCategory: DepartmentCategory;
  expiryRisk: number;       // 0-100
  spoilageProbability: number; // 0-100
  inventoryAge: number;     // hours
  quantity: number;
}

export const branches: Branch[] = [
  { id: "br-01", name: "Branch 01", type: "Supermarket", city: "Baku Center", employees: 48 },
  { id: "br-04", name: "Branch 04", type: "Hypermarket", city: "Yasamal", employees: 96 },
  { id: "br-09", name: "Branch 09", type: "Supermarket", city: "Nasimi", employees: 54 },
  { id: "br-12", name: "Branch 12", type: "Hypermarket", city: "Khatai", employees: 110 },
  { id: "br-15", name: "Branch 15", type: "Supermarket", city: "Narimanov", employees: 41 },
];

const CATEGORIES: DepartmentCategory[] = [
  "Meat",
  "Fish",
  "Bakery",
  "Dairy",
  "Vegetables",
  "Shelf",
  "Inventory",
];

// Deterministic pseudo-random based on string hash so values are stable.
function seeded(seed: string, min: number, max: number) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const n = Math.abs(Math.sin(h)) * 10000;
  const frac = n - Math.floor(n);
  return Math.round(min + frac * (max - min));
}

export const departments: Department[] = branches.flatMap((b) =>
  CATEGORIES.map<Department>((cat) => {
    const key = `${b.id}-${cat}`;
    const productivity = seeded(key + "p", 62, 96);
    const fifo = seeded(key + "f", 70, 98);
    const wasteRate = seeded(key + "w", 4, 18);
    const turnover = seeded(key + "t", 60, 95);
    const taskEfficiency = seeded(key + "e", 65, 95);
    const salesGrowth = seeded(key + "s", 2, 22);
    const trend = Array.from({ length: 7 }).map((_, i) =>
      Math.max(40, Math.min(100, productivity + seeded(key + "tr" + i, -8, 8)))
    );
    return {
      id: `${b.id}-${cat.toLowerCase()}`,
      branchId: b.id,
      category: cat,
      productivity,
      fifo,
      wasteRate,
      turnover,
      taskEfficiency,
      salesGrowth,
      trend,
    };
  })
);

const FIRST = [
  "Aysel", "Rashad", "Leyla", "Tural", "Nigar", "Elvin", "Sevda", "Kamran",
  "Ulvi", "Aynur", "Murad", "Gunay", "Farid", "Lala", "Orkhan",
];
const LAST = [
  "Aliyev", "Mammadova", "Huseynov", "Ibrahimli", "Karimova", "Quliyev",
  "Hasanli", "Babayeva", "Aghayev", "Rzayeva",
];

export const employees: Employee[] = branches.flatMap((b) =>
  CATEGORIES.flatMap((cat) =>
    Array.from({ length: 3 }).map<Employee>((_, i) => {
      const key = `${b.id}-${cat}-${i}`;
      const performance = seeded(key + "pe", 60, 98);
      const tier =
        performance >= 90 ? "Gold" : performance >= 80 ? "Silver" : performance >= 70 ? "Bronze" : "Pending";
      return {
        id: `${b.id}-${cat.toLowerCase()}-emp-${i}`,
        name: `${FIRST[seeded(key + "fn", 0, FIRST.length - 1)]} ${LAST[seeded(key + "ln", 0, LAST.length - 1)]}`,
        branchId: b.id,
        departmentCategory: cat,
        performance,
        completedMissions: seeded(key + "cm", 4, 38),
        rewardStatus: tier,
      };
    })
  )
);

const SAMPLE_PRODUCTS: Record<DepartmentCategory, string[]> = {
  Meat: ["Chicken breast", "Beef mince", "Lamb chops", "Pork ribs", "Turkey fillet"],
  Fish: ["Salmon fillet", "Sea bass", "Shrimp pack", "Trout", "Tuna steak"],
  Bakery: ["Sourdough loaf", "Croissants", "Baguette", "Cinnamon rolls", "Whole-wheat bread"],
  Dairy: ["Greek yogurt", "Whole milk 1L", "Mozzarella 200g", "Butter 250g", "Cottage cheese"],
  Vegetables: ["Tomatoes", "Leafy greens", "Bell peppers", "Cucumbers", "Mushrooms"],
  Shelf: ["Cereal box", "Pasta 500g", "Olive oil 1L", "Canned tuna", "Coffee 250g"],
  Inventory: ["Backroom pallet A", "Cold-room rack B", "Dry-storage bin C", "Receiving lot D", "Returns crate E"],
};

export const inventory: InventoryItem[] = branches.flatMap((b) =>
  CATEGORIES.flatMap((cat) =>
    SAMPLE_PRODUCTS[cat].map<InventoryItem>((name, idx) => {
      const key = `${b.id}-${cat}-${idx}`;
      return {
        id: `${b.id}-${cat.toLowerCase()}-inv-${idx}`,
        name,
        branchId: b.id,
        departmentCategory: cat,
        expiryRisk: seeded(key + "er", 10, 95),
        spoilageProbability: seeded(key + "sp", 5, 90),
        inventoryAge: seeded(key + "ia", 1, 72),
        quantity: seeded(key + "qty", 5, 120),
      };
    })
  )
);

export const branchById = (id: string) => branches.find((b) => b.id === id)!;
