import React, { useState, useEffect, useRef } from 'react';
import { Text, Animated, StyleSheet } from 'react-native';
import { useAppSelector } from "@/store/hooks";
import { selectColors } from '@/store/selectors';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const NetworkStatusBar = () => {
    const isConnected = useAppSelector((state) => state?.network?.isConnected);
    const colors = useAppSelector(selectColors);
    const insets = useSafeAreaInsets();

    const bottomPosition = 50 + insets.bottom;

    const [visible, setVisible] = useState(false);

    const anim = useRef(new Animated.Value(0)).current;
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            if (isConnected) return;
        }

        setVisible(true);
        Animated.spring(anim, {
            toValue: 1,
            useNativeDriver: true,
            tension: 40,
            friction: 7
        }).start();

        const timer = setTimeout(() => {
            Animated.timing(anim, {
                toValue: 0,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                setVisible(false);
            });
        }, 3000);

        return () => clearTimeout(timer);
    }, [isConnected]);

    if (!visible) return null;

    return (
        <Animated.View
            style={[
                styles.container,
                {
                    bottom: bottomPosition,
                    backgroundColor: isConnected ? colors.success : colors.error,
                    opacity: anim,
                    transform: [
                        { scale: anim },
                        {
                            translateY: anim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [15, 0]
                            })
                        }
                    ],
                }
            ]}
        >
            <Text style={styles.text}>
                {isConnected ? "Back Online" : "No Internet Connection"}
            </Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    text: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold'
    }
});