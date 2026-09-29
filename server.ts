import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { execFile } from 'child_process';
import { promisify } from 'util';

dotenv.config({ path: '.env.local' });

const execFileAsync = promisify(execFile);

const PYTHON_COMMAND = process.platform === 'win32'
  ? 'python'
  : 'python3';

const app = express();
const PORT = 3000;

app.use(express.json());


// ============================================================
// AUTHORITATIVE STATUTORY CONTEXT
// ============================================================

const STATUTORY_KNOWLEDGE = `
AUTHORITATIVE LEGAL FRAMEWORKS FOR AYURVEDIC IP & REGULATORY COMPLIANCE:

1. Patents Act, 1970:
   - Section 3(p): Inventions that are in effect traditional knowledge
     or an aggregation or duplication of known properties of
     traditionally known component(s) are NOT patentable.
   - Section 3(e): Mere admixture resulting only in aggregation
     of properties is not patentable.
   - Section 3(d): Mere discovery of a new form of a known substance
     which does not result in enhancement of known efficacy is not patentable.
   - Section 10(4)(d): Disclosure of source and geographical origin
     of biological material in patent specifications.

2. Biological Diversity Act, 2002 & Amendment Act, 2023:
   - Section 3 & 4: Access to biological resources by foreign entities.
   - Section 6: IP applications based on biological resources may
     require National Biodiversity Authority approval.
   - 2023 Amendment introduces specific exemptions and clarifications.

3. Trade Marks Act, 1999:
   - Section 9(1)(b): Absolute grounds for refusal.
   - Distinctive composite and coined marks may be registrable.

4. Drugs and Cosmetics Act, 1940:
   - Ayurvedic, Siddha and Unani regulatory framework.
   - Licensing, manufacturing and labeling requirements.

5. FSSAI Ayurveda Aahara Regulations, 2022:
   - Rules for Ayurveda Aahara products.
   - Restrictions on therapeutic claims.
   - Mandatory regulatory requirements.

6. WIPO Treaty on Intellectual Property, Genetic Resources
   and Associated Traditional Knowledge:
   - Disclosure-related obligations concerning genetic resources
     and associated traditional knowledge.
`;


// ============================================================
// RAG-GROUNDED FALLBACK
// ============================================================

function generateRagFallback(
  question: string,
  jurisdiction: string,
  language: string,
  retrievedChunks: any[]
) {
  const top = retrievedChunks?.[0];

  const sources = (retrievedChunks || [])
    .slice(0, 3)
    .map((chunk: any) => ({
      title: chunk.title || 'Authoritative source',
      organization: chunk.organization || '',
      page: chunk.page ?? '',
      url: chunk.url || ''
    }))
    .filter((source: any) => source.title || source.url);


  // ----------------------------------------------------------
  // No evidence
  // ----------------------------------------------------------

  if (!top) {
    return {
      classification: {
        product_type: 'Ayurvedic IP & Regulatory Guidance',
        jurisdiction: jurisdiction || 'India',
        category: 'Insufficient authoritative evidence'
      },

      answer:
        language === 'hi'
          ? 'इस प्रश्न के लिए पर्याप्त आधिकारिक साक्ष्य प्राप्त नहीं हुआ।'
          : language === 'kn'
            ? 'ಈ ಪ್ರಶ್ನೆಗೆ ಸಾಕಷ್ಟು ಅಧಿಕೃತ ಸಾಕ್ಷ್ಯ ದೊರಕಲಿಲ್ಲ.'
            : 'I could not retrieve sufficient authoritative evidence to answer this question safely.',

      reasoning:
        'The retrieval layer did not return authoritative evidence above the configured relevance threshold.',

      next_steps: [
        'Retrieve additional authoritative evidence before relying on the answer.'
      ],

      confidence: 'Low',

      sources: [],

      disclaimer:
        'AI-assisted informational and regulatory guidance. Not formal legal advice.'
    };
  }


  // ----------------------------------------------------------
  // Evidence-based confidence
  // ----------------------------------------------------------

  const relevance = Number(top.relevance ?? 0);

  const confidence =
    relevance >= 0.75
      ? 'High'
      : relevance >= 0.62
        ? 'Medium'
        : 'Low';


  // ----------------------------------------------------------
  // Language prefix
  // ----------------------------------------------------------

  const answerPrefix =
    language === 'hi'
      ? 'प्राप्त आधिकारिक स्रोत के आधार पर: '
      : language === 'kn'
        ? 'ಪಡೆಯಲಾದ ಅಧಿಕೃತ ಮೂಲದ ಆಧಾರದ ಮೇಲೆ: '
        : 'Based strictly on the retrieved authoritative evidence: ';


  // ----------------------------------------------------------
  // Return grounded fallback
  // ----------------------------------------------------------

  return {
    classification: {
      product_type: 'Ayurvedic IP & Regulatory Guidance',
      jurisdiction: jurisdiction || 'India',
      category:
        top.category ||
        'Ayurvedic IP & Regulatory Guidance'
    },

    answer:
      `${answerPrefix}${String(top.content || '').trim()}`,

    reasoning:
      'Gemini was temporarily unavailable, so the response was generated directly from the highest-ranked ChromaDB evidence. No additional legal claims were added.',

    next_steps: [
      'Review the cited authoritative source and verify the applicable facts for your specific product.',
      'For a filing, approval, or legal decision, obtain professional regulatory or legal advice.'
    ],

    confidence,

    sources,

    disclaimer:
      'AI-assisted informational and regulatory guidance. Not formal legal advice.'
  };
}


// ============================================================
// CHROMADB RETRIEVAL
// ============================================================

async function retrieveFromChroma(
  question: string,
  productType: string,
  jurisdiction: string,
  topK = 5
) {
  const scriptPath = path.join(
    process.cwd(),
    'rag_retriever.py'
  );

  try {

    const { stdout, stderr } =
      await execFileAsync(
        PYTHON_COMMAND,
        [
          scriptPath,
          question,
          productType || '',
          jurisdiction || 'India',
          String(topK)
        ],
        {
          cwd: process.cwd(),
          timeout: 30000,
          maxBuffer: 5 * 1024 * 1024
        }
      );


    if (stderr?.trim()) {
      console.warn(
        'RAG stderr:',
        stderr.trim()
      );
    }


    const parsed = JSON.parse(stdout);

    return parsed.results || [];

  } catch (error: any) {

    console.error(
      'ChromaDB retrieval failed:',
      error?.message || error
    );

    return [];
  }
}


// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {

  res.json({
    status: 'ok',

    service:
      'ip-sakti-sahayak',

    gemini_api_configured:
      Boolean(process.env.GEMINI_API_KEY),

    statutes_indexed:
      14,

    supported_jurisdictions: [
      'India',
      'International',
      'Both'
    ],

    supported_languages: [
      'English',
      'Hindi',
      'Kannada'
    ],

    version:
      '2.0.0'
  });

});


// ============================================================
// ASK AI
// ============================================================

app.post('/api/ask', async (req, res) => {

  const {
    question = '',
    jurisdiction = 'India',
    language = 'en',
    product_type = 'Ayurvedic Formulation',
    product_context = ''
  } = req.body || {};


  // ----------------------------------------------------------
  // Validate question
  // ----------------------------------------------------------

  if (
    !question ||
    typeof question !== 'string' ||
    !question.trim()
  ) {

    return res.status(400).json({
      error: 'Question is required.'
    });

  }


  const userQuery =
    question.trim();

  const apiKey =
    process.env.GEMINI_API_KEY;


  // ----------------------------------------------------------
  // Retrieve from ChromaDB
  // ----------------------------------------------------------

  const retrievedChunks =
    await retrieveFromChroma(
      userQuery,
      product_type,
      jurisdiction,
      5
    );


  // ----------------------------------------------------------
  // Build evidence
  // ----------------------------------------------------------

  const retrievedEvidence =
    retrievedChunks.length

      ? retrievedChunks
          .map(
            (chunk: any, index: number) => `
SOURCE ${index + 1}

Title:
${chunk.title}

Organization:
${chunk.organization}

Jurisdiction:
${jurisdiction}

Category:
${chunk.category}

Page:
${chunk.page}

Source URL:
${chunk.url}

Relevance:
${chunk.relevance}

EVIDENCE:
${chunk.content}
`
          )
          .join(
            '\n-----------------------------\n'
          )

      : 'NO AUTHORITATIVE EVIDENCE WAS RETRIEVED.';


  // ==========================================================
  // GEMINI
  // ONLY GEMINI 3.5 FLASH LITE
  // ==========================================================

  if (apiKey) {

    try {

      const ai =
        new GoogleGenAI({
          apiKey
        });


      const prompt = `
You are "IP-SAKTI Sahayak", a source-grounded AI assistant for Ayurvedic intellectual property and regulatory guidance.

Answer the user's question using ONLY the retrieved authoritative evidence supplied below.

USER QUERY:
"${userQuery}"

USER CONTEXT:
- Jurisdiction: ${jurisdiction}
- Product type: ${product_type}
- Additional product context: ${product_context || 'None'}
- Requested language: ${
  language === 'hi'
    ? 'Hindi'
    : language === 'kn'
      ? 'Kannada'
      : 'English'
}

RETRIEVED AUTHORITATIVE EVIDENCE:

${retrievedEvidence}

GROUNDING RULES:

1. Use the retrieved evidence as the primary factual basis.
2. Do NOT invent statutes, sections, rules, organizations, page numbers, URLs, or regulatory requirements.
3. Do NOT cite a document unless it appears in the retrieved evidence.
4. If the retrieved evidence is insufficient, explicitly say so.
5. Do not treat your answer as formal legal advice.
6. Keep the answer practical and understandable.
7. Answer in ${
  language === 'hi'
    ? 'Hindi'
    : language === 'kn'
      ? 'Kannada'
      : 'English'
}.
8. For every source used, preserve its title, organization, page and URL from the retrieved evidence.
9. Do not use unrelated retrieved documents merely because they were returned by semantic search.
10. If the question is outside the Ayurvedic IP/regulatory scope, say so instead of forcing an Ayurvedic answer.

RETURN ONLY VALID JSON:

{
  "classification": {
    "product_type": "string",
    "jurisdiction": "${jurisdiction}",
    "category": "string"
  },

  "answer": "string",

  "reasoning": "string",

  "next_steps": [
    "string"
  ],

  "confidence": "High | Medium | Low",

  "sources": [
    {
      "title": "string",
      "organization": "string",
      "page": "string or number",
      "url": "string"
    }
  ],

  "disclaimer": "AI-assisted informational and regulatory guidance. Not formal legal advice."
}
`;


      // ------------------------------------------------------
      // ONLY MODEL
      // ------------------------------------------------------

      const modelName =
        'gemini-3.5-flash-lite';


      let responseText:
        string | undefined;


      console.log(
        `Trying Gemini model: ${modelName}`
      );


      try {

        const geminiResponse =
          await ai.models.generateContent({

            model:
              modelName,

            contents:
              prompt,

            config: {
              responseMimeType:
                'application/json'
            }

          });


        responseText =
          geminiResponse.text?.trim();


        if (responseText) {

          console.log(
            `Gemini success: ${modelName}`
          );

        }

      } catch (modelErr: any) {

        console.warn(
          `Gemini ${modelName} failed:`,
          modelErr?.message ||
          modelErr
        );

      }


      // ------------------------------------------------------
      // Parse Gemini response
      // ------------------------------------------------------

      if (responseText) {

        try {

          const parsed =
            JSON.parse(responseText);

          return res.json(parsed);

        } catch {

          const match =
            responseText.match(
              /\{[\s\S]*\}/
            );


          if (match) {

            try {

              const parsed =
                JSON.parse(match[0]);

              return res.json(parsed);

            } catch (parseError) {

              console.warn(
                'Gemini JSON parsing failed:',
                parseError
              );

            }

          }

        }

      }

    } catch (err: any) {

      console.error(
        'GEMINI ERROR:',
        err
      );

    }

  }


  // ==========================================================
  // RAG FALLBACK
  // ==========================================================

  const fallbackResult =
    generateRagFallback(
      userQuery,
      jurisdiction,
      language,
      retrievedChunks
    );


  return res.json(
    fallbackResult
  );

});


// ============================================================
// START SERVER
// ============================================================

async function startServer() {

  if (
    process.env.NODE_ENV !==
    'production'
  ) {

    const vite =
      await createViteServer({

        server: {
          middlewareMode: true
        },

        appType: 'spa'

      });


    app.use(
      vite.middlewares
    );

  } else {

    const distPath =
      path.join(
        process.cwd(),
        'dist'
      );


    app.use(
      express.static(
        distPath
      )
    );


    app.get(
      '*',
      (req, res) => {

        res.sendFile(
          path.join(
            distPath,
            'index.html'
          )
        );

      }
    );

  }


  app.listen(
    PORT,
    '0.0.0.0',
    () => {

      console.log(
        `IP-SAKTI Sahayak server running at http://0.0.0.0:${PORT}`
      );

    }
  );

}


startServer();