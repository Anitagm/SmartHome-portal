export default function RoomsGrid({ rooms, activeRoom, onSelectRoom, onToggleDevice }) {
  return (
    <div className="rooms-grid fade-up delay-3">
      {rooms.map((room) => (
        <div
          key={room.name}
          className={`room-card${activeRoom === room.name ? ' active-room is-active' : ''}`}
          tabIndex={0}
          onClick={() => onSelectRoom(room.name)}
        >
          <div className="room-bg" style={{ background: room.bg }}></div>
          <div className="room-icon" style={{ background: room.iconBg, fontSize: 20 }}>{room.icon}</div>
          <div className="room-name">{room.name}</div>
          <div className="room-temp">{room.temp} <span>/ {room.rh}</span></div>
          <div className="room-devices">
            {room.devices.map((d) => (
              <button
                key={d.label}
                type="button"
                className={`device-tag${d.on ? ' on' : ''}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleDevice(room.name, d.label);
                }}
              >
                <span className="dot"></span>{d.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
