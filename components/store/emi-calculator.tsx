"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calculator, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type EMICalculatorProps = {
  price: number;
};

export function EMICalculator({ price }: EMICalculatorProps) {
  const [selectedPlan, setSelectedPlan] = useState<3 | 6 | 12>(3);
  const interestRate = 0; // 0% interest for simplicity in luxury store
  
  const calculateEMI = (months: number) => {
    return (price / months).toFixed(2);
  };

  const plans = [
    { months: 3, label: "3 Months" },
    { months: 6, label: "6 Months" },
    { months: 12, label: "12 Months" },
  ];

  return (
    <Dialog>
      <DialogTrigger className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors mt-2 underline underline-offset-4">
        <Calculator className="w-4 h-4" />
        Calculate EMI Options
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background border-border">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl text-foreground">EMI Calculator</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Enjoy 0% interest on all our installment plans. First payment is required as deposit at checkout.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-6">
          <div className="flex gap-4 mb-8">
            {plans.map((plan) => (
              <button
                key={plan.months}
                onClick={() => setSelectedPlan(plan.months as 3 | 6 | 12)}
                className={`flex-1 py-3 text-sm font-medium border transition-all ${
                  selectedPlan === plan.months 
                    ? "border-primary text-primary bg-primary/5" 
                    : "border-border text-muted-foreground hover:border-foreground/30"
                }`}
              >
                {plan.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPlan}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-muted p-6 rounded-sm space-y-4"
            >
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Product Price</span>
                <span className="text-foreground font-medium">${price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground text-sm">Interest Rate</span>
                <span className="text-foreground font-medium">{interestRate}%</span>
              </div>
              <div className="h-px bg-border my-2" />
              <div className="flex justify-between items-center">
                <span className="text-foreground font-medium">Monthly Installment</span>
                <span className="text-2xl text-primary font-heading">${calculateEMI(selectedPlan)}</span>
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 space-y-3">
            <h4 className="text-sm font-medium text-foreground">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Pay ${calculateEMI(selectedPlan)} today as your deposit.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Pay the remaining balance over {selectedPlan - 1} months.</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>No hidden fees or interest charges.</span>
              </li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
