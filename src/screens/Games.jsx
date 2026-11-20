import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, StyleSheet, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Btn, Congrats, Icon, Img, Press, Screen, Scroll, Txt, WhiteHeader } from '../ui';
import { useNav, useStore } from '../nav';

// Trò chơi (205:21311).
export function Games() {
  const nav = useNav();
  const open = () => nav.go('gameLoading');
  const soon = name => Alert.alert(name, 'Trò chơi đang được phát triển, quay lại sau nhé!');
  return (
    <Screen nav={false}>
      <WhiteHeader title="Trò chơi" size={30} />
      <Scroll pad={40}>
        <View style={{ flexDirection: 'row', gap: z(16), paddingLeft: z(18), marginTop: z(10) }}>
          <Press label="Tạo phòng" onPress={() => soon('Tạo phòng')} style={[st.tile, { alignItems: 'center', justifyContent: 'center' }]}>
            <Icon name="add-circle-outline" size={44} /><Txt s={14} style={{ marginTop: z(24) }}>Tạo phòng</Txt>
          </Press>
          <GameTile img="gm_beach" title="Sứ mệnh xanh" onPress={open} />
          <GameTile img="gm_xo" title="XO" onPress={() => soon('XO')} cut />
        </View>
        <Txt s={13} w="700" style={{ marginLeft: z(20), marginTop: z(30) }}>Danh hiệu</Txt>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginTop: z(10), paddingHorizontal: z(10) }}>
          {[['av_boy1', 'Cao nhân giải\nđố'], ['av_nonla_big', 'Chiến thành\ntốc độ'], ['av_girl_flag', 'Bậc thầy phân\nloại rác']].map(([av, t], i) => (
            <View key={t} style={{ alignItems: 'center' }}>
              <Txt s={22} style={{ opacity: i === 1 ? 1 : 0 }}>👑</Txt>
              <Img name={av} style={{ width: z(90), height: z(90), borderRadius: z(45), borderWidth: 1, borderColor: C.green }} />
              <Txt s={14} center style={{ marginTop: z(10) }}>{t}</Txt>
            </View>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(26), marginTop: z(14), paddingHorizontal: z(20) }}>
          <Btn title="Tìm kiếm" onPress={() => soon('Tìm kiếm')} radius={10} h={34} s={13} bg={C.green} icon={<Icon name="search-outline" size={20} />} style={{ width: z(146) }} />
          <Btn title="Tạo lịch chơi" onPress={() => soon('Tạo lịch chơi')} radius={10} h={34} s={13} bg={C.green} icon={<Icon name="add" size={22} />} style={{ width: z(124) }} />
          <View style={st.filter}><Icon name="options-outline" size={18} /></View>
        </View>
        <Txt s={13} w="700" style={{ marginLeft: z(20), marginTop: z(26) }}>Chơi gần đây</Txt>
        <View style={{ flexDirection: 'row', gap: z(30), paddingHorizontal: z(24), marginTop: z(12) }}>
          <GameTile img="gm_beach2" title="Sứ mệnh xanh" onPress={open} wide />
          <GameTile img="gm_duck" title="Đua vịt" onPress={() => soon('Đua vịt')} wide />
        </View>
      </Scroll>
    </Screen>
  );
}

function GameTile({ img, title, onPress, wide, cut }) {
  return (
    <Press label={title} onPress={onPress} style={[st.tile, wide && { width: z(171) }, cut && { width: z(98) }]}>
      <Img name={img} style={{ width: '100%', height: z(130), borderTopLeftRadius: z(10), borderTopRightRadius: z(10) }} />
      <Txt s={13} center style={{ marginTop: z(4) }}>{title}</Txt>
      <Txt s={8} c="#888" center>5 người tham gia</Txt>
    </Press>
  );
}

// Đang tải 64% (205:21543).
export function GameLoading() {
  const nav = useNav();
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setPct(p => {
      if (p >= 100) { clearInterval(t); setTimeout(() => nav.replace('gameLobby'), 200); return 100; }
      return p + 4;
    }), 50);
    return () => clearInterval(t);
  }, []);
  return (
    <Screen bg="#e8f5e9" nav={false}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <View style={st.loadTrack}><View style={[st.loadFill, { width: `${pct}%` }]} /></View>
        <Txt s={30} w="700" c="#f5b331" style={{ marginTop: z(16) }}>{pct}%</Txt>
      </View>
    </Screen>
  );
}

// Phòng chờ Sứ mệnh xanh (205:21355).
export function GameLobby() {
  const nav = useNav();
  return (
    <Screen nav={false}>
      <WhiteHeader title="Sứ mệnh xanh" />
      <Scroll pad={40}>
        <View style={{ height: z(519) }}>
          <Img name="gm_lobby" style={StyleSheet.absoluteFill} />
          {/* Nút "Bắt đầu" đã có sẵn trong ảnh minh họa — đặt vùng bấm trùng vị trí */}
          <Press label="Bắt đầu" onPress={() => nav.replace('gamePlay')} style={st.startBtn} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: z(26), marginTop: z(36) }}>
          <Img name="gm_players" style={{ width: z(120), height: z(46) }} mode="contain" />
          <Txt s={14} c="#888" style={{ marginLeft: z(10) }}>Đã tham gia</Txt>
        </View>
        {['Đang chơi', 'Đã chơi 10 phút trước'].map(t => (
          <View key={t} style={st.playerRow}>
            <Img name="av_nonla" style={{ width: z(44), height: z(44), borderRadius: z(22) }} />
            <Txt s={14} style={{ marginLeft: z(26) }}>{t}</Txt>
          </View>
        ))}
      </Scroll>
    </Screen>
  );
}

// Màn chơi (205:21406 Sẵn sàng → 21378 → 21434 Kiểm tra → 21466 → 21498 Chúc mừng).
const ITEMS = [
  ['wi_battery', 72, 40, 46, 52, 'vo'], ['wi_bag', 130, 32, 58, 58, 'vo'], ['wi_tissue', 216, 52, 50, 60, 'vo'], ['wi_veg', 286, 40, 60, 44, 'huu'],
  ['wi_bottles', 60, 117, 78, 60, 'tai'], ['wi_foil', 138, 155, 74, 62, 'vo'], ['wi_banana', 320, 112, 48, 46, 'huu'], ['wi_boxes', 248, 162, 64, 50, 'tai'],
];
const BINS = [['huu', 10, 'Hữu cơ'], ['tai', 145, 'Tái chế'], ['vo', 282, 'Vô cơ']];

export function GamePlay() {
  const nav = useNav();
  const store = useStore();
  const [ready, setReady] = useState(true);
  const [placed, setPlaced] = useState({});
  const [sel, setSel] = useState(null);
  const [checked, setChecked] = useState(false);
  const [won, setWon] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const t = setTimeout(() => Animated.timing(fade, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setReady(false)), 1200);
    return () => clearTimeout(t);
  }, []);
  const drop = bin => {
    if (sel == null || checked) return;
    setPlaced(p => ({ ...p, [sel]: bin }));
    setSel(null);
  };
  const allPlaced = Object.keys(placed).length === ITEMS.length;
  const correct = bin => ITEMS.every((it, i) => placed[i] !== bin || it[5] === bin);
  const check = () => {
    setChecked(true);
    if (BINS.every(([b]) => correct(b))) setTimeout(() => { setWon(true); store.addPoints(3, 'Trò chơi “Sứ mệnh xanh”'); }, 900);
  };
  const reset = () => { setPlaced({}); setChecked(false); setWon(false); setSel(null); };
  const inBin = bin => ITEMS.map((it, i) => [it, i]).filter(([, i]) => placed[i] === bin);
  return (
    <Screen nav={false}>
      <WhiteHeader title="Sứ mệnh xanh" />
      <View style={{ height: z(800), overflow: 'hidden' }}>
        <Img name="gm_bg" style={StyleSheet.absoluteFill} />
        <View style={st.box} />
        {ITEMS.map(([img, x, y, w, h], i) => placed[i] == null && (
          <Press key={img} label="Rác" onPress={() => setSel(i === sel ? null : i)} style={{ position: 'absolute', left: z(x), top: z(y), width: z(w), height: z(h), borderRadius: z(8), borderWidth: sel === i ? 2 : 0, borderColor: C.green }}>
            <Img name={img} style={{ width: '100%', height: '100%' }} mode="contain" />
          </Press>
        ))}
        {BINS.map(([b, x, label]) => (
          <Press key={b} label={label} onPress={() => drop(b)} style={{ position: 'absolute', left: z(x), top: z(290), width: z(136), height: z(230) }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: z(4) }}>
              {inBin(b).map(([it]) => <Img key={it[0]} name={it[0]} style={{ width: z(it[3] * 0.7), height: z(it[4] * 0.7), margin: z(-4) }} mode="contain" />)}
            </View>
            {checked && (
              <View style={[st.verdict, { top: z(178) }]}>
                <Icon name={correct(b) ? 'checkmark-sharp' : 'close-sharp'} size={50} color={correct(b) ? '#7cc31a' : C.red} />
              </View>
            )}
          </Press>
        ))}
        {sel != null && <Txt s={13} w="600" c={C.white} center style={st.hint}>Chạm vào thùng rác phù hợp</Txt>}
        {allPlaced && !checked && <Btn title="Kiểm tra" onPress={check} bg={C.green} h={40} s={18} style={st.checkBtn} />}
        {checked && !won && !BINS.every(([b]) => correct(b)) && <Btn title="Thử lại" onPress={reset} bg="#e53935" h={40} s={18} style={st.checkBtn} />}
        {ready && (
          <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.55)', alignItems: 'center', justifyContent: 'center', opacity: fade }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(-200) }}>
              <Img name="mascot_earth" style={{ width: z(90), height: z(90), borderRadius: z(45) }} />
              <Txt s={44} w="900" c="#f2c40f" style={{ textShadowColor: '#7a5a00', textShadowRadius: 3, textShadowOffset: { width: 1, height: 2 } }}>Sẵn sàng</Txt>
            </View>
          </Animated.View>
        )}
        {won && (
          <View style={st.win}>
            <Congrats s={22} />
            <Img name="tree_award" style={{ width: z(130), height: z(124), marginTop: z(20) }} mode="contain" />
            <Txt s={17} style={{ marginTop: z(14) }}>Bạn nhận được <Txt s={17} w="800">3</Txt> điểm</Txt>
            <Btn title="Chơi lại" onPress={reset} h={36} s={14} bg="#43a047" style={{ marginTop: z(14), width: z(110) }} />
            <Btn title="Đi đến tích điểm" onPress={() => nav.reset('rewards')} h={36} s={14} bg="#43a047" style={{ marginTop: z(8), width: z(170) }} />
          </View>
        )}
      </View>
    </Screen>
  );
}

const st = StyleSheet.create({
  tile: { width: z(126), height: z(166), borderRadius: z(10), backgroundColor: C.white, ...shadow(4, 6, 0.25) },
  filter: { width: z(30), height: z(30), borderRadius: z(15), backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  loadTrack: { width: z(220), height: z(24), borderRadius: z(12), borderWidth: 2, borderColor: C.green, overflow: 'hidden', backgroundColor: '#8bd18e' },
  loadFill: { height: '100%', backgroundColor: '#f2d22e' },
  startBtn: { position: 'absolute', left: z(140), top: z(440), width: z(150), height: z(70) },
  playerRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: z(26), marginTop: z(26), height: z(60), borderRadius: z(5), backgroundColor: '#e8f5e9', paddingHorizontal: z(10) },
  box: { position: 'absolute', left: z(44), top: z(19), width: z(335), height: z(210), borderRadius: z(20), backgroundColor: C.white },
  verdict: { position: 'absolute', alignSelf: 'center', width: z(56), height: z(56), borderRadius: z(12), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  hint: { position: 'absolute', alignSelf: 'center', top: z(240), backgroundColor: 'rgba(0,0,0,0.45)', borderRadius: z(10), paddingHorizontal: z(12), paddingVertical: z(4), overflow: 'hidden' },
  checkBtn: { position: 'absolute', alignSelf: 'center', top: z(526), width: z(130), ...shadow(4, 4, 0.3) },
  win: { position: 'absolute', left: z(44), right: z(30), top: z(146), borderRadius: z(20), backgroundColor: C.white, alignItems: 'center', paddingVertical: z(30) },
});
