import { Dimensions, Platform } from 'react-native';

// Thiết kế Figma dùng khung iPhone 14 Plus rộng 428pt. z() quy đổi kích thước theo màn hình thật.
const { width } = Dimensions.get('window');
const scale = Platform.OS === 'web' ? width / 428 : Math.min(width, 480) / 428;
export const z = n => Math.round(n * scale * 10) / 10;

export const C = {
  green: '#58b05c',
  greenDark: '#4c862d',
  greenDeep: '#2e7d32',
  greenNav: '#3c9440',
  greenText: '#255d28',
  greenLight: '#edf8e8',
  greenSoft: '#d9efde',
  greenPale: '#e8f5e9',
  lime: '#5f9e00',
  navy: '#1a3f76',
  blue: '#2d528b',
  white: '#ffffff',
  black: '#000000',
  text: '#1e1e1e',
  grey: '#7f7f7f',
  greyLight: '#dadada',
  red: '#e92030',
  yellow: '#facd49',
  bg: '#fdfdfd',
};

export const shadow = (y = 4, blur = 4, opacity = 0.25) => Platform.select({
  ios: { shadowColor: '#000', shadowOffset: { width: 0, height: y }, shadowOpacity: opacity, shadowRadius: blur / 2 },
  default: { elevation: Math.max(1, Math.round(blur / 1.5)) },
});
