// Dữ liệu 4 nhóm rác theo các màn hình "Các loại … phổ biến" trong Figma.
// items: [tên, thời gian phân hủy, ảnh, % thanh tiến độ]
export const groups = [
  {
    id: 'plastic',
    label: 'Nhựa',
    title: 'Các loại rác thải nhựa phổ biến',
    emoji: '🌍',
    color: '#e92030',
    items: [
      ['PET', '450 - 500 năm', 'pl_pet', 20],
      ['HDPE', '500 - 1000 năm', 'pl_hdpe', 40],
      ['PVC', '600 - 1000 năm', 'pl_pvc', 60],
      ['LDPE', '400 - 1000 năm', 'pl_ldpe', 80],
      ['PP', '250 - 500 năm', 'pl_pp', 100],
    ],
    noteTitle: '🌍 Tóm tắt dễ hiểu',
    notes: [
      '🧃 Chai PET: 500 năm',
      '🛢️ HDPE, PVC: ~1000 năm',
      '🛍️ Túi nilon (LDPE): 400–1000 năm',
      '🧁 PP, PS: 250–1000 năm',
      '⚠️ Nhựa hỗn hợp (Other): có thể tồn tại hơn 1000 năm',
    ],
  },
  {
    id: 'battery',
    label: 'Pin',
    title: 'Các loại Pin phổ biến',
    emoji: '⚡',
    color: '#2cb5d9',
    items: [
      ['Zn + MnO₂', '100 - 500 năm', 'bat_4', 20],
      ['Zn + MnO₂ (kiềm)', '100 - 300 năm', 'bat_5', 40],
      ['Nickel + Cadmium', '500 - 1000 năm', 'bat_2', 60],
      ['Pb + H₂SO₄', '400 - 1000 năm', 'bat_6', 80],
      ['Lithium', '100 - 1000 năm', 'bat_1', 100],
    ],
    noteTitle: '⚡ Tóm tắt nhanh',
    notes: [
      '🔋 Pin tiểu thông thường: 100–500 năm',
      '🔋 Pin sạc (Ni-Cd, Li-ion): 500–1000 năm',
      '⚠️ Ắc quy chì: >1000 năm, độc hại nhất',
    ],
  },
  {
    id: 'bags',
    label: 'Ni lông',
    title: 'Các loại Nilong phổ biến',
    emoji: '🧬',
    color: '#6d4038',
    items: [
      ['Polyethylene (PE)', '100 - 500 năm', 'pl_ldpe', 20],
      ['Polyethylene TTC', '> 1000 năm', 'nil_5', 40],
      ['PE', '2 - 5 năm', 'nil_2', 60],
      ['100% từ tinh bột, mía, bắp', '6 tháng - 1 năm', 'nil_6', 100],
    ],
    noteTitle: '🧬 Tác hại của túi nilon',
    notes: [
      'Ô nhiễm đất và nước',
      'Gây hại cho động vật',
      'Tạo vi nhựa (microplastic)',
      'Ô nhiễm không khí',
    ],
  },
  {
    id: 'medical',
    label: 'Y tế',
    title: 'Các Dụng cụ Y Tế phổ biến',
    emoji: '⚠️',
    color: '#d61ee8',
    items: [
      ['Cao su', '450 - 500 năm', 'med_1', 20],
      ['Nhựa PP, PE', '500 - 1000 năm', 'med_4', 40],
      ['Nhựa PET, PVC', '600 - 1000 năm', 'med_3', 60],
      ['Polypropylene', '400 - 1000 năm', 'med_6', 80],
    ],
    noteTitle: '⚠️ Lưu ý khi phân loại rác y tế',
    notes: [
      'Dụng cụ có dính máu, dịch, kim tiêm, bông băng → rác lây nhiễm (thùng màu vàng).',
      'Dụng cụ bằng nhựa, thủy tinh sạch → có thể tái chế (thùng màu xanh).',
      'Dụng cụ chứa hóa chất, thuốc, pin, thủy ngân → rác nguy hại (thùng màu đỏ hoặc đen).',
    ],
  },
];

// Nút cuối trang dẫn sang nhóm tiếp theo (đúng như thiết kế).
export const nextGroup = {
  plastic: { to: 'battery', label: 'Tìm hiểu về Pin', icon: 'home_rectangle255' },
  battery: { to: 'bags', label: 'Tìm hiểu về Nilong', icon: 'home_rectangle258' },
  bags: { to: 'medical', label: 'Tìm hiểu về Dc Y Tế', icon: 'nil_4' },
  medical: { to: 'plastic', label: 'Tìm hiểu về rác thải nhựa', icon: 'home_rectangle9' },
};
