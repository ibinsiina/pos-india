import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, Text, TextInput, TextInputProps, View } from 'react-native';
import "../../global.css";

interface AuthInputProps extends TextInputProps {
  label: string;
  required?: boolean;
  isPassword?: boolean;
}

export default function AuthInput({ label, required, isPassword, ...props }: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-base font-sans-medium text-primary mb-2">
        {label}
        {required && <Text className="text-red-500">*</Text>}
      </Text>

      <View className="flex-row items-center rounded-xl border border-border bg-white px-4 h-[52px]">
        <TextInput
          className="flex-1 h-full text-base font-sans-regular text-primary"
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          {...props}
        />

        {isPassword && (
          <Pressable
            onPress={() => setShowPassword(!showPassword)}
            className="p-2"
          >
            {showPassword ? (
              <EyeOff size={20} color="#9ca3af" />
            ) : (
              <Eye size={20} color="#9ca3af" />
            )}
          </Pressable>
        )}
      </View>
    </View>
  );
}
