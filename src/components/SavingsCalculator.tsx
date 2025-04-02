
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SavingsResults from "./SavingsResults";
import SavingsChart from "./SavingsChart";
import { Button } from "@/components/ui/button";
import { Calculator, PiggyBank, RefreshCw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SavingsData {
  initialAmount: number;
  monthlyContribution: number;
  interestRate: number;
  years: number;
}

const SavingsCalculator = () => {
  const [savingsData, setSavingsData] = useState<SavingsData>({
    initialAmount: 1000,
    monthlyContribution: 200,
    interestRate: 5,
    years: 10,
  });
  
  const [results, setResults] = useState({
    futureValue: 0,
    totalDeposits: 0,
    totalInterest: 0,
    monthlyData: [] as { month: number; balance: number }[],
  });
  
  const { toast } = useToast();

  // Calculate savings whenever inputs change
  useEffect(() => {
    calculateSavings();
  }, [savingsData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value) || 0;
    
    setSavingsData((prev) => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const calculateSavings = () => {
    const { initialAmount, monthlyContribution, interestRate, years } = savingsData;
    
    // Convert annual rate to monthly
    const monthlyRate = interestRate / 100 / 12;
    const totalMonths = years * 12;
    let currentBalance = initialAmount;
    const monthlyData = [];
    
    // Calculate future value using compound interest formula
    for (let month = 1; month <= totalMonths; month++) {
      currentBalance = currentBalance * (1 + monthlyRate) + monthlyContribution;
      
      // Store monthly data points (storing every 6th month to reduce data points)
      if (month % 6 === 0 || month === totalMonths) {
        monthlyData.push({
          month,
          balance: Math.round(currentBalance),
        });
      }
    }
    
    const futureValue = currentBalance;
    const totalDeposits = initialAmount + (monthlyContribution * totalMonths);
    const totalInterest = futureValue - totalDeposits;
    
    setResults({
      futureValue,
      totalDeposits,
      totalInterest,
      monthlyData,
    });
  };

  const resetCalculator = () => {
    setSavingsData({
      initialAmount: 1000,
      monthlyContribution: 200,
      interestRate: 5, 
      years: 10,
    });
    
    toast({
      title: "Calculator Reset",
      description: "All values have been reset to defaults.",
    });
  };

  return (
    <div className="container py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Calculator className="h-8 w-8 text-primary" />
            Savings Calculator
          </h1>
          <p className="text-muted-foreground">Plan your financial future with our easy-to-use calculator</p>
        </div>
        <Button variant="outline" size="sm" onClick={resetCalculator} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Reset
        </Button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              Your Savings Plan
            </CardTitle>
            <CardDescription>
              Adjust the values to see how your savings could grow over time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="initialAmount">Starting Amount</Label>
                  <span className="text-sm text-muted-foreground">${savingsData.initialAmount.toLocaleString()}</span>
                </div>
                <div className="input-amount">
                  <Input
                    id="initialAmount"
                    name="initialAmount"
                    type="number"
                    min="0"
                    value={savingsData.initialAmount}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="monthlyContribution">Monthly Contribution</Label>
                  <span className="text-sm text-muted-foreground">${savingsData.monthlyContribution.toLocaleString()}</span>
                </div>
                <div className="input-amount">
                  <Input
                    id="monthlyContribution"
                    name="monthlyContribution"
                    type="number"
                    min="0"
                    value={savingsData.monthlyContribution}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="interestRate">Annual Interest Rate (%)</Label>
                  <span className="text-sm text-muted-foreground">{savingsData.interestRate}%</span>
                </div>
                <Slider
                  id="interestRate"
                  min={0}
                  max={20}
                  step={0.1}
                  value={[savingsData.interestRate]}
                  onValueChange={(value) => {
                    setSavingsData((prev) => ({
                      ...prev,
                      interestRate: value[0],
                    }));
                  }}
                />
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label htmlFor="years">Time Period (Years)</Label>
                  <span className="text-sm text-muted-foreground">{savingsData.years} years</span>
                </div>
                <Slider
                  id="years"
                  min={1}
                  max={40}
                  step={1}
                  value={[savingsData.years]}
                  onValueChange={(value) => {
                    setSavingsData((prev) => ({
                      ...prev,
                      years: value[0],
                    }));
                  }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Results</CardTitle>
            <CardDescription>
              See how your savings will grow over {savingsData.years} years
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary">
              <TabsList className="mb-4">
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="chart">Chart</TabsTrigger>
              </TabsList>
              <TabsContent value="summary">
                <SavingsResults 
                  futureValue={results.futureValue}
                  totalDeposits={results.totalDeposits}
                  totalInterest={results.totalInterest}
                  years={savingsData.years}
                />
              </TabsContent>
              <TabsContent value="chart">
                <SavingsChart data={results.monthlyData} />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SavingsCalculator;
