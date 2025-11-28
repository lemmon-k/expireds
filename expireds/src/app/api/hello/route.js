export async function GET() {
  try {
    return new Response(JSON.stringify({ data: "Hello GET" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error @ GET /hello: ", error.error);
    return new Response(JSON.stringify({ data: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request) {
  try {
    // verify params
    const req = await request.formData();
    const input = req.get("input");

    return new Response(JSON.stringify({ data: input }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error @ POST /hello: ", error.error);
    return new Response(JSON.stringify({ data: false }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
