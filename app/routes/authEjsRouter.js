const express=require('express');
const AuthEjsController = require('../controller/AuthEjsController');
const AuthCheck = require('../middleware/AuthCheck');

const router=express.Router();

router.get('/', (req,res)=>res.redirect('/login'))
router.get('/register',AuthEjsController.register)
router.post('/register/store',AuthEjsController.registerstore)
router.get('/login',AuthEjsController.login)
router.post('/login/store',AuthEjsController.loginstore)
router.get('/user/dashboard',AuthCheck('user'),AuthEjsController.userdashboard);
router.get('/user/logout',AuthCheck('user'),AuthEjsController.logout);

router.get('/admin/login',AuthEjsController.adminlogin)
router.post('/admin/login/store',AuthEjsController.adminloginstore)
router.get('/admin/dashboard',AuthCheck('admin'),AuthEjsController.admindashboard);
router.get('/admin/logout',AuthCheck('admin'),AuthEjsController.logout);

router.get('/manager/login',AuthEjsController.managerlogin)
router.post('/manager/login/store',AuthEjsController.managerloginstore)
router.get('/manager/dashboard',AuthCheck('manager'),AuthEjsController.managerdashboard);
router.get('/manager/logout',AuthCheck('manager'),AuthEjsController.logout);

module.exports=router;