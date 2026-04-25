import { NextResponse } from 'next/server';
import { createServerSideClient } from '@/lib/supabase-server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message) {
      return NextResponse.json({ response: "Please provide a valid question." });
    }

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        response: "⚠️ AI assistant is not configured. Please add GEMINI_API_KEY to your .env.local file."
      });
    }

    const supabase = await createServerSideClient();

    // Fetch all relevant data from Supabase in parallel
    const [materialsRes, attendanceRes, invoicesRes, workersRes] = await Promise.all([
      supabase.from('materials').select('*'),
      supabase.from('attendance').select('*'),
      supabase.from('invoices').select('*'),
      supabase.from('workers').select('*'),
    ]);

    // Build a concise data context string
    const materialsData = materialsRes.data || [];
    const attendanceData = attendanceRes.data || [];
    const invoicesData = invoicesRes.data || [];
    const workersData = workersRes.data || [];

    const dataContext = `
## LIVE DATABASE SNAPSHOT (${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })})

### Materials Inventory (${materialsData.length} items):
${materialsData.length > 0
        ? materialsData.map(m => `- ${m.name}: ${m.quantity} ${m.unit} (threshold: ${m.low_stock_threshold})`).join('\n')
        : '(No materials recorded yet)'}

### Worker Roster (${workersData.length} workers):
${workersData.length > 0
        ? workersData.map(w => `- ${w.name} | Role: ${w.role} | Daily Wage: ₹${w.daily_wage}`).join('\n')
        : '(No workers registered)'}

### Attendance Logs (${attendanceData.length} entries):
${attendanceData.length > 0
        ? attendanceData.slice(-20).map(a => `- Worker ID: ${a.worker_id} | Date: ${a.date} | Status: ${a.status} | Hours: ${a.hours_worked}`).join('\n')
        : '(No attendance logs available)'}

### Financial Invoices (${invoicesData.length} invoices):
${invoicesData.length > 0
        ? invoicesData.map(i => `- ${i.supplier_name}: ₹${i.amount} | Status: ${i.status} | Due: ${i.due_date}`).join('\n')
        : '(No invoices recorded)'}
`;

    // System prompt with persona and rules
    const systemPrompt = `You are "SiteHelper", a high-performance AI analyst integrated into the KBT Construction ERP.

CORE OBJECTIVE:
Provide elite, data-driven insights to site managers using the LIVE database snapshot provided.

FORMATTING RULES (STRICT):
1. **Rich Markdown Only**: Use bold text, headers (###), and horizontal rules (---) to separate sections.
2. **Tables**: For lists of workers, materials, or invoices, ALWAYS use Markdown Tables for readability.
3. **Bullet Points**: Use clean bullet points for summaries.
4. **Professional Tone**: Be a highly professional construction consultant. Use ₹ for all currency.
5. **No Hallucinations**: Only use provided data. If data is zero/missing, advise the user to populate the relevant module.

DATA CONTEXT:
${dataContext}`;

    // Build conversation contents for multi-turn support
    const contents: Array<{ role: string; parts: Array<{ text: string }> }> = [];

    // Add system context as the first user message
    contents.push({
      role: 'user',
      parts: [{ text: systemPrompt + "\n\nAcknowledge that you have access to the live database and are ready to help. Keep it to one short sentence." }]
    });
    contents.push({
      role: 'model',
      parts: [{ text: "I have access to your live Sitesync database. How can I help you today?" }]
    });

    // Add conversation history if provided (for multi-turn context)
    if (history && Array.isArray(history) && history.length > 1) {
      // Skip the first assistant greeting message, add the rest
      const relevantHistory = history.slice(1);
      for (const msg of relevantHistory) {
        contents.push({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.text }]
        });
      }
    }

    // Add the current user message
    contents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // Call Gemini with rate limit handling
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent({ contents });
      const responseText = result.response.text();
      return NextResponse.json({ response: responseText });
    } catch (aiError: any) {
      console.error('Gemini API Error:', aiError);

      // If rate limited or API error, fall back to keyword-based analysis
      if (aiError.status === 429 || aiError.message?.includes('429') || aiError.message?.includes('quota')) {
        console.log('Gemini rate limited — falling back to keyword analysis');
        const fallbackReply = await keywordFallback(message, supabase);
        return NextResponse.json({ response: fallbackReply });
      }

      if (aiError.message?.includes('API_KEY')) {
        return NextResponse.json({
          response: "⚠️ Invalid Gemini API key. Please check your GEMINI_API_KEY in .env.local."
        });
      }

      // Generic AI error — try fallback
      const fallbackReply = await keywordFallback(message, supabase);
      return NextResponse.json({ response: fallbackReply });
    }

  } catch (err: any) {
    console.error('Chat API Error:', err);
    return NextResponse.json({
      response: "Sorry, I encountered an error while processing your request. Please try again."
    }, { status: 500 });
  }
}

// ============================================================
// FALLBACK: Keyword-based analysis (used when Gemini is offline)
// ============================================================
async function keywordFallback(message: string, supabase: any): Promise<string> {
  const msg = message.toLowerCase();
  let reply = "I'm currently running in offline mode (AI quota reached). I can still help with: **inventory**, **attendance**, **invoices**, or **workers**. Try asking about one of those!";

  if (msg.includes('inventory') || msg.includes('stock') || msg.includes('material') || msg.includes('cement')) {
    const { data: materials } = await supabase.from('materials').select('*');
    if (materials && materials.length > 0) {
      const lowStock = materials.filter((m: any) => m.quantity <= m.low_stock_threshold);
      reply = `📦 **Inventory Report** (offline mode)\n\n`;
      reply += `• **Total materials:** ${materials.length} items tracked\n`;
      if (lowStock.length > 0) {
        reply += `• ⚠️ **Low stock alerts:** ${lowStock.length} items need reordering\n`;
        lowStock.forEach((m: any) => {
          reply += `  - ${m.name}: ${m.quantity} ${m.unit} (threshold: ${m.low_stock_threshold})\n`;
        });
      } else {
        reply += `• ✅ All materials are above their restock thresholds.`;
      }
    } else {
      reply = `📦 No materials found in the database. Add your first items via the Inventory module.`;
    }
  }
  else if (msg.includes('attendance') || msg.includes('absent') || msg.includes('present')) {
    const { data: attendance } = await supabase.from('attendance').select('*');
    if (attendance && attendance.length > 0) {
      const absent = attendance.filter((a: any) => a.status === 'Absent');
      const present = attendance.filter((a: any) => a.status === 'Present');
      reply = `👷 **Attendance Report** (offline mode)\n\n`;
      reply += `• **Total logs:** ${attendance.length}\n`;
      reply += `• ✅ Present: ${present.length}\n`;
      reply += `• ⚠️ Absent: ${absent.length}`;
    } else {
      reply = `👷 No attendance records found. Log attendance in the Operations module.`;
    }
  }
  else if (msg.includes('invoice') || msg.includes('finance') || msg.includes('payment') || msg.includes('pending')) {
    const { data: invoices } = await supabase.from('invoices').select('*');
    if (invoices && invoices.length > 0) {
      const pending = invoices.filter((i: any) => i.status === 'Pending');
      const overdue = invoices.filter((i: any) => i.status === 'Overdue');
      const totalAmount = invoices.reduce((sum: number, i: any) => sum + (i.amount || 0), 0);
      reply = `💰 **Finance Report** (offline mode)\n\n`;
      reply += `• **Total invoices:** ${invoices.length} (₹${totalAmount.toLocaleString('en-IN')})\n`;
      if (overdue.length > 0) reply += `• 🚨 Overdue: ${overdue.length}\n`;
      if (pending.length > 0) reply += `• ⏳ Pending: ${pending.length}\n`;
      if (overdue.length === 0 && pending.length === 0) reply += `• ✅ All invoices are cleared!`;
    } else {
      reply = `💰 No invoices found. Create one in the Finance module.`;
    }
  }
  else if (msg.includes('worker') || msg.includes('labour') || msg.includes('labor') || msg.includes('staff')) {
    const { data: workers } = await supabase.from('workers').select('*');
    if (workers && workers.length > 0) {
      const totalWages = workers.reduce((sum: number, w: any) => sum + (w.daily_wage || 0), 0);
      reply = `👥 **Workforce Report** (offline mode)\n\n`;
      reply += `• **Total workers:** ${workers.length}\n`;
      reply += `• **Daily payroll:** ₹${totalWages.toLocaleString('en-IN')}\n`;
      reply += `• **Roles:** ${[...new Set(workers.map((w: any) => w.role))].join(', ')}`;
    } else {
      reply = `👥 No workers registered. Add workers in the Operations module.`;
    }
  }
  else if (msg.includes('summary') || msg.includes('overview') || msg.includes('report')) {
    const [matRes, wrkRes, invRes] = await Promise.all([
      supabase.from('materials').select('*'),
      supabase.from('workers').select('*'),
      supabase.from('invoices').select('*'),
    ]);
    reply = `📋 **Site Summary** (offline mode)\n\n`;
    reply += `• **Materials:** ${matRes.data?.length || 0} items tracked\n`;
    reply += `• **Workers:** ${wrkRes.data?.length || 0} registered\n`;
    reply += `• **Invoices:** ${invRes.data?.length || 0} in ledger\n\n`;
    reply += `_AI-powered detailed analysis will resume when the Gemini quota resets (usually within 1 minute)._`;
  }

  return reply;
}
