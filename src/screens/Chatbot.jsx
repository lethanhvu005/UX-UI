import React, { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { C, z, shadow } from '../theme';
import { Icon, Img, Overlay, Press, Txt } from '../ui';
import { useNav } from '../nav';

// RecycleBot (205:4065, 205:4112) + hộp thoại ghi âm "Listening..." (205:4402).
const ANSWERS = [
  [/nhựa/i, 'Rác nhựa: rửa sạch, làm khô rồi bỏ vào thùng tái chế. Chai PET (số 1) và HDPE (số 2) tái chế tốt nhất. ♻️'],
  [/pin/i, 'Pin cũ là rác nguy hại: dán băng keo hai đầu, gom riêng và mang đến điểm thu gom pin hoặc cửa hàng điện tử. 🔋'],
  [/nguy hại|y tế|kim tiêm/i, 'Rác nguy hại (pin, bóng đèn, hóa chất, kim tiêm) phải để riêng trong túi kín và giao cho điểm thu gom chuyên biệt. ⚠️'],
  [/tấn|bao nhiêu/i, 'Một ngày thế giới phải gánh chịu khoảng 11 triệu tấn rác thải từ nhiều loại khác nhau.'],
];
const INITIAL = [
  ['bot', 'Chào bạn! Mình là RecycleBot,mình có thể giúp gì cho bạn vậy ?'],
  ['me', 'Một ngày thế giới phải gánh chịu bao nhiêu tấn rác thải thế ?'],
  ['bot', 'Một ngày thế giới phải gánh chịu 11 tấn rác thải từ nhiều loại khác nhau'],
];
const SUGGEST = ['phân loại rác nhựa', 'xử lý pin củ', 'rác nguy hại'];

export function Chatbot() {
  const nav = useNav();
  const [messages, setMessages] = useState(INITIAL);
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const scroll = useRef(null);
  const send = (value, voice) => {
    const q = (value ?? text).trim();
    if (!q && !voice) return;
    const answer = ANSWERS.find(([re]) => re.test(q))?.[1] ?? 'Mình chưa rõ câu hỏi, bạn thử hỏi về rác nhựa, pin hoặc rác nguy hại nhé! 🌱';
    setMessages(m => [...m, voice ? ['voice', ''] : ['me', q]]);
    setText('');
    setTimeout(() => setMessages(m => [...m, ['bot', voice ? ANSWERS[0][1] : answer]]), 600);
  };
  useEffect(() => { setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50); }, [messages]);
  return (
    <View style={{ flex: 1 }}>
      <StatusBar style="dark" />
      <Img name="chat_bg" style={StyleSheet.absoluteFill} />
      <SafeAreaView edges={['top']} style={st.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: z(19), height: z(70) }}>
          <View style={st.botRing}><Img name="bot_avatar" style={{ width: z(44), height: z(44), borderRadius: z(22) }} /></View>
          <Txt s={20} w="700" style={{ flex: 1, marginLeft: z(14) }}>RecycleBot</Txt>
          <Press label="Đóng" onPress={nav.back} style={st.close}><Icon name="close" size={20} /></Press>
        </View>
      </SafeAreaView>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView ref={scroll} contentContainerStyle={{ padding: z(19), gap: z(30) }}>
          {messages.map(([who, msg], i) => (
            <View key={i} style={[st.bubble, who === 'bot' ? st.bot : st.me]}>
              {who === 'voice' ? <Wave /> : <Txt s={15} c={who === 'bot' ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.9)'} style={{ lineHeight: z(19) }}>{msg}</Txt>}
            </View>
          ))}
        </ScrollView>
        <SafeAreaView edges={['bottom']} style={{ paddingHorizontal: z(16), paddingBottom: z(10) }}>
          <View style={{ flexDirection: 'row', gap: z(10), marginBottom: z(14), justifyContent: 'space-between' }}>
            {SUGGEST.map(sg => (
              <Press key={sg} label={sg} onPress={() => send(sg)} style={st.chip}><Txt s={12} c="rgba(0,0,0,0.5)">{sg}</Txt></Press>
            ))}
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(12) }}>
            <View style={st.input}>
              <TextInput value={text} onChangeText={setText} onSubmitEditing={() => send()} placeholder="Tôi có thể giúp gì cho bạn" placeholderTextColor="rgba(0,0,0,0.5)" style={{ flex: 1, fontSize: z(15), color: C.black }} />
            </View>
            <Press label="Ghi âm" onPress={() => setListening(true)} style={st.round}><Icon name="mic-outline" size={22} color={C.white} /></Press>
            <Press label="Gửi" onPress={() => send()} style={st.round}><Icon name="paper-plane-outline" size={22} color={C.white} /></Press>
          </View>
        </SafeAreaView>
      </KeyboardAvoidingView>
      <Listening visible={listening} onClose={() => setListening(false)} onStop={() => { setListening(false); send('', true); }} />
    </View>
  );
}

function Wave({ color = '#111', count = 36, height = 22 }) {
  const bars = useRef(Array.from({ length: count }, () => 0.3 + Math.random() * 0.7)).current;
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: z(2.5), height: z(height) }}>
      {bars.map((h, i) => <View key={i} style={{ width: z(2), height: z(height) * h, backgroundColor: color, borderRadius: 1 }} />)}
      <Icon name="play" size={18} color={C.white} />
    </View>
  );
}

export function Listening({ visible, onClose, onStop }) {
  const pulse = useRef(new Animated.Value(1)).current;
  const [active, setActive] = useState(true);
  useEffect(() => {
    if (!visible || !active) return;
    const loop = Animated.loop(Animated.sequence([
      Animated.timing(pulse, { toValue: 1.08, duration: 500, useNativeDriver: true }),
      Animated.timing(pulse, { toValue: 1, duration: 500, useNativeDriver: true }),
    ]));
    loop.start();
    return () => loop.stop();
  }, [visible, active]);
  return (
    <Overlay visible={visible} onClose={onClose}>
      <View style={st.listen}>
        <Press label="Đóng" onPress={onClose} style={{ position: 'absolute', right: z(16), top: z(14) }}><Icon name="close" size={30} /></Press>
        <Animated.View style={[st.mic, { transform: [{ scale: pulse }] }]}><Icon name="mic-outline" size={80} color={C.white} /></Animated.View>
        <Txt s={30} w="700" style={{ marginTop: z(16) }}>Listening...</Txt>
        <View style={{ marginTop: z(20) }}><Wave count={28} height={36} color={active ? C.black : '#aaa'} /></View>
        <View style={{ flexDirection: 'row', gap: z(32), marginTop: z(24) }}>
          <Press label="Start" onPress={() => setActive(true)} style={[st.lBtn, { backgroundColor: C.green }]}><Txt s={22} w="600">Start</Txt></Press>
          <Press label="Stop" onPress={onStop} style={[st.lBtn, { backgroundColor: '#d9d9d9' }]}><Txt s={22} w="600">Stop</Txt></Press>
        </View>
      </View>
    </Overlay>
  );
}

const st = StyleSheet.create({
  header: { backgroundColor: 'rgba(222,240,216,0.8)' },
  botRing: { width: z(50), height: z(50), borderRadius: z(25), backgroundColor: '#cbe7b4', alignItems: 'center', justifyContent: 'center' },
  close: { width: z(30), height: z(30), borderRadius: z(15), backgroundColor: C.white, alignItems: 'center', justifyContent: 'center' },
  bubble: { maxWidth: z(306), borderRadius: z(20), paddingHorizontal: z(13), paddingVertical: z(7) },
  bot: { alignSelf: 'flex-start', backgroundColor: '#cbe7b4' },
  me: { alignSelf: 'flex-end', backgroundColor: '#97bce6' },
  chip: { height: z(36), borderRadius: z(20), backgroundColor: '#cbe7b4', paddingHorizontal: z(22), justifyContent: 'center' },
  input: { flex: 1, height: z(43), borderRadius: z(20), backgroundColor: C.white, borderWidth: 0.5, borderColor: '#7f7f7f', paddingHorizontal: z(12), justifyContent: 'center' },
  round: { width: z(44), height: z(44), borderRadius: z(22), backgroundColor: '#2f7a33', alignItems: 'center', justifyContent: 'center' },
  listen: { width: z(428), maxWidth: '100%', backgroundColor: C.white, borderRadius: z(20), alignItems: 'center', paddingVertical: z(36) },
  mic: { width: z(180), height: z(180), borderRadius: z(90), backgroundColor: C.green, alignItems: 'center', justifyContent: 'center' },
  lBtn: { width: z(162), height: z(58), borderRadius: z(30), alignItems: 'center', justifyContent: 'center', ...shadow(2, 4, 0.15) },
});
