import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { env } from './env.js';
import prisma from './prisma.js';

passport.use(
    new GoogleStrategy(
        {
            clientID: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            callbackURL: env.GOOGLE_CALLBACK_URL,
        },
        async (_accessToken, _refreshToken, profile, done) => {
            try {
                const emails = profile.emails;
                const email = emails?.[0]?.value;
                if (!email) return done(new Error('No email found in Google profile'));

                let user = await prisma.user.findUnique({ where: { email } });

                if (!user) {
                    user = await prisma.user.create({
                        data: {
                            email,
                            name: profile.displayName,
                            googleId: profile.id,
                            isVerified: true,
                        },
                    });
                } else if (!user.googleId) {
                    user = await prisma.user.update({
                        where: { email },
                        data: { googleId: profile.id },
                    });
                }

                return done(null, user);
            } catch (error) {
                return done(error);
            }
        },
    ),
);
