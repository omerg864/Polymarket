export const API_ROUTES = {
	BASE: 'api',
	AUTH: {
		BASE: '/auth',
		WILDCARD: '/*path',
	},
	USER: {
		BASE: '/v1/user',
		ME: '/me',
		UPDATE: '/',
	},
	WALLET: {
		BASE: '/v1/wallet',
		CREATE: '/',
		FIND_ALL: '/',
		FIND_ONE: '/:id',
		UPDATE: '/:id',
		DELETE: '/:id',
	},
	POSITION: {
		BASE: '/v1/position',
		FIND_BY_WALLET: '/wallet/:walletId',
		FIND_ONE: '/:id',
	},
	JOB: {
		BASE: '/v1/job',
		SYNC_POSITIONS: '/sync-positions',
	},
};

export const CLIENT_ROUTES = {
	HOME: '/',
	LOGIN: '/login',
	REGISTER: '/register',
	VERIFY_EMAIL: '/verify-email',
	WALLETS: '/wallets',
	POSITIONS: '/positions',
};
