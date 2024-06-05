
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
  const { parent } = event;
  const data = await parent();

  // const user_clubs = await prisma.clubs.findMany({
  //   where:{
  //     includes
  //     members:{
  //     }
  //   }
  // })

  return { ...data };
};
