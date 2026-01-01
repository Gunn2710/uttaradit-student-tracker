import { supabase } from "@/utils";
import { NextResponse } from "next/server";

export async function POST(req) {
    const data = await req.json();

    const { data: result, error } = await supabase
        .from('students')
        .insert({
            name: data.name,
            grade: data.grade,
            address: data.address,
            contact: data.contact
        })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(result);
}

export async function GET(req) {
    const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('id', { ascending: true });

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
}

export async function DELETE(req) {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get('id');

    const { data, error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
}
