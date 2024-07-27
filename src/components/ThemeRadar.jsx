"use client"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart2 } from 'lucide-react';
import { RadarChart } from "@tremor/react";

const ThemeRadar = ({ themeData }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart2 className="mr-2" /> Theme Radar
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadarChart
          className="h-[300px]"
          data={themeData}
          category="value"
          index="theme"
          colors={['blue']}
          showLegend={false}
          valueFormatter={(value) => `${value.toFixed(2)}`}
        />
      </CardContent>
    </Card>
  );
};

export default ThemeRadar;