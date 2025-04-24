
import { useState } from 'react';

export default function AdGenerator() {
  const [nicho, setNicho] = useState('Moda');
  const [produto, setProduto] = useState('');
  const [objetivo, setObjetivo] = useState('cliques');
  const [resultado, setResultado] = useState('');
  const [carregando, setCarregando] = useState(false);

  const gerarPrompt = () => `
Você é um especialista em marketing digital e copywriting. Crie um texto publicitário persuasivo, criativo e envolvente para um anúncio de Instagram.

Informações do produto:
- Produto/Serviço: ${produto}
- Nicho: ${nicho}
- Objetivo do anúncio: ${objetivo}

Instruções:
- Use técnicas de gatilhos mentais como escassez, prova social, autoridade, curiosidade ou urgência.
- O texto deve ter no máximo 300 caracteres.
- Comece com uma frase de impacto para chamar atenção.
- Inclua uma chamada para ação clara e direta no final.
- Use uma linguagem informal, moderna e voltada para o público do Instagram.
- Adicione emojis, se forem apropriados para o nicho.
- Evite termos genéricos como "incrível" ou "maravilhoso", seja específico e direto.

Formato esperado:
Texto único do anúncio, pronto para ser postado no Instagram.
`;

  const gerarAnuncio = async (e) => {
    e.preventDefault();
    setCarregando(true);
    setResultado('');

    try {
      const response = await fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'text-davinci-003',
          prompt: gerarPrompt(),
          max_tokens: 200,
          temperature: 0.7,
        }),
      });

      const data = await response.json();
      setResultado(data.choices[0].text.trim());
    } catch (err) {
      setResultado('❌ Ocorreu um erro. Verifique sua chave ou tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow-md">
      <h1 className="text-2xl font-bold text-indigo-600 text-center mb-4">Gerador de Anúncios IA</h1>
      <form onSubmit={gerarAnuncio} className="space-y-4">
        <div>
          <label className="block font-medium">Nicho:</label>
          <select value={nicho} onChange={(e) => setNicho(e.target.value)} className="w-full border p-2 rounded">
            <option>Moda</option>
            <option>Fitness</option>
            <option>Pet</option>
            <option>Culinária</option>
            <option>Beleza</option>
            <option>Tecnologia</option>
          </select>
        </div>

        <div>
          <label className="block font-medium">Produto ou Serviço:</label>
          <input
            type="text"
            placeholder="Descreva o que você está vendendo..."
            value={produto}
            onChange={(e) => setProduto(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Objetivo:</label>
          <select value={objetivo} onChange={(e) => setObjetivo(e.target.value)} className="w-full border p-2 rounded">
            <option value="vender">Vender Produtos</option>
            <option value="cliques">Gerar Cliques</option>
            <option value="seguidores">Ganhar Seguidores</option>
          </select>
        </div>

        <button
          type="submit"
          disabled={carregando}
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          {carregando ? 'Gerando...' : 'Gerar Anúncio'}
        </button>
      </form>

      {resultado && (
        <div className="mt-6 bg-indigo-50 p-4 rounded">
          <h3 className="font-bold text-indigo-800 mb-2">Resultado:</h3>
          <p>{resultado}</p>
        </div>
      )}
    </div>
  );
}
