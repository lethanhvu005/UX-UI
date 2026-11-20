import React, { useEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, z, shadow } from '../theme';
import { Btn, Congrats, Icon, Img, Overlay, Press, Screen, Scroll, Txt } from '../ui';
import { useNav, useStore } from '../nav';
import { CHECKIN, GIFTS } from '../data/content';

const LEVELS = [[0, 'Mầm xanh'], [100, 'Người Bảo Vệ Trái Đất'], [200, 'Chiến Binh Tái Chế'], [350, 'Đại sứ xanh'], [500, 'Người Gìn Giữ Hành Tinh'], [700, 'Anh Hùng Sinh Thái']];
export function levelOf(total) {
  let i = 0;
  while (i + 1 < LEVELS.length && total >= LEVELS[i + 1][0]) i++;
  const next = LEVELS[i + 1]?.[0];
  return { level: i, name: LEVELS[i][1], remain: next ? next - total : 0 };
}

function RedPlus() {
  return <View style={st.redPlus}><Icon name="add" size={18} color={C.white} /></View>;
}

function PointsHeader({ title, emoji, right, children }) {
  const nav = useNav();
  const store = useStore();
  return (
    <View style={st.pHead}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: z(56) }}>
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
        <Txt s={28} w="700" c={C.white} style={{ marginLeft: z(20) }}>{title} {emoji}</Txt>
        <View style={{ flex: 1 }} />
        <Icon name="ellipsis-vertical" size={22} color={C.white} />
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: z(16) }}>
        <RedPlus />
        <Txt s={28} w="700" c={C.white} style={{ marginLeft: z(8), flex: 1 }}>{store.points} điểm</Txt>
        {right}
      </View>
      {children}
    </View>
  );
}

function SmallPill({ title, onPress }) {
  return (
    <Press label={title} onPress={onPress} style={st.pill}>
      <Txt s={11} w="700">{title}</Txt><Icon name="chevron-forward" size={12} />
    </Press>
  );
}

function Progress({ total, width = 290 }) {
  const ticks = [100, 200, 350, 500, 700];
  const pct = Math.min(total / 800, 1);
  return (
    <View style={{ width: z(width) }}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>{ticks.map(t => <Txt key={t} s={12} w="600" c="#333">{t}</Txt>)}</View>
      <View style={st.progTrack}>
        <View style={[st.progFill, { width: `${pct * 100}%` }]} />
        {ticks.map((t, i) => <View key={t} style={[st.progTick, { left: `${(i + 1) * 18}%` }]} />)}
      </View>
    </View>
  );
}

// Tích điểm & phần thưởng (205:11884, 205:12223, bản dài 205:6397).
export function Rewards() {
  const nav = useNav();
  const store = useStore();
  const lv = levelOf(store.total);
  return (
    <Screen bg="#eef6e9" topBg={C.green} light active="rewards">
      <Scroll pad={110}>
        <View style={[st.pHead, { paddingBottom: z(60) }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', height: z(56) }}>
            <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
            <Txt s={30} w="700" c={C.white} style={{ flex: 1, textAlign: 'center', marginRight: z(32) }}>Tích điểm</Txt>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: z(12) }}>
            <View style={{ flex: 1 }}>
              <Txt s={22} w="700" c={C.white}>{store.user.name}</Txt>
              <Txt s={14} c="#eaf5ea" style={{ marginTop: z(4) }}>Cấp độ {lv.level} - {lv.name}</Txt>
            </View>
            <SmallPill title="Tìm thêm điểm" onPress={() => nav.go('convert')} />
          </View>
        </View>
        <View style={st.totalCard}>
          <Img name="mascot_earth" style={{ width: z(74), height: z(80) }} mode="contain" />
          <View style={{ flex: 1, marginLeft: z(6) }}>
            <Txt s={15} w="500">Tổng điểm tích lũy: <Txt s={18} w="500" c={C.green}>{store.total}</Txt> điểm</Txt>
            <Progress total={store.total} width={270} />
          </View>
        </View>
        <View style={st.curCard}>
          <Txt s={14} w="600" style={{ flex: 1 }}>Điểm hiện tại của bạn:</Txt>
          <Txt s={18} w="600" c={C.green}>{store.points} <Txt s={18} w="600">điểm</Txt></Txt>
        </View>
        <Txt s={16} w="600" center style={{ marginTop: z(22) }}>👉 {lv.remain ? `Chỉ còn ${lv.remain} điểm nữa để lên cấp!` : 'Bạn đã đạt cấp cao nhất!'}</Txt>
        <View style={{ height: z(1340), marginTop: z(4) }}>
          <Img name="level_map" style={StyleSheet.absoluteFill} />
          <Press label="Cách tính điểm" onPress={() => nav.go('convert')} style={[st.hit, { top: 0 }]} />
          <Press label="Phần thưởng" onPress={() => nav.go('gifts')} style={[st.hit, { top: z(85) }]} />
          <Press label="Lịch sử" onPress={() => nav.go('history')} style={[st.hit, { top: z(175) }]} />
        </View>
      </Scroll>
    </Screen>
  );
}

// Quy đổi điểm xanh (205:6707).
export function Convert() {
  const nav = useNav();
  const store = useStore();
  return (
    <Screen bg="#eef4f2" topBg={C.green} light active="rewards">
      <Scroll>
        <PointsHeader title="Quy đổi điểm xanh" emoji="🎯">
          <View style={st.kidCard}>
            <Img name="kid_recycle" style={{ width: z(74), height: z(70) }} mode="contain" />
            <View style={{ marginLeft: z(16) }}>
              <Txt s={18} w="500">Tổng điểm tích lũy</Txt>
              <Txt s={18} w="600" c={C.green} style={{ marginTop: z(6) }}>{store.total} <Txt s={18} w="600">điểm</Txt></Txt>
            </View>
          </View>
        </PointsHeader>
        <View style={{ alignItems: 'center', marginTop: z(70) }}><Progress total={store.total} width={274} /></View>
        <Txt s={16} w="700" center style={{ marginTop: z(20) }}>Cách tính điểm  / 1 lần quét</Txt>
        <Txt s={13} c="#444" center style={{ marginHorizontal: z(30), marginTop: z(6) }}>Hãy cùng chung tay bảo vệ môi trường! Mỗi lần bạn phân loại rác đúng cách, hệ thống sẽ cộng điểm xanh tương ứng. Điểm xanh có thể quy đổi thành phần thưởng, voucher hoặc trồng cây gây quỹ.</Txt>
        <View style={{ height: z(395) }}>
          <Img name="convert_diagram" style={StyleSheet.absoluteFill} />
          <Press label="Đổi thưởng" onPress={() => nav.go('gifts')} style={st.redeem}><Txt s={13} w="700">Đổi thưởng 👉</Txt></Press>
        </View>
      </Scroll>
    </Screen>
  );
}

const TABS = [['recycle', '♻️ Đồ tái chế'], ['voucher', '🎫 Voucher'], ['fun', '🎭 Giải trí'], ['other', '🌞 Khác']];

// Phần thưởng (205:6838) + điểm danh (8058, 7039, 7245, 7451) + đổi quà (7904, 7749) + các tab (8496, 8210, 8343).
export function Gifts() {
  const nav = useNav();
  const store = useStore();
  const [tab, setTab] = useState('recycle');
  const [dayGift, setDayGift] = useState(0);
  const [confirm, setConfirm] = useState(null);
  const [got, setGot] = useState(null);
  const [toast, setToast] = useState(false);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(false), 2200); return () => clearTimeout(t); }, [toast]);
  const checkedToday = store.lastCheckin === new Date().toDateString();
  const today = CHECKIN[store.checkinDay % 7];
  const claim = () => {
    if (checkedToday) return;
    const pts = today[1] || 5;
    store.addPoints(pts, 'Điểm danh hằng ngày');
    store.update(s => ({ lastCheckin: new Date().toDateString(), checkinDay: (s.checkinDay + 1) % 7 }));
    setDayGift(pts);
  };
  const redeem = () => {
    const g = confirm; setConfirm(null);
    if (store.points < g.cost) { Alert.alert('Chưa đủ điểm', `Bạn cần thêm ${g.cost - store.points} điểm để đổi “${g.name}”.`); return; }
    store.addPoints(-g.cost, `Đổi quà “${g.name}”`);
    setGot(g);
  };
  const toggleReminder = () => {
    store.update(s => ({ reminder: !s.reminder }));
    if (!store.reminder) setToast(true);
  };
  return (
    <Screen bg="#f1f8ee" topBg={C.green} light active="rewards">
      <LinearGradient colors={['#f1f8ee', '#ffffff']} style={StyleSheet.absoluteFill} />
      <Scroll>
        <PointsHeader title="Phần thưởng" emoji="🎁" right={<SmallPill title="Lịch sử" onPress={() => nav.go('history')} />}>
          <View style={st.checkCard}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Txt s={15} w="500" style={{ flex: 1 }}>Điểm danh nhận điểm mỗi ngày</Txt>
              <Press label="Nhắc tôi" onPress={toggleReminder} style={[st.remind, store.reminder && { borderColor: '#999' }]}>
                <Txt s={9} c={store.reminder ? '#999' : C.green}>{store.reminder ? 'Hủy lời nhắc' : 'Nhắc tôi'}</Txt>
              </Press>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: z(12) }}>
              {CHECKIN.map(([label, pts, img], i) => {
                const done = i < store.checkinDay || (checkedToday && store.checkinDay === 0);
                return (
                  <View key={label} style={[st.day, i === store.checkinDay && !checkedToday && { borderColor: C.green, borderWidth: 2 }]}>
                    <Txt s={9} c={i === 0 ? '#777' : C.black}>{label}</Txt>
                    {done ? <Icon name="checkmark-circle-outline" size={26} color="#555" /> : <Img name={img} style={{ width: z(30), height: z(28) }} mode="contain" />}
                    {pts ? <Txt s={6} c={C.white} style={st.dayPts}>+{pts} điểm</Txt> : <View style={{ height: z(9) }} />}
                  </View>
                );
              })}
            </View>
            <Press label="Nhận điểm" onPress={claim} style={st.claim}>
              <Txt s={14} w="700" c={C.white}>{checkedToday ? 'Quay lại ngày mai nhé' : <>Nhận ngay <Txt s={14} w="700" c="#f2e600">{today[1] || 5}</Txt> điểm</>}</Txt>
            </Press>
          </View>
        </PointsHeader>
        <View style={{ height: z(70) }} />
        <Txt s={20} w="800" c={C.green} center>🎁 ĐỔI CÁC PHẦN QUÀ</Txt>
        <Txt s={14} c="#333" center style={{ marginTop: z(8), fontStyle: 'italic' }}>Gom rác, tích xanh  - Đổi quà thật nhanh!</Txt>
        <View style={{ flexDirection: 'row', justifyContent: 'center', gap: z(6), marginTop: z(16) }}>
          {TABS.map(([id, label]) => (
            <Press key={id} label={label} onPress={() => setTab(id)} style={[st.tab, tab === id && { backgroundColor: C.green }]}>
              <Txt s={12} c={tab === id ? C.white : C.black} style={{ fontStyle: 'italic' }}>{label}</Txt>
            </Press>
          ))}
        </View>
        <Txt s={11} center style={{ marginTop: z(16) }}>🌱 Phân loại rác - Sống xanh mỗi ngày cùng GreenSteps ♻️</Txt>
        <View style={st.grid}>
          {GIFTS[tab].map(g => (
            <Press key={g.id} label={g.name} onPress={() => setConfirm(g)} style={st.gift}>
              <Img name={g.img} style={{ width: z(146), height: z(72), borderRadius: z(8) }} />
              <Txt s={13} w="700" c={C.green} center style={{ marginTop: z(8) }}>{g.name}</Txt>
              <Txt s={10} center style={{ marginTop: z(2) }}>{g.desc}</Txt>
              <View style={st.cost}><View style={st.costDot} /><Txt s={8} c={C.white}>{g.cost} điểm</Txt></View>
            </Press>
          ))}
        </View>
      </Scroll>

      {toast && (
        <View style={st.notif} pointerEvents="none">
          <Img name="logo" style={{ width: z(48), height: z(48), borderRadius: z(24) }} />
          <View style={{ flex: 1, marginLeft: z(14) }}>
            <View style={{ flexDirection: 'row' }}><Txt s={13} w="700" style={{ flex: 1 }}>GreenSteps</Txt><Txt s={10} c="#888">Bây giờ</Txt></View>
            <Txt s={11} c="#333" style={{ marginTop: z(4) }}>“Đã đặt nhắc nhở! Hẹn bạn quay lại vào ngày mai để nhận thưởng nhé 🎁.”</Txt>
          </View>
        </View>
      )}
      <Overlay visible={!!dayGift} onClose={() => setDayGift(0)} dim="rgba(255,255,255,0.7)">
        <View style={{ alignItems: 'center' }}>
          <Press label="Đóng" onPress={() => setDayGift(0)} style={{ alignSelf: 'flex-end', marginRight: z(30) }}><Icon name="close-circle-outline" size={26} /></Press>
          <Congrats s={24} />
          <Img name="tree_award" style={{ width: z(146), height: z(140), marginVertical: z(8) }} mode="contain" />
          <Txt s={17}>Bạn nhận được <Txt s={17} w="800">{dayGift}</Txt> điểm</Txt>
          <Btn title="Đổi quà 🎁" onPress={() => setDayGift(0)} h={40} radius={20} bg="#2e9d38" style={{ marginTop: z(14), width: z(110) }} />
        </View>
      </Overlay>
      <Overlay visible={!!confirm} onClose={() => setConfirm(null)}>
        {confirm && (
          <View style={st.confirm}>
            <Txt s={18} w="600">Xác nhận đổi quà?</Txt>
            <Txt s={14} center style={{ marginTop: z(12) }}>Bạn đang có {store.points} điểm. Quà{'\n'}<Txt s={14} w="700">"{confirm.name}"</Txt> cần {confirm.cost} điểm.</Txt>
            <View style={{ flexDirection: 'row', gap: z(22), marginTop: z(20) }}>
              <Btn title="Đổi ngay" onPress={redeem} radius={6} h={36} s={14} bg="#2e9d38" style={{ width: z(82) }} />
              <Btn title="Hủy" onPress={() => setConfirm(null)} radius={6} h={36} s={14} bg="#c4c4c4" color={C.black} style={{ width: z(82) }} />
            </View>
          </View>
        )}
      </Overlay>
      <Overlay visible={!!got} onClose={() => setGot(null)}>
        {got && (
          <View style={[st.confirm, { width: z(306), paddingVertical: z(24) }]}>
            <Congrats s={22} />
            <Img name={got.img === 'gift_pot' ? 'gift_pot_big' : got.img} style={{ width: z(176), height: z(130), borderRadius: z(6), marginTop: z(14) }} />
            <Txt s={16} w="600" center style={{ marginTop: z(14) }}>Bạn nhận được <Txt s={16} w="900" c="#e6d600" style={{ textShadowColor: '#555', textShadowRadius: 1 }}>{got.name.toLowerCase()}</Txt></Txt>
            <Txt s={13} center style={{ marginTop: z(8) }}>“Kiếm thật nhiều điểm để đổi nhiều phần quà hấp dẫn”</Txt>
            <Btn title="Nhận ngay" onPress={() => setGot(null)} h={46} s={16} bg="#4caf50" style={{ marginTop: z(14), width: z(124) }} />
          </View>
        )}
      </Overlay>
    </Screen>
  );
}

// Lịch sử tích điểm (205:7458 Tất cả, 7581 Tháng này, 7671 Tuần này).
export function History() {
  const nav = useNav();
  const store = useStore();
  const [tab, setTab] = useState('all');
  const list = tab === 'all' ? store.history : store.history.slice(0, tab === 'month' ? 6 : 3);
  return (
    <Screen bg="#f1f8ee" topBg={C.green} light active="rewards">
      <View style={[st.pHead, { borderBottomLeftRadius: z(20), borderBottomRightRadius: z(20), paddingBottom: z(20) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: z(56) }}>
          <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
          <Txt s={28} w="700" c={C.white} style={{ marginLeft: z(20), flex: 1 }}>Lịch sử</Txt>
          <Icon name="ellipsis-vertical" size={22} color={C.white} />
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: z(16) }}>
          <RedPlus /><Txt s={28} w="700" c={C.white} style={{ marginLeft: z(8), flex: 1 }}>{store.points} điểm</Txt>
          <SmallPill title="Tìm thêm điểm" onPress={() => nav.go('convert')} />
        </View>
      </View>
      <Scroll contentStyle={{ paddingHorizontal: z(34) }}>
        <Txt s={19} w="700" c={C.green} center style={{ marginTop: z(24) }}>🎁 Lịch sử tích điểm và đổi quà</Txt>
        <Txt s={11} center style={{ marginTop: z(10) }}>🌱 Phân loại rác - Sống xanh mỗi ngày cùng GreenSteps ♻️</Txt>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: z(18) }}>
          {[['all', 'Tất cả'], ['month', 'Tháng này'], ['week', 'Tuần này']].map(([id, l]) => (
            <Press key={id} label={l} onPress={() => setTab(id)} style={[st.hTab, tab === id && { backgroundColor: C.green, borderColor: C.green }]}>
              <Txt s={13} c={tab === id ? C.white : C.black} style={{ fontStyle: 'italic' }}>{l}</Txt>
            </Press>
          ))}
        </View>
        <View style={st.summary}>
          {[['+ 30', 'Điểm tuần này'], ['+ 60', 'Điểm tháng này'], [String(store.total), 'Điểm tổng tích lũy']].map(([v, l]) => (
            <View key={l} style={{ alignItems: 'center' }}><Txt s={13} w="700" c={C.green}>{v}</Txt><Txt s={11} style={{ marginTop: z(12) }}>{l}</Txt></View>
          ))}
        </View>
        <View style={{ marginTop: z(26), borderLeftWidth: z(3), borderLeftColor: C.green, paddingLeft: z(4) }}>
          {list.map(([date, label, n], i) => (
            <View key={i} style={st.hRow}>
              <Icon name="leaf" size={22} color="#6abf3a" />
              <Txt s={13} w="500" c={C.green} style={{ width: z(96), marginLeft: z(8) }}>{date}</Txt>
              <Txt s={11} style={{ flex: 1 }} numberOfLines={1}>{label}</Txt>
              <Txt s={13} w="600" c={n < 0 ? C.black : C.green}>{n > 0 ? `+ ${n}` : n}</Txt>
            </View>
          ))}
        </View>
      </Scroll>
    </Screen>
  );
}

const st = StyleSheet.create({
  pHead: { backgroundColor: C.green, paddingHorizontal: z(16), paddingBottom: z(16), borderBottomLeftRadius: z(30), borderBottomRightRadius: z(30) },
  redPlus: { width: z(26), height: z(26), borderRadius: z(13), backgroundColor: '#e53935', alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: C.white },
  pill: { flexDirection: 'row', alignItems: 'center', gap: z(2), backgroundColor: C.white, borderRadius: z(15), height: z(26), paddingHorizontal: z(10), borderWidth: 1, borderColor: '#2f6b2f' },
  progTrack: { height: z(22), borderRadius: z(11), backgroundColor: '#a5d6a7', marginTop: z(4), overflow: 'hidden' },
  progFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: C.green },
  progTick: { position: 'absolute', top: 0, bottom: 0, width: 2, backgroundColor: C.white },
  totalCard: { marginTop: z(-44), marginHorizontal: z(24), borderRadius: z(25), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', padding: z(12), ...shadow(4, 8, 0.25) },
  curCard: { marginTop: z(16), marginHorizontal: z(24), height: z(40), borderRadius: z(20), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(20), ...shadow(4, 8, 0.2) },
  hit: { position: 'absolute', right: z(13), width: z(64), height: z(64), borderRadius: z(32) },
  kidCard: { marginTop: z(20), marginBottom: z(-64), marginHorizontal: z(24), height: z(86), borderRadius: z(20), backgroundColor: '#e3f4df', flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(24), ...shadow(4, 8, 0.2) },
  redeem: { position: 'absolute', right: z(18), bottom: z(8), backgroundColor: '#f7c8cf', borderRadius: z(20), paddingHorizontal: z(16), height: z(38), justifyContent: 'center' },
  checkCard: { marginTop: z(12), marginBottom: z(-60), marginHorizontal: z(8), borderRadius: z(10), backgroundColor: C.white, padding: z(12), ...shadow(4, 8, 0.25) },
  remind: { borderWidth: 1, borderColor: C.green, borderRadius: z(10), paddingHorizontal: z(8), paddingVertical: z(2) },
  day: { width: z(44), height: z(62), borderRadius: z(6), backgroundColor: '#9fd59f', alignItems: 'center', justifyContent: 'space-between', paddingVertical: z(3) },
  dayPts: { backgroundColor: '#e53935', borderRadius: z(4), paddingHorizontal: z(2), overflow: 'hidden' },
  claim: { alignSelf: 'center', marginTop: z(14), width: z(210), height: z(24), borderRadius: z(12), backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  tab: { borderWidth: 1, borderColor: '#2f6b2f', borderRadius: z(15), paddingHorizontal: z(8), height: z(28), justifyContent: 'center', backgroundColor: C.white },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: z(26), marginTop: z(16), rowGap: z(22) },
  gift: { width: z(170), borderRadius: z(10), backgroundColor: C.white, alignItems: 'center', padding: z(10), ...shadow(4, 8, 0.2) },
  cost: { flexDirection: 'row', alignItems: 'center', gap: z(4), backgroundColor: C.green, borderRadius: z(10), paddingHorizontal: z(8), paddingVertical: z(2), marginTop: z(10) },
  costDot: { width: z(8), height: z(8), borderRadius: z(4), backgroundColor: '#e53935' },
  notif: { position: 'absolute', top: z(60), left: z(16), right: z(16), borderRadius: z(20), backgroundColor: C.white, flexDirection: 'row', alignItems: 'center', padding: z(16), ...shadow(4, 14, 0.3) },
  confirm: { width: z(276), borderRadius: z(20), backgroundColor: C.white, alignItems: 'center', padding: z(22) },
  hTab: { width: z(98), height: z(28), borderRadius: z(15), borderWidth: 1, borderColor: '#333', alignItems: 'center', justifyContent: 'center' },
  summary: { marginTop: z(24), borderRadius: z(15), backgroundColor: '#e3f1df', flexDirection: 'row', justifyContent: 'space-between', padding: z(20) },
  hRow: { flexDirection: 'row', alignItems: 'center', height: z(36) },
});
