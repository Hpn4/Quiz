import React, { useEffect, useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

import colors from "@/constants/Color";
import gStyles from "@/constants/GlobalStyle";
import { playSelect } from "@/utils/sounds";
import GlossaryInlineText from "@/components/GlossaryInlineText";

interface ChoiceEntryProps {
  index: number;
  title: string;
  valid: boolean;
  verify: boolean;
  checked?: boolean;
  onToggle?: (index: number, checked: boolean, isValid: boolean) => void;
}

const ChoiceEntry: React.FC<ChoiceEntryProps> = ({ index, title, valid, verify, checked = false, onToggle }) => {
  const [isChecked, setChecked] = useState<boolean>(checked);

  var state = isChecked ? 1 : 0;
  if (verify) {
    if (isChecked)
      state = valid ? 2 : 3;
    else if (valid)
      state = 4;
  }

  const borderColors = [colors.stroke, colors.accentuation, colors.green, colors.red, colors.red];
  const bgColors = [colors.card, colors.accentuation_a, colors.green_a, colors.red_a, colors.red_a];

  const borderColor = borderColors[state];
  const bgColor = bgColors[state];

  useEffect(() => {
    setChecked(checked);
  }, [checked]);

  const icons = ["", "", "check", "minus", "xmark"];

  return (
    <TouchableOpacity
      onPress={() => {
        const next = !isChecked;
        setChecked(next);
        playSelect();
        if (onToggle) onToggle(index, next, next === valid);
      }}
      style={[gStyles.card, styles.card, {
        borderColor: borderColor,
        backgroundColor: bgColor,
      }]}
    >
      <View style={[styles.circle, {
        borderColor: borderColor,
        backgroundColor: state == 0 ? colors.card : borderColor,
      }]}>
        <FontAwesome6 style={styles.icon} name={icons[state]} size={25}/>
      </View>
      <GlossaryInlineText text={title} style={gStyles.text} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  icon: {
    color: "white",
  },
  card: {
    height: 70,
    flexDirection: "row",
    justifyContent: "flex-start",
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

export default ChoiceEntry;
