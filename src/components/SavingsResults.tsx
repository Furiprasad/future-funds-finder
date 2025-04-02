
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface SavingsResultsProps {
  futureValue: number;
  totalDeposits: number;
  totalInterest: number;
  years: number;
}

const SavingsResults = ({ futureValue, totalDeposits, totalInterest, years }: SavingsResultsProps) => {
  // Calculate percentages for progress bars
  const depositPercentage = (totalDeposits / futureValue) * 100;
  const interestPercentage = (totalInterest / futureValue) * 100;
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard 
          title="Future Value" 
          value={futureValue} 
          description={`Total after ${years} years`}
          valueColor="text-primary"
        />
        <StatCard 
          title="Total Deposits" 
          value={totalDeposits}
          description="Amount you contribute" 
          valueColor="text-secondary"
        />
        <StatCard 
          title="Interest Earned" 
          value={totalInterest} 
          description="Money made by your money"
          valueColor="text-finance-accent"
        />
      </div>
      
      <div className="space-y-4 mt-6">
        <h3 className="text-sm font-medium">Breakdown</h3>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Your Deposits</span>
            <span className="font-medium">${totalDeposits.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <Progress value={depositPercentage} className="h-2 bg-muted" indicatorClassName="bg-secondary" />
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Interest Earned</span>
            <span className="font-medium">${totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <Progress value={interestPercentage} className="h-2 bg-muted" indicatorClassName="bg-finance-accent" />
        </div>
      </div>
      
      <div className="mt-4 text-sm text-muted-foreground">
        <p>This calculator is for illustrative purposes only and does not guarantee future returns.</p>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  description: string;
  valueColor?: string;
}

const StatCard = ({ title, value, description, valueColor = "text-foreground" }: StatCardProps) => (
  <Card className="p-4">
    <div className="text-sm font-medium text-muted-foreground">{title}</div>
    <div className={`text-2xl font-bold mt-1 ${valueColor}`}>
      ${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}
    </div>
    <div className="text-xs text-muted-foreground mt-1">{description}</div>
  </Card>
);

export default SavingsResults;
