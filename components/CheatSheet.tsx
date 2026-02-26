import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, ScrollView } from 'react-native';
import colors from '@/constants/Color';
import TitleCard from '@/components/TitleCard';
import GlossaryBox from '@/components/GlossaryBox';

interface Props {
  quiz?: any;
}

const CheatSheet: React.FC<Props> = ({ quiz }) => {
  const [visible, setVisible] = useState(false);

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

const styles = StyleSheet.create({
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
    color: 'white',
    fontWeight: '700',
    fontSize: 20,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
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
