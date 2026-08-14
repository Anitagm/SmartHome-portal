import { useEffect, useRef } from 'react';

const FLOWS = [
  { key: 'solarGrid', speed: 130 },
  { key: 'solarHome', speed: 145 },
  { key: 'gridHome', speed: 110 }
];

export default function EnergyDistributionDiagram({ values, mini = false }) {
  const svgRef = useRef(null);
  const pathRefs = useRef({});

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const dots = [];
    const active = [];

    FLOWS.forEach((f) => {
      const path = pathRefs.current[f.key];
      if (!path) return;

      const length = path.getTotalLength();
      const color = getComputedStyle(path).stroke;

      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '4.5');
      dot.setAttribute('fill', color);
      dot.classList.add('flow-dot');
      svg.appendChild(dot);
      dots.push(dot);

      active.push({ path, dot, length, speed: f.speed, dist: 0 });
    });

    let last = null;
    let raf;
    function tick(t) {
      if (last === null) last = t;
      const dt = (t - last) / 1000;
      last = t;

      active.forEach((f) => {
        f.dist += f.speed * dt;
        if (f.dist > f.length) f.dist -= f.length;
        const pt = f.path.getPointAtLength(f.dist);
        f.dot.setAttribute('cx', pt.x);
        f.dot.setAttribute('cy', pt.y);
      });

      raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      dots.forEach((d) => d.remove());
    };
  }, []);

  const cls = `ed-svg${mini ? ' ed-svg--mini' : ''}`;

  return (
    <svg ref={svgRef} viewBox="0 0 700 560" className={cls} xmlns="http://www.w3.org/2000/svg">
      <path ref={(el) => (pathRefs.current.solarGrid = el)} className="flow-path" d="M350,184 C350,228 90,228 90,272" stroke="var(--purple)" />
      <path ref={(el) => (pathRefs.current.solarHome = el)} className="flow-path" d="M350,184 C350,225 590,225 590,266" stroke="var(--amber)" />
      <path className="flow-path inactive" d="M350,184 L350,456" stroke="var(--green)" />
      <path ref={(el) => (pathRefs.current.gridHome = el)} className="flow-path" d="M138,320 L536,320" stroke="var(--accent)" />
      <path className="flow-path inactive" d="M90,368 C90,413.5 335,413.5 335,459" stroke="var(--text3)" />
      <path className="flow-path inactive" d="M580.6,373.2 C580.6,416.1 365,416.1 365,459" stroke="var(--green)" />
      <path className="flow-path inactive" d="M590,184 L590,266" stroke="var(--red)" />
      <path className="flow-path inactive" d="M590,374 L590,456" stroke="var(--teal)" />

      <g>
        <circle className="node-circle" cx="350" cy="140" r="44" stroke="var(--amber)"></circle>
        <text className="node-icon" x="350" y="120">☀️</text>
        <text className="node-value" x="350" y="145" fill="var(--amber)">{values.solar}</text>
        <text className="node-label" x="350" y="80">Solar</text>
      </g>

      <g>
        <circle className="node-circle" cx="590" cy="140" r="44" stroke="var(--red)"></circle>
        <text className="node-icon" x="590" y="120">🔥</text>
        <text className="node-value" x="590" y="145">{values.gas}</text>
        <text className="node-label" x="590" y="80">Gas</text>
      </g>

      <g>
        <circle className="node-circle" cx="90" cy="320" r="48" stroke="var(--accent)"></circle>
        <text className="node-value node-value--sm" x="90" y="309" fill="var(--accent)">← {values.gridIn}</text>
        <text className="node-value node-value--sm" x="90" y="331" fill="var(--purple)">→ {values.gridOut}</text>
        <text className="node-label" x="90" y="392">Grid</text>
      </g>

      <g>
        <circle className="node-circle" cx="590" cy="320" r="54" stroke="var(--accent)"></circle>
        <text className="node-icon" x="590" y="300">🏠</text>
        <text className="node-value" x="590" y="330">{values.home}</text>
      </g>

      <g>
        <circle className="node-circle" cx="350" cy="500" r="44" stroke="var(--green)"></circle>
        <text className="node-value node-value--sm" x="350" y="489" fill="var(--green)">↓ {values.battIn}</text>
        <text className="node-value node-value--sm" x="350" y="511" fill="var(--green)">↑ {values.battOut}</text>
        <text className="node-label" x="350" y="562">Battery</text>
      </g>

      <g>
        <circle className="node-circle" cx="590" cy="500" r="44" stroke="var(--teal)"></circle>
        <text className="node-icon" x="590" y="480">💧</text>
        <text className="node-value" x="590" y="505">{values.water}</text>
        <text className="node-label" x="590" y="562">Water</text>
      </g>
    </svg>
  );
}
