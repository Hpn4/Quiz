import React, { useMemo, useState } from 'react';
import { Text, TextStyle, Modal, View, Pressable, StyleSheet } from 'react-native';

import { getGlossary } from '@/types/Data';
import colors from '@/constants/Color';

interface Props {
  text: string;
  style?: TextStyle | TextStyle[];
}

type Segment = { text: string; isGlossary: boolean; term?: string };

/**
 * Split `text` into plain and glossary segments using a simple split-and-replace
 * approach. Each glossary term found in the text becomes a tappable span that
 * shows the definition in a modal.
 */
function parseSegments(text: string, glossary: Record<string, string>): Segment[] {
  if (!text) return [];

  // Sort longest terms first to avoid shorter terms shadowing longer ones.
  const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);

  let result: Segment[] = [{ text, isGlossary: false }];

  for (const term of terms) {
    const newResult: Segment[] = [];
    const esc = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Capturing group so split gives us the matched term at odd indices.
    const re = new RegExp(`(${esc})`, 'gi');

    for (const seg of result) {
      if (seg.isGlossary) {
        newResult.push(seg);
        continue;
      }
      const parts = seg.text.split(re);
      for (let i = 0; i < parts.length; i++) {
        if (!parts[i]) continue;
        if (i % 2 === 0) {
          newResult.push({ text: parts[i], isGlossary: false });
        } else {
          newResult.push({ text: parts[i], isGlossary: true, term });
        }
      }
    }
    result = newResult;
  }

  return result;
}

const GlossaryInlineText: React.FC<Props> = ({ text, style }) => {
  const glossary = useMemo(() => getGlossary(), []);
  const segments = useMemo(() => parseSegments(text, glossary), [text, glossary]);
  const [visible, setVisible] = useState(false);
  const [modalTerm, setModalTerm] = useState<string | null>(null);
  const [modalDef, setModalDef] = useState<string | null>(null);

  const handleTermPress = (term: string) => {
    // Lookup is case-insensitive: find the canonical key.
    const key =
      Object.keys(glossary).find((k) => k.toLowerCase() === term.toLowerCase()) ?? term;
    setModalTerm(key);
    setModalDef(glossary[key] ?? '');
    setVisible(true);
  };

  return (
    <>
      <Text style={style}>
        {segments.map((seg, i) =>
          seg.isGlossary ? (
            <Text
              key={i}
              style={[style, s.glossaryTerm]}
              onPress={() => handleTermPress(seg.term ?? seg.text)}
            >
              {seg.text}
            </Text>
          ) : (
            <Text key={i} style={style}>
              {seg.text}
            </Text>
          )
        )}
      </Text>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={s.overlay} onPress={() => setVisible(false)}>
          <Pressable style={s.card} onPress={() => {}}>
            <Text style={s.modalTitle}>{modalTerm}</Text>
            <Text style={s.modalBody}>{modalDef}</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const s = StyleSheet.create({
  glossaryTerm: {
    color: colors.accentuation,
    fontWeight: '700',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 10,
    width: '90%',
    maxWidth: 600,
    borderColor: colors.stroke,
    borderWidth: 1,
  },
  modalTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  modalBody: {
    fontSize: 20,
    color: 'white',
  },
});

export default GlossaryInlineText;
