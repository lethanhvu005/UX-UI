import React, { useState } from 'react';
import { Keyboard, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { C, z, shadow } from '../theme';
import { Btn, CloseX, Icon, Img, Overlay, Press, Screen, Scroll, Txt } from '../ui';
import { useNav, useStore } from '../nav';
import { FRIENDS } from '../data/content';
import { Loading } from './Scan';

const SEED = [
  { id: 'p1', name: 'Healing', avatar: 'av_healing_post', time: 'Just now', text: 'Tôi vừa phân loại xong rác hôm nay!  Cảm giác thật nhẹ lòng 💚', images: ['post_img1', 'post_img2', 'post_img3'], likes: 99 },
  { id: 'p2', name: 'Save', avatar: 'av_save', time: '10 mins ago', text: 'Tôi vừa phân loại xong rác hôm nay!  Cảm giác thật nhẹ lòng 💚', images: ['compose_1', 'compose_2'], likes: 42 },
];

// Cộng đồng (205:2846, đã thích 205:2680) + "Gửi đến" (205:16126).
export function Community() {
  const nav = useNav();
  const store = useStore();
  const [liked, setLiked] = useState({});
  const [share, setShare] = useState(false);
  const [sent, setSent] = useState([]);
  const [q, setQ] = useState('');
  const posts = [...store.posts, ...SEED].filter(p => p.text.toLowerCase().includes(q.toLowerCase()) || p.name.toLowerCase().includes(q.toLowerCase()));
  return (
    <Screen bg="#e9f5e6" topBg={C.green} light active="profile">
      <View style={st.head}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} color={C.white} /></Press>
          <Txt s={32} w="700" c={C.white} style={{ flex: 1, textAlign: 'center', marginLeft: z(40) }}>Cộng đồng</Txt>
          <Press label="Hoạt động yêu thích" onPress={() => nav.go('favorites')} style={st.headIcon}><Icon name="heart-outline" size={18} color={C.red} /></Press>
          <Press label="Thông báo cộng đồng" onPress={() => nav.go('communityNotifications')} style={[st.headIcon, { marginLeft: z(10) }]}><Icon name="analytics-outline" size={18} /></Press>
        </View>
        <TextInput value={q} onChangeText={setQ} placeholder="Tìm kiếm ...." placeholderTextColor="#333" style={st.search} />
      </View>
      <Scroll>
        <Press label="Tạo bài viết" onPress={() => nav.go('createPost')} style={st.composer}>
          <Img name="av_nonla" style={{ width: z(52), height: z(52), borderRadius: z(26) }} />
          <Txt s={15} w="700" style={{ flex: 1, marginLeft: z(12) }}>Hôm nay bạn nghĩ gì ?</Txt>
          <Icon name="image-outline" size={24} />
        </Press>
        {posts.map(p => {
          const isLiked = liked[p.id] ?? p.id === 'p1';
          return (
            <View key={p.id} style={st.post}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Img name={p.avatar} style={{ width: z(60), height: z(60), borderRadius: z(30) }} />
                <View style={{ flex: 1, marginLeft: z(12) }}><Txt s={16}>{p.name}</Txt><Txt s={14} style={{ marginTop: z(6) }}>{p.time}</Txt></View>
                <Icon name="ellipsis-vertical" size={24} />
              </View>
              {p.feeling ? <Txt s={13} c="#666" style={{ marginTop: z(6) }}>{p.feeling}</Txt> : null}
              <Txt s={14} style={{ marginTop: z(12) }}>{p.text}</Txt>
              {p.images.length > 0 && (
                <View style={{ flexDirection: 'row', gap: z(6), marginTop: z(14) }}>
                  <Img name={p.images[0]} style={{ flex: 1, height: z(148), borderRadius: z(10) }} />
                  {p.images.length > 1 && (
                    <View style={{ flex: 1.1, gap: z(4) }}>
                      {p.images.slice(1, 3).map(img => <Img key={img} name={img} style={{ flex: 1, borderRadius: z(10), minHeight: z(72) }} />)}
                    </View>
                  )}
                </View>
              )}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(18) }}>
                <Press label="Thích" onPress={() => setLiked(l => ({ ...l, [p.id]: !isLiked }))} style={st.action}>
                  <Icon name={isLiked ? 'heart' : 'heart-outline'} size={24} color={isLiked ? C.red : '#bbb'} /><Txt s={13}>{p.likes + (isLiked ? 1 : 0)}</Txt>
                </Press>
                <View style={st.action}><Icon name="chatbubble-ellipses-outline" size={22} /><Txt s={13}>5 Bình luận</Txt></View>
                <Press label="Chia sẻ" onPress={() => setShare(true)} style={st.action}><Icon name="paper-plane-outline" size={22} /><Txt s={13}>50</Txt></Press>
                <View style={{ flex: 1 }} />
                <Icon name="download-outline" size={22} />
              </View>
            </View>
          );
        })}
      </Scroll>
      <Overlay visible={share} onClose={() => setShare(false)} dim="rgba(255,255,255,0.4)">
        <View style={st.sendTo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Txt s={32} w="600" c={C.white}>Gửi đến</Txt>
            <CloseX onPress={() => setShare(false)} style={{ position: 'absolute', right: 0 }} />
          </View>
          {FRIENDS.map((f, i) => (
            <Press key={i} label={`Gửi cho ${f.name}`} onPress={() => setSent(s => s.includes(i) ? s : [...s, i])} style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(18), paddingHorizontal: z(60) }}>
              <Img name={f.avatar} style={{ width: z(70), height: z(70), borderRadius: z(35) }} />
              <View style={{ flex: 1, marginLeft: z(14) }}><Txt s={11} w="700">{f.name}</Txt><Txt s={9} style={{ marginTop: z(8) }}>{f.status}</Txt></View>
              {sent.includes(i) && <Icon name="checkmark-circle" size={22} color={C.white} />}
            </Press>
          ))}
        </View>
      </Overlay>
    </Screen>
  );
}

const PRIVACY = [['earth', 'Công khai', 'Tất cả mọi người có thể xem'], ['people', 'Bạn bè', 'Chỉ bạn bè của bạn có thể xem được'], ['lock-closed', 'Chỉ mình tôi', '']];
const FEELINGS = [['😊', 'Hạnh phúc'], ['😲', 'Bất ngờ'], ['🤭', 'Vui vẻ'], ['🥰', 'Yêu thương'], ['😋', 'Đáng yêu'], ['😟', 'Lo lắng'], ['😂', 'Bối rối'], ['😄', 'Vui vẻ'], ['😌', 'Chill'], ['😎', 'Ngầu']];
const PLACES = [['Đà Nẵng', 'Hải Châu, Đà Nẵng'], ['Đà Nẵng', 'Thanh Khê, Đà Nẵng'], ['Bãi biển Mỹ Khê', 'Đà Nẵng'], ['Cầu Rồng', 'Đà Nẵng']];
const GALLERY = Array.from({ length: 9 }, (_, i) => `gal_${i + 1}`);

// Tạo bài viết (205:10435) + popup Công khai / Cảm xúc / Check in / Ảnh (10658, 10940, 10807, 11360, 10658)
// + soạn bài (10478) + Loading (10538) + Đăng bài thành công (10597).
export function CreatePost() {
  const nav = useNav();
  const store = useStore();
  const [text, setText] = useState('');
  const [privacy, setPrivacy] = useState(0);
  const [feeling, setFeeling] = useState(null);
  const [place, setPlace] = useState(null);
  const [images, setImages] = useState([]);
  const [modal, setModal] = useState(null);
  const [pick, setPick] = useState([]);
  const [phase, setPhase] = useState('edit'); // edit | loading | done
  const [fq, setFq] = useState('');
  const [pq, setPq] = useState('');
  const canPost = text.trim() || images.length;
  const post = () => {
    if (!canPost) return;
    Keyboard.dismiss();
    setPhase('loading');
    setTimeout(() => {
      store.update(s => ({ posts: [{ id: `u${Date.now()}`, name: s.user.name, avatar: 'av_post', time: 'Vừa xong', text: text.trim() || '📷', images, likes: 0,
        feeling: [feeling && `đang cảm thấy ${FEELINGS[feeling][1]} ${FEELINGS[feeling][0]}`, place != null && `tại ${PLACES[place][0]}`].filter(Boolean).join(' ') }, ...s.posts] }));
      setPhase('done');
    }, 1500);
  };
  const editing = text.length > 0 || images.length > 0;
  return (
    <Screen bg={C.white} active="profile" dimNav={phase !== 'edit'} nav={!editing}>
      <LinearGradient colors={['#ffffff', '#ffffff', '#e5f5e3']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={StyleSheet.absoluteFill} />
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(18), height: z(64) }}>
        <Press label="Quay lại" onPress={nav.back} style={{ padding: z(4) }}><Icon name="chevron-back" size={24} /></Press>
        <Txt s={20} w="500" style={{ flex: 1, marginLeft: z(6) }}>Tạo bài viết</Txt>
        <Press label="Đăng" onPress={post} style={[st.postBtn, canPost && { backgroundColor: '#c62828' }]}><Txt s={16} w="600" c={C.white}>ĐĂNG</Txt></Press>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(20), marginTop: z(6) }}>
        <Img name="av_post" style={{ width: z(52), height: z(52), borderRadius: z(26) }} />
        <View style={{ marginLeft: z(12) }}>
          <Txt s={15} w="700">{store.user.name}{feeling != null ? <Txt s={13}> đang cảm thấy {FEELINGS[feeling][1]} {FEELINGS[feeling][0]}</Txt> : null}{place != null ? <Txt s={13}> tại {PLACES[place][0]}</Txt> : null}</Txt>
          <Press label="Quyền riêng tư" onPress={() => setModal('privacy')} style={st.privacy}>
            <Icon name={PRIVACY[privacy][0]} size={12} color={C.white} /><Txt s={12} w="600" c={C.white}>{PRIVACY[privacy][1]}</Txt><Icon name="caret-down" size={10} color={C.white} />
          </Press>
        </View>
      </View>
      <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingHorizontal: z(20), paddingBottom: z(30) }}>
        <TextInput value={text} onChangeText={setText} multiline placeholder="Hi, bạn đang nghĩ gì?......" placeholderTextColor="#777" style={{ fontSize: z(15), minHeight: z(90), marginTop: z(20), textAlignVertical: 'top' }} />
        {images.length > 0 && (
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: z(24) }}>
            {images.map(img => (
              <Press key={img} label="Bỏ ảnh" onPress={() => setImages(list => list.filter(i => i !== img))} style={st.picked}>
                <Img name={img} style={{ width: '100%', height: '100%', borderRadius: z(10) }} />
              </Press>
            ))}
            <Press label="Thêm ảnh" onPress={() => { setPick(images); setModal('gallery'); }} style={[st.picked, { backgroundColor: '#c4c4c4', alignItems: 'center', justifyContent: 'center' }]}>
              <Icon name="add-circle-outline" size={40} color="#555" />
            </Press>
          </View>
        )}
        {!editing && (
          <View style={{ marginTop: z(200) }}>
            <Txt s={16} w="700" c="#555" center>Thêm vào bài đăng của bạn</Txt>
            <View style={{ alignSelf: 'center' }}><Icon name="caret-down" size={16} color="#555" /></View>
            {[['po_photo', 'Ảnh/Video', 'gallery'], ['po_pin', 'Check in', 'checkin'], ['po_camera', 'Camera', 'gallery'], [null, 'Cảm xúc', 'feeling']].map(([ic, label, m]) => (
              <Press key={label} label={label} onPress={() => { setPick(images); setModal(m); }} style={st.option}>
                {ic ? <Img name={ic} style={{ width: z(32), height: z(30) }} mode="contain" /> : <Txt s={22}>😊</Txt>}
                <Txt s={16} style={{ marginLeft: z(12) }}>{label}</Txt>
              </Press>
            ))}
          </View>
        )}
      </ScrollView>
      {editing && (
        <View style={st.tools}>
          <Press label="Check in" onPress={() => setModal('checkin')}><Icon name="location" size={28} color="#c62828" /></Press>
          <Press label="Cảm xúc" onPress={() => setModal('feeling')}><Txt s={24}>😊</Txt></Press>
          <Press label="Ảnh" onPress={() => { setPick(images); setModal('gallery'); }}><Icon name="image" size={28} color={C.green} /></Press>
          <Press label="Camera" onPress={() => { setPick(images); setModal('gallery'); }}><Icon name="camera" size={28} color="#3f51b5" /></Press>
        </View>
      )}

      <Overlay visible={modal === 'privacy'} onClose={() => setModal(null)} dim="rgba(225,225,225,0.85)">
        <View style={st.sheet}>
          <CloseX onPress={() => setModal(null)} style={st.x} />
          <Txt s={20} w="700" center style={{ marginTop: z(24) }}>Ai có thể xem bài bài viết của bạn</Txt>
          {PRIVACY.map(([ic, t, d], i) => (
            <Press key={t} label={t} onPress={() => { setPrivacy(i); setModal(null); }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(26) }}>
              <View style={st.privIcon}><Icon name={ic} size={26} /></View>
              <View style={{ flex: 1, marginLeft: z(16) }}><Txt s={15}>{t}</Txt>{d ? <Txt s={11} style={{ marginTop: z(4) }}>{d}</Txt> : null}</View>
              <View style={[st.radio, privacy === i && { borderColor: C.black }]}>{privacy === i && <View style={st.radioOn} />}</View>
            </Press>
          ))}
        </View>
      </Overlay>

      <Overlay visible={modal === 'feeling'} onClose={() => setModal(null)} dim="rgba(225,225,225,0.85)">
        <View style={[st.sheet, { maxHeight: z(520) }]}>
          <CloseX onPress={() => setModal(null)} style={st.x} />
          <Txt s={18} w="700" center style={{ marginTop: z(30) }}>Bạn đang cảm thấy thế nào?</Txt>
          <View style={st.innerSearch}><Icon name="search-outline" size={20} color="#999" /><TextInput value={fq} onChangeText={setFq} placeholder="Tìm kiếm.." placeholderTextColor="#999" style={{ flex: 1, fontSize: z(14) }} /></View>
          <ScrollView style={{ marginTop: z(10) }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
              {FEELINGS.map(([e, t], i) => t.toLowerCase().includes(fq.toLowerCase()) && (
                <Press key={i} label={t} onPress={() => { setFeeling(i); setModal(null); }} style={{ width: '50%', flexDirection: 'row', alignItems: 'center', paddingVertical: z(10) }}>
                  <View style={st.emoji}><Txt s={24}>{e}</Txt></View>
                  <Txt s={15} w="600" style={{ marginLeft: z(14) }}>{t}</Txt>
                </Press>
              ))}
            </View>
          </ScrollView>
        </View>
      </Overlay>

      <Overlay visible={modal === 'checkin'} onClose={() => setModal(null)} dim="rgba(225,225,225,0.85)">
        <View style={st.sheet}>
          <CloseX onPress={() => setModal(null)} style={st.x} />
          <Txt s={18} w="700" center style={{ marginTop: z(30) }}>Bạn đang ở đâu?</Txt>
          <View style={st.innerSearch}><Icon name="search-outline" size={20} color="#999" /><TextInput value={pq} onChangeText={setPq} placeholder="Bạn đang ở đâu?" placeholderTextColor="#999" style={{ flex: 1, fontSize: z(15) }} /></View>
          <Txt s={15} w="700" style={{ marginTop: z(26) }}>Đề xuất 1 vài địa điểm</Txt>
          {PLACES.map(([n, d], i) => `${n} ${d}`.toLowerCase().includes(pq.toLowerCase()) && (
            <Press key={i} label={n} onPress={() => { setPlace(i); setModal(null); }} style={{ flexDirection: 'row', alignItems: 'center', marginTop: z(18) }}>
              <View style={st.emoji}><Icon name="location" size={22} color="#d32f2f" /></View>
              <View style={{ marginLeft: z(14) }}><Txt s={15} w="600">{n}</Txt><Txt s={11} style={{ marginTop: z(4) }}>{d}</Txt></View>
            </Press>
          ))}
        </View>
      </Overlay>

      <Overlay visible={modal === 'gallery'} onClose={() => setModal(null)} dim="rgba(225,225,225,0.85)">
        <View style={[st.sheet, { paddingHorizontal: 0, paddingBottom: 0, overflow: 'hidden' }]}>
          <CloseX onPress={() => setModal(null)} style={st.x} />
          <Txt s={18} w="700" center style={{ marginTop: z(30) }}>Chọn ảnh từ thư viện</Txt>
          <Press label="Chọn nhiều file" onPress={() => { setImages(pick.length ? pick : GALLERY.slice(4, 6)); setModal(null); }} style={st.multi}>
            <Icon name="images" size={18} color={C.green} /><Txt s={11}>{pick.length ? `Xong (${pick.length})` : 'Chọn nhiều file'}</Txt>
          </Press>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: z(12) }}>
            {GALLERY.map(img => {
              const on = pick.includes(img);
              return (
                <Press key={img} label="Ảnh" onPress={() => setPick(p => on ? p.filter(x => x !== img) : [...p, img])} style={{ width: '33.33%', aspectRatio: 1, padding: 1 }}>
                  <Img name={img} style={{ width: '100%', height: '100%' }} />
                  <View style={[st.check, on && { backgroundColor: C.green }]}>{on && <Icon name="checkmark" size={12} color={C.white} />}</View>
                </Press>
              );
            })}
          </View>
        </View>
      </Overlay>

      <Overlay visible={phase !== 'edit'} onClose={() => {}} dim="rgba(220,220,220,0.6)">
        {phase === 'loading' ? <Loading style={{ backgroundColor: '#e8f5e3' }} /> : (
          <View style={st.success}>
            <View style={st.okCircle}><Icon name="checkmark" size={44} color={C.white} /></View>
            <Txt s={15} c="#333" style={{ marginTop: z(20) }}>Đăng bài thành công</Txt>
            <Btn title="Trở về Home" onPress={() => nav.reset('home')} h={48} s={14} w="600" bg="#4caf50" style={{ marginTop: z(36), width: z(182) }} />
            <Press label="Xem bài viết" onPress={() => nav.replace('community')} style={{ marginTop: z(14) }}><Txt s={13} c={C.green}>Xem trong Cộng đồng</Txt></Press>
          </View>
        )}
      </Overlay>
    </Screen>
  );
}

const st = StyleSheet.create({
  head: { backgroundColor: C.green, paddingHorizontal: z(16), paddingBottom: z(20), borderBottomLeftRadius: z(30), borderBottomRightRadius: z(30) },
  headIcon: { width: z(30), height: z(30), borderRadius: z(15), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  search: { marginTop: z(24), marginHorizontal: z(6), height: z(54), borderRadius: z(15), backgroundColor: C.white, paddingHorizontal: z(16), fontSize: z(13), ...shadow(4, 8, 0.25) },
  composer: { flexDirection: 'row', alignItems: 'center', marginTop: z(20), backgroundColor: C.white, height: z(70), paddingHorizontal: z(24), borderRadius: z(15), ...shadow(4, 6, 0.2) },
  post: { backgroundColor: C.white, marginTop: z(16), padding: z(24), paddingBottom: z(16), borderRadius: z(15), ...shadow(4, 6, 0.2) },
  action: { flexDirection: 'row', alignItems: 'center', gap: z(4), marginRight: z(30) },
  sendTo: { width: z(346), borderRadius: z(20), backgroundColor: '#a5d6a7', paddingHorizontal: z(16), paddingVertical: z(20) },
  postBtn: { backgroundColor: '#c4c4c4', height: z(36), borderRadius: z(20), paddingHorizontal: z(20), justifyContent: 'center' },
  privacy: { flexDirection: 'row', alignItems: 'center', gap: z(4), backgroundColor: '#3a3a3a', borderRadius: z(3), paddingHorizontal: z(6), paddingVertical: z(2), marginTop: z(4), alignSelf: 'flex-start' },
  option: { flexDirection: 'row', alignItems: 'center', height: z(48), borderWidth: 1, borderColor: '#ddd', backgroundColor: C.white, paddingHorizontal: z(10), marginTop: z(18) },
  picked: { width: z(160), height: z(132), borderRadius: z(10), borderWidth: 2, borderColor: '#2e7d32' },
  tools: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: z(56), borderTopWidth: 1, borderTopColor: '#eee', backgroundColor: C.white },
  sheet: { width: z(376), borderRadius: z(20), backgroundColor: C.white, padding: z(22), ...shadow(4, 10, 0.25) },
  x: { position: 'absolute', right: z(16), top: z(16) },
  privIcon: { width: z(50), height: z(50), borderRadius: z(25), backgroundColor: '#e2e2e2', alignItems: 'center', justifyContent: 'center' },
  radio: { width: z(28), height: z(28), borderRadius: z(14), borderWidth: 2, borderColor: '#999', alignItems: 'center', justifyContent: 'center' },
  radioOn: { width: z(18), height: z(18), borderRadius: z(9), backgroundColor: '#1b5e20' },
  innerSearch: { flexDirection: 'row', alignItems: 'center', gap: z(10), marginTop: z(22), height: z(48), borderRadius: z(8), borderWidth: 1, borderColor: '#ddd', paddingHorizontal: z(14) },
  emoji: { width: z(46), height: z(46), borderRadius: z(23), backgroundColor: '#c8c8c8', alignItems: 'center', justifyContent: 'center' },
  multi: { alignSelf: 'flex-end', marginRight: z(12), marginTop: z(16), flexDirection: 'row', alignItems: 'center', gap: z(8), backgroundColor: '#e0f2dc', borderRadius: z(6), paddingHorizontal: z(12), paddingVertical: z(8) },
  check: { position: 'absolute', right: z(6), top: z(6), width: z(18), height: z(18), borderRadius: z(9), borderWidth: 1, borderColor: C.white, alignItems: 'center', justifyContent: 'center' },
  success: { width: z(258), borderRadius: z(20), backgroundColor: '#e8f5e3', alignItems: 'center', paddingVertical: z(40) },
  okCircle: { width: z(76), height: z(76), borderRadius: z(38), backgroundColor: '#4caf50', alignItems: 'center', justifyContent: 'center' },
});
