import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

type DonutChartProps = {
  size?: number;
};

export default function DonutChart({ size = 200 }: DonutChartProps) {
  const center = size / 2;
  
  // Outer Ring (Sales)
  const outerStrokeWidth = 35;
  const outerRadius = (size - outerStrokeWidth) / 2;
  const outerCircumference = 2 * Math.PI * outerRadius;
  
  // Inner Ring (Purchases)
  const innerStrokeWidth = 25;
  const innerRadius = outerRadius - outerStrokeWidth / 2 - innerStrokeWidth / 2 - 2; // small gap
  const innerCircumference = 2 * Math.PI * innerRadius;

  return (
    <View className="items-center justify-center my-6">
      <Svg width={size} height={size}>
        <G rotation="-90" origin={`${center}, ${center}`}>
          {/* Outer Ring - Main Green */}
          <Circle
            cx={center}
            cy={center}
            r={outerRadius}
            stroke="#98e29a" // Light Green
            strokeWidth={outerStrokeWidth}
            fill="transparent"
          />
          {/* Outer Ring - Red Segment (approx 15%) */}
          <Circle
            cx={center}
            cy={center}
            r={outerRadius}
            stroke="#f09a9a" // Salmon Red
            strokeWidth={outerStrokeWidth}
            fill="transparent"
            strokeDasharray={`${outerCircumference * 0.15} ${outerCircumference}`}
            strokeDashoffset="0"
          />

          {/* Inner Ring - Main Dark */}
          <Circle
            cx={center}
            cy={center}
            r={innerRadius}
            stroke="#122a2f" // Dark Green/Black
            strokeWidth={innerStrokeWidth}
            fill="transparent"
          />
          {/* Inner Ring - Red Segment (approx 15%) */}
          <Circle
            cx={center}
            cy={center}
            r={innerRadius}
            stroke="#e48888" // Slightly darker red
            strokeWidth={innerStrokeWidth}
            fill="transparent"
            strokeDasharray={`${innerCircumference * 0.15} ${innerCircumference}`}
            strokeDashoffset="0"
          />
        </G>
      </Svg>
    </View>
  );
}
