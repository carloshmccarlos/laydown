import { CalculatorFormState, CalculatorResult, SavedPlan } from "@/lib/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CalculatorState {
  formState: CalculatorFormState | null;
  result: CalculatorResult | null;
  plans: SavedPlan[];
  comparePlanIds: string[];
  selectedPlanId: string | null;
  setFormState: (state: CalculatorFormState) => void;
  setResult: (result: CalculatorResult) => void;
  addPlan: (plan: SavedPlan) => void;
  updatePlan: (id: string, updates: Partial<SavedPlan>) => void;
  deletePlan: (id: string) => void;
  duplicatePlan: (id: string) => void;
  toggleComparePlan: (id: string) => void;
  clearComparePlans: () => void;
  setSelectedPlanId: (id: string | null) => void;
}

const STORAGE_KEY = "lying_flat_calculator_plans";

export const useCalculatorStore = create<CalculatorState>()(
  persist(
    (set, get) => ({
      formState: null,
      result: null,
      plans: [],
      comparePlanIds: [],
      selectedPlanId: null,

      setFormState: (formState) => set({ formState }),
      setResult: (result) => set({ result }),

      addPlan: (plan) => {
        const { plans } = get();
        if (plans.length >= 50) {
          alert("最多保存 50 个方案");
          return;
        }
        set({ plans: [plan, ...plans] });
      },

      updatePlan: (id, updates) => {
        const { plans } = get();
        set({
          plans: plans.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)),
        });
      },

      deletePlan: (id) => {
        const { plans, comparePlanIds } = get();
        set({
          plans: plans.filter((p) => p.id !== id),
          comparePlanIds: comparePlanIds.filter((pid) => pid !== id),
        });
      },

      duplicatePlan: (id) => {
        const { plans } = get();
        const plan = plans.find((p) => p.id === id);
        if (!plan) return;
        const newPlan: SavedPlan = {
          ...plan,
          id: generateId(),
          name: `${plan.name} (复制)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        get().addPlan(newPlan);
      },

      toggleComparePlan: (id) => {
        const { comparePlanIds } = get();
        if (comparePlanIds.includes(id)) {
          set({ comparePlanIds: comparePlanIds.filter((pid) => pid !== id) });
        } else if (comparePlanIds.length < 5) {
          set({ comparePlanIds: [...comparePlanIds, id] });
        } else {
          alert("最多对比 5 个方案");
        }
      },

      clearComparePlans: () => set({ comparePlanIds: [] }),
      setSelectedPlanId: (id) => set({ selectedPlanId: id }),
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ plans: state.plans, comparePlanIds: state.comparePlanIds }),
    }
  )
);

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}
