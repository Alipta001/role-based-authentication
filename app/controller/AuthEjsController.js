const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthEjsController {
    login(req, res) {
        const message = req.flash('message')
        const messageType = req.flash('messageType')
        return res.render("login", { message: message[0], messageType: messageType[0] });
    }

    register(req, res) {
        const message = req.flash('message')
        const messageType = req.flash('messageType')
        return res.render("register", { message: message[0], messageType: messageType[0] });
    }

    async registerstore(req, res) {
        try {
            const { name, email, phone, password, role } = req.body;
            if (!name || !email || !phone || !password) {
                req.flash('message', 'All fields are required');
                req.flash('messageType', 'danger');
                return res.redirect('/register');
            }

            const userExist = await User.findOne({ email });
            if (userExist) {
                req.flash('message', 'Email is already registered');
                req.flash('messageType', 'warning');
                return res.redirect('/register');
            }

            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(password, salt);
            const selectedRole = ['user', 'admin', 'manager'].includes(role) ? role : 'user';

            const userdata = new User({
                name,
                email,
                phone,
                password: hashPassword,
                role: selectedRole
            });

            await userdata.save();
            req.flash('message', `Account created successfully as ${selectedRole}. Please login.`);
            req.flash('messageType', 'success');
            const redirectPath = selectedRole === 'admin' ? '/admin/login' : selectedRole === 'manager' ? '/manager/login' : '/login';
            return res.redirect(redirectPath);
        } catch (error) {
            console.log(error.message);
            req.flash('message', 'Something went wrong. Please try again.');
            req.flash('messageType', 'danger');
            return res.redirect('/register');
        }
    }

    async loginstore(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('message', 'All fields are required');
                req.flash('messageType', 'danger');
                return res.redirect('/login');
            }

            const userExist = await User.findOne({ email });
            if (!userExist) {
                req.flash('message', 'Invalid credentials');
                req.flash('messageType', 'danger');
                return res.redirect('/login');
            }

            const isMatch = await bcrypt.compare(password, userExist.password);
            if (!isMatch) {
                req.flash('message', 'Invalid credentials');
                req.flash('messageType', 'danger');
                return res.redirect('/login');
            }

            if (userExist.role !== 'user') {
                req.flash('message', 'Please use the correct login page for your role');
                req.flash('messageType', 'warning');
                return res.redirect('/login');
            }

            const token = jwt.sign({
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                role: userExist.role
            }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, { maxAge: 86400000, httpOnly: true });
            return res.redirect('/user/dashboard');
        } catch (error) {
            console.log(error.message);
            req.flash('message', 'Unable to sign in. Please try again.');
            req.flash('messageType', 'danger');
            return res.redirect('/login');
        }
    }

    adminlogin(req, res) {
        const message = req.flash('message')
        const messageType = req.flash('messageType')
        return res.render('admin/login', { message: message[0], messageType: messageType[0] });
    }

    async adminloginstore(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('message', 'All fields are required');
                req.flash('messageType', 'danger');
                return res.redirect('/admin/login');
            }

            const userExist = await User.findOne({ email });
            if (!userExist) {
                req.flash('message', 'Invalid credentials');
                req.flash('messageType', 'danger');
                return res.redirect('/admin/login');
            }

            const isMatch = await bcrypt.compare(password, userExist.password);
            if (!isMatch) {
                req.flash('message', 'Invalid credentials');
                req.flash('messageType', 'danger');
                return res.redirect('/admin/login');
            }

            if (userExist.role !== 'admin') {
                req.flash('message', 'Please use the correct login page for your role');
                req.flash('messageType', 'warning');
                return res.redirect('/admin/login');
            }

            const token = jwt.sign({
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                role: userExist.role
            }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, { maxAge: 86400000, httpOnly: true });
            return res.redirect('/admin/dashboard');
        } catch (error) {
            console.log(error.message);
            req.flash('message', 'Unable to sign in. Please try again.');
            req.flash('messageType', 'danger');
            return res.redirect('/admin/login');
        }
    }

    managerlogin(req, res) {
        const message = req.flash('message')
        const messageType = req.flash('messageType')
        return res.render('manager/login', { message: message[0], messageType: messageType[0] });
    }

    async managerloginstore(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                req.flash('message', 'All fields are required');
                req.flash('messageType', 'danger');
                return res.redirect('/manager/login');
            }

            const userExist = await User.findOne({ email });
            if (!userExist) {
                req.flash('message', 'Invalid credentials');
                req.flash('messageType', 'danger');
                return res.redirect('/manager/login');
            }

            const isMatch = await bcrypt.compare(password, userExist.password);
            if (!isMatch) {
                req.flash('message', 'Invalid credentials');
                req.flash('messageType', 'danger');
                return res.redirect('/manager/login');
            }

            if (userExist.role !== 'manager') {
                req.flash('message', 'Please use the correct login page for your role');
                req.flash('messageType', 'warning');
                return res.redirect('/manager/login');
            }

            const token = jwt.sign({
                id: userExist._id,
                name: userExist.name,
                email: userExist.email,
                role: userExist.role
            }, process.env.JWT_SECRET, { expiresIn: '1d' });

            res.cookie('token', token, { maxAge: 86400000, httpOnly: true });
            return res.redirect('/manager/dashboard');
        } catch (error) {
            console.log(error.message);
            req.flash('message', 'Unable to sign in. Please try again.');
            req.flash('messageType', 'danger');
            return res.redirect('/manager/login');
        }
    }

    userdashboard(req, res) {
        return res.render('dashboard', {
            user: req.user,
            roleLabel: 'User'
        });
    }

    admindashboard(req, res) {
        return res.render('dashboard', {
            user: req.user,
            roleLabel: 'Admin'
        });
    }

    managerdashboard(req, res) {
        return res.render('dashboard', {
            user: req.user,
            roleLabel: 'Manager'
        });
    }

    logout(req, res) {
        const role = req.user?.role
        res.clearCookie('token')
        if (role === 'admin') return res.redirect('/admin/login')
        if (role === 'manager') return res.redirect('/manager/login')
        return res.redirect('/login')
    }
}

module.exports = new AuthEjsController();
