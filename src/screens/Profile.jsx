import React, { useRef, useState } from 'react';
import { Alert, Dimensions, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Switch, TextInput, View } from 'react-native';
import { C, z, shadow } from '../theme';
import { Btn, GreenHeader, Icon, Img, Press, Screen, Scroll, Txt, WhiteHeader } from '../ui';
import { useNav, useStore } from '../nav';
import { FRIENDS } from '../data/content';

const PROFILE_TABS = [['history', 'Lịch sử'], ['achievements', 'Thành tích'], ['community', 'Cộng đồng'], ['messages', 'Bạn bè']];
const TIMELINE = [
  ['29 tháng 10 ,2025', [['av_nonla', 'Hoàn thành 3 việc'], ['av_boy1', 'Hoàn thành 3 việc']]],
  ['30 tháng 10 ,2025', [['av_red', 'Hoàn thành 3 việc'], ['av_boy2', 'Thắng giải "Sứ mệnh xanh"']]],
];

// Hồ sơ cá nhân (205:2453).
export function Profile() {
  const nav = useNav();
  const store = useStore();
  return (
    <Screen bg={C.white} topBg="#cfe6d2" active="profile">
      <Scroll>
        <View style={{ height: z(213) }}>
          <Img name="profile_header" style={StyleSheet.absoluteFill} />
          <Press label="Cài đặt" onPress={() => nav.go('settings')} style={[st.headBtn, { left: z(16) }]} />
          <Press label="Thông báo" onPress={() => nav.go('notifications')} style={[st.headBtn, { right: z(20) }]} />
          <Press label="Chỉnh sửa hồ sơ" onPress={() => nav.go('editProfile')} style={{ position: 'absolute', left: z(60), top: z(85), width: z(100), height: z(110) }} />
          <Press label="Thành tích" onPress={() => nav.go('achievements')} style={{ position: 'absolute', left: z(225), top: z(60), width: z(150), height: z(100) }} />
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: z(24), padding: z(22), paddingBottom: z(16) }}>
          {[['8:00 Hôm nay', 'Trồng cây xanh', 'av_girl_flag'], ['15:00 Hôm nay', 'Tuyển tình nguyện viên', 'av_nonla_red'], ['9:00 Ngày mai', 'Nhặt rác bãi biển', 'av_boy1']].map(([t, d, a]) => (
            <Press key={t} label={d} onPress={() => nav.go('community')} style={st.story}>
              <Img name={a} style={st.storyAv} />
              <View style={{ flex: 1, marginLeft: z(8) }}>
                <Txt s={11} w="700" c={C.white}>{t}</Txt>
                <Txt s={11} c={C.white} numberOfLines={1}>{d}</Txt>
              </View>
              <Img name="av_nonla" style={[st.storyAv, { width: z(32), height: z(32) }]} />
            </Press>
          ))}
        </ScrollView>
        <View style={{ height: 1, backgroundColor: C.green, marginHorizontal: z(0) }} />
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: z(20), marginTop: z(20) }}>
          {PROFILE_TABS.map(([id, l], i) => (
            <Press key={id} label={l} onPress={() => i && nav.go(id)} style={[st.ptab, i === 0 && { backgroundColor: C.green }]}>
              <Txt s={11} c={i === 0 ? C.black : '#333'}>{l}</Txt>
            </Press>
          ))}
        </View>
        <View style={{ paddingHorizontal: z(26), marginTop: z(10) }}>
          {store.history.slice(0, 2).map(([date, label, n]) => (
            <View key={date + label} style={st.tl}>
              <Img name="av_girl_flag" style={{ width: z(40), height: z(40), borderRadius: z(20) }} />
              <Txt s={13} style={{ flex: 1, marginLeft: z(30) }} numberOfLines={1}>{label}</Txt>
              <Txt s={13}>{n > 0 ? `+${n}` : n} 🍃</Txt>
            </View>
          ))}
          {TIMELINE.map(([date, rows]) => (
            <View key={date}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(8), marginTop: z(20) }}>
                <View style={{ width: z(7), height: z(7), borderRadius: z(4), backgroundColor: C.red }} />
                <Txt s={13} w="700">{date}</Txt>
              </View>
              {rows.map(([av, label], i) => (
                <View key={i} style={st.tl}>
                  <Img name={av} style={{ width: z(40), height: z(40), borderRadius: z(20) }} />
                  <Txt s={13} style={{ flex: 1, marginLeft: z(30) }}>{label}</Txt>
                  <Txt s={13}>+60 🍃</Txt>
                </View>
              ))}
            </View>
          ))}
        </View>
      </Scroll>
    </Screen>
  );
}

// Cài đặt (205:3484).
export function Settings() {
  const nav = useNav();
  const store = useStore();
  const [dark, setDark] = useState(false);
  const [sound, setSound] = useState(true);
  const [notif, setNotif] = useState(true);
  const Row = ({ ic, title, sub, value, onChange }) => (
    <View style={st.setRow}>
      <Img name={ic} style={{ width: z(40), height: z(40), borderRadius: z(8) }} />
      <View style={{ flex: 1, marginLeft: z(12) }}>
        <Txt s={16}>{title}</Txt>
        <Txt s={11} c="#bbb" style={{ marginTop: z(2) }}>{sub}</Txt>
      </View>
      {onChange && <Switch value={value} onValueChange={onChange} trackColor={{ true: '#5f9e00', false: '#ccc' }} thumbColor={C.white} />}
    </View>
  );
  return (
    <Screen bg={C.green} topBg={C.green} light nav={false}>
      <GreenHeader title="Cài đặt" right={<View style={st.searchCircle}><Icon name="search" size={22} /></View>} />
      <Scroll pad={40} contentStyle={{ paddingHorizontal: z(18) }}>
        <View style={[st.box, { flexDirection: 'row', alignItems: 'center', paddingVertical: z(10) }]}>
          <View style={{ flex: 1, paddingLeft: z(20) }}>
            <Txt s={16} w="600">{store.user.name}</Txt>
            <Txt s={16} style={{ marginTop: z(8) }}>{store.user.email}</Txt>
          </View>
          <Img name="av_nonla_big" style={{ width: z(80), height: z(80), borderRadius: z(40) }} />
        </View>
        <View style={st.box}>
          <Row ic="set_ic1" title="Giao diện tối" sub="Chế độ ban đêm  •  Đỡ mỏi mắt" value={dark} onChange={setDark} />
          <Row ic="set_ic2" title="Giao diện sáng" sub="Chế độ ban ngày  •  Rõ ràng, sáng sủa" value={!dark} onChange={v => setDark(!v)} />
        </View>
        <View style={st.box}>
          <Row ic="set_ic3" title="Âm thanh và rung" sub="Chế độ âm thanh  •  Nhạc chuông" value={sound} onChange={setSound} />
          <Row ic="set_ic4" title="Thông báo" sub="Thanh tâm trạng  •  Không làm phiền" value={notif} onChange={setNotif} />
        </View>
        <View style={[st.box, { paddingHorizontal: z(36) }]}>
          {[['Thay đổi mật khẩu', () => Alert.alert('Thay đổi mật khẩu', 'Chúng tôi đã gửi liên kết đổi mật khẩu tới email của bạn.')],
            ['Sửa thông tin cá nhân', () => nav.go('editProfile')],
            ['Lịch sử đăng nhập', () => Alert.alert('Lịch sử đăng nhập', 'Lần đăng nhập gần nhất: hôm nay trên thiết bị này.')],
            ['Thiết lập mật mã', () => Alert.alert('Thiết lập mật mã', 'Tính năng sẽ sớm được cập nhật.')]].map(([t, fn], i) => (
            <Press key={t} label={t} onPress={fn} style={[st.linkRow, i < 3 && { borderBottomWidth: 1, borderBottomColor: '#ddd' }]}>
              <Txt s={16} style={{ flex: 1 }}>{t}</Txt><Icon name="chevron-forward" size={20} />
            </Press>
          ))}
        </View>
        <Press label="Đăng xuất" onPress={() => nav.replace('login')} style={{ flexDirection: 'row', alignItems: 'center', gap: z(12), marginTop: z(40), marginLeft: z(14) }}>
          <Icon name="log-out-outline" size={24} color={C.red} />
          <Txt s={20} w="700">Đăng xuất</Txt>
        </Press>
      </Scroll>
    </Screen>
  );
}

// Chỉnh sửa (205:3549).
export function EditProfile() {
  const nav = useNav();
  const store = useStore();
  const [form, setForm] = useState({ name: store.user.name, email: store.user.email, pass: '', birth: '30/10/2005', country: 'VietNam' });
  const [pick, setPick] = useState(null);
  const set = k => v => setForm(f => ({ ...f, [k]: v }));
  const save = () => { store.update(() => ({ user: { name: form.name || store.user.name, email: form.email || store.user.email } })); nav.back(); };
  const OPTIONS = { country: ['VietNam', 'Lào', 'Campuchia', 'Thái Lan'], birth: ['30/10/2005', '01/01/2004', '15/06/2006'] };
  return (
    <Screen nav={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <WhiteHeader title="Chỉnh sửa" size={30} />
        <Scroll pad={40} contentStyle={{ paddingHorizontal: z(50) }}>
          <View style={{ alignSelf: 'center', marginTop: z(10) }}>
            <Img name="av_nonla_big" style={{ width: z(120), height: z(120), borderRadius: z(60), borderWidth: z(4), borderColor: C.green }} />
            <Press label="Đổi ảnh" onPress={() => Alert.alert('Ảnh đại diện', 'Chọn ảnh mới từ thư viện của bạn.')} style={{ position: 'absolute', right: z(-6), bottom: z(6) }}><Icon name="camera-outline" size={20} color="#4a8fe0" /></Press>
          </View>
          {[['Tên', 'name'], ['Email', 'email'], ['Mật khẩu', 'pass']].map(([l, k]) => (
            <View key={k} style={{ marginTop: z(30) }}>
              <Txt s={14} w="500">{l}</Txt>
              <TextInput value={form[k]} onChangeText={set(k)} secureTextEntry={k === 'pass'} placeholder={k === 'pass' ? '********' : ''} placeholderTextColor="#ccc" style={st.input} />
            </View>
          ))}
          {[['Ngày sinh', 'birth'], ['Quốc gia', 'country']].map(([l, k]) => (
            <View key={k} style={{ marginTop: z(30) }}>
              <Txt s={14} w="500">{l}</Txt>
              <Press label={l} onPress={() => setPick(pick === k ? null : k)} style={[st.input, { flexDirection: 'row', alignItems: 'center' }]}>
                <Txt s={14} c="#bbb" style={{ flex: 1 }}>{form[k]}</Txt><Icon name="chevron-down" size={20} />
              </Press>
              {pick === k && OPTIONS[k].map(o => (
                <Press key={o} label={o} onPress={() => { set(k)(o); setPick(null); }} style={{ paddingVertical: z(8), paddingHorizontal: z(12) }}><Txt s={14}>{o}</Txt></Press>
              ))}
            </View>
          ))}
          <Btn title="Lưu thay đổi" onPress={save} radius={10} h={42} style={{ marginTop: z(50), marginHorizontal: z(16) }} />
        </Scroll>
      </KeyboardAvoidingView>
    </Screen>
  );
}

// Thành tích / bảng xếp hạng (205:2583).
export function Achievements() {
  const nav = useNav();
  const store = useStore();
  const podium = [['Vũ Lê', 'av_girl_flag', 100], ['Chí Phước', 'av_nonla_big', 120], ['Bá Thiện', 'av_nonla_red', 90]];
  const rest = [[4, 'av_boy1', 90], [5, 'av_boy2', 89], [6, 'av_land', 85], [7, 'av_boy3', 80], [8, 'av_red', 76]];
  return (
    <Screen bg="#a5d6a7" topBg={C.green} light active="profile">
      <Scroll>
        <View style={st.achTop}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
            <Txt s={32} w="700" c={C.white} style={{ flex: 1, textAlign: 'center' }}>Thành tích</Txt>
            <Press label="Thông báo" onPress={() => nav.go('notifications')} style={st.bell}><Icon name="notifications-outline" size={18} /></Press>
          </View>
          <Img name="av_nonla_big" style={{ width: z(110), height: z(110), borderRadius: z(55), alignSelf: 'center', marginTop: z(2) }} />
          <Txt s={20} w="700" center style={{ marginTop: z(4) }}>{store.user.name}</Txt>
          <Txt s={16} c="#1f3d1f" center style={{ marginTop: z(8) }}>120/200 🍃</Txt>
          <View style={st.achTrack}><View style={{ width: '60%', height: '100%', borderRadius: z(15), backgroundColor: '#2e7d32' }} /></View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: z(30), marginTop: z(20) }}>
          {podium.map(([n, av, p], i) => (
            <View key={n} style={{ alignItems: 'center' }}>
              {i === 1 && <Txt s={22} style={{ marginBottom: z(-4) }}>👑</Txt>}
              <View style={[st.podium, i === 1 && { marginTop: 0 }, i !== 1 && { marginTop: z(26) }]}>
                <Img name={av} style={{ width: z(80), height: z(80), borderRadius: z(40) }} />
                <Txt s={15} style={{ marginTop: z(10) }}>{n}</Txt>
                <Txt s={15} style={{ marginTop: z(10) }}>{p}/200 🍃</Txt>
              </View>
            </View>
          ))}
        </View>
        <View style={st.board}>
          {rest.map(([rank, av, p]) => (
            <View key={rank} style={st.boardRow}>
              <Txt s={15} w="700" style={{ width: z(30) }}>{rank}</Txt>
              <Img name={av} style={{ width: z(42), height: z(42), borderRadius: z(21) }} />
              <Txt s={15} style={{ flex: 1, marginLeft: z(30) }}>Vũ Lê</Txt>
              <Txt s={15}>{p}/200 🍃</Txt>
            </View>
          ))}
        </View>
      </Scroll>
    </Screen>
  );
}

// Thông báo (205:2946) + vuốt để xóa (205:3261, 3344, 3413).
const NOTIS = [
  { id: 1, sec: 'Hôm nay, 30 tháng 10', ic: 'ic_recycle', text: 'Bạn vừa hoàn thành một lượt phân loại!', link: 'Nhấn để đổi thưởng', to: 'gifts', time: '8:00' },
  { id: 2, sec: 'Hôm nay, 30 tháng 10', ic: 'ic_camera', text: 'Hãy chụp ảnh rác để hệ thống nhận diện.', link: 'Tới thùng rác', to: 'scan', time: '16:00' },
  { id: 3, sec: 'Hôm qua, 29 tháng 10', ic: 'ic_voucher', text: 'Voucher tặng 10% cho ngày hôm nay.', link: 'Lấy mã giảm giá ngay', to: 'gifts', time: '10:00' },
  { id: 4, sec: 'Hôm trước, 28 tháng 10', ic: 'ic_recycle', text: 'Bạn vừa hoàn thành một lượt phân loại!', link: 'Nhấn để đổi thưởng', to: 'gifts', time: '12:00' },
  { id: 5, sec: 'Hôm trước, 28 tháng 10', ic: 'ic_warning', text: 'Lỗi  trong quá trình xử lí dữ liệu bạn ơi.', link: 'Nhấn để đổi thưởng', to: 'gifts', time: '22:00' },
  { id: 6, sec: 'Hôm trước, 28 tháng 10', ic: 'ic_voucher', text: 'Voucher tặng 10% cho ngày hôm nay.', link: 'Lấy mã giảm giá ngay', to: 'gifts', time: '9:00' },
];
const { width: W } = Dimensions.get('window');

export function Notifications() {
  const nav = useNav();
  const [items, setItems] = useState(NOTIS);
  const sections = [...new Set(NOTIS.map(n => n.sec))];
  return (
    <Screen bg={C.green} topBg={C.green} light active="profile" notch={C.green}>
      <GreenHeader title="Thông báo" right={<Press label="Thông báo cộng đồng" onPress={() => nav.go('communityNotifications')} style={{ padding: z(6) }}><Icon name="ellipsis-vertical" size={22} color={C.white} /></Press>} />
      <Scroll>
        {sections.map(sec => (
          <View key={sec}>
            <Txt s={15} w="600" style={{ marginLeft: z(30), marginTop: z(12), marginBottom: z(4) }}>{sec}</Txt>
            {items.filter(n => n.sec === sec).map(n => (
              <SwipeRow key={n.id} onDelete={() => setItems(list => list.filter(x => x.id !== n.id))}>
                <Press label={n.text} onPress={() => nav.go(n.to)} style={st.noti}>
                  <Img name={n.ic} style={{ width: z(46), height: z(46) }} mode="contain" />
                  <View style={{ flex: 1, marginLeft: z(10) }}>
                    <Txt s={15}>{n.text}</Txt>
                    <Txt s={15} c={C.greenDeep} style={{ textDecorationLine: 'underline', marginTop: z(2) }}>{n.link}</Txt>
                  </View>
                  <Txt s={15}>{n.time}</Txt>
                </Press>
              </SwipeRow>
            ))}
          </View>
        ))}
        {items.length === 0 && <Txt s={14} c={C.white} center style={{ marginTop: z(40) }}>Không còn thông báo nào.</Txt>}
      </Scroll>
    </Screen>
  );
}

function SwipeRow({ children, onDelete }) {
  const ref = useRef(null);
  return (
    <ScrollView ref={ref} horizontal showsHorizontalScrollIndicator={false} snapToOffsets={[0, z(80)]} decelerationRate="fast" contentContainerStyle={{ alignItems: 'center' }}>
      <View style={{ width: W, paddingHorizontal: z(30), paddingVertical: z(8) }}>{children}</View>
      <Press label="Xóa thông báo" onPress={onDelete} style={st.trash}><Icon name="trash" size={28} color={C.white} /></Press>
    </ScrollView>
  );
}

// Thông báo cộng đồng (205:3036).
export function CommunityNotifications() {
  const store = useStore();
  const rows = [
    ['Hôm nay', 'mdyn_05', ' đã thêm một tin vào bài đăng.', '14 phút', 'cn_thumb1'],
    ['Hôm nay', 'Gợi ý theo dõi: Thảo Nguyễn, Lưu Ly', ' và những người khác', '1 tiếng'],
    ['Hôm nay', 't_phuong', ' đã thêm một tin vào bài đăng.', '2 tiếng', 'cn_thumb2'],
    ['Hôm qua', 'bng_836', '(người bạn có thể biết) đang dùng app.', '10 tiếng', null, true],
    ['7 ngày qua', 'my_linh', '(người bạn có thể biết) đang dùng app.', '10 tiếng', null, true],
    ['7 ngày qua', 'linh_chi03', ' đã thêm một tin vào bài đăng.', '3 ngày', 'cn_thumb3'],
  ];
  let last = '';
  return (
    <Screen bg={C.white} topBg={C.green} light active="profile">
      <GreenHeader title="Thông báo" align="left" right={<Icon name="ellipsis-vertical" size={22} color={C.white} />} style={{ paddingBottom: z(20) }} />
      <Scroll contentStyle={{ paddingHorizontal: z(34) }}>
        {rows.map(([sec, user, text, time, thumb, follow], i) => {
          const head = sec !== last; last = sec;
          const on = store.following.includes(user);
          return (
            <View key={i}>
              {head && <Txt s={15} w="700" style={{ marginTop: z(18), marginBottom: z(10) }}>{sec}</Txt>}
              <View style={st.cnRow}>
                <Img name="av_nonla" style={{ width: z(52), height: z(52), borderRadius: z(26) }} />
                <View style={{ flex: 1, marginLeft: z(6) }}>
                  <Txt s={15}><Txt s={15} w="700">{user}</Txt>{text}</Txt>
                  <Txt s={12} c="#777" style={{ marginTop: z(12) }}>{time}</Txt>
                </View>
                {thumb && <Img name={thumb} style={{ width: z(48), height: z(56), borderRadius: z(6) }} />}
                {follow && (
                  <Press label="Theo dõi" onPress={() => store.update(s => ({ following: on ? s.following.filter(f => f !== user) : [...s.following, user] }))} style={[st.followBtn, on && { backgroundColor: '#bbb' }]}>
                    <Txt s={15} c={C.white}>{on ? 'Đã theo dõi' : 'Theo dõi'}</Txt>
                  </Press>
                )}
              </View>
            </View>
          );
        })}
      </Scroll>
    </Screen>
  );
}

// Tin nhắn (205:3119).
export function Messages() {
  const nav = useNav();
  return (
    <Screen nav={false}>
      <WhiteHeader title="Healing" size={32} />
      <Scroll pad={40}>
        <View style={st.meta}><View style={st.metaRing} /><Txt s={11} c="#999">Hỏi Meta AI hoặc tìm kiếm</Txt></View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: z(22), paddingHorizontal: z(26), paddingTop: z(30) }}>
          {[['av_nonla', 'Tâm trạng\nngày hôm nay?', 'Ghi chú của bạn'], ['av_girl_flag', 'Rất là vui', 'Vũ Lê'], ['av_red', null, 'Vũ Lê'], ['av_nonla', null, 'Vũ Lê']].map(([av, note, name], i) => (
            <View key={i} style={{ alignItems: 'center', width: z(80) }}>
              {note && <View style={st.note}><Txt s={11} center>{note}</Txt></View>}
              <Img name={av} style={{ width: z(80), height: z(80), borderRadius: z(40), marginTop: note ? z(-8) : z(38) }} />
              <Txt s={i ? 15 : 9} c={i ? C.black : '#999'} style={{ marginTop: z(2) }}>{name}</Txt>
            </View>
          ))}
        </ScrollView>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: z(26), marginTop: z(24), marginBottom: z(10) }}>
          <Txt s={13} w="700">Tin nhắn</Txt>
          <Press label="Trò chơi" onPress={() => nav.go('games')}><Txt s={13} w="700" c={C.green}>Trò chơi</Txt></Press>
        </View>
        {FRIENDS.map((f, i) => (
          <Press key={i} label={f.name} onPress={() => nav.go('chat', { avatar: f.avatar })} style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(22), height: z(90) }}>
            <Img name={f.avatar} style={{ width: z(70), height: z(70), borderRadius: z(35) }} />
            <View style={{ marginLeft: z(14) }}><Txt s={15}>{f.name}</Txt><Txt s={9} style={{ marginTop: z(8) }}>{f.status}</Txt></View>
          </Press>
        ))}
      </Scroll>
    </Screen>
  );
}

// Chat (205:3184) có bài viết chia sẻ (205:3212).
export function Chat() {
  const nav = useNav();
  const avatar = nav.route.params.avatar ?? 'av_red';
  const [text, setText] = useState('');
  const [msgs, setMsgs] = useState([['them', 'Xin chào, rất vui được làm quen'], ['me', 'Mình cũng rất vui'], ['me', 'Bạn thấy ứng dụng này có hay và hữu ích không nhỉ không chỉ giúp mình phân loại rác mà là như 1 mạng xã hội thu nhỏ vậy!'], ['post'], ['them-link', 'https://congdong.healing/links']]);
  const send = () => { if (!text.trim()) return; setMsgs(m => [...m, ['me', text.trim()]]); setText(''); };
  return (
    <Screen nav={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(16), height: z(64) }}>
          <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} /></Press>
          <Img name={avatar} style={{ width: z(52), height: z(52), borderRadius: z(26), marginLeft: z(6) }} />
          <View style={{ flex: 1, marginLeft: z(10) }}><Txt s={13} w="700">Vũ Lê</Txt><Txt s={13} style={{ marginTop: z(4) }}>8 phút trước</Txt></View>
          <Icon name="call-outline" size={22} /><View style={{ width: z(14) }} /><Icon name="videocam-outline" size={24} />
        </View>
        <ScrollView contentContainerStyle={{ paddingHorizontal: z(16), paddingBottom: z(20) }}>
          <View style={{ alignItems: 'center' }}>
            <Img name={avatar === 'av_red' ? 'av_red_big' : avatar} style={{ width: z(130), height: z(130), borderRadius: z(65), marginTop: z(20) }} />
            <Txt s={14} w="700" style={{ marginTop: z(10) }}>Vũ Lê</Txt>
            <Press label="Xem trang cá nhân" onPress={() => nav.go('achievements')} style={st.viewProfile}><Txt s={11}>Xem trang cá nhân</Txt></Press>
            <Txt s={13} style={{ marginTop: z(20) }}>3 thg11, 2025</Txt>
          </View>
          {msgs.map(([who, t], i) => {
            if (who === 'post') return (
              <View key={i} style={{ flexDirection: 'row', marginTop: z(16) }}>
                <Img name={avatar} style={st.chatAv} />
                <Press label="Bài viết" onPress={() => nav.go('community')} style={st.postCard}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(6) }}><Img name="av_healing_post" style={{ width: z(22), height: z(22), borderRadius: z(11) }} /><Txt s={8} w="700">Healing</Txt></View>
                  <Txt s={7} style={{ marginVertical: z(6) }}>Tôi vừa phân loại xong rác hôm nay!  Cảm giác thật nhẹ lòng 💚</Txt>
                  <View style={{ flexDirection: 'row', gap: z(4) }}>
                    <Img name="post_img1" style={{ width: z(96), height: z(96), borderRadius: z(6) }} />
                    <View style={{ gap: z(4) }}><Img name="post_img2" style={{ width: z(96), height: z(46), borderRadius: z(6) }} /><Img name="post_img3" style={{ width: z(96), height: z(46), borderRadius: z(6) }} /></View>
                  </View>
                  <Txt s={10} style={{ marginTop: z(6) }}>❤️ 100   💬 5   ✈️ 50</Txt>
                </Press>
              </View>
            );
            const me = who === 'me';
            return (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(16), justifyContent: me ? 'flex-end' : 'flex-start' }}>
                {who === 'them' && <Img name={avatar} style={st.chatAv} />}
                <View style={[me ? st.meBubble : who === 'them-link' ? st.linkBubble : null, who === 'them-link' && { marginLeft: z(64) }]}>
                  <Txt s={14} c={me ? C.white : C.black}>{t}</Txt>
                </View>
              </View>
            );
          })}
        </ScrollView>
        <View style={st.inputBar}>
          <View style={st.camBtn}><Icon name="camera" size={20} color={C.white} /></View>
          <TextInput value={text} onChangeText={setText} onSubmitEditing={send} placeholder="Nhắn tin..." placeholderTextColor="#999" style={{ flex: 1, fontSize: z(14), marginLeft: z(10) }} />
          {text ? <Press label="Gửi" onPress={send}><Icon name="send" size={22} color={C.green} /></Press> : (
            <View style={{ flexDirection: 'row', gap: z(8) }}>
              <Icon name="mic-outline" size={22} /><Icon name="image-outline" size={22} /><Icon name="document-text-outline" size={22} /><Icon name="add-circle-outline" size={22} />
            </View>
          )}
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const st = StyleSheet.create({
  headBtn: { position: 'absolute', top: z(14), width: z(44), height: z(44) },
  story: { width: z(230), height: z(64), borderRadius: z(32), backgroundColor: C.green, flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(10), ...shadow(4, 6, 0.25) },
  storyAv: { width: z(42), height: z(42), borderRadius: z(21), borderWidth: 1, borderColor: C.white },
  ptab: { height: z(38), borderRadius: z(20), backgroundColor: '#a5d6a7', paddingHorizontal: z(14), justifyContent: 'center' },
  tl: { flexDirection: 'row', alignItems: 'center', height: z(60), borderRadius: z(5), backgroundColor: '#e8f5e9', paddingHorizontal: z(10), marginTop: z(20) },
  searchCircle: { width: z(40), height: z(40), borderRadius: z(20), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  box: { backgroundColor: '#f2f2f2', borderRadius: z(30), marginTop: z(22), paddingHorizontal: z(18), paddingVertical: z(8) },
  setRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: z(8) },
  linkRow: { flexDirection: 'row', alignItems: 'center', height: z(56) },
  input: { marginTop: z(8), height: z(42), borderRadius: z(5), borderWidth: 1.5, borderColor: '#333', paddingHorizontal: z(12), fontSize: z(14), ...shadow(2, 3, 0.2), backgroundColor: C.white },
  achTop: { backgroundColor: C.green, borderBottomLeftRadius: z(40), borderBottomRightRadius: z(40), paddingHorizontal: z(16), paddingBottom: z(26) },
  bell: { width: z(28), height: z(28), borderRadius: z(14), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  achTrack: { alignSelf: 'center', marginTop: z(10), width: z(234), height: z(26), borderRadius: z(15), backgroundColor: '#a5d6a7', overflow: 'hidden' },
  podium: { width: z(108), height: z(190), borderRadius: z(30), borderWidth: 1, borderColor: '#222', alignItems: 'center', justifyContent: 'center' },
  board: { marginTop: z(24), marginHorizontal: z(20), borderRadius: z(20), backgroundColor: '#f6f6f6', paddingHorizontal: z(28), paddingVertical: z(10) },
  boardRow: { flexDirection: 'row', alignItems: 'center', height: z(76) },
  noti: { flexDirection: 'row', alignItems: 'center', minHeight: z(82), borderRadius: z(15), backgroundColor: '#f2f2f2', paddingHorizontal: z(8) },
  trash: { width: z(56), height: z(56), borderRadius: z(14), backgroundColor: '#c62828', alignItems: 'center', justifyContent: 'center', marginLeft: z(-10), marginRight: z(30) },
  cnRow: { flexDirection: 'row', alignItems: 'center', minHeight: z(78), borderRadius: z(15), backgroundColor: '#f2f2f2', paddingHorizontal: z(6), paddingVertical: z(8), marginBottom: z(16), gap: z(4) },
  followBtn: { backgroundColor: '#1f5bf0', borderRadius: z(6), paddingHorizontal: z(8), height: z(30), justifyContent: 'center' },
  meta: { flexDirection: 'row', alignItems: 'center', gap: z(10), marginHorizontal: z(22), height: z(50), borderRadius: z(25), backgroundColor: C.white, paddingHorizontal: z(18), ...shadow(4, 8, 0.25) },
  metaRing: { width: z(18), height: z(18), borderRadius: z(9), borderWidth: 2, borderColor: '#5b3fd0' },
  note: { backgroundColor: C.white, borderRadius: z(16), paddingHorizontal: z(8), paddingVertical: z(6), zIndex: 2, ...shadow(2, 6, 0.2) },
  viewProfile: { marginTop: z(8), borderWidth: 1, borderColor: '#ddd', borderRadius: z(6), paddingHorizontal: z(20), paddingVertical: z(8) },
  chatAv: { width: z(52), height: z(52), borderRadius: z(26), marginRight: z(12) },
  meBubble: { maxWidth: z(240), backgroundColor: C.green, borderRadius: z(15), paddingHorizontal: z(14), paddingVertical: z(8) },
  linkBubble: { backgroundColor: '#f0f0f0', borderRadius: z(15), paddingHorizontal: z(10), paddingVertical: z(8) },
  postCard: { width: z(210), borderRadius: z(6), backgroundColor: C.white, padding: z(6), ...shadow(2, 6, 0.25) },
  inputBar: { flexDirection: 'row', alignItems: 'center', margin: z(14), marginBottom: z(24), height: z(56), borderRadius: z(15), backgroundColor: '#f2f2f2', paddingHorizontal: z(8) },
  camBtn: { width: z(42), height: z(42), borderRadius: z(21), backgroundColor: '#2e7d32', alignItems: 'center', justifyContent: 'center' },
});
