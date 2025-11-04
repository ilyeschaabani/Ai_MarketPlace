import { NextRequest, NextResponse } from 'next/server';
import { HfInference } from '@huggingface/inference';

const HUGGINGFACE_API_KEY = process.env.HUGGINGFACE_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const { description } = await request.json();

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Description is required' },
        { status: 400 }
      );
    }

    if (!HUGGINGFACE_API_KEY) {
      console.error('❌ HUGGINGFACE_API_KEY not found in environment variables');
      return NextResponse.json(
        { success: false, error: 'AI service not configured. Please add HUGGINGFACE_API_KEY to .env.local' },
        { status: 500 }
      );
    }

    console.log('🤖 Analyzing description with Hugging Face Inference API...');
    console.log('📝 Description:', description);

    // ✅ Initialize Hugging Face Inference Client
    const hf = new HfInference(HUGGINGFACE_API_KEY);

    // ✅ Use Text Classification for sentiment analysis
    const result = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: description,
    });

    console.log('✅ Hugging Face response:', result);

    // Response format: [{ label: "POSITIVE", score: 0.999 }]
    const sentiment = result[0];

    return NextResponse.json({
      success: true,
      data: {
        label: sentiment.label,
        score: sentiment.score
      }
    });

  } catch (error: any) {
    console.error('❌ Hugging Face service error:', error);

    // Handle specific Hugging Face errors
    if (error.message?.includes('is currently loading')) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'AI model is loading. Please wait 20 seconds and try again.' 
        },
        { status: 503 }
      );
    }

    if (error.message?.includes('Invalid API token') || error.message?.includes('401')) {
      return NextResponse.json(
        { success: false, error: 'Invalid Hugging Face API key. Please check your .env.local file.' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: error.message || 'AI analysis service unavailable. Please try again later.'
      },
      { status: 500 }
    );
  }
}