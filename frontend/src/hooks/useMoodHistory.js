import { useEffect, useState } from 'react';
import { getHistory } from '../services/moodService';

export function useMoodHistory(limit = 30) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);
        setError('');
        const data = await getHistory(limit);
        if (mounted) {
          setItems(data.items || []);
        }
      } catch {
        if (mounted) {
          setError('Unable to load mood history right now.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [limit]);

  return { items, loading, error };
}
