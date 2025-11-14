import { useState } from 'react';
import axios from 'axios';

export default function History() {
  const [userId, setUserId] = useState('');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/images`,
        {
          params: { userId },
        }
      );
      setImages(res.data.images || []);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la récupération');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Historique des images</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Ton userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem' }}
        />
        <button type="submit" disabled={loading || !userId}>
          {loading ? 'Chargement...' : 'Afficher'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div style={{ marginTop: '1rem' }}>
        {images.length === 0 && !loading ? (
          <p>Aucune image.</p>
        ) : (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img.image_url || img.imageUrl || img}
              alt="Historique"
              style={{ maxWidth: '100%', marginBottom: '1rem' }}
            />
          ))
        )}
      </div>
    </main>
  );
}
