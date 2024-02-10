
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ parent, fetch }) => {
	await parent();
	const data = await parent();
    const user = await prisma.user.findUnique({
        where: {
            id: data.session.user.userId,
        },
        include:{
            integration_logs:false
        }
    });

    return {
        user,
        ...data
    }
}