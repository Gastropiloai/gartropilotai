
import { createClient } from "@supabase/supabase-js";

export async function POST(request) {
  try {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return Response.json(
        { error: "Datenbank nicht konfiguriert" },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const body = await request.json();

    const { data, error } = await supabase
      .from("orders")
      .insert([{
        order_type: body.order_type,
        table_number: body.table_number ?? null,
        items: body.items,
        total_amount: body.total_amount,
        status: "neu",
        customer_name: body.customer_name ?? null,
        customer_phone: body.customer_phone ?? null
      }])
      .select("id")
      .single();

    if (error) {
      throw error;
    }

    return Response.json({
      success: true,
      order_id: data.id
    });

  } catch (error) {
    console.error("Bestellfehler:", error);

    return Response.json(
      { error: "Bestellung konnte nicht gespeichert werden" },
      { status: 500 }
    );
  }
}
