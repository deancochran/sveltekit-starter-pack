import { relations } from 'drizzle-orm/relations';
import {
	activities,
	club,
	clubEvent,
	clubMember,
	emailVerificationToken,
	friendship,
	key,
	likedTrainingSession,
	passwordResetToken,
	session,
	subscription,
	thirdPartyIntegrationLogs,
	thirdPartyIntegrationToken,
	trainingSession,
	user
} from './schema';

export const activitiesRelations = relations(activities, ({ one }) => ({
	user: one(user, {
		fields: [activities.userId],
		references: [user.id]
	}),
	thirdPartyIntegrationLog: one(thirdPartyIntegrationLogs, {
		fields: [activities.thirdpartyLogId],
		references: [thirdPartyIntegrationLogs.id]
	})
}));

export const userRelations = relations(user, ({ many }) => ({
	activities: many(activities),
	subscriptions: many(subscription),
	sessions: many(session),
	keys: many(key),
	passwordResetTokens: many(passwordResetToken),
	emailVerificationTokens: many(emailVerificationToken),
	thirdPartyIntegrationTokens: many(thirdPartyIntegrationToken),
	thirdPartyIntegrationLogs: many(thirdPartyIntegrationLogs),
	trainingSessions: many(trainingSession),
	likedTrainingSessions: many(likedTrainingSession),
	friendships_requesterId: many(friendship, {
		relationName: 'friendship_requesterId_user_id'
	}),
	friendships_addresseeId: many(friendship, {
		relationName: 'friendship_addresseeId_user_id'
	}),
	clubMembers: many(clubMember)
}));

export const thirdPartyIntegrationLogsRelations = relations(
	thirdPartyIntegrationLogs,
	({ one, many }) => ({
		activities: many(activities),
		thirdPartyIntegrationToken: one(thirdPartyIntegrationToken, {
			fields: [thirdPartyIntegrationLogs.tokenId],
			references: [thirdPartyIntegrationToken.id]
		}),
		user: one(user, {
			fields: [thirdPartyIntegrationLogs.userId],
			references: [user.id]
		})
	})
);

export const subscriptionRelations = relations(subscription, ({ one }) => ({
	user: one(user, {
		fields: [subscription.userId],
		references: [user.id]
	})
}));

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id]
	})
}));

export const keyRelations = relations(key, ({ one }) => ({
	user: one(user, {
		fields: [key.userId],
		references: [user.id]
	})
}));

export const passwordResetTokenRelations = relations(
	passwordResetToken,
	({ one }) => ({
		user: one(user, {
			fields: [passwordResetToken.userId],
			references: [user.id]
		})
	})
);

export const emailVerificationTokenRelations = relations(
	emailVerificationToken,
	({ one }) => ({
		user: one(user, {
			fields: [emailVerificationToken.userId],
			references: [user.id]
		})
	})
);

export const thirdPartyIntegrationTokenRelations = relations(
	thirdPartyIntegrationToken,
	({ one, many }) => ({
		user: one(user, {
			fields: [thirdPartyIntegrationToken.userId],
			references: [user.id]
		}),
		thirdPartyIntegrationLogs: many(thirdPartyIntegrationLogs)
	})
);

export const trainingSessionRelations = relations(
	trainingSession,
	({ one, many }) => ({
		user: one(user, {
			fields: [trainingSession.userId],
			references: [user.id]
		}),
		clubEvents: many(clubEvent),
		likedTrainingSessions: many(likedTrainingSession)
	})
);

export const clubEventRelations = relations(clubEvent, ({ one }) => ({
	club: one(club, {
		fields: [clubEvent.clubId],
		references: [club.id]
	}),
	trainingSession: one(trainingSession, {
		fields: [clubEvent.trainingSessionId],
		references: [trainingSession.id]
	})
}));

export const clubRelations = relations(club, ({ many }) => ({
	clubEvents: many(clubEvent),
	clubMembers: many(clubMember)
}));

export const likedTrainingSessionRelations = relations(
	likedTrainingSession,
	({ one }) => ({
		user: one(user, {
			fields: [likedTrainingSession.userId],
			references: [user.id]
		}),
		trainingSession: one(trainingSession, {
			fields: [likedTrainingSession.trainingSessionId],
			references: [trainingSession.id]
		})
	})
);

export const friendshipRelations = relations(friendship, ({ one }) => ({
	user_requesterId: one(user, {
		fields: [friendship.requesterId],
		references: [user.id],
		relationName: 'friendship_requesterId_user_id'
	}),
	user_addresseeId: one(user, {
		fields: [friendship.addresseeId],
		references: [user.id],
		relationName: 'friendship_addresseeId_user_id'
	})
}));

export const clubMemberRelations = relations(clubMember, ({ one }) => ({
	club: one(club, {
		fields: [clubMember.clubId],
		references: [club.id]
	}),
	user: one(user, {
		fields: [clubMember.userId],
		references: [user.id]
	})
}));
