import React, { useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Home,
  Bell,
  ChevronLeft,
  ArrowUpRight,
  Leaf,
  ScanLine,
  Store,
  UserRound,
  BookOpen,
  X,
  BatteryFull,
  Signal,
  Wifi,
  Recycle,
  Check,
  MapPin,
} from "lucide-react";
import "./style.css";

const groups = [
  {
    id: "plastic",
    label: "Nhựa",
    title: "Các loại rác thải nhựa phổ biến",
    emoji: "🧴",
    color: "#ef3340",
    items: [
      ["PET", "450 – 500 năm", "🧴", 60],
      ["HDPE", "500 – 1000 năm", "🧴", 76],
      ["PVC", "600 – 1000 năm", "🧪", 82],
      ["LDPE", "500 – 1000 năm", "🛍️", 87],
      ["PP", "250 – 500 năm", "🥡", 96],
    ],
    noteTitle: "Tóm tắt dễ hiểu",
    notes: [
      "Chai PET: 500 năm",
      "Nhựa PVC: 1.000 năm",
      "Túi nilon (LDPE): 400–1.000 năm",
      "PP, PS: 100–1.000 năm",
      "Nhựa tổng hợp tồn tại rất lâu trong tự nhiên.",
    ],
  },
  {
    id: "battery",
    label: "Pin",
    title: "Các loại Pin phổ biến",
    emoji: "🔋",
    color: "#22b8d7",
    items: [
      ["Zn + MnO₂", "100 – 500 năm", "🔋", 65],
      ["Zn + MnO₂ (kiềm)", "100 – 300 năm", "🔋", 72],
      ["Nickel + Cadmium", "500 – 1000 năm", "🪫", 83],
      ["Pb + H₂SO₄", "400 – 1000 năm", "🔋", 88],
      ["Lithium", "100 – 1000 năm", "🔋", 96],
    ],
    noteTitle: "Tóm tắt nhanh",
    notes: [
      "Pin tiểu thông thường: 100–500 năm",
      "Pin sạc (Ni-Cd, Li-ion): 500–1000 năm",
      "Ắc quy chì: 400–1000 năm, có thể lâu hơn.",
    ],
  },
  {
    id: "bags",
    label: "Ni lông",
    title: "Các loại Nilong phổ biến",
    emoji: "🛍️",
    color: "#795348",
    items: [
      ["Polyethylene (PE)", "100 – 500 năm", "🛍️", 63],
      ["Polyethylene TTC", "> 1000 năm", "🛍️", 75],
      ["PE", "1 – 5 năm", "🛍️", 85],
      ["100% từ tinh bột, mía, bã", "6 tháng – 1 năm", "🌽", 95],
    ],
    noteTitle: "Tác hại của túi nilong",
    notes: [
      "Ô nhiễm đất và nước",
      "Gây hại cho động vật",
      "Tạo vi nhựa trong môi trường",
      "Ô nhiễm không khí khi đốt",
    ],
  },
  {
    id: "medical",
    label: "Y tế",
    title: "Các Dụng cụ Y Tế phổ biến",
    emoji: "💉",
    color: "#d800f4",
    items: [
      ["Cao su", "100 – 300 năm", "🧤", 62],
      ["Nhựa PP, PE", "200 – 1000 năm", "🌡️", 73],
      ["Nhựa PET, PVC", "100 – 1000 năm", "💉", 85],
      ["Polypropylene", "100 – 1000 năm", "💊", 96],
    ],
    noteTitle: "Lưu ý khi phân loại rác y tế",
    notes: [
      "Dụng cụ có đầu nhọn, dịch, kim tiêm, bông băng → cần xử lý riêng (nhóm nguy hại).",
      "Dụng cụ bằng nhựa, thủy tinh sạch → có thể tái chế đúng quy trình.",
      "Không vứt rác y tế vào rác sinh hoạt thông thường.",
    ],
  },
];
function App() {
  const [page, setPage] = useState(location.hash.slice(1) || "home");
  const [modal, setModal] = useState(null);
  const [saved, setSaved] = useState(false);
  const group = groups.find((g) => g.id === page);
  function go(id) {
    setPage(id);
    location.hash = id;
    window.scrollTo(0, 0);
  }
  React.useEffect(() => {
    const onHash = () => setPage(location.hash.slice(1) || "home");
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  const learn = () =>
    setModal({
      title: `Thu hồi ${group.label.toLowerCase()}`,
      body: "Phân loại riêng, giữ khô và đóng gói gọn trước khi mang đến điểm thu gom. Không tự đốt hoặc chôn lấp.",
      collection: true,
    });
  return (
    <div className="workspace">
      <aside className="project-info">
        <div className="brand">
          <Leaf /> GreenLife
        </div>
        <h1>
          Một hành động nhỏ.
          <br />
          Một tương lai xanh.
        </h1>
        <p>
          Phân loại đúng để mỗi món đồ bỏ đi
          <br />
          bắt đầu một hành trình mới.
        </p>
        <div className="screen-menu">
          {[{ id: "home", label: "Trang chủ" }, ...groups].map((g, i) => (
            <button
              className={page === g.id ? "selected" : ""}
              key={g.id}
              onClick={() => go(g.id)}
            >
              <span>0{i + 1}</span>
              {g.label}
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
        <small>THIẾT KẾ VÌ MỘT CUỘC SỐNG XANH</small>
      </aside>
      <main className={"phone " + (group ? "detail" : "")}>
        <div className="status">
          <b>9:41</b>
          <span>
            <Signal size={13} />
            <Wifi size={13} />
            <BatteryFull size={18} />
          </span>
        </div>
        {group ? (
          <>
            <header className="detail-header">
              <button aria-label="Trở về trang chủ" onClick={() => go("home")}>
                <ChevronLeft size={23} />
              </button>
              <h1>{group.title}</h1>
            </header>
            <section className="detail-body">
              <div className="cards">
                {group.items.map(([name, time, emoji, progress], i) => (
                  <article className="material" key={name}>
                    <div
                      className={"material-art art-" + group.id}
                      style={{ "--turn": `${i % 2 ? 8 : -7}deg` }}
                    >
                      {emoji}
                    </div>
                    <div className="material-copy">
                      <h2>{name}</h2>
                      <p>{time}</p>
                      <div className="progress">
                        <span style={{ width: progress + "%" }} />
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              <section className="notes">
                <h2>
                  <Leaf size={17} /> {group.noteTitle}
                </h2>
                <ul>
                  {group.notes.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
                <p className="footnote">
                  Thời gian phân hủy mang tính tham khảo và phụ thuộc điều kiện
                  môi trường.
                </p>
              </section>
              <button
                className="collect"
                style={{ background: group.color }}
                onClick={learn}
              >
                <Recycle size={17} /> Tìm hiểu về {group.label}
              </button>
            </section>
          </>
        ) : (
          <>
            <header className="home-header">
              <div className="avatar">🌍</div>
              <div>
                <small>Chào buổi sáng,</small>
                <b>Hi, Hoàng</b>
              </div>
              <button
                className="points"
                onClick={() =>
                  setModal({
                    title: "Điểm xanh của bạn",
                    body: "Bạn có 0 điểm xanh. Hãy bắt đầu phân loại rác và tham gia các hoạt động thu gom để xây dựng thói quen sống xanh.",
                  })
                }
              >
                🌱 0 điểm
              </button>
              <button
                className="bell"
                aria-label="Thông báo"
                onClick={() =>
                  setModal({
                    title: "Thông báo",
                    body: "Chào mừng bạn đến GreenLife! Khám phá 4 nhóm rác để bắt đầu phân loại đúng ngay hôm nay.",
                  })
                }
              >
                <Bell size={19} />
                <i />
              </button>
            </header>
            <section className="hero">
              <div className="hero-text">
                <div className="eyebrow">SỐNG XANH MỖI NGÀY</div>
                <h1>
                  Phân loại hôm nay,
                  <br />
                  <em>Xanh mãi</em>
                  <br />
                  ngày mai
                </h1>
                <p>
                  Phân loại rác đúng cách.
                  <br />
                  Góp một chút xanh cho đời.
                </p>
                <div className="little-leaves">
                  🌿 <span>♻</span> 🌱
                </div>
                <button onClick={() => go("plastic")}>
                  Khám phá ngay <ArrowUpRight size={14} />
                </button>
              </div>
              <div className="hero-pictures">
                <div
                  className="photo photo-one"
                  role="img"
                  aria-label="Cây xanh trong thiên nhiên"
                />
                <div
                  className="photo photo-two"
                  role="img"
                  aria-label="Khu rừng xanh"
                />
                <div className="leaf-badge">
                  <Leaf size={25} />
                </div>
              </div>
            </section>
            <section className="categories">
              <div className="section-heading">
                <h2>Rác cần phân loại</h2>
                <button
                  onClick={() =>
                    setModal({ title: "Chọn nhóm rác", categories: true })
                  }
                >
                  Tất cả <ArrowUpRight size={12} />
                </button>
              </div>
              <div className="category-grid">
                {groups.map((g) => (
                  <button key={g.id} onClick={() => go(g.id)}>
                    <span className={"category-icon " + g.id}>{g.emoji}</span>
                    <b>{g.label}</b>
                  </button>
                ))}
              </div>
            </section>
            <button
              className="campaign"
              onClick={() =>
                setModal({
                  title: "Sống xanh từ những điều nhỏ",
                  body: "Mang theo bình nước cá nhân, dùng túi vải khi mua sắm và phân loại rác tại nhà. Chọn một thói quen nhỏ và thực hiện mỗi ngày!",
                  pledge: true,
                })
              }
            >
              <span className="campaign-tag">GREENLIFE CHALLENGE</span>
              <strong>Healing</strong>
              <span>Bảo vệ môi trường • Kiến tạo tương lai</span>
              <span className="campaign-link">
                Bắt đầu từ bạn <ArrowUpRight size={14} />
              </span>
            </button>
            <div className="home-tip">
              <Leaf size={19} />
              <p>
                <b>Bạn có biết?</b>
                <br />
                Một chai nhựa có thể mất đến 500 năm để phân hủy.
              </p>
            </div>
          </>
        )}
        <nav className="bottom-nav" aria-label="Điều hướng chính">
          <button
            className={page === "home" ? "active" : ""}
            aria-label="Trang chủ"
            onClick={() => go("home")}
          >
            <Home />
            <span>Trang chủ</span>
          </button>
          <button
            aria-label="Hướng dẫn phân loại"
            onClick={() =>
              setModal({ title: "Chọn nhóm rác", categories: true })
            }
          >
            <BookOpen />
            <span>Phân loại</span>
          </button>
          <button
            className="scan"
            aria-label="Hướng dẫn nhận diện rác"
            onClick={() =>
              setModal({
                title: "Nhận diện rác",
                body: "Quan sát ký hiệu trên bao bì: số 1 là PET, số 2 là HDPE, số 3 là PVC, số 4 là LDPE và số 5 là PP. Chọn nhóm rác bên dưới để xem hướng dẫn.",
                categories: true,
              })
            }
          >
            <ScanLine size={30} />
          </button>
          <button
            aria-label="Thu gom"
            onClick={() =>
              setModal({
                title: "Điểm thu gom",
                body: "Liên hệ đơn vị vệ sinh môi trường hoặc điểm thu hồi tại địa phương. Với pin và rác y tế, hãy chọn đơn vị có chức năng xử lý chuyên biệt.",
              })
            }
          >
            <Store />
            <span>Thu gom</span>
          </button>
          <button
            aria-label="Hồ sơ"
            onClick={() =>
              setModal({
                title: "Xin chào, Hoàng!",
                body: saved
                  ? "Bạn đã cam kết sống xanh. Cảm ơn bạn đã bắt đầu từ những hành động nhỏ!"
                  : "Cùng xây dựng thói quen phân loại rác mỗi ngày. Hãy tham gia thử thách ở trang chủ nhé.",
              })
            }
          >
            <UserRound />
            <span>Cá nhân</span>
          </button>
        </nav>
        <div className="home-indicator" />
        {modal && (
          <div className="modal-backdrop" onClick={() => setModal(null)}>
            <section
              className="modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="dialog-title"
            >
              <button
                autoFocus
                className="close"
                aria-label="Đóng"
                onClick={() => setModal(null)}
              >
                <X />
              </button>
              <div className="modal-leaf">
                <Leaf />
              </div>
              <h2 id="dialog-title">{modal.title}</h2>
              {modal.body && <p>{modal.body}</p>}
              {modal.categories && (
                <div className="modal-categories">
                  {groups.map((g) => (
                    <button
                      key={g.id}
                      onClick={() => {
                        go(g.id);
                        setModal(null);
                      }}
                    >
                      {g.emoji} {g.label}
                      <ArrowUpRight size={16} />
                    </button>
                  ))}
                </div>
              )}
              {modal.collection && (
                <p className="collection-note">
                  <MapPin size={20} /> Liên hệ điểm thu gom tại địa phương để
                  xác nhận loại rác được tiếp nhận.
                </p>
              )}
              {modal.pledge && (
                <button className="primary" onClick={() => setSaved(true)}>
                  {saved ? (
                    <>
                      <Check size={18} /> Đã cam kết sống xanh
                    </>
                  ) : (
                    "Tôi cam kết sống xanh"
                  )}
                </button>
              )}
              <button className="dismiss" onClick={() => setModal(null)}>
                Đã hiểu
              </button>
            </section>
          </div>
        )}
      </main>
      <div className="desktop-caption">
        <span /> {group ? group.title : "Trang chủ · GreenLife"}
      </div>
    </div>
  );
}
createRoot(document.getElementById("root")).render(<App />);
