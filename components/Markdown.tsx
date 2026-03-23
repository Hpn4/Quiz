import React, { useMemo, useState } from "react";
import { ScrollView, StyleSheet, Modal, Text, Pressable } from "react-native";

import Markdown from 'react-native-markdown-display';

import type { ThemeColors } from "@/constants/Color";
import { useThemedStyles } from "@/types/ThemeContext";
import { getGlossary } from "@/types/Data";

interface MdTextProps {
  content: string;
}

const MdText: React.FC<MdTextProps> = ({ content }) => {
  const styles = useThemedStyles(createStyles);
  const markdownStyle = useThemedStyles(createMarkdownStyles);
  const glossary = useMemo(() => getGlossary(), []);
  const [visible, setVisible] = useState(false);
  const [term, setTerm] = useState<string | null>(null);
  const [definition, setDefinition] = useState<string | null>(null);

  // Preprocess content: replace glossary terms with markdown links
  const processed = useMemo(() => {
    if (!content) return "";
    const terms = Object.keys(glossary).sort((a, b) => b.length - a.length);
    let out = content;
    const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\\]\\]/g, "\\$&");

    // word character range covering common Latin letters (incl. accents)
    const wordChar = "A-Za-zÀ-ÖØ-öø-ÿ";

    terms.forEach(t => {
      try {
        const esc = escapeRegex(t);
        // do not put the definition in the markdown title — some parsers choke on quotes/accents
        const encoded = encodeURIComponent(t);
        // capture optional plural 's' to preserve display
        const re = new RegExp(`(^|[^${wordChar}])(${esc})(s?)(?=[^${wordChar}]|$)`, 'gi');
        out = out.replace(re, (_match, p1, p2, p3) => {
          const display = p2 + (p3 || '');
          return `${p1}[${display}](glossary://${encoded})`;
        });
      } catch (e) {
        // ignore invalid regex for weird terms
      }
    });
    return out;
  }, [content, glossary]);

  const handleLinkPress = (url: string) => {
    if (!url) return false;
    if (url.startsWith('glossary://')) {
      const t = decodeURIComponent(url.replace('glossary://', ''));
      const def = glossary[t];
      setTerm(t);
      setDefinition(def);
      setVisible(true);
      return false;
    }
    return true;
  };

  return (
    <>
      <ScrollView style={styles.content}>
        <Markdown style={markdownStyle} onLinkPress={(url) => handleLinkPress(url as string)}>{processed || ""}</Markdown>
      </ScrollView>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setVisible(false)}>
          <Pressable onPress={() => {}} style={styles.modalCard}>
            <Text style={styles.modalTitle}>{term}</Text>
            <Text style={styles.modalBody}>{definition}</Text>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
};

const createStyles = (colors: ThemeColors) => StyleSheet.create({
  content: {
    paddingHorizontal: 10,
    marginBottom: 10,
    width: "100%",
  }
  ,
  modalOverlay: {
    flex: 1,
    backgroundColor: `${colors.shadow}BB`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
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
    color: colors.text,
    marginBottom: 20,
  },
  modalBody: {
    fontSize: 20,
    color: colors.text,
  },
  modalButton: {
    alignSelf: 'flex-end',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.title,
    borderRadius: 6,
  },
  modalButtonText: {
    color: colors.text,
    fontWeight: '600'
  }
});

const createMarkdownStyles = (colors: ThemeColors) => StyleSheet.create({
  body: {
    color: colors.text,
    fontSize: 20,
    width: "100%",
  },
  heading1: {
    fontSize: 40,
    fontWeight: "bold",
  },
  heading2: {
    fontSize: 37,
    fontWeight: "bold",
  },
  heading3: {
    fontSize: 34,
    fontWeight: "bold",
  },
  heading4: {
    fontSize: 31,
    fontWeight: "bold",
  },
  heading5: {
    fontSize: 28,
    fontWeight: "bold",
  },
  heading6: {
    fontSize: 25,
    fontWeight: "bold",
  },
  table: {
    borderColor: colors.stroke,
  },
  tr: {
    borderColor: colors.stroke,
  },
  td: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  th: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderTopWidth: 1,
    borderColor: colors.stroke,
  },
  thead: {
    fontWeight: "bold",
    textAlign: 'center',
  },
  blockquote: {
    backgroundColor: colors.title,
    borderColor: colors.stroke,
    borderLeftWidth: 4,
  },
  code_inline: {
    backgroundColor: colors.background,
  },
  code_block: {
    backgroundColor: colors.background,
    borderColor: colors.stroke,
  },
  fence: {
    backgroundColor: colors.background,
    borderColor: colors.stroke,
  }
  ,
  link: {
    color: colors.accentuation,
    fontWeight: '700',
    textDecorationLine: 'none',
  },
  link_text: {
    color: colors.accentuation,
    fontWeight: '700',
    textDecorationLine: 'none',
  }
});

export default MdText;