import { NextResponse } from "next/server";
import { isAuthorized, resolveUsername } from "@/lib/telegram";

const CORS_HEADERS = {
    "Access-Control-Allow-Origin": "http://localhost:3001",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Credentials": "true",
};

export async function OPTIONS() {
    return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(req: Request) {
    if (!(await isAuthorized())) {
        return NextResponse.json(
            { error: "not_authorized" },
            { status: 401, headers: CORS_HEADERS }
        );
    }

    const username = new URL(req.url).searchParams.get("username");
    if (!username) {
        return NextResponse.json(
            { error: "username_required" },
            { status: 400, headers: CORS_HEADERS }
        );
    }

    const info = await resolveUsername(username);
    if (!info) {
        return NextResponse.json(
            { error: "not_found" },
            { status: 404, headers: CORS_HEADERS }
        );
    }

    return NextResponse.json(info, { headers: CORS_HEADERS });
}