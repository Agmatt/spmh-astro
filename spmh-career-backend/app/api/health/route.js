export async function GET() {
  return Response.json({
    status: 'ok',
    service: 'SPMH Career Backend',
    timestamp: new Date().toISOString(),
  });
}

export async function OPTIONS() {
  return new Response(null, { status: 204 });
}
