import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'
import { AntDesign, Feather } from '@expo/vector-icons';
import TabBarButton from './TabBarButton';

import colors from "@/constants/Color"

const TabBar = ({ state, descriptors, navigation }) => {
  const primaryColor = colors.text;
  const greyColor = colors.title;

  const getActiveRouteName = (state) => {
    if (!state) return null;
    let route = state.routes[state.index];
    while (route.state?.index !== undefined) {
      route = route.state.routes[route.state.index];
    }
    return route.name;
  };

  const activeRouteName = getActiveRouteName(navigation.getState());

  if (activeRouteName == "[question_slug]/index")
    return null;

  return (
    <View style={styles.tabbar}>
    {state.routes.map((route, index) => {
      const { options } = descriptors[route.key];
      const label =
      options.tabBarLabel !== undefined
      ? options.tabBarLabel
      : options.title !== undefined
      ? options.title
      : route.name;

      if(['_sitemap', '+not-found'].includes(route.name)) return null;

      if (route.name != "stats" && route.name != "index") return null;

      const isFocused = state.index === index;

      const onPress = () => {
        const event = navigation.emit({
          type: 'tabPress',
          target: route.key,
          canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented) {
          navigation.navigate(route.name, route.params);
        }
      };

      const onLongPress = () => {
        navigation.emit({
          type: 'tabLongPress',
          target: route.key,
        });
      };

      return (
        <TabBarButton 
        key={route.name}
        style={styles.tabbarItem}
        onPress={onPress}
        onLongPress={onLongPress}
        isFocused={isFocused}
        routeName={route.name}
        color={isFocused? primaryColor: greyColor}
        label={label}
        />
        )
    })}
    </View>
    )
}

const styles = StyleSheet.create({
  tabbar: {
    position: 'absolute', 
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.accentuation,
    padding: 10,
    width: "50%",
    marginHorizontal: "25%",
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    boxShadow: "-5px -5px 10px #000",
  }
})

export default TabBar;