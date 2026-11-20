import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Icon, Img, Overlay, Press, Screen, Scroll, SearchBox, Txt } from '../ui';
import { useNav } from '../nav';
import { ALL_ITEMS, HANDBOOK, WASTE_GROUPS } from '../data/content';

const OUTLINE = { textShadowColor: 'rgba(0,0,0,0.45)', textShadowOffset: { width: 1, height: 2 }, textShadowRadius: 3 };

function Header({ search, setSearch, mascot = true }) {
  const nav = useNav();
  return (
    <View style={st.head}>
      <View style={{ flexDirection: 'row', alignItems: 'center', height: z(70) }}>
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(6) }}><Icon name="chevron-back" size={26} color={C.white} /></Press>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: z(30) }}>
          <Txt s={30} w="800" c={C.white} style={OUTLINE}>Sổ tay rác</Txt>
          {mascot && <Img name="mascot_title" style={{ width: z(62), height: z(60), marginLeft: z(4) }} mode="contain" />}
        </View>
      </View>
      {setSearch && <SearchBox value={search} onChangeText={setSearch} style={{ marginHorizontal: z(10), marginBottom: z(10) }} />}
    </View>
  );
}

// Sổ tay rác (205:8650): 3 nhóm lớn + "Xem tất cả".
export function Handbook() {
  const nav = useNav();
  const [q, setQ] = useState('');
  const go = () => {
    const hit = ALL_ITEMS.find(i => i[0].toLowerCase().includes(q.trim().toLowerCase()));
    if (q.trim() && hit) nav.go('wasteGroup', { id: hit[2] });
  };
  return (
    <Screen bg={C.white} topBg={C.green} light active="home">
      <Header search={q} setSearch={t => setQ(t)} />
      <Scroll contentStyle={{ alignItems: 'center', paddingTop: z(30) }}>
        {q.trim() ? (
          <Press label="Tìm" onPress={go} style={{ marginBottom: z(10) }}><Txt s={13} c={C.green}>Nhấn để xem kết quả cho “{q}”</Txt></Press>
        ) : null}
        <View style={{ flexDirection: 'row', gap: z(26) }}>
          <BigCard label="Rác tái chế" bg="#3aa6f2" img="sc_recycle" color={C.white} onPress={() => nav.go('wasteGroup', { id: 'recycle' })} />
          <BigCard label="Rác hữu cơ" bg="#eeb1b3" img="sc_leaf" color="#555" onPress={() => nav.go('wasteGroup', { id: 'organic' })} />
        </View>
        <BigCard label="Rác vô cơ" bg="#b7b29a" img="sc_bulb" color="#555" big onPress={() => nav.go('wasteGroup', { id: 'inorganic' })} style={{ marginTop: z(26) }} />
        <Img name="bubble_hint" style={{ alignSelf: 'flex-end', marginRight: z(30), marginTop: z(24), width: z(110), height: z(86) }} mode="contain" />
        <Press label="Xem tất cả" onPress={() => nav.go('handbookAll')} style={st.seeAll}>
          <Icon name="apps" size={22} color={C.green} />
          <Txt s={16} w="600">Xem tất cả</Txt>
        </Press>
      </Scroll>
      <Img name="mascot_seed" style={{ position: 'absolute', left: 0, bottom: z(90), width: z(82), height: z(100) }} mode="contain" />
    </Screen>
  );
}

function BigCard({ label, bg, img, color, onPress, big, style }) {
  return (
    <Press label={label} onPress={onPress} style={[st.big, { backgroundColor: bg, width: z(big ? 171 : 150), height: z(big ? 138 : 135) }, style]}>
      <Img name={img} style={{ width: z(62), height: z(62), borderRadius: z(10) }} mode="contain" />
      <Txt s={14} w="700" c={color} style={{ marginTop: z(12) }}>{label}</Txt>
    </Press>
  );
}

// Tất cả (205:8751).
export function HandbookAll() {
  const nav = useNav();
  const [q, setQ] = useState('');
  const items = ALL_ITEMS.filter(i => i[0].toLowerCase().includes(q.toLowerCase()));
  const bins = { recycle: 'minibin_green', organic: 'minibin_yellow', inorganic: 'minibin_red' };
  return (
    <Screen bg="#e6f4e1" topBg={C.green} light active="home">
      <Header search={q} setSearch={setQ} />
      <Scroll contentStyle={{ paddingHorizontal: z(38) }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: z(30) }}>
          {[['recycle', 'Rác tái\nchế'], ['organic', 'Rác hữu\ncơ'], ['inorganic', 'Rác vô\ncơ']].map(([id, label]) => (
            <Press key={id} label={label} onPress={() => nav.go('wasteGroup', { id })} style={{ alignItems: 'center' }}>
              <Img name={bins[id]} style={{ width: z(52), height: z(72) }} mode="contain" />
              <Txt s={15} center>{label}</Txt>
            </Press>
          ))}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(8), marginTop: z(16), marginBottom: z(14) }}>
          <Img name="ic_plant" style={{ width: z(44), height: z(40) }} mode="contain" />
          <Txt s={15} center style={{ flex: 1 }}>Hãy để rác vào đúng thùng – Giữ môi trường luôn xanh sạch nhé!</Txt>
        </View>
        {items.map(([name, img, group]) => (
          <ItemRow key={name} name={name} img={img} color={{ recycle: '#e55353', organic: '#e8e05a', inorganic: '#2e6b2f' }[group]} bin={bins[group]}
            onPress={() => nav.go('wasteGroup', { id: group })} />
        ))}
      </Scroll>
    </Screen>
  );
}

function ItemRow({ name, img, color, bin, onPress, dim }) {
  return (
    <Press label={name} onPress={onPress} style={[st.itemRow, dim && { opacity: 0.6 }]}>
      <View style={{ width: z(4), height: z(52), borderRadius: 2, backgroundColor: color, marginLeft: z(26) }} />
      <View style={st.itemCircle}><Img name={img} style={{ width: z(56), height: z(56), borderRadius: z(28) }} /></View>
      <Txt s={15} center={!!bin} style={{ flex: 1, marginLeft: z(14) }}>{name}</Txt>
      {bin && <Img name={bin} style={{ width: z(44), height: z(62), marginRight: z(10) }} mode="contain" />}
    </Press>
  );
}

// Nhóm rác (205:9316 / 9169 / 8980) + popup "Cách xử lý" (205:9424 / 9225 / 9072).
export function WasteGroup() {
  const nav = useNav();
  const g = WASTE_GROUPS[nav.route.params.id] ?? WASTE_GROUPS.recycle;
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(true);
  const [how, setHow] = useState(false);
  const items = g.items.filter(i => i[0].toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen bg="#e6f4e1" topBg={C.green} light active="home">
      <Header search={q} setSearch={setQ} />
      <Scroll contentStyle={{ paddingHorizontal: z(38) }}>
        <Press label={g.title} onPress={() => setOpen(o => !o)} style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: z(10), marginTop: z(22) }}>
          <Img name={g.icon} style={{ width: z(46), height: z(46) }} mode="contain" />
          <Txt s={20} w="600" c="#555">{g.title}</Txt>
          <Icon name={open ? 'caret-up' : 'caret-down'} size={16} color="#555" />
        </Press>
        {open && (
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(8), marginHorizontal: z(-26) }}>
            <Icon name="checkmark" size={30} color={C.greenText} />
            <Txt s={15} center style={{ flex: 1, marginHorizontal: z(6) }}>{g.intro}</Txt>
            <Img name={g.bin} style={{ width: z(42), height: z(62) }} mode="contain" />
          </View>
        )}
        <View style={{ marginTop: z(20) }}>
          {items.map(([name, img, color]) => <ItemRow key={name} name={name} img={img} color={color} onPress={() => setHow(true)} />)}
        </View>
      </Scroll>
      <Overlay visible={how} onClose={() => setHow(false)} dim="rgba(120,140,120,0.45)">
        <View style={st.how}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(10) }}>
            <Img name={g.icon} style={{ width: z(44), height: z(44) }} mode="contain" />
            <Txt s={20} w="600" c="#555">{g.title}</Txt>
          </View>
          <Icon name="caret-down" size={16} color="#555" />
          <Txt s={15} w="700" style={{ marginTop: z(10) }}>Cách xử lý:</Txt>
          <View style={{ alignSelf: 'stretch', marginTop: z(10) }}>
            {g.how.map(t => <Txt key={t} s={13} style={{ marginBottom: z(4), lineHeight: z(18) }}>•  {t}</Txt>)}
            <Txt s={13} style={{ marginTop: z(14), lineHeight: z(18) }}><Txt s={13} w="700" c={C.greenDeep}>➔ </Txt>{g.example}</Txt>
          </View>
        </View>
      </Overlay>
    </Screen>
  );
}

// Sổ tay rác dạng danh sách (205:9842).
export function HandbookList() {
  const nav = useNav();
  return (
    <Screen bg={C.white} topBg={C.green} light active="home">
      <View style={[st.head, { paddingBottom: z(70) }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: z(64) }}>
          <Press label="Quay lại" onPress={nav.back} style={{ padding: z(6) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
          <Txt s={30} w="700" c={C.white} style={{ flex: 1, textAlign: 'center' }}>Sổ tay rác</Txt>
          <Press label="Các nhóm rác" onPress={() => nav.go('handbook')} style={{ padding: z(6) }}><Icon name="ellipsis-vertical" size={22} color={C.white} /></Press>
        </View>
      </View>
      <View style={st.introCard}>
        <Img name="mascot_wave" style={{ width: z(62), height: z(70) }} mode="contain" />
        <Txt s={11} c="#555" center style={{ flex: 1 }}>Phân loại rác không chỉ giúp giảm ô nhiễm mà còn giúp tái chế tài nguyên hiệu quả. Hãy chọn loại rác để xem hướng dẫn chi tiết.</Txt>
      </View>
      <Scroll contentStyle={{ paddingHorizontal: z(38), paddingTop: z(70) }} style={{ marginTop: z(-70) }}>
        {HANDBOOK.map(h => (
          <Press key={h.id} label={h.name} onPress={() => nav.go('handbookItem', { id: h.id })} style={st.hbRow}>
            <Img name={h.icon} style={{ width: z(46), height: z(46) }} mode="contain" />
            <View style={{ flex: 1, marginLeft: z(8) }}>
              <Txt s={15} w="500">{h.name}</Txt>
              <Txt s={13} c="#888" style={{ marginTop: z(4) }}>{h.desc}</Txt>
            </View>
            <Icon name="chevron-forward" size={22} />
          </Press>
        ))}
      </Scroll>
    </Screen>
  );
}

// Chi tiết vật liệu (205:9909 nhựa, 10358 giấy, 10283 thủy tinh, 10208 hữu cơ, 10133 pin, 10058 áo quần, 9983 carton).
export function HandbookItem() {
  const nav = useNav();
  const h = HANDBOOK.find(x => x.id === nav.route.params.id) ?? HANDBOOK[0];
  const [dos, setDos] = useState(true);
  return (
    <Screen bg="#f6fbee" topBg={C.green} light active="home">
      <View style={{ backgroundColor: C.green }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', height: z(56), paddingHorizontal: z(16) }}>
          <Press label="Quay lại" onPress={nav.back} style={{ padding: z(6) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
          <Txt s={30} w="700" c={C.white} style={{ flex: 1, textAlign: 'center' }}>GreenSteps</Txt>
          <Press label="Danh sách" onPress={() => nav.go('handbookList')} style={{ padding: z(6) }}><Icon name="ellipsis-vertical" size={22} color={C.white} /></Press>
        </View>
        <Img name={h.img} style={{ width: z(250), height: z(150), alignSelf: 'center' }} mode="contain" />
      </View>
      <View style={st.band}>
        <Txt s={22} w="500" style={{ flex: 1 }}>{h.title}</Txt>
        <Press label="Dos" onPress={() => setDos(d => !d)} style={st.dos}>
          <View style={[st.dosKnob, !dos && { backgroundColor: '#e05a5a' }]} />
          <Txt s={10} w="600">{dos ? 'Dos' : "Don'ts"}</Txt>
        </Press>
      </View>
      <Scroll contentStyle={{ paddingHorizontal: z(16), paddingTop: z(30) }}>
        {(dos ? h.rules : h.rules.map(r => r.replace(/^Bỏ/, 'Không bỏ sai').replace(/^Không /, 'Tránh '))).map(r => (
          <View key={r} style={{ flexDirection: 'row', gap: z(18), marginBottom: z(22) }}>
            <Img name="ic_recycle_small" style={{ width: z(24), height: z(24) }} mode="contain" />
            <Txt s={14} c="#555" style={{ flex: 1, lineHeight: z(20) }}>{r}</Txt>
          </View>
        ))}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(10) }}>
          <View style={{ flex: 1, gap: z(22), paddingLeft: z(8) }}>
            {h.tips.map(t => <Txt key={t} s={12} c="#666" style={{ lineHeight: z(17) }}>{t}</Txt>)}
          </View>
          <Img name={h.bin} style={{ width: z(150), height: z(190) }} mode="contain" />
        </View>
      </Scroll>
    </Screen>
  );
}

const st = StyleSheet.create({
  head: { backgroundColor: C.green, paddingHorizontal: z(16), paddingBottom: z(4) },
  big: { borderRadius: z(15), alignItems: 'center', justifyContent: 'center', ...shadow(6, 8, 0.3) },
  seeAll: { marginTop: z(8), width: z(316), height: z(60), borderRadius: z(5), backgroundColor: C.white, borderWidth: 1, borderColor: '#999', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: z(14), ...shadow(4, 4, 0.25) },
  itemRow: { flexDirection: 'row', alignItems: 'center', height: z(78), borderRadius: z(4), backgroundColor: C.white, marginBottom: z(24), marginHorizontal: z(-12) },
  itemCircle: { width: z(60), height: z(60), borderRadius: z(30), marginLeft: z(20), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#eee' },
  how: { width: z(340), borderRadius: z(30), backgroundColor: '#f4f9f2', alignItems: 'center', padding: z(20), paddingBottom: z(40) },
  introCard: { marginTop: z(-60), marginHorizontal: z(26), borderRadius: z(25), backgroundColor: '#f8fbf3', flexDirection: 'row', alignItems: 'center', padding: z(14), gap: z(6), zIndex: 2, ...shadow(4, 8, 0.25) },
  hbRow: { flexDirection: 'row', alignItems: 'center', minHeight: z(98), borderRadius: z(15), borderWidth: 1, borderColor: C.green, backgroundColor: '#f6fbf3', padding: z(10), marginBottom: z(16) },
  band: { flexDirection: 'row', alignItems: 'center', height: z(74), backgroundColor: '#9fd59f', borderTopLeftRadius: z(40), borderTopRightRadius: z(40), marginTop: z(-28), paddingHorizontal: z(26) },
  dos: { flexDirection: 'row', alignItems: 'center', gap: z(10), backgroundColor: C.white, borderRadius: z(20), paddingRight: z(16), paddingLeft: z(4), height: z(28) },
  dosKnob: { width: z(20), height: z(20), borderRadius: z(10), backgroundColor: '#9bd35a' },
});
