import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

export type EditorialIconName = 'home' | 'vault' | 'build' | 'workouts' | 'progress' | 'back' | 'refresh' | 'delete' | 'arrow' | 'finish' | 'plus' | 'minus' | 'check';

type Props = {
  name: EditorialIconName;
  size?: number;
  color?: string;
  accent?: string;
};

export function EditorialIcon({ name, size = 24, color = colors.text, accent = colors.primary }: Props) {
  const scale = size / 24;
  return (
    <View style={{ height: size, width: size }}>
      <View style={[styles.canvas, { transform: [{ scale }] }]}>
        <IconShape name={name} color={color} accent={accent} />
      </View>
    </View>
  );
}

function IconShape({ name, color, accent }: { name: EditorialIconName; color: string; accent: string }) {
  if (name === 'home') return <><View style={[styles.homeRoof, { borderColor: color }]} /><View style={[styles.homeBody, { borderColor: color }]}><View style={[styles.homeDoor, { backgroundColor: accent }]} /></View></>;
  if (name === 'vault') return <><View style={[styles.vault, { backgroundColor: '#FFE7A3', borderColor: color }]}><View style={[styles.vaultCore, { backgroundColor: accent, borderColor: color }]} /></View><View style={[styles.spark, { backgroundColor: color }]} /></>;
  if (name === 'build') return <><View style={[styles.dumbbellBar, { backgroundColor: color }]} /><View style={[styles.dumbbellLeft, { backgroundColor: accent, borderColor: color }]} /><View style={[styles.dumbbellRight, { backgroundColor: accent, borderColor: color }]} /></>;
  if (name === 'workouts') return <><View style={[styles.cardBack, { borderColor: color }]} /><View style={[styles.cardFront, { backgroundColor: '#FFFFFF', borderColor: color }]}><Text style={[styles.cardHeart, { color: accent }]}>♥</Text></View></>;
  if (name === 'progress') return <><View style={[styles.barOne, { backgroundColor: color }]} /><View style={[styles.barTwo, { backgroundColor: color }]} /><View style={[styles.barThree, { backgroundColor: accent }]} /><View style={[styles.progressLine, { backgroundColor: accent }]} /><View style={[styles.progressTip, { borderBottomColor: accent }]} /></>;
  if (name === 'back') return <View style={[styles.chevronBack, { borderColor: color }]} />;
  if (name === 'arrow') return <View style={[styles.chevronForward, { borderColor: color }]} />;
  if (name === 'refresh') return <><View style={[styles.refreshRing, { borderColor: color, borderRightColor: 'transparent' }]} /><View style={[styles.refreshTip, { borderBottomColor: accent }]} /></>;
  if (name === 'delete') return <><View style={[styles.binLid, { backgroundColor: color }]} /><View style={[styles.bin, { borderColor: color }]}><View style={[styles.binLine, { backgroundColor: color }]} /></View></>;
  if (name === 'plus') return <><View style={[styles.controlDisc, { backgroundColor: accent, borderColor: color }]} /><View style={[styles.controlHorizontal, { backgroundColor: color }]} /><View style={[styles.controlVertical, { backgroundColor: color }]} /></>;
  if (name === 'minus') return <><View style={[styles.controlDisc, { backgroundColor: '#FFE7A3', borderColor: color }]} /><View style={[styles.controlHorizontal, { backgroundColor: color }]} /></>;
  if (name === 'check') return <><View style={[styles.checkShadow, { borderColor: accent }]} /><View style={[styles.check, { borderColor: color }]} /></>;
  return <><View style={[styles.finishDiamond, { backgroundColor: '#FFE7A3', borderColor: color }]} /><View style={[styles.finishCore, { backgroundColor: accent }]} /></>;
}

const styles = StyleSheet.create({
  canvas: { height: 24, left: 0, position: 'absolute', top: 0, width: 24 },
  homeRoof: { borderLeftWidth: 2.5, borderTopWidth: 2.5, height: 14, left: 5, position: 'absolute', top: 1, transform: [{ rotate: '45deg' }], width: 14 },
  homeBody: { borderBottomLeftRadius: 3, borderBottomRightRadius: 3, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderRightWidth: 2.5, bottom: 1, height: 12, left: 4, position: 'absolute', width: 16 },
  homeDoor: { borderTopLeftRadius: 2, borderTopRightRadius: 2, bottom: 0, height: 7, left: 5, position: 'absolute', width: 4 },
  vault: { alignItems: 'center', borderRadius: 4, borderWidth: 2.5, height: 16, justifyContent: 'center', left: 4, position: 'absolute', top: 4, transform: [{ rotate: '45deg' }], width: 16 },
  vaultCore: { borderRadius: 3, borderWidth: 1.5, height: 6, width: 6 },
  spark: { borderRadius: 2, height: 4, position: 'absolute', right: 0, top: 1, width: 4 },
  dumbbellBar: { borderRadius: 2, height: 4, left: 3, position: 'absolute', top: 10, width: 18 },
  dumbbellLeft: { borderRadius: 3, borderWidth: 2, height: 12, left: 1, position: 'absolute', top: 6, width: 6 },
  dumbbellRight: { borderRadius: 3, borderWidth: 2, height: 12, position: 'absolute', right: 1, top: 6, width: 6 },
  cardBack: { borderRadius: 4, borderWidth: 2, height: 16, left: 2, position: 'absolute', top: 2, transform: [{ rotate: '-7deg' }], width: 17 },
  cardFront: { alignItems: 'center', borderRadius: 4, borderWidth: 2, height: 17, justifyContent: 'center', left: 5, position: 'absolute', top: 5, width: 17 },
  cardHeart: { fontSize: 11, fontWeight: '900', lineHeight: 12 },
  barOne: { borderRadius: 2, bottom: 3, height: 7, left: 2, position: 'absolute', width: 5 },
  barTwo: { borderRadius: 2, bottom: 3, height: 12, left: 9, position: 'absolute', width: 5 },
  barThree: { borderRadius: 2, bottom: 3, height: 18, left: 16, position: 'absolute', width: 5 },
  progressLine: { height: 2, left: 3, position: 'absolute', top: 7, transform: [{ rotate: '-24deg' }], width: 17 },
  progressTip: { borderBottomWidth: 6, borderLeftColor: 'transparent', borderLeftWidth: 3, borderRightColor: 'transparent', borderRightWidth: 3, height: 0, position: 'absolute', right: 0, top: 1, transform: [{ rotate: '35deg' }], width: 0 },
  chevronBack: { borderBottomWidth: 3, borderLeftWidth: 3, height: 11, left: 8, position: 'absolute', top: 6, transform: [{ rotate: '45deg' }], width: 11 },
  chevronForward: { borderRightWidth: 3, borderTopWidth: 3, height: 10, left: 5, position: 'absolute', top: 7, transform: [{ rotate: '45deg' }], width: 10 },
  refreshRing: { borderRadius: 9, borderWidth: 2.5, height: 18, left: 3, position: 'absolute', top: 3, width: 18 },
  refreshTip: { borderBottomWidth: 7, borderLeftColor: 'transparent', borderLeftWidth: 4, borderRightColor: 'transparent', borderRightWidth: 4, height: 0, left: 1, position: 'absolute', top: 1, transform: [{ rotate: '-28deg' }], width: 0 },
  binLid: { borderRadius: 1, height: 2.5, left: 4, position: 'absolute', top: 5, width: 16 },
  bin: { borderBottomLeftRadius: 4, borderBottomRightRadius: 4, borderLeftWidth: 2.5, borderRightWidth: 2.5, borderTopWidth: 2.5, height: 14, left: 6, position: 'absolute', top: 8, width: 12 },
  binLine: { borderRadius: 1, height: 8, left: 3.5, position: 'absolute', top: 2, width: 2 },
  controlDisc: { borderRadius: 10, borderWidth: 2, height: 20, left: 2, position: 'absolute', top: 2, width: 20 },
  controlHorizontal: { borderRadius: 2, height: 3, left: 7, position: 'absolute', top: 10.5, width: 10 },
  controlVertical: { borderRadius: 2, height: 10, left: 10.5, position: 'absolute', top: 7, width: 3 },
  checkShadow: { borderBottomWidth: 3, borderRightWidth: 3, height: 14, left: 6, position: 'absolute', top: 3, transform: [{ rotate: '45deg' }], width: 8 },
  check: { borderBottomWidth: 3, borderRightWidth: 3, height: 14, left: 8, position: 'absolute', top: 5, transform: [{ rotate: '45deg' }], width: 8 },
  finishDiamond: { borderRadius: 4, borderWidth: 2, height: 15, left: 4.5, position: 'absolute', top: 4.5, transform: [{ rotate: '45deg' }], width: 15 },
  finishCore: { borderRadius: 3, height: 6, left: 9, position: 'absolute', top: 9, width: 6 }
});
