import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import passport from 'passport';
import {
    ExtractJwt,
    Strategy,
    StrategyOptionsWithoutRequest,
} from 'passport-jwt';
import LocalStrategy from 'passport-local';

import { AppError } from '../../errorHandler/error.interface.js';
import { UserT } from '../../models/user.model.js';
import * as userService from '../../services/user.service.js';
import { checkPassword } from '../bycrypt/index.js';

passport.use(
    new LocalStrategy.Strategy(
        {
            passwordField: 'password',
            usernameField: 'email',
        },
        function (email, password, done) {
            userService
                .getUserByEmail({ email })
                .then(async (user) => {
                    await checkPassword({ hash: user.password, password });
                    done(null, user);
                })
                .catch((e: unknown) => {
                    let errorMessage = 'Unknown error';
                    if (e instanceof Error) {
                        errorMessage = e.message;
                    } else if (typeof e === 'string') {
                        errorMessage = e;
                    }

                    const appError = new AppError({
                        errorMessageForClient: ReasonPhrases.UNAUTHORIZED,
                        messageForSentry: `jwt AuthFailure: ${errorMessage}`,
                        statusCode: StatusCodes.UNAUTHORIZED,
                    });
                    done(appError, false);
                });
        },
    ),
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user: UserT, done) {
    done(null, user);
});

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new AppError({
        errorMessageForClient: ReasonPhrases.INTERNAL_SERVER_ERROR,
        messageForSentry: 'jwt secret not defined',
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
    });
}

const jwtOpts: StrategyOptionsWithoutRequest = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtSecret,
};

const jwtStrategy = new Strategy(
    jwtOpts,
    (payload: { userId: string }, done) => {
        userService
            .getUserById({ userId: payload.userId })
            .then((user) => {
                done(null, user);
            })
            .catch(() => {
                done(
                    new AppError({
                        errorMessageForClient: ReasonPhrases.UNAUTHORIZED,
                        messageForSentry: 'jwt AuthFailure',
                        statusCode: StatusCodes.UNAUTHORIZED,
                    }),
                    false,
                );
            });
    },
);

passport.use(jwtStrategy);

const userNamePasswordMW: RequestHandler = passport.authenticate('local', {
    session: false,
}) as RequestHandler;

const authJwtMW: RequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    void (
        passport.authenticate(
            'jwt',
            { session: false },
            (
                err: unknown,
                user: false | UserT,
                info: (string | undefined)[] | object | string,
            ) => {
                if (err || !user) {
                    next(
                        new AppError({
                            errorMessageForClient: ReasonPhrases.UNAUTHORIZED,
                            messageForSentry:
                                typeof info === 'object'
                                    ? JSON.stringify(info)
                                    : info || 'Authentication failed',
                            statusCode: StatusCodes.UNAUTHORIZED,
                        }),
                    );
                    return;
                }
                req.user = user;
                next();
            },
        ) as RequestHandler
    )(req, res, next);
};

export { authJwtMW, userNamePasswordMW };
