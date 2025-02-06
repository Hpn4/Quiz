import { Link } from 'expo-router';
import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

import colors from "@/constants/Color"

interface CardProps {
  href: any;
  image: string;
  title: string;
}

const Card: React.FC<CardProps> = ({ href, image, title }) => {
  return (
    <Link href={href} asChild>
      <TouchableOpacity style={styles.card}>
        <Image source={{ uri: image }} style={styles.image} />

        <View style={styles.titleView}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </TouchableOpacity>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    width: "45%",
    height: 140,
    backgroundColor: colors.card,
    borderColor: colors.stroke,
    borderWidth: 1,
    borderRadius: 10,
    paddingTop: 10,
    margin: 5,
    marginBottom: 15,
    alignItems: "center",
    boxShadow: "5px 5px 10px #000",
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 30,
    marginBottom: 8,
  },
  titleView: {
    justifyContent: 'center',
    flex:1,
    marginTop: 5,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderColor: colors.stroke,
    flex: 1,
    width: "100%",
    backgroundColor: colors.title,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  title: {
    fontSize: 16,
    textAlign: 'center',
    color: "white",
    fontWeight: "bold",
  },
});

export default Card;