import { NextResponse } from "next/server";
import { getChatMessages, isAuthorized } from "@/lib/telegram";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "http://localhost:3001",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthorized())) {
    return NextResponse.json({ error: "not_authorized" }, { status: 401, headers: CORS_HEADERS });
  }
  const { id } = await params;

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? Math.min(Number(limitParam) || 20, 200) : 20;
  const offsetIdParam = url.searchParams.get("offsetId");
  const offsetId = offsetIdParam ? Number(offsetIdParam) : 0;

  const messages = await getChatMessages(id, limit, offsetId);
  return NextResponse.json({ messages }, { headers: CORS_HEADERS });
}