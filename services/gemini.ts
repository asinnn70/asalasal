
import { GoogleGenAI } from "@google/genai";
import { Product, Transaction, Supplier } from "../types";

export const getInventoryInsights = async (
  products: Product[],
  transactions: Transaction[],
  suppliers: Supplier[]
): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const inventorySummary = products.map(p => ({
      n: p.name,
      s: p.stock,
      m: p.minStock,
      c: p.category
    }));

    const recentTx = transactions.slice(0, 15).map(t => ({
      p: t.productName,
      tp: t.type,
      q: t.quantity
    }));

    const prompt = `
      Bertindaklah sebagai Konsultan Bisnis UMKM. Analisis data berikut:
      Inventaris: ${JSON.stringify(inventorySummary)}
      Transaksi Terakhir: ${JSON.stringify(recentTx)}
      Total Supplier: ${suppliers.length}
      
      Berikan laporan singkat (Markdown) yang mencakup:
      1. 🚩 Peringatan stok kritis/mati.
      2. 📈 Tren pergerakan barang tercepat.
      3. 💡 Rekomendasi operasional & supplier.
      
      Gunakan bahasa Indonesia yang profesional namun mudah dimengerti pemilik toko.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt
    });

    return response.text || "Tidak ada analisis tersedia saat ini.";
  } catch (error) {
    console.error("AI Insights Error:", error);
    throw new Error("Gagal mendapatkan analisis dari AI.");
  }
};
