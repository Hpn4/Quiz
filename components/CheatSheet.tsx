import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import type { ThemeColors } from '@/constants/Color';
import TitleCard from '@/components/TitleCard';
import GlossaryBox from '@/components/GlossaryBox';
import { useThemeColors, useThemedStyles } from '@/types/ThemeContext';

interface Props {
  quiz?: any;
}

const CheatSheet: React.FC<Props> = ({ quiz }) => {
  const [visible, setVisible] = useState(false);
  const colors = useThemeColors();
  const styles = useThemedStyles(createStyles);

  return (
    <>
      <Pressable style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>?</Text>
      </Pressable>

      <Modal visible={visible} transparent animationType="fade" onRequestClose={() => setVisible(false)}>
        <Pressable style={styles.overlay} onPress={() => setVisible(false)}>
          <Pressable onPress={() => {}} style={styles.cardWrap}>
            <ScrollView>
              <TitleCard title={quiz?.name ?? 'Aide'} infoTable={quiz?.infoTable} />
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const createStyles = (colors: ThemeColors) =>
  StyleSheet.create({
    button: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderColor: colors.stroke,
      borderWidth: 1,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
    },
    buttonText: {
      color: colors.text,
      fontWeight: '700',
      fontSize: 20,
    },
    overlay: {
      flex: 1,
      backgroundColor: `${colors.shadow}BB`,
      justifyContent: 'center',
      alignItems: 'center',
    },
    cardWrap: {
      width: '100%',
      borderRadius: 10,
      overflow: 'hidden',
    }
  });

export default CheatSheet;
