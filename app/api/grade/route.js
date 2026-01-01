import { supabase } from "@/utils";
import { NextResponse } from "next/server";

export async function GET(req) {
    const { data, error } = await supabase
        .from('grades')
        .select('*');

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}
