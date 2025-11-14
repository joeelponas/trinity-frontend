import { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../utils/supabaseClient';

export default function History() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setError('Veuillez vous connecter.');
          setLoading(false);
          return;
        }
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/images`,
          { params: { userId: user.id } }
        );
        // depending on backend, res.data may be array or object with images property
        setImages(res.data.images || res.data || []);
      } catch (err) {
        console.error(err);
        setError('Erreur lors de la récupération des images');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <h1>Historique des images</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {images.length === 0 && !loading ? (
        <p>Aucune image.</p>
      ) : (
        <ul>
          {images.map((img, index) => (
            <li key={index} style={{ marginBottom: '1rem' }}>
              <img
                src={img.image_url || img.imageUrl || img}
                alt={`Image ${index}`}
                style={{ maxWidth: '100%' }}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
