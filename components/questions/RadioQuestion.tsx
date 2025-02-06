import React, { useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import { Question } from "@/types/Question";
import colors from "@/constants/Color"
import gStyles from "@/constants/GlobalStyle"

interface RadioEntryProps {
  title: string;
  valid: boolean;
  verify: boolean;
}

const RadioEntry: React.FC<RadioEntryProps> = ({ title, valid, verify }) => {
  const [checked, setChecked] = useState<boolean>(false);

  // !checked: gray
  // checked: blue
  // verify && checked && valid: green (circle fill)
  // verify && checked && !valid: red (circle fill)
  // verify && !checked && valid: red
  var state = checked ? 1 : 0;
  if (verify) {
    if (checked)
      state = valid ? 2 : 3;
    else if (valid)
      state = 4;
  }

  const borderColors = [colors.stroke, colors.accentuation, colors.green, colors.red, colors.red];
  const bgColors = [colors.card, colors.accentuation_a, colors.green_a, colors.red_a, colors.red_a];

  const borderColor = borderColors[state];
  const bgColor = bgColors[state];

  const icons = ["", "", "check", "minus", "xmark"];

  return (
    <TouchableOpacity
      onPress={() => {
        setChecked(!checked);
      }}
      style={[gStyles.card, styles.card, {
        borderColor: borderColor,
        backgroundColor: bgColor,
      }]}>

      <View style={[styles.circle, {
        borderColor: borderColor,
        backgroundColor: state == 0 ? colors.card : borderColor,
      }]}>
          <FontAwesome6 style={styles.icon} name={icons[state]} size={25}/>
      </View>
      <Text style={gStyles.text}>{title}</Text>
    </TouchableOpacity>
  )
};

interface RadioQuestionProps {
  question: Question;
  verify: boolean;
}

const RadioQuestion: React.FC<RadioQuestionProps> = ({ question, verify }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={{paddingBottom: 15}}>
      {question?.choices?.map((title, index) => (
        <RadioEntry
          key={index}
          title={title}
          valid={question?.answers?.some(a => a == title)}
          verify={verify}/>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container : {
    flex: 1,
  },
  icon: {
    color: "white",
  },
  card: {
    height: 70,
    flexDirection: "row",
    justifyContent: "start",
    alignItems: "center",
    alignContent: "center",
    columnGap: 20,
    borderRadius: 25,
    margin: 13,
    paddingHorizontal: 25,
  },
  circle: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "50%",
    borderColor: colors.stroke,
    borderWidth: 2,
  }
});

export default RadioQuestion;