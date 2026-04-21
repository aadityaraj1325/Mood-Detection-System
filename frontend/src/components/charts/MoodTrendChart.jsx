import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

function MoodTrendChart({ data = [] }) {
  return (
    <div className="card chart-card">
      <h3>Weekly Emotional Trend</h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(255,255,255,0.08)" />
          <XAxis dataKey="label" stroke="#7f8ea3" />
          <YAxis allowDecimals={false} stroke="#7f8ea3" />
          <Tooltip contentStyle={{ background: '#131c2a', border: '1px solid #3a4a61' }} />
          <Legend />
          <Line type="monotone" dataKey="happy" stroke="#35f3a2" strokeWidth={2} />
          <Line type="monotone" dataKey="neutral" stroke="#5da9ff" strokeWidth={2} />
          <Line type="monotone" dataKey="sad" stroke="#ff7f7f" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default MoodTrendChart;
