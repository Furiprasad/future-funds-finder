
import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card } from "@/components/ui/card";

interface SavingsChartProps {
  data: { month: number; balance: number }[];
}

const SavingsChart: React.FC<SavingsChartProps> = ({ data }) => {
  // Format the data for the chart
  const formattedData = data.map(item => ({
    ...item,
    year: (item.month / 12).toFixed(1),
    balance: Math.round(item.balance),
  }));

  // Format currency for tooltip
  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <Card className="p-3 shadow-lg bg-popover border border-border">
          <p className="font-medium">{`Year ${Number(label).toFixed(1)}`}</p>
          <p className="text-primary font-bold">
            {formatCurrency(payload[0].value)}
          </p>
        </Card>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={formattedData}
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis 
            dataKey="year" 
            label={{ 
              value: 'Years', 
              position: 'insideBottomRight', 
              offset: -5 
            }}
            stroke="hsl(var(--foreground))"
          />
          <YAxis 
            tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            stroke="hsl(var(--foreground))"
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="balance"
            stroke="hsl(var(--primary))"
            strokeWidth={2}
            dot={{ fill: "hsl(var(--primary))", r: 4 }}
            activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SavingsChart;
