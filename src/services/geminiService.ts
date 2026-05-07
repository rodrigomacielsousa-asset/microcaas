import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface InvoiceData {
  fornecedor: string;
  cnpj: string;
  valor: number;
  impostos: number;
  tipoOperacao: string; // Venda, Prestação de Serviço, Compra, etc.
  data: string;
  contaContabil: string;
  centroCusto: string;
  resumo: string;
}

export interface iCloudFile {
  name: string;
  category: 'Fiscal' | 'Contabil' | 'RH' | 'Legal' | 'Outros';
  confidence: number;
  summary: string;
}

export async function analyzeInvoice(base64Data: string, mimeType: string): Promise<InvoiceData> {
  const model = "gemini-1.5-flash"; 

  const prompt = `Analise esta nota fiscal (NF-e ou NFS-e) e extraia as informações precisas para pre-contabilidade brasileira.
  Identifique o tipo de operação (Venda de Mercadoria, Prestação de Serviço, Compra para Ativo, etc).
  Extraia o valor total e o valor total de impostos (soma de ICMS, ISS, IPI se houver).
  Retorne EXATAMENTE no formato JSON solicitado.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType,
          },
        },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          fornecedor: { type: Type.STRING, description: "Nome da empresa/fornecedor" },
          cnpj: { type: Type.STRING, description: "CNPJ do fornecedor" },
          valor: { type: Type.NUMBER, description: "Valor bruto total da nota" },
          impostos: { type: Type.NUMBER, description: "Valor total dos impostos identificados" },
          tipoOperacao: { type: Type.STRING, description: "Tipo da operação (ex: Venda de Mercadoria)" },
          data: { type: Type.STRING, description: "Data de emissão (DD/MM/AAAA)" },
          contaContabil: { type: Type.STRING, description: "Sugestão de Conta Contábil" },
          centroCusto: { type: Type.STRING, description: "Sugestão de Centro de Custo" },
          resumo: { type: Type.STRING, description: "Resumo curto da operação" },
        },
        required: ["fornecedor", "cnpj", "valor", "impostos", "tipoOperacao", "data", "contaContabil", "centroCusto"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Resposta vazia do Gemini");
    const data = JSON.parse(text);
    return data as InvoiceData;
  } catch (error) {
    console.error("Erro ao parsear JSON do Gemini:", error);
    throw new Error("Não foi possível processar os dados da nota fiscal.");
  }
}

export async function classifyCloudFile(base64Data: string, mimeType: string): Promise<iCloudFile> {
  const model = "gemini-3-flash-preview";

  const prompt = `Analise este documento para um sistema de iCloud Contábil. 
  Classifique-o em uma das categorias: Fiscal, Contabil, RH, Legal ou Outros.
  Retorne o nome sugerido para o arquivo e um resumo curto de 1 frase.
  Retorne EXATAMENTE no formato JSON solicitado.`;

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [
        { inlineData: { data: base64Data, mimeType: mimeType } },
        { text: prompt },
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          category: { type: Type.STRING, enum: ['Fiscal', 'Contabil', 'RH', 'Legal', 'Outros'] },
          confidence: { type: Type.NUMBER },
          summary: { type: Type.STRING },
        },
        required: ["name", "category", "confidence", "summary"],
      },
    },
  });

  try {
    const text = response.text;
    if (!text) throw new Error("Resposta vazia do Gemini");
    return JSON.parse(text) as iCloudFile;
  } catch (error) {
    console.error("Erro ao parsear JSON do Gemini Cloud:", error);
    throw new Error("Não foi possível classificar o documento.");
  }
}
