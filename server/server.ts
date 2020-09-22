import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import mongoose from 'mongoose';
import User from './models/user';
import jwt from 'jsonwebtoken';

// init webserver
import './websocket';
import { JWT_SECRET_TOKEN } from './utilities';

const app = express();


mongoose.connect('mongodb://localhost:27017/codedamn-live');

if (process.env.NODE_ENV !== 'production') {
    app.use(cors());
}

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send('ok');
});

app.post('/api/register', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ status: 'error', error: 'Invalid email/password' });
    }
    try {
        const user = new User({ email, password });
        await user.save()

    } catch (error) {
        console.log(error);
        return res.json({ status: 'error', error: 'Duplicate email' });
    }

    return res.json({ status: 'ok' });
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({ status: 'error', error: 'Invalid email/password' });
    }

    return User.findOne({ email }, (err, _user: any) => {
        if (err) throw err;

        if (_user) {
            _user.comparePassword(password, (_err: any, _match: any) => {
                console.log('IS MATCHED:', _match);
                if (_match && !_err) {
                    const payload = jwt.sign({ email }, JWT_SECRET_TOKEN);
                    return res.json({ status: 'ok', data: payload });
                } else {
                    return res.json({ status: 'error', error: 'Password not matched' });
                }
            });
        } else {
            return res.json({ status: 'error', error: 'User not found' });
        }
    });
});

app.listen(1337);