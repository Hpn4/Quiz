import { View, Text, Pressable, StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import Animated, { interpolate, useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

const icons = {
    index: (props)=> <FontAwesome6 name="house" size={20} {...props} />,
    stats: (props)=> <FontAwesome6 name="chart-line" size={20} {...props} />,
};

const TabBarButton = (props) => {
    const {isFocused, label, routeName, color} = props;
    const scale = useSharedValue(0);

    useEffect(()=>{
        scale.value = withSpring(
            typeof isFocused === 'boolean'? (isFocused? 1: 0): isFocused,
            {duration: 350}
            );
    },[scale, isFocused]);

    const animatedIconStyle = useAnimatedStyle(()=>{
        const scaleValue = interpolate(
            scale.value,
            [0, 1],
            [1, 1.4]
            );

        const top = interpolate(
            scale.value,
            [0, 1],
            [0, 8]
            );

        return {
            transform: [{scale: scaleValue}],
            top
        }
    })

    const animatedTextStyle = useAnimatedStyle(()=>{
        const opacity = interpolate(
            scale.value,
            [0, 1],
            [1, 0]
            );

        return { opacity }
    })

    var route = routeName != "stats" ? "index" : routeName;

    return (
        <Pressable {...props} style={styles.container}>
            <Animated.View style={[animatedIconStyle]}>
            {
                icons[routeName]({
                    color
                })
            }
            </Animated.View>
            
            <Animated.Text style={[{ 
                color,
                fontSize: 11
            }, animatedTextStyle]}>
            {label}
            </Animated.Text>
        </Pressable>
        )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 4
    }
});

export default TabBarButton;