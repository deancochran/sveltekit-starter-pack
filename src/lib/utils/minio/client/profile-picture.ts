export type getPresignedProfilePictureURLType = {
	presignedUrl:string
}

export const handleGetAvatarPresignedURL = async (user_id:string):Promise<getPresignedProfilePictureURLType>=>{
		const res = await fetch(`/api/user/profile-picture/${user_id}`)
		if(res.ok) return await res.json()
		else return {presignedUrl:""}
	}

export default handleGetAvatarPresignedURL