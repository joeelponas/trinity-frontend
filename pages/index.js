import { useState } from 'react';
import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/generate`,
        { prompt, userId: user?.id || null }
      );
      setImageUrl(res.data.imageUrl);
    } catch (err) {
      console.error(err);
      setError('Erreur lors de la génération');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Trinity Image Generator</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows={3}
          placeholder="Décris ton image publicitaire..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" disabled={loading || !prompt}>
          {loading ? 'Génération...' : 'Générer'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {imageUrl && (
        <div style={{ marginTop: '1rem' }}>
          <h2>Résultat :</h2>
          <img src={imageUrl} alt="Résultat" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </main>
  );
}
