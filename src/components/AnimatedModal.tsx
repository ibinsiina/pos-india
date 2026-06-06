import { BlurView } from "expo-blur";
import { useState, useRef, useEffect } from "react";
import { Pressable, View, Modal, Animated, Dimensions, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import "../../global.css";

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

interface AnimatedModalProps {
    visible: boolean;
    onClose: () => void;
    children: React.ReactNode;
    avoidKeyboard?: boolean;
}

export default function AnimatedModal({ visible, onClose, children, avoidKeyboard }: AnimatedModalProps) {
    const [show, setShow] = useState(visible);
    const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            setShow(true);
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.spring(slideAnim, {
                    toValue: 0,
                    useNativeDriver: true,
                    damping: 20,
                    stiffness: 90
                })
            ]).start();
        } else {
            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 250,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: SCREEN_HEIGHT,
                    duration: 250,
                    useNativeDriver: true,
                })
            ]).start(() => setShow(false));
        }
    }, [visible]);

    if (!show) return null;

    const content = (
        <View className="flex-1 justify-end">
            <Pressable className="absolute inset-0" onPress={onClose}>
                <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeAnim }]}>
                    <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.4)' }]} />
                </Animated.View>
            </Pressable>
            <Animated.View style={{ transform: [{ translateY: slideAnim }] }}>
                {children}
            </Animated.View>
        </View>
    );

    return (
        <Modal visible={show} transparent={true} animationType="none" onRequestClose={onClose} statusBarTranslucent>
            {avoidKeyboard && Platform.OS === 'ios' ? (
                <KeyboardAvoidingView behavior="padding" className="flex-1 m-0 p-0">
                    {content}
                </KeyboardAvoidingView>
            ) : (
                <View className="flex-1 m-0 p-0">
                    {content}
                </View>
            )}
        </Modal>
    );
}
