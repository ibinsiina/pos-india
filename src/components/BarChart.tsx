import React from 'react';
import { View, Text, Dimensions } from 'react-native';
import Svg, { Rect, Defs, LinearGradient, Stop, Text as SvgText, G, Line } from 'react-native-svg';

export type ChartDataPoint = {
  label: string;
  value1: number; // e.g. Sales
  value2?: number; // e.g. Purchases
};

type BarChartProps = {
  data: ChartDataPoint[];
  title: string;
  legend1?: string;
  legend2?: string;
  height?: number;
  width?: number;
};

export default function BarChart({ 
    data, 
    title,
    legend1 = "Sales",
    legend2 = "Purchases",
    height = 240, 
    width = Dimensions.get('window').width - 40 
}: BarChartProps) {
  // Find max value for scaling
  const maxValue = Math.max(
    ...data.flatMap(d => [d.value1, d.value2 || 0]),
    1 // prevent division by zero
  );

  const paddingTop = 20;
  const paddingBottom = 40;
  const chartHeight = height - paddingTop - paddingBottom;
  
  const barWidth = data[0]?.value2 !== undefined ? 14 : 24;
  const groupWidth = data[0]?.value2 !== undefined ? (barWidth * 2 + 4) : barWidth;
  const spacing = (width - data.length * groupWidth) / (data.length + 1);

  // Y-axis grid lines
  const gridLines = [0, 0.25, 0.5, 0.75, 1];

  return (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-border my-4 w-full">
      <Text className="font-sans-bold text-lg text-primary mb-4">{title}</Text>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
        <View className="flex-row items-center mr-4">
          <View className="w-3 h-3 rounded-full bg-[#122a2f] mr-2" />
          <Text className="font-sans-medium text-xs text-muted-foreground">{legend1}</Text>
        </View>
        {data[0]?.value2 !== undefined && (
          <View className="flex-row items-center">
            <View className="w-3 h-3 rounded-full bg-[#98e29a] mr-2" />
            <Text className="font-sans-medium text-xs text-muted-foreground">{legend2}</Text>
          </View>
        )}
      </View>

      <Svg width={width - 40} height={height}>
        <Defs>
          <LinearGradient id="gradSales" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#122a2f" stopOpacity="1" />
            <Stop offset="1" stopColor="#2a4a52" stopOpacity="1" />
          </LinearGradient>
          <LinearGradient id="gradPurchases" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#98e29a" stopOpacity="1" />
            <Stop offset="1" stopColor="#75cc78" stopOpacity="1" />
          </LinearGradient>
        </Defs>

        {/* Grid Lines */}
        {gridLines.map((ratio, index) => {
            const y = paddingTop + chartHeight * (1 - ratio);
            const value = Math.round(maxValue * ratio);
            
            // Format number (e.g. 10k, 1M)
            let formattedValue = value.toString();
            if (value >= 100000) formattedValue = (value / 100000).toFixed(1) + 'L';
            else if (value >= 1000) formattedValue = (value / 1000).toFixed(1) + 'k';
            if (value === 0) formattedValue = '0';

            return (
                <G key={`grid-${index}`}>
                    <Line
                        x1="30"
                        y1={y}
                        x2={width - 40}
                        y2={y}
                        stroke="#e2e8f0"
                        strokeWidth="1"
                        strokeDasharray="4 4"
                    />
                    <SvgText
                        x="25"
                        y={y + 4}
                        fontSize="10"
                        fill="#94a3b8"
                        textAnchor="end"
                    >
                        {formattedValue}
                    </SvgText>
                </G>
            );
        })}

        {/* Bars */}
        {data.map((item, index) => {
          const x = 30 + spacing + index * (groupWidth + spacing);
          
          const bar1Height = (item.value1 / maxValue) * chartHeight;
          const y1 = paddingTop + chartHeight - bar1Height;

          const bar2Height = item.value2 !== undefined ? (item.value2 / maxValue) * chartHeight : 0;
          const y2 = paddingTop + chartHeight - bar2Height;

          return (
            <G key={`bar-group-${index}`}>
              {/* Sales Bar */}
              <Rect
                x={x}
                y={y1}
                width={barWidth}
                height={Math.max(bar1Height, 0)}
                fill="url(#gradSales)"
                rx={4}
                ry={4}
              />
              
              {/* Purchases Bar */}
              {item.value2 !== undefined && (
                <Rect
                  x={x + barWidth + 4}
                  y={y2}
                  width={barWidth}
                  height={Math.max(bar2Height, 0)}
                  fill="url(#gradPurchases)"
                  rx={4}
                  ry={4}
                />
              )}

              {/* X-Axis Label */}
              <SvgText
                x={x + groupWidth / 2}
                y={paddingTop + chartHeight + 20}
                fontSize="12"
                fill="#64748b"
                textAnchor="middle"
              >
                {item.label}
              </SvgText>
            </G>
          );
        })}
      </Svg>
    </View>
  );
}
