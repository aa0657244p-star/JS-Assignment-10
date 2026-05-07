const { User } = require('../models/associations');

exports.signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = User.build({ name, email, password, role });
        await user.save();
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(400).json({ message: error.errors ? error.errors[0].message : error.message });
    }
};

exports.createOrUpdate = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;
        await User.upsert({
            id: id || null,
            name,
            email,
            role,
            password: 'default123',
            updatedAt: new Date()
        }, { validate: false });
        res.status(200).json({ message: 'User created or updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findByEmail = async (req, res) => {
    try {
        const { email } = req.query;
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.findById = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id, {
            attributes: { exclude: ['role'] }
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};