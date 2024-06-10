import { json } from "@sveltejs/kit";

export async function GET(event: { url: any; }): Promise<Response> {
  const { url } = event;

  try {
    const page = url.searchParams.get('page')
    const take = 5
    const skip = page * take
    const clubs = await prisma.club.findMany({
      skip,
      take,
      include: { _count: { select: { members: true } } },
    })
    return json(clubs)
  } catch (error) {
    return json(
      { message: 'Error retrieving data', error: error },
      { status: 400 }
    );
  }
}
