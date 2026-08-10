const { InferenceClient } = require("@huggingface/inference");

const MODELO = "black-forest-labs/FLUX.1-Kontext-dev";

function montarPrompt(opcoes) {
  return `Transform this photo into a realistic collectible action figure toy, still inside its packaging box.

Figure details:
- Name printed on the box: "${opcoes.nome}"
- Title/profession printed on the box: "${opcoes.profissao}"
- Outfit: ${opcoes.roupa}
- Accessories displayed beside the figure (in separate compartments): ${opcoes.acessorios.join(", ")}
- Box color/theme: ${opcoes.corCaixa}

The box must look like a real toy store product: clear plastic window in front, cardboard backing, the person's face and features preserved and recognizable. The figure stands in a neutral or heroic pose inside the box. Studio lighting, high detail, professional product photography style.`;
}

async function gerarFigureCompleta(imagemBase64, mimeType, opcoes) {
  const token = process.env.HF_API_TOKEN;

  if (!token) {
    return {
      sucesso: false,
      mensagem: "Token da Hugging Face não configurado. Defina a variável HF_API_TOKEN.",
    };
  }

  try {
    const client = new InferenceClient(token);
    const prompt = montarPrompt(opcoes);

    const bufferImagem = Buffer.from(imagemBase64, "base64");
    const blobImagem = new Blob([bufferImagem], { type: mimeType });

    const resultado = await client.imageToImage({
      model: MODELO,
      inputs: blobImagem,
      parameters: {
        prompt: prompt,
      },
    });

    const bufferResultado = Buffer.from(await resultado.arrayBuffer());
    const base64Resultado = bufferResultado.toString("base64");

    return {
      sucesso: true,
      imagem: base64Resultado,
      mimeType: resultado.type || "image/png",
    };
  } catch (erro) {
    console.error("Erro na geração:", erro.message);
    return {
      sucesso: false,
      mensagem: "Erro ao gerar a imagem: " + erro.message,
    };
  }
}

module.exports = { gerarFigureCompleta };
