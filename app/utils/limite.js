const rateLimit = require('express-rate-limit')

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again after an hour',
	max: 500, // Limit each IP to 500 requests per window
	standardHeaders: 'draft-8',
	legacyHeaders: false,
	ipv6Subnet: 56,
})

module.exports = limiter