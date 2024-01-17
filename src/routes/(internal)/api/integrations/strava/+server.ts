import { ThirdPartyIntegrationProvider } from '@prisma/client';
import type { RequestHandler } from './$types';
import type { Session } from 'lucia';
import { error } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
    const { locals } = event;
	try{
        const session: Session = await locals.auth.validate();
        const integration = await prisma.thirdPartyIntegrationToken.findFirst({
            where: {
                AND: [
                    {
                        user_id: session.user.userId,
                        provider: ThirdPartyIntegrationProvider.STRAVA
                    }
                ]
            }
        });
        const exists=!!integration
        return new Response(JSON.stringify({ exists }), {status:200 });
    }catch(e){
        error(500)
    }
};

