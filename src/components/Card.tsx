import React from 'react';
import { Pressable, PressableProps } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import "../../global.css";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface CardProps extends PressableProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'flat' | 'outline';
  className?: string;
  isPressable?: boolean;
}

export default function Card({ children, variant = 'elevated', className = '', isPressable = false, onPressIn, onPressOut, ...props }: CardProps) {
  const scale = useSharedValue(1);

  const handlePressIn = (e: any) => {
    if (isPressable) scale.value = withTiming(0.98, { duration: 100, easing: Easing.out(Easing.ease) });
    if (onPressIn) onPressIn(e);
  };

  const handlePressOut = (e: any) => {
    if (isPressable) scale.value = withTiming(1, { duration: 150, easing: Easing.out(Easing.ease) });
    if (onPressOut) onPressOut(e);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  let baseClass = "p-4 rounded-xl mb-3 bg-white ";

  switch (variant) {
    case 'elevated':
      baseClass += "shadow-sm border border-white/50 ";
      break;
    case 'outline':
      baseClass += "border border-border ";
      break;
    case 'flat':
      baseClass += "bg-white ";
      break;
  }

  return (
    <AnimatedPressable
      className={`${baseClass} ${className}`}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      disabled={!isPressable && !props.onPress}
      {...props}
    >
      {children}
    </AnimatedPressable>
  );
}
